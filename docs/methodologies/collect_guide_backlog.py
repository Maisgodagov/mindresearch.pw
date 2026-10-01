"""Collect linked instrument pages from the guide URLs in links_backlog.md."""

from concurrent.futures import ThreadPoolExecutor, as_completed
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urljoin, urlparse
from urllib.request import Request, urlopen
import re


ROOT = Path(__file__).resolve().parent
SOURCE = ROOT / "links_backlog.md"
OUTPUT = ROOT / "links" / "_backlog.md"
USER_AGENT = "Mozilla/5.0 (compatible; ResearchBacklogCollector/1.0)"


class Anchors(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.items = []
        self.href = None
        self.parts = []

    def handle_starttag(self, tag, attrs):
        if tag == "a":
            self.href = dict(attrs).get("href")
            self.parts = []

    def handle_data(self, data):
        if self.href is not None:
            self.parts.append(data)

    def handle_endtag(self, tag):
        if tag == "a" and self.href is not None:
            label = re.sub(r"\s+", " ", " ".join(self.parts)).strip()
            self.items.append((self.href, label))
            self.href = None
            self.parts = []


def scrape(guide):
    request = Request(guide, headers={"User-Agent": USER_AGENT})
    with urlopen(request, timeout=30) as response:
        raw = response.read()
        charset = response.headers.get_content_charset() or "windows-1251"
        html = raw.decode(charset, errors="replace")
    parser = Anchors()
    parser.feed(html)
    found = []
    for href, label in parser.items:
        if not href or not label or not href.lower().endswith(".html"):
            continue
        target = urljoin(guide, href)
        parsed = urlparse(target)
        if parsed.netloc not in {"psytests.org", "www.psytests.org", "psytests.org.ru"}:
            continue
        if parsed.path.startswith("/guide/") or parsed.path in {"/", "/map.html", "/tags.html", "/newtop.html"}:
            continue
        if label.lower() in {"каталог", "условия", "политика пдн", "ошибка?", "тесты", "теги", "топ", "новые"}:
            continue
        found.append((label, target))
    return guide, found


def main():
    guides = sorted({line.strip() for line in SOURCE.read_text(encoding="utf-8").splitlines() if line.strip().startswith("http")})
    results = []
    errors = []
    with ThreadPoolExecutor(max_workers=8) as pool:
        futures = {pool.submit(scrape, guide): guide for guide in guides}
        for future in as_completed(futures):
            guide = futures[future]
            try:
                results.append(future.result())
            except Exception as error:
                errors.append((guide, str(error)))
    results.sort(key=lambda row: row[0])

    by_url = {}
    existing_backlog = (ROOT / "BACKLOG.md").read_text(encoding="utf-8")
    existing_titles = set()
    for line in existing_backlog.splitlines():
        if line.startswith(("- [ ] ", "- [x] ")):
            entry = re.sub(r"^- \[[ x]\] ", "", line)
            entry = re.sub(r"^\d+\. ", "", entry)
            existing_titles.add(re.sub(r"\s+", " ", entry.split(" — ", 1)[0]).strip().casefold())
    for guide, entries in results:
        for title, target in entries:
            normalized_url = urlparse(target)._replace(query="", fragment="").geturl().rstrip("/").casefold()
            item = by_url.setdefault(normalized_url, {"title": title, "aliases": set(), "url": target, "guides": set()})
            item["aliases"].add(title)
            item["guides"].add(guide)

    existing_matches = sum(
        re.sub(r"\s+", " ", item["title"]).strip().casefold() in existing_titles
        for item in by_url.values()
    )

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    lines = [
        "# Методики из путеводителей PsyTests",
        "",
        f"Источник: все {len(guides)} уникальных ссылок из [`links_backlog.md`](../links_backlog.md). Одинаковые страницы объединены по URL; варианты названий и путеводители сохранены. Точные совпадения с уже существующими названиями в основном `BACKLOG.md` отмечены. Это инвентаризация источников, не проверка русской адаптации, психометрии или прав.",
        f"",
        f"Всего собрано {sum(len(entries) for _, entries in results)} упоминаний; уникальных страниц методик — {len(by_url)}. Точных совпадений с существующими пунктами — {existing_matches}. Ошибок чтения страниц: {len(errors)}.",
        "",
        "Статус новых записей: `queued`; точные названия, уже присутствующие в главном backlog, помечены `already-listed`.",
        "",
    ]
    for index, item in enumerate(sorted(by_url.values(), key=lambda x: x["title"].casefold()), 1):
        guides_for_item = sorted(item["guides"])
        refs = f"[страница методики]({item['url']})"
        if len(item["aliases"]) > 1:
            refs += "; варианты названия: " + ", ".join(sorted(item["aliases"]))
        refs += "; путеводители: " + ", ".join(f"[{urlparse(guide).path.rsplit('/', 1)[-1]}]({guide})" for guide in guides_for_item)
        status = "already-listed" if re.sub(r"\s+", " ", item["title"]).strip().casefold() in existing_titles else "queued"
        lines.append(f"- [ ] {index}. {item['title']} — `{status}`; {refs}.")
    if errors:
        lines += ["", "## Не удалось прочитать", ""]
        lines.extend(f"- {guide} — {error}" for guide, error in sorted(errors))
    OUTPUT.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"Guides: {len(guides)}; mentions: {sum(len(entries) for _, entries in results)}; unique pages: {len(by_url)}; errors: {len(errors)}; output: {OUTPUT}")


if __name__ == "__main__":
    main()
