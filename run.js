
var App = require('./lib')
  , Cache = require('./lib/cache')

window.ondeviceready = function () {
  React.renderComponent(App({
    cache: new Cache(),
    books: require('./books.json'),
  }), document.body);
}

