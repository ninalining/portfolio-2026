# Security Review Rules

Rules based on OWASP Top 10, applied to Next.js 16 web applications.

**Severity**: `major` = must fix before merge | `minor` = should fix, can defer

---

## Secrets & Credentials

- [ ] sec-hardcoded-secret [major]: Flag if a string literal resembles an API key, token, password, or private credential — patterns include long hex/base64 strings, prefixes like `sk-`, `ghp_`, `xoxb-`, `Bearer `
- [ ] sec-env-client-exposed [major]: Flag if `NEXT_PUBLIC_` prefix is added to an environment variable that contains secret data (private API keys, auth tokens, database credentials)
- [ ] sec-dotenv-committed [major]: Flag if any `.env`, `.env.local`, `.env.production`, or `.env.staging` file appears in the diff

## Injection & XSS

- [ ] sec-dangerous-html [major]: Flag if `dangerouslySetInnerHTML` receives a value derived from user input, an API response, URL parameters, or any untrusted source without explicit sanitization (e.g., DOMPurify)
- [ ] sec-eval-usage [major]: Flag if `eval()`, `new Function(string)`, or `setTimeout(string, ...)` is used anywhere
- [ ] sec-template-injection [major]: Flag if a user-controlled string is interpolated into an HTML string, SQL query, or shell command

## Redirects & SSRF

- [ ] sec-unvalidated-redirect [major]: Flag if a redirect destination URL is constructed from user input (query params, form fields, route params) without validation against an explicit allowlist
- [ ] sec-ssrf-fetch [major]: Flag if `fetch()` in a Server Component or API route (`route.ts`) constructs a URL from user-controlled input without validation — an attacker could target internal services
- [ ] sec-missing-input-validation [major]: Flag if an API route handler (`route.ts`) reads from `request.json()`, `searchParams`, or route params and uses those values without validating type, length, or format

## Configuration

- [ ] sec-cors-wildcard [major]: Flag if a CORS `Access-Control-Allow-Origin: *` header is set on API routes that handle authenticated requests or return private data
- [ ] sec-content-type-missing [minor]: Flag if a `NextResponse.json()` or custom `Response` in an API route doesn't let Next.js infer the content type — only flag if a generic `Response` is used without a `Content-Type` header

## False Positive Suppression

Do **NOT** flag:
- Placeholder strings like `"your-api-key-here"` or `"<REPLACE_ME>"`
- `dangerouslySetInnerHTML` where the source is a hardcoded constant string defined in the same file
- Public API keys (e.g., analytics measurement IDs) correctly using `NEXT_PUBLIC_` prefix
- `NEXT_PUBLIC_` variables for genuinely public configuration (site URL, feature flags, public API base URLs)
- Sanitized HTML that explicitly passes through DOMPurify or an equivalent library
