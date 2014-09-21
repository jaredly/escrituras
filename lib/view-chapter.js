
var React = require('react')
  , PT = React.PropTypes

var ViewChapter = React.createClass({
  propTypes: {
    goTo: PT.func,
    pos: PT.object,
  },
  componentDidMount: function () {
    window.document.body.scrollTop = this.props.pos.scroll
  },
  render: function () {
    return <div className="Chapter">
      Chapter: {this.props.pos.chapter}
      Scroll: {this.props.pos.scroll}
    </div>
  }
})

module.exports = ViewChapter

