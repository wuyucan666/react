import React, { Component } from "react"
import { Button, DatePicker, Icon, Spin, Table, Empty, Select } from 'antd'
import request from 'utils/request'
import moment from "moment"
import styles from "./index.less"
import TabTable from './tabTable'
import router from 'umi/router'

const { Option } = Select
const { MonthPicker } = DatePicker

const totalShows = [
  {
    label: '营业额',
    value: 0,
  },
  {
    label: '到店台次',
    value: 0,
  },
  {
    label: '会员车辆',
    value: 0,
  },
  {
    label: '散客车辆',
    value: 0,
  },
]

class Daily extends Component {
  constructor(){
    super()
    this.state = {
      date: moment().format('YYYY-MM-DD'),
      month: moment().format('YYYY-MM'),
      totalShows,
      data:{},
      loading: false,
      currentType: 1, // 当前查看方式 
    }
  }

  format = (d) => {
    let date, startTime, endTime, value

    if(this.state.currentType*1 === 1) {
      date = moment(d).format('YYYY-MM-DD')
      startTime = moment(date + " 00:00:00")
      endTime = moment(date + " 23:59:59")
      value = [startTime.unix(), endTime.unix()]
    } else {
      date = moment(d).format('YYYY-MM')
      startTime = moment(date).startOf("month")
      endTime = moment(date).endOf("month")
      value = [startTime.unix(), endTime.unix()]
    }

    return value
  }

  componentDidMount() {
    const { date } = this.state
    this.getTotalData(date)
  }

  handleChange = (value) => {
    const { date, month } = this.state
    this.setState({ currentType: value }, () => {
      this.getTotalData(value*1 === 1 ? date: month)
    })
  }

  // 路由跳转工具函数
  pickRouter = (type) => {
    const { date, month, currentType } = this.state
    const created = this.format(currentType === 1 ? date : month)
    // const congigDate = [moment(created[0] * 1000), moment(created[1] * 1000)]
    switch (type) {
      case 1: // 充值卡
        router.push({ pathname: "/boss-store/member-card", query: { created, cardType: 1, fromIndex: true }})
        break
      case 2: // 计次卡
        router.push({ pathname: "/boss-store/member-card", query: { created, cardType: 2, fromIndex: true}})
        break
      case 3: // 订单中心
        router.push({ pathname: "/boss-store/maintain-list/orderAll", query: { created, fromIndex: true}})
        break
      case 4: // 还款列表
        router.push({ pathname: "/boss-store/payment-reimbursement", query: { created, fromIndex: true}})
        break
      default:
        break
    }
  }

  getFloat = (string) => parseFloat(parseFloat(string).toFixed(1))

  getTotalData = async (date) => {
    this.setState({ loading: true })
    let formatDate = this.format(date)
    const res = await request({ url: 'wide-report/daily/collect', data: { q: { where: {'completed[<>]':formatDate} } } })
    this.setState({ loading: false })
    if (res.code === '0') {
      totalShows[0].value = this.getFloat(res.data.output)
      totalShows[1].value = res.data.carCount
      totalShows[2].value = res.data.clientVehicles
      totalShows[3].value = res.data.touristVehicles
      this.setState({ totalShows, data: res.data })
    }
  }

  goback = () => {
    this.props.hideDaily()
  }

  onChange = (date, dateString) => {
    this.setState({
      date:dateString,
    },()=>{
      this.getTotalData(dateString)
    })
  }
  
  monthChange = (data, dateString) => {
    this.setState({
      month: dateString,
    }, () => {
      this.getTotalData(dateString)
    })
  }

  // 封装拆分数组方法
  split_array = (arr,len)=>{ // arr需要拆分的原数组，len每个小数组包含的多少个元素
    var a_len = arr.length
    var result = [] // 结果数组
    for(var i=0; i<a_len; i+=len){
      result.push(arr.slice(i,i+len)) // 循环去原数组n个元素，每次取从上次的下一个开始取
    }
    return result
  }

