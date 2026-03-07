import re
import json
import requests
from bs4 import BeautifulSoup
from urllib.parse import urlparse, unquote

scrape_configuration: dict[str, list[dict[str, str]]] = {
    'AEL': [{
        'url': 'https://hkrail.fandom.com/wiki/港鐵機場鐵路ADTranz-CAF列車',
        'keyword': '機場快綫的列車'
    }],
    'DRL': [{
        'url': 'https://hkrail.fandom.com/wiki/港鐵現代化列車',
        'keyword': '迪士尼綫的列車'
    }],
    'EAL': [{
        'url': 'https://hkrail.fandom.com/wiki/港鐵東鐵綫現代列車',
        'keyword': '東鐵綫的列車'
    }],
    'ISL': [
        {
            'url': 'https://hkrail.fandom.com/wiki/港鐵現代化列車#港島綫',
            'keyword': '港島綫的列車'
        },
        {
            'url': 'https://hkrail.fandom.com/wiki/港鐵市區綫中車青島四方列車#港島綫',
            'keyword': '港島綫的列車'
        },
    ],
    'KTL': [
        {
            'url': 'https://hkrail.fandom.com/wiki/港鐵市區綫中國長春製列車',
            'keyword': '觀塘綫的列車'
        },
        {
            'url': 'https://hkrail.fandom.com/wiki/港鐵市區綫中車青島四方列車#觀塘綫',
            'keyword': '觀塘綫的列車'
        },
    ],
    'SIL': [{
        'url': 'https://hkrail.fandom.com/wiki/港鐵南港島綫中國長春製列車',
        'keyword': '南港島綫的列車'
    }],
    'TCL': [
        {
            'url': 'https://hkrail.fandom.com/wiki/港鐵機場鐵路ADTranz-CAF列車',
            'keyword': '東涌綫的列車'
        },
        {
            'url': 'https://hkrail.fandom.com/wiki/港鐵市區綫．東涌綫韓製列車',
            'keyword': '東涌綫的列車'
        },
    ],
    'TKL': [
        {
            'url': 'https://hkrail.fandom.com/wiki/港鐵現代化列車#觀塘綫及將軍澳綫',
            'keyword': '觀塘綫及將軍澳綫的列車'
        },
        {
            'url': 'https://hkrail.fandom.com/wiki/港鐵市區綫．東涌綫韓製列車',
            'keyword': '將軍澳綫的列車'
        },
    ],
    'TML': [
        {
            'url': 'https://hkrail.fandom.com/wiki/港鐵屯馬綫中國製列車',
            'keyword': '屯馬綫的列車'
        },
        {
            'url': 'https://hkrail.fandom.com/wiki/港鐵近畿川崎列車',
            'keyword': '屯馬綫的列車'
        },
    ],
    'TWL': [
        {
            'url': 'https://hkrail.fandom.com/wiki/港鐵現代化列車#荃灣綫',
            'keyword': '荃灣綫的列車'
        },
        {
            'url': 'https://hkrail.fandom.com/wiki/港鐵市區綫中國青島四方製列車#荃灣綫',
            'keyword': '荃灣綫的列車'
        }
    ],
}


def parse_formation(text: str, reverse: bool = False) -> str:
    text = re.sub(r'\[.*\]|\（.*\）', '', text.strip().replace('+', '-'))
    return text if not reverse else '-'.join(text.split('-')[::-1])


def get_title(url: str) -> str:
    return unquote(urlparse(url).path.lstrip('/wiki/').split('#')[0])


def scrape(url: str, keyword: str) -> list[str]:
    title = get_title(url)
    r = requests.get(
        "https://hkrail.fandom.com/api.php",
        params={
            "action": "parse",
            "page": title,
            "format": "json",
            "redirects": "1"
        },
    ).json()

    html = r.get("parse", {}).get("text", {}).get("*")
    if not html:
        raise RuntimeError(f"No parsed content: {title}")

    soup = BeautifulSoup(html, "html.parser")
    table = next((t for t in soup.find_all("table")
                 if keyword in t.get_text(strip=True)), None)
    if not table:
        raise RuntimeError(f"No table with keyword '{keyword}': {title}")

    bound_cell = next((c for c in table.find_all(
        ["td", "th"]) if "往" in c.get_text(strip=True)), None)
    if not bound_cell:
        raise RuntimeError("Unable to identify formation direction")

    last_row = table.find_all("tr")[-1]
    if not last_row:
        raise RuntimeError(f"No rows in table: {title}")

    lis = last_row.select("td ol li")
    if not lis:
        raise RuntimeError("No formation data found")

    return [
        parse_formation(li.get_text(strip=True),
                        "下行" in bound_cell.get_text(strip=True))
        for li in lis
        if li.get_text(strip=True)
    ]


if __name__ == "__main__":
    fleets = {}

    for line, entries in scrape_configuration.items():
        fleets[line] = {}
        for entry in entries:
            url, kw = entry["url"], entry["keyword"]
            name = get_title(url).replace("港鐵", "").strip()
            try:
                fleets[line][name] = scrape(url, kw)
                print(f"✓ {line}  {name}")
            except Exception as e:
                print(f"✗ {line}  {name} → {e}")

    with open("fleet.json", "w", encoding="utf-8") as f:
        json.dump(fleets, f, indent=2, ensure_ascii=False)

    with open("fleet.min.json", "w", encoding="utf-8") as f:
        json.dump(fleets, f, separators=(",", ":"))
