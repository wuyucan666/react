import React, { Component } from 'react'
import CommonTable from 'components/CommonTable'
import tableConfig from './tableConfig'
import { connect } from "dva"
import services from '../../../services'
import Print from '../member-center/components/print'
import Detail from './detail'
import {  Modal } from 'antd'
import moment from 'moment'
class ExtendCardDetail extends Component {
  state = {
    orderId: 0,
    visible: false,
    details: {}, // 卡详情信息
    detailItem: {},
    pathName: '',
  };

  handleTableChange = (type, item) => {
    if (type === 14) {
      this.showModal(item)
    }
    if (type === 18) {
      console.log('handleTableChange-item',item)
      let that = this
      Modal.confirm({
        title: '确定作废此订单？',
        content: '',
        okText: '确认',
        cancelText: '取消',
        icon: (
          <div
            style={{
              width: '37px',
              height: '37px',
              background: '#FF303D',
              borderRadius: '50%',
              textAlign: 'center',
              lineHeight: '37px',
              marginLeft: '177px',
              marginBottom: '10px',
            }}
          >
            <i className="iconfont icon-shanchu" style={{ color: '#fff' }} />
          </div>
        ),
        closable: true,
        centered: true,
        maskClosable: true,
        maskStyle: {
          background: 'rgba(0,0,0,0.65)',
        },
        className: 'madalDiv',
        onOk() {
          that.cancellations(item.cardId, item.clientName, item.orderId )
        },
      })
    }
    if (type === 24) {
      this.setState({ orderId: item.orderId })
    }
  };
  /**
	 * 撤单
	 */
  cancellations = ( id, clientName, orderId ) => {
    services
      .DELETE({
        keys: { name: 'store/clientcard/cancel', id },
        data: { clientName, orderId : orderId },
      })
      .then(res => {
        // console.log('props',this.props)
        const { dispatch } = this.props
        if (res.code === '0') {
          dispatch({
            type: 'table/getData',
            payload: {new: 'refill/particulars'},
          })
          this.hideModal( )
        }
      })
  };
  hideModal() {
    this.setState({
      visible: false,
    })
    if (!(JSON.stringify(this.props.location.query) === "{}")) {
      this.props.history.goBack()
    }
  }
  showModal(item) {
    this.setState({
      visible: true,
      detailItem: item,
    })
  }
  handlePrintReset = () => {
    this.setState({orderId: undefined})
  }
  componentDidMount() {
    // console.log('props',this.props)
    this.setState({
      pathName: '/boss-store/extend-card-detail',
    })
    if (!(JSON.stringify(this.props.location.query) === "{}")) {
      const { cardId, orderId, redirect } = this.props.location.query
      let obj = {
        cardId,
        orderId,
        redirect,
      }
      this.showModal(obj)
    } else {
      this.props.dispatch({ type: 'refill/particulars', payload: {} })
      let day = moment().format('YYYY-MM-DD')
      let days = day + ' 23:59:59'
      this.setState({
        start: moment(day).unix(),
        end: moment(days).unix(),
      })
    }
  }

  render() {
    const { details } = this.state
    return (
      <div>
        <div style={{ display: this.state.visible ? 'none' : '' }}>
        <CommonTable
          New
          name="refill/particulars"
          tableConfig={tableConfig}
          onTableChange={this.handleTableChange.bind(this)}
        />
        </div>
        {this.state.visible && <Detail
          hideModal={this.hideModal.bind(this)}
          detailItem={this.state.detailItem}
          details={details}
          onTableChange={this.handleTableChange.bind(this)}
        />}
        <Print type={7} orderId={this.state.orderId} isListPage onReset={this.handlePrintReset} pathName={this.state.pathName}/>
      </div>
    )
  }
}
export default connect()(ExtendCardDetail)
