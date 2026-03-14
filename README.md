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
