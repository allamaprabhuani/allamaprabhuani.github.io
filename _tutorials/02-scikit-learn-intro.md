---
title: "scikit-learn, the parts you'll actually use"
subtitle: "Pipelines, cross-validation, and the five models that solve 80% of tabular problems."
level: intro
status: coming-soon
order: 2
tags: [scikit-learn, tabular, pipelines]
---

scikit-learn is enormous, but most working code uses ~10% of the API. This is that 10%.

## What's in here

- `Pipeline` and `ColumnTransformer`: keep preprocessing and model in one object
- the five models that solve most tabular problems: linear/logistic, ridge/lasso,
  tree, random forest, gradient boosting
- `cross_val_score` and why a single train/test split lies to you
- `GridSearchCV` vs `RandomizedSearchCV`, and when each one wins
- saving and loading models without breaking versioning

## Prerequisites

- Tutorial 1 (training basics) recommended
- Comfortable with pandas DataFrames
