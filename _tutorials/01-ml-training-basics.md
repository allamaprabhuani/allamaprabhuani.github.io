---
title: "Machine Learning Training, from scratch"
subtitle: "Train/val/test splits, loss curves, overfitting, regularisation, the things every ML course glosses over."
level: intro
status: coming-soon
order: 1
tags: [ml, training, fundamentals]
# Once the notebook is ready, set:
# notebook: notebooks/01-ml-training.ipynb
# rendered: ../notebooks/01-ml-training.html
---

A from-scratch tour of how a model actually learns. We start from one feature and one weight,
hand-derive the gradient, then build up to an honest `train()` loop.

## What's in here

- the train / validation / test split, and why a single split is dangerous
- writing a training loop in pure NumPy (no `model.fit`)
- reading a loss curve: when to stop, when to worry
- overfitting in three lines of code, and three regularisation knobs that fix it
- early stopping vs L2 vs dropout — when each one is the right tool

## Prerequisites

- Python (you've written a `for` loop)
- Comfortable with NumPy arrays
- High-school calculus (we use one chain rule)
