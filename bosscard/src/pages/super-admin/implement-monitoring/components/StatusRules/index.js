import React, { Component } from 'react'
import { Modal } from 'antd'

import style from './style.less'

class StatusRules extends Component{
  state = {
    visble: false,
  }

  toggleVisble = () => {
    this.setState((prevState) => {
      return {
        visble: !prevState.visble,
      }
    })
  }
  render() {
    const { visble } = this.state
    return (
      <div>
        <span className={style.btn} onClick={this.toggleVisble}>门店状态规则？</span>
        <Modal
          title="门店状态规则"
          width={1200}
          visible={visble}
          footer={null}
          bodyStyle={{paddingBottom: 32}}
          onCancel={this.toggleVisble}
        >
          <table className={style.table}>
            <tbody>
            <tr>
              <th rowSpan="2" style={{width: 110, textAlign: 'center'}}>状态</th>
              <th colSpan="4" style={{textAlign: 'center'}}>基础数据（当前数量）</th>
              <th rowSpan="2" style={{width: 94, textAlign: 'center'}}>时间</th>
              <th style={{textAlign: 'center'}}>交互数据</th>
              <th colSpan="2" style={{textAlign: 'center'}}>交易数据</th>
              <th rowSpan="2" style={{textAlign: 'center'}}>说明</th>
            </tr>
            <tr>
              <th style={{width: 94}}>员工数</th>
              <th style={{width: 94}}>车辆数</th>
              <th style={{width: 94}}>项目数</th>
              <th style={{width: 94}}>产品数</th>
              <th style={{width: 94}}>开单点击数</th>
              <th style={{width: 94}}>完成订单数</th>
              <th style={{width: 94}}>有开单天数</th>
            </tr>
            <tr>
              <td>未用</td>
              <td colSpan="4">任意一项为0</td>
              <td>--</td>
              <td>--</td>
              <td>--</td>
              <td>--</td>
              <td>没有基础数据</td>
            </tr>
            <tr>
              <td>在用</td>
              <td>>0</td>
              <td>>0</td>
              <td>>0</td>
              <td>>0</td>
              <td>最近3天</td>
              <td>>45</td>
              <td>--</td>
              <td>--</td>
              <td>有基础数据，尝试使用开单</td>
            </tr>
            <tr>
              <td>会用</td>
              <td>>0</td>
              <td>>0</td>
              <td>>5</td>
              <td>>5</td>
              <td>最近3天</td>
              <td>>45</td>
              <td>>1</td>
              <td>--</td>
              <td>有一定的基础数据，能够开单</td>
            </tr>
            <tr>
              <td>常用</td>
              <td>>0</td>
              <td>>0</td>
              <td>>5</td>
              <td>>5</td>
              <td>最近30天</td>
              <td>>150</td>
              <td>>23</td>
              <td>>23</td>
              <td>最近30天，最少24天有开单</td>
            </tr>
            <tr>
              <td>睡眠</td>
              <td>>0</td>
              <td>>0</td>
              <td>>0</td>
              <td>>0</td>
              <td>最近7天</td>
              <td>≤45</td>
              <td>0</td>
              <td>--</td>
              <td>有基础数据，没有开单，也没有尝试开单</td>
            </tr>
            </tbody>
          </table>
        </Modal>
      </div>
    )
  }
}

export default StatusRules
