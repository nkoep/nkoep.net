---
title: "Tree-Based Regression Methods (Part II): Random Forests"
date: July 18, 2020
slug: random-forest-regressor
---

## Introduction

In the previous [post](/p/decision-tree-regressor), we introduced the concept
of *decision trees* for the purpose of regression in the context of supervised
learning.
Decision trees are very simple models, which are easy to understand and apply,
but which suffer from rather poor performance as they tend to be fairly biased
towards the training data.
Without deliberate measures to limit the complexity of the constructed trees,
we may end up with trees where each leaf contains exactly one training sample
in extreme cases.
Imposing limits on the tree depth, the minimum number of samples required in a
leaf node, or the minimum number of samples to split an internal node can all
help improve the generalization of trees.
However, the performance on unseen data ultimately remains rather poor
unfortunately.

One common way to combat this effect is by considering *ensembles* of trees,
where each tree in the ensemble "votes" on the final
prediction.
*Random forests*, the topic of this post, are a popular method in this
category, which consider *randomized ensembles* constructed in a way that
avoids some issues that more naive ensemble methods suffer from.

The rest of the post is structured as follows.
We first explain how an existing random forest is used to perform prediction on
new samples.
We then briefly explain how random forests are constructed, before going
through a simple Python implementation that builds on the code we wrote in the
context of our decision tree regressor.

> The Python code we will be discussing below can be found under the following
> tag of the Github repository:
> https://github.com/nkoep/fundamental-ml/tree/v2-random-forest.

## Prediction via Ensembles of Trees

As alluded to before, random forests are conceivably simple to apply in
practice.
Given an ensemble of trained decision tree regressors, ensemble methods such
as random forests simply combine the individual predictions into a consensus
prediction of the entire ensemble.
In a classification task, this is a simple majority vote, i.e., the most
commonly predicted class among all trees wins, whereas in the context of
regression, the target predictions of each tree are averaged to form the final
prediction of the ensemble.
More concretely, consider a family of decision trees $\family =
\setpred{\function{f_i}{\R^\nfeat}{\R}}{i = 1, \ldots, \nest}$.
The collection or ensemble $\family$ of trees is collectively referred to as
a *random forest*.
Given an unseen observation $\vmx \in \R^\nfeat$, the random forest regressor
now simply returns
$$
  \yhat
  = \frac{1}{\nest} \sum_{i=1}^\nest f_i(\vmx)
$$
as its final prediction.
And that's all there is to it.
Since all trees are created in the same if randomized way (as we will discuss
next), each tree's prediction contributes equally to the final prediction.
This is in stark contrast to some of the more advanced methods we'll be looking
at in future posts, where different members of the ensemble might have more
influence on the final result than others.

## Seeing the Random Forest for the Decision Trees[^sorry]

[^sorry]: Sorry, I couldn't help myself.

In this section, we briefly go over the construction of random forests.
Since a random forest is just a collection of trees trained on independently
sampled subsets of the training set, the most complicated aspect of
constructing a random forest was already covered in the previous post.
We first cover a bit of customary terminology.

### Bootstrapping, Aggregating and Bagging

Since regression trees suffer from rather poor generalization (i.e., high
variance in the bias-variance trade-off), the fundamental idea of random
forests is to inject some variation into the training procedure.
In particular, we consider $\nest$ different trees, which are all trained on a
different subset of the training data.
The intuition here is that while each individual tree might slightly overfit
the samples it was trained on, by averaging the predictions of each individual
tree this effect may be reduced, thereby reducing variance.

Subsampling the training set is more commonly referred to as *bootstrapping*;
a training (sub)set created in this way is called a *bootstrapped set*.
The combination of **b**ootstrapping the training set and **agg**regat**ing**
the individual predictions to form the ensemble's final prediction is what is
generally known as *bagging*.

