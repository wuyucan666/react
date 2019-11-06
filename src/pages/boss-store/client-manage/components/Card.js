/**
 * Created by kikazheng on 2019/4/15
 */
import React, {Component} from 'react'
import {Modal, Table} from 'antd'
import moment from 'moment'
import styles from "../style.less"
import services from "../../../../services"

const { Column } = Table

class Card extends Component{
  state = {
    loading: false,
    selectedRowKeys: [],
  }
  onOk = () => {
    this.setState({loading: true})
    const { selectedRowKeys, cardList, carId, clientId, onOk } = this.props
    let data = selectedRowKeys.map(item => ({
      id: item,
      cardType: cardList.filter(item2 => item2.id === item)[0].cardType,
    }))
    services.INSERT({ keys: { name: 'store/clientcard/limit' }, data: { carId, clientId, data } }).then(res => {
      this.setState({loading: false})
      if (res.success) {
        onOk()
      }
    }).catch(() => {
      this.setState({loading: false})
    })
  }
  onCancel = () => {
    this.props.onCancel()
  }
  render(){
    const {visible, cardList, selectedRowKeys, rowChange, delSelectedRowKeys} = this.props
    const {loading} = this.state
    return(
      <Modal
        title='选择关联卡项'
        width={900}
        destroyOnClose={true}
        confirmLoading={loading}
        visible={visible}
        onOk={this.onOk}
        onCancel={this.onCancel}
      >
        <div>
          <Table
            dataSource={cardList}
            rowKey={row => row.id}
            pagination={false}
            scroll={{ y: 400 }}
            rowSelection={{
              selectedRowKeys,
              onChange: rowChange,
            }}
          >
            <Column
              title="卡名称"
              dataIndex="cardName"
              key="cardName"
              align='left'
              width='40%'
            />
            <Column
              title="卡类型"
              dataIndex="cardType"
              key="cardType"
              align='left'
              width='30%'
              render={text => text === 1 ? '充值卡' : '计次卡'}
            />
            <Column
              title="办卡时间"
              dataIndex="created"
              key="created"
              align='left'
              width='30%'
              render={text => moment(text * 1000).format('YYYY-MM-DD HH:mm:ss')}
            />
          </Table>
          <div className={styles.selectTip}>
            <span>已选择</span>
            <div className={styles.signList}>
              {
                cardList.map(item => {
                  if (selectedRowKeys.indexOf(item.id) > -1) {
                    return (
                      <div key={item.id} className={styles.item}>
                        <span>{item.cardName}</span>
                        <span className='iconfont icon-quxiao' onClick={() =>delSelectedRowKeys(item.id)} />
                      </div>
                    )
                  } else {
                    return ''
                  }
                })
              }
            </div>
          </div>
        </div>
      </Modal>
    )
  }
}

export default Card
