import React, { Component } from 'react'
import { Tooltip, Input,Select ,Icon} from 'antd'
import styles from '../styles.less'
const Option = Select.Option

export default class AddItem extends Component {
  constructor(props){
    super(props)
  }
  render() {
    const {num} =this.props
    return (
      <div  className={styles.addRow}>
              <table>
            <tbody>
              <tr>
                <td><Icon type='ordered-list'/></td>
                <td>{num}</td>
                <td><Input></Input></td>
                <td> <div><Select defaultValue="" style={{ width: '120px' }}>
            <Option value="1">1</Option>
            <Option value="2">2</Option>
            <Option value="3">3</Option>
            <Option value="4">4</Option>
            <Option v alue="5">5</Option>
          </Select></div>
          <div className={styles.btnWrap}>
            <Tooltip title='编辑'>
              <i style={{ marginLeft: "12px" }} className="iconfont icon-tianjia" />
            </Tooltip>
            <Tooltip title='删除'>
              <i style={{ marginLeft: "12px" }} className="iconfont icon-shanchu" />
            </Tooltip>
          </div></td>
              </tr>
            </tbody>
        </table>
        </div>
    )
  }
}
