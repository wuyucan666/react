import React, { Component } from 'react';
import CommonTable from 'components/CommonTable';
import tableConfig from './tableConfig';
import DetailModal from './detail';
import request from 'utils/request';
import { message, Spin } from 'antd';
import Print from '../member-center/components/print';

export default class GiveList extends Component {
  state = {
    showDetail: false,
    detail: [],
    loading: false,
    orderId: 0
  };

	/**
	 * 表格变更操作
	 *
	 * @param type {number} 类型
	 * @param record {object} 当前操作的行的数据
	 */
  handleTableChange = (type: number, record: any) => {
    if (type === 14) {
      this.getDetail(record.orderId);
    }
    if (type === 24) {
      this.setState({ orderId: record.orderId });
    }
  };

  getDetail = id => {
    this.setState({ loading: true });
    request({
      url: 'wide-transaction/persent/report/' + id
    })
      .then(res => {
        this.setState({ detail: res.list, loading: false, showDetail: true });
      })
      .catch(() => {
        this.setState({ loading: false });
      });
  };

  handleClose = () => this.setState({ showDetail: false });

  handlePrintReset = () => this.setState({orderId: undefined})

  render() {
    return (
      <Spin spinning={this.state.loading}>
        <CommonTable
          tableConfig={tableConfig}
          name="wide-transaction/persent/report"
          New
          onTableChange={this.handleTableChange}
        />
        <DetailModal show={this.state.showDetail} close={this.handleClose} data={this.state.detail} />
        <Print orderId={this.state.orderId} isListPage type={8} isGive onReset={this.handlePrintReset} />
      </Spin>
    );
  }
}
