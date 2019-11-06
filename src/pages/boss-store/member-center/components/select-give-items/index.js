import React, { Component } from "react"
import { __PRODUCT_TYPE__, __PROJECT_TYPE__ } from "utils/globalConfig"
import SelectProject from "components/SelectProject"
import { Button } from "antd"
import Table from "./table.js"
import SetAllModal from "./setAllModal"
import style from "./index.less"
import moment from "moment"

export default class SelectGiveItems extends Component {
  constructor(props) {
    super(props)
    this.state = {
      giveItems: props.giveItems || [],
      showSelectProduct: false,
      showSelectProject: false,
    }
  }
  /**
   * 赋值选择的赠送项目产品
   * @param {Array} selectItems 选择的项
   * @param {Number} type 添加的类型
   */
  handleSelectItems(selectItems, type) {
    const items = this.getFilteredItems(selectItems, type)
    const giveItems =
      items.length > 0 ? [...items, this.getTotalData(items)] : items
    this.setState({
      giveItems,
    })
    this.props.onChange(giveItems)
  }

  /**
   * 过滤掉已有的
   * @param {Array} selectItems 选择的项
   * @param {Number} type 添加的类型
   */
  getFilteredItems(selectItems, type) {
    const giveItems = [
      ...this.state.giveItems.slice(0, this.state.giveItems.length - 1),
    ]
    const otherType = giveItems.filter(v => v.type !== type)
    const nowType = []
    selectItems.forEach(_ => {
      const findIndex = this.state.giveItems.findIndex(
        (item) =>
          _[type === 1 ? "projectId" : "productId"] === item.pId &&
          type === item.typeTem
      )
      if (findIndex < 0) {
        nowType.push(this.formatItem({ ..._, type }))
      }else {
        nowType.push(this.state.giveItems[findIndex])
      }
    })
    console.log('nowType', nowType)
    return otherType.concat(nowType)
  }

  /**
   * 格式化表格内的每一条数据
   * @param {Object} _ 原始数据
   */
  formatItem(_) {
    return {
      ..._,
      pId: _.projectId || _.productId || _.goodId,
      key: _.projectId || _.productId || _.goodId,
      pName: _.productName || _.projectName || _.goodName,
      typeTem: _.type,
      discount: 10,
      unitPrice: Number(_.goodPrice) || Number(_.price) || 0,
      numTem: Number(_.goodNum) || 1,
      isInfiniteNum: 0, // 是否无限数量
      balidityPeriod: Number(_.goodPrice) || Number(_.price) || 0,
      deadlineStatus: 1,
      deadlineTime: moment().add(1, "year"),
      deadlineMonth: 12, 
    }
  }

  /**
   * 写入属性
   * @param {Object} state 写入的属性
   * @param {Object} ret 行数据
   * @param {Object} index 行索引
   * @param {Boobean} setTotal 是否重新计算总计数据
   */
  setValue(state, ret, index, setTotal) {
    const items = [...this.state.giveItems]
    items.splice(index, 1, {
      ...items[index],
      ...state,
    })
    if (setTotal) {
      items.splice(items.length - 1, 1, this.getTotalData(items))
      this.setState({
        giveItems: items,
      })
    } else {
      this.setState({
        giveItems: items,
      })
    }
    this.props.onChange(items)
  }

  /**
   * 获取总计数据
   * @param {Array} list 需要计算总计的数据
   */
  getTotalData(list) {
    let total = {
      key: -1,
      pName: "总计",
      discount: "",
      unitPrice: "",
      numTem: 0,
      balidityPeriod: 0,
    }
    list.forEach((item) => {
      if (item.key > 0) {
        total.numTem = total.numTem + Number(item.numTem)
        total.balidityPeriod =
          total.balidityPeriod + Number(item.balidityPeriod)
      }
    })
    total.balidityPeriod = total.balidityPeriod.toFixed(2)
    return total
  }

  /**
   * 批量设置有效期
   */
  handleSetAll(allEditForm) {
    const giveItems = this.state.giveItems.map((_) => {
      if (_.key > 0) {
        return {
          ..._,
          ...allEditForm,
        }
      } else {
        return _
      }
    })
    this.setState({ giveItems })
    this.props.hideSetAllModal()
    this.props.onChange(giveItems)
  }

  /**
   * 设置价格回调
   * @param {Array} 赠送列表
   */
  changeGives = ( giveItems ) => {
    this.setState({giveItems})
    this.props.onChange(giveItems)
  }

  render() {
    return (
      <div className={style.wrap}>
        <Table
          giveItems={this.state.giveItems}
          changeGives={this.changeGives}
          setValue={this.setValue.bind(this)}
          newTpye={this.props.newTpye} // 是否启用新的日期选择框
        />
        <div className="add-btn-group flex center">
          <div className="item">
            <Button
              size="large"
              type="dashed"
              block
              onClick={() => this.setState({ showSelectProject: true })}
            >
              添加项目
            </Button>
          </div>
          <div className="item">
            <Button
              size="large"
              type="dashed"
              block
              onClick={() => this.setState({ showSelectProduct: true })}
            >
              添加产品
            </Button>
          </div>
        </div>
        <SelectProject
          selected={this.state.giveItems.filter(v => v.type === __PRODUCT_TYPE__)}
          visible={this.state.showSelectProduct}
          onOk={(items) => this.handleSelectItems(items, __PRODUCT_TYPE__)}
          onCancel={() => this.setState({ showSelectProduct: false })}
          type={__PRODUCT_TYPE__}
        />
        <SelectProject
          selected={this.state.giveItems.filter(v => v.type === __PROJECT_TYPE__)}
          visible={this.state.showSelectProject}
          onOk={(items) => this.handleSelectItems(items, __PROJECT_TYPE__)}
          onCancel={() => this.setState({ showSelectProject: false })}
          type={__PROJECT_TYPE__}
        />
        <SetAllModal
          show={this.props.openSetAll}
          onOk={this.handleSetAll.bind(this)}
          onCancel={this.props.hideSetAllModal}
        />
      </div>
    )
  }
}
