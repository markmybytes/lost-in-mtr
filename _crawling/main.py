import json
import time

import utils
from fake_useragent import UserAgent
from selenium import webdriver
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.common.by import By

option = webdriver.ChromeOptions()
option.add_argument('--headless')
option.add_argument(f'--user-agent="{UserAgent().random}"')
option.add_argument('log-level=3')

web = webdriver.Chrome(option)

target = {
    'AEL': [{
        'url': 'https://hkrail.fandom.com/wiki/港鐵機場鐵路ADTranz-CAF列車',
        'table': 3
    }],
    'DRL': [{
        'url': 'https://hkrail.fandom.com/wiki/港鐵現代化列車',
        'table': 13
    }],
    'EAL': [{
        'url': 'https://hkrail.fandom.com/wiki/港鐵東鐵綫現代列車',
        'table': 2
    }],
    'ISL': [
        {
            'url': 'https://hkrail.fandom.com/wiki/港鐵現代化列車',
            'table': 10
        },
        {
            'url': 'https://hkrail.fandom.com/wiki/港鐵市區綫中國青島四方製列車',
            'table': 2
        },
    ],
    'KTL': [
        {
            'url': 'https://hkrail.fandom.com/wiki/港鐵現代化列車',
            'table': 8
        },
        {
            'url': 'https://hkrail.fandom.com/wiki/港鐵市區綫中國長春製列車',
            'table': 1
        },
        {
            'url': 'https://hkrail.fandom.com/wiki/港鐵市區綫中國青島四方製列車',
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
            'url': 'https://hkrail.fandom.com/wiki/港鐵現代化列車',
            'table': 8
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
        'url': 'https://hkrail.fandom.com/wiki/港鐵現代化列車',
        'table': 9
    }],
}

carriages: dict[str, list] = {}

for line, configs in target.items():
    carriages[line] = []

    for config in configs:
        web.get(config['url'])

        time.sleep(1)

        rows = web.find_elements(
            By.XPATH, f'(//table)[{config['table'] + 1}]//tr')

        try:
            left_dest = web.find_element(
                By.XPATH, f'(//table)[{config['table'] + 1}]//tr[contains(string(.), \'往\')]/td').text
        except NoSuchElementException:
            print(f'✗ ...... {line} ({config['url'].split('/')[-1]})')
            raise RuntimeError('incorrect table')

        formations = '\n'.join(
            [l.text for l in rows[-1].find_elements(By.CSS_SELECTOR, 'td > ol')])

        if (formations == ''):
            print(f'✗ ...... {line} ({config['url'].split('/')[-1]})')
            raise RuntimeError(f'empty formation list {config['table']}')

        carriages[line].extend(
            utils.parse_formation(formations, '下行' in left_dest))

        print(f'✓ ...... {line} ({config['url'].split('/')[-1]})')


with open('fleet.json', 'w', encoding='utf-8') as f:
    json.dump(carriages, f, indent=4)

with open('fleet.min.json', 'w', encoding='utf-8') as f:
    json.dump(carriages, f, separators=(',', ':'))
