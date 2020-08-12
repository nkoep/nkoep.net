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
on the powerful *boosting* principle, which considers a collection of so-called
*weak learners* which collaborate in a clever way to form accurate predictions.
A weak learner is a predictor which in itself only has limited predictive
capability, often achieved by restricting the complexity of a more versatile
model.
The boosting philosophy is *strength in numbers*, where the power of the
ensemble is due to the different strengths and weaknesses of its individual
members.

As described in the previous post, the estimators in a random forest ensemble
are all trained in isolation.
The improved predictive performance over simple decision trees is rooted in
randomizing the training set for each estimator, and averaging the individual
predictions of each tree.
In contrast, boosting uses the information of how well the previous estimator
in the ensemble performed on the training set to construct the next estimator.
AdaBoost is a particular type of boosting algorithm which attempts to train a
weak learner that performs better on training examples that the previous
learner performed poorly on.
In this post, we will discuss the most popular version of AdaBoost for
regression commonly known as *AdaBoost.R2* as described in the
[paper](https://dl.acm.org/doi/10.5555/645526.657132) "Improving Regressors
Using Boosting Techniques" by H. Drucker.

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
towards the end of the post.

### Ensemble Fitting

### Prediction

## Python Implementation of an AdaBoost Regressor

## Closing Remarks
