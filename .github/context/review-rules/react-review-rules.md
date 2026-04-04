# React & Next.js Review Rules

Rules for React patterns and Next.js 16 App Router conventions.

**Severity**: `major` = must fix before merge | `minor` = should fix, can defer

---

## Component Architecture

- [ ] react-client-unnecessary [major]: Flag if `'use client'` is added to a component that has no interactivity, no browser APIs, and no event handlers — it should be a Server Component
- [ ] next-page-client [minor]: Flag if a Next.js page or layout file has `'use client'` when only a child component needs it — push the directive down to the leaf
- [ ] react-large-component [minor]: Flag if a single component file exceeds ~200 lines without a clear reason — consider extracting sub-components
- [ ] react-prop-drilling [minor]: Flag if the same prop is passed more than 2 levels deep through components that don't use it themselves

## Data & State

- [ ] react-state-mutation [major]: Flag if React state is mutated directly (e.g., `state.items.push(...)`) instead of producing a new value via the setter
- [ ] react-effect-deps [major]: Flag if `useEffect` has a missing dependency (a value used inside the effect is not in the dependency array) or uses `// eslint-disable-next-line` to suppress the exhaustive-deps rule without justification
- [ ] react-stale-closure [major]: Flag if a `useCallback` or `useMemo` callback references a prop or state value not listed in its dependency array
- [ ] next-data-fetch-client [minor]: Flag if `fetch()` or an async data call is made inside a Client Component when it could be moved to a Server Component or Server Action

## Rendering & Performance

- [ ] react-key-missing [major]: Flag if `Array.map()` renders JSX elements without a `key` prop
- [ ] react-key-index [minor]: Flag if `key={index}` is used in a list where items can be reordered, filtered, or added — use a stable ID instead
- [ ] next-image-missing [minor]: Flag if a content `<img>` HTML tag is used instead of Next.js `<Image>` component (exception: inline SVGs, icons as `<img>` in `public/`)
- [ ] react-inline-object-prop [minor]: Flag if an object or array literal is created inline as a prop value (`<Comp style={{color: 'red'}}>`) on a component that renders frequently — extract to a constant or `useMemo`

## Next.js Conventions

- [ ] next-hardcoded-url [major]: Flag if a base URL, API endpoint, or external URL is hardcoded as a string literal instead of using an environment variable
- [ ] next-metadata-missing [minor]: Flag if a new `page.tsx` is added without a `metadata` export or `generateMetadata` function
- [ ] next-error-boundary [minor]: Flag if a data-fetching Server Component route doesn't have a corresponding `error.tsx` in the same segment

## False Positive Suppression

Do **NOT** flag:

- `'use client'` on components that use `useState`, `useEffect`, event handlers, or any browser API
- `key={item.id}` or any stable identifier as a key-index issue
- `<img>` for purely decorative or static assets in `public/`
- Data fetching inside Client Components that genuinely need client-side reactivity (e.g., infinite scroll, real-time updates)
- `useEffect` with an empty `[]` dependency array when the effect truly should run once on mount
