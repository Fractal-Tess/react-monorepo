# Environment

Infisical paths in `dev`:

- `/web`: `CONVEX_URL`, `CONVEX_SITE_URL`
- `/convex`: `CONVEX_URL`, `CONVEX_SITE_URL`
- `/worker`: `CONVEX_URL`, `CONVEX_SITE_URL`
- `/scraper`: `CRAWL4AI_LLM_PROVIDER`, `CRAWL4AI_LLM_API_TOKEN`, `CRAWL4AI_LLM_BASE_URL`

Notes:

- `apps/web`, `packages/convex`, and `apps/worker` all point at the same local Convex deployment.
- `apps/scraper` only gets the LLM settings by default. Pass `CONVEX_URL` inline if you want `--save-to-convex`.
- Root `turbo` commands do not inject app secrets directly; each app script does that through its own `infisical run --path=...`.

Useful commands:

```bash
bun run dev
bun run dev:all
bun run seed
bun run convex:data
```
