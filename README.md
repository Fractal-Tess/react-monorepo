![react-monorepo banner](https://capsule-render.vercel.app/api?type=waving&color=0:0f172a,100:2563eb&height=220&section=header&text=react-monorepo&fontSize=46&fontColor=ffffff&desc=Next.js%20%2B%20Convex%20%2B%20Bun%20%2B%20Crawl4AI&descSize=18&descAlignY=62)

# react-monorepo

A compact full-stack workspace with a Next.js app, a local Convex backend, a Bun worker, and a Crawl4AI scraper.

[![Lint](https://github.com/Fractal-Tess/react-monorepo/actions/workflows/lint.yml/badge.svg?branch=main&event=push)](https://github.com/Fractal-Tess/react-monorepo/actions/workflows/lint.yml?query=branch%3Amain+event%3Apush)

![Bun](https://img.shields.io/badge/runtime-bun-black)
![Convex](https://img.shields.io/badge/backend-Convex-FD5C3C)
![Next.js](https://img.shields.io/badge/frontend-Next.js-111111)
![Crawl4AI](https://img.shields.io/badge/scraper-Crawl4AI-1F6FEB)
![Infisical](https://img.shields.io/badge/secrets-Infisical-6C47FF)
![Nix](https://img.shields.io/badge/devshell-Nix-5277C3)

![react-monorepo front page](./docs/images/frontpage.png)

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
  worker --> convex
  worker --> shared
  scraper --> convex
  scraper --> worker
```

## Quickstart

```bash
bun install
direnv allow
bun run prepare
```

Start the main pieces:

```bash
bun run dev
bun run convex:dashboard
bun run seed
```

For the scraper, enter the Nix shell first so Playwright uses the pinned browser from the flake:

```bash
nix develop
bun run --cwd apps/scraper dev
```

If you want the scraper running too:

```bash
bun run dev:all
```

## Environment

See [docs/environment.md](./docs/environment.md).

## Convex Local Data

Convex recommends two ways to inspect local data:

```bash
bun run convex:dashboard
bun run convex:data
```

Both helpers in this repo explicitly target the local deployment.

## Convex Seeding

Seed the local Convex deployment after `bun run dev` has started Convex:

```bash
bun run seed
```

The seed is idempotent and inserts:

- one welcome message
- one sample scrape run

## Linting

```bash
bun run lint
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
