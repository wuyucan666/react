import React, { Component } from 'react'
import { Table, DatePicker, Spin } from 'antd'
import style from './style.less'
import services from "services"
import moment from "moment"
import router from 'umi/router'



const MonthPicker = DatePicker.MonthPicker
export default class index extends Component {
  constructor() {
    super()
    this.state = {
      paymentList: [],
      loading: true,
      totalSize: 50,
      curPage: 1,
      dataList: [],
      timestamp: null,
    }
  }
  onChange = (val) => {
    console.log(val)
    if (val) {
      this.setState({
        timestamp: Date.parse(moment(val)) / 1000,
      }, () => {
        const { timestamp } = this.state
        this.getData({ timestamp })
      })
    } else {
      let now = new Date()
      let timestamp = Date.parse(moment(now)) / 1000
      this.setState({
        timestamp,
      }, () => {
        this.getData({ timestamp })
      })
    }
  }
  UNSAFE_componentWillMount() {
    let now = new Date()
    let timestamp = Date.parse(moment(now)) / 1000
    this.setState({
      timestamp,
    }, () => {
      this.getData({ timestamp })
    })
  }
  getData = (o) => {
    this.setState({
      loading: true,
    }, () => {
      services.financeReport({ data: { ...o } }).then(async res => {
        if (res.code === '0') {
          const { data } = res
          const { overview, payment } = data
          //支付方式遍历
          let paymentList = payment.map(item => {
            return {
              ...item,
              symbol: 'pay' + item.id,
            }
          })
          //数据源遍历
          let dataList = overview.sort((b, a) => Date.parse(a.date) - Date.parse(b.date)).map(item => {
            return {
              ...item,
              date: item.date,
              ...this.getPaymentList(item.aggregation, paymentList),
            }
          })

          function computerMoney(overview, id) {
            let money = 0
            overview.forEach(v => {
              v.aggregation.forEach(j => {
                if (j.id === id) {
                  money = j.money * 1 + money
                }
              })
            })
            return money
          }
          let newList = paymentList.map(item => {
            return {
              id: item.id,
              money: computerMoney(overview, item.id),
            }
          })

          let obj = {
            date: '合计',
            ...this.getPaymentList(newList, paymentList),
            receipts: this.getColTotalData(dataList, 'receipts'),
            output: this.getColTotalData(dataList, 'output'),
            consume: this.getColTotalData(dataList, 'consume'),
          }
          dataList = dataList.filter(item => Date.parse(new Date(item.date)) < Date.parse(new Date()))
          if (dataList.length !== 0) {
            dataList.push(obj)
          }

          this.setState({
            paymentList,
            dataList,
            loading: false,
          }, () => {
          })
        }
      })

    })
  }

  /**获取当前列数据的总和
   * @param data {Array} 数据
   * @param type {String} 列的字段
   */
  getColTotalData = (data, type) => {
    return (data.reduce((total, _) => _[type] * 10 + total, 0) / 10).toFixed(1)
  }

  getPaymentList = (list, paymentList) => {
    let obj = {}
    let money = 0
    let fristObj = {}
    paymentList.forEach(item => {
      fristObj[item.symbol] = 0
    })
    list.forEach(v => {
      paymentList.forEach(item => {
        if (v.id === item.id) {
          obj[item.symbol] = v.money.toFixed(2)
          money = (v.money * 1 + money)
        }
      })
    })
    let addtion = 0
    if (obj['pay-1']) addtion = obj['pay-1'] * 1 + addtion
    if (obj['pay3']) addtion = obj['pay3'] * 1 + addtion
    obj.total = (money - addtion).toFixed(2)
    return {
      ...fristObj,
      ...obj,
    }
  }
  onChangePage = (e) => {
    this.setState({
      curPage: e,
    }, () => {
      const { timestamp } = this.state
      let o = { page: e }
      timestamp ? o.timestamp = timestamp : null
      this.getData(o)
    })
  }

  /** 渲染数据字段，数据不等于 0 的需要跳转到对应页面 */
  renderContent = (type) => (text, record, index) => {
    /**是否是总计数据 */
    const isTotal = index === this.state.dataList.length - 1
    /**点击数据，跳转到订单，筛选出对应的订单 */
    const hanldeClick = () => {
      const query = { date: isTotal ? moment.unix(this.state.timestamp).format('YYYY-MM') : record.date, id: type, isTotal }
      if (type === -1) {
        router.push({ pathname: "/boss-store/payment-reimbursement", query })
      } else {
        router.push({ pathname: "/boss-store/maintain-list/orderAll", query })
      }
    }
    /**数值大于0时，返回可以点击的样式 */
    return text * 1 !== 0 ? <a onClick={hanldeClick}>{text}</a> : text
  }

  render() {
    const { loading, paymentList, dataList, timestamp } = this.state
    const paylments = paymentList.filter(i => i.id * 1 !== 3 && i.id * 1 !== -1)

    let tableScroll = {
      x: paylments.length >= 7 ? (paylments.length + 4) * 160 + 'px' : undefined,
    }

    let width = 160

    const columns = [{
      title: '日期',
      dataIndex: 'date',
      key: 'operation1',
      width: 160,
      fixed: tableScroll.x ? 'left' : undefined,
    },
    ...paylments.map(item => {
      return {
        title: item.name,
        dataIndex: item.symbol,
        render: this.renderContent(item.id),
        width,
        key: item.symbol,
      }
    }),
    {
      title: '今日还款',
      dataIndex: 'pay-1',
      key: 'pay-1',
      width: 160,
      render: this.renderContent(-1),
    },
    {
      title: '新增欠款',
      dataIndex: 'pay3',
      key: 'pay3',
      width: 160,
      render: this.renderContent(3),
    },
    {
      title: '实收总额',
      dataIndex: 'receipts',
      key: 'receipts',
      width: 160,
      render: this.renderContent('receipts'),
    }, {
      title: '总产值',
      dataIndex: 'output',
      key: 'output',
      width: 160,
    }, {
      title: '总消耗',
      dataIndex: 'consume',
      key: 'consume',
      width: 160,
    },
    ]
    if (dataList.length === 0) {
      columns.splice(1, 0, {
        title: '暂无数据',
        dataIndex: 'none',
      })
    }

    return <div className={style.zl_box}   >
      <div className={style.zl_header}  >
        <MonthPicker defaultValue={moment(timestamp * 1000)} size='large' style={{ width: "290px" }} onChange={this.onChange} />
      </div>
      <div  >
        <Spin spinning={loading}  >
          <Table
            columns={columns}
            dataSource={dataList}
            scroll={tableScroll}
            pagination={false}
          />
        </Spin>
      </div>
    </div>
  }
}
