---
title: "Tree-Based Regression Methods (Part III): AdaBoost"
date: August 12, 2020
slug: adaboost-regressor
---

## Introduction

After [introducing](/p/random-forest-regressor) random forests as a first
algorithm in the class of *ensemble methods*, today's post covers another
well-known ensemble method known as *AdaBoost*.
AdaBoost, short for **ada**ptive **boost**ing, is, as the name suggests, based
on the *boosting* principle.
Boosting techniques consider a collection of so-called *weak learners* which
collaborate in a clever way to form accurate predictions.
A weak learner is a predictor which in itself only has limited predictive
power, often constructed by restricting the complexity of a more expressive
model.
Consequently, the philosophy at the heart of boosting is *strength in numbers*,
meaning that the power of the ensemble is due to the different strengths and
weaknesses of its individual members.

As described in the previous post, the estimators in a random forest ensemble
are all trained in isolation.
The improved predictive performance over simple decision trees is achieved by
randomizing the training set for each estimator, and averaging the individual
predictions of each tree, a process known as *bagging*.
In contrast, boosting uses the information of how well the previous estimator
in the ensemble performed on the training set to construct the next estimator.
AdaBoost is a particular type of boosting algorithm which attempts to train a
weak learner that performs better on training examples that the previous
learner performed poorly on.

In this post, we will discuss the most popular version of AdaBoost for
regression commonly known as *AdaBoost.R2* as described in the
[paper](https://dl.acm.org/doi/10.5555/645526.657132) "Improving Regressors
Using Boosting Techniques" by H. Drucker.
Note that even though the post focuses on tree-based regression methods, we
emphasize that AdaBoost is a general boosting framework that is compatible with
any type of supervised learning algorithm, not just decision trees.
However, it is safe to say that the most common choice of weak learners in
AdaBoost are
[CARTs](https://en.wikipedia.org/wiki/Predictive_analytics#Classification_and_regression_trees_.28CART.29).
This is also the case for sklearn's `AdaBoostRegressor` estimator, which we
will use as baseline to compare our implementation against later on.

> The Python code this post refers to can be found here:
> https://github.com/nkoep/fundamental-ml/tree/v3-adaboost.

## Adaptive Boosting

In the case of decision trees and random forests, the prediction step was
pretty straightforward once a trained regressor was available.
Unfortunately, in the particular case of AdaBoost, the situation is slightly
different.
Naturally, prediction is still less complicated than the training procedure.
However, there is not much insight to be gained from explaining how prediction
is carried out first without going into the construction principle behind
AdaBoost.
We will therefore begin our foray into the inner workings of AdaBoost for
regression by detailing the training process.
This will already provide a lot of intuition and insight for the subsequent
prediction step and the corresponding Python implementation we will discuss
towards the end of the post.[^adaboost-classification]

[^adaboost-classification]: Note that this mainly applies to AdaBoost for
  regression.
  In the case of classification, the prediction step is rather natural.
  In short, every member in the ensemble has a nonnegative weight associated
  with it, which are determined during training.
  To classify a new sample, each estimator in the ensemble makes a prediction,
  splitting the ensemble into distinct subsets of estimators for each
  individual class.
  Instead of simply selecting the class with most votes, AdaBoost selects the
  class with the highest sum of associated estimator weights.
  In other words, AdaBoost for classification forms its predictions based on
  a simple weighted average of vote counts.

### Ensemble Fitting

### Prediction

## Python Implementation of an AdaBoost Regressor

## Closing Remarks
