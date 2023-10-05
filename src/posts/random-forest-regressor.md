---
title: "Tree-Based Regression Methods (Part II): Random Forests"
date: July 18, 2020
---

[[toc]]

## Introduction

In the previous [post](/p/decision-tree-regressor), we introduced the concept
of *decision trees* for the purpose of regression in the context of supervised
learning.
Decision trees are very simple models, which are easy to understand and apply,
but which suffer from rather poor performance as they tend to be fairly biased
towards the training data.
Without deliberate measures to limit the complexity of constructed trees, we
may potentially end up with trees where each leaf contains exactly one training
sample.
Imposing limits on the tree depth, the minimum number of samples required in a
leaf node, or the minimum number of samples to split an internal node can all
help improve the generalization of trees.
However, the performance on unseen data ultimately remains rather poor.

One common way to combat this effect is by considering *ensembles* of trees,
where each tree in the ensemble "votes" on the final prediction.
*Random forests*, the topic of this post, are a popular method in this
category which consider *randomized ensembles*.
In particular, random forests grow a collection of decision trees in isolation.
On the one hand this means that the construction procedure is simple and easily
parallelizable. On the other hand it means there is no mechanism to gradually
improve the performance of the ensemble based on previously constructed trees.
In contrast, *boosting* methods such as *AdaBoost* or *gradient-boosted trees*,
which we will discuss in upcoming posts, incrementally improve the performance
of the ensemble as it grows.

The rest of the post is structured as follows.
We first explain how an existing random forest is used to perform prediction on
new samples.
We then briefly explain how random forests are constructed, before going
through a simple Python implementation that builds on the code we discussed
last time in the context of our decision tree regressor.

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
regression, the target predictions of all trees are averaged to form the final
prediction of the ensemble.
More concretely, consider a family of decision trees $\family =
\setpred{\function{f_i}{\R^\nfeat}{\R}}{i = 1, \ldots, \nest}$ collectively
forming the basis of the random forest.[^not-basis]
Given an unseen observation $\vmx \in \R^\nfeat$, the random forest regressor
now simply returns
$$
  \yhat
  = \frac{1}{\nest} \sum_{f \in \family} f(\vmx)
$$
as its final prediction.
And that's all there is to it.
Since all trees are created in the same if randomized way (the details of which
we will discuss next), each tree's prediction contributes equally to the final
prediction.
This is in stark contrast to some of the more advanced methods we'll be looking
at in future posts, where different members of the ensemble might have a
stronger influence on the final prediction than others.

[^not-basis]: We emphasize that we *don't* mean a basis in the linear algebraic
  sense here.

## Seeing the Random Forest for the Decision Trees[^sorry]

[^sorry]: Sorry, I couldn't help myself.

In this section, we briefly go over the construction of random forests.
Since a random forest is just a collection of trees trained on independently
sampled subsets of the training set, the most complicated aspect of
constructing a random forest was already discussed in the previous post.

### Bootstrapping, Aggregating and Bagging

Since regression trees suffer from rather poor generalization (i.e., high
variance in the bias-variance trade-off), the fundamental idea of random
forests is to inject some variation into the training procedure.
In particular, we consider $\nest$ different trees, which are all trained on
different subsets of the training data.
The intuition here is that while each individual tree might slightly overfit
the samples it was trained on, by averaging the predictions of each individual
tree this effect may be reduced, which in turn reduces variance on unseen data.

Subsampling the training set is more commonly referred to as *bootstrapping*;
a training (sub)set created in this way is called a *bootstrapped set*.
The combination of **b**ootstrapping the training set and **agg**regat**ing**
the individual predictions to form the ensemble's final prediction is what is
generally known as *bagging*.
This principle is not restricted to decision trees but can be applied to any
classification or regression method in supervised learning.

Apart from randomly subsampling the training data, random forests inject an
additional source of randomness into the training procedure by limiting and
randomizing the features individual trees are allowed to consider when
splitting internal nodes.
This often helps avoid the tendency of trees to split on the same features as
other trees in the ensemble due to highly correlated, dominant features, even
if they are trained on bootstrapped samples.
A closely related ensemble method called *extremely randomized trees* (or
*extra trees* for short), takes things one step further.
Instead of choosing the best split threshold based on the samples in a node,
they randomly generate a set of candidate thresholds and pick the threshold
with the best score to further decouple individual trees from the
(bootstrapped) training set, thus potentially reducing variance.
For simplicity, we will limit ourselves to random forests in this post.

### Random Sampling of the Training Set

While the number of samples drawn from the training set (*with* replacement) to
form the bootstrapped sample is usually around $\nsamp / 3$ in classification
tasks, in regression it is more common to draw $\nsamp$ samples from the
training set.
This may seem slightly counterintuitive at first glance as one might assume
that the bootstrapped set almost coincides with the entire training set.
Intuitively, the probability of selecting each sample only once is rather
small, so we can generally expect that a certain fraction of samples is chosen
multiple times.
The question remains though how many unique samples are drawn on average.

To frame this question mathematically, let $S$ be a random subset of $[\nsamp]
\defeq \set{1, \ldots, \nsamp}$ generated by picking $\nsamp$ values uniformly
at random from $[\nsamp]$ with replacement.
Then $\card{S}$ is a discrete random variable supported on $[\nsamp]$.
In order to evaluate $\E\card{S}$, we'll use a common trick in probability
theory by expressing $\card{S}$ in terms of indicator functions.
In particular, denote by $\event_i$ the event that $i \in S$.
Then $|S| = \sum_{i=1}^\nsamp \ind{\event_i}$, where
$\ind{\event_i}$ is 1 if $\event_i$ happens, and 0 otherwise.
By linearity of expectation, this yields
$$
  \E\card{S}
  = \sum_{i=1}^\nsamp \E\ind{\event_i}
  = \sum_{i=1}^\nsamp \P(\event_i)
  = \sum_{i=1}^\nsamp (1 - \P(\comp{\event_i})).
