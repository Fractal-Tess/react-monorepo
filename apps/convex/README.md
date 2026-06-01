# convex

This package owns the Convex schema, functions, tests, and local seed command.

## Commands

```bash
bun run --cwd apps/convex dev
bun run --cwd apps/convex dashboard
bun run --cwd apps/convex seed
bun run --cwd apps/convex test
```

`seed` runs `convex run init:seed '{}'` against the active deployment and is idempotent.
