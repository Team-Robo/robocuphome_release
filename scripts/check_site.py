"""Check links and asset references in generated documentation HTML."""

import argparse
import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urljoin, urlsplit


class Page(HTMLParser):
    def __init__(self, path: Path) -> None:
        super().__init__()
        self.anchors: set[str] = {"top"}
        self.references: list[tuple[int, str]] = []
        self.canonical = ""
        self.feed(path.read_text(encoding="utf-8"))
        self.close()

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        attributes = dict(attrs)
        if anchor := attributes.get("id"):
            self.anchors.add(anchor)
        if tag == "a" and (name := attributes.get("name")):
            self.anchors.add(name)
        if tag == "link" and attributes.get("rel") == "canonical":
            self.canonical = attributes.get("href") or ""

        for attribute in ("href", "src", "poster"):
            if reference := attributes.get(attribute):
                self.references.append((self.getpos()[0], reference))


def check_site(site_dir: Path) -> int:
    root = site_dir.resolve()
    index = root / "index.html"
    if not index.is_file():
        print(f"Build the site first. Missing {site_dir / 'index.html'}.", file=sys.stderr)
        return 1

    pages = {path: Page(path) for path in sorted(root.rglob("*.html"))}
    base_url = pages[index].canonical or "https://preview.invalid/"
    base = urlsplit(base_url)
    prefix = base.path.rstrip("/") + "/"
    errors = 0

    for file, page in pages.items():
        relative = file.relative_to(root).as_posix()
        page_url = urljoin(base_url, relative)
        for line, reference in page.references:
            target_url = urlsplit(urljoin(page_url, reference))
            if target_url.scheme not in {"http", "https"} or target_url.netloc != base.netloc:
                continue

            path = unquote(target_url.path)
            fragment = unquote(target_url.fragment)
            if path == prefix.rstrip("/"):
                path = prefix
            if not path.startswith(prefix):
                reason = "URL is outside the site path"
            else:
                target = (root / path.removeprefix(prefix)).resolve()
                if target.is_dir():
                    target /= "index.html"
                if not target.is_relative_to(root) or not target.is_file():
                    reason = "file is missing"
                elif fragment and target in pages and fragment not in pages[target].anchors:
                    reason = "anchor is missing"
                else:
                    continue

            print(f"{relative}:{line}: {reason} for {reference!r}", file=sys.stderr)
            errors += 1

    if errors:
        print(f"Found {errors} broken internal references.", file=sys.stderr)
        return 1

    print(f"Checked internal links and assets in {len(pages)} HTML files.")
    return 0


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("site_dir", nargs="?", type=Path, default=Path("site"))
    raise SystemExit(check_site(parser.parse_args().site_dir))
