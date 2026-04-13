# convex

This package owns the Convex schema, functions, tests, and local seed command.

## Commands

```bash
bun run --cwd packages/convex dev
bun run --cwd packages/convex dashboard
bun run --cwd packages/convex seed
bun run --cwd packages/convex test
```

`seed` runs `convex run init:seed '{}'` against the active deployment and is idempotent.
