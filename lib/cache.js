
var get = require('./ajax')

module.exports = Cache

function Cache(books) {
  this._cache = {}
  this._books = books
  this._map = {}
  this.buildMap()
}

Cache.prototype = {
  get: function (fname, done) {
    this.preload(this._map[fname].next)
    this.preload(this._map[fname].prev)
    if (this._cache[fname]) {
      done(this._cache[fname])
      return true
    }
    get(fname, (data) => {
      this._cache[fname] = data
      done(data)
    })
  },

  preload: function (item) {
    if (!item) return
    if (this._cache[item]) return
    get(item, (data) => {
      this._cache[item] = data
    })
  },

  info: function (fname) {
    return this._map[fname]
  },

  buildMap: function () {
    this._books.forEach((book, bk) => {
      book.chapters.forEach((chapter, ci) => {
        var prev, next

        if (ci == 0) {
          if (bk == 0) {
            prev = null;
          } else {
            prev = this._books[bk-1].chapters[this._books[bk-1].chapters.length-1]
          }
        } else {
          prev = book.chapters[ci-1]
        }

        if (ci === book.chapters.length-1) {
          if (bk === this._books.length-1) {
            next = null
          } else {
            next = this._books[bk+1].chapters[0]
          }
        } else {
          next = book.chapters[ci+1]
        }

        this._map[chapter.fname] = {
          next: next && next.fname,
          prev: prev && prev.fname,
          title: chapter.title,
          book: book.title,
        }
      })
    })
  }
}

