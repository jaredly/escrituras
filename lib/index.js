
var lsKey = 'escrituras-position'

function getPosition() {
  var data = window.localStorage.getItem(lsKey)
  if (data) {
    try {
      data = JSON.parse(data)
    } catch (e) {
      data = null
    }
  }
  return data
}

function setPosition(pos) {
  window.localStorage.setItem(lsKey, JSON.stringify(pos))
}

var React = require('react')
  , PT = React.PropTypes

  , Home = require('./home')
  , ViewChapter = require('./view-chapter')

var App = React.createClass({
  propTypes: {
    cache: PT.object,
    books: PT.object,
  }
  getInitialState: function () {
    return {
      pos: getPosition() || null
    }
  },
  renderBody: function () {
    if (!this.state.pos) {
    }
  },
  render: function () {
    return <div className="App">
      {!this.state.pos ?
        <HomePage
          books={this.props.books}
          goTo={this._goTo}/> :
        <ViewChapter
          goTo={this._goTo}
          pos={this.state.pos}/>}
    </div>
  }
})

module.exports = App

