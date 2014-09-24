
var React = require('react')
  , PT = React.PropTypes

  , Home = require('./home')
  , ViewChapter = require('./view-chapter')
  , position = require('./position')

var App = React.createClass({
  propTypes: {
    cache: PT.object,
    books: PT.object,
  },

  getInitialState: function () {
    return {
      pos: position.get() || null
    }
  },

  _goTo: function (fname, top) {
    top = top || 0
    var pos = {
      fname: fname,
      top: top
    }
    position.set(pos)
    this.setState({
      pos: pos,
    })
  },

  _goHome: function () {
    position.set(null)
    this.setState({pos: null})
  },

  chapter: function () {
    var info = this.props.cache.info(this.state.pos.fname)
    return <ViewChapter
      goTo={this._goTo}
      goHome={this._goHome}
      goNext={info.next && this._goTo.bind(null, info.next, 0)}
      goPrev={info.prev && this._goTo.bind(null, info.prev, 0)}
      info={info}
      cache={this.props.cache}
      pos={this.state.pos}/>
  },

  render: function () {
    return <div className="App">
      {!this.state.pos ?
        <Home
          books={this.props.books}
          goTo={this._goTo}/> :
        this.chapter()}
    </div>
  }

})

module.exports = App

