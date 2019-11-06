import React, { Component } from 'react'
import { Table } from 'antd';

interface Props {
  data: any[]
}

export default class DataTable extends Component<Props> {
  handleRenderCol = (text, record) => {
    let color = '#13B10F'
    if (/-/.test(text)) {
      color = '#FF1C1C'
    } else {
      text = '+' + text
    }
    return <span style={{ color }}>{text + "%"}</span>
  }
  render() {
    return (
      <div>
        <Table dataSource={this.props.data} pagination={false}>
          <Table.Column title="月份" dataIndex="month" width="5%"></Table.Column>
          <Table.Column title="营业额" dataIndex="output" width="7%"></Table.Column>
          <Table.Column render={this.handleRenderCol} title="环比增长" dataIndex="outputRatio" width="12%"></Table.Column>
          <Table.Column title="成本" dataIndex="cost" width="7%"></Table.Column>
          <Table.Column render={this.handleRenderCol} title="环比增长" dataIndex="costRatio" width="12%"></Table.Column>
          <Table.Column title="毛利" dataIndex="profit" width="7%"></Table.Column>
          <Table.Column render={this.handleRenderCol} title="环比增长" dataIndex="profitRatio" width="12%"></Table.Column>
          <Table.Column title="进货支出" dataIndex="purchase" width="7%"></Table.Column>
          <Table.Column render={this.handleRenderCol} title="环比增长" dataIndex="purchaseRatio" width="12%"></Table.Column>
          <Table.Column title="现金结余" dataIndex="balance" width="7%"></Table.Column>
          <Table.Column render={this.handleRenderCol} title="环比增长" dataIndex="balanceRatio" width="12%"></Table.Column>
        </Table>
      </div>
    )
  }
}
