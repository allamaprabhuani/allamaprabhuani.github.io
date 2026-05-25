---
title: "PINN Tutorial in PyTorch: Damped Oscillator, Autograd, and Inverse Problems"
subtitle: "Data, physics, or both? A damped oscillator compares all three on the same architecture, then bridges to inverse problems and neural operators."
description: "A PyTorch PINN tutorial using a damped oscillator: compare data-only, physics-only, and hybrid models; use autograd for derivatives; connect to inverse problems."
image:
  path: /assets/tutorials/05/hero-three-models.png
  width: 1737
  height: 513
image_alt: Data-only neural network, physics-only PINN, and hybrid PINN on a damped oscillator
level: advanced
status: published
order: 5
tags: [pinn, physics, pytorch, autograd, scientific-ml]
notebook: notebooks/05-pinns.ipynb
runtime: "70 min"
duration: "PT70M"
hook: "Use torch.autograd.grad to make a neural network obey an ODE, then turn the same idea into an inverse problem."
related:
  - title: "PyTorch autograd basics"
    url: /tutorials/01-ml-training-basics/
    note: "Start here if torch.autograd.grad feels like a black box."
  - title: "Neural networks as function approximators"
    url: /tutorials/03-neural-networks-intro/
    note: "The same MLP architecture before physics enters the loss."
---

The failure mode that makes PINNs interesting is extrapolation. A plain
neural network can fit the data you showed it and still become useless
the moment you ask what happens next.

A PINN is a neural network with a **physics term in the loss**. That's the
whole idea. The rest is engineering: what to put in the loss, how to weight
it, and why your first PINN will train to a flat function unless you do a
few specific things.

```python
t = t.requires_grad_(True)
u = model(t)
du_dt = torch.autograd.grad(u, t, torch.ones_like(u),
                            create_graph=True)[0]
d2u_dt2 = torch.autograd.grad(du_dt, t, torch.ones_like(du_dt),
                              create_graph=True)[0]
residual = d2u_dt2 + 2 * zeta * omega0 * du_dt + omega0**2 * u
physics_loss = (residual ** 2).mean()
```

The setup: pick a problem with a known exact solution, give yourself a
small window of noisy data, then watch three models behave very
differently when you ask them to predict the future. The damped-oscillator
worked example below is directly inspired by Ben Moseley's
[introductory PINN tutorial](https://benmoseley.blog/my-research/so-what-is-a-physics-informed-neural-network/);
the structure and core demo are his — go read the original.

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

Light underdamped oscillator, $\omega_0 = 2\pi$ (period 1, one full cycle
in the window) and $\zeta = 0.05$. 12 noisy observations in
$t \in [0, 0.4]$. The exact solution is a decaying cosine — which lets us
measure error directly across the full window $t \in [0, 1]$.

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

There is a clean inversion of the workflow you just did. We **gave** the
network the equation and asked it to find the function. You can also
**give** it the function (some experimental measurements) and ask it to
find the equation — specifically, the *coefficients* of the equation.

Treat $\omega_0$ and $\zeta$ as `torch.nn.Parameter`s and put them into
the optimiser alongside the network weights. PyTorch's autograd will
backpropagate the data-loss gradient all the way through the physics
residual to those two parameters. This is called an **inverse problem**,
and it's the engineering version of the "discover the laws of physics
from data" pitch.

This is the bridge between toy PINNs like this one and my own research
on [`torch_pf_solver`](https://github.com/allamaprabhuani/torch_pf_solver)
— a PyTorch fracture-mechanics solver where the unknown isn't $\omega_0$
but the material toughness $G_c$, recovered from a handful of
displacement observations of a real cracked specimen. The maths is
genuinely harder (the energy is non-convex, damage cannot heal, the
time-stepping is conditionally stable) but the autograd pattern is
literally what you wrote above.

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

## Source

Created by Allamaprabhu Ani while assisting [Dr Sathiskumar Ponnusami](https://www.saponnusami.com/) with teaching at Queen Mary University of London (2025). The notebook and explanation on this page are authored and maintained by me. The damped-oscillator PINN demo is adapted from [Ben Moseley's introductory PINN tutorial](https://benmoseley.blog/my-research/so-what-is-a-physics-informed-neural-network/).

## Prerequisites

- [Tutorial 03](/tutorials/03-neural-networks-intro/) — the PyTorch
  training loop
- Some familiarity with ODEs / PDEs — knowing what a damped oscillator
  describes is enough; PDE experience is a bonus, not required

## References

1. Raissi, Perdikaris &amp; Karniadakis (2019). **Physics-informed neural networks.** *J. Comp. Physics* 378. [doi:10.1016/j.jcp.2018.10.045](https://doi.org/10.1016/j.jcp.2018.10.045)
2. Moseley (2021). **So, what is a physics-informed neural network?** [benmoseley.blog](https://benmoseley.blog/my-research/so-what-is-a-physics-informed-neural-network/) — the tutorial this notebook's damped-oscillator demo is built around.
3. Krishnapriyan et al. (2021). **Characterizing possible failure modes in PINNs.** [arXiv:2109.01050](https://arxiv.org/abs/2109.01050)
4. Lu, Jin et al. (2021). **DeepONet.** *Nat Machine Intelligence* 3. [arXiv:1910.03193](https://arxiv.org/abs/1910.03193)
5. Mishra (2024). **Learning operators — CIRM lecture series.** [YouTube](https://www.youtube.com/watch?v=5CnctvgyssU) — recommended next watch.

## End of series

That's all five tutorials. [Back to the series →](/tutorials/)
