---
title: "Convolutional Neural Networks from Pixels to Feature Maps"
subtitle: "Why MLPs fail on images, what a convolution actually does, and how to read what a trained CNN has learned."
description: "A CNN tutorial from pixels to feature maps: why MLPs fail on images, how convolutions, padding, stride, and pooling work, with CIFAR-10 visualizations."
image:
  path: /assets/tutorials/04/mlp-vs-cnn-cifar.png
  width: 1412
  height: 424
image_alt: MLP versus CNN training loss and test accuracy on CIFAR-10
level: intermediate
status: published
order: 4
tags: [cnn, vision, pytorch, interpretability]
notebook: notebooks/04-cnns.ipynb
runtime: "60 min"
duration: "PT60M"
hook: "Train a small CNN, compare it with an MLP, then open the model and inspect the filters."
related:
  - title: "Neural-network capacity"
    url: /tutorials/03-neural-networks-intro/
    note: "Why hidden units matter before images enter the story."
  - title: "Training and regularisation"
    url: /tutorials/01-ml-training-basics/
    note: "The same validation-loss checks still decide whether the CNN is learning."
---

Flattening an image turns a neighbourhood into a long list. That is the
first reason MLPs struggle with vision: the model has to relearn locality
from scratch for every object, position, and scale.

A CNN is an MLP that **shares weights spatially**. Instead of one weight
per input pixel, you have a 3 × 3 filter that slides across the image.
That single change buys translation equivariance, parameter efficiency,
and a useful inductive bias for any signal where neighbouring values are
correlated: images, audio, time series, physical simulation fields.
Pooling and the later architecture can then trade some of that
equivariance for practical translation invariance.

```python
conv = nn.Conv2d(in_channels=3, out_channels=32,
                 kernel_size=3, padding=1)
y = conv(x)  # [batch, 3, height, width] -> [batch, 32, height, width]
```

This tutorial does CNNs in three movements:

1. **Why we need CNNs at all** — what breaks when you flatten a colour
   image into a 3 072-element vector and hand it to an MLP.
2. **The convolution operation** — kernels, strides, padding, pooling.
   The math is small; the inductive bias is enormous.
3. **A trained CNN, opened up** — visualising the learned filters and
   the feature maps they produce. CNNs are easier to interpret than
   modern ML literature suggests.

The runnable notebook uses sklearn's `load_digits` (1 797 hand-written
8 × 8 grayscale digits) so it finishes in under a minute on CPU. This
page accompanies it with **CIFAR-10 figures** that were pre-rendered
locally — colour images make the lessons land harder.

## CIFAR-10 — the dataset every CNN tutorial uses

<figure class="tutorial-fig">
  <img src="{{ '/assets/tutorials/04/cifar-classes.png' | relative_url }}"
       alt="Grid of 10 CIFAR-10 example images, one per class">
  <figcaption>CIFAR-10 — 10 classes × 6 000 training images, 32 × 32 colour. The standard "harder than MNIST" benchmark for small vision models.</figcaption>
</figure>

## A CNN sees channels, then learns how to mix them

Channels are how a CNN handles colour: the input tensor has shape
`[batch, channels, height, width]` and for an RGB image, **channels = 3**.
The first convolutional layer receives three aligned channel maps and
each learned filter spans all three channels. So the model starts with
RGB as separate input channels, but it immediately learns cross-channel
combinations such as colour edges and opponent-colour blobs.

<figure class="tutorial-fig">
  <img src="{{ '/assets/tutorials/04/rgb-channels.png' | relative_url }}"
       alt="A CIFAR cat image broken into its R, G, and B channels visualised as separate grayscale maps">
  <figcaption>The same image, split into its three colour channels. The cat's eyes are bright in R, the green grass is bright in G, the sky-tinted shadows in B. A learned RGB filter can combine all three at once.</figcaption>
</figure>

## The killer flaw of MLPs on images — flattening

An MLP needs a 1-D input. So before you can feed an image to one, you
**flatten** it from `[C, H, W]` into a single long vector. That destroys
the very thing that makes an image an image.

<figure class="tutorial-fig">
  <img src="{{ '/assets/tutorials/04/flatten-loses-spatial.png' | relative_url }}"
       alt="Side-by-side: a 2D cat image and its 3072-element flattened version as a long thin strip">
  <figcaption>Left — pixels know their neighbours. Right — the same pixels in arbitrary order. The MLP has to learn 2-D spatial structure from scratch, every single time, for every translation of every object.</figcaption>
