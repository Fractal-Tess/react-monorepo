from __future__ import annotations

import json
import os
from dataclasses import dataclass
from typing import Any


@dataclass(slots=True)
class CrawlSummary:
    url: str
    title: str | None
    markdown: str


def summarize_markdown(markdown: str, *, max_chars: int = 280) -> str:
    normalized = " ".join(markdown.split())
    if len(normalized) <= max_chars:
        return normalized
    return normalized[: max_chars - 1].rstrip() + "…"


def _coerce_markdown(result: Any) -> str:
    markdown = getattr(result, "markdown", "")
    if isinstance(markdown, str):
        return markdown
    raw_markdown = getattr(markdown, "raw_markdown", "")
    return raw_markdown if isinstance(raw_markdown, str) else str(markdown)


def _coerce_json_payload(value: Any) -> list[dict[str, Any]]:
    if isinstance(value, list):
        return value
    if isinstance(value, str) and value:
        parsed = json.loads(value)
        return parsed if isinstance(parsed, list) else [parsed]
    if isinstance(value, dict):
        return [value]
    return []


async def crawl_markdown(url: str) -> CrawlSummary:
    from crawl4ai import AsyncWebCrawler

    async with AsyncWebCrawler() as crawler:
        result = await crawler.arun(url=url)

    return CrawlSummary(
        url=url,
        title=getattr(result, "title", None),
        markdown=summarize_markdown(_coerce_markdown(result)),
    )


async def extract_with_css(url: str, schema: dict[str, Any]) -> list[dict[str, Any]]:
    from crawl4ai import AsyncWebCrawler, CacheMode, CrawlerRunConfig, JsonCssExtractionStrategy

    config = CrawlerRunConfig(
        cache_mode=CacheMode.BYPASS,
        extraction_strategy=JsonCssExtractionStrategy(schema),
    )

    async with AsyncWebCrawler() as crawler:
        result = await crawler.arun(url=url, config=config)

    return _coerce_json_payload(getattr(result, "extracted_content", None))


async def extract_with_llm(
    url: str,
    instruction: str,
    *,
    provider: str | None = None,
    api_token: str | None = None,
    base_url: str | None = None,
) -> list[dict[str, Any]]:
    from crawl4ai import AsyncWebCrawler
    from litellm import acompletion

    resolved_provider = provider or os.environ.get("CRAWL4AI_LLM_PROVIDER")
    resolved_token = api_token or os.environ.get("CRAWL4AI_LLM_API_TOKEN")
    resolved_base_url = base_url or os.environ.get("CRAWL4AI_LLM_BASE_URL")

    if not resolved_provider or not resolved_token:
        raise ValueError("CRAWL4AI_LLM_PROVIDER and CRAWL4AI_LLM_API_TOKEN are required")

    async with AsyncWebCrawler() as crawler:
        result = await crawler.arun(url=url)

    markdown = _coerce_markdown(result)
    response = await acompletion(
        model=resolved_provider,
        messages=[
            {
                "role": "system",
                "content": "You extract structured data from rendered web pages. Return valid JSON only.",
            },
            {
                "role": "user",
                "content": f"{instruction}\n\nPage URL: {url}\n\nPage content:\n{markdown}",
            },
        ],
        api_key=resolved_token,
        api_base=resolved_base_url,
        temperature=0,
        response_format={"type": "json_object"},
    )
    content = response.choices[0].message.content
    return _coerce_json_payload(content)
