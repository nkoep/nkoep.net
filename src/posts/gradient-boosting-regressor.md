---
title: "Tree-Based Regression Methods (Part IV): Gradient-Boosted Trees"
date: February 14, 2021
---

## Introduction

In the final post of this short series on tree-based regression methods we
cover the topic that inspired this series in the first place.
While the previous [post](/p/adaboost-regressor) introduced AdaBoost as a
classical approach to boosting, today's post features gradient boosting, in
particular _gradient-boosted decision trees_.
Recall that the term _boosting_ refers to the use of so-called weak learners
with limited predictive power, which cooperatively _boost_ their individual
predictions.
