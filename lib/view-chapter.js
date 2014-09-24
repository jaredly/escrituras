
var React = require('react')
  , PT = React.PropTypes

var ViewChapter = React.createClass({
  propTypes: {
    goTo: PT.func,
    goHome: PT.func,
    goPrev: PT.func,
    goNext: PT.func,
    pos: PT.object,
  },

  shouldComponentUpdate: function (nextProps, nextState) {
    return this.state !== nextState || nextProps.pos.fname !== this.props.fname
  },

  getInitialState: function () {
    return {
      loading: true,
    }
  },

  componentDidMount: function () {
    window.document.body.scrollTop = this.props.pos.top
    if (!this.props.cache.get(this.props.pos.fname, this._gotData)) {
      this.setState({
        loading: true
      })
    } else {
      this.setState({
        loading: false
      })
    }
    window.addEventListener('scroll', () => {
      if (!this.isMounted()) return
      this.props.goTo(this.props.pos.fname, window.document.body.scrollTop)
    })
  },

  componentWillReceiveProps: function (nextProps) {
    if (nextProps.pos !== this.props.pos) {
      if (!this.props.cache.get(nextProps.pos.fname, this._gotData)) {
        this.setState({
          loading: true
        })
      } else {
        this.setState({
          loading: false
        })
      }
    }
  },

  _gotData: function (data) {
    this.setState({
      data: data,
      loading: false,
    }, () => {
      window.document.body.scrollTop = this.props.pos.top
    })
  },

  render: function () {
    return <div className="Chapter">
      <div className="Chapter_head">
        <button className="Chapter_home" onClick={this.props.goHome}>Home</button>
        <button className="Chapter_prev" onClick={this.props.goPrev}>Prev</button>
        <button className="Chapter_next" onClick={this.props.goNext}>Next</button>
      </div>
      <div className="Chapter_title">
        {this.props.info.title}
      </div>

      {this.state.loading ?
        <div className="Chapter_loading">'Loading...'</div> :
        <ul className="verses">
          {this.state.data.map(verse =>
            <div className="verse">
              <div className="spanish">{verse[1]}</div>
              <div className="english">{verse[0]}</div>
            </div>)}
        </ul>
      }

      <div className="Chapter_foot">
        <button className="Chapter_home" onClick={this.props.goHome}>Home</button>
        <button className="Chapter_prev" onClick={this.props.goPrev}>Prev</button>
        <button className="Chapter_next" onClick={this.props.goNext}>Next</button>
      </div>
    </div>
  }
})

module.exports = ViewChapter

