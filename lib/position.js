
var lsKey = 'escrituras-position'

module.exports = {
  get: function () {
    var data = window.localStorage.getItem(lsKey)
    if (data) {
      try {
        data = JSON.parse(data)
      } catch (e) {
        data = null
      }
    }
    return data
  },

  set: function (pos) {
    window.localStorage.setItem(lsKey, JSON.stringify(pos))
  }
}

