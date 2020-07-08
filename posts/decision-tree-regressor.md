---
title: "Regression Trees (Part I): Decision Trees"
date: July 06, 2020
slug: decision-tree-regressor
---

## Introduction

They say the best way to gauge your own understanding of a concept is by your
ability to explain it to others (or something along those lines...)
Since I am currently on a deep-dive into the world of machine learning (ML), I
decided to apply the same philosophy here by writing about some fundamental ML
algorithms one naturally encounters along the way.

Ultimately, my goal was to gain a deeper understanding of *gradient-boosted
trees*, popularized by libraries such as
[`XGBoost`](https://xgboost.readthedocs.io/en/latest/) or
[`LightGBM`](https://lightgbm.readthedocs.io/en/latest/), which are regularly
used in high-ranking submissions of various Kaggle competitions.
However, in order to understand boosted trees, there are various other related
methods one has to learn first, starting with so-called *decision trees*.
Unfortunately, when learning a new topic you're often expected to simply accept
certain things as facts.
Of course, teachers can't explain everything in full detail, and one always has
to settle on a certain level of abstraction when introducing new concepts.
Overwhelming students with too many details, which make them lose sight of the
bigger picture, can be just as detrimental as glossing over or simplifying
crucial ideas to the point of irrelevance.[^ft-note]

[^ft-note]: My go-to example is the way the [Fourier
  transform](https://en.wikipedia.org/wiki/Fourier_transform) is often taught
  in higher mathematics classes for engineers at university.
  My gripe here is with lecturers who merely remark that the Dirac delta
  *function* $\delta(t)$ is actually a *distribution* without defining the
  term, let alone pointing out the implications of this fact.
  Unfortunately, this leads to frustrating inconsistencies.
  For instance, while the *filtering* property of $\delta(t)$ can be invoked to
  informally determine the Fourier transform of $\delta(t)$, the other
  direction doesn't work as $\int_\R e^{i2\pi f t} \de{f}$ does not exist in
  the Riemannian sense.

In reading up on decision trees, the topic of the first post in this series,
I noticed that most introductions focus (justifiably so) on the way decision
trees are used to make predictions, while mostly skipping over the way these
trees are actually constructed.
Arguably, the latter is much less important from a practical perspective since
there's very little reason to ever use your own hand-rolled implementation
instead a battle-tested one.
It still bugged me, however, that the topic seemed to be rarely covered.
I therefore decided to dig a little deeper and implement various tree-based
regression algorithms from scratch.
Whether there's a measurable benefit to implementing well-established ML
algorithms on your own instead of focusing on building intuition for their
behavior on real-world datasets is arguable.
However, as long as it doesn't considerably slow down your learning process of
other topics, more knowledge is never a bad thing in my book.
Personally, I certainly feel a lot more comfortable and confident after gaining
a better understanding of what's going on inside what previously amounted to a
black box.

Over the next few weeks, I plan to implement and write about various regression
tree algorithms.
We'll start with the most naive form of a regression tree, a *binary decision
tree*.
We then slowly ramp up complexity by implementing more advanced
approaches such as *random forests*, as well as *gradient-boosted trees*, all
of which build upon the foundation of decision trees.
So with that overly lengthy introduction out of the way, let's move on to the
topic at hand.

> Since I'm implementing these algorithms as I go along, the source code and
> interface of the simple `DecisionTree` class we'll be looking at in this post
> are likely to change in the future.
> For reference, I tagged the code relating to this post in the Github repo:
> https://github.com/nkoep/regression-trees/tree/v1-decision-tree.

## Problem Formulation and Outline

While decision trees can be used for both classification and regression (giving
rise to the
[*CART*](https://en.wikipedia.org/wiki/Predictive_analytics#Classification_and_regression_trees_.28CART.29)
acronym), we will focus on regression in this post.
For simplicity, we assume that none of our features are categorical so we don't
have to deal with feature encoding.
Given a feature vector $\vmx \in \R^\nfeat$, where each coordinate represents
an observation of one of $\nfeat$ different features (predictors), we aim to
infer the value of some *target* or *response* variable $y \in \R$.
Since the exact nature of the relationship between $\vmx$ and $y$ is rarely
if ever known, we may turn to a data-driven approach, where we try to *infer*
the relationship based on a set of representative observations $\{(\vmx_1,
y_1), \ldots, (\vmx_\ntrain, y_\ntrain)\}$.
This is known as the *supervised learning problem*.

The remainder of this post is structured as follows.
First, we look at a simple example to examine the general structure of
decision trees, and how they are used to predict the target $y$ based on a
given observation $\vmx$.
We then motivate and explain how trees are constructed, before finally
presenting a simple Python implementation of a decision tree regressor.

## Using Decision Trees for Prediction

A decision tree is simply a *binary* tree, in which each internal node is
associated with a particular feature.
These nodes are used to partition the input space into regions of similar
observations and similar target values.

In order to visualize the principle behind decision trees, we consider a toy
example of a 2-dimensional feature space consisting of **age** and
**weight**, say, and an abstract target $y \in \R$.
Starting at the root of the tree, we simply traverse the tree based on the
feature at the current node.
In the example below, we first branch based on age, descending into the left
branch of the tree if the age is less than 20, and to the right if it is
greater than 20.
We repeat the same process at every node until we reach a leaf, also known as a
terminal node.
Since we always make a binary decision, every input vector is always mapped to
a particular leaf; there are no invalid inputs.
Once reaching a terminal node, the value $\yhat_i$ at the respective leaf is
what the decision tree predicts for the given sample.

![Sketch of a decision tree](img/decision-trees/decision-tree.png)

To better visualize how this decision tree partitions the nonnegative feature
orthant $\{(x_1, x_2) \in \R^2 \mid x_1, x_2 \geq 0\}$, we may draw the
decision boundaries in a feature plane as shown below.
Since inputs are (in theory) unbounded, there is no way to partition the domain
into boxes of equal size.
In particular, certain regions will always be bounded, while others will not
and extend to infinity.
In our toy example, the only bounded region is the one associated with the
prediction $\yhat_1$.

![Sketch of decision regions induced by a decision tree](img/decision-trees/decision-tree-regions.png)

While many regression methods such as linear regression produce predictions in
a continuum,[^linear-regression] the range of a decision tree (seen as a
function from $\R^\nfeat$ to its codomain) is a finite set.
This may seem like a rather limiting characteristic, and in fact the prediction
performance of decision trees is generally nothing to write home about.
However, since the standing assumption is that similar observations have
similar responses, and that the training set ought to be representative of the
underlying data distribution, the finite nature of the prediction domain is not
as limiting as it may seem.
This will also become clear as we move on to more sophisticated regression tree
algorithms, which share the same property but which use clever techniques to
significantly increase the size of the prediction space.

[^linear-regression]: This is because a linear regressor $f$ maps an observation
  $\vmx$ from $\R^\nfeat$ to $\R$ according to $f(\vmx) = \langle \vmx, \vmw
  \rangle + b$, where $\vmw \in \R^\nfeat$ is a weight vector, $b \in \R$ is
  a constant offset or bias term, and $\langle \cdot, \cdot \rangle$ is the
  canonical inner product on $\R^\nfeat$.

## Tree Construction

While we've covered how a decision tree makes predictions, we still haven't
answered the question how a tree is ultimately constructed.
In particular, the following questions come to mind.

> How does a tree (or, more precisely, a construction algorithm)
> 1. decide how many leaf nodes to consider?
> 1. choose which feature to branch on in each node?
> 1. pick the threshold value in each internal node?
> 1. select the prediction value in a leaf?

Let's assume for the moment that we are given a tree which induces $\npart$
partitions $P_1, \ldots, P_\npart\subset \R^\nfeat$ with corresponding response
predictions $\yhat_1, \ldots, \yhat_\npart$.
With the training set $\{(\vmx_1, y_1), \ldots, (\vmx_\ntrain,
y_\ntrain)\}$, we can measure the performance of the decision tree using the
loss function
$$
  \loss(\npart, P_1, \ldots, P_\npart, \yhat_1, \ldots, \yhat_\npart)
  = \sum_{j=1}^\npart \sum_{i : \vmx_i \in P_j} (y_i - \yhat_j)^2.
$$
In words, for each partition $P_j$, we select the training examples $E_j \defeq
\{(\vmx_i, y_i) \mid \vmx_i \in P_j\}$ that are mapped to the partition $P_j$,
and sum up the squared errors that arise from assigning the same prediction
$\yhat_j$ to all training examples in $E_j$.
The goal now is to simultaneously optimize $L$ w.r.t. $\npart$ and the
sequence of partition/predictor pairs $(P_1, \yhat_1), \ldots, (P_\npart,
\yhat_\npart)$.
This turns out to be an intractable problem in its current form.
In practice, the problem is therefore solved by a *greedy* approach known as
*recursive splitting*.

Before explaining recursive splitting, we first address the issue of choosing
the predictors $\yhat_j$ when $\npart$ and the partitions $P_j$ are fixed
(question 4).
In that case, $\loss$ is a simple convex differentiable function of $(\yhat_1,
\ldots, \yhat_\npart)$, and hence
$$
  \yhat_j = \frac{1}{\card{E_j}} \sum_{(\vmx_i, y_i) \in E_j} y_i,
$$
where $\card{\cdot}$ denotes set cardinality.
In other words, the predictor $\yhat_j$ associated with partition $P_j$ is the
mean response of all training samples in $P_j$ (which we denoted by $E_j$).
Note that if we had chosen the absolute error as fidelity measure instead of
the squared error in the definition of $\loss$, the optimal choice of $\yhat_j$
would correspond to the median of responses in $E_j$ instead of the mean.

### Greedy Recursive Splitting

Since optimizing all partitions simultaneously is computationally intractable,
recursive splitting instead tries to make a locally optimal choice by splitting
the training set into two partitions which minimize the loss function for
$\npart = 2$.
Each partition is then separately split again (if possible), which leads to the
hierarchical tree structure we're after.

For simplicity, we assume for the moment that we are at the root of the tree.
In order to split the observations, we need to pick both the best feature to
split on, and the best decision threshold.
To that end, we first fix an arbitrary feature index $i$ and choose the best
decision threshold according to
$$
  \opt{s_i}
  = \argmin_{s_i \in \{(\vmx_1)_i, \ldots, (\vmx_\ntrain)_i\}}\left\{
    \sum_{j : (\vmx_j)_i < s_i} (y_j - \yhat_1)^2 +
    \sum_{j : (\vmx_j)_i \geq s_i} (y_j - \yhat_2)^2
  \right\},
$$
where $\yhat_1$ and $\yhat_2$ are the mean responses of all observations with
$(\vmx_j)_i < s_i$ and $(\vmx_j)_i \geq s_i$, respectively.
We repeat this process for every feature index $i$, and finally pick the
feature with the lowest score to split on, where the corresponding threshold
$\opt{s_i}$ is used as decision threshold in the internal node.
Note that if there is no choice for $s_i$ that partitions the observations into
two nonempty groups, we do not split on the feature.
If this is the case for all features, we cannot split the node and turn it
into a leaf.

The procedure described here automatically answers questions 2 and 3 in our
list above.
It also implicitly answers the first question.
Since we recursively split newly created nodes and thereby grow the tree in a
top-down manner, the number of leaves depends on the number of times we can
successfully split internal nodes.
In practice, this sometimes leads to very large trees.
Without additional construction constraints, we could theoretically end up with
a tree in which each leaf contains exactly one observation, thus terribly
overfitting the data.
In order to keep complexity in check, one may therefore impose additional
constraints, e.g. that internal nodes are only split if there are more than
a specific number of observations left.
Other options involve limiting the depth of the tree or the number of leaf
nodes.
The latter option complicates tree construction slightly by requiring a
*pruning* step, however.
To keep things simple, we will not concern ourselves with pruning here.

## Python Implementation of a Decision Tree Regressor

With the mathematical details covered, we'll move on to our Python
implementation.
We start with the `DecisionTree` implementation, which simply implements the
necessary `sklearn`
[interface](https://scikit-learn.org/stable/developers/develop.html#rolling-your-own-estimator)
for estimators.
Most crucially, this requires the two methods `fit` and `predict`, where for
technical reasons the former needs to return `self`.
Otherwise, their implementations are self-explanatory.
For the moment, the constructor of our `DecisionTree` class only accepts a
single parameter, namely `min_samples_split` with the same meaning as its
`sklearn`
[counterpart](https://scikit-learn.org/stable/modules/generated/sklearn.tree.DecisionTreeRegressor.html#sklearn.tree.DecisionTreeRegressor).
As mentioned above, this parameter can be used to control the complexity of the
tree by requiring that we only split internal nodes if the available number of
samples at a node exceeds `min_samples_split`.

```python
import numpy as np
from sklearn.base import BaseEstimator, RegressorMixin


class DecisionTree(BaseEstimator, RegressorMixin):
    def __init__(self, min_samples_split=2):
        self.min_samples_split_ = min_samples_split

        self._tree = None

    def fit(self, X, y):
        self._tree = Tree(self.min_samples_split_)
        self._tree.construct_tree(*map(np.array, (X, y)))
        return self

    def predict(self, X):
        if self._tree is None:
            raise RuntimeError("Tree needs to be fitted first")
        return self._tree.apply(np.array(X))
```

The heavy lifting is done in the `Tree` class, which we define next.
Since the branches of a binary tree are also valid subtrees (unless we're at a
terminal node), we define the tree recursively.
If a node is an internal node, it has both a `left` and `right` branch.
We also store a `feature_index` to identify the feature we're comparing to, as
well as an associated decision `threshold`.
A terminal node (or *leaf*) on the other hand will only have a non-`None`
`prediction` attribute.

Performing prediction with this tree structure is pretty straightforward.
Given an array of observations, we perform sample-wise prediction by applying
the `apply_tree_to_sample` method to each row of the input array (this is what
the `np.vectorize` call does in our `apply` method).
In the `apply_tree_to_sample` method, we first check if the current tree node
is a leaf and, if so, simply return the prediction value of the leaf.
Otherwise, we branch based on the node's `feature_index` and `threshold`
attributes to select the next subtree and recursively call
`apply_tree_to_sample` on it.
Simple enough.

```python
class Tree:
    def __init__(self, min_samples_split):
        self._min_samples_split = min_samples_split

        self.left = None
        self.right = None
        self.feature_index = None
        self.threshold = None
        self.prediction = None

    def apply_tree_to_sample(self, x):
        if self.threshold is None:
            return self.prediction
        if x[self.feature_index] < self.threshold:
            node = self.left
        else:
            node = self.right
        return node.apply_tree_to_sample(x)

    def apply(self, X):
        X = np.array(X)
        return np.vectorize(self.apply_tree_to_sample, signature="(m)->()")(X)
```

Finally, we turn to tree construction whose core logic is implemented in the
`construct_tree` method below.
As outlined in the description above, we construct the tree by recursively
splitting the observations.
In code, this works as follows:

1. Check if the number of samples is enough to split, otherwise turn the node
   into a leaf.
1. If we have enough samples to split, iterate over all features, and compute
   and store the best possible split configuration (`_find_best_split`).
1. Find the feature index with the best score.
1. If the `threshold` of the best split is `None`, it was not possible to split
   the samples for any given feature, so turn the node into a leaf.
   This happens, for instance, when all observations of the individual features
   are identical.
1. If neither condition for a leaf node was satisfied, partition the
   observations and targets, and construct the left and right subtrees.

```python
    def construct_tree(self, X, y):
        num_samples, num_features = X.shape

        # Too few samples to split, so turn the node into a leaf.
        if num_samples < self._min_samples_split:
            self.prediction = y.mean()
            return

        # For each feature, compute the best split.
        feature_scores = {}
        for feature_index in np.arange(num_features):
            x = X[:, feature_index]
            feature_scores[feature_index] = self._find_best_split(x, y)

        # Retrieve the split configuration for the best (lowest) score.
        feature_index = min(feature_scores,
                            key=lambda key: feature_scores[key]["score"])
        split = feature_scores[feature_index]
        threshold = split["threshold"]
        if threshold is None:
            self.prediction = y.mean()
            return

        self.feature_index = feature_index
        self.threshold = threshold
        mask_left, mask_right = split["partition"]

        self.left = Tree(self._min_samples_split)
        self.left.construct_tree(X[mask_left, :], y[mask_left])

        self.right = Tree(self._min_samples_split)
        self.right.construct_tree(X[mask_right, :], y[mask_right])
```

The `_find_best_split` method is also pretty self-explanatory.
We iterate over all samples and select the observation which minimizes the
sum of squared errors among all observations if used as decision threshold to
split the samples on.
If we can't split samples because all samples would end up in either the left
or right branch, we simply move on to the next threshold candidate.

```python
    def _find_best_split(self, x, y):
        best_score = np.inf
        best_threshold = None
        best_partition = None
        for threshold in x:
            # Obtain binary masks for all samples whose feature values are
            # below (left) or above (right) the split threshold.
            mask_left = x < threshold
            mask_right = x >= threshold

            # If we can't split the samples based on `threshold', move on.
            if not mask_left.any() or not mask_right.any():
                continue

            # Score the candidate split.
            partition = (mask_left, mask_right)
            score = self._score_split(y, partition)

            if score < best_score:
                best_score = score
                best_threshold = threshold
                best_partition = partition

        return {
            "score": best_score,
            "threshold": best_threshold,
            "partition": best_partition
        }

    def _score_split(self, y, partition):
        mask_left, mask_right = partition
        y_left = y[mask_left]
        y_right = y[mask_right]
        return (np.sum((y_left - y_left.mean()) ** 2) +
                np.sum((y_right - y_right.mean()) ** 2))
```

And that's it!
In order to test whether the algorithm is working as intended, we'll run
prediction on the Boston house-prices dataset and compare our predictive
performance against Scikit-learn's `DecisionTreeRegressor` class.

```python
import time

from sklearn.datasets import load_boston
from sklearn.metrics import mean_absolute_error
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeRegressor

from tree import DecisionTree


class Timer:
    def __enter__(self, *args, **kwargs):
        self._start_time = time.time()

    def __exit__(self, *args, **kwargs):
        print(f"Time elapsed: {time.time() - self._start_time :.6f} seconds")
        print()


def main():
    X, y = load_boston(return_X_y=True)
    X_train, X_test, y_train, y_test = train_test_split(X, y, random_state=0)

    for implementation, Regressor in [("sklearn", DecisionTreeRegressor),
                                      ("naive", DecisionTree)]:
        regressor = Regressor()
        with Timer():
            regressor.fit(X_train, y_train)
            prediction = regressor.predict(X_test)
            print(f"Mean absolute error ({implementation}):",
                  mean_absolute_error(prediction, y_test))


if __name__ == "__main__":
    main()
```

```shell
[archibald ⚡ ~/git/regression-trees] » python test_decision_tree_regressor.py
Mean absolute error (sklearn): 3.299212598425196
Time elapsed: 0.002483 seconds

Mean absolute error (naive): 3.17007874015748
Time elapsed: 1.556536 seconds
```

As we can see, for the random state we picked to split the dataset, our naive
implementation performs slightly better than Scikit-learn's version.
Due to our naive and unoptimized implementation, training and prediction take
orders of magnitude longer than Scikit-learn's efficient
[Cython](https://cython.org/) implementation though.
I also want to point out that while we're training both models to optimize for
lowest MSE, we're scoring performance on the test set in terms of *mean
absolute error (MAE)*, which is a bit inconsistent.

## Closing Remarks

TODO
