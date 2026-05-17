---
title: "Physics-Informed Neural Networks (PINNs)"
subtitle: "Data, physics, or both? The Moseley-style framing on a damped oscillator, then the bridge to inverse problems and neural operators."
level: advanced
status: published
order: 5
tags: [pinn, physics, pytorch, autograd, scientific-ml]
notebook: notebooks/05-pinns.ipynb
---

A PINN is a neural network with a **physics term in the loss**. That's the
whole idea. The rest is engineering: what to put in the loss, how to weight
it, and why your first PINN will train to a flat function unless you do a
few specific things.

This tutorial follows the framing made famous by [Ben Moseley's PINN blog
post](https://benmoseley.blog/my-research/so-what-is-a-physics-informed-neural-network/):
pick a problem with a known exact solution, give yourself a small window of
noisy data, and watch three models behave very differently when you ask
them to predict the future.

<figure class="tutorial-fig">
  <img src="{{ '/assets/tutorials/05/hero-three-models.png' | relative_url }}"
       alt="Three side-by-side panels comparing a data-only NN, a physics-only PINN, and a hybrid PINN extrapolating a damped oscillator">
  <figcaption>Same network architecture, same 12 noisy points (yellow region). The data-only NN flatlines outside its training window; the physics-only PINN gets the dynamics; the hybrid does both.</figcaption>
</figure>

## Try it before you read it

Slide through training epochs and watch the **hybrid PINN** find the
oscillation. The yellow region is where it has data; everything to the
right is extrapolation.

<div class="tutorial-interactive">
  <iframe src="{{ '/assets/tutorials/05/training-interactive.html' | relative_url }}"
          loading="lazy"
          title="Interactive PINN training"></iframe>
</div>

## The setup

Light underdamped oscillator, $\omega_0 = 4\pi$, $\zeta = 0.05$. 12 noisy
observations in $t \in [0, 0.4]$. The exact solution is a decaying cosine —
which lets us measure error directly across the full window $t \in [0, 1]$.

<figure class="tutorial-fig">
  <img src="{{ '/assets/tutorials/05/setup.png' | relative_url }}"
       alt="The damped oscillator with the 12 noisy data points and the training window highlighted">
  <figcaption>The data we get to see (red dots, yellow region) vs the truth (blue line). Everything past 0.4 is extrapolation.</figcaption>
</figure>

## The extrapolation tax

If you only care about one figure on this page, make it this one. **Plain
NNs diverge the moment the data runs out.** Pure PINNs are stable but slow.
Hybrid (data + physics) gives error a couple orders of magnitude lower
than either, across the whole window.

<figure class="tutorial-fig">
  <img src="{{ '/assets/tutorials/05/error-comparison.png' | relative_url }}"
       alt="Absolute error vs t for NN, PINN, hybrid on log scale; NN explodes after 0.4">
  <figcaption>Log-scale absolute error. The NN's curve hockey-sticks the second extrapolation begins.</figcaption>
</figure>

## Watch the hybrid learn

<figure class="tutorial-fig">
  <img src="{{ '/assets/tutorials/05/training-evolution.gif' | relative_url }}"
       alt="Animated GIF of the hybrid PINN converging over training epochs">
  <figcaption>Hybrid PINN over 5 000 Adam steps. One frame every 120 epochs. Starts random, finds the data, then the physics term pulls the rest of the curve into shape.</figcaption>
</figure>

## What's in here

- The damped-harmonic-oscillator ODE, with the exact solution for ground truth
- A 12-point noisy dataset that only covers the *easy* part of the trajectory
- Three models, same architecture: **NN (data only)**, **PINN (physics only)**, **hybrid (data + physics)**
- The `torch.autograd.grad` recipe for higher-order PDE residuals
- Soft initial conditions, loss balancing, and the activation-function rule that bites everyone once
- A pointer at **inverse problems** — recover the unknown $\omega_0$ and $\zeta$ from the same 12 points
- A pointer at **neural operators** — what comes when one trained model needs to solve a *family* of problems

## Why this matters for my own research

Once your forward solver is end-to-end differentiable, the PDE coefficients
become *trainable parameters*. The same autograd machinery that solves a
toy oscillator is what
[`torch_pf_solver`](https://github.com/allamaprabhuani/torch_pf_solver)
uses to recover material toughness $G_c$ from a handful of displacement
observations of a real cracked specimen — differentiable phase-field
fracture, adjoint + autograd + checkpoint. The math gets harder
(non-convex energy, irreversibility, operator-split stability) but the
autograd pattern is identical to what's in this notebook.

## Where to go after PINNs

A PINN trains **one network for one problem**. Change a coefficient or a
geometry, you retrain. Neural operators learn the *solution map* — same
model handles a whole family of inputs in milliseconds:

- [**DeepONet**](https://arxiv.org/abs/1910.03193) (Lu &amp; Karniadakis, 2019)
- [**Fourier Neural Operator (FNO)**](https://arxiv.org/abs/2010.08895)
  (Li, Anandkumar et al., 2020)
- [Siddhartha Mishra's CIRM lecture series](https://www.youtube.com/watch?v=5CnctvgyssU)
  derives the theory from scratch — the recommended next watch after this
  tutorial.

## Prerequisites

- [Tutorial 03](/tutorials/03-neural-networks-intro/) — the PyTorch
  training loop
- Some familiarity with ODEs / PDEs — knowing what a damped oscillator
  describes is enough; PDE experience is a bonus, not required

## Source

Original tutorial. Framing inspired by [Ben
Moseley](https://benmoseley.blog/my-research/so-what-is-a-physics-informed-neural-network/);
"what comes next" pointers from Mishra's CIRM operator-learning lectures.

## End of series

That's all five tutorials. [Back to the series →](/tutorials/)
