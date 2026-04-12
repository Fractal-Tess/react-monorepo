# react-monorepo

This is a monorepo with a Next.js app, Convex, a Bun worker app, a Crawl4AI scraper app, and shared workspace packages.

The scraper direction in this repo is Crawl4AI. The older Firecrawl-based scraper path has been removed.

## Adding components

To add components to your app, run the following command at the root of your `web` app:

```bash
pnpm dlx shadcn@latest add button -c apps/web
```

This will place the ui components in the `packages/ui/src/components` directory.

## Using components

To use the components in your app, import them from the `ui` package.

```tsx
import { Button } from "@workspace/ui/components/button";
```
