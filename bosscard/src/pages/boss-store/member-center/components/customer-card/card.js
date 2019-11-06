import React, { Component } from "react"
import { __PRODUCT_TYPE__, __PROJECT_TYPE__ } from "utils/globalConfig"
import SelectProject from "components/SelectProject"
import { Button, DatePicker, Input, Select, message } from "antd"
import moment from 'moment'
import Table from "./table.js"
import style from "./index.less"

const InputGroup = Input.Group
const Option = Select.Option

export default class SelectGiveItems extends Component {
  constructor(props) {
    super(props)
    this.state = {
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
    const {data} = this.props
    let arr = []
    for(let i in selectItems) {
      let index = type ===1 ?
      data.recordsInfo.findIndex(_ => (_.type === 1 && _.goodId === selectItems[i].projectId)) :
      data.recordsInfo.findIndex(_ => (_.type === 2 && _.goodId === selectItems[i].productId))
      if(index >= 0) {
        selectItems[i]['_delete'] = {_delete: true}
        message.warning("不能重复添加该商品！")
      }
      arr.push(selectItems[i])
    }
    const items = this.getFilteredItems(arr, type)
    let giveItems = items
    this.setState({
      giveItems,
    })
    const { index, changeSelectGive } = this.props
    changeSelectGive(index, giveItems)
  }

  /**
   * 过滤掉已有的
   * @param {Array} selectItems 选择的项
   * @param {Number} type 添加的类型
   */
  getFilteredItems(selectItems, type) {
    const { data } = this.props
    let orderItem = data.giveItems.filter(_ => _.type !== type)
    let curItem  = data.giveItems.filter(_ => _.type === type)
    let giveItems = []
    giveItems = selectItems.map(_ => {
      _.goodId = _.projectId || _.productId || _.goodId
      let idx = curItem.findIndex(v => (v.goodId === _.goodId))
      if(idx === -1) { //不存在新增
        _ = {
          ..._,
          key: _.projectId || _.productId || _.goodId,
          id: _.projectId || _.productId || _.goodId,
          goodId: _.projectId || _.productId || _.goodId,
          goodPrice: _.priceTem || _.sellingPriceTem,
          type: _.type,
          goodName: _.productName || _.projectName || _.goodName,
          goodNum: Number(_.goodNum) || 1,
          deadlineTime: moment().add(1, 'years').format('YYYY-MM-DD'),
        }
      }else { //当前存在则保留
        _ = curItem[idx]
      }
      return _
    })
    let arr = orderItem.concat(giveItems)
    return arr
  }

  /**
   * 格式化表格内的每一条数据
   * @param {Object} _ 原始数据
   */
  formatItem(_) {
    return {
      ..._,
      key: _.projectId || _.productId || _.goodId,
      id: _.projectId || _.productId || _.goodId,
      goodId: _.projectId || _.productId || _.goodId,
      type: _.type,
      goodName: _.productName || _.projectName || _.goodName,
      goodNum: Number(_.goodNum) || 1,
      deadlineTime: moment().add(1, 'years').format('YYYY-MM-DD'),
    }
  }

  /**
   * 写入属性
   * @param {Object} state 写入的属性
   * @param {Object} ret 行数据
   * @param {Object} index 行索引
   * @param {Boobean} setTotal 是否重新计算总计数据
   */
  setValue(key, v, i) {
    const { index, changeSelectGive, data } = this.props
    if (data.cardType === 4 && (v*1 >= data.packageCount*1)) {
      return message.warning("服务最多次数需小于卡总次数！")
    }
    let l = data.recordsInfo.length // 项目卡本身有的项目产品
    if (parseInt(i) >= l) {
      let ii = parseInt(i) - l
      let cards = data.giveItems
      cards[ii][key] = v
      changeSelectGive(index, cards)
    } else {
      let cards = data.recordsInfo
      if (key === '_delete') {
        cards.splice(i, 1)
      } else {
        cards[i][key] = v
      }
      const { index, changeSelectGive } = this.props
      changeSelectGive(index, cards, true)
    }
  }
  /**
   * 永久
   */
  onChangePermanent = (e) => {
    const { index, onChangeTimePermanent } = this.props
    onChangeTimePermanent(index, e)
  }
  /**
   * 改变时间
   */
  onChangeTime = (p, e, t) => {
    const { index, changeTime } = this.props
    changeTime(index, t, p)
  }
  /**
   * 删除项
   */
  godeleteTab = () => {
    const { deleteTab, index } = this.props
    deleteTab(index)
  }
  /**
   * 选择车辆按钮
   */
  goChooseCar = () => {
    const { chooseCar, index } = this.props
    chooseCar(index)
  }
  // 时间批量设置
  onChangeAllTime = (e, t) => {
    const { index, changeTime, changeSelectGive, data } = this.props
    changeTime(index, t, 'deadlineTimes')
    //
    let a = [...data.giveItems]
    if (a.length > 0) {
      a = a.map(_ => ({ ..._, deadlineTime: t }))
      changeSelectGive(index, a)
    }
    let b = [...data.recordsInfo]
    if (b.length > 0) {
      b = b.map(_ => ({ ..._, deadlineTime: t }))
      changeSelectGive(index, b, true)
    }
  }
  // 随意卡总次数
  packageCount=(e)=>{
    const { index, onPackageCount } = this.props
    onPackageCount(index, e.target.value.match(/[\d]*/)[0])
  }

  render() {
    const { data } = this.props
    const cards = data.recordsInfo.concat(data.giveItems)
    const recordsInfoCard = cards.map((_, index) => ({ ..._, key: index }))
    return (
      <div className={style.wrap}>
        <div className={style.cardTitle}>{data.cardName}<div className={style.del} onClick={this.godeleteTab}>删除</div></div>
        <div className={style.cardHead}>
          <div className={style['cardHead-st']}><span>办卡时间</span><DatePicker onChange={this.onChangeTime.bind(this, 'created')} size="large" allowClear={false} style={{ width: '160px' }} value={data.created ? moment(data.created, 'YYYY-MM-DD') : undefined} format="YYYY-MM-DD" /></div>
          <div className={style['cardHead-ed']}>
            <div className={style.txt}><i className={style.i}>*</i><span>到期时间</span></div>
            <div className={style.InputGroup}>
              <InputGroup compact style={{ width: '220px' }} size="large">
                <Select defaultValue="有限期" style={{ width: '90px' }} size="large" value={data.deadlineTimes ? 1 : -1} onChange={this.onChangePermanent}>
                  <Option value={1}>有限期</Option>
                  <Option value={-1}>无限期</Option>
                </Select>
                <DatePicker disabled={!data.deadlineTimes} size="large" allowClear={false} style={{ width: '125px' }} value={data.deadlineTimes ? moment(data.deadlineTimes, 'YYYY-MM-DD') : undefined} format="YYYY-MM-DD" onChange={this.onChangeTime.bind(this, 'deadlineTimes')} />
              </InputGroup>
            </div>
          </div>
          {data.cardType !== 4 && <div className={style['cardHead-st']}>
            <span>时间批量设置</span>
            <DatePicker onChange={this.onChangeAllTime} size="large" allowClear={false} style={{ width: '160px' }} format="YYYY-MM-DD" />
          </div>}
          {data.cardType === 4 && <div className={style['cardHead-st']}>
            <span>卡总次数</span>
            <Input style={{width: '120px'}} size="large" onChange={this.packageCount} value={data.packageCount} addonAfter="次" />
          </div>}
          <div className={style['cardHead-car']}>绑定车辆：{data.car.length}<Button type="primary" className={style.btn} size="large" onClick={this.goChooseCar}>选择</Button></div>
        </div>
        <Table
          giveItems={recordsInfoCard}
          setValue={this.setValue.bind(this)}
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
          selected={data.giveItems.filter(_ => _.type === __PRODUCT_TYPE__)}
          visible={this.state.showSelectProduct}
          onOk={(items) => this.handleSelectItems(items, __PRODUCT_TYPE__)}
          onCancel={() => this.setState({ showSelectProduct: false })}
          type={__PRODUCT_TYPE__}
        />
        <SelectProject
          selected={data.giveItems.filter(_ => _.type === __PROJECT_TYPE__)}
          visible={this.state.showSelectProject}
          onOk={(items) => this.handleSelectItems(items, __PROJECT_TYPE__)}
          onCancel={() => this.setState({ showSelectProject: false })}
          type={__PROJECT_TYPE__}
        />
      </div>
    )
  }
}
