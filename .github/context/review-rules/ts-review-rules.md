# TypeScript Review Rules

Rules for TypeScript quality and type safety.

**Severity**: `major` = must fix before merge | `minor` = should fix, can defer  
**Format**: `- [ ] rule-id [severity]: trigger condition`

---

## Type Safety

- [ ] ts-no-any [major]: Flag if `any` type is used without a justification comment (`// typed as any because...`)
- [ ] ts-non-null-assert [major]: Flag if `!` non-null assertion is used on a value that could realistically be null/undefined at runtime
- [ ] ts-type-assertion-unsafe [minor]: Flag if `as SomeType` bypasses type checking in a way that could cause a runtime error; prefer a type guard instead
- [ ] ts-implicit-return-type [minor]: Flag if an exported function or custom hook is missing an explicit return type annotation

## Code Quality

- [ ] ts-unused-variable [major]: Flag if a variable, import, or parameter is declared but never used (exception: `_`-prefixed parameters)
- [ ] ts-console-log [minor]: Flag if `console.log` or `console.debug` remains in production code (`console.error` / `console.warn` are acceptable)
- [ ] ts-todo-untracked [minor]: Flag if `// TODO` or `// FIXME` is added without a GitHub issue reference
- [ ] ts-magic-number [minor]: Flag if a numeric literal is used inline without a named constant (exception: 0, 1, -1, 100 in arithmetic)

## False Positive Suppression

Do **NOT** flag:
- `any` with an explicit `// typed as any because...` comment
- Type assertions in test/spec files
- `_`-prefixed variables (intentionally unused)
- `0`, `1`, `-1`, `100` in arithmetic or percentage expressions
- `console.error` / `console.warn` calls
