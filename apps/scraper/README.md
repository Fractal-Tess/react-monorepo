# scraper

Python Crawl4AI scraper app.

You can run it either with `uv` directly or through the local `package.json` scripts, which are wrapped with `infisical run`.

Crawl4AI uses a real browser under the hood, typically Playwright with Chromium, to render pages before extracting markdown, selector-based data, or LLM-driven structured output.

Modes:

- `markdown` for general page scraping
- `css` for selector-based extraction
- `llm` for LLM-assisted extraction

If `CONVEX_URL` is set, any mode can also persist its output with `--save-to-convex`.
The scraper uses the official Python `ConvexClient` and records results through the
`scrapes:record` mutation in `packages/convex`.

Personal `vllm` note:

```bash
uv tool run --from 'vllm==0.19.0' vllm serve nicklas373/Qwen3.5-9B-AWQ \
  --port 8005 \
  --chat-template-content-format openai \
  --disable-fastapi-docs \
  --dtype auto \
  --language-model-only \
  --default-chat-template-kwargs '{"enable_thinking": false}' \
  --served-model-name Qwen3.5-9B-AWQ \
  --seed 0 \
  --quantization compressed-tensors \
  --tokenizer Qwen/Qwen3.5-9B \
  --trust-remote-code \
  --max-model-len 16384 \
  --max-num-seqs 8 \
  --gpu-memory-utilization 0.87 \
  --enable-prefix-caching
```

Examples:

```bash
uv run --project apps/scraper scraper markdown https://example.com
uv run --project apps/scraper scraper css https://example.com --schema-file schema.json
uv run --project apps/scraper scraper llm https://example.com --instruction "Extract product data"
uv run --project apps/scraper scraper llm https://example.com --instruction "Extract product data" --save-to-convex

bun run --cwd apps/scraper markdown https://example.com
bun run --cwd apps/scraper css https://example.com --schema-file schema.json
bun run --cwd apps/scraper llm https://example.com --instruction "Extract product data"
```

If you are setting this up on a fresh machine, make sure the browser runtime is available. On this machine the app is already working locally.
