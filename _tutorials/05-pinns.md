---
title: "Physics-Informed Neural Networks (PINNs)"
subtitle: "Putting a PDE into the loss function. The idea, the gotchas, and a working example for the heat equation."
level: advanced
status: coming-soon
order: 5
tags: [pinn, physics, pytorch, pde]
---

A PINN is a neural network with a physics term in the loss. That's the whole idea; the rest is engineering.
This tutorial is about the engineering — what to put in the loss, how to weight it, and why your first PINN
will train to a flat function unless you do a few specific things.

## What's in here

- the residual loss: what `nabla u - f = 0` looks like as a PyTorch loss term
- soft vs hard boundary conditions
- a working PINN for the 1D heat equation, end to end
- why naïve PINNs collapse to a constant — and three fixes (loss balancing,
  causal training, NTK reweighting)
- when PINNs are the right tool, and when a finite-element solver wins
- pointers to the modern PINN literature (and what's hype)

## Prerequisites

- Tutorial 3 (NN intro)
- Some familiarity with PDEs — knowing what the heat equation describes is enough
