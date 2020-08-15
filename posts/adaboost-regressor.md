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
A weak learner is a predictor which by itself only has limited predictive
power.
Weak learners are usually based on more expressive models such as decision
trees whose complexity is intentionally limited.
Consequently, the philosophy at the heart of boosting is *strength in numbers*,
meaning that the power of the ensemble is due to the different strengths and
weaknesses of its individual members.

As we discussed last time, the estimators in a random forest ensemble are all
trained in isolation.
The improved predictive performance and generalizability over simple decision
trees is achieved by randomizing the training set for each estimator, and
averaging the individual predictions of each tree.
This process is known as *bagging*.
In contrast, boosting uses the information of how well the previous estimator
in the ensemble performed on the training set to construct the next estimator.

In this post, we will introduce the most popular version of AdaBoost for
regression, commonly known as *AdaBoost.R2* as described in the
[paper](https://dl.acm.org/doi/10.5555/645526.657132) "Improving Regressors
Using Boosting Techniques" by H. Drucker.
Note that even though the post focuses on tree-based regression methods, we
emphasize that AdaBoost is a general boosting framework that is compatible with
any type of supervised learning algorithm, not just decision trees.
However, it is safe to say that the most common choice of weak learners in
AdaBoost are
[CARTs](https://en.wikipedia.org/wiki/Predictive_analytics#Classification_and_regression_trees_.28CART.29).
This is also the case for sklearn's `AdaBoostRegressor`, which we will use as
baseline to compare our implementation against later on.

> The Python code accompanying this post can be found here:
> https://github.com/nkoep/fundamental-ml/tree/v3-adaboost.

## Adaptive Boosting

In the case of decision trees and random forests, the prediction step was
pretty straightforward once a trained regressor was available.
Unfortunately, in the particular case of AdaBoost, the situation is slightly
different.
Naturally, the prediction step is less complicated than the training step.
However, there is not much insight to be gained from explaining how prediction
is carried out first without going into the construction principle behind
AdaBoost.[^adaboost-classification]
In contrast to the previous two posts, we will therefore begin our foray into
the inner workings of AdaBoost for regression by detailing the training
process.
This will provide some intuition and insight for the subsequent prediction
step and the corresponding Python implementation we will discuss towards the
end of the post.

[^adaboost-classification]: Note that this mainly applies to AdaBoost for
  regression.
  In the case of classification, the prediction step is rather natural.
  In short, every member in the ensemble has a nonnegative weight associated
  with it, which are determined during training.
  To classify a new sample, each estimator in the ensemble makes a prediction,
  splitting the ensemble into distinct subsets of estimators based on the
  predicted classes.
  Instead of simply choosing the class with most votes, AdaBoost selects the
  class with the highest sum of associated estimator weights.
  In other words, in a classification context, AdaBoost forms its predictions
  based on a simple weighted average of vote counts.

To highlight the conceptual differences between random forests and AdaBoost, we
begin by briefly reviewing the idea behind random forests.[^random-forests]
A random forest is simply a collection of independently trained decision trees.
Each tree is trained on a bootstrapped (i.e., randomly subsampled) version of
the training set.
This bootstrapping step reduces the likelihood that trees overfit to potential
idiosyncracies in the training data, which might not be representative of the
true data distribution we are trying to learn.
Since all trees are trained independently, each tree has the same say in the
final prediction of the ensemble, which is simply taken as the average of all
predictions in a democratic manner.
This combination of boostrapping the training set and aggregating individual
predictions is commonly known as bagging.

[^random-forests]: See the [previous post](/p/random-forest-regressor) for
  details.

In contrast, the estimators in an AdaBoost ensemble are constructed
sequentially in order to improve the predictions of the next estimator for
those training samples that the previous estimator performed poorly on.
For starters, this means that there is no straightforward way to parallelize
the training process.
However, as touched on in the introduction, the estimators in an AdaBoost
ensemble are usually weak learners whose model complexity is intentionally
restricted.
This means that each estimator is usually easy to train.
Controlling the complexity of individual learners therefore allows for a
trade-off between predictive power of the ensemble and training time.

With the high-level differences between random forests and AdaBoost out of the
way, let us move on to the actual training process of an AdaBoost ensemble.

### Ensemble Fitting

The core idea in training an AdaBoost ensemble is the following.
We begin by training a weak learner on a bootstrapped training set.
The estimator is than applied to every example in the original training set to
determine the prediction error of each example.[^model-performance]
As the weak learner only has limited predictive capability, the estimator will
perform better on certain samples of the training set than on others.
The idea now is to train another learner that performs better on exactly those
samples.
Naturally, this learner will again work better for some examples than for
others, so another learner is trained to improve performance on those samples,
and so on.
The question is how we can steer the training process to emphasize the
importance of learning to predict certain samples better than others.

[^model-performance]: Obviously, evaluating model performance on the training
  set is considered a mortal sin in learning theory.
  In AdaBoost, however, the step is merely used to identify training samples
  which a learner could not predict well.

The strategy adopted by AdaBoost is to use a carefully resampled training set
in which difficult samples are included multiple times.
In particular, one defines a discrete probability distribution on the training
set that is used to sample from the set, where difficult samples are assigned
a higher probability such that they are more likely to appear multiple times
in the resampled training set.
Intuitively, by including difficult samples multiple times, the prediction
error of the respective samples also have a higher impact on the overall
prediction error.
Training a learner on such a dataset therefore naturally creates an estimator
which performs better on the samples in question than the previous estimator.

To make matters concrete, consider a training set $\Trainset \defeq
\set{(\vmx_1, y_1), \ldots, (\vmx_\nsamp, y_\nsamp)} \subset \R^\nfeat \times
\R$ consisting of feature vectors $\vmx_i$ and labels $y_i$.
We want to train an ensemble of weight/estimator pairs
$$
  \family =
  \setpred{(w_t, f_t)}{w_t \in \R, \function{f_t}{\R^\nfeat}{\R}, t = 1,
  \ldots, \nest},
$$
representing our AdaBoost regressor, where the weights $w_t$ quantify the
quality of individual estimators.
We also define a sequence of *sample weights* $s_1, \ldots, s_\nsamp \in \R_+$,
which we initialize as $s_i = 1$.

We now proceed as follows for every estimator indexed by $t = 1, \ldots,
\nest$:
1. Normalize the sample weights $s_i$ to obtain a discrete probability
   distribution on $\Trainset$:
   $$
     p_i \defeq
     \frac{s_i}{\sum_{j=1}^\nsamp s_j}.
   $$
1. Draw $\nsamp$ samples from $\Trainset$ with replacement according to the
   probability distribution $(p_1, \ldots, p_\nsamp)$ to obtain the resampled
   training set $\tilde{\Trainset}$.
1. Train a weak learner $\function{f_t}{\R^\nfeat}{\R}$ on the training set
   $\tilde{\Trainset}$, and compute the prediction errors $e_i \defeq
   \abs{f_t(\vmx_i) - y_i}$ for each example $(\vmx_i, y_i) \in \Trainset$ in
   the original training set.
   Now compute the normalized losses
   $$
     L_i \defeq
     \frac{e_i}{\norm{(e_j)_{j=1}^\nsamp}_\infty} \in [0, 1],
   $$
   as well as the average loss $\bar{L} \defeq \sum_{i=1}^\nsamp p_i L_i$ of
   the estimator.
   If $\bar{L} \geq 0.5$, reject the current estimator (unless it is the first
   one) and abort the training process.
1. Compute
   $$
     \beta =
     \frac{\bar{L}}{1 - \bar{L}},
   $$
   and set the estimator weight to $w_t = \log(1 / \beta)$.
1. Finally, for each training example $i = 1, \ldots, \nsamp$, update the
   associated sample weight $s_i$ according to
   $$
    s_i \leftarrow
    s_i \beta^{1 - L_i}.
   $$

The steps outlined above follow the paper by H. Drucker that introduced
AdaBoost.R2.
Let's look a little closer at the involved quantities to gain a better
intuition into the design of AdaBoost.

First of all, while $L_i$ measures the performance of the estimator on the
$i$-th training example, $\bar{L}$ and consequently $\beta$ measure the
overall (average) performance of the estimator $f_t$.
Naturally, small values of $\beta$ indicate good performance on the original
training set.
The update rule of the sample weights in step 5 combines the overall quality
of the estimator with the behavior on individual training examples.
As outlined above, the idea is to increase the sample weight $s_i$ (and
consequently the sample probability $p_i$) for a sample that was predicted
poorly (i.e., high $L_i$) and decrease it otherwise.
This is achieved by scaling the current weight $s_i$ by $\beta^{1-L_i}$ since
$a^b$ for $a \in (0, 1)$ tends towards $1$ as $b$ goes to $0$ (from above).
Note, however, that this only makes sense if $\beta < 1$ as implied by $\bar{L}
< 0.5$.
This is why a learner with an average error of $0.5$ or higher is rejected in
step 3 and the training process aborted.

The graphs below depict the behavior of $\beta$ and the estimator weight $w_t$
as functions of the average error in the feasible region $\bar{L} \in (0,
0.5]$.
Since the estimator weight $w_t$ is the negative logarithm of $\beta$,
estimators with a low average error are assigned a higher weight to indicate
confidence in the accuracy of the estimator.
This will play an important role in the prediction step.
As $\bar{L}$ tends towards $0$, the estimator weight $w_t$ increases much
faster than it decreases as $\bar{L} \to 0.5$.
Intuitively, this means that AdaBoost has slightly more confidence in an
estimator's assessment of being a good predictor compared to one that
supposedly performed badly.
Note that due to the value ranges of $\beta$ and $L_i$, every sample weight
$s_i$ will remain nonnegative after step 5.
Normalizing the updated sample weights according to step 1 therefore always
yields a valid probability distribution on $\Trainset$.

![Beta and weight as a function of the average
loss](img/adaboost-regressor/beta-and-weight.svg)

### Weighted Median Prediction

As the title of the section suggests, AdaBoost uses the weighted median of the
individual predictions to determine the final prediction of the ensemble.
Ignoring the estimator weights $w_t$ for a moment, simply taking the median of
the estimates $\set{f_t(\vmx)}_{t=1}^\nest$ for an unseen observation $\vmx \in
\R^\nfeat$ could be interpreted as a form of continuous majority voting that is
robust to sporadic outliers in the predictions.
However, this would ignore the confidence information that we have about each
predictor's accuracy on the training set as determined during model training.
Instead, AdaBoost first orders each prediction in ascending order such that
$$
  f_{\pi(1)}(\vmx) \leq
  f_{\pi(2)}(\vmx) \leq
  \ldots \leq
  f_{\pi(\nest)}(\vmx)
$$
where $\function{\pi}{[\nest]}{[\nest]}$ is a permutation, and $[n] \defeq
\set{1, \ldots, n}$ for $n \in \N$.
It then finds the smallest index $\opt{t} = 1, \ldots, \nest$ for which the
inequality
$$
  \sum_{i=1}^\opt{t} w_{\pi(i)} \geq \frac{1}{2} \sum_{t=1}^\nest w_t
$$
holds.
The Wikipedia [article](https://en.wikipedia.org/wiki/Weighted_median) for the
weighted median provides a good illustration of the principle.
In short, the weights $w_t$ are interpreted as widths of the bars representing
the values in our list of predictions in a bar plot.
Then the weighted median is simply the value associated with the bar that we
find when drawing a vertical line in the middle of the diagram.
The following is a simple Python function that determines the weighted median
of a 1-dimensional array, which serves as the basis for our estimator's
`predict` method later on.

```python
import numpy as np

def weighted_median(weights, elements):
    sort_indices = np.argsort(elements)
    sorted_weights = weights[sort_indices]
    cumulative_weights = np.cumsum(sorted_weights)
    index = (cumulative_weights >= 0.5 * np.sum(weights)).argmax()
    return elements[sort_indices[index]]
```

## Python Implementation of an AdaBoost Regressor

As usual, we close out the post by briefly presenting a rudimentary Python
implementation of the discussed algorithm.
We begin with a tiny utility class and the high-level definition of our
`AdaBoost` class.[^sklearn-conventions]

[^sklearn-conventions]: Note that the code presented in previous posts did not
  properly follow sklearn's coding conventions.
  For instance, parameters passed in to the constructor should always be
  exposed as "public" members (i.e., not prefixed with underscores).
  Moreover, instance attributes which are modified during calls to the `fit`
  method of an estimator should always be suffixed with an underscore.

```python
import numpy as np
from sklearn.base import BaseEstimator, RegressorMixin

from random_state import ensure_random_state
from tree import DecisionTree


class Sprout(DecisionTree):
    def __init__(self, **kwargs):
        super().__init__(max_depth=3, **kwargs)


class AdaBoost(BaseEstimator, RegressorMixin):
    def __init__(self, n_estimators=50, random_state=None):
        self.n_estimators = n_estimators
        self.random_state = random_state

        self._reset_sprouts()

    def _reset_sprouts(self):
        self.sprout_weights_ = np.zeros(self.n_estimators)
        self.sprouts_ = []
```

As pointed out in the beginning, AdaBoost is compatible with any type of
regression method.
However, since we always try to stay reasonably close to sklearn's interface,
we use the same type of base estimator as the default choice in sklearn's
`AdaBoostRegressor`, namely a decision tree regressor with `max_depth` set to
3.[^max-depth]
We refer to such a tree as a *sprout*.

Next up is the usual `fit` method, which implements the steps outlined in the
section on ensemble fitting above.
The implementation is a fairly straightforward translation of the update rules
into Python code.

[^max-depth]: Note that in previous posts, we did not support limiting the tree
  depth to arbitrary values of `max_width`.
  This rather silly restriction was lifted in https://git.io/JJ5UW.

```python
    def fit(self, X, y):
        X, y = map(np.array, (X, y))
        num_samples = X.shape[0]
        sample_weights = np.ones(num_samples) / num_samples

        self._reset_sprouts()

        random_state = ensure_random_state(self.random_state)

        for i in range(self.n_estimators):
            # Resample the training set.
            indices = random_state.choice(
                np.arange(num_samples), size=num_samples, replace=True,
                p=sample_weights)
            X_resampled = X[indices, :]
            y_resampled = y[indices]

            # Train a weak learner on the resampled training data.
            sprout = Sprout(random_state=random_state)
            sprout.fit(X_resampled, y_resampled)

            # Compute normalized losses and average loss.
            predictions = sprout.predict(X)
            prediction_errors = np.abs(y - predictions)
            prediction_errors /= prediction_errors.max()
            average_loss = np.inner(prediction_errors, sample_weights)

            # Early termination if loss is too bad.
            if average_loss >= 0.5:
                if len(self.sprouts_) == 0:
                    self.sprouts_.append(sprout)
                break

            # Update estimator weights.
            beta = average_loss / (1 - average_loss)
            self.sprout_weights_[i] = np.log(1 / beta)
            self.sprouts_.append(sprout)

            # Update sample weights.
            weights = sample_weights * beta ** (1 - prediction_errors)
            sample_weights = weights / weights.sum()

        return self
```

Lastly, it remains to implement the `predict` method, which uses the
`weighted_median` function already presented above.
For simplicity, we determine the weighted median for one observation at a time.
Hence in the `predict` method, we first pass the matrix of observations to
each predictor, and turn the resulting list of 1-dimensional NumPy arrays
into the `predictions` array of shape `(num_samples, n_estimators)`.
Each row of this array contains the predictions of the estimators in the
ensemble for each individual observation.
We then compute the weighted median of each row w.r.t. the estimator weights
`self.sprout_weights_`.

```python
    def _weighted_median(self, weights, elements):
        sort_indices = np.argsort(elements)
        sorted_weights = weights[sort_indices]
        cumulative_weights = np.cumsum(sorted_weights)
        index = (cumulative_weights >= 0.5 * np.sum(weights)).argmax()
        return elements[sort_indices[index]]

    def predict(self, X):
        if not self.sprouts_:
            raise RuntimeError("Estimator needs to be fitted first")

        predictions = np.array([sprout.predict(X)
                                for sprout in self.sprouts_]).T
        return np.array([self._weighted_median(self.sprout_weights_, row)
                         for row in predictions])
```

At last we briefly sanity-check our implementation by comparing its performance
against sklearn's implementation on the Boston housing dataset.
We limit the number of estimators in the ensemble to 25.

```shell
$ python test_adaboost_regressor.py
sklearn
-------
MAE: 3.074215066418774
R^2 score: 0.5717439634843211
Time elapsed: 0.039751 seconds

naive
-----
MAE: 3.1515798879484787
R^2 score: 0.5608751574764101
Time elapsed: 0.781498 seconds
```

While our implementation's performance falls slightly behind sklearn's for our
particular hyperparameter choice, our estimator seems to be working correctly.
We also point out that both implementations fall somewhat behind the
performance of the random forest regressor presented in the previous post.
Note, however, that this is likely due to the fact that we did not bother to
perform any hyperparameter tuning.
The point of these informal comparisons is merely to verify the (probably)
correct behavior of our implementation rather than an exhaustive performance
comparison.

## Closing Remarks

Despite its seemingly complicated construction procedure, AdaBoost turns out to
be a rather elegant ensemble method that gradually improves the predictive
power of the ensemble as training progresses.
At its core, it is based on a clever resampling trick of the training set that
is used to train additional estimators with better predictive performance on
training examples that previous estimators in the ensemble struggled with.
While this dependence between individual estimators prevents straightforward
parallel training, AdaBoost estimators can still be trained rather efficiently
since the base estimators of the ensemble are so-called weak learners.
These models are usually very simple and on their own only have limited
predictive power, which means they can generally be trained very efficiently.
The simple nature of these estimators, however, does not diminish the
predictive capabilities of an AdaBoost estimator.
On the contrary, the fact that AdaBoost still manages to achieve highly
competitive results despite the simplicity of its base estimators emphasizes
the power of the particular boosting methodology.

And with this we reached the end of the penultimate post in this short
series on tree-based regression algorithms.
In the next post, we will finally cover the topic this series was originally
motivated by: the powerful concept of *gradient-boosted regression trees*.
