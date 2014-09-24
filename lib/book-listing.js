
var React = require('react/addons')
  , PT = React.PropTypes
  , cx = React.addons.classSet

var BookListing = React.createClass({
  propTypes: {
    goTo: PT.func,
    book: PT.object,
  },
  getInitialState: function () {
    return {open: false}
  },
  _onToggle: function () {
    this.setState({open: !this.state.open})
  },
  render: function () {
    var book = this.props.book
    return <li className={cx({
      "BookListing": true,
      'BookListing-open': this.state.open
    })}>
      <div className="BookListing_title" onClick={this._onToggle}>
        {book.title}
      </div>
      {this.state.open &&
        <ul className="BookListing_chapters">
          {book.chapters.map(chapter =>
            <li
              onClick={this.props.goTo.bind(null, chapter.fname, 0)}
              className="BookListing_chapter"
            >
              {chapter.title}
            </li>
          )}
        </ul>}
    </li>
  }
})

module.exports = BookListing



