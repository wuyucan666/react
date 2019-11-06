import React, { Component } from "react"
import { Select, Button } from "antd"
import moment from 'moment'
import Card from "./card"
import CarBox from './car'
import style from "./index.less"
import services from "../../../../../services"
import empty from '../../img/no_card.jpg'

const Option = Select.Option

export default class SelectGiveItems extends Component {
  constructor(props) {
    super(props)
    this.state = {
      cardList: [],
      value: '',
      cardData: props.selectCard || [],
      visible: false,
      curCarIndex: -1,
      customerCars: [],
    }
  }
  /**
   * 添加修改产品项目
   */
  changeSelectGive = (key, v, st) => {
    let arr = [...this.state.cardData]
    if (st) {
      arr[key].recordsInfo = v
    } else {
      arr[key].giveItems = v
    }
    this.setState({ cardData: arr })
    this.handleSubmit(arr)
  }
  /**
   * 选择永久有效
   */
  onChangeTimePermanent = (key, v) => {
    let arr = [...this.state.cardData]
    arr[key].deadlineTimes = v === -1 ? '' : arr[key].deadlineTime ? arr[key].deadlineTime : moment().format('YYYY-MM-DD')
    this.setState({ cardData: arr })
    this.handleSubmit(arr)
  }
  /**
   * 改变时间
   */
  changeTime = (key, v, p) => {
    let arr = [...this.state.cardData]
    arr[key][p] = v
    this.setState({ cardData: arr })
    this.handleSubmit(arr)
  }
  /**
   * 改变随意卡总数
   */
  onPackageCount = (key, v) => {
    let arr = [...this.state.cardData]
    arr[key].packageCount = v*1 === 0 ? '' : v
    let recordsInfo = []
    let giveItems = []
    if(arr[key].cardType === 4) {
      recordsInfo = arr[key].recordsInfo.map(_ => {
        if(v*1 === 1) {
          _.goodNum = -1
        } else if(_.goodNum >= v*1) {
          _.goodNum = v*1 - 1
        }
        return _
      })
      giveItems = arr[key].giveItems.map(_ => {
        if(v*1 === 1) {
          _.goodNum = -1
        } else if(_.goodNum >= v*1) {
          _.goodNum = v*1 - 1
        }
        return _
      })
    }
    arr[key].recordsInfo = recordsInfo
    arr[key].giveItems = giveItems
    this.setState({ cardData: arr })
    this.handleSubmit(arr)
  }
  /**
   * 选择卡
   */
  handleChange = value => {
    this.setState({ value })
    this.getCardDetail(value)
  }
  /**
   * 搜索卡
   */
  handleSearch = cardName => {
    this.getCardList(cardName)
  }
  /**
   * 获取卡列表
   */
  getCardList = cardName => {
    services.LIST({ keys: { name: 'store/records/list' }, data: { q: { page: 1, limit: 20, where: { 'cardName[~]': cardName, 'amount[>]': 0, statusTem: 1 } } } }).then(res => {
      this.setState({ cardList: res.list })
    })
  }
  /**
   * 获取卡详情
   */
  getCardDetail = recordsId => {
    const { customerCar } = this.props
    let car = customerCar.map(_ => ({ ..._, show: true }))
    services.INSERT({ keys: { name: 'store/records/details' }, data: { recordsId } }).then(res => {
      let arry = [...this.state.cardData]
      let recordsInfo = res.list.recordsInfo.map((v) => ({
        ...v,
        key: v.goodId,
        deadlineTime: (res.list.neverValid === 1 || res.list.cardType === 4) ? moment().add(1, 'years').format('YYYY-MM-DD') : moment(res.list.deadlineTime * 1000).format('YYYY-MM-DD'),
      }))
      arry.push({
        ...res.list,
        car,
        packageCount: res.list.packageCount ? res.list.packageCount*1 : undefined,
        giveItems: [],
        created: moment().format('YYYY-MM-DD'),
        deadlineTimes: res.list.cardType === 4 ? moment().add(1, 'years').format('YYYY-MM-DD') : res.list.neverValid === 1 ? '' : moment(res.list.deadlineTime * 1000).format('YYYY-MM-DD'),
        deadlineTime: moment(res.list.deadlineTime * 1000).format('YYYY-MM-DD'),
        recordsInfo,
      })
      this.setState({
        cardData: arry,
      })
      this.handleSubmit(arry)
    })
  }
  /**
   * 添加赠送
   */
  addgiving = () => {
    const { customerCar } = this.props
    let car = customerCar.map(_ => ({ ..._, show: true }))
    let arry = [...this.state.cardData]
    arry.push({ recordsInfo: [], car, giveItems: [], recordsId: 0, cardName: '赠送卡', cardType: 3, created: moment().format('YYYY-MM-DD'), deadlineTimes: moment().add(1, 'years').format('YYYY-MM-DD'), deadlineTime: moment().add(1, 'years').format('YYYY-MM-DD') })
    this.setState({
      cardData: arry,
    })
  }
  componentDidMount() {
    // this.props.onRef(this, 2)
    this.getCardList()
  }

