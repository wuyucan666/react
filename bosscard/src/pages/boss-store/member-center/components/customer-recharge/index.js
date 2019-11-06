import { Component } from "react"
import { Select } from "antd"
import moment from 'moment'
import styles from "./index.less"
import services from "../../../../../services"
import Table from './table'
import CarBox from './car'
import GrechargeCard from './rechargeCard'

const Option = Select.Option
class CustomerInformation extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: '',
      cardList: [],
      cardData: props.rechargeCard || [],
      visible: false,
      rechargeVisible: false,
      curCarIndex: -1,
      customerCars: [],
      rechargeNew: [],
    }
  }
  onRechargeClone=(e)=> {
    this.setState({rechargeVisible: false})
    if(e) {
      // 生成赠送卡
      this.bindProduct()
    }
  }
  //充值卡绑定产品
  bindProduct=()=> {
    const {dispatch, selectCard, customerCar}= this.props
    let arr = selectCard.map(_ => ({..._}))
    let _index = arr.findIndex(_ => _.recordsId === 0)
    let ary = this.state.rechargeNew.map(_ => ({
      ..._,
      goodNum: _.numTem,
      type: _.speciesType === 6 ? 2 : _.speciesType === 5 ? 1 : 0,
      goodPrice: _.money,
      goodName: _.name,
      deadlineTime: moment().add(1, 'years').format('YYYY-MM-DD'),
    }))
    if(_index >= 0) {
      // 如果已有赠送卡，就把项目产品加进去
      arr[_index].recordsInfo = [...ary]
    } else {
      // 如果没有赠送卡，就新建赠送卡
      let car = customerCar.map(_ => ({ ..._, show: true }))
      arr.push({
        recordsInfo: [...ary],
        car,
        giveItems: [],
        recordsId: 0,
        cardName: '赠送卡',
        salesType: 3,
        created: moment().format('YYYY-MM-DD'),
        deadlineTimes: moment().add(1, 'years').format('YYYY-MM-DD'),
        deadlineTime: moment().add(1, 'years').format('YYYY-MM-DD'),
      })
    }
    dispatch({
      type: "customersImport/goSelectCardCard",
      payload: arr,
    })
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
    services.LIST({ keys: { name: 'store/species/list' }, data: { q: { page: 1, limit: 20, where: { 'cardName[~]': cardName, 'rechargeMoney[>]': 0, state: 1 } } } }).then(res => {
      this.setState({ cardList: res.list })
    })
  }
  /**
   * 获取卡详情
   */
  getCardDetail = speciesId => {
    const { customerCar } = this.props
    let car = customerCar.map(_ => ({ ..._, show: true }))
    services.INSERT({ keys: { name: 'store/species/details' }, data: { speciesId } }).then(res => {
      let arry = [...this.state.cardData]
      let rechargeNew = res.list.giveInfo ? [...res.list.giveInfo] : []
      arry.push({ ...res.list, giveMoney: '', created: moment(res.list.created * 1000).format('YYYY-MM-DD'), deadlineTime: moment(res.list.deadline * 1000).format('YYYY-MM-DD'), deadline: moment(res.list.deadline * 1000).format('YYYY-MM-DD'), car })
      this.setState({
        cardData: arry,
        rechargeNew,
      }, ()=> {
        this.handleSubmit(this.state.cardData)
        if(rechargeNew.length > 0) {
          this.setState({rechargeVisible: true})
        }
      })
    })
  }
  componentDidMount() {
    // this.props.onRef(this, 3)
    this.getCardList()
  }
  /**
   * 修改表格
   */
  setValue = (state, ret, index) => {
    const items = [...this.state.cardData]
    items.splice(index, 1, {
      ...items[index],
      ...state,
    })
    this.setState({
      cardData: items,
    })
    this.handleSubmit(items)
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
   * 删除已选择的充值卡
   */
  deleteTab = (index) => {
    let cardData = this.state.cardData
    this.setState({ cardData: cardData.splice((index, 1)) }, () => {
      this.handleSubmit(this.state.cardData)
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
    let arr = [...items]
    // for (let i in items) {
    //   if (items[i].car && items[i].car.length > 0 && items[i].giveMoney) {
    //     arr.push({ ...items[i] })
    //   }
    // }
    dispatch({
      type: "customersImport/goRechargeCard",
      payload: arr,
    })
  }

  render() {
    const { value, cardList, cardData, visible, customerCars, rechargeVisible, rechargeNew } = this.state
    const options = cardList.map((d, index) => <Option key={index} value={d.speciesId}>{d.cardName}</Option>)
    const cardDatas = cardData.map((_, index) => ({ ..._, key: index }))
    return (
      <div className={styles.CinfRecharge}>
        <div className={styles.curtomerCard}>
          <span className={styles.curtomerCardText}>未设置价格的卡不可搜索</span>
          <Select
            showSearch
            size="large"
            style={{ width: '285px' }}
            value={value}
            placeholder='搜索充值卡'
            defaultActiveFirstOption={false}
            showArrow={false}
            filterOption={false}
            onSearch={this.handleSearch}
            onChange={this.handleChange}
            notFoundContent={null}
          >
            {options}
          </Select>
        </div>
        <CarBox customerCars={customerCars} goCancel={this.goCancel} visible={visible} getCar={this.getCar} setCarShow={this.setCarShow}></CarBox>
        <div style={{ paddingTop: '43px' }}><Table cardData={cardDatas} setValue={this.setValue} chooseCar={this.chooseCar} deleteTab={this.deleteTab}></Table></div>
        {/* <div className={styles.footerBtn}>
          <Button className={styles.btn} size="large" type="primary" onClick={this.handleSubmit}>提交</Button>
          <Button className={styles.btn} size="large" onClick={this.onClone} >取消</Button>
        </div> */}
        <GrechargeCard onRechargeClone={this.onRechargeClone} visible={rechargeVisible} rechargeNew={rechargeNew}></GrechargeCard>
      </div>
    )
  }
}

export default CustomerInformation
