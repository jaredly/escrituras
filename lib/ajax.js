
module.exports = get

function get(url, done) {
  var req = new XMLHttpRequest()
  req.onload = function () {
    done(JSON.parse(this.responseText))
  }
  req.open('get', url, true)
  req.send()
}

