import { Component } from "react"
import { Table } from 'antd'

import styles from './style.less'

class cardInfo extends Component {
  render () {
    const columns = [{
      title: '项目',
      dataIndex: 'name',
      align: "left",
    },{
      title: '折扣',
      dataIndex: 'discount',
      align: 'left',
      render: (c, item) => {
        if(item.discountType === 1) {
          return c
        }else {
          return '-'
        }
      },
    },{
      title: '抵扣金额',
      dataIndex: 'itemTotal',
      align: 'left',
    },{
      title: '消耗余额',
      dataIndex: 'spend',
      align: 'left',
    }]
    return (
      <div className={styles.card}>
        <div className={styles.tit + ' flex'}>
          <div className='item'>抵扣规则 <span>({this.props.info[0].cardName}) :</span></div>
          <div>余额: {this.props.info[0].balance}元</div>
        </div>
        <div>
          <Table
          dataSource={this.props.info[0].bestPay}
          columns={columns}
          pagination={false}
          className={styles.ainier_tab}
          >
          </Table>
        </div>
      </div>
    )
  }
}

export default cardInfo