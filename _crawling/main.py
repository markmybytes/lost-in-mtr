from contextlib import contextmanager
import json
import re
import time

from fake_useragent import UserAgent
from selenium import webdriver
from selenium.webdriver.common.by import By

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
            'url': 'https://hkrail.fandom.com/wiki/港鐵市區綫中國青島四方製列車#港島綫',
            'keyword': '港島綫的列車'
        },
    ],
    'KTL': [
        {
            'url': 'https://hkrail.fandom.com/wiki/港鐵市區綫中國長春製列車',
            'keyword': '觀塘綫的列車'
        },
        {
            'url': 'https://hkrail.fandom.com/wiki/港鐵市區綫中國青島四方製列車#觀塘綫',
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
    'TWL': [{
        'url': 'https://hkrail.fandom.com/wiki/港鐵現代化列車#荃灣綫',
        'keyword': '荃灣綫的列車'
    }],
}


@contextmanager
def get_webdriver():
    option = webdriver.FirefoxOptions()
    option.add_argument('--headless')
    option.add_argument(f'--user-agent="{UserAgent().firefox}"')

    driver = webdriver.Firefox(option)
    try:
        yield driver
    finally:
        driver.quit()


def parse_formation(text: str, should_reverse: bool) -> str:
    text = re.sub(r'\[.*\]|\（.*\）', '', text.strip().replace('+', '-'))
    return (text
            if not should_reverse
            else '-'.join(text.split('-')[::-1]))


def scrape(url: str, keyword: str) -> list[str]:
    with get_webdriver() as driver:
        driver.get(url)
        time.sleep(10)

        table = driver.find_element(
            By.XPATH, f'//table[.//tr[contains(string(.), "{keyword}")]]')
        bound_left = table.find_element(
            By.XPATH, './/tr[contains(string(.), "往")]/td')

        return [
            parse_formation(l.get_attribute('textContent'),
                            '下行' in bound_left.text)
            for l in table.find_elements(By.XPATH, './/tr[last()]//td/ol/li')
        ]


if __name__ == '__main__':
    fleets: dict[str, dict[str, list[str]]] = {}

    for line, stocks in scrape_configuration.items():
        fleets[line] = {}

        for stock in stocks:
            stock_name = (stock['url']
                          .split('/')[-1].replace('港鐵', '').split('#')[0])

            fleets[line][stock_name] = scrape(stock['url'], stock['keyword'])
            if (len(fleets[line][stock_name]) == 0):
                raise RuntimeError(
                    f'unable to find any data on {stock['url']}')

            print(f'✓ ...... {line} ({stock_name})')

    with open('fleet.json', 'w', encoding='utf-8') as f:
        json.dump(fleets, f, indent=4, ensure_ascii=False)

    with open('fleet.min.json', 'w', encoding='utf-8') as f:
        json.dump(fleets, f, separators=(',', ':'))