</figure>

## The other MLP problem — parameter explosion

For a fully-connected first hidden layer with 512 neurons:

| input image | input features | parameters in 1st hidden layer |
|---|---|---|
| 8 × 8 digits (this notebook) | 64 | 33 280 |
| 32 × 32 RGB (CIFAR) | 3 072 | **1 573 376** |
| 224 × 224 RGB (ImageNet) | 150 528 | **77 070 848** |

A CNN's first conv layer with 32 filters of 3 × 3 × 3 has **896
parameters** regardless of image size for that layer. Same weights are
reused everywhere.

<figure class="tutorial-fig">
  <img src="{{ '/assets/tutorials/04/parameter-scaling.png' | relative_url }}"
       alt="Log-scale plot of parameter count vs image side length; MLP grows quadratically, CNN stays flat">
  <figcaption>Parameter count in the first layer as the image grows. A dense MLP scales with pixel count; this convolutional layer stays flat. Production vision models avoid fully connected pixels by adding structure: convolutions, patches, attention, or related tricks.</figcaption>
</figure>

## Empirical verdict: same data, two architectures

We trained both a 3-layer MLP and a 2-conv-block CNN on CIFAR-10 for a
few epochs each. The MLP gets ~52 % test accuracy with **1.7 M
parameters**; the CNN gets ~70 % with **300 k parameters** — six times
smaller and significantly better.

<figure class="tutorial-fig">
  <img src="{{ '/assets/tutorials/04/mlp-vs-cnn-cifar.png' | relative_url }}"
       alt="Two-panel figure: training loss curves for MLP vs CNN on CIFAR; bar chart of test accuracy">
  <figcaption>MLP (red) vs CNN (green) on CIFAR-10. The CNN's loss falls faster <em>and</em> it generalises better, with a fraction of the parameters.</figcaption>
</figure>

<figure class="tutorial-fig">
  <img src="{{ '/assets/tutorials/04/probe-logits.png' | relative_url }}"
       alt="A probe cat image with bar plots of MLP and CNN logits over 10 classes">
  <figcaption>Both models classifying a single held-out cat image. The MLP spreads its confidence — it doesn't really know. The CNN votes hard for the correct class.</figcaption>
</figure>

## What a convolution actually does

A 2-D convolution is a local weighted sum:

$$
\text{output}(i, j)
= \sum_m \sum_n
\text{input}(i + m, j + n)\,
\text{kernel}(m, n).
$$

In words: place a small **kernel** of learnable weights on a patch of
the input, multiply element-wise, sum, write the scalar into the
output. Slide the kernel one step, repeat.

<figure class="tutorial-fig">
  <img src="{{ '/assets/tutorials/04/conv-mechanics.png' | relative_url }}"
       alt="Three panels showing a 5x5 input, a 3x3 vertical-edge kernel, and the resulting 3x3 output">
  <figcaption>One step of a 3 × 3 convolution on a 5 × 5 input. Output size = ⌊(5 − 3) / 1⌋ + 1 = 3. The kernel here is a vertical-edge detector; the output's columns reflect column differences in the input.</figcaption>
</figure>

<div class="tutorial-interactive">
  <iframe class="tutorial-tall"
          src="{{ '/assets/tutorials/04/conv-playground.html' | relative_url }}"
          loading="lazy"
          title="Interactive convolution playground"></iframe>
</div>

### Padding and stride

- **Padding**: add zero-pixels around the input border so the output
  stays the same size as the input ("same" convolution). Without it,
  every conv shrinks the spatial dims by `kernel_size - 1`.
- **Stride**: how far the kernel jumps each step. Stride 2 halves the
  output dimensions — a cheap form of downsampling.

<figure class="tutorial-fig">
  <img src="{{ '/assets/tutorials/04/padding-stride.png' | relative_url }}"
       alt="Three side-by-side configurations of padding and stride showing input and output grid sizes">
  <figcaption>Three common combinations. The general output-size formula is <code>n_out = ⌊(n + 2·pad − k) / s⌋ + 1</code> — memorise this; you'll use it every time you sketch an architecture.</figcaption>
</figure>

## Pooling — controlled downsampling