Apart from randomly subsampling the training data, there are other methods to
force more variation into the individual regression trees.
One common approach is to limit the number of features regression trees are
allowed to consider when splitting internal nodes.
In particular, at each node one randomly selects a fixed-size subset of
features to consider.
This may help avoid the tendency of trees to split on the same features as the
other trees in the ensemble, even if they are trained on (different)
bootstrapped samples, which ultimately helps reduce variance further.

### Random Sampling of the Training Set

While the number of samples drawn from the training (*with* replacement) set to
form the bootstrapped sample is usually around $\nsamp / 3$ in classification
tasks, in regression it is more common to draw $\nsamp$ samples from the
training set.
This may seem slightly counterintuitive at first glance as one might assume the
bootstrapped set to almost coincide with the entire training set.
Intuitively, the probability of selecting each sample only once is vanishingly
small, so we can generally expect that a certain fraction of samples is chosen
multiple times.
In actuality, however, this sampling procedure turns out to always select
roughly 2/3 of the training samples.
The question now is how many unique samples are drawn on average.

To frame this question mathematically, let $S$ be a random subset of $[\nsamp]
\defeq \set{1, \ldots, \nsamp}$ generated by picking $\nsamp$ values uniformly
at random from $[\nsamp]$ with replacement.
Then $\card{S}$ is a discrete random variable supported on $[\nsamp]$.
In order to evaluate $\E\card{S}$, we'll use a common trick in probability
theory by expressing $\card{S}$ in terms of indicator functions.
In particular, denote by $\event_i$ the event that $i \in S$.
Then $|S| = \sum_{i=1}^\nsamp \ind{\event_i}$, where
$\ind{\event_i}$ is $1$ if $\event_i$ happens, and 0 otherwise.
By linearity of expectation, this yields
$$
  \E\card{S}
  = \sum_{i=1}^\nsamp \E\ind{\event_i}
  = \sum_{i=1}^\nsamp \P(\event_i)
  = \sum_{i=1}^\nsamp (1 - \P(\comp{\event_i})).
$$
It remains to estimate the probability of the complementary event
$\comp{\event_i}$, i.e., we never pick $i$ when drawing $\nsamp$ elements
from $[\nsamp]$.
Since each element of $[\nsamp]$ is equally likely, we have by independence of
individual draws that
$$
  \P(\comp{\event_i})
  = \parens{\frac{\nsamp - 1}{\nsamp}}^\nsamp.
$$
Overall, this yields
$$
  \E\card{S}
  = \nsamp\parens{1 - \parens{\frac{\nsamp - 1}{\nsamp}}^\nsamp}.
$$

