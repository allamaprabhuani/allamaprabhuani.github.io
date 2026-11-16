---
layout: post
title: "Matrix-free differentiable phase-field fracture solver preprint"
subtitle: "How a differentiable fracture solver connects simulation, GPU computing and inverse analysis."
description: "A short note linking to the arXiv preprint on a matrix-free, differentiable PyTorch solver for phase-field fracture, benchmarks, and inverse analysis."
tags: [phase-field, fracture, pytorch, differentiable-simulation, arxiv]
---

**Publication update:** The PhAST paper was subsequently published in
[*Computer Methods in Applied Mechanics and Engineering*](https://doi.org/10.1016/j.cma.2026.119547).

The preprint for the matrix-free differentiable phase-field fracture solver is
now online:

**A matrix-free, differentiable PyTorch solver for phase-field fracture:
Formulation, benchmarks, and inverse analysis**  
Allamaprabhu Ani, Jean-François Molinari, Ghatu Subhash, and Sathiskumar
Anusuya Ponnusami.  
[arXiv:2606.23458](https://arxiv.org/abs/2606.23458)

The paper presents a PyTorch-native phase-field fracture implementation with
matrix-free explicit dynamics, implicit damage solves, dynamic and quasi-static
benchmarks, and gradient-based inverse recovery of fracture energy.

The public project documentation is available at
[cems-lab.github.io/PhAST](https://cems-lab.github.io/PhAST/), with source code
on [GitHub](https://github.com/CEMS-Lab/PhAST).
