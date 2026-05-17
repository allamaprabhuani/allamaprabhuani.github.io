---
title: "Machine Learning Training, from scratch"
subtitle: "Train/val/test splits, loss curves, overfitting, regularisation — the things every ML course glosses over."
level: intro
status: published
order: 1
tags: [ml, training, fundamentals]
notebook: notebooks/01-ml-training.ipynb
---

A from-scratch tour of how a model actually learns. We start from one feature
and one weight, build a small MLP in PyTorch, then use it to **see** every
concept that most ML courses gloss over: the train/val split, the loss curve,
overfitting, early stopping, weight decay, and dropout.

The lesson behind this tutorial: a model that's "training" and a model that's
"learning" are not the same thing. The loss curve is how you tell the
difference.

<figure class="tutorial-fig">
  <img src="{{ '/assets/tutorials/01/hero-fit.png' | relative_url }}"
       alt="Noisy sine data with train/val split and a trained MLP fit">
  <figcaption>Train (blue), val (red), true sin(x) (dashed), and the model after 3 000 epochs.</figcaption>
</figure>

## Try it before you read it

Drag the slider, hit play, and watch the network learn the function over
3 000 training steps. The model is the same 5-layer MLP used in the notebook
below.

<div class="tutorial-interactive">
  <iframe src="{{ '/assets/tutorials/01/fit-interactive.html' | relative_url }}"
          loading="lazy"
          title="Interactive fit evolution"></iframe>
</div>

## What's in here

- the train / validation / test split, and why a single split is dangerous
- writing a training loop in pure PyTorch (no `model.fit`)
- reading a loss curve: when to stop, when to worry
- overfitting in three lines of code, and three regularisation knobs that fix it
- early stopping vs L2 vs dropout — when each one is the right tool

## The two figures that matter

If you take only one thing from this tutorial, take this: **a loss curve with
only the train line is a lie.**

<figure class="tutorial-fig">
  <img src="{{ '/assets/tutorials/01/loss-overfit.png' | relative_url }}"
       alt="Log-scale loss curves showing train falling while val climbs after epoch ~200">
  <figcaption>Classic overfitting. Train MSE keeps falling; val MSE bottoms out then climbs.</figcaption>
</figure>

The dashed line marks the early-stop point — the epoch with the lowest val
MSE. Everything to the right of it is the model memorising the noise. The
fix is one of three knobs, compared head-to-head below.

<figure class="tutorial-fig">
  <img src="{{ '/assets/tutorials/01/loss-regularisation.png' | relative_url }}"
       alt="Validation loss with no regularisation, L2 weight decay, and dropout">
  <figcaption>Three regularisers on the same model and data. L2 wins here; dropout under-trains; no-reg overfits.</figcaption>
</figure>

## Watch the model find the function

<figure class="tutorial-fig">
  <img src="{{ '/assets/tutorials/01/fit-evolution.gif' | relative_url }}"
       alt="Animated GIF of the MLP prediction over 2800 training epochs">
  <figcaption>One frame every 40 epochs. The model recovers the sine in roughly the first 200 epochs and then starts following noise.</figcaption>
</figure>

## Prerequisites

- Python (you've written a `for` loop)
- Comfortable with NumPy arrays
- High-school calculus (we use one chain rule)

## Source material

This tutorial extends a teaching notebook I built while assisting
[Dr Sathiskumar Ponnusami](https://www.saponnusami.com/) in his Machine
Learning short course at Queen Mary University of London (2025). The
original single-cell version is in the [GitHub repository](https://github.com/allamaprabhuani/allamaprabhuani.github.io/blob/main/notebooks/01-ml-training.ipynb)
under `notebooks/`.

## Next

- [`02 — scikit-learn intro`](/tutorials/02-scikit-learn-intro/) — classical
  models and the data-prep workflow any PyTorch training loop also needs.
- [`05 — physics-informed neural networks`](/tutorials/05-pinns/) — what
  changes when the loss function knows physics.

## References

1. Paszke, A., Gross, S., Massa, F., et al. (2019). **PyTorch: An imperative style, high-performance deep learning library.** *NeurIPS 2019*. [arXiv:1912.01703](https://arxiv.org/abs/1912.01703)
2. Srivastava, N., Hinton, G., Krizhevsky, A., Sutskever, I., &amp; Salakhutdinov, R. (2014). **Dropout: A simple way to prevent neural networks from overfitting.** *JMLR* 15(56), 1929–1958. [JMLR](https://jmlr.org/papers/v15/srivastava14a.html)
3. Kingma, D. P., &amp; Ba, J. (2015). **Adam: A method for stochastic optimization.** *ICLR 2015*. [arXiv:1412.6980](https://arxiv.org/abs/1412.6980)
4. Prechelt, L. (1998). **Early stopping — but when?** in *Neural Networks: Tricks of the Trade*, Springer. [doi:10.1007/3-540-49430-8\_3](https://doi.org/10.1007/3-540-49430-8_3)
5. Goodfellow, I., Bengio, Y., &amp; Courville, A. (2016). **Deep Learning.** MIT Press. Chapters 7 (regularization) and 8 (optimization). [deeplearningbook.org](https://www.deeplearningbook.org/)
