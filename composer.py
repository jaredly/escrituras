#!/usr/bin/env python

import sqlite3
from bs4 import BeautifulSoup as Bea

def get(cursor, query, *bindings):
    cursor.execute(query, bindings)
    return cursor.fetchall()

TOP='''
<!doctype html>
<html>
<head>
    <meta charset="utf8">
    <title>{}</title>
    <link rel="stylesheet" href="{}">
</head>
<body>
<a href="../index.html" class="home home-top">H</a>
<a href="../{}" class="prev prev-top">Prev</a>
<a href="../{}" class="next next-top">Next</a>
<h1>{}</h1>
'''

BOTTOM='''
<a href="../index.html" class="home home-bottom">H</a>
<a href="../{}" class="prev prev-bottom">Prev</a>
<a href="../{}" class="next next-bottom">Next</a>
</body>
</html>
'''

def geturi(title):
    q = 'select uri from node where title=?'
    en = get(english, q, title)
    if not en:
        print>>sys.stderr, 'Chapter', title, 'not found'
        sys.exit(2)
    return en[0][0]

def debug(uri, title):
    q = 'select title, content from node where uri=?'
    en = get(english, q, uri)
    sp = get(spanish, q, uri)
    print '>> english'
    print en[0][1].encode('utf8')
    print '>> spanish'
    print sp[0][1].encode('utf8')

def compare(uri, title):
    q = 'select title, content from node where uri=?'
    en = get(english, q, uri)
    sp = get(spanish, q, uri)
    if not en[0][1]:
        print>>sys.stderr, 'Chapter', title, 'has no text'
        sys.exit(2)
    enp = Bea(en[0][1]).findAll(attrs={'class': 'verse'})
    spp = Bea(sp[0][1]).findAll(attrs={'class': 'verse'})
    for e, s in zip(enp, spp):
        [sup.extract() for sup in e.findAll('sup')]
        [sup.extract() for sup in s.findAll('sup')]
        yield (
            e.text.strip().encode('utf8'),
            s.text.strip().encode('utf8')
        )

def toHTML(pairs):
    out = ''
    for e, s in pairs:
        out += '<div class="verse">\n'
        out += '<div class="sp">\n'
        out += s
        out += '</div>\n<div class="en">\n'
        out += e
        out += '</div>\n</div>\n'
    return out

def chapter_page(title, uri=None, style="style.css", prv=None, nxt=None):
    if uri is None:
        uri = geturi(title)
        if not uri:
            return False

    # debug(geturi(chapter), chapter)
    body = toHTML(compare(uri, title))

    title = title.encode('utf8')
    return TOP.format(title, style, prv, nxt, title) + body + BOTTOM.format(prv, nxt)

english = sqlite3.connect('./english').cursor()
spanish = sqlite3.connect('./spanish').cursor()

if __name__ == '__main__':

    import sys
    if len(sys.argv) < 2:
        print>>sys.stderr, "Usage: composer.py chapter_name"
        print>>sys.stderr, "For a list of chapter names, use composer.py list"
        sys.exit(1)

    chapter = ' '.join(sys.argv[1:])
    if chapter == 'list':
        print '\n'.join(x[0] for x in get(english, 'select title from node'))
        sys.exit(1)

    result = chapter_page(chapter)
    if not result:
        print>>sys.stderr, "Chapter not found"
        sys.exit(1)

    print result




# vim: et sw=4 sts=4
