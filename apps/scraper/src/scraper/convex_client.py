from __future__ import annotations

import json
import os
from dataclasses import asdict, is_dataclass
from typing import Any

from convex import ConvexClient

MAX_SUMMARY_LENGTH = 280


def _normalize_payload(payload: object) -> Any:
    if is_dataclass(payload):
        return asdict(payload)
    return payload


def summarize_payload(payload: object, *, max_chars: int = MAX_SUMMARY_LENGTH) -> str:
    serialized = json.dumps(_normalize_payload(payload), ensure_ascii=False, sort_keys=True)
    normalized = " ".join(serialized.split())
    if len(normalized) <= max_chars:
        return normalized
    return normalized[: max_chars - 1].rstrip() + "…"


class ScraperConvexClient:
    def __init__(self, deployment_url: str, *, client: ConvexClient | None = None) -> None:
        self._deployment_url = deployment_url
        self._client = client or ConvexClient(deployment_url)

    @classmethod
    def from_env(cls, env_var: str = "CONVEX_URL") -> "ScraperConvexClient":
        deployment_url = os.environ.get(env_var)
        if not deployment_url:
            raise ValueError(f"{env_var} is required to connect to Convex")
        return cls(deployment_url)

    def list_messages(self) -> object:
        return self._client.query("messages:list", {})

    def list_recent_scrapes(self, limit: int = 10) -> object:
        return self._client.query("scrapes:listRecent", {"limit": limit})

    def record_scrape(
        self,
        *,
        url: str,
        mode: str,
        payload: object,
        instruction: str | None = None,
    ) -> object:
        normalized_payload = _normalize_payload(payload)
        result_json = json.dumps(normalized_payload, ensure_ascii=False, sort_keys=True)
        return self._client.mutation(
            "scrapes:record",
            {
                "instruction": instruction,
                "mode": mode,
                "resultJson": result_json,
                "summary": summarize_payload(normalized_payload),
                "url": url,
            },
        )
