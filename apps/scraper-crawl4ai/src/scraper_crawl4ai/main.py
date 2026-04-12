from __future__ import annotations

import argparse
import asyncio
import json
from dataclasses import asdict, is_dataclass
from pathlib import Path

from scraper_crawl4ai_core import crawl_markdown, extract_with_css, extract_with_llm


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Scrape a URL with Crawl4AI")
    subparsers = parser.add_subparsers(dest="mode", required=True)

    markdown = subparsers.add_parser("markdown", help="Scrape a page into markdown")
    markdown.add_argument("url")

    css = subparsers.add_parser("css", help="Extract structured data with CSS selectors")
    css.add_argument("url")
    css.add_argument("--schema-file", required=True)

    llm = subparsers.add_parser("llm", help="Extract structured data with an LLM")
    llm.add_argument("url")
    llm.add_argument("--instruction", required=True)

    return parser


async def run(args: argparse.Namespace) -> object:
    if args.mode == "markdown":
        return await crawl_markdown(args.url)
    if args.mode == "css":
        schema = json.loads(Path(args.schema_file).read_text())
        return await extract_with_css(args.url, schema)
    if args.mode == "llm":
        return await extract_with_llm(args.url, args.instruction)
    raise ValueError(f"Unsupported mode: {args.mode}")


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
