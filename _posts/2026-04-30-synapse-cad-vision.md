---
layout: post
title: "SynaCAD: the synapse, and what it's for"
subtitle: "Why I'm building an AI design partner that's bound by validated solvers, not by what an LLM thinks sounds plausible."
description: "Why I'm building SynaCAD — an AI design partner for mechanical engineering, grounded in validated solvers (Bruhn, Niu, ESDU) rather than LLM plausibility."
date: 2026-04-30
tags: [synacad, vision, mechanics, ai]
---

<div class="word-reel" role="img" aria-label="A CAD that has cognition, intelligence, logic, memory, intent, structure, judgement, and taste.">
  <span class="reel-label">a CAD that has</span>
  <span class="reel-track">
    <span class="reel-word">cognition</span>
    <span class="reel-word">intelligence</span>
    <span class="reel-word">logic</span>
    <span class="reel-word">memory</span>
    <span class="reel-word">intent</span>
    <span class="reel-word">structure</span>
    <span class="reel-word">judgement</span>
    <span class="reel-word">taste</span>
    <span class="reel-word">cognition</span>
  </span>
</div>

## Why "Synapse"?

A synapse is the place where a signal becomes a decision. A neuron alone doesn't think; the *connection*
does. SynaCAD ("Synapse CAD") is the connection between two things that have rarely talked to each other:
the **classical mechanics canon** (Bruhn, Niu, ESDU, Lekhnitskii — a hundred years of structural reasoning)
and **modern generative models** (LLMs that can read your sketch, your photo, your sentence).

It is not "ChatGPT for CAD." It is a working engineer with a textbook open on its lap.

## The vision

> Anyone, anywhere, designing real engineered components from a sentence — and getting back a part that
> a real machine shop can hold tolerances on, with citations from real handbooks for every number.

## What it actually does

<div class="flow-diagram" aria-hidden="true">
  <div class="flow-step">
    <div class="flow-icon flow-in">✎</div>
    <p class="flow-label">describe</p>
    <p class="flow-sub">words · sketch · photo · CAD</p>
  </div>
  <div class="flow-arrow">→</div>
  <div class="flow-step">
    <div class="flow-icon flow-mid"><span class="flow-pulse"></span>∫</div>
    <p class="flow-label">solve</p>
    <p class="flow-sub">validated solvers, citations, mechanics</p>
  </div>
  <div class="flow-arrow">→</div>
  <div class="flow-step">
    <div class="flow-icon flow-out">⎙</div>
    <p class="flow-label">deliver</p>
    <p class="flow-sub">drawing · GD&amp;T · g-code · report</p>
  </div>
</div>

## The non-negotiable

**Every number SynaCAD outputs is computed by a validated solver.** Not invented by the language model,
not interpolated from training data, not vibes. The LLM understands your *intent*, picks the *right
classical method*, and writes the report. The numbers come from a function that, given the same input,
returns the same output — and whose source you can read.

This is the line between "interesting demo" and "thing you can put your name on a drawing for."

## Design decisions worth naming

1. **Solver-first, LLM-second.** The model decides which calculation to run; the calculation runs in
   plain Python. No tool call, no hallucinated stress.
2. **Citations for every number.** Every result links back to a page in Bruhn / Niu / ESDU or to a
   peer-reviewed paper. If we can't cite it, we don't ship it.
3. **Open by default.** The bolted-joint solver is already MIT-licensed. The phase-field solver goes
   public the moment the paper hits arXiv. SynaCAD's classical-tools layer follows.
4. **Manufacturing-aware from day one.** Drawings come out with GD&T that's actually holdable on a
   real shop floor. We are not trying to impress a CAD reviewer; we are trying to make a real part.
5. **No mystery in the loop.** A junior engineer should be able to read SynaCAD's report and learn
   *why* the part is sized the way it is, not just trust the answer.

## Where we're at

In active development. The 2026 fellowship pitch is complete, and the project is now being shaped into a public,
locally runnable tool. Public alpha planned for 2026.

If this resonates — collaborators, manufacturers, advisors, students who want to test it on their own
parts — [get in touch](/#elsewhere).

---

<p class="muted">More about SynaCAD &rarr; <a href="https://allamaprabhuani.github.io/synacad/">the project site</a>.</p>
