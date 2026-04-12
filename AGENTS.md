# Repo Standards

This repo uses `ultracite` for formatting and linting.

## Commands

- `bun x ultracite fix`: format and auto-fix issues
- `bun x ultracite check`: run lint/format checks
- `bun x ultracite doctor`: inspect tooling setup

## Expectations

- Prefer clear, explicit code over clever shortcuts.
- Keep functions small and focused.
- Use `const` by default and avoid `var`.
- Prefer `unknown` over `any` when a type is not known yet.
- Use `async` / `await` instead of promise chains.
- Remove `console.log`, `debugger`, and dead code before committing.
- Throw `Error` objects with useful messages.
- Use early returns to reduce nesting.

## UI And React

- Use semantic HTML and accessible labels.
- Keep hooks at the top level.
- Do not define components inside other components unless there is a strong reason.
- Use stable keys for lists, not array indexes when avoidable.
- In Next.js, prefer framework primitives like `<Image>` and metadata APIs where appropriate.

## Tests

- Keep tests deterministic and readable.
- Do not commit `.only` or `.skip`.
- Prefer async tests over callback-style tests.

## Review Bar

Ultracite handles most style issues. Focus review effort on:

- correctness
- edge cases
- naming
- accessibility
- performance
- maintainability
