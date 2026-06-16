---
layout: post
title: "Software 3.0: The Case for Agent-Native Infrastructure"
subtitle: "Building the next generation of computational tools for AI orchestration"
date: 2026-06-16
tags: [software-engineering, AI, infrastructure]
---

Most software is still built for humans clicking through screens.

Our docs say things like *"go to this URL, click this button, open this settings panel."* But increasingly, the user is not the human directly. **The user is the human's agent.**

This fundamentally changes what we are building. We are entering the era of what Andrej Karpathy calls *Software 3.0*. If Software 1.0 was humans writing explicit code, and Software 2.0 was neural networks learning into weights, Software 3.0 is humans programming LLMs through prompts, context, tools, and instructions. The context window itself is the new program.

### The Agentic Inflection Point

Recently, we've crossed a major threshold. The default workflow has shifted. The unit of programming is no longer typing lines of code; it is delegating "macro actions" to agents:
- *"Implement this feature."*
- *"Refactor this subsystem."*
- *"Write tests, run them, and fix failures."*

The programmer is increasingly not just a code writer, but an orchestrator of agents. But to orchestrate effectively, the underlying products and repositories must support them. This means products desperately need **agent-native surfaces**.

### Sensors and Actuators

I think about this in terms of sensors and actuators. A sensor turns some state of the world into digital information. An actuator lets an agent change something. The future stack is agents using sensors and actuators on behalf of people and organizations.

To support this stack, our repositories and tools need to provide:
- **Markdown docs (`llms.txt`)**: AI-readable documentation that provides pure context without the UI bloat.
- **CLIs and APIs**: Headless setup flows and predictable endpoints.
- **MCP Servers**: Direct pipes for LLMs to safely read your data and use your tools.
- **Structured Logs and Machine-readable schemas**: Parsable JSON telemetry instead of messy `stdout` text.
- **Copy-pasteable agent instructions**: Configuration files like `.cursorrules` that define exactly how an agent should interact with your codebase.
- **Safe permissioning & Auditable actions**: Because an agent acting on your behalf needs guardrails and a paper trail.

### Verifiability vs. Specification

Traditional software automates what you can *specify*. LLMs automate what you can *verify*. If a task has an automatic reward or success signal—like tests passing, a build succeeding, or a structured log output matching a schema—an agent can autonomously iterate and correct itself.

If your repository only outputs human-readable terminal text or relies on GUI clicks, you break the agent's verification loop. But if your software emits structured telemetry, the agent can close the loop entirely on its own. It's why coding agents feel dramatically better than ordinary chatbots: they have an environment to verify their work against.

### The Software That Disappears

As multimodal models improve, a lot of traditional "glue" software—the UI scaffolding, the brittle shell scripts full of conditionals—will disappear. The neural network will directly transform input media into output media.

What remains are the core primitives: the raw capabilities, the verifiable environments, and the structured context. We need to stop building purely for the human eye and start building agent-native infrastructure.
