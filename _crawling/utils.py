import re


def parse_formation(text: str, reverse: bool) -> list[SyntaxWarning]:
    text = re.sub(r'\[.*\]|\（.*\）', '', text.replace('+', '-'))

    if not reverse:
        return text.splitlines()
    return ['-'.join(t.split('-')[::-1]) for t in text.splitlines()]
