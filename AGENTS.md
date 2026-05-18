# Habit Tracker — AI Agent Context (AGENTS.md)

Load this file at the start of every AI-assisted session. It gives your AI tool full project context so you get better, more consistent output.

---

## Project Summary

This is a **Stage 3 Habit Tracker PWA** built with Next.js (App Router), TypeScript, Tailwind CSS, and localStorage for persistence. There is no backend, no remote database, and no external auth service. All state is local and deterministic.

The primary goal is **technical discipline and testability**. Mentors will verify the implementation against this spec, run the test suite independently, and check that all required test titles appear in the console output.

---

## What the AI Should Know

### Stack
- Next.js 14+ with App Router
- React 18, TypeScript (strict mode)
- Tailwind CSS (utility-first, no CSS modules)
- localStorage — no Zustand, Redux, or Context unless added carefully
- Vitest + React Testing Library for unit/integration tests
- Playwright for end-to-end tests

### Non-Negotiables
- The `data-testid` attributes in the spec are **not optional**. Every required test id must be present exactly as specified.
- The test titles in `spec/technical-requirements.md` must appear **exactly** in the console output. Do not paraphrase them.
- The localStorage keys must be **exactly**: `habit-tracker-users`, `habit-tracker-session`, `habit-tracker-habits`.
- The exported function names in `src/lib/` must match the spec exactly.
- Habit data must be isolated per user via `userId`. Never show another user's habits.

### File Naming
- React components → PascalCase (`HabitCard.tsx`)
- `src/lib` utilities → lowercase (`slug.ts`, `streaks.ts`)
- Types → PascalCase names inside the file (`User`, `Habit`, `Session`)
- Helper functions → camelCase (`getHabitSlug`, `calculateCurrentStreak`)

---

## Required Utility Functions

### `src/lib/slug.ts`
```ts
export function getHabitSlug(name: string): string
// lowercase → trim → spaces to hyphens → remove non-alphanumeric except hyphens
```

### `src/lib/validators.ts`
```ts
export function validateHabitName(name: string): { valid: boolean; value: string; error: string | null }
// reject empty, reject > 60 chars, return trimmed value
```

### `src/lib/streaks.ts`
```ts
export function calculateCurrentStreak(completions: string[], today?: string): number
// 0 if today not completed; count consecutive days back from today
```

### `src/lib/habits.ts`
```ts
export function toggleHabitCompletion(habit: Habit, date: string): Habit
// add date if absent, remove if present, no duplicates, no mutation
```

---

## Test Suite Requirements

All required test titles must appear **word-for-word** in the test console output. The describe blocks and test titles are fixed — do not rename them.

### Unit tests (`tests/unit/`)
- `getHabitSlug` — 3 tests
- `validateHabitName` — 3 tests
- `calculateCurrentStreak` — 5 tests
- `toggleHabitCompletion` — 4 tests

### Integration tests (`tests/integration/`)
- `auth flow` — 4 tests
- `habit form` — 5 tests

### E2E tests (`tests/e2e/app.spec.ts`)
- `Habit Tracker app` — 10 tests

---

## Common Pitfalls to Avoid

1. **Don't use `window.confirm`** for delete confirmation — it's not testable.
2. **Don't hardcode today's date** — derive it dynamically.
3. **Don't skip `data-testid` attributes** — even on elements you think won't be tested.
4. **Don't mutate the `habit` object** in `toggleHabitCompletion` — return a new object.
5. **Don't render all habits globally** — always filter by `session.userId`.
6. **Don't use `localStorage` directly in components** — go through `src/lib/storage.ts`.
7. **Don't ignore SSR** — localStorage is only available on the client. Guard with `typeof window !== 'undefined'`.

---

## Collaboration Guidelines

- Ask the AI to implement one layer at a time: types → utilities → components → pages → tests.
- After generating utility functions, ask the AI to write the unit tests immediately.
- Review generated code before accepting — especially test assertions. Shallow or empty tests will count against your submission.
- The three design challenges (`spec/design-challenges.md`) are yours to decide. Don't let the AI make those choices without your input.
- Use the AI to draft README sections, but write the trade-offs and limitations in your own words.
