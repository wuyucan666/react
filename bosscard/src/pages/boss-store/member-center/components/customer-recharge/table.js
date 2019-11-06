import React, { Component } from "react"
import { Table, Input, DatePicker, Select, Button, Icon } from "antd"
import moment from 'moment'

const InputGroup = Input.Group
const Option = Select.Option
export default class TableComponent extends Component {
  state = {
  }
  // 表格
  columns = [
    {
      title: "名称",
      dataIndex: "cardName",
      key: 0,
    },
    {
      title: "剩余金额",
      dataIndex: "giveMoney",
      key: 2,
      render: (value, ret, index) =>
        (
          <div>
            {(
              <Input
                style={{ width: 70 }}
                size="large"
                value={value}
                onChange={(e) => {
                  let g = e.target.value.match(/^[0-9]+\.{0,1}[0-9]{0,2}$/)
                  if (e.target.value.substr(0, 1) === '0' && e.target.value.substr(1, 1) === '0') {
                    g = ''
                  }
                  const num = g ? g[0] : ''
                  this.props.setValue(
                    {
                      giveMoney: num,
                    },
                    ret,
                    index
                  )
                }}
              />
            )}
          </div>
        ),
    },
    {
      title: "到期时间",
      dataIndex: "deadlineTime",
      key: 5,
      render: (value, ret, index) =>
        (
          <div className="date-select">
            <InputGroup compact style={{ width: '220px' }} size="large">
              <Select defaultValue="有限期" style={{ width: '95px' }} size="large" onChange={(e) => {
                this.props.setValue(
                  {
                    deadlineTime: e === -1 ? '' : ret.deadline,
                  },
                  ret,
                  index,
                )
              }}>
                <Option value={1}>有限期</Option>
                <Option value={-1}>无限期</Option>
              </Select>
              <DatePicker size="large" style={{ width: '125px' }} disabled={!value} format="YYYY-MM-DD" allowClear={false} value={value ? moment(value, 'YYYY-MM-DD') : undefined} onChange={(e, t) => {
                this.props.setValue(
                  {
                    deadlineTime: t,
                  },
                  ret,
                  index,
                )
              }} />
            </InputGroup>
          </div>
        ),
    },
    {
      title: "绑定车辆",
      dataIndex: "car",
      key: 6,
      render: (value, ret, index) => (
        <div><Button type="primary" size="large" onClick={() => {
          this.props.chooseCar(index)
        }} >选择车辆（{value.length}）</Button></div>
      ),
    },
    {
      title: "",
      dataIndex: "speciesId",
      key: 7,
      render: (value, ret, index) =>
        (
          <div><Icon type="delete" style={{ fontSize: '18px', color: '#CCCCCCFF', cursor: 'pointer' }} onClick={() => {
            this.props.deleteTab(index)
          }} /></div>
        ),
    },
  ]

  render() {
    const { cardData } = this.props
    return (
      <Table
        columns={this.columns}
        pagination={{ hideOnSinglePage: true, defaultPageSize: 50 }}
        dataSource={cardData || []}
      />
    )
  }
}