Moreover, by [Hoeffding's
inequality](https://en.wikipedia.org/wiki/Hoeffding%27s_inequality#General_case_of_bounded_random_variables)
the random variable $\card{S}$ concentrates sharply around its mean.
To see this, note that by the previous representation of $\card{S}$, we have
$$
  \card{S} - \E\card{S}
  = \sum_{i=1}^\nsamp (\ind{\event_i} - \E\ind{\event_i})
  = \sum_{i=1}^\nsamp \parens{\ind{\event_i} - 1 +
  \parens{\frac{\nsamp-1}{\nsamp}}^\nsamp}
  \eqdef \sum_{i=1}^\nsamp X_i.
$$
Clearly, $\E X_i = 0$ and $\abs{X_i} \leq 1$ a.s. for all $i \in [\nsamp]$.
Hence Hoeffding's inequality states that for $t > 0$,
$$
  \P(\abs{\card{S} - \E\card{S}} \geq t)
  = \P\parens{\abs{\sum_{i=1}^\nsamp X_i} \geq t}
  \leq 2 \exp\parens{-\frac{t^2}{2\nsamp}}.
$$

Note that with the limit representation $e^x = \lim_{n \to \infty} (1 +
x/n)^n$, for large $\nsamp$ we roughly have that
$$
  \E\card{S}
  \approx \nsamp (1 - e^{-1})
  \approx 0.63212 \nsamp.
$$
This means that by drawing $\nsamp$ samples uniformly at random from the
training set of size $\nsamp$ with replacement, on average we will use around
2/3 of the training set to fit each individual tree in the ensemble.

## Python Implementation of a Random Forest Regressor

We now turn to the Python implementation of a random forest regressor,
leveraging the `Tree` class we wrote last time that implements the core logic
of regression trees.
As the informal runtime benchmark in the last post alluded to, our
implementation is rather slow as we require $\bigO(\nsamp \nfeat)$ operations
to find the best split in each internal node, where $\nsamp$ denotes the size
of the training set.
This will come back to bite us now since we have to train several independent
trees, albeit with fewer samples per tree as before.
While we could train each tree in parallel, a simpler approach to speed things
up a bit is through [numba](http://numba.pydata.org/).

### Speeding Up Decision Tree Fitting with Numba

Numba is a just-in-time (JIT) compiler for Python that utilizes the
[LLVM](https://llvm.org/) ecosystem to compile Python bytecode to efficient
machine code.
The dynamic nature of the Python language makes this process rather difficult
if not impossible for arbitrary Python code.
For the type of code often encountered in scientific computing, however, numba
can generate incredibly fast code, especially due to its first-class support
for numpy arrays.

In its simplest form, it suffices to decorate a function with the `njit`
decorator imported from the `numba` package.
For brevity, we refer to the numba
[documentation](http://numba.pydata.org/numba-doc/latest/index.html) for
further details.
With these changes to our `Tree` class (which are fairly small, see
https://git.io/JJZbz), the runtime of our decision tree example from the
previous post improves from 1.7775 to 0.1233 seconds.

### Random Forest Regressor

We finally turn to the implementation of our `RandomForest` class.
Due to the simple construction procedure of random forests, the implementation
is very concise.
We begin with the constructor.

```python
import numpy as np
from sklearn.base import BaseEstimator, RegressorMixin

from tree import Tree


class RandomForest(BaseEstimator, RegressorMixin):
    def __init__(self, n_estimators=100, min_samples_split=2,
                 random_state=None):
        self.n_estimators_ = n_estimators
        self.min_samples_split_ = min_samples_split
        self.random_state_ = random_state

        self._trees = []
```

The most important parameter, which should generally be optimized via
hyperparameter tuning, is `n_estimators`, controlling the number of regressors
in the ensemble.
To keep things simple, we ignore any other parameters scikit-learn's
`RandomForestRegressor` supports except for `min_samples_split` and
`random_state`.
The latter is necessary to seed our internal random number generator (RNG) with
a fixed seed to make tree construction reproducible.
The rest of the implementation is self-explanatory.

```python
    def fit(self, X, y):
        X, y = map(np.array, (X, y))

        rng = np.random.default_rng(self.random_state_)
        num_samples = X.shape[0]

        for _ in range(self.n_estimators_):
            tree = Tree(self.min_samples_split_)
            indices = rng.integers(num_samples, size=num_samples)
            tree.construct_tree(X[indices, :], y[indices])
            self._trees.append(tree)

    def _predict_sample(self, x):
        return np.array(
            [tree.apply_to_sample(x) for tree in self._trees]).mean()

    def predict(self, X):
        if not self._trees:
            raise RuntimeError("Estimator needs to be fitted first")
        return np.array([self._predict_sample(row) for row in np.array(X)])
```

To see how this implementation fares against scikit-learn's
`RandomForestRegressor`, we train both algorithms with 25 trees each, and
compare their performances on the Boston house-prices dataset as before.

```shell
$ python test_random_forest_regressor.py
sklearn
-------
MAE: 2.581354330708661
R^2 score: 0.7265594550869257
Time elapsed: 0.061501 seconds

naive
-----
MAE: 2.574992125984252
R^2 score: 0.7180459986368835
Time elapsed: 1.779618 seconds
```

The results show a clear improvement over the predictive performance of the
simple decision tree regressors we considered last time.
Once again the prediction accuracy of both implementations is very close, with
the scikit-learn version having a significant edge in terms of runtime as
expected.

## Closing Remarks