  renderPay = (array) => {
    let col = array.length > 12 ? 4 : 3 // 默认三列，最大四列
    // let col = Math.ceil(array.length/4) // 动态计算可以分多少列
    let width = 100/col + '%' // 每列的宽度
    let newArr = this.split_array(array,4) // 拆成每4个元素做为一列的数组
    // console.log(newArr,'aaa')
    if(newArr.length===0){
      return <div style={{height:'224px', display:'flex',justifyContent:'center',alignItems:'center'}}><Empty image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ margin: '0px' }}></Empty></div>
    }else{

      let a = col - newArr.length
      for(var i =0; i<a; i++){
        newArr.push([{ id:i, name:'', type:1, money: '' }])
      }
      // console.log(newArr,'bbb')
      return newArr.map(v=>{

        if(v.length !== 4){// 没有4行的进行填充空的数据，用于填补样式
          let len = 4 - v.length
          for(var i =0; i<len; i++){
             v.push({ id:i, name:'', type:1, money: '' })
          }
        }
        // console.log(v,'vvvvvvvv')
        return (
            <div style={{width,height:'224px',float:'left'}}>
              {
                v.map((item,idx)=>{
                  return (
                    <div className={styles.pay_item} key={idx}>
                      {item.name&&<div className={styles.payleft}><span>{item.name + ' : '}</span><span className={styles.pay_money}>{item.money}</span></div>}
                      {item.type*1===0&&<div className={styles.payright}><span className={styles.is_type}>非实收</span></div>}
                    </div>
                  )
                })
              }
            </div>
        )

      })
    }

  }

  render(){
    const {totalShows, data, loading, date, currentType, month} = this.state
    const columns1 = [
      {
        title: '实收分类',
        width: '34%',
        dataIndex: 'project',
        key: 'project',
        render: (e, r) => <span onClick={() => this.pickRouter(r.type*1)} class={styles.link}>{r.project}</span>,
      },
      {
        title: '实收金额',
        width: '33%',
        dataIndex: 'receipts',
        key: 'receipts',
      },
      {
        title: '占比',
        width: '33%',
        dataIndex: 'ratio',
        key: 'ratio',
        render: (e,r) => <span>{r.ratio}%</span>,
      },
    ]

    return <div className={styles.dailyBox}>
      <div className={styles.daily}>
        <Select defaultValue="1" onChange={this.handleChange}>
          <Option value="1">按天查看</Option>
          <Option value="2">按月查看</Option>
        </Select>
        {
          currentType*1 === 1 ? 
          <DatePicker onChange={this.onChange} suffixIcon={<Icon type="caret-down"  />} value={moment(date, "YYYY-MM-DD")} allowClear={false}/>
          :
          <MonthPicker onChange={this.monthChange} suffixIcon={<Icon type="caret-down" />} value={moment(month, "YYYY-MM")} allowClear={false}></MonthPicker>
        }
        <Button type="primary" onClick={this.goback} className={styles.backbtn}>返回上一页</Button>
      </div>
      <div className={styles.main_top}>
        {
          totalShows.map(_ => <div className={styles.item} key={_.label}>
            <Spin spinning={loading} >
              <div className={styles.loading_div}>
                <div className={styles.title}>{_.label}</div>
                <div className={styles.value}>{_.value}</div>
              </div>
            </Spin>
          </div>)
        }
      </div>
      <div className={styles.main_center}>
        <div className={styles.c_left}>
          <Table columns={ columns1 } rowClassName="rowClass" dataSource={data.receipts||[]} pagination={false} loading={loading} />
        </div>
        <div className={styles.c_right}>
          <div className={styles.tableHeader}>结算方式</div>
          <Spin spinning={loading} >
            <div className={styles.tableBody}>
              {
                this.renderPay(data.paymentType||[])
              }
            </div>
          </Spin>
        </div>
      </div>
      <TabTable  date={this.format(date)} loading={loading} />
    </div>
  }
}

export default Daily
