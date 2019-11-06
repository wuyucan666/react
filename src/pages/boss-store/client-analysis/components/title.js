import React, { Component } from "react"
import PropTypes from "prop-types"
import styles from "./title.less"

export default class Title extends Component {
  static propTypes = {
    title: PropTypes.string,
  }

  render() {
    return (
      <div className="flex center left" style={{ position: 'relative' }}>
        <div className={styles.title + " item"}>{this.props.title}</div>
        {this.props.children}
      </div>
    )
  }
}
