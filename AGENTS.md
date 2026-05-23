# Agent Instructions

Guidelines for AI agents working in this codebase. Follow these rules to ensure consistent, high-quality output.

---

## Core Principles

- **Simplicity First** — Make every change as simple as possible. Impact minimal code.
- **No Laziness** — Find root causes. No temporary fixes. Senior developer standards.
- **Minimal Impact** — Touch only what's necessary. Avoid introducing bugs.

---

## Workflow Orchestration

### 1. Plan Node Default

- Enter plan mode for **any** non-trivial task (3+ steps or architectural decisions).
- If something goes sideways: **STOP** and re-plan immediately. Don't keep pushing.
- Use plan mode for verification steps, not just building.
- Write detailed specs upfront to reduce ambiguity.

### 2. Subagent Strategy

- Use subagents liberally to keep the main context window clean.
- Offload research, exploration, and parallel analysis to subagents.
- For complex problems, throw more compute at it via subagents.
- One task per subagent for focused execution.

### 3. Self-Improvement Loop

- After **any** correction from the user: update `tasks/lessons.md` with the pattern.
- Write rules for yourself that prevent the same mistake.
- Ruthlessly iterate on these lessons until the mistake rate drops.
- Review lessons at session start for the relevant project.

### 4. Verification Before Done

- Never mark a task complete without proving it works.
- Diff behavior between main and your changes when relevant.
- Ask yourself: *"Would a staff engineer approve this?"*
- Run tests, check logs, demonstrate correctness.

### 5. Demand Elegance (Balanced)

- For non-trivial changes: pause and ask *"Is there a more elegant way?"*
- If a fix feels hacky: *"Knowing everything I know now, implement the elegant solution."*
- Skip this for simple, obvious fixes — don't over-engineer.
- Challenge your own work before presenting it.

### 6. Autonomous Bug Fixing

- When given a bug report: just fix it. Don't ask for hand-holding.
- Point at logs, errors, failing tests — then resolve them.
- Zero context switching required from the user.
- Go fix failing CI tests without being told how.

---

## Task Management

| Step | Action |
|------|--------|
| **Plan First** | Write plan to `tasks/todo.md` with checkable items |
| **Verify Plan** | Check in before starting implementation |
| **Track Progress** | Mark items complete as you go |
| **Explain Changes** | High-level summary at each step |
| **Capture Lessons** | Update `tasks/lessons.md` after corrections |

---

## Product execution docs (repo root)

When work touches **trip semantics, phases (Explore / Plan / Book), demo dates, ICP, metrics, or tools**, read the bundle under **`../docs/`**. Start with **[`../docs/doc-map-and-conventions.md`](../docs/doc-map-and-conventions.md)** (glossary and “when you change X, update Y”), then the focused file from **[`../docs/README.md`](../docs/README.md)**.
