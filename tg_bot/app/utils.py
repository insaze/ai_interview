import re


def escape_md(text: str) -> str:
    return re.sub(r'[_*[\]()~>#\+\-=|{}.!]', lambda x: '\\' + x.group(), text)
