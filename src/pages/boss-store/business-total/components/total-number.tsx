import React, { Component } from 'react'
import { Spin, Tooltip } from 'antd';
const styles = require('./total-number.less')

interface Props {
  label: string
  value: number
  helpText: any
  loading: boolean
}

export default class TotalNumber extends Component<Props> {
  render() {
    return (
      <div className={styles.total_number}>
        <Spin spinning={this.props.loading}>
          <div className="title flex center left">{this.props.label}<Tooltip title={this.props.helpText} placement="topLeft" arrowPointAtCenter><i className="iconfont icon-wenhao1"></i></Tooltip></div>
          <div className="value">{this.props.value}</div>
        </Spin>
      </div>
    )
  }
}
