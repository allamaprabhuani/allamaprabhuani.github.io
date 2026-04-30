---
title: "Introduction to Neural Networks"
subtitle: "Build a 2-layer network in NumPy, then the same thing in PyTorch. Backprop, by hand, once."
level: intro
status: coming-soon
order: 3
tags: [neural-networks, pytorch, numpy, backprop]
---

The point of this tutorial is to demystify backpropagation by writing it out, by hand, once.
After that, every framework feels obvious.

## What's in here

- the perceptron, in two lines
- a 2-layer network in NumPy: forward pass, loss, backward pass, weight update
- the same network in PyTorch — what `loss.backward()` actually does
- activation functions: ReLU vs tanh vs sigmoid, when each one breaks
- weight initialisation: why "all zeros" silently fails
- minibatching and learning-rate schedules

## Prerequisites

- Tutorials 1 + 2 recommended
- A bit of linear algebra (matrix multiply)
