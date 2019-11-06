import React, { Component } from 'react';
import CommonTable from 'components/CommonTable';
import tableConfig from './tableConfig';
import * as moment from "moment";
import router from 'umi/router';
import request from 'utils/request';
import { connect } from 'dva';


export default connect()(
  class CommissionDetail extends Component<any> {
    state = {
      tableConfig,
      loading:false
    };

    componentDidMount = () => {
      this.getStaffs();
      const {date, staffId} = this.props.location.query
      if (staffId) {
        tableConfig.screen.rules[0].defaultValue = staffId
        const date1 = date[0]?moment(moment(date[0]*1000).format('YYYY-MM-DD')):moment(moment(date['completed[<>]'][0]*1000).format('YYYY-MM-DD'))
        const date2 = date[1]?moment(moment(date[1]*1000).format('YYYY-MM-DD')):moment(moment(date['completed[<>]'][1]*1000).format('YYYY-MM-DD'))
        tableConfig.screen.rules[2].defaultValue = [date1, date2]
        this.setState({ tableConfig,loading:false }, () => this.setState({ loading: true }))
      }else{
        this.setState({ loading: false },()=>{
          this.setState({loading:true})
        })
      }
    };

    handleTableChange = (type, record) => {
      /**跳转到订单详情 */
      if (type === 20) {
        /**维修开单 */
        if (record.orderType * 1 === 3 || record.orderType * 1 === 4) {
          this.props.dispatch({
            type: 'maintianList/goDetail',
            payload: { orderId: record.orderId, orderType: record.orderType, path: this.props.match.path }
          });

          router.push({ pathname: '/boss-store/maintain-list/orderAll' });
          /**办卡类型 */
        } else if (record.orderType * 1 === 1 || record.orderType * 1 === 2) {
          router.push({
            pathname: '/boss-store/member-card',
            query: { cardId: record.clientCardId, orderId: record.orderId, redirect: this.props.match.path }
          });
          /**续卡类型 */
        } else if (record.orderType * 1 === 7) {
          router.push({
            pathname: '/boss-store/extend-card-detail',
            query: { cardId: record.clientCardId, orderId: record.orderId, redirect: this.props.match.path }
          });
          /**挂账还款类型 */
        } else if (record.orderType * 1 === 6) {
          this.props.dispatch({
            type: 'maintianList/goDetail',
            payload: { orderId: record.repaymentId, orderType: record.repaymentType, path: this.props.match.path }
          });

          router.push({ pathname: '/boss-store/maintain-list/orderAll' });
        }
      }
    };

    getStaffs = async () => {
      const res = await request({ url: 'store/staff/list' });
      if (res.code === '0') {
        const newTableConfig = {...tableConfig}
        newTableConfig.screen.rules[0].list = res.list.map((_: any) => ({
          name: _.staffName,
          value: _.staffId
        }));
        this.setState({ tableConfig: newTableConfig })
      }
    };
    componentWillUnmount() {
      tableConfig.screen.rules[0].defaultValue = undefined
      tableConfig.screen.rules[2].defaultValue = undefined
    }

    onReSet = () => {
      tableConfig.screen.rules[0].defaultValue = undefined
      tableConfig.screen.rules[2].defaultValue = undefined
    }

    render() {
      const { tableConfig, loading } = this.state
      return (
        <div>
          {loading&&<CommonTable
            name="wide-staff/details"
            New
            tableConfig={tableConfig}
            onTableChange={this.handleTableChange}
            onReSet={this.onReSet}
          />}
        </div>
      );
    }
  }
);
