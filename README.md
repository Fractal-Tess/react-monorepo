![react-monorepo banner](https://capsule-render.vercel.app/api?type=waving&color=0:0f172a,100:2563eb&height=220&section=header&text=react-monorepo&fontSize=46&fontColor=ffffff&desc=Next.js%20%2B%20Convex%20%2B%20Bun%20%2B%20Crawl4AI&descSize=18&descAlignY=62)

# react-monorepo

A compact full-stack workspace with a Next.js app, a local Convex backend, a Bun worker, and a Crawl4AI scraper.

[![Lint Web](https://github.com/Fractal-Tess/react-monorepo/actions/workflows/lint-web.yml/badge.svg)](https://github.com/Fractal-Tess/react-monorepo/actions/workflows/lint-web.yml)
[![Lint Worker](https://github.com/Fractal-Tess/react-monorepo/actions/workflows/lint-worker.yml/badge.svg)](https://github.com/Fractal-Tess/react-monorepo/actions/workflows/lint-worker.yml)
[![Lint Scraper](https://github.com/Fractal-Tess/react-monorepo/actions/workflows/lint-scraper.yml/badge.svg)](https://github.com/Fractal-Tess/react-monorepo/actions/workflows/lint-scraper.yml)
[![Lint Convex](https://github.com/Fractal-Tess/react-monorepo/actions/workflows/lint-convex.yml/badge.svg)](https://github.com/Fractal-Tess/react-monorepo/actions/workflows/lint-convex.yml)
[![Lint Shared](https://github.com/Fractal-Tess/react-monorepo/actions/workflows/lint-shared.yml/badge.svg)](https://github.com/Fractal-Tess/react-monorepo/actions/workflows/lint-shared.yml)
[![Lint UI](https://github.com/Fractal-Tess/react-monorepo/actions/workflows/lint-ui.yml/badge.svg)](https://github.com/Fractal-Tess/react-monorepo/actions/workflows/lint-ui.yml)

![Bun](https://img.shields.io/badge/runtime-bun-black)
![Convex](https://img.shields.io/badge/backend-Convex-FD5C3C)
![Next.js](https://img.shields.io/badge/frontend-Next.js-111111)
![Crawl4AI](https://img.shields.io/badge/scraper-Crawl4AI-1F6FEB)
![Infisical](https://img.shields.io/badge/secrets-Infisical-6C47FF)
![Nix](https://img.shields.io/badge/devshell-Nix-5277C3)

## Stack

- `apps/web`: Next.js app wired to Convex through Infisical.
- `apps/worker`: Bun service with a small HTTP health surface.
- `apps/scraper`: Python + Crawl4AI scraper with CSS and LLM extraction modes.
- `packages/convex`: Convex schema, functions, and the seed entrypoint.
- `packages/shared`: shared TypeScript helpers.
- `packages/ui`: shared shadcn/ui component package.

```mermaid
flowchart LR
  web[apps/web]
  worker[apps/worker]
  scraper[apps/scraper]
  convex[packages/convex]
  shared[packages/shared]
  ui[packages/ui]

  web --> convex
  web --> ui
  web --> shared
  worker --> shared
  scraper --> convex
```

## Quickstart

```bash
bun install
direnv allow
bun run prepare
```

Start the main pieces in separate terminals:

```bash
bun run --cwd packages/convex dev
bun run --cwd packages/convex dashboard
bun run --cwd packages/convex seed
bun run --cwd apps/web dev
bun run --cwd apps/worker dev
```

For the scraper, enter the Nix shell first so Playwright uses the pinned browser from the flake:

```bash
nix develop
bun run --cwd apps/scraper dev
```

## Infisical Paths

- `/web`: `CONVEX_URL`, `CONVEX_SITE_URL`
- `/convex`: `CONVEX_URL`, `CONVEX_SITE_URL`
- `/worker`: `CONVEX_URL`, `CONVEX_SITE_URL`
- `/scraper`: `CRAWL4AI_LLM_PROVIDER`, `CRAWL4AI_LLM_API_TOKEN`, `CRAWL4AI_LLM_BASE_URL`

## Convex Seeding

Seed the local Convex deployment after `convex dev --local` is running:

```bash
bun run --cwd packages/convex seed
```

The seed is idempotent and inserts:

- one welcome message
- one sample scrape run

## Linting

Lint is scoped per package and each package has its own GitHub workflow badge.

```bash
bun run --cwd apps/web lint
bun run --cwd apps/worker lint
bun run --cwd apps/scraper lint
bun run --cwd packages/convex lint
bun run --cwd packages/shared lint
bun run --cwd packages/ui lint
```

## UI Package

Add shared shadcn components from the web app root:

```bash
pnpm dlx shadcn@latest add button -c apps/web
```

Import them from `@workspace/ui`:

```tsx
import { Button } from "@workspace/ui/components/button"
```
