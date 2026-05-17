---
title: "Introduction to Neural Networks"
subtitle: "Build a binary classifier in PyTorch on real medical data. Confusion matrix and ROC, the two plots every classifier ships with."
level: intro
status: published
order: 3
tags: [neural-networks, pytorch, classification, medical]
notebook: notebooks/03-neural-networks.ipynb
---

A neuron computes `f(w·x + b)`. That's the entire model. A *network* is just
many neurons composed in layers. Once you've seen one neuron, the rest is
shape and bookkeeping.

This tutorial builds a binary classifier on the **Wisconsin breast-cancer
dataset** (569 patients, 30 features) — the standard medical benchmark
since 1995. We end with a confusion matrix and an ROC curve, because
accuracy alone is the worst metric you can pick for clinical data.

<figure class="tutorial-fig">
  <img src="{{ '/assets/tutorials/03/neuron-activations.png' | relative_url }}"
       alt="Schematic of a single neuron next to common activation functions">
  <figcaption>Left — a neuron is a weighted sum followed by a nonlinearity. Right — the three activations you'll meet most often: tanh, ReLU, sigmoid.</figcaption>
</figure>

## The training curve

<figure class="tutorial-fig">
  <img src="{{ '/assets/tutorials/03/loss-curves.png' | relative_url }}"
       alt="BCE loss curves for train and validation across 400 epochs">
  <figcaption>A 2-hidden-layer MLP with dropout converges in seconds on CPU. The train/val curves stay close — dropout is doing its job.</figcaption>
</figure>

## Why accuracy alone is dishonest

A 95 %-accurate classifier that misses every cancer is worse than useless.
You always want the **confusion matrix** (where the errors fall) and the
**ROC** (how the trade-off between false-positives and missed-positives
behaves as you sweep the decision threshold).

<figure class="tutorial-fig">
  <img src="{{ '/assets/tutorials/03/confusion-matrix.png' | relative_url }}"
       alt="2x2 confusion matrix on test set">
  <figcaption>Confusion matrix on the held-out 20 % test set. Off-diagonal cells are the mistakes — the model only misses one malignant sample.</figcaption>
</figure>

<figure class="tutorial-fig">
  <img src="{{ '/assets/tutorials/03/roc.png' | relative_url }}"
       alt="ROC curve with AUC label">
  <figcaption>ROC. Diagonal would be random; perfect is the top-left corner. AUC summarises the curve in one number.</figcaption>
</figure>

## What's in here

- A single neuron, by hand, with three activation choices
- Standardising features with `StandardScaler` before training
- A 2-hidden-layer MLP with dropout in PyTorch
- `BCEWithLogitsLoss` and why it beats `BCE + sigmoid` as two ops
- Confusion matrix + ROC + AUC
- The three swaps to extend this to multi-class (CIFAR, MNIST)

## Prerequisites

- [Tutorial 01](/tutorials/01-ml-training-basics/) — the training loop
- [Tutorial 02](/tutorials/02-scikit-learn-intro/) — train/test splits and scaling

## Note on data ethics

The Wisconsin dataset is real but anonymised, 1995-era, and a teaching
standard. Production medical-ML projects need IRB approval, calibration
plots, and uncertainty quantification well beyond a confusion matrix. This
tutorial is for the model and metrics, not clinical deployment.

## Source

Pedagogy adapted from the QMUL `BiomedicalClassification` teaching notebook;
rebuilt as a focused PyTorch tutorial.

## Next

- [`04 — Convolutional Neural Networks`](/tutorials/04-cnns/) — what
  changes when the input is an image and you want translation invariance.
