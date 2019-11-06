import { Component } from "react"
import { Button, Row, Col, DatePicker, Select, Table, Radio } from 'antd'
import G2 from "@antv/g2"
import service from 'services'
import moment from 'moment'

import style from './style.less'

const RangePicker = DatePicker.RangePicker
const Option = Select.Option
var chart
class arriveNum extends Component {

  state = {
    curtype: 1, //今日 本月。。 1 2 3 4    0 时间段
    showtype: 1, //按日 按月。。
    index: 0, //
    timeBetween: [],
    created: [],
    buts: [
      {name: '今日', type: 1, checked: true},
      {name: '本月', type: 2, checked: false},
      {name: '本年', type: 3, checked: false},
      {name: '历史', type: 4, checked: false},
    ],
    buttons: [
      {name: '按日', type: 1, disabled: false},
      {name: '按周', type: 2, disabled: false},
      {name: '按月', type: 3, disabled: true},
      {name: '按年', type: 4, disabled: true},
    ],
    summer: [  //汇总
      {title: '总到店台次', count: 102, icon: 'icon-quanbucheliang', key: 'totalCar'},
      {title: '会员车辆', count: 102, icon: 'icon-huiyuancheliang', key: 'clientCar'},
      {title: '散客车辆', count: 102, icon: 'icon-sankecheliang', key: 'tempCar'},
      {title: '会员转化率', count: 102, icon: 'icon-huiyuanzhuanhuashuai', key: 'clientBe'},
      {title: '老客车辆', count: 102, icon: 'icon-laokecheliang', key: 'oldCar'},
      {title: '新客车辆', count: 102, icon: 'icon-xinkecheliang', key: 'newCar'},
      {title: '老客转化率', count: 102, icon: 'icon-laokezhuanhuashuai', key: 'oldBe'},
    ],
    chartData: [], //趋势
    list: [], //列表
    pageInfo: {page: 1, limit: 10},
    noButtonClick:false, //用于控制按钮是否被点击
  }

  getList = () => {
    this.setState({
      noButtonClick:true, //用于控制按钮是否被点击
    })
    let created = []
    let groupBy = ''
    const { curtype, showtype} = this.state
    switch(curtype) {
      case 0:
        created = this.state.timeBetween
        break
      case 1:
        created = [
          (moment().day(moment().day()).startOf('day').valueOf() / 1000).toFixed(0),
          (moment().day(moment().day()).endOf('day').valueOf() / 1000).toFixed(0),
        ]
        break
      case 2:
        created = [
          (moment().month(moment().month()).startOf('month').valueOf() / 1000).toFixed(0),
          (moment().month(moment().month()).endOf('month').valueOf() / 1000).toFixed(0),
        ]
        break
      case 3:
        created = [
          (moment().year(moment().year()).startOf('year').valueOf() / 1000).toFixed(0),
          (moment().year(moment().year()).endOf('year').valueOf() / 1000).toFixed(0),
        ]
        break
      case 4:
        created = undefined
        break
      default:
    }
    this.setState({created})
    if(showtype === 1) {
      groupBy = 'day'
    }else if(showtype === 2 ) {
      groupBy = 'week'
    }else if(showtype === 3 ) {
      groupBy = 'month'
    }else {
      groupBy = 'year'
    }
    let index =  this.state.index
    service.LIST({  //走势图
      keys: { name: "wide-business/shop/times/trend" },
      data: {q: {where: {'completed[<>]': created}, groupBy, index}},
    }).then(res => {
      if(res.success) {
        if(showtype === 2) {
          res.data = res.data.map(v => ({...v, date: `第${v.date}周`}))
        }
        this.setState({chartData: res.data}, () => {
          chart.changeData(this.state.chartData)
        })
      }
    })
    service.LIST({  //汇总
      keys: {name: 'wide-business/shop/times/collect'},
      data: {q: {where: {'completed[<>]': created}}},
    }).then(res => {
      if(res.success) {
        this.setState({
          noButtonClick:false, //用于控制按钮是否被点击
          summer: this.state.summer.map(v => {
            return {...v, count: res.data[v.key]}
          }),
        })
      }else{
        this.setState({
          noButtonClick:false, //用于控制按钮是否被点击
        })
      }
    })
    service.LIST({ //列表
      keys: {name: 'wide-business/shop/times/list'},
      data: {q: {page: this.state.pageInfo.page, limit: this.state.pageInfo.limit, where: {'completed[<>]': created}}},
    }).then(res => {
      if(res.success) {
        this.setState({list: res.list, pageInfo: {...this.state.pageInfo, total: res.totalSize, cursize: res.list.length}})
      }
    })
  }

  async componentDidMount () {
    this.getList()
    this.draw(this.state.chartData)
  }

  draw = (data) => {
    chart = new G2.Chart({
      container: 'chart',
      forceFit: true,
      height: 312,
      padding: [30, 0, 30, 30],
    })
    const defs = {
      num: {
        tickInterval: 10,
        alias: '总到店台次',
      },
      date: {
        type: 'cat',
      },
    }
    chart.source(data, defs)
    chart.interval().position('date*num').size(42)
    chart.render()
  }

  changeType = (index) => {
    this.setState({
      curtype: index,
      showtype: index > 2 ? 3 : 1,
      buts: this.state.buts.map(v => {
        v.checked = false
        if(index === v.type) {
          v.checked = true
        }
        return v
      }),
      buttons: this.state.buttons.map(v => {
        v.disabled = true
        if(v.type <= index) {
          v.disabled = false
        }
        return v
      }),
    }, () => {
      this.getList()
    })
  }

