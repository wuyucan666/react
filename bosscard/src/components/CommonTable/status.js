import React, { Component } from "react"
import PropTypes from "prop-types"

export default class StatusShow extends Component {
  static propTypes = {
    status: PropTypes.bool,
  }

  render() {
    return (
      <div className="status-show flex center left">
        <i style={{ width: 6, height: 6, borderRadius: 6, backgroundColor: this.props.status ? '#10E21A' : '#FF4646', display: 'block', marginRight: 8}} />
        {this.props.children}
      </div>
    )
  }
}
