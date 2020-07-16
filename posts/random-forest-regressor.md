---
title: "Regression Trees (Part II): Random Forests"
date: July 16, 2020
slug: random-forest-regressor
---

## Introduction and Recap

In the previous [post](/p/decision-tree-regressor) of this series, we
introduced the concept of *decision trees* for the purpose of regression in the
context of supervised learning.
Decision trees are very simple models, which are easy to understand and apply,
but which suffer from rather poor performance as they tend to be fairly biased
towards the training data.
Without deliberate measures to limit the complexity of the constructed trees,
we may end up with trees where each leaf contains exactly one sample of the
training data in the extreme case.
Imposing limits on the tree depth, the minimum number of samples required in a
leaf node, or the minimum number of samples to split an internal node can all
help improve the generalizability of trees.
The performance ultimately remains rather poor, however.

One common way to combat these effects is by considering *ensembles* of trees,
where each tree in the ensemble "votes" on the final prediction.
*Random forests*, the topic of this post, are a popular method in this
category, which consider *randomized ensembles*.

The rest of the post is structured as follows.
We first explain how an existing random forest is used to perform prediction on
new samples.
We then briefly explain how random forests are constructed, before going
through a simple Python implementation that builds on the `Tree` class that
we wrote in the context of our decision tree regressor.

> The Python code that we will be discussing below can be found under the
> following tag of the Github repository:
> https://github.com/nkoep/regression-trees/tree/v2-random-forest.

## Prediction via Ensembles of Trees

## Seeing the Random Forest for the Decision Trees

### Bootstrapping, Aggregating and Bagging

### A Note on Training Set Sampling

## Python Implementation of a Random Forest Regressor

## Closing Remarks