$$
It remains to estimate the probability of the complementary event
$\comp{\event_i}$, i.e., we never pick element $i$ when drawing $\nsamp$
elements from $[\nsamp]$.
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
In other words, the probability that $\card{S}$ deviates significantly from its
mean decays exponentially fast.

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
leveraging the `Tree` class we wrote last time to implement the core logic of
regression trees.
As the informal runtime benchmark in the last post alluded to, our
implementation is rather slow.
In general, one requires $\bigO(\nsamp \nfeat)$ operations to find the best
split in each internal node.
This will come back to bite us now since we have to train several independent
trees instead of just one, albeit with fewer samples per tree than before.
While we could train each tree in parallel to try improve runtime performance,
a simpler approach to speed things up a bit is through
[Numba](http://numba.pydata.org/).

### Speeding Up Decision Tree Fitting with Numba

Numba is a just-in-time (JIT) compiler for Python that utilizes the
[LLVM](https://llvm.org/) ecosystem to compile Python bytecode to efficient
machine code.
The dynamic nature of Python makes this process rather difficult if not
impossible for arbitrary Python code.
For the type of code regularly encountered in scientific computing, however,
Numba can often generate incredibly fast code, especially due to its
first-class support for NumPy arrays.

In its simplest form, it suffices to decorate a function with the `njit`
decorator imported from the `numba` package to unlock the benefits of JIT
compilation.
In reality, however, there are usually a few tweaks and changes necessary to
enable Numba to do its magic.
In the interest of brevity, we skip any further details at this point and
simply refer to the Numba
[documentation](http://numba.pydata.org/numba-doc/latest/index.html).
With a few minor changes to our `Tree` class (see https://git.io/JJZbz), the
runtime of our decision tree example from the previous post improves from
1.7775 to 0.1233 seconds.
This puts us in a decent starting position to build our random forest
regressor.

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
                 max_features=None, random_state=None):
        self.n_estimators_ = n_estimators
        self.min_samples_split_ = min_samples_split
        self.max_features_ = max_features
        self.random_state_ = random_state

        self._trees = []
```

The most important parameter, which should generally be optimized via
hyperparameter tuning, is `n_estimators`, controlling the number of regressors
in the ensemble.
To keep things simple, we ignore any other parameters scikit-learn's
`RandomForestRegressor` supports except for `min_samples_split`, `max_features`
and `random_state`.
The `max_features` parameter limits the size of the randomly chosen feature set
to consider during internal splits.
The `random_state` parameter is necessary to seed our random number generator
(RNG) with a fixed seed to make training reproducible across different runs.

The rest of the implementation is fairly self-explanatory.

```python
    def fit(self, X, y):
        X, y = map(np.array, (X, y))

        rng = np.random.default_rng(self.random_state_)
        num_samples = X.shape[0]

        for _ in range(self.n_estimators_):
            tree = Tree(self.min_samples_split_, self.max_features_, rng)
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

In the `fit` method, we instantiate an RNG seeded with `random_state`, and then
generate a bootstrapped dataset for each individual tree.
We also change the constructor of the `Tree` class to accept a reference to our
internal RNG in order to randomize the feature set if `max_features` is
specified.
The changes to the `Tree` class's `construct_tree` method to accommodate random
feature selection are also straightforward (see https://git.io/JJnq7).

To see how this implementation fares against scikit-learn's
`RandomForestRegressor`, we train both algorithms with ensembles of 25 trees
and limit the number of features to consider in each split
(`max_features`) to 5.
As before, we evaluate the performance of both implementations on the Boston
house-prices dataset.

```shell
$ python test_random_forest_regressor.py
sklearn
-------
MAE: 2.6788661417322834
R^2 score: 0.6184095609224545
Time elapsed: 0.042606 seconds

naive
-----
MAE: 2.6311585763318037
R^2 score: 0.6216081856563564
Time elapsed: 1.024935 seconds
```

The results show a clear improvement over the predictive performance of the
simple decision tree regressors we considered last time.
This confirms that while estimators in the ensembles might be less optimized
individually, randomization and aggregation overall helps improve the
prediction performance over single trees.
Once again the prediction accuracy of both implementations is very close, with
the scikit-learn version having a significant edge in terms of runtime as
expected.
However, by leveraging Numba in our `Tree` class, we manage to bring the
training time of our random forest down from around 10 seconds to 1 second.

## Closing Remarks

Random forests constitute a simple extension of decision trees that build on
ensembles of independently constructed trees trained on randomly sampled
subsets of the training set.
This makes random forests easy to implement and fairly efficient to train,
assuming a fast construction algorithm for single decision trees.
By randomizing both the training set and features considered when splitting
internal nodes of decision trees in the ensemble, random forests tend to reduce
overfitting, and thereby improve generalization and reduce variance.

Due to the independence of individual trees in the ensemble, random forests
lend themselves well to parallel training, which can be very beneficial for
very large datasets.
However, the independent nature in which individual estimators of the ensemble
are trained leaves a lot of unused potential to improve predictive performance
on the table.
In the next post, we'll be looking at a classical example of an ensemble method
based on *boosting*, which gradually improves the performance of the ensemble
as training progresses.
