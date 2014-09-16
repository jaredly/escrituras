#!/usr/bin/env python

import composer
from composer import english, get
import os, errno

def mkdir_p(path):
    try:
        os.makedirs(path)
    except OSError as exc: # Python >2.5
        if exc.errno == errno.EEXIST and os.path.isdir(path):
            pass
        else: raise

def uri_to_filename(uri):
    return uri[len('/scriptures/bofm/'):] + '.html'

TOP = '''
<!doctype html>
<html>
<head>
    <meta charset="utf8">
    <title>Escrituras</title>
    <link rel="stylesheet" href="index.css">
</head>
<body>
'''

BOTTOM = '''
</body>
</html>
'''

def ul(start, end, items):
    return start + (end + start).join(items) + end

def full_page(groups, items):
    for bid in groups:
        chapters = []
        for title, fname in items[bid]['chapters']:
            chapters.append('<a href="{}">{}</a>'.format(fname, title.encode('utf8')))

    return TOP + ('<ul class="books">' +
        ul('<li class="book-list" tabindex="0">',
            '</li>\n',
            ('<div class="book-title">{}</div><ul class="book-chapters">'.format(items[bookid]['title'].encode('utf8')) +
                ul('<li class="chapter">',
                    '</li>\n',
                    ('<a href="{}" class="chapter-link">{}</a>'.format(fname, title.encode('utf8'))
                        for (title, fname) in items[bookid]['chapters'])) +
            '</ul>\n' for bookid in groups)) + '</ul>') + BOTTOM


def main(base = 'www'):
    chapters = get(english, 'select title, uri from node where content is not null')[8:-1]

    groups = []
    items = {}

    for i, (title, uri) in enumerate(chapters):
        print title,
        fname = uri_to_filename(uri)
        fullname = os.path.join(base, fname)
        if 1:# not os.path.isfile(fullname):
            print "writing"
            nxt = 'index.html'
            prv = 'index.html'
            if i < len(chapters) - 1:
                nxt = uri_to_filename(chapters[i + 1][1])
            if i > 0:
                prv = uri_to_filename(chapters[i - 1][1])
            content = composer.chapter_page(title, uri, style="../chapter.css", nxt=nxt, prv=prv)
            mkdir_p(os.path.dirname(fullname))
            open(fullname, 'w').write(content)
        else:
            print

        bookid = uri.split('/')[-2]
        if not bookid in items:
            bookname = title.split(' ')
            if len(bookname) > 1:
                bookname = bookname[:-1]
            bookname = ' '.join(bookname)
            groups.append(bookid)
            items[bookid] = {"title": bookname, "chapters": []}
        items[bookid]["chapters"].append([title, fname])

    all_text = full_page(groups, items)
    open(os.path.join(base, 'index.html'), 'w').write(all_text)

if __name__ == '__main__':
    main()

# vim: et sw=4 sts=4
