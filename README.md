# portfolio-2026

A personal portfolio website (2026 edition) built with the Next.js App Router.

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- ESLint 9

## Local Development

### 1) Install dependencies

```bash
pnpm install
```

### 2) Start the development server

```bash
pnpm dev
```

Then open: <http://localhost:3000>

## Common Commands

```bash
# Development
pnpm dev

# Production build
pnpm build

# Start production server
pnpm start

# Lint
pnpm lint

# Type check
pnpm type-check
```

## Project Structure

```text
.
├── public/
├── src/
│   └── app/
│       ├── globals.css
│       ├── layout.tsx
│       └── page.tsx
├── .github/
│   ├── workflows/       # CI pipeline
│   ├── agents/          # Copilot agent definitions (speckit + codereview)
│   ├── chatmodes/       # VS Code chat modes
│   ├── context/         # Code review rule sets
│   └── copilot-instructions.md
├── .specify/            # Spec-kit workflow (constitution, templates, scripts)
├── specs/               # Per-feature spec and plan documents
├── introduction/        # Project plan and notes
├── next.config.ts
├── tsconfig.json
└── eslint.config.mjs
```

## Entry Points

- Page entry: `src/app/page.tsx`
- Global layout: `src/app/layout.tsx`
- Global styles: `src/app/globals.css`

## License

This project is licensed under the MIT License. See [LICENSE](./LICENSE) for details.
