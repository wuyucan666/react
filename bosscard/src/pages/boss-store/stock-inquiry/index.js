import { Component } from "react"
import { connect } from "dva"
import services from 'services'
import styles from './styles.less'
import { Table, DatePicker } from 'antd'
import moment from 'moment'
import TrendBox from "../warehouse-total/components/trendBox/index"
var date = new Date()
var year = date.getFullYear()
var month = date.getMonth() + 1
var hasTime = year + '-' + month
const { MonthPicker } = DatePicker
class inquiry extends Component {
  state = {
    data: [],
    integralData: [],
    onlyOne: true,
    visible: false,
    projectid: 0,
    timeRanking: hasTime,
    name: '',
    columns: [{
      title: '序号',
      dataIndex: 'ranking',
      key: 'ranking',
    }, {
      title: '商品名称',
      dataIndex: 'name',
      key: 'name',
      width: '112px',
      render: (text) => {
        return <div style={{ margin: '0px', width: '112px', wordWrap: 'break-word', wordBreak: 'break-all' }}>
          {text}
        </div>
      },
    }, {
      title: '规格',
      dataIndex: 'spec',
      key: 'spec',
    }, {
      title: '编码',
      dataIndex: 'code',
      key: 'code',
      width: '112px',
      render: (text) => {
        return <div style={{ margin: '0px', width: '112px', wordWrap: 'break-word', wordBreak: 'break-all' }}>
          {text}
        </div>
      },
    }, {
      title: '出库金额',
      key: 'total',
      dataIndex: 'total',
      sorter: () => { },
    }, {
      title: '出库数量',
      key: 'number',
      dataIndex: 'number',
      sorter: () => { },
    }, {
      title: '',
      key: 'action',
      render: (res) => (
        <span onClick={this.onChangeValue.bind(this, res)} className='iconfont icon-shuju1' style={{ cursor: 'pointer', color: '#4AACF7' }}></span>
      ),
    }],
    integralList: [{
      title: '序号',
      dataIndex: 'ranking',
      key: 'ranking',
    }, {
      title: '商品名称',
      dataIndex: 'name',
      key: 'name',
      render: (text) => {
        return <div style={{ margin: '0px', width: '112px', wordWrap: 'break-word', wordBreak: 'break-all' }}>
          {text}
        </div>
      },
    }, {
      title: '规格',
      dataIndex: 'spec',
      key: 'spec',
    }, {
      title: '编码',
      dataIndex: 'code',
      key: 'code',
      render: (text) => {
        return <div style={{ margin: '0px', width: '112px', wordWrap: 'break-word', wordBreak: 'break-all' }}>
          {text}
        </div>
      },
    }, {
      title: '积压金额',
      key: 'total',
      dataIndex: 'total',
      sorter: () => { },
    }, {
      title: '积压数量',
      key: 'number',
      dataIndex: 'number',
      sorter: () => { },
    }, {
      title: '几天未出库',
      key: 'delivery',
      dataIndex: 'delivery',
      sorter: () => { },
    }],
    totalNum: 0,
    totalMoney: 0,
  }
  returnBtn = () => {
    this.setState({
      visible: false,
    })
  }
  onChangeValue = (res) => {
    console.log(res, 33)
    this.setState({
      visible: true,
      name: res.name,
    })
    setTimeout(() => {
      if (this.state.onlyOne) {
        services.DETAIL({ keys: { name: 'erp/statistics/bestselling', id: res.id } }).then(vs => {
          vs.list.forEach((g) => {
            g.created = moment(g.created * 1000).format('YYYY-MM-DD')
          })
          this.setState({
            projectid: res.id,
          })
          this.refs.lineDiv.textclick(vs.list)
        })
        this.setState({
          onlyOne: false,
        })
      } else {
        services.DETAIL({ keys: { name: 'erp/statistics/bestselling', id: res.id } }).then(vg => {
          vg.list.forEach((g) => {
            g.created = moment(g.created * 1000).format('YYYY-MM-DD')
          })
          this.setState({
            projectid: res.id,
          })
          this.refs.lineDiv.publicPic(vg.list)
        })
      }
    }, 200)
  }
  componentDidMount() {
    this.publicApi({ time: [moment(this.state.timeRanking).unix(), moment(this.state.timeRanking).endOf('month').unix()] })
    this.inquiryApi({ num: undefined, money: undefined, day: undefined })
  }
  publicApi = ({ num, money, time }) => {
    services.getbestselling({ data: { q: { order: { number: num, total: money }, where: { "created[<>]": time } } } }).then(res => {
      this.setState({
        data: res.list.map((v, index) => ({ ...v, key: index, ranking: index + 1 })),
      })
    })
  }
  inquiryApi = ({ num, money, day }) => {
    services.LIST({ keys: { name: 'erp/statistics/unsold' }, data: { q: { page: -1, limit: 30, order: { number: num, total: money, delivery: day } } } }).then(res => {
      let nums = 0
      let moneys = 0
      res.list.forEach(g => {
        nums = nums + g.number
        moneys = moneys + g.total
      })
      this.setState({
        integralData: [...res.list.map((v, index) => ({ ...v, key: index, ranking: index + 1 })), { number: nums, total: moneys, key: -1, ranking: '合计' }],
        totalNum: nums,
        totalMoney: moneys,
      })
    })
  }
  footer = () => {
    return <div style={{ display: 'flex', fontSize: '14px', color: '#4AACF7' }}>
      <span style={{ flex: 4.3 }}>合计</span>
      <span style={{ flex: 1.8 }}>{this.state.totalMoney}</span>
      <span style={{ flex: 2.8 }}>{this.state.totalNum}</span>
    </div>
  }
  render() {
    const onChange = (pagination, filters, sorter) => {
      if (sorter.columnKey === "total") {
        if (sorter.order === "ascend") {
          this.publicApi({ money: 1, time: [moment(this.state.timeRanking).unix(), moment(this.state.timeRanking).endOf('month').unix()] })
        } else {
          this.publicApi({ money: 2, time: [moment(this.state.timeRanking).unix(), moment(this.state.timeRanking).endOf('month').unix()] })
        }
      } else if (sorter.columnKey === "number") {
        if (sorter.order === "ascend") {
          this.publicApi({ num: 1, time: [moment(this.state.timeRanking).unix(), moment(this.state.timeRanking).endOf('month').unix()] })
        } else {
          this.publicApi({ num: 2, time: [moment(this.state.timeRanking).unix(), moment(this.state.timeRanking).endOf('month').unix()] })
        }
      }
    }

    const integralChange = (pagination, filters, sorter) => {
      if (sorter.columnKey === "total") {
        if (sorter.order === "ascend") {
          this.inquiryApi({ money: 1 })
        } else {
          this.inquiryApi({ money: 2 })
        }
      } else if (sorter.columnKey === "number") {
        if (sorter.order === "ascend") {
          this.inquiryApi({ num: 1 })
        } else {
          this.inquiryApi({ num: 2 })
        }
      } else if (sorter.columnKey === "delivery") {
        if (sorter.order === "ascend") {
          this.inquiryApi({ day: 1 })
        } else {
          this.inquiryApi({ day: 2 })
        }
      }
      console.log('aaaaaaaaaa', sorter)
    }
    const monthData = (e, v) => {
      console.log('eeeeee', e, v)
      this.setState({
        timeRanking: v,
      }, () => {
        this.publicApi({ time: [moment(this.state.timeRanking).unix(), moment(this.state.timeRanking).endOf('month').unix()] })
      })
    }
    return (
      <div>
        <div className={styles.tablefather}>
          <div>
            <div className={styles.func}>
              <div>畅销商品排行</div>
              <div>
                <span>月度</span>
                <MonthPicker allowClear={false} format="YYYY-MM" defaultValue={moment(hasTime, 'YYYY-MM')} onChange={monthData} placeholder="选择月份" />
              </div>
            </div>
            <div className={styles.tableDiv}>
              <Table onChange={onChange} columns={this.state.columns} dataSource={this.state.data} pagination={false} />
            </div>
          </div>
          <div>
            <div className={styles.func}>
              <div>积压商品列表</div>
            </div>
            <div className={styles.tableDiv}>
              <Table onChange={integralChange} columns={this.state.integralList} dataSource={this.state.integralData} pagination={false} />
            </div>
          </div>
        </div>
        <TrendBox visible={this.state.visible} name={this.state.name} projectid={this.state.projectid} returnBtn={this.returnBtn.bind(this)} ref="lineDiv" />
      </div>
    )
  }
}
function mapStateToProps(state) {
  const { inquiryList } = state.inquiryName
  return { inquiryList }
}
export default connect(mapStateToProps)(inquiry)
