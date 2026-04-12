from __future__ import annotations

import argparse
import asyncio
import json
from dataclasses import asdict, is_dataclass
from pathlib import Path

from scraper.convex_client import ScraperConvexClient
from scraper.crawler import crawl_markdown, extract_with_css, extract_with_llm


def add_convex_argument(parser: argparse.ArgumentParser) -> None:
    parser.add_argument(
        "--save-to-convex",
        action="store_true",
        help="Persist the scrape result using the CONVEX_URL deployment",
    )


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Scrape a URL with Crawl4AI")
    subparsers = parser.add_subparsers(dest="mode", required=True)

    markdown = subparsers.add_parser("markdown", help="Scrape a page into markdown")
    markdown.add_argument("url")
    add_convex_argument(markdown)

    css = subparsers.add_parser("css", help="Extract structured data with CSS selectors")
    css.add_argument("url")
    css.add_argument("--schema-file", required=True)
    add_convex_argument(css)

    llm = subparsers.add_parser("llm", help="Extract structured data with an LLM")
    llm.add_argument("url")
    llm.add_argument("--instruction", required=True)
    add_convex_argument(llm)

    return parser


async def run(args: argparse.Namespace) -> object:
    payload: object
    if args.mode == "markdown":
        payload = await crawl_markdown(args.url)
    elif args.mode == "css":
        schema = json.loads(Path(args.schema_file).read_text())
        payload = await extract_with_css(args.url, schema)
    elif args.mode == "llm":
        payload = await extract_with_llm(args.url, args.instruction)
    else:
        raise ValueError(f"Unsupported mode: {args.mode}")

    if not getattr(args, "save_to_convex", False):
        return payload

    convex_client = ScraperConvexClient.from_env()
    record = convex_client.record_scrape(
        url=args.url,
        mode=args.mode,
        payload=payload,
        instruction=getattr(args, "instruction", None),
    )
    return {
        "convexRecord": record,
        "result": asdict(payload) if is_dataclass(payload) else payload,
    }


def main() -> None:
    parser = build_parser()
    args = parser.parse_args()
    payload = asyncio.run(run(args))

    if is_dataclass(payload):
        print(json.dumps(asdict(payload), indent=2))
        return

    print(json.dumps(payload, indent=2))


if __name__ == "__main__":
    main()
