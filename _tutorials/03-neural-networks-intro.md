---
title: "Neural Networks from One Neuron to a PyTorch MLP Classifier"
subtitle: "One neuron to matrix layer to PyTorch abstraction to an MLP that fits a sine wave, then a real binary classifier on Wisconsin breast cancer data."
description: "Learn neural networks from one neuron to a PyTorch MLP: activations, layers, training loops, sine fitting, binary classification, confusion matrix, and ROC."
image:
  path: /assets/tutorials/03/sine-progression.png
  width: 1672
  height: 436
image_alt: One-neuron and MLP models fitting a sine wave in PyTorch
level: intro
status: published
order: 3
tags: [neural-networks, pytorch, classification, fundamentals]
notebook: notebooks/03-neural-networks.ipynb
runtime: "55 min"
duration: "PT55M"
hook: "See exactly when one neuron fails, why a hidden layer works, and how the same pattern becomes a classifier."
related:
  - title: "PyTorch training loop"
    url: /tutorials/01-ml-training-basics/
    note: "The forward, loss, backward, step pattern this page reuses."
  - title: "CNN feature maps"
    url: /tutorials/04-cnns/
    note: "What changes when layers preserve image structure."
---

The confusing part of neural networks is not the word "neural"; it is
the jump from one weighted sum to a system that can learn curved
decision boundaries. This tutorial keeps that jump small.

A neural network is what you get when you stack a lot of $f(w \cdot x + b)$
neurons and let gradient descent set the weights. We build that stack
one layer at a time, then use the same pattern for a classifier on the
Wisconsin breast-cancer dataset (569 patients, 30 features).

```python
model = nn.Sequential(
    nn.Linear(30, 32),
    nn.ReLU(),
    nn.Dropout(0.2),
    nn.Linear(32, 1)
)
loss = nn.BCEWithLogitsLoss()(model(x), y)
```

<figure class="tutorial-fig">
  <img src="{{ '/assets/tutorials/03/neuron-schematic.png' | relative_url }}"
       alt="Single-neuron diagram on the left, three activation functions on the right">
  <figcaption>Left — a neuron is a weighted sum plus a bias, then a non-linearity. Right — the three activation functions you'll meet most often: sigmoid, tanh, ReLU. The choice matters.</figcaption>
</figure>

## From neuron to layer

A *layer* is many neurons applied to the same input in parallel. One
matrix multiply handles the whole minibatch:

$$\mathbf{Z} = \mathbf{X}\,\mathbf{W} + \mathbf{B}, \qquad \mathbf{A} = f(\mathbf{Z})$$

<figure class="tutorial-fig">
  <img src="{{ '/assets/tutorials/03/layer-matrix.png' | relative_url }}"
       alt="Block diagram: X times W plus B equals Z, then activation gives A">
  <figcaption>A single matmul is enough to compute the forward pass of an entire layer for an entire minibatch.</figcaption>
</figure>

## Capacity matters — what one neuron cannot do

The cleanest demonstration of why we need *multiple* neurons is to try
fitting a sine wave with one. The single neuron can pick the right
range (with tanh) but not the right *shape* — it is a smooth S-curve
and the sine wave wiggles. An MLP with **one** hidden layer of 16
tanh units fits the same data perfectly.

<figure class="tutorial-fig">
  <img src="{{ '/assets/tutorials/03/sine-progression.png' | relative_url }}"
       alt="Three panels: sigmoid neuron, tanh neuron, MLP — each trying to fit a sine wave">
  <figcaption>(a) Sigmoid neuron — squashes outputs to [0, 1], misses the troughs. (b) Tanh neuron — right range, wrong shape, just a smooth ramp. (c) MLP with 16 tanh hidden units — finally fits.</figcaption>
</figure>

<figure class="tutorial-fig">
  <img src="{{ '/assets/tutorials/03/sine-loss-curves.png' | relative_url }}"
       alt="Log-scale loss curves for the three models">
  <figcaption>Log-scale training loss. The MLP plateaus orders of magnitude lower than either single-neuron variant — that gap is what "model capacity" means.</figcaption>
