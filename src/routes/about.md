---
title: About
header: img/mug.jpg
---

> One day I will find the right words, and they will be simple.
>
> <cite>-- Jack Kerouac (kind of...)</cite>

## Contact

<contact@nkoep.net>

## CV

### Professional Experience

- February 2021--present: Data Scientist (Logistics) at [Delivery
  Hero](https://www.deliveryhero.com/), Berlin, Germany
- September 2014--August 2019: Research assistant at the Institute for
  Theoretical Information Technology, RWTH Aachen University, Aachen, Germany

### Education

- Dr.-Ing. (PhD) from the Faculty of Electrical Engineering and Information
  Technology, RWTH Aachen University, Germany
- M.Sc. in Electrical Engineering, Information Technology and Computer
  Engineering, RWTH Aachen University, Germany
- B.Sc. in Electrical Engineering, Information Technology and Computer
  Engineering, RWTH Aachen University, Germany

### Publications

<https://scholar.google.com/citations?user=CpQ1YvMAAAAJ>

## Projects

### Pymanopt

[Pymanopt](https://www.pymanopt.org) is a Python toolbox for numerical
optimization on Riemannian manifolds with support for automatic
differentiation.
Riemannian structures frequently arise in the context of signal processing and
machine learning where constraint sets often form a smooth nonlinear search
space.
To attack such problems, Pymanopt, which is based on the MATLAB toolbox
[Manopt](https://www.manopt.org/), provides a variety of different solvers
(e.g. steepest descent, conjugate gradients, trust-regions), manifolds (e.g.
Stiefel manifold, Grassmannian, positive definite matrices) and
autodiff backends (currently [Autograd](https://github.com/HIPS/autograd),
[PyTorch](https://pytorch.org/),
[Theano](http://www.deeplearning.net/software/theano/) and
[TensorFlow](https://www.tensorflow.org/)).
By appealing to automatic differentiation, the toolbox lowers the entry barrier
for rapid prototyping as laborious calculations of higher-order derivatives by
hand are eliminated.

### Lampions

[Lampions](https://github.com/lampions) is an email relaying service leveraging
AWS SES to forward incoming emails on a verified domain to pre-configured
forwarding addresses.
The goal is to insulate a user's primary email address(es) from third-party
services by providing an easy and convenient way to create per-service
forwarding addresses.
The project consists of a command-line utility to configure the necessary AWS
infrastructure and define email routes.
Additionally, a browser extension can be used to define, remove or temporarily
deactivate email aliases in case one wants to stop receiving emails on certain
aliases.
