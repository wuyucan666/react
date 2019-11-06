import React, { Component } from "react"
import { Link } from "dva/router"

interface MainBoxProp {
  /**盒子的标题 */
  title: string
  /**右边的链接，如果有，则显示查看更多 */
  link?: string
}

export default class MainBox extends Component<MainBoxProp> {
  render() {
    return (
      <div className="main-box">
        <div className="head flex center">
          <span className="item">{this.props.title}</span>
          {this.props.link && (
            <Link to={{ pathname: this.props.link }}>查看更多 ></Link>
          )}
        </div>
        <div className="main">{this.props.children}</div>
      </div>
    )
  }
}
