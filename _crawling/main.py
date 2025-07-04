import json
import re
import time

from fake_useragent import UserAgent
from selenium import webdriver
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.common.by import By

crawl_targets = {
    'AEL': [{
        'url': 'https://hkrail.fandom.com/wiki/港鐵機場鐵路ADTranz-CAF列車',
        'table': 3
    }],
    'DRL': [{
        'url': 'https://hkrail.fandom.com/wiki/港鐵現代化列車',
        'table': 14
    }],
    'EAL': [{
        'url': 'https://hkrail.fandom.com/wiki/港鐵東鐵綫現代列車',
        'table': 2
    }],
    'ISL': [
        {
            'url': 'https://hkrail.fandom.com/wiki/港鐵現代化列車#港島綫',
            'table': 11
        },
        {
            'url': 'https://hkrail.fandom.com/wiki/港鐵市區綫中國青島四方製列車#港島綫',
            'table': 2
        },
    ],
    'KTL': [
        {
            'url': 'https://hkrail.fandom.com/wiki/港鐵市區綫中國長春製列車',
            'table': 1
        },
        {
            'url': 'https://hkrail.fandom.com/wiki/港鐵市區綫中國青島四方製列車#觀塘綫',
            'table': 1
        },
    ],
    'SIL': [{
        'url': 'https://hkrail.fandom.com/wiki/港鐵南港島綫中國長春製列車',
        'table': 1
    }],
    'TCL': [
        {
            'url': 'https://hkrail.fandom.com/wiki/港鐵機場鐵路ADTranz-CAF列車',
            'table': 1
        },
        {
            'url': 'https://hkrail.fandom.com/wiki/港鐵市區綫．東涌綫韓製列車',
            'table': 3
        },
    ],
    'TKL': [
        {
            'url': 'https://hkrail.fandom.com/wiki/港鐵現代化列車#觀塘綫及將軍澳綫',
            'table': 9
        },
        {
            'url': 'https://hkrail.fandom.com/wiki/港鐵市區綫．東涌綫韓製列車',
            'table': 1
        },
    ],
    'TML': [
        {
            'url': 'https://hkrail.fandom.com/wiki/港鐵屯馬綫中國製列車',
            'table': 1
        },
        {
            'url': 'https://hkrail.fandom.com/wiki/港鐵近畿川崎列車',
            'table': 3
        },
    ],
    'TWL': [{
        'url': 'https://hkrail.fandom.com/wiki/港鐵現代化列車#荃灣綫',
        'table': 10
    }],
}


def clean(text: str, reverse: bool) -> str:
    text = re.sub(r'\[.*\]|\（.*\）', '', text.strip().replace('+', '-'))
    return text if not reverse else '-'.join(text.split('-')[::-1])


def fetch(driver: webdriver.Remote, targets: dict[str, list]):
    fleets: dict[str, dict[str, list[str]]] = {}
    for line, configs in targets.items():
        fleets[line] = {}
        re.sub
        for config in configs:
            re.match(r'\/wiki\/港鐵([^#]*)', config['url'])
            stock_name = config['url'].split(
                '/')[-1].replace('港鐵', '').split('#')[0]

            driver.get(config['url'])

            time.sleep(3)

            rows = driver.find_elements(
                By.XPATH, f'(//table)[{config['table'] + 1}]//tr')
            try:
                left_dest = driver.find_element(
                    By.XPATH, f'(//table)[{config['table'] + 1}]//tr[contains(string(.), \'往\')]/td').text
            except NoSuchElementException:
                print(f'✗ ...... {line} ({config['url'].split('/')[-1]})')
                raise RuntimeError('incorrect table')

            fleets[line][stock_name] = [
                clean(l.get_attribute('textContent'), '下行' in left_dest)
                for l in rows[-1].find_elements(By.CSS_SELECTOR, 'td > ol > li')
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
