# scraper-crawl4ai

Python Crawl4AI scraper app.

Crawl4AI uses a real browser under the hood, typically Playwright with Chromium, to render pages before extracting markdown, selector-based data, or LLM-driven structured output.

Modes:

- `markdown` for general page scraping
- `css` for selector-based extraction
- `llm` for LLM-assisted extraction

Examples:

```bash
uv run --project apps/scraper-crawl4ai scraper-crawl4ai markdown https://example.com
uv run --project apps/scraper-crawl4ai scraper-crawl4ai css https://example.com --schema-file schema.json
uv run --project apps/scraper-crawl4ai scraper-crawl4ai llm https://example.com --instruction "Extract product data"
```

If you are setting this up on a fresh machine, make sure the browser runtime is available. On this machine the app is already working locally.
