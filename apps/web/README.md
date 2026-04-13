# web

This app reads secrets from Infisical path `/web`.

Expected envs:

- `CONVEX_URL`
- `CONVEX_SITE_URL`
- `NEXT_ALLOWED_DEV_ORIGINS` optional, comma-separated

Env access in this app is centralized through `apps/web/env.ts` using `@t3-oss/env-nextjs`.

Use the existing scripts:

```bash
bun run --cwd apps/web dev
bun run --cwd apps/web build
bun run --cwd apps/web start
```

They already run through:

```bash
infisical run --path=/web -- ...
```