  /**
   * 关闭选择车辆
   */
  goCancel = visible => {
    this.setState({ visible })
  }
  /**
   * 弹出选择车辆窗口
   */
  chooseCar = (index) => {
    let curCar = [...this.state.cardData[index].car]
    const { customerCar } = this.props
    let customerCars = customerCar.map(v => {
      // 以选的高亮
      let s = curCar.filter(_ => _.plateNumber === v.plateNumber).length > 0 ? true : false
      return ({ ...v, show: s })
    })
    this.setState({ visible: true, curCarIndex: index, customerCars })
  }
  /**
   * 获取已选车辆数据
   */
  getCar = () => {
    let item = this.state.customerCars.filter(_ => _.show)
    let arr = this.state.cardData
    arr[this.state.curCarIndex].car = item
    this.setState({ cardData: arr })
    this.handleSubmit(arr)
  }
  /**
   * 删除已选择的卡
   */
  deleteTab = (index) => {
    let cardData = this.state.cardData.map(_ => ({..._}))
    cardData.splice(index, 1)
    this.setState({ cardData }, () => {
      this.handleSubmit(cardData)
    })
  }
  /**
   * 选择车辆 并且高亮
   */
  setCarShow = (index) => {
    let arr = this.state.customerCars
    arr[index].show = !arr[index].show
    this.setState({ customerCars: arr })
  }
  /**
   * 提交
   */
  handleSubmit = (items) => {
    const { dispatch } = this.props
    let ary = []
    for (let i in items) {
      if (items[i].car && items[i].car.length > 0 && (items[i].recordsInfo.length > 0 || items[i].giveItems.length > 0)) {
        let arr = items[i].recordsInfo.concat(items[i].giveItems)
        let d = true
        for (let j in arr) {
          if (!arr[j].goodNum) {
            d = false
          }
        }
        if (d) { ary.push({ ...items[i] }) }
      }
    }
    dispatch({
      type: "customersImport/goSelectCardCard",
      payload: ary,
    })
  }

  render() {
    const { cardList, value, cardData, visible, customerCars } = this.state
    const options = cardList.map((d, index) => <Option key={index} value={d.recordsId}>{d.cardName}</Option>)
    return (
      <div className={style.curtomerCardwrap}>
        <div className={style.curtomerCard}>
          <span className={style.curtomerCardText}>未设置价格的卡不可搜索</span>
          <Select
            showSearch
            size="large"
            style={{ width: '205px' }}
            value={value}
            placeholder='搜索计次卡'
            defaultActiveFirstOption={false}
            showArrow={false}
            filterOption={false}
            onSearch={this.handleSearch}
            onChange={this.handleChange}
            notFoundContent={null}
          >
            {options}
          </Select>
          <Button size="large" className={style.btn} onClick={this.addgiving}>添加赠送卡</Button>
        </div>
        {
          cardData.map((v, index) => {
            return <Card
            key={index}
            changeSelectGive={this.changeSelectGive}
            index={index}
            deleteTab={this.deleteTab}
            data={v}
            d={v.recordsInfo}
            chooseCar={this.chooseCar}
            onChangeTimePermanent={this.onChangeTimePermanent}
            changeTime={this.changeTime}
            onPackageCount={this.onPackageCount}
            ></Card>
          })
        }
        {/* {cardData.length > 0 ? <div className={style.footerBtn} >
          <Button type="primary" className={style.btn} size="large" onClick={this.handleSubmit}>确定</Button>
          <Button className={style.btn} size="large">取消</Button>
        </div> : ''} */}
        {
          cardData.length === 0 ? <div className="ainier_empty animated bounceIn" style={{ textAlign: 'center', paddingTop: '200px' }}>
            <img src={empty} alt="" />
            <p style={{ fontSize: '14px', color: '#333' }}>您暂未添加任何卡项</p>
          </div> : ''
        }
        <CarBox customerCars={customerCars} goCancel={this.goCancel} visible={visible} getCar={this.getCar} setCarShow={this.setCarShow}></CarBox>
      </div>
    )
  }
}
