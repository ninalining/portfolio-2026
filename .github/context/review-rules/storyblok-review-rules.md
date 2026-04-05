# Storyblok CMS Review Rules

Rules for Storyblok headless CMS integration in this project.

> **Architecture note**: This project uses Storyblok as a **headless API only** via
> server-side fetching. There is no visual editor integration — `storyblokEditable` is
> intentionally absent. All CMS data flows through `src/lib/storyblok.ts`.

**Severity**: `major` = must fix before merge | `minor` = should fix, can defer

---

## Data Fetching

- [ ] sb-cache-missing [minor]: Flag if a new public `async function` in `src/lib/storyblok.ts`
      fetches from the Storyblok API but is not wrapped with React's `cache()` — all fetches must be
      deduplicated per request
- [ ] sb-version-hardcoded [major]: Flag if the string `'published'` or `'draft'` is hardcoded
      directly as the `version` argument instead of using the module-level `version` constant derived
      from `process.env.NODE_ENV`
- [ ] sb-fetch-in-component [major]: Flag if a Storyblok API call (`getStoryblokApi()` or `api.get(...)`)
      is made directly inside any `.tsx` component file — all CMS fetches must go through `src/lib/storyblok.ts`

## Type Safety & Nullability

- [ ] sb-optional-field [major]: Flag if a CMS content field is accessed and used as a
      non-nullable type without a fallback (e.g. `c.title` typed as `string` when it could be
      `undefined` in Storyblok) — always apply a fallback: `c.title ?? ''`
- [ ] sb-untyped-story [minor]: Flag if raw `data.story.content` fields are spread or returned
      without a typed mapping step — always map CMS response fields to typed domain objects (defined in
      `src/types/`) before returning from a fetch function

## i18n & Locale

- [ ] sb-locale-missing [major]: Flag if a `get*()` function fetches translatable content from
      Storyblok but does not pass the `language` parameter via `getLanguage(locale)` — omitting this
      will always return the default language regardless of the active locale

## False Positive Suppression

Do **NOT** flag:

- `cache()` on `getStoryblokApi` / `storyblokInit` — only data-fetching functions need it
- The top-level `version` constant in `storyblok.ts` — this is the correct pattern
- Pure utility helpers (`splitMultilineList`, `splitCsvList`, `parseSortOrder`, `resolveAccent`) —
  these operate on already-fetched data and don't need caching
- Fields typed as `string | undefined` when they are mapped with an explicit `?? ''` fallback
- `isSkillCategoryKey` and similar type guards — these are correct narrowing helpers
