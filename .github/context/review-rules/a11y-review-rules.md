# Accessibility Review Rules (WCAG 2.1 AA)

Rules for WCAG 2.1 AA compliance. All UI changes must be checked against these.

**Severity**: `major` = must fix before merge | `minor` = should fix, can defer

---

## Images & Media

- [ ] a11y-img-alt-missing [major]: Flag if `<img>` or Next.js `<Image>` is missing an `alt` attribute entirely
- [ ] a11y-img-alt-filename [major]: Flag if `alt` contains a filename, URL, or generic filler text like `"image"`, `"photo"`, `"icon"`, `"logo"` without context
- [ ] a11y-img-alt-empty-content [minor]: Flag if `alt=""` is used on an image that conveys information or context (purely decorative images with `role="presentation"` are correct)

## Interactive Elements

- [ ] a11y-button-no-label [major]: Flag if `<button>` has no visible text and no `aria-label` or `aria-labelledby` attribute
- [ ] a11y-link-no-label [major]: Flag if `<a>` has no visible text and no `aria-label` — screen readers will read the URL
- [ ] a11y-link-generic-text [minor]: Flag if link text is `"click here"`, `"read more"`, `"here"`, `"learn more"` without surrounding context that explains the destination
- [ ] a11y-div-as-button [major]: Flag if `<div>` or `<span>` has an `onClick` but is missing `role="button"`, `tabIndex={0}`, and a `onKeyDown` handler for Enter/Space — use `<button>` instead
- [ ] a11y-input-no-label [major]: Flag if `<input>`, `<select>`, or `<textarea>` has no associated `<label>`, `aria-label`, or `aria-labelledby`

## Document Structure

- [ ] a11y-heading-skip [minor]: Flag if heading levels are skipped (e.g., `<h1>` followed directly by `<h3>` with no `<h2>` in between)
- [ ] a11y-landmark-missing [minor]: Flag if new page content is introduced without appropriate landmark elements (`<main>`, `<nav>`, `<header>`, `<footer>`, `<section aria-label="...">`)
- [ ] a11y-list-semantic [minor]: Flag if a visual list is implemented with `<div>` wrappers instead of `<ul>/<li>` or `<ol>/<li>`

## Focus & Keyboard

- [ ] a11y-focus-removed [major]: Flag if `outline: none` or `outline: 0` is applied in CSS/Tailwind (`outline-none`) without a `:focus-visible` replacement style
- [ ] a11y-tabindex-positive [minor]: Flag if `tabIndex` is set to any value greater than `0`
- [ ] a11y-autofocus [minor]: Flag if `autoFocus` is used on an element that is not the primary input of a dialog or search page

## False Positive Suppression

Do **NOT** flag:

- `alt=""` on purely decorative images — this is the correct WCAG pattern
- `tabIndex={-1}` used intentionally to programmatically focus an element
- `aria-hidden="true"` on icon elements that are adjacent to visible labelled text
- `outline-none` in Tailwind when a custom `focus-visible:ring-*` or equivalent is present on the same element or its parent
- Icon-only buttons that have a visually-hidden `<span>` providing the label
