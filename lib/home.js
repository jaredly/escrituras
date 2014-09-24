
var React = require('react')
  , PT = React.PropTypes

  , BookListing = require('./book-listing')

var Home = React.createClass({
  propTypes: {
    goTo: PT.func,
    books: PT.object,
  },
  render: function () {
    return <div className="Home">
      <div className="Home_title">
        English/Spanish Scriptures!
      </div>
      <ul className="BookList">
        {this.props.books.map(book =>
          <BookListing book={book} goTo={this.props.goTo}/>
        )}
      </ul>
    </div>
  }
})

module.exports = Home

