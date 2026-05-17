---
title: "Introduction to Neural Networks"
subtitle: "One neuron → matrix layer → manual gradient descent → PyTorch abstraction → MLP that fits a sine → real binary classifier on Wisconsin breast cancer data."
level: intro
status: published
order: 3
tags: [neural-networks, pytorch, classification, fundamentals]
notebook: notebooks/03-neural-networks.ipynb
---

A neural network is what you get when you stack a lot of $f(w \cdot x + b)$
neurons and let gradient descent set the weights. This tutorial walks
the whole construction — phase by phase — and finishes with a working
classifier on the Wisconsin breast-cancer dataset (569 patients,
30 features).

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

Adapted from teaching notes co-developed with [Dr S. Ponnusami](https://www.saponnusami.com/) (2025).

## Next

- [`04 — Convolutional Neural Networks`](/tutorials/04-cnns/) — what
  changes when the input is an image and you need translation invariance.

## References

1. Wolberg &amp; Mangasarian (1990). **Multisurface method of pattern separation for medical diagnosis applied to breast cytology** — the Wisconsin dataset. [doi:10.1073/pnas.87.23.9193](https://doi.org/10.1073/pnas.87.23.9193)
2. Rumelhart, Hinton &amp; Williams (1986). **Learning representations by back-propagating errors.** *Nature* 323. [doi:10.1038/323533a0](https://doi.org/10.1038/323533a0)
3. Fawcett (2006). **An introduction to ROC analysis.** [doi:10.1016/j.patrec.2005.10.010](https://doi.org/10.1016/j.patrec.2005.10.010)
