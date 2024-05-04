---
title: Projects
---

## Pymanopt

[Pymanopt](https://www.pymanopt.org) is a Python toolbox for numerical
optimization on Riemannian manifolds with support for automatic
differentiation.
Riemannian structures frequently arise in the context of signal processing and
machine learning where optimization domains often form a smooth nonlinear
search space.
To attack such problems, Pymanopt, which is based on the MATLAB toolbox
[Manopt](https://www.manopt.org/), provides a variety of different solvers
(e.g. steepest descent, conjugate gradients, trust-regions), manifolds (e.g.
Stiefel manifold, Grassmannian, positive definite matrices) and
autodiff backends (currently [Autograd](https://github.com/HIPS/autograd),
[TensorFlow](https://www.tensorflow.org/), [PyTorch](https://pytorch.org/) and
[JAX](https://jax.readthedocs.io/en/latest/)).
By leveraging automatic differentiation, the library lowers the entry barrier
for rapid prototyping as the need for laborious calculation of higher-order
derivatives of matrix expressions by hand is removed.

## Lampions

[Lampions](https://github.com/lampions) is an email relaying service leveraging
AWS SES to forward incoming emails on a verified domain to pre-configured
forwarding addresses.
The goal is to insulate a user's primary email address(es) from third-party
services by providing an easy and convenient way to create per-service
forwarding addresses.
The project consists of a command-line utility to configure the necessary AWS
infrastructure and define email routes.
Additionally, a browser extension can be used to define, remove or temporarily
deactivate email aliases in case one wants to stop receiving emails for certain
aliases.
