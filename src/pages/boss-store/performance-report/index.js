import React, { Component } from 'react'
import { connect } from 'dva'
import clonedeep from 'lodash.clonedeep'
import CommonTable from 'components/CommonTable/index'
import config from './tableConfig'
import request from '../../../utils/request'
import moment from "moment"


class report extends Component {
  state = {
    loading: false,
    tableConfig: clonedeep(config),
  }

  async componentDidMount() {

    await this.getStaffs()
    const { staffId, date } = this.props.history.location.query
    // console.log(staffId,date)
    if (staffId) {
      const {tableConfig} = this.state
      // tableConfig.screen.query.staffId = staffId
      tableConfig.screen.rules[1].defaultValue = staffId
      const date1 = moment(moment(date[0]*1000).format('YYYY-MM-DD'))
      const date2 = moment(moment(date[1]*1000).format('YYYY-MM-DD'))
      tableConfig.screen.rules[2].defaultValue = [date1, date2]
      this.setState({ tableConfig,loading:false }, () => this.setState({ loading: true }))
    }else{
      this.setState({ loading: false },()=>{
        this.setState({loading:true})
      })
    }
    //订单号
    // tableConfig.headers[1].render = (e) => {
    //     return (
    //       <a
    //         style={{
    //           fontFamily: "MicrosoftYaHei",
    //           color: e.originalOrderId===0 ? "#4AACF7" : '#666' ,
    //         }}
    //         onClick={()=>{
    //           if(e.originalOrderId!==0) return
    //           const {dispatch,history,match} = this.props
    //           dispatch({
    //             type: "maintianList/goDetail",
    //             payload: { orderId: e.orderId, orderType: e.orderType , path:match.path, isHideDetailBtns: true, },
    //           })
    //           history.push("/boss-store/maintain-list")

    //         }}
    //       >
    //         {e.orderId}
    //       </a>
    //     )
    // }
    //原单号
    //   tableConfig.headers[1].render = (e) => {
    //     return (
    //       <a
    //         style={{
    //           fontFamily: "MicrosoftYaHei",
    //           color:e.originalOrderId===0 ? '#666' : "#4AACF7",
    //         }}
    //         onClick={()=>{
    //           if(e.originalOrderId===0)return
    //           const {dispatch,history,match} = this.props
    //           dispatch({
    //             type: "maintianList/goDetail",
    //             payload: { orderId: e.originalOrderId, orderType: e.orderType , path:match.path, isHideDetailBtns: true, },
    //           })
    //           history.push("/boss-store/maintain-list/orderAll")

    //         }}
    //       >
    //         {e.originalOrderId === 0 ? '-' : e.originalOrderId  }
    //       </a>
    //     )
    // }

    this.setState({
      loading: true,
    })
  }

  componentWillUnmount(){
    const {tableConfig} = this.state
    tableConfig.screen.rules[1].defaultValue = undefined
    tableConfig.screen.rules[2].defaultValue = undefined
  }

  //进入表格数据,加个唯一标识key
  changeDate = (data) => {
    return data.map((v, idx) => ({ ...v, key: idx + new Date().getTime() }))
  }

  onTableChange = (v, e) => {
    // console.log(v,e)
    if (v === 14) {
      const {dispatch,history,match} = this.props
      dispatch({
        type: "maintianList/goDetail",
        payload: { orderId: e.orderId, orderType: e.orderType , path:match.path, isHideDetailBtns: true },
      })
      history.push("/boss-store/maintain-list/orderAll")
    }
  }

  getStaffs = async () => {
    const res = await request({ url: 'store/staff/list' })
    if (res.code === '0') {
      const {tableConfig} = this.state
      tableConfig.screen.rules[1].list = res.list.map((_) => ({
        name: _.staffName,
        value: _.staffId,
      }))
      this.setState({ tableConfig })
    }
  }

  onReSet = () => {
    const {tableConfig} = this.state
    // tableConfig.screen.query.staffId = undefined
    tableConfig.screen.rules[1].defaultValue = undefined
    tableConfig.screen.rules[2].defaultValue = undefined
    tableConfig.screen.query = {}
    this.setState({ tableConfig,loading:false }, () => this.setState({ loading: true }))
  }


  renderTable = () => {
    return <CommonTable
      name='wide-detail/goods/wide/list'
      tableConfig={this.state.tableConfig}
      onDataChangeBefore={this.changeDate}
      onTableChange={this.onTableChange}
      onReSet={this.onReSet}
      New
    >
    </CommonTable>
  }
  render() {
    const { loading } = this.state
    return <div>
      {
        loading && this.renderTable()
      }
    </div>
  }

}

export default connect()(report)
