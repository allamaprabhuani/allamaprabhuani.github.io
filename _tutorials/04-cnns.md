---
title: "Convolutional Neural Networks"
subtitle: "Convolutions, pooling, receptive fields. Build a CNN that classifies images, then read what it actually learned."
level: intermediate
status: published
order: 4
tags: [cnn, vision, pytorch]
notebook: notebooks/04-cnns.ipynb
---

A CNN is an MLP that **shares weights spatially**. Instead of one weight
per input pixel, you have a 3×3 filter that slides across the image. That
single change buys you translation invariance, parameter efficiency, and
a useful inductive bias for any signal where neighbouring values are
correlated — images, audio, time series, physical simulation fields.

We build a 2-conv-block CNN on sklearn's 8×8 digit dataset (1 797 images,
no download), train it in 60 s on CPU, then crack it open and look at
what each filter actually learned.

<figure class="tutorial-fig">
  <img src="{{ '/assets/tutorials/04/architecture.png' | relative_url }}"
       alt="Block diagram of SmallCNN: Conv-Pool-Conv-Pool-FC-FC">
  <figcaption>SmallCNN: two convolution-and-pool blocks followed by a fully-connected head. Same architecture template as the original LeNet, just scaled to 8×8 input.</figcaption>
</figure>

## The model converges fast

<figure class="tutorial-fig">
  <img src="{{ '/assets/tutorials/04/training-curve.png' | relative_url }}"
       alt="Training loss falling and validation accuracy climbing toward 1.0 over 60 epochs">
  <figcaption>Loss falls smoothly; test accuracy climbs to &gt; 98 % in under a minute on CPU.</figcaption>
</figure>

## Open it up — the learned filters

CNNs are interpretable when they're small. Each 3×3 filter in `conv1`
ends up as an **edge detector** at some orientation, plus a couple of
blob detectors. This is exactly the cat-visual-cortex finding that
motivated CNNs in the first place (Hubel &amp; Wiesel, 1962).

<figure class="tutorial-fig">
  <img src="{{ '/assets/tutorials/04/learned-filters.png' | relative_url }}"
       alt="Eight 3x3 learned convolutional filters visualised as red-blue images">
  <figcaption>The 8 learned filters in <code>conv1</code>. Red = positive weight, blue = negative. Most are oriented edge detectors.</figcaption>
</figure>

## What the filters fire on

<figure class="tutorial-fig">
  <img src="{{ '/assets/tutorials/04/feature-maps.png' | relative_url }}"
       alt="Input digit on the left, eight feature maps showing where each filter activated">
  <figcaption>Apply the same 8 filters to one input digit. Each filter highlights a different stroke — diagonal, vertical, the centre, the gap.</figcaption>
</figure>

## Sample predictions

<figure class="tutorial-fig">
  <img src="{{ '/assets/tutorials/04/sample-predictions.png' | relative_url }}"
       alt="Grid of 16 digit images with predicted and true labels">
  <figcaption>16 random held-out digits with predictions. Green = correct, red = wrong. The mistakes are usually ambiguous digits even a human would hesitate on.</figcaption>
</figure>

## What's in here

- What a 2D convolution does to an image, with pictures
- Pooling: max vs average, when each one is the right call
- A 2-conv-block CNN in PyTorch, trained in 60 s
- **Visualising learned filters and feature maps** — interpretability for free
- What changes when you move from 8×8 to 224×224 ImageNet
- The case for fine-tuning a pretrained backbone instead of training from scratch

## Prerequisites

- [Tutorial 03](/tutorials/03-neural-networks-intro/) — the MLP training loop
- A bit of comfort with image tensors (shape `[N, C, H, W]`)

## Source

Pedagogy adapted from the `CNN_final` teaching notebook I built while
assisting [Dr Sathiskumar Ponnusami](https://www.saponnusami.com/) in his
Machine Learning short course at Queen Mary University of London (2025);
rebuilt here as a focused PyTorch tutorial with interpretability visuals
as the centrepiece.

## Next

- [`05 — Physics-Informed Neural Networks`](/tutorials/05-pinns/) — what
  changes when the loss function knows physics, and how that opens up
  inverse problems and differentiable simulation.
