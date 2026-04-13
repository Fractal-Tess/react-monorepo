from types import SimpleNamespace

import pytest

from scraper.convex_client import ScraperConvexClient, summarize_payload


def test_summarize_payload_normalizes_json() -> None:
    summary = summarize_payload({"title": "Example", "items": [1, 2, 3]})

    assert '"title": "Example"' in summary
    assert "  " not in summary


def test_from_env_requires_convex_url(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.delenv("CONVEX_URL", raising=False)

    with pytest.raises(ValueError):
        ScraperConvexClient.from_env()


def test_record_scrape_uses_convex_mutation() -> None:
    calls: list[tuple[str, dict[str, object]]] = []

    class FakeConvexClient:
        def mutation(self, name: str, args: dict[str, object]) -> dict[str, object]:
            calls.append((name, args))
            return {"_id": "run_123", **args}

        def query(self, name: str, args: dict[str, object]) -> dict[str, object]:
            return {"name": name, "args": args}

    client = ScraperConvexClient("https://example.convex.cloud", client=FakeConvexClient())
    result = client.record_scrape(
        url="https://example.com",
        mode="llm",
        instruction="Extract the hero section",
        payload={"title": "Example Domain"},
    )

    assert calls == [
        (
            "scrapes:record",
            {
                "instruction": "Extract the hero section",
                "mode": "llm",
                "resultJson": '{"title": "Example Domain"}',
                "summary": '{"title": "Example Domain"}',
                "url": "https://example.com",
            },
        )
    ]
    assert result["_id"] == "run_123"


def test_record_scrape_omits_optional_instruction_when_missing() -> None:
    calls: list[tuple[str, dict[str, object]]] = []

    class FakeConvexClient:
        def mutation(self, name: str, args: dict[str, object]) -> dict[str, object]:
            calls.append((name, args))
            return {"_id": "run_456", **args}

        def query(self, name: str, args: dict[str, object]) -> dict[str, object]:
            return {"name": name, "args": args}

    client = ScraperConvexClient("https://example.convex.cloud", client=FakeConvexClient())
    client.record_scrape(
        url="https://example.com",
        mode="markdown",
        payload={"title": "Example Domain"},
    )

    assert calls == [
        (
            "scrapes:record",
            {
                "mode": "markdown",
                "resultJson": '{"title": "Example Domain"}',
                "summary": '{"title": "Example Domain"}',
                "url": "https://example.com",
            },
        )
    ]


def test_list_recent_scrapes_uses_convex_query() -> None:
    class FakeConvexClient:
        def mutation(self, name: str, args: dict[str, object]) -> dict[str, object]:
            return {"name": name, "args": args}

        def query(self, name: str, args: dict[str, object]) -> SimpleNamespace:
            return SimpleNamespace(name=name, args=args)

    client = ScraperConvexClient("https://example.convex.cloud", client=FakeConvexClient())
    result = client.list_recent_scrapes(limit=5)

    assert result.name == "scrapes:listRecent"
    assert result.args == {"limit": 5}
