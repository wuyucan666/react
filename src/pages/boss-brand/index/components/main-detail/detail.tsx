import React, { Component } from "react"
import { Spin } from "antd"

interface Content {
  /** 左侧属性 */
  label: string
  /** 右侧内容 */
  value: number | string
  /** 是否支持跳转，当前数据跳转的地址 */
  link?: string
}

interface Props {
  /** 每一个 content 的标题 */
  title: string
  /** 数据列表 */
  content: Array<Content>
  /**是否在加载中 */
  loading: boolean
}

export default class Detail extends Component<Props> {
  render() {
    return (
      <div>
        <Spin spinning={this.props.loading}>
          <div className="title">{this.props.title}</div>
          <div className="content">
            {this.props.content.map((_, index) => (
              <div className="flex" key={index}>
                <div className="label flex center left">{_.label}</div>
                <div
                  className="value flex center left item"
                  style={{ paddingLeft: 24 }}
                >
                  {_.value}
                </div>
              </div>
            ))}
          </div>
        </Spin>
      </div>
    )
  }
}
