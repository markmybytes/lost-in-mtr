import json
import re
import time

from fake_useragent import UserAgent
from selenium import webdriver
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.common.by import By

crawl_targets: dict[str, list[dict[str, str]]] = {
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


def clean(text: str, reverse: bool) -> str:
    text = re.sub(r'\[.*\]|\（.*\）', '', text.strip().replace('+', '-'))
    return text if not reverse else '-'.join(text.split('-')[::-1])


def fetch(driver: webdriver.Remote, targets: dict[str, list]):
    fleets: dict[str, dict[str, list[str]]] = {}
    for line, configs in targets.items():
        fleets[line] = {}

        for config in configs:
            re.match(r'\/wiki\/港鐵([^#]*)', config['url'])
            stock_name = config['url'].split(
                '/')[-1].replace('港鐵', '').split('#')[0]

            driver.get(config['url'])
            time.sleep(3)

            try:
                table = driver.find_element(By.XPATH, f'//table[.//tr[contains(string(.), "{config['keyword']}")]]')
            except NoSuchElementException:
                print(f'✗ ...... {line} ({config['url'].split('/')[-1]})')
                raise RuntimeError(f'Failed to locate table with keyword "{config['keyword']}"')

            fleets[line][stock_name] = [
                clean(
                    l.get_attribute('textContent'), 
                    '下行' in table.find_element(By.XPATH, './/tr[contains(string(.), "往")]/td').text
                )
                for l in table.find_elements(By.XPATH, './/tr[last()]//td/ol/li')
            ]

            if (len(fleets[line][stock_name]) == 0):
                print(f'✗ ...... {line} ({config['url'].split('/')[-1]})')
                raise RuntimeError(f'empty formation list {config['table']}')

            print(f'✓ ...... {line} ({stock_name})')

    return fleets


if __name__ == '__main__':
    option = webdriver.FirefoxOptions()
    option.add_argument('--headless')
    option.add_argument(f'--user-agent="{UserAgent().firefox}"')

    try:
        driver = webdriver.Firefox(option)

        fleets = fetch(driver, crawl_targets)

        with open('fleet.json', 'w', encoding='utf-8') as f:
            json.dump(fleets, f, indent=4, ensure_ascii=False)

        with open('fleet.min.json', 'w', encoding='utf-8') as f:
            json.dump(fleets, f, separators=(',', ':'))

        pass
    finally:
        driver.quit()
