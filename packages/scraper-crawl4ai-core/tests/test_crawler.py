from types import SimpleNamespace

import pytest

from scraper_crawl4ai_core.crawler import (
    crawl_markdown,
    extract_with_css,
    extract_with_llm,
    summarize_markdown,
)


def test_summarize_markdown_normalizes_whitespace() -> None:
    assert summarize_markdown("Hello\n\nworld   from\t Crawl4AI") == "Hello world from Crawl4AI"


@pytest.mark.asyncio
async def test_crawl_markdown_uses_crawler(monkeypatch: pytest.MonkeyPatch) -> None:
    class FakeCrawler:
        async def __aenter__(self) -> "FakeCrawler":
            return self

        async def __aexit__(self, exc_type, exc, tb) -> None:
            return None

        async def arun(self, *, url: str) -> SimpleNamespace:
            assert url == "https://example.com"
            return SimpleNamespace(
                title="Example Domain",
                markdown="Example markdown body",
            )

    monkeypatch.setitem(
        __import__("sys").modules,
        "crawl4ai",
        SimpleNamespace(AsyncWebCrawler=FakeCrawler),
    )

    summary = await crawl_markdown("https://example.com")

    assert summary.title == "Example Domain"
    assert summary.markdown == "Example markdown body"


@pytest.mark.asyncio
async def test_extract_with_css_parses_json_string(monkeypatch: pytest.MonkeyPatch) -> None:
    class FakeCrawler:
        async def __aenter__(self) -> "FakeCrawler":
            return self

        async def __aexit__(self, exc_type, exc, tb) -> None:
            return None

        async def arun(self, *, url: str, config) -> SimpleNamespace:
            assert url == "https://example.com"
            assert config is not None
            return SimpleNamespace(
                extracted_content='[{"name":"Acme Co","price":"$10"}]',
            )

    fake_module = SimpleNamespace(
        AsyncWebCrawler=FakeCrawler,
        CacheMode=SimpleNamespace(BYPASS="bypass"),
        CrawlerRunConfig=lambda **kwargs: SimpleNamespace(**kwargs),
        JsonCssExtractionStrategy=lambda schema: schema,
    )

    monkeypatch.setitem(__import__("sys").modules, "crawl4ai", fake_module)

    items = await extract_with_css(
        "https://example.com",
        {
            "baseSelector": ".card",
            "fields": [{"name": "name", "selector": ".name", "type": "text"}],
        },
    )

    assert items == [{"name": "Acme Co", "price": "$10"}]


@pytest.mark.asyncio
async def test_extract_with_llm_requires_provider_and_token(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.delenv("CRAWL4AI_LLM_PROVIDER", raising=False)
    monkeypatch.delenv("CRAWL4AI_LLM_API_TOKEN", raising=False)

    with pytest.raises(ValueError):
        await extract_with_llm("https://example.com", "Extract product data")


@pytest.mark.asyncio
async def test_extract_with_llm_uses_rendered_markdown_and_litellm(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    class FakeCrawler:
        async def __aenter__(self) -> "FakeCrawler":
            return self

        async def __aexit__(self, exc_type, exc, tb) -> None:
            return None

        async def arun(self, *, url: str) -> SimpleNamespace:
            assert url == "https://example.com"
            return SimpleNamespace(markdown="Rendered listing content")

    async def fake_acompletion(**kwargs):
        assert kwargs["model"] == "openai/test-model"
        assert kwargs["api_key"] == "token"
        assert kwargs["api_base"] == "http://127.0.0.1:8005/v1"
        assert "Rendered listing content" in kwargs["messages"][1]["content"]
        return SimpleNamespace(
            choices=[
                SimpleNamespace(
                    message=SimpleNamespace(
                        content='{"listings":[{"title":"Item","price":"10"}]}'
                    )
                )
            ]
        )

    monkeypatch.setitem(
        __import__("sys").modules,
        "crawl4ai",
        SimpleNamespace(AsyncWebCrawler=FakeCrawler),
    )
    monkeypatch.setitem(
        __import__("sys").modules,
        "litellm",
        SimpleNamespace(acompletion=fake_acompletion),
    )

    items = await extract_with_llm(
        "https://example.com",
        "Extract listings",
        provider="openai/test-model",
        api_token="token",
        base_url="http://127.0.0.1:8005/v1",
    )

    assert items == [{"listings": [{"title": "Item", "price": "10"}]}]
