---
title: "scikit-learn, the parts you'll actually use"
subtitle: "Pipelines, cross-validation, and the five models that solve 80% of tabular problems."
level: intro
status: published
order: 2
tags: [scikit-learn, tabular, pipelines]
notebook: notebooks/02-scikit-learn.ipynb
---

scikit-learn is enormous. Working ML code uses roughly **10 %** of the API.
This is that 10 %, on California housing — a real, messy dataset where every
preprocessing decision visibly moves the score.

If [tutorial 01](/tutorials/01-ml-training-basics/) was "how a single model
learns," this one is "how you pick a model in the first place."

<figure class="tutorial-fig">
  <img src="{{ '/assets/tutorials/02/model-comparison.png' | relative_url }}"
       alt="Bar chart of cross-validated R² for six regressors">
  <figcaption>Five models on California housing, 5-fold CV. Gradient boosting wins; a ridge takes seconds and gets 80 % of the way there.</figcaption>
</figure>

## The Pipeline insight

The single most underused class in sklearn is `Pipeline`. It bundles
preprocessing and the model into one estimator, which means **one `.fit()`,
one `.predict()`, no leakage during cross-validation, and the joblib file
contains everything**.

<figure class="tutorial-fig">
  <img src="{{ '/assets/tutorials/02/pipeline-diagram.png' | relative_url }}"
       alt="Pipeline diagram showing raw X flowing through StandardScaler then GradientBoosting to predictions">
  <figcaption>One object — fits and predicts as a unit; preprocessing isn't separate code.</figcaption>
</figure>

## Why a single train/test split lies

<figure class="tutorial-fig">
  <img src="{{ '/assets/tutorials/02/cv-boxplot.png' | relative_url }}"
       alt="Box plot showing fold-to-fold variance for six models">
  <figcaption>5-fold CV spread per model. The within-model variance is large enough that a single split can pick the wrong winner.</figcaption>
</figure>

## What's in here

- `Pipeline` and `ColumnTransformer` — preprocessing and model as one object
- the five models that solve most tabular problems: linear, ridge, lasso,
  decision tree, random forest, gradient boosting
- `cross_val_score` and why a single train/test split lies to you
- `GridSearchCV` vs `RandomizedSearchCV` — when to reach for each
- `joblib` persistence that survives sklearn version bumps

## The winner on held-out data

<figure class="tutorial-fig">
  <img src="{{ '/assets/tutorials/02/predicted-vs-actual.png' | relative_url }}"
       alt="Scatter of predicted vs actual house values for gradient boosting on the test set">
  <figcaption>Gradient boosting on the held-out test set. Diagonal would be perfect; the spread away from it tells you exactly where the model struggles (top-end clipping at $5).</figcaption>
</figure>

## Prerequisites

- [Tutorial 01](/tutorials/01-ml-training-basics/) (training basics) recommended
- Comfortable with pandas DataFrames

## Source

The notebook is original — California housing instead of the QMUL synthetic
sets — because the QMUL teaching notebooks for this lesson are single-cell
scripts, and the Pipeline lesson genuinely needs the multi-cell tour.

## Next

- [`03 — Introduction to Neural Networks`](/tutorials/03-neural-networks-intro/) — what changes when the model is a network and the framework is PyTorch.
