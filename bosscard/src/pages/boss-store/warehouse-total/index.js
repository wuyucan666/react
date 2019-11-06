import { Component } from "react"
import { connect } from "dva"
import styles from "./styles.less"
import { DatePicker, Checkbox } from "antd"
import ProductRanking from "./components/productRanking/index"
import ProductNumMoney from "./components/productNumMoney/index"
import CheckProject from "./components/checkProject/index"
import PieDiv from "./components/pieDiv/index"
import CopyPic from "./components/copyPic/index"
import services from 'services'
import moment from 'moment'
import { Link } from 'react-router-dom'
const { MonthPicker } = DatePicker

var date= new Date()
var year=date.getFullYear()
var month=date.getMonth()+1
var hasTime = year + '-' + month

class storepay extends Component {
  state = {
    showAdd: false,
    type: "",
    picDataOne:[],
    picDataTwo:[],
    poverWidth:'',
    totalNum:0,
    totalMoney:0,
    totalInventoryleft: [],
    totalInventoryright: [],
    earlyWarning:[],
    outOfStock:[],
    beLaidUp:[],
    moneyTime: hasTime,
    moneyStatus: false,
  }
  componentDidMount(){
    //图超出宽度必要用到的三句代码 因为图超出了表的宽度，添加这代码解决这问题
    const e = document.createEvent('Event')
    e.initEvent('resize', true, true)
    window.dispatchEvent(e)

    services.LIST({keys: {name: 'erp/statistics/overview/index'}}).then(res => {
        console.log('ress:',res)
        let amountData = res.list.amountData.list
        let numberData= res.list.numberData.list
        amountData.map(v => (v.total = Number(v.total)))
        numberData.map(v => (v.total = Number(v.total)))
        this.setState({
          picDataOne: amountData.sort((v, _) => v.total - _.total),
          picDataTwo: numberData.sort((v, _) => v.total - _.total),
          totalNum:res.list.numberData.total,
          totalMoney:res.list.amountData.total,
          totalInventoryleft: res.list.bestSellSort,
          totalInventoryright: res.list.stagnantSellSort,
          earlyWarning: res.list.inventoryWarningSort,
        })
    })
    this.props.dispatch({
      type: 'storewarehouse/getAmountMoneyOut',
      payload: {time: [[moment(this.state.moneyTime).unix(), moment(this.state.moneyTime).endOf('month').unix()]] , statu:1 },
    })
  }
  hideModal() {
    this.setState({
      showAdd: false,
    })
  }
  onChangeData(date, dateString) {
    this.setState({
      moneyTime: dateString,
    })
    this.props.dispatch({
      type: 'storewarehouse/getAmountMoneyOut',
      payload: {time: [[moment(dateString).unix(),moment(dateString).endOf('month').unix()]], statu: this.state.moneyStatus ? 0 : 1 },
    })
  }
  onChangesel(key) {
    if(key.target.checked){
      
      this.setState({
        moneyStatus: true,
      })
      this.props.dispatch({
        type: 'storewarehouse/getAmountMoneyOut',
        payload: {time: [[moment(this.state.moneyTime).unix(), moment(this.state.moneyTime).endOf('month').unix()]], statu: 0},
      })
    }else{
      this.setState({
        moneyStatus: false,
      })
      this.props.dispatch({
        type: 'storewarehouse/getAmountMoneyOut',
        payload: {time: [[moment(this.state.moneyTime).unix(), moment(this.state.moneyTime).endOf('month').unix()]], statu: 1},
      })
    }
  }
  render() {
    return (
      <div>
        <div className={styles.piechartDiv}>
          <div>
            <div className={styles.topone}>
              <p>库存总额</p>
              <span>{this.state.totalMoney}</span>
            </div>
            <div className={styles.toptwo} ref='childone'>
              <PieDiv data={this.state.picDataOne} />
            </div>
          </div>
          <div>
            <div className={styles.topone}>
              <p>库存总量</p>
              <span>{this.state.totalNum}</span>
            </div>
            <div className={styles.toptwo}>
              <CopyPic data={this.state.picDataTwo} />
            </div>
            <div />
          </div>
        </div>
        <div className={styles.productRankingDiv}>
          <div>
            <div>
              <div>
                <ProductRanking types="1" data={this.state.totalInventoryleft} />
              </div>
              <div>
                <ProductRanking types="2" data={this.state.totalInventoryright} />
              </div>
              <div>
                <ProductRanking types="3" data={this.state.earlyWarning} />
              </div>
            </div>
          </div>
          {/* <div>
            <p className={styles.espP}>
              <span>库存预警商品</span>
              <Link to={'/boss-store/stock-early-warning'}>查看详情</Link>
            </p>
            {
              this.state.earlyWarning.map((v, index) => {
                return <div key={index}>
                    <span>{v.productName}</span>
                    <span style={{color: '#666'}}>{v.commodityCode}</span>
                    <span>{v.goodsNum - v.lowestNum}</span>
                </div>
              })
            }
          </div> */}
        </div>
        <div className={styles.productNumMoneyDiv}>
          <div>
            <div>
              <MonthPicker onChange={this.onChangeData.bind(this)} defaultValue={moment(hasTime, 'YYYY-MM')} placeholder="选择日期" />
            </div>
            <div>
              <Checkbox checked={this.state.moneyStatus} onChange={this.onChangesel.bind(this)}>
                包含当期停用商品
              </Checkbox>
            </div>
          </div>
          <div>
            <div>
              <ProductNumMoney types="1" data={this.props.amountMoneyList.into}/>
            </div>
            <div>
              <ProductNumMoney types="2" data={this.props.amountMoneyList.out}/>
            </div>
          </div>
        </div>
        <CheckProject />
      </div>
    )
  }
}
function mapStateToProps(state) {
  const { amountMoneyList } = state.storewarehouse
  return { amountMoneyList }
}
export default connect(mapStateToProps)(storepay)
