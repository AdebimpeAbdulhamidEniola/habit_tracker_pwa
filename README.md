# Habit Tracker — Stage 3 PWA Challenge

Build a mobile-first Habit Tracker Progressive Web App with local authentication, streak tracking, and full offline support.

---

## The Challenge

This is a **Stage 3 implementation challenge**. There is no Figma file — you make the design decisions. The spec defines behavior and test contracts; you decide the visual design and UX polish.

### What You're Building

A habit tracking app where users can:

- Sign up and log in with email and password (local auth, no backend)
- Create, edit, and delete personal habits
- Mark habits complete each day and track streaks
- Reload the app and find everything exactly as they left it
- Install the app to their home screen and use it offline

---

## Project Structure

```
habit-tracker/
├── spec/
│   ├── product-definition.md       # What, who, why
│   ├── core-requirements.md        # 12 core + 6 stretch features
│   ├── design-challenges.md        # 3 UX areas you design yourself
│   ├── technical-requirements.md   # Stack, routes, storage, tests
│   └── differentiators.md          # 5 optional enhancements — pick 1–2
├── guidance/
│   ├── brand-kit.md                # Colors, typography, spacing
│   ├── patterns.md                 # UI/UX dos and don'ts
│   └── accessibility.md            # WCAG 2.1 AA checklist
├── AGENTS.md                       # AI collaboration context
├── CLAUDE.md                       # Points to AGENTS.md
├── README-template.md              # Template for your solution README
└── README.md                       # This file
```

---

## Getting Started

1. **Read the spec** — Start with `spec/product-definition.md`, then `spec/core-requirements.md`. Know what you're building before writing code.

2. **Review the brand kit** — `guidance/brand-kit.md` gives you colors, typography, and spacing tokens. Use them as your design foundation.

3. **Check the patterns** — `guidance/patterns.md` has concrete dos and don'ts for the key UI moments in this app.

4. **Load AI context** — `AGENTS.md` gives AI tools like Claude full project context. Load it at the start of every AI session.

5. **Pick your differentiators** — Read `spec/differentiators.md` and pick 1–2 that match your strengths. They're what make this submission yours.

6. **Build in layers** — Types → utilities → components → pages → tests. Don't skip the test layer.

7. **Document as you go** — Use `README-template.md` for your solution README.

---

## Working with AI

`AGENTS.md` and `CLAUDE.md` give AI tools full project context — stack, contracts, non-negotiables. Load them at the start of each session.

Lean on AI for implementation, but the design decisions are yours. The three design challenges in `spec/design-challenges.md` are where your product thinking matters most. Review all generated code — shallow or misleading tests will count against your submission.

---

## Your Solution

Your public repo should contain:

- Your application code
- Your completed README (rename `README-template.md` → `README.md`)
- Your test suite passing with ≥ 80% line coverage on `src/lib`

The `spec/`, `guidance/`, `AGENTS.md`, `CLAUDE.md`, and `README-template.md` files are gitignored — they're your development reference, not part of the finished product.

---

## Questions?

Refer to the spec files in this repo. If anything is ambiguous, the `spec/technical-requirements.md` is the source of truth.
