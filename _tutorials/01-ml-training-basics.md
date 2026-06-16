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

<nav class="tutorial-mini-toc" aria-label="In this tutorial">
  <p>In this tutorial</p>
  <ol>
    <li><a href="#the-gradient-by-hand">derive one gradient by hand</a></li>
    <li><a href="#from-the-derivative-to-code">turn the derivative into code</a></li>
    <li><a href="#video-explainers-layer-forward-pass">watch the layer forward pass</a></li>
    <li><a href="#try-the-layer-yourself">try the layer calculation yourself</a></li>
    <li><a href="#reading-a-loss-curve">read train and validation loss curves</a></li>
  </ol>
</nav>

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

## The gradient by hand

Before writing code, it is useful to see one update without autograd. Suppose
the model is a line,

\[
\hat{y} = w x + b.
\]

and the loss is mean squared error,

\[
\mathcal{L}(w,b) = \frac{1}{N}\sum_{i=1}^{N}(\hat{y}_i-y_i)^2
= \frac{1}{N}\sum_{i=1}^{N}(w x_i+b-y_i)^2 .
\]

Let \(e_i = \hat{y}_i-y_i\). The chain rule gives

\[
\frac{\partial \mathcal{L}}{\partial w}
= \frac{2}{N}\sum_{i=1}^{N} e_i x_i,
\qquad
\frac{\partial \mathcal{L}}{\partial b}
= \frac{2}{N}\sum_{i=1}^{N} e_i .
\]

Gradient descent then moves in the opposite direction to the gradient:

\[
w \leftarrow w-\alpha\frac{\partial\mathcal{L}}{\partial w},
\qquad
b \leftarrow b-\alpha\frac{\partial\mathcal{L}}{\partial b}.
\]

The learning rate \(\alpha\) controls the step size. If it is too small,
training crawls; if it is too large, the update can jump over the minimum.

## From the derivative to code

In NumPy, the forward pass and the two derivatives have to be written
explicitly:

```python
for epoch in range(100):
    y_pred = w * x + b

    error = y_pred - y
    loss = (error ** 2).mean()

    grad_w = 2 * (error * x).mean()
    grad_b = 2 * error.mean()

    w -= learning_rate * grad_w
    b -= learning_rate * grad_b
```

For a deep network, writing every derivative by hand is not practical.
PyTorch records the forward computation and applies the chain rule during
`loss.backward()`:

```python
for epoch in range(100):
    y_pred = model(x)
    loss = loss_fn(y_pred, y)

    optimizer.zero_grad()
    loss.backward()
    optimizer.step()
```

That is the same mathematical update, but PyTorch computes the gradients
for all trainable parameters automatically.

## Video explainers: layer forward pass

Watch this before continuing if the forward pass still feels abstract.
The page loads only the recording that matches your current light or dark
theme.

<div class="video-grid">
  <article class="video-card">
    <div class="video-embed"
         data-video-title="Layer forward pass"
         data-light-src="https://drive.google.com/file/d/1F0QTA-4KQtAHr743-4gv2zeUVTeGsNh_/preview"
         data-dark-src="https://drive.google.com/file/d/1Vbqxwivro73lzHTl-jj88dkkx2hLUJG5/preview"></div>
    <div class="video-card-body">
      <p class="video-label">visual explainer</p>
      <h3>Layer forward pass</h3>
      <p class="muted">A compact walkthrough of how inputs, weights, bias, and activation produce the output of one neural-network layer.</p>
      <p class="section-link">
        <a class="video-mode-light" href="https://drive.google.com/file/d/1F0QTA-4KQtAHr743-4gv2zeUVTeGsNh_/view?usp=sharing" target="_blank" rel="noopener noreferrer">Open the light-mode video in Drive →</a>
        <a class="video-mode-dark" href="https://drive.google.com/file/d/1Vbqxwivro73lzHTl-jj88dkkx2hLUJG5/view?usp=sharing" target="_blank" rel="noopener noreferrer">Open the dark-mode video in Drive →</a>
      </p>
    </div>
  </article>
</div>

<p class="section-link"><a href="https://www.youtube.com/@allamaprabhuani" target="_blank" rel="noopener noreferrer">Open the YouTube channel →</a></p>

## Try the layer yourself

This is the scalar version of a neural-network layer. Change the input,
weight, bias, and activation. The page computes the pre-activation value
\(z = wx + b\), then applies the activation function to produce the layer
output.

<div class="layer-demo" data-layer-demo>
  <div class="layer-demo-controls">
    <label>
      <span>input \(x\)</span>
      <input type="range" min="-3" max="3" step="0.1" value="1.2" data-layer-input="x">
    </label>
    <label>
      <span>weight \(w\)</span>
      <input type="range" min="-3" max="3" step="0.1" value="1.5" data-layer-input="w">
    </label>
    <label>
      <span>bias \(b\)</span>
      <input type="range" min="-3" max="3" step="0.1" value="-0.4" data-layer-input="b">
    </label>
    <label>
      <span>activation</span>
      <select data-layer-input="activation">
        <option value="relu">ReLU</option>
        <option value="tanh">tanh</option>
        <option value="sigmoid">sigmoid</option>
        <option value="linear">linear</option>
      </select>
    </label>
  </div>
  <div class="layer-demo-readout" aria-live="polite">
    <span><b>x</b> = <output data-layer-output="x">1.20</output></span>
    <span><b>w</b> = <output data-layer-output="w">1.50</output></span>
    <span><b>b</b> = <output data-layer-output="b">-0.40</output></span>
    <span><b>z = wx + b</b> = <output data-layer-output="z">1.40</output></span>
    <span><b>output</b> = <output data-layer-output="y">1.40</output></span>
  </div>
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

## Next

- [`02 — scikit-learn intro`](/tutorials/02-scikit-learn-intro/) — the
  classical tabular-ML workflow any PyTorch training loop also needs.
- [`05 — physics-informed neural networks`](/tutorials/05-pinns/) — what
  changes when the loss function knows physics.

## References

1. Srivastava, Hinton et al. (2014). **Dropout.** *JMLR* 15(56). [JMLR](https://jmlr.org/papers/v15/srivastava14a.html)
2. Kingma &amp; Ba (2015). **Adam: A method for stochastic optimization.** [arXiv:1412.6980](https://arxiv.org/abs/1412.6980)
3. Goodfellow, Bengio &amp; Courville (2016). **Deep Learning** (MIT Press), chs 7–8. [deeplearningbook.org](https://www.deeplearningbook.org/)
4. Karpathy (2022). **The spelled-out intro to neural networks and backpropagation.** [karpathy.ai](https://karpathy.ai/zero-to-hero.html)