After each convolution, we typically halve the spatial dimensions with
a **pooling** layer. Max pooling keeps the strongest activation in each
window and discards the rest; average pooling smooths.

<figure class="tutorial-fig">
  <img src="{{ '/assets/tutorials/04/pooling-types.png' | relative_url }}"
       alt="A 4x4 input grid reduced by max-pool 2x2 to a 2x2 grid alongside average-pool result">
  <figcaption>2 × 2 pooling with stride 2 halves each spatial dimension. Max-pool keeps the highest activation; avg-pool smooths.</figcaption>
</figure>

## The trained CNN, opened up

CNNs are interpretable when they're small. **Each 3 × 3 filter in
`conv1` ends up as an edge detector at some orientation**, plus a few
blob/colour detectors. This is the same finding from the cat visual
cortex experiments that originally motivated CNNs.

<figure class="tutorial-fig">
  <img src="{{ '/assets/tutorials/04/cnn-filters-cifar.png' | relative_url }}"
       alt="Grid of 32 learned 3x3 RGB filters from the first conv layer of the CIFAR-trained CNN">
  <figcaption>All 32 learned <code>conv1</code> filters from the CIFAR-trained CNN. Each tile is a 3 × 3 × 3 RGB pattern. You can spot colour-blob detectors (uniform tiles), edge detectors (split tiles), and a few opponent-colour detectors.</figcaption>
</figure>

<figure class="tutorial-fig">
  <img src="{{ '/assets/tutorials/04/cnn-featuremaps-cifar.png' | relative_url }}"
       alt="Grid of 32 feature maps from the first conv layer applied to a CIFAR cat image">
  <figcaption>The same 32 filters applied to a single cat image. Each panel is one filter's response across the whole input — they highlight different strokes, edges, and colour regions. The spatial layout is preserved, which is why these are <em>localizable</em>.</figcaption>
</figure>

The notebook's 8 × 8 digit version of the same interpretation:

<figure class="tutorial-fig">
  <img src="{{ '/assets/tutorials/04/digits-filters.png' | relative_url }}"
       alt="Eight 3x3 grayscale conv1 filters from the digit-trained CNN">
  <figcaption>The eight filters from the runnable notebook (trained on 8 × 8 digits in 60 s). Coarser than the CIFAR version but the same story.</figcaption>
</figure>

<figure class="tutorial-fig">
  <img src="{{ '/assets/tutorials/04/digits-featuremaps.png' | relative_url }}"
       alt="Eight feature maps + the input digit they came from">
  <figcaption>Their feature maps on one held-out digit.</figcaption>
</figure>

## What's in here

- Why MLPs flatten the spatial structure of images and pay for it twice
  (lost locality + parameter explosion)
- The convolution operation with the output-size formula
- Padding, stride, and pooling — the three knobs every CNN turns
- A 2-conv-block CNN built in ~30 lines of PyTorch
- The interpretability story — learned filters as edge / colour
  detectors, feature maps as their responses
- Side-by-side MLP-vs-CNN training on CIFAR-10 with concrete parameter
  and accuracy numbers
- What changes for real-world datasets (batch norm, augmentation,
  pretrained backbones)

## Prerequisites

- [Tutorial 03](/tutorials/03-neural-networks-intro/) — the PyTorch
  training loop
- Comfort with image tensor shapes `[N, C, H, W]`

## Next

- [`05 — Physics-Informed Neural Networks`](/tutorials/05-pinns/) — what
  changes when the loss function knows physics, and how that opens up
  inverse problems and differentiable simulation.

## References

1. Hubel &amp; Wiesel (1962). **Receptive fields in the cat's visual cortex.** [doi:10.1113/jphysiol.1962.sp006837](https://doi.org/10.1113/jphysiol.1962.sp006837)
2. LeCun et al. (1998). **Gradient-based learning applied to document recognition** (LeNet). [doi:10.1109/5.726791](https://doi.org/10.1109/5.726791)
3. Krizhevsky, Sutskever &amp; Hinton (2012). **ImageNet classification with deep CNNs** (AlexNet). [paper](https://papers.nips.cc/paper/2012/hash/c399862d3b9d6b76c8436e924a68c45b-Abstract.html)
4. Zeiler &amp; Fergus (2014). **Visualizing and understanding convolutional networks.** [arXiv:1311.2901](https://arxiv.org/abs/1311.2901)
