# scraper

Python Crawl4AI scraper app.

You can run it either with `uv` directly or through the local `package.json` scripts, which are wrapped with `infisical run`.

Crawl4AI uses a real browser under the hood, typically Playwright with Chromium, to render pages before extracting markdown, selector-based data, or LLM-driven structured output.

Modes:

- `markdown` for general page scraping
- `css` for selector-based extraction
- `llm` for LLM-assisted extraction

Examples:

```bash
uv run --project apps/scraper scraper markdown https://example.com
uv run --project apps/scraper scraper css https://example.com --schema-file schema.json
uv run --project apps/scraper scraper llm https://example.com --instruction "Extract product data"

bun run --cwd apps/scraper markdown https://example.com
bun run --cwd apps/scraper css https://example.com --schema-file schema.json
bun run --cwd apps/scraper llm https://example.com --instruction "Extract product data"
```

If you are setting this up on a fresh machine, make sure the browser runtime is available. On this machine the app is already working locally.
