# convex

This package owns the Convex schema, functions, tests, and local seed command.

## Commands

```bash
bun run --cwd databases/convex dev
bun run --cwd databases/convex dashboard
bun run --cwd databases/convex seed
bun run --cwd databases/convex test
```

`seed` runs `convex run init:seed '{}'` against the active deployment and is idempotent.