</figure>

## Apply it — Wisconsin breast cancer

Now the MLP machinery becomes a real medical classifier. 30 numerical
features (radius, texture, perimeter, area, smoothness…) per patient,
binary malignant / benign label. The architecture is the same
2-hidden-layer template with dropout; the loss switches from MSE to
**binary cross-entropy**.

<figure class="tutorial-fig">
  <img src="{{ '/assets/tutorials/03/wisconsin-loss.png' | relative_url }}"
       alt="Train and val BCE loss curves across 400 epochs, both falling and staying close">
  <figcaption>Train and val BCE both fall and stay close together — dropout is doing its regularisation job.</figcaption>
</figure>

## Why accuracy alone is dishonest

A 95 %-accurate classifier that misses every cancer is worse than
useless. You always want the **confusion matrix** (where the errors
fall) and the **ROC** (how the trade-off between false-positives and
missed-positives behaves as you sweep the decision threshold).

<figure class="tutorial-fig">
  <img src="{{ '/assets/tutorials/03/confusion-matrix.png' | relative_url }}"
       alt="2x2 confusion matrix on the held-out test set">
  <figcaption>Confusion matrix on the held-out 20 % test set. Off-diagonal cells are the mistakes — the model only misses one malignant sample.</figcaption>
</figure>

<figure class="tutorial-fig">
  <img src="{{ '/assets/tutorials/03/roc.png' | relative_url }}"
       alt="ROC curve with AUC label and random-baseline diagonal">
  <figcaption>ROC. Diagonal would be random; perfect is the top-left corner. AUC summarises the curve in one number.</figcaption>
</figure>

## What's in here

- The single neuron (`f(w · x + b)`), three activation choices
- Matrix formulation of a layer — one matmul per minibatch
- A **manual** gradient-descent training loop with autograd
- The same model rewritten in `nn.Module` — verbose to terse
- Activation matters — sigmoid vs tanh on a sine wave
- Adding a hidden layer — when one neuron isn't enough
- Real-data application: Wisconsin breast-cancer classification
- `BCEWithLogitsLoss` and why it beats `BCE + sigmoid` as two ops
- Confusion matrix + ROC + AUC

## Note on data ethics

The Wisconsin dataset is real but anonymised, 1995-era, and a teaching
standard. Production medical-ML projects need IRB approval, calibration
plots, and uncertainty quantification well beyond a confusion matrix.
This tutorial is for the model and metrics, not for clinical deployment.

## Prerequisites

- [Tutorial 01](/tutorials/01-ml-training-basics/) — the training loop
- [Tutorial 02](/tutorials/02-scikit-learn-intro/) — train/test splits

## Source

Created as teaching-support material while assisting [Dr Sathiskumar Ponnusami](https://www.saponnusami.com/) at the CEMS Lab, Queen Mary University of London (2025). This is my personal open version.

## Next

- [`04 — Convolutional Neural Networks`](/tutorials/04-cnns/) — what
  changes when the input is an image and you need to preserve spatial
  structure.

## References

1. Wolberg &amp; Mangasarian (1990). **Multisurface method of pattern separation for medical diagnosis applied to breast cytology** — the Wisconsin dataset. [doi:10.1073/pnas.87.23.9193](https://doi.org/10.1073/pnas.87.23.9193)
2. Rumelhart, Hinton &amp; Williams (1986). **Learning representations by back-propagating errors.** *Nature* 323. [doi:10.1038/323533a0](https://doi.org/10.1038/323533a0)
3. Karpathy (2022). **The spelled-out intro to neural networks and backpropagation: building micrograd.** [YouTube](https://www.youtube.com/watch?v=VMj-3S1tku0) and [micrograd](https://github.com/karpathy/micrograd)
4. Fawcett (2006). **An introduction to ROC analysis.** [doi:10.1016/j.patrec.2005.10.010](https://doi.org/10.1016/j.patrec.2005.10.010)
