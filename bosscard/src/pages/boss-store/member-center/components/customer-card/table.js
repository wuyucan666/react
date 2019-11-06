import React, { Component } from "react"
import { Table, Input, DatePicker, Button, Select } from "antd"
import ProjectTk from 'components/setPrice/project'
import ProductTk from 'components/setPrice/product'
import moment from 'moment'
import units from "./units"
import styles from "./index.less"

const InputGroup = Input.Group
const Option = Select.Option

export default class TableComponent extends Component {
  state = {
    units,
    curItem: {},
    showNew: false,
    curIndex: 0,
    hasProject: JSON.parse(window.localStorage.getItem("permissionRole")).findIndex(v => v === 51) !== -1,
    hasProduct: JSON.parse(window.localStorage.getItem("permissionRole")).findIndex(v => v === 53) !== -1,
  }
  // 表格
  columns = [
    {
      title: "名称",
      dataIndex: "goodName",
      key: 0,
    },
    {
      title: "编码",
      dataIndex: "commodityCode",
      key: 'commodityCode',
    },
    {
      title: "单价",
      dataIndex: "goodPrice",
      key: 1,
      render: (value, render, index) => {
        return (
          <div>
            {
              render.info*1 === 2 ?
              <div>
                <span style={{color: '#FF6F28', marginRight: 6}}>未设置</span>
                <Button size="large" type="primary"  
                onClick={() => this.setPrice(render, index)}
                disabled={render.type * 1 === 1 ? !this.state.hasProject : !this.state.hasProduct}>设置价格</Button>
              </div>
              :
              <span>{value}</span>
            }
          </div>
        )
      },
    },
    {
      title: "数量",
      dataIndex: "goodNum",
      key: 2,
      render: (value, ret, index) =>
        (
          <div>
            <InputGroup compact style={{ width: '220px' }} size="large">
              <Select defaultValue="有限期" style={{ width: '90px' }} size="large" value={value === -1 ? -1 : 1} onChange={(e) => {
                  const num = e*1
                  this.props.setValue('goodNum', num, index)
                }}>
                <Option value={1}>有限</Option>
                <Option value={-1}>无限</Option>
              </Select>
              {value !== -1 && <Input
                size="large"
                style={{ width: 120 }}
                value={value}
                onChange={(e) => {
                  const num = e.target.value.match(/[\d]*/)[0]
                  this.props.setValue('goodNum', num, index)
                }}
              />}
            </InputGroup>
          </div>
        ),
    },
    {
      title: "有效期",
      dataIndex: "deadlineTime",
      key: 5,
      render: (value, ret, index) =>
        (
          <div className="date-select">
            <DatePicker size="large" style={{ width: '150px' }} format="YYYY-MM-DD" allowClear={false} value={value ? moment(value, 'YYYY-MM-DD') : undefined} onChange={(t, e) => {
              this.props.setValue('deadlineTime', e, index)
            }} />
          </div>
        ),
    },
    {
      width: "5%",
      dataIndex: "recordsId",
      key: 6,
      render: (value, ret, index) =>
        ret.key !== -1 && (
          <i
            className="delete-btn iconfont icon-shanchu"
            onClick={() => this.handleDeleteItem(ret, index)}
          />
        ),
    },
  ]
  /**
   * 删除其中一项
   * @param {Object} ret 一行数据的对象
   * @param {Number} index 索引值
   */
  handleDeleteItem(ret, index) {
    this.props.setValue(
      '_delete',
      {
        _delete: true,
      },
      index
    )
  }

  /**
   * 设置价格
   */
  setPrice = (item, index) => {
    this.setState({showNew: true, curItem: {...item, name: item.goodName, id: item.goodId}, curIndex: index})
  }

  closeTk = (isSuccess, item) => {
    this.setState({showNew: false})
    if(isSuccess) {
      this.props.setValue('goodPrice', item.price, this.state.curIndex)
      this.props.setValue('info', item.info, this.state.curIndex)
    }
  }

  render() {
    return (
      <div>
        <Table
          columns={this.columns}
          pagination={{ hideOnSinglePage: true, defaultPageSize: 50 }}
          dataSource={this.props.giveItems || []}
          className={styles.table}
        />
         {
          this.state.curItem && this.state.curItem.type*1 === 1 ? 
          <ProjectTk
          curItem={this.state.curItem}
          visible={this.state.showNew}
          onClose={this.closeTk.bind(this)}
          ></ProjectTk>
          :
          <ProductTk
          curItem={this.state.curItem}
          visible={this.state.showNew}
          onClose={this.closeTk.bind(this)}
          ></ProductTk>
        }
      </div>
    )
  }
}
