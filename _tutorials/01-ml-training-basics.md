---
title: "Machine Learning Training from Scratch: Loss, Gradients, and Overfitting"
subtitle: "Hand-derive the gradient, write the training loop in NumPy, then again in PyTorch. Watch a deliberately oversized model overfit, then fix it three ways."
description: "Learn machine learning training from scratch: derive MSE gradients, write NumPy and PyTorch training loops, read loss curves, and fix overfitting."
image:
  path: /assets/tutorials/01/hero-fit.png
  width: 892
  height: 476
image_alt: Noisy sine data with train and validation split and a trained MLP fit
level: intro
status: published
order: 1
tags: [ml, training, fundamentals, pytorch]
notebook: notebooks/01-ml-training.ipynb
runtime: "45 min"
duration: "PT45M"
hook: "Reproduce the classic train-loss-down, validation-loss-up overfitting curve and learn what fixes it."
related:
  - title: "Bias-variance in scikit-learn"
    url: /tutorials/02-scikit-learn-intro/
    note: "The same overfitting story in a tabular regression workflow."
  - title: "Autograd inside PINNs"
    url: /tutorials/05-pinns/
    note: "The same backward pass, now used to differentiate physics residuals."
---

Most beginner ML code hides the only thing you really need to understand:
why the weights move. `loss.backward()` looks like a magic spell until
you have derived one gradient by hand and watched it update a parameter.

This tutorial makes that update visible. We start with one-parameter
regression, write the training loop in NumPy, then let PyTorch autograd
do the same job. The second half is the failure mode every useful model
eventually hits: training loss keeps falling while validation loss turns
around and climbs.

```python
for xb, yb in train_loader:
    pred = model(xb)
    loss = loss_fn(pred, yb)
    optimizer.zero_grad()
    loss.backward()
    optimizer.step()
```

<figure class="tutorial-fig">
  <img src="{{ '/assets/tutorials/01/hero-fit.png' | relative_url }}"
       alt="Noisy sine data with train/val split and a trained MLP fit">
  <figcaption>Train (blue), val (red), true sin(x) (dashed), and the model after 3 000 epochs of training with L2 weight decay.</figcaption>
</figure>

## Try it before you read it

Drag the slider, hit play, and watch a deliberately over-large network
follow the data — past the point where it starts memorising the noise.

<div class="tutorial-interactive">
  <iframe src="{{ '/assets/tutorials/01/fit-interactive.html' | relative_url }}"
          loading="lazy"
          title="Interactive overfit demo"></iframe>
</div>

## The loss landscape

For a linear model `ŷ = w·x + b` with mean-squared-error loss, fixing
`b` and sweeping `w` traces out a parabola. The minimum is the best
slope. Gradient descent's job is to slide down it.

<figure class="tutorial-fig">
  <img src="{{ '/assets/tutorials/01/loss-landscape.png' | relative_url }}"
       alt="MSE vs slope w on a 1-D parameter slice, with the minimum marked">
  <figcaption>1-D slice of the MSE loss surface, with the minimising slope marked. For multi-parameter models the picture is high-dimensional but the gradient still points downhill.</figcaption>
</figure>

## Reading a loss curve

If you take only one thing from this tutorial, take this: **a loss
curve with only the train line is a lie**. Train loss falling means
the optimiser is doing its job. Val loss is the only readout that
tells you whether the model is *learning* or just *memorising*.

<figure class="tutorial-fig">
  <img src="{{ '/assets/tutorials/01/loss-overfit.png' | relative_url }}"
       alt="Log-scale loss curves showing train falling while val climbs after a few hundred epochs">
  <figcaption>Classic overfitting. Train MSE keeps falling; val MSE bottoms out then climbs. The dashed line is the early-stop point.</figcaption>
</figure>

## Three knobs that fix overfitting

<figure class="tutorial-fig">
  <img src="{{ '/assets/tutorials/01/loss-regularisation.png' | relative_url }}"
       alt="Validation loss with no regularisation, L2 weight decay, and dropout">
  <figcaption>Three regularisers on the same model and data. L2 wins on this problem; dropout under-trains slightly at this rate; no-reg overfits.</figcaption>
</figure>

## Watch the model find the function

<figure class="tutorial-fig">
  <img src="{{ '/assets/tutorials/01/fit-evolution.gif' | relative_url }}"
       alt="Animated GIF of the MLP prediction over 2 800 training epochs">
  <figcaption>One frame every 40 epochs. The model recovers the sine in roughly the first 200 epochs and then begins following noise.</figcaption>
</figure>

## What's in here

- The MSE loss landscape, drawn as a 1-D slice
- The gradient of MSE, derived by hand
- A NumPy training loop, then the same loop in PyTorch using autograd
- The five-line training pattern (forward → loss → zero → backward → step)
  that every PyTorch model in this series uses
- A deliberate overfit on a 5-hidden-layer, 128-wide MLP
- Three regularisers — early stopping, L2 weight decay, dropout — compared
- `torch.save` / `torch.load` patterns that decouple weights from code

## Prerequisites

- Python (you've written a `for` loop)
- NumPy arrays
- High-school calculus (one chain rule)

## Source

Adapted from teaching notes co-developed with [Dr S. Ponnusami](https://www.saponnusami.com/) (2025).

## Next

- [`02 — scikit-learn intro`](/tutorials/02-scikit-learn-intro/) — the
  classical tabular-ML workflow any PyTorch training loop also needs.
- [`05 — physics-informed neural networks`](/tutorials/05-pinns/) — what
  changes when the loss function knows physics.

## References

1. Srivastava, Hinton et al. (2014). **Dropout.** *JMLR* 15(56). [JMLR](https://jmlr.org/papers/v15/srivastava14a.html)
2. Kingma &amp; Ba (2015). **Adam: A method for stochastic optimization.** [arXiv:1412.6980](https://arxiv.org/abs/1412.6980)
3. Goodfellow, Bengio &amp; Courville (2016). **Deep Learning** (MIT Press), chs 7–8. [deeplearningbook.org](https://www.deeplearningbook.org/)