  handleSizeChange = (e) => {
    this.setState({showtype: e}, () => {
      this.getList()
    })
  }

  onChangeTime = (e) => {
    e = e.map(v => {
      return (v.valueOf() / 1000).toFixed(0)
    })
    this.setState({
      curtype: 0,
      timeBetween: e.length!==0? e : [undefined,undefined],
      buts: this.state.buts.map(v => ({...v, checked: false})),
    },()=>{
      this.getList()
    })
  }

  changeHandel = (e) => {
    if(Object.keys(e).length > 0) {
      service.LIST({ //列表
        keys: {name: 'wide-business/shop/times/list'},
        data: {q: {where: {'completed[<>]': this.state.created}, by: {[e.columnKey]: e.order === 'ascend' ? 1 : 2}}},
      }).then(res => {
        if(res.success) {
          this.setState({list: res.list})
        }
      })
    }
  }

  changeIndex = (e) => {
    this.setState({index: e}, () => {
      this.getList()
    })
  }

  search = () => {
    this.getList()
  }

  render() {

    const columns = [{
      title: '日期',
      dataIndex: 'date',
      align: 'left',
      width: '10%',
    },{
      title: '总到店台次',
      dataIndex: 'carCount',
      align: 'left',
      width: '10%',
      sorter: true,
      render: c => {
        return <div style={{color: '#4AACF7'}}>{c}</div>
      },
    },{
      title: '会员车辆',
      dataIndex: 'clientCar',
      align: 'left',
      width: '10%',
      sorter: true,
    },{
      title: '会员占比',
      dataIndex: 'clientCarBe',
      align: 'left',
      width: '10%',
      sorter: true,
    },{
      title: '散客车辆',
      dataIndex: 'tempCar',
      align: 'left',
      width: '10%',
      sorter: true,
    },{
      title: '散客占比',
      dataIndex: 'tempCarBe',
      align: 'left',
      width: '10%',
      sorter: true,
    },{
      title: '新客车辆',
      dataIndex: 'newCar',
      align: 'left',
      width: '10%',
      sorter: true,
    },{
      title: '新客占比',
      dataIndex: 'newCarBe',
      align: 'left',
      width: '10%',
      sorter: true,
    },{
      title: '老客车辆',
      dataIndex: 'oldCar',
      align: 'left',
      width: '10%',
      sorter: true,
    },{
      title: '老客占比',
      dataIndex: 'oldCarBe',
      align: 'left',
      width: '10%',
      sorter: true,
    }]

    return (
      <div className={style.page}>
        {/* 表头 */}
        <div>
          <Row>
            <Col span={24}>
              {
                this.state.buts.map((v,i) => {
                  return <Button key={i}
                  size='large'
                  onClick={() =>this.changeType(v.type)}
                  style={{width: '80px', marginRight: '24px'}}
                  type={v.checked ? 'primary' : 'default'}
                  loading={this.state.noButtonClick}
                  disabled={this.state.noButtonClick}
                  >
                  {v.name}
                  </Button>
                })
              }
              <RangePicker
                size='large'
                onChange={this.onChangeTime}
              />
              {/* <Button type='primary' size='large' style={{margin: '0 24px'}} onClick={this.search}>查询</Button>
              <Button size='large'>重置</Button> */}
            </Col>
          </Row>
        </div>
        {/* 汇总数据 */}
        <div>
          <div className={style.title}>汇总数据</div>
          <div className={style['summer-content']}>
            {
              this.state.summer.map((v,i) => {
                return (
                  <div className='felx center' key={i}>
                    <i className={'iconfont ' + v.icon}></i>
                    <p>{v.title}</p>
                    <div>{v.count}</div>
                  </div>
                )
              })
            }
          </div>
        </div>
        {/* 到店台次数据 */}
        <div>
          <div className={style.title}>到店台次数据</div>
          <div className={style['arrive-content']}>
            <div className='flex'>
              <div className='item'>
                <Select size='large' style={{width: '220px'}} onChange={(e) => this.changeIndex(e)} value={this.state.index} placeholder='请选择'>
                  <Option value={0}>总到店台次</Option>
                  <Option value={1}>会员车辆</Option>
                  <Option value={2}>散客车辆</Option>
                  <Option value={3}>老客车辆</Option>
                  <Option value={4}>新客车辆</Option>
                </Select>
              </div>
              <div>
                <Radio.Group value={this.state.showtype} onChange={(e) => this.handleSizeChange(e.target.value)} size='large'>
                  {
                    this.state.buttons.map((v,i)=> <Radio.Button key={i} className={style.but} value={v.type} disabled={v.disabled}>{v.name}</Radio.Button>)
                  }
                </Radio.Group>
              </div>
            </div>
            <div id="chart" style={{height: '312px', marginTop: '50px'}}></div>
          </div>
        </div>
        {/* 明细数据 */}
        <div>
          <div className={style.title}>明细数据</div>
          <div>
            <Table
            columns={columns}
            onChange={(a,b,sorter) => this.changeHandel(sorter)}
            dataSource={this.state.list}
            pagination={{
              showTotal: () => (
                <div
                style={{ position: 'absolute', left: 0, bottom: 0, color: '#999'}}
                >
                  本页显示<span style={{ color: "#333" }}>{this.state.pageInfo.cursize}</span>
                  条记录，共<span style={{ color: "#333" }}>{this.state.pageInfo.total}</span>
                  条记录
                </div>
              ),
            }
            }
            ></Table>
          </div>
        </div>
      </div>
    )
  }
}

export default arriveNum
