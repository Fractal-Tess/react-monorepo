from argparse import Namespace

import pytest

from scraper.main import run


@pytest.mark.asyncio
async def test_run_uses_markdown_mode(monkeypatch: pytest.MonkeyPatch) -> None:
    async def fake_crawl_markdown(url: str) -> dict[str, object]:
        return {"url": url, "title": "Example Domain", "markdown": "Example"}

    monkeypatch.setattr("scraper.main.crawl_markdown", fake_crawl_markdown)

    payload = await run(
        Namespace(mode="markdown", save_to_convex=False, url="https://example.com")
    )
    assert payload["title"] == "Example Domain"


@pytest.mark.asyncio
async def test_run_uses_llm_mode(monkeypatch: pytest.MonkeyPatch) -> None:
    async def fake_extract_with_llm(url: str, instruction: str) -> list[dict[str, str]]:
        assert instruction == "Extract items"
        return [{"name": "Acme Co", "url": url}]

    monkeypatch.setattr("scraper.main.extract_with_llm", fake_extract_with_llm)

    payload = await run(
        Namespace(
            instruction="Extract items",
            mode="llm",
            save_to_convex=False,
            url="https://example.com",
        )
    )
    assert payload == [{"name": "Acme Co", "url": "https://example.com"}]


@pytest.mark.asyncio
async def test_run_can_save_results_to_convex(monkeypatch: pytest.MonkeyPatch) -> None:
    async def fake_extract_with_llm(url: str, instruction: str) -> list[dict[str, str]]:
        return [{"instruction": instruction, "url": url}]

    class FakeScraperConvexClient:
        @classmethod
        def from_env(cls) -> "FakeScraperConvexClient":
            return cls()

        def record_scrape(
            self,
            *,
            instruction: str | None,
            mode: str,
            payload: object,
            url: str,
        ) -> dict[str, object]:
            return {
                "_id": "run_123",
                "instruction": instruction,
                "mode": mode,
                "payload": payload,
                "url": url,
            }

    monkeypatch.setattr("scraper.main.extract_with_llm", fake_extract_with_llm)
    monkeypatch.setattr("scraper.main.ScraperConvexClient", FakeScraperConvexClient)

    payload = await run(
        Namespace(
            instruction="Extract items",
            mode="llm",
            save_to_convex=True,
            url="https://example.com",
        )
    )

    assert payload == {
        "convexRecord": {
            "_id": "run_123",
            "instruction": "Extract items",
            "mode": "llm",
            "payload": [{"instruction": "Extract items", "url": "https://example.com"}],
            "url": "https://example.com",
        },
        "result": [{"instruction": "Extract items", "url": "https://example.com"}],
    }
