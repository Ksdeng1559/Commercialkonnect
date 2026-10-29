#!/usr/bin/env python3
"""Single-request bridge between the Node pipeline and Scrapling.

The Node scraper shells out to this script rather than driving Scrapling's
CLI so that one HTTP request yields the status code, the post-redirect URL
and the extracted content together. The CLI writes content to a file and
reports nothing else, which would force a second request just to learn where
we ended up.

Emits a single JSON object on stdout:

    {"ok": true, "status": 200, "url": "...", "final_url": "...",
     "markdown": "...", "bytes": 1234, "reason": "OK", "error": null}

Exit code is 0 when the request completed (whatever the status code) and 1
when it failed before a response was produced. A 404 is a completed request,
not a crash.
"""

import argparse
import json
import sys
from typing import NoReturn


def parse_headers(pairs):
    """Turn repeated "Key: Value" arguments into a header dict."""
    headers = {}
    for pair in pairs or []:
        if ":" not in pair:
            continue
        key, _, value = pair.partition(":")
        key = key.strip()
        if key:
            headers[key] = value.strip()
    return headers


def extract_text(resp, raw=False):
    """Best-effort extraction of the page body as text.

    Prefers Scrapling's markdown conversion (which drops nav chrome and
    hidden elements), and falls back to the raw body when the response is
    not HTML.

    `Response.markdown` is a method in Scrapling 0.5, not a property, so it
    is called rather than read. The same is true of `get_all_text`.

    `raw=True` returns the undecorated body. That matters for robots.txt and
    sitemaps: the markdown conversion is an HTML-aware transform and will
    strip the XML tags out of a sitemap, leaving nothing for the caller to
    parse.
    """
    if not raw:
        markdown = getattr(resp, "markdown", None)
        if callable(markdown):
            try:
                markdown = markdown()
            except Exception:
                markdown = None
        if isinstance(markdown, str) and markdown.strip():
            return markdown

    body = getattr(resp, "body", None)
    if isinstance(body, bytes):
        encoding = getattr(resp, "encoding", None) or "utf-8"
        try:
            return body.decode(encoding, errors="replace")
        except LookupError:
            return body.decode("utf-8", errors="replace")
    if isinstance(body, str):
        return body

    try:
        return resp.get_all_text() or ""
    except Exception:
        return ""


def emit(payload, code) -> NoReturn:
    json.dump(payload, sys.stdout)
    sys.exit(code)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("url")
    parser.add_argument("--timeout", type=int, default=45)
    parser.add_argument("--css-selector", default=None)
    parser.add_argument("--impersonate", default=None)
    parser.add_argument("--header", action="append", default=[],
                        help='Extra HTTP header in "Key: Value" form (repeatable)')
    parser.add_argument("--raw", action="store_true",
                        help="Return the undecorated body instead of Markdown")
    args = parser.parse_args()

    try:
        from scrapling.fetchers import Fetcher
    except Exception as exc:  # pragma: no cover - import guard
        emit({"ok": False, "status": None, "url": args.url, "final_url": args.url,
              "markdown": "", "bytes": 0, "reason": None,
              "error": f"scrapling import failed: {exc}"}, 1)

    kwargs = {"timeout": args.timeout}
    headers = parse_headers(args.header)
    if headers:
        kwargs["headers"] = headers
    if args.css_selector:
        kwargs["css_selector"] = args.css_selector
    if args.impersonate:
        kwargs["impersonate"] = args.impersonate

    try:
        resp = Fetcher.get(args.url, **kwargs)
    except Exception as exc:
        emit({"ok": False, "status": None, "url": args.url, "final_url": args.url,
              "markdown": "", "bytes": 0, "reason": None,
              "error": f"{type(exc).__name__}: {exc}"}, 1)

    text = extract_text(resp, raw=args.raw)
    status = getattr(resp, "status", None)

    emit({
        "ok": True,
        "status": status,
        "url": args.url,
        "final_url": str(getattr(resp, "url", args.url) or args.url),
        "markdown": text,
        "bytes": len(text.encode("utf-8")),
        "reason": getattr(resp, "reason", None),
        "error": None,
    }, 0)


if __name__ == "__main__":
    main()
