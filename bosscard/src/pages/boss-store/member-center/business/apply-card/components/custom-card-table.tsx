import React, { Component } from 'react'
import { Table, InputNumber, Select, DatePicker } from 'antd';

interface Props {
  data: any[]
  /**
   * @param data [Array] 数据
   * @param newTotal [Boolean] 是否需要重新计算合计
   */
  onChange: (data: any[], newTotal) => any
}

export default class CustomCardTable extends Component<Props> {

  /**监听控件输入 */
  handleChangeValue = (type, isNumber, index, record, newTotal) => (value) => {
    let _value = value
    if (isNumber) {
      _value = parseFloat(_value)
    }
    let _data = [...this.props.data]
    _data.splice(index, 1, { ...record, [type]: _value })
    this.props.onChange(_data, newTotal)
  }

  /**监听金额变化 */
  handleChangeBalidityPeriod = (record, index) => (value) => {
    const _value = value || 0
    const totalMoney = record.isInfiniteNum === 0 ? record.numTem * (record.unitPrice * 100) / 100 : parseFloat(record.unitPrice)
    let discount = parseFloat(((_value * 100) / (totalMoney * 100) * 10).toFixed(1))
    discount = discount > 10 ? 10 : discount
    this.handleChangeValue('balidityPeriod', true, index, { ...record, discount }, true)(_value)
  }

  handleChangeDiscount = (record, index) => (value) => {
    if (value <= 10 && value >= 0) {
      const totalMoney = record.isInfiniteNum === 0 ? record.numTem * (record.unitPrice * 100) / 100 : parseFloat(record.unitPrice)
      const balidityPeriod = parseFloat(((value / 10) * (totalMoney * 100) / 100).toFixed(2))
      this.handleChangeValue('discount', true, index, { ...record, balidityPeriod }, true)(value)
    }
  }

  handleChangeNum = (record, index) => (value) => {
    if (value > 0) {
      const totalMoney = value * (record.unitPrice * 100) / 100
      const balidityPeriod = parseFloat(((record.discount / 10) * (totalMoney * 100) / 100).toFixed(2))
      this.handleChangeValue('numTem', true, index, { ...record, balidityPeriod }, true)(value)
    }
  }


  render() {
    return (
      <div>
        <Table dataSource={this.props.data} pagination={false}>
          <Table.Column title="名称" dataIndex="pName" render={(text) => text || '合计'}></Table.Column>

          <Table.Column title="编码" dataIndex="code" render={(text) => text || '--'}></Table.Column>

          <Table.Column title="单价" dataIndex="unitPrice"></Table.Column>

          <Table.Column title="数量" dataIndex="numTem" render={(text, record: any, index) => <div>
            {(record.key !== -1) ? <div className="flex"><Select value={record.isInfiniteNum} onChange={this.handleChangeValue('isInfiniteNum', false, index, record, false)}>
              <Select.Option value={1}>无限</Select.Option>
              <Select.Option value={0}>有限</Select.Option>
            </Select>
              <InputNumber min={0} disabled={record.isInfiniteNum === 1} value={text} onChange={this.handleChangeNum(record, index)}></InputNumber></div> : text}
          </div>}></Table.Column>

          <Table.Column title="折扣" dataIndex="discount" render={(text, record: any, index) => <div>
            {(record.key !== -1) ? <InputNumber onChange={this.handleChangeDiscount(record, index)} min={0} max={10} precision={1} value={text}></InputNumber> : ''}
          </div>}></Table.Column>

          <Table.Column title="金额" dataIndex="balidityPeriod" render={(text, record: any, index) => <div>
            {record.key !== -1 ? <InputNumber min={0} precision={2} value={text} onChange={this.handleChangeBalidityPeriod(record, index)}></InputNumber> : text}
          </div>}></Table.Column>

          <Table.Column title="有效期" dataIndex="deadlineTime" render={(text, record: any, index) => <div>
            {(record.key !== -1) ? <div className="flex"><Select value={record.deadline} onChange={this.handleChangeValue('deadline', false, index, record, false)}>
              <Select.Option value={1}>无限</Select.Option>
              <Select.Option value={0}>有限</Select.Option>
            </Select>
              <DatePicker disabled={record.deadline === 1} value={text} onChange={this.handleChangeValue('deadlineTime', false, index, record, false)}></DatePicker></div> : ''}
          </div>}></Table.Column>
        </Table>
      </div>
    )
  }
}
