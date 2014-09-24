
var App = require('./lib')
  , Cache = require('./lib/cache')
  , React = require('react')
  , books = require('./books.json')

window.React = React

window.onload = function () {
  var cache = window.cache = new Cache(books)
  React.renderComponent(App({
    cache: cache,
    books: books,
  }), document.body);
}

window.ondeviceready = function () {
  var cache = window.cache = new Cache(books)
  React.renderComponent(App({
    cache: cache,
    books: books,
  }), document.body);
}

