import React, { Component } from "react"
import { Table, Select, Input, DatePicker, message, Button } from "antd"
import ProjectTk from 'components/setPrice/project'
import ProductTk from 'components/setPrice/product'
import units from "./units"
import moment from "moment"
import styles from "./index.less"

const { Option } = Select

export default class TableComponent extends Component {
  state = {
    units,
    curItem: {},
    showNew: false,
    hasProject: JSON.parse(window.localStorage.getItem("permissionRole")).findIndex(v => v === 51) !== -1,
    hasProduct: JSON.parse(window.localStorage.getItem("permissionRole")).findIndex(v => v === 53) !== -1,
  }

  /**
   * 设置价格
   */
  setPrice = (item) => {
    this.setState({showNew: true, curItem: {...item, name: item.pName, id: item.pId}})
  }

  /**
   * 关闭设置价格弹窗
   * @param {Boolean} isSuccess 是否设置价格成功
   * @param {Object} item 返回参数
   */
  closeTk = (isSuccess, item) => {
    this.setState({showNew: false})
    if(isSuccess) {
      const { giveItems } = this.props
      let result = giveItems.map(v => {
        if(v.pId === item.pId && v.type === item.type) {
          v = {
            ...v,
            info: item.info,
            unitPrice: item.price,
            balidityPeriod: (item.price * v.numTem).toFixed(0),
          }
        }
        return v
      })
      this.props.changeGives && this.props.changeGives(result)
    }
  }

  /**
   * 删除其中一项
   * @param {Object} ret 一行数据的对象
   * @param {Number} index 索引值
   */
  handleDeleteItem(ret, index) {
    this.props.setValue(
      {
        _delete: true,
      },
      ret,
      index,
      true
    )
  }

  render() {
    // 表格
    let columns = [
      {
        title: "名称",
        width: "20%",
        dataIndex: "pName",
        key: 0,
      },
      {
        title: "编码",
        width: "10%",
        dataIndex: "commodityCode",
        key: 9,
      },
      {
        title: "单价",
        width: "17%",
        dataIndex: "unitPrice",
        key: 1,
        render: (text, item) => {
          return (
            <div>
              {
                item.info*1 === 2 ?
                <div>
                  <span style={{color: '#FF6F28', marginRight: 6}}>未设置</span>
                  <Button size='large' type="primary" 
                  onClick={() => this.setPrice(item)} 
                  disabled={item.type * 1 === 1 ? !this.state.hasProject : !this.state.hasProduct}>设置价格</Button>
                </div>
                :
                <span>{text}</span>
              }
            </div>
          )
        },
      },
      {
        title: "数量",
        width: "14%",
        dataIndex: "numTem",
        key: 2,
        render: (value, ret, index) =>
          ret.key > 0 ? (
            <div>
              {ret.key > 0 && (
                <Input
                  // size="large"
                  style={{ width: 120 }}
                  value={value}
                  onBlur={() => {
                    if (value === "") {
                      message.warning("数量必须大于0")
                      this.props.setValue(
                        {
                          numTem: 1,
                          balidityPeriod:
                            (Number(ret.unitPrice) *
                              (Number(ret.discount) * 10) *
                              1) /
                            100,
                        },
                        ret,
                        index,
                        true
                      )
                    }
                  }}
                  onChange={(e) => {
                    let num = e.target.value.match(/[\d]*/)[0]
                    if (num === "0") {
                      message.warning("数量必须大于0")
                      num = 1
                    }
                    this.props.setValue(
                      {
                        numTem: num,
                        balidityPeriod:
                          (Number(ret.unitPrice) *
                            (Number(ret.discount) * 10) *
                            Number(num)) /
                          100,
                      },
                      ret,
                      index,
                      true
                    )
                  }}
                />
              )}
            </div>
          ) : (
            value
          ),
      },
      {
        title: "金额",
        width: "12%",
        dataIndex: "balidityPeriod",
        key: 4,
        render: (value) => Number(value).toFixed(2),
      },
      {
        title: "有效期",
        width: "32%",
        dataIndex: "deadlineTime",
        key: 5,
        render: (value, ret, index) =>
          ret.key > 0 ? (
            <div className="date-select">
              <Select
                value={ret.deadlineStatus}
                onChange={(value) =>
                  this.props.setValue(
                    { deadlineStatus: value },
                    ret,
                    index,
                    false
                  )
                }
              >
                <Option key={1} value={1}>
                  有限期
                </Option>
                <Option key={0} value={0}>
                  无限期
                </Option>
              </Select>
              <DatePicker
                disabled={!ret.deadlineStatus}
                value={value}
                onChange={(value) =>
                  this.props.setValue({ deadlineTime: value }, ret, index, false)
                }
              />
            </div>
          ) : ret.key < 0 ? (
            ""
          ) : ret.deadlineStatus === 0 ? (
            "永久"
          ) : (
            moment(value).format("YYYY-MM-DD")
          ),
      },
      {
        title: "有效期",
        width: "32%",
        dataIndex: "deadlineMonth",
        key: 5,
        render: (value, ret, index) => (
          ret.key > 0 ? (
            <div>
              <Select
                value={ret.deadlineMonth}
                style={{width: '222px'}}
                onChange={(value) =>
                  this.props.setValue(
                    { deadlineMonth: value },
                    ret,
                    index,
                    false
                  )
                }
              >
                <Option value={3} key={3}>3个月</Option>
                <Option value={6} key={6}>6个月</Option>
                <Option value={12} key={12}>12个月</Option>
                <Option value={24} key={24}>24个月</Option>
                <Option value={-1} key={-1}>无限期</Option>
              </Select>
            </div>
          )
          : ""
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

    columns = this.props.newTpye 
    ? columns.filter(v => v.dataIndex !== 'deadlineTime') 
    : columns.filter(v => v.dataIndex !== 'deadlineMonth')

    return (
      <div>
        <Table
          columns={columns}
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
