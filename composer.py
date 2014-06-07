#!/usr/bin/env python

import sqlite3
from bs4 import BeautifulSoup as Bea

english = sqlite3.connect('./english').cursor()
spanish = sqlite3.connect('./spanish').cursor()

def get(cursor, query, *bindings):
    cursor.execute(query, bindings)
    return cursor.fetchall()

import sys
if len(sys.argv) < 2:
    print>>sys.stderr, "Usage: composer.py chapter_name"
    print>>sys.stderr, "For a list of chapter names, use composer.py list"
    sys.exit(1)

chapter = ' '.join(sys.argv[1:])
if chapter == 'list':
    print '\n'.join(x[0] for x in get(english, 'select title from node'))
    sys.exit(1)

TOP='''
<!doctype>
<html>
<head>
    <meta charset="utf8">
    <title>2 Nephi 12</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
'''
BOTTOM='''
</body>
</html>
'''

def compare(title):
    q = 'select title, content from node where title=?'
    en = get(english, q, title)
    sp = get(spanish, q, title)
    if not en:
        print>>sys.stderr, 'Chapter', title, 'not found'
        sys.exit(2)
    if not en[0][1]:
        print>>sys.stderr, 'Chapter', title, 'has no text'
        sys.exit(2)
    enp = Bea(en[0][1]).findAll('p')
    spp = Bea(sp[0][1]).findAll('p')
    for e, s in zip(enp, spp):
        [sup.extract() for sup in e.findAll('sup')]
        [sup.extract() for sup in s.findAll('sup')]
        yield (
            e.text.strip().encode('utf8'),
            s.text.strip().encode('utf8')
        )

def format(pairs):
    out = ''
    for e, s in pairs:
        out += '<div class="verse">\n'
        out += '<div class="sp">\n'
        out += s
        out += '</div>\n<div class="en">\n'
        out += e
        out += '</div>\n</div>\n'
    return out

body = format(compare(title=chapter))

print TOP + body + BOTTOM


# vim: et sw=4 sts=4
