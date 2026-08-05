---
layout: default
title: "PhAST: Evidence and Scope"
description: "A concise evidence summary for PhAST, the PyTorch-native matrix-free phase-field fracture research code."
permalink: /phast-evidence/
---

<article class="evidence-page">
  <header class="evidence-header">
    <p class="section-kicker">Research software</p>
    <h1>PhAST: evidence, scope, and next questions</h1>
    <p class="evidence-lede">PhAST is a public PyTorch-native research codebase for matrix-free phase-field fracture. This page is a short route through the published formulation, examples, and boundaries of the current evidence.</p>
    <p class="evidence-actions"><a class="action-primary" href="https://cems-lab.github.io/PhAST/">Read the documentation</a><a class="action-secondary" href="https://arxiv.org/abs/2606.23458">Read the preprint</a><a class="action-secondary" href="https://github.com/CEMS-Lab/PhAST">Browse the source</a></p>
  </header>

  <section>
    <p class="section-kicker">The problem</p>
    <h2>Differentiate a fracture workflow without hiding the mechanics</h2>
    <p>Phase-field fracture couples mechanics, damage evolution, irreversibility, and numerical solution choices. PhAST implements a matrix-free PyTorch route so that the relevant operations can support GPU execution and selected autograd-compatible analyses, while the finite-element mechanics remain explicit in the code and documentation.</p>
  </section>

  <section class="evidence-grid" aria-label="PhAST evidence summary">
    <article>
      <p class="case-label">FORMULATION</p>
      <h2>What is implemented</h2>
      <p>The public project documents phase-field fracture examples with explicit dynamics, damage solves, and inverse-analysis demonstrations. For equations, assumptions, and example configuration, use the documentation and associated preprint rather than this summary.</p>
    </article>
    <article>
      <p class="case-label">BENCHMARKS</p>
      <h2>What is demonstrated</h2>
      <p>The preprint presents dynamic and quasi-static benchmark material alongside gradient-based recovery of fracture energy. Each result remains tied to its stated mesh, hardware, precision, material model, and numerical settings.</p>
    </article>
    <article>
      <p class="case-label">INVERSE ANALYSIS</p>
      <h2>Why differentiability matters</h2>
      <p>Autograd-compatible routes make parameter recovery and related inverse questions practical to study. A useful inverse result still requires observability checks, gradient verification, and a forward model that is valid for the target experiment.</p>
    </article>
  </section>

  <section>
    <p class="section-kicker">Interpretation</p>
    <h2>What the current record does not claim</h2>
    <ul class="evidence-list">
      <li>It does not claim a universal speedup over commercial or open-source solvers.</li>
      <li>It does not treat a learned proposal as a replacement for the mechanics or damage solver.</li>
      <li>It does not transfer a benchmark result to a new geometry, material, or loading path without validation.</li>
    </ul>
  </section>

  <section>
    <p class="section-kicker">Next evidence</p>
    <h2>What would make the case stronger</h2>
    <ul class="evidence-list">
      <li>Reproducible profiling on a declared hardware and numerical configuration.</li>
      <li>Matched validation against an independently configured reference problem.</li>
      <li>An inverse-analysis case with a documented observation model and noise sensitivity.</li>
    </ul>
  </section>
</article>
