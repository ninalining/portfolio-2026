<!--
SYNC IMPACT REPORT
==================
Version change: N/A → 1.0.0 (initial ratification)
Modified principles: none (initial)
Added sections: Core Principles (I–VI), Tech Stack Constraints, Development Workflow, Governance
Removed sections: none
Templates checked:
  ✅ .specify/templates/plan-template.md — Constitution Check section present, no updates needed
  ✅ .specify/templates/spec-template.md — aligned with requirement clarity and AC format
  ✅ .specify/templates/tasks-template.md — test task guidance aligned with testing principle
  ✅ .specify/templates/constitution-template.md — source template, no changes needed
Follow-up TODOs: none
-->

# portfolio-2026 Constitution

## Core Principles

### I. TypeScript-First (NON-NEGOTIABLE)

All new code MUST be written in TypeScript. Use of `any` is forbidden unless
the type is genuinely unknowable and the usage is explicitly justified in a
comment. Implicit `any` from missing types or lazy inference is not acceptable.

**Rationale**: TypeScript is the primary safety net for a solo-maintained
codebase. Weak typing defeats the purpose of the toolchain.

### II. Minimal Dependencies

New external dependencies MUST NOT be introduced unless the spec explicitly
requires them. Prefer built-in Next.js and React capabilities first. When a
dependency is introduced, it must be evaluated for bundle impact and maintenance
risk before inclusion.

**Rationale**: Every dependency is a long-term maintenance liability and a
potential supply-chain vulnerability. A portfolio project must stay lean.

### III. Performance & Core Web Vitals

Every feature MUST preserve or improve Core Web Vitals (LCP < 2.5s, CLS < 0.1,
INP < 200ms). React rendering paths MUST be kept simple — no premature
optimisation, but no unnecessary re-renders either.

**Rationale**: Performance is a visible engineering signal in a portfolio.
Visitors judge load speed before they read content.

### IV. Accessibility (WCAG AA)

All UI MUST meet WCAG AA baseline: semantic HTML, keyboard navigability, visible
focus states, and ARIA labels where native semantics are insufficient. Every
image MUST have meaningful `alt` text.

**Rationale**: Accessibility is non-negotiable for a professional portfolio
targeting engineering roles. It also reflects the builder's values.

### V. Scope Discipline

Implementations MUST NOT exceed the spec. No unrequested features, no
speculative refactors, no "while I'm here" improvements. Changes MUST be small
and focused. If ambiguity would change implementation scope, it must be surfaced
to the author before coding begins.

**Rationale**: Scope creep is the primary source of debt in solo projects. The
spec is the contract — honour it precisely.

### VI. Security & Data Privacy

Secrets, tokens, API keys, and credentials MUST NEVER be committed to the
repository. `.env*` files MUST be gitignored. All external inputs MUST be
validated at system boundaries. GDPR-aware defaults apply: collect no personal
data without explicit need and user consent.

**Rationale**: The repo is public. A single leaked credential or tracking
violation creates reputational and legal risk.

## Tech Stack Constraints

- **Framework**: Next.js 16 App Router — follow `src/app` structure
- **Language**: TypeScript (see Principle I)
- **Styling**: Tailwind CSS v4 — use design tokens from `globals.css` via
  `var(--...)` only; no hardcoded colour, spacing, or typography values
- **Package manager**: pnpm only — never use npm or yarn commands
- **Rendering**: Prefer Server Components; use Client Components only when
  interactivity requires it
- **Type colocation**: All `type` and `interface` definitions MUST live in
  dedicated `.ts` files under `src/types/`. `.tsx` component files MUST only
  import types — never define them inline.

## Development Workflow

- Feature branches MUST be cut from `develop`
- Each commit MUST be scoped to a single logical task
- Every PR MUST pass all quality gates before merge:
  - `pnpm lint` — zero errors
  - `pnpm type-check` — zero errors
  - `pnpm build` — successful production build
  - `pnpm test` — if tests exist in scope for the feature
- Non-trivial logic MUST have a Vitest unit test
- Key user flows MUST have at least one Playwright smoke test

## Governance

This constitution supersedes all other guidelines including `copilot-instructions.md`
where they conflict. In case of conflict, the constitution takes precedence.

**Amendment procedure**:
1. Propose the change with rationale
2. Identify which principle(s) are affected and why the amendment is necessary
3. Increment version: MAJOR for removals/redefinitions, MINOR for additions,
   PATCH for clarifications
4. Update `LAST_AMENDED_DATE`
5. Re-validate all dependent template files for alignment

All agents (Spec, Plan, Implement, Analyze) MUST read this constitution before
operating. Complexity MUST be justified against the principles. When in doubt,
the simpler, more maintainable solution wins.

**Version**: 1.1.0 | **Ratified**: 2026-03-14 | **Last Amended**: 2026-03-15
