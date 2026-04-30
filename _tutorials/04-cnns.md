---
title: "Convolutional Neural Networks"
subtitle: "Convolutions, pooling, receptive fields. Build a CNN that classifies images, then read what it actually learned."
level: intermediate
status: coming-soon
order: 4
tags: [cnn, vision, pytorch]
---

Convolutional networks are mostly two ideas — local connectivity and weight sharing — repeated.
This tutorial walks through both, then builds a small CNN that classifies images, then opens
the trained network and shows you what its filters actually look like.

## What's in here

- what a 2D convolution does to an image, with pictures
- pooling: max vs average, when each one is the right call
- receptive fields and why deeper networks see more
- a small CNN in PyTorch, trained on CIFAR-10
- visualising learned filters and feature maps
- transfer learning from a pretrained backbone (ResNet)
- common failure modes: distribution shift, adversarial examples (a brief tour)

## Prerequisites

- Tutorial 3 (NN intro)
- A GPU helps but isn't required (Colab gives you one)
