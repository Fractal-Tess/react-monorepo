from argparse import Namespace

import pytest

from scraper.main import run


@pytest.mark.asyncio
async def test_run_uses_markdown_mode(monkeypatch: pytest.MonkeyPatch) -> None:
    async def fake_crawl_markdown(url: str) -> dict[str, object]:
        return {"url": url, "title": "Example Domain", "markdown": "Example"}

    monkeypatch.setattr("scraper.main.crawl_markdown", fake_crawl_markdown)

    payload = await run(Namespace(mode="markdown", url="https://example.com"))
    assert payload["title"] == "Example Domain"


@pytest.mark.asyncio
async def test_run_uses_llm_mode(monkeypatch: pytest.MonkeyPatch) -> None:
    async def fake_extract_with_llm(url: str, instruction: str) -> list[dict[str, str]]:
        assert instruction == "Extract items"
        return [{"name": "Acme Co", "url": url}]

    monkeypatch.setattr("scraper.main.extract_with_llm", fake_extract_with_llm)

    payload = await run(
        Namespace(mode="llm", url="https://example.com", instruction="Extract items")
    )
    assert payload == [{"name": "Acme Co", "url": "https://example.com"}]
