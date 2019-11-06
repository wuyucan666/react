/**
 * @file 挂账还款列表
 */

import React, { PureComponent } from "react"
import CommonTable from "components/CommonTable"
import tableConfig from "./tableConfig"
import { connect } from "dva"
import request from "utils/request"
import moment from 'moment'

export default connect()(
  class UpCardConsumptionList extends PureComponent {
    state = {
      tableConfig,
      show: false,
    }

    componentDidMount = () => {
      this.getPayments()
      const { fromIndex, created } = this.props.location.query
      if(fromIndex) {
        tableConfig.screen.query = {
          'created[<>]': created,
        }
      }
      if (this.props.location.query.date) {
        const date = this.props.location.query.date
        const isTotal = this.props.location.query.isTotal
        tableConfig.screen.rules[1].defaultValue = isTotal ? [moment(date).startOf('month'), moment(date).endOf("month")] : [moment(date), moment(date)]
        this.setState({ tableConfig }, () => this.setState({ show: true }))
      } else {
        this.setState({ show: true })
      }
    }

    componentWillUnmount = () => tableConfig.screen.rules[1].defaultValue = undefined

    handlerTableChange(type, item) {
      /**查看详情 */
      if (type === 17) {
        this.props.dispatch({
          type: "maintianList/goDetail",
          payload: { orderId: item.repayOrderId, orderType: item.orderType, isHideDetailBtns: true },
        })
      }
    }

    getPayments = async () => {
      const res = await request({
        url: 'wide-detail/arrears/paytype',
      })
      const newTableConfig = { ...tableConfig }
      newTableConfig.screen.rules[2].list = res.list
      this.setState({ tableConfig: newTableConfig })
    }

    render() {
      return this.state.show && (
        <CommonTable
          name="wide-detail/arrears"
          tableConfig={this.state.tableConfig}
          onTableChange={this.handlerTableChange}
        />
      )
    }
  }
)
