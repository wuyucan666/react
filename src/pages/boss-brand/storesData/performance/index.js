import React, { Component } from "react"
import { connect } from "dva"
import { Form, DatePicker, Button, Row, Col, Select, Table } from "antd"
import { G2, Chart, Geom, Tooltip, Coord } from "bizcharts"
import styles from "./styles.less"
import moment from "moment"
const Option = Select.Option
const { RangePicker } = DatePicker
var colors = ['#1890FFFF', '#13C2C2FF', '#2FC25BFF', '#FACC14FF', '#F04864FF', '#8543E0FF']
class Settlement extends Component {
  constructor() {
    super()
    this.state = {
      tab: 0,
      end: 0,
      storeId: 0,
      timeArr: [],
      start: 0,
      tabButton: ["今日", "本月", "本年"],
      columns: [{
        title: '实收项目',
        dataIndex: 'title',
        width: '35%',
        key: 'title',
        render: (text, record, index) => {
          return (
            <div className={styles.columnsD}><span style={{ background: index < 5 ? colors[index] : colors[5] }}></span>{text}</div>
          )
        },
      }, {
        title: '占比',
        dataIndex: 'be',
        width: '30%',
        key: 'be',
      }, {
        title: '金额',
        dataIndex: 'money',
        width: '35%',
        key: 'money',
      }],
      columns1: [{
        title: '充值办卡',
        dataIndex: 'firstRecharge',
        width: '25%',
        key: 'firstRecharge',
      }, {
        title: '计次卡办卡',
        dataIndex: 'firstCounting',
        width: '25%',
        key: 'firstCounting',
      }, {
        title: '充值卡续费',
        dataIndex: 'counting',
        width: '25%',
        key: 'counting',
      }],
    }
  }
  UNSAFE_componentWillMount() { }
  componentDidMount() {
    this.changeButton(0)
    this.getStoresList()
  }
  /**
   * 选择时间
   */
  onChangeTime = (e, time) => {
    this.setState({ timeArr: time })
    let d = time[1] + ' 23:59:59'
    this.setState({
      tab: -1,
      start: moment(time[0]).unix(),
      end: moment(d).unix(),
    })
    this.requestData(moment(time[0]).unix(), moment(d).unix())
  }
  /**
   * 今天/本月/本年
   */
  changeButton = (tab) => {
    let day = moment().format('YYYY-MM-DD')
    let m = moment().format('YYYY-MM')
    let y = moment().format('YYYY')
    let days = day + ' 23:59:59'
    let start, end
    this.setState({ timeArr: [] })
    switch (tab) {
      case 0:
        start = moment(day).unix()
        end = moment(days).unix()
        break
      case 1:
        start = moment(m).unix()
        end = moment().month(moment().month()).endOf('month').unix()
        break
      case 2:
        start = moment(y).unix()
        end = moment().year(moment().year()).endOf('year').unix()
        break
      default:
        return
    }
    this.setState({
      tab,
      start,
      end,
    })
    this.requestData(start, end)
  }
  /**
   * 获取数据
   */
  requestData = (start, end) => {
    const { dispatch } = this.props
    dispatch({
      type: "storesDataPerformance/getData",
      payload: { time: [start, end], id: this.state.storeId },
    })
  }
  /**
   * 获取门店列表
   */
  getStoresList = () => {
    const { dispatch } = this.props
    dispatch({
      type: "storesDataPerformance/getStoresList",
      payload: {},
    })
  }
  /**
   * 查询
   */
  goData = () => {
    this.requestData(this.state.start, this.state.end)
  }
  /**
     * 选择门店
     */
  handleChange = storeId => {
    this.setState({ storeId }, () => {
      this.requestData(this.state.start, this.state.end)
    })
  }
  /**
   * 重置
   */
  emyData = () => {
    this.setState({ storeId: 0, start: 0, end: 0, timeArr: [], tab: 0 }, () => {
      this.changeButton(0)
    })
  }
  render() {
    const { collect, details, marketing, storesList } = this.props
    const { columns, timeArr, storeId } = this.state
    const sliceNumber = 0.01
    let str = marketing.reduce((val, { price }) => ((parseFloat(price) * 1000) + (parseFloat(val) * 1000)) / 1000, 0)
    let marketingChart = marketing.filter(_ => _.price)

    // 自定义 other 的图形，增加两条线
    G2.Shape.registerShape("interval", "sliceShape", {
      draw(cfg, container) {
        const points = cfg.points
        let path = []
        path.push(["M", points[0].x, points[0].y])
        path.push(["L", points[1].x, points[1].y - sliceNumber])
        path.push(["L", points[2].x, points[2].y - sliceNumber])
        path.push(["L", points[3].x, points[3].y])
        path.push("Z")
        path = this.parsePath(path)
        return container.addShape("path", {
          attrs: {
            fill: cfg.color,
            path: path,
          },
        })
      },
    })

    return (
      <div className={styles.settlementWrap}>
        <div className={styles.settlementTop}>
          <div className={styles.storesbox}>
            <span>选择门店</span>
            <Select className={styles.sel} size="large" onChange={this.handleChange} value={storeId}>
              <Option key='0' value={0}>全部门店</Option>
              {
                storesList && storesList.map((v, index) => <Option key={index + 1} value={v.id}>{v.storeName}</Option>)
              }
            </Select>
          </div>
          {this.state.tabButton.map((item, i) => (
            <Button
              className={styles.settlementButton}
              size="large"
              key={i}
              onClick={this.changeButton.bind(this, i)}
              type={this.state.tab === i ? "primary" : null}
            >
              {item}
            </Button>
          ))}
          <RangePicker
            size="large"
            onChange={this.onChangeTime.bind(this)}
            format={'YYYY-MM-DD'}
            value={timeArr.length > 0 ? [moment(timeArr[0], 'YYYY-MM-DD'), moment(timeArr[1], 'YYYY-MM-DD')] : [undefined, undefined]}
          />
          <Button size="large" type="primary" onClick={this.goData} style={{ marginLeft: "25px" }}>
            查询
          </Button>
          <Button size="large" onClick={this.emyData} style={{ marginLeft: "25px" }}>
            重置
          </Button>
        </div>
        <div className={styles.head}>
          <div />
          <span>汇总数据</span>
        </div>
        <section className={styles.zl_Rs_one}>
          <Row gutter={32}>
            <Col className="gutter-row" span={6}>
              <div className={styles['zl_Rs_one-col']}>
                <i
                  style={{ float: "left", color: "#1890FFFF" }}
                  className={`iconfont icon-huiyuanqia`}
                />
                <div className={styles.zl_rs1_box}>
                  <p>总到店次数</p>
                  <p>{collect.totalCar || 0}</p>
                </div>
              </div>
            </Col>
            <Col className="gutter-row" span={6}>
              <div className={styles['zl_Rs_one-col']}>
                <i
                  style={{ float: "left", color: "#1890FFFF" }}
                  className={`iconfont icon-huiyuanqia`}
                />
                <div className={styles.zl_rs1_box}>
                  <p>会员车辆</p>
                  <p>{collect.clientCar || 0}</p>
                </div>
              </div>
            </Col>
            <Col className="gutter-row" span={6}>
              <div className={styles['zl_Rs_one-col']}>
                <i
                  style={{ float: "left", color: "#1890FFFF" }}
                  className={`iconfont icon-huiyuanqia`}
                />
                <div className={styles.zl_rs1_box}>
                  <p>散客车辆</p>
                  <p>{collect.tempCar || 0}</p>
                </div>
              </div>
            </Col>
            <Col className="gutter-row" span={6}>
              <div className={styles['zl_Rs_one-col']}>
                <i
                  style={{ float: "left", color: "#1890FFFF" }}
                  className={`iconfont icon-huiyuanqia`}
                />
                <div className={styles.zl_rs1_box}>
                  <p>会员转化率</p>
                  <p>{collect.clientBe || 0}</p>
                </div>
              </div>
            </Col>
            <Col className="gutter-row" span={6}>
              <div className={styles['zl_Rs_one-col']}>
                <i
                  style={{ float: "left", color: "#1890FFFF" }}
                  className={`iconfont icon-huiyuanqia`}
                />
                <div className={styles.zl_rs1_box}>
                  <p>老客车辆</p>
                  <p>{collect.oldCar || 0}</p>
                </div>
              </div>
            </Col>
            <Col className="gutter-row" span={6}>
              <div className={styles['zl_Rs_one-col']}>
                <i
                  style={{ float: "left", color: "#1890FFFF" }}
                  className={`iconfont icon-huiyuanqia`}
                />
                <div className={styles.zl_rs1_box}>
                  <p>新客车辆</p>
                  <p>{collect.newCar || 0}</p>
                </div>
              </div>
            </Col>
            <Col className="gutter-row" span={6}>
              <div className={styles['zl_Rs_one-col']}>
                <i
                  style={{ float: "left", color: "#1890FFFF" }}
                  className={`iconfont icon-huiyuanqia`}
                />
                <div className={styles.zl_rs1_box}>
                  <p>老客转化率</p>
                  <p>{collect.oldBe || 0}</p>
                </div>
              </div>
            </Col>
          </Row>
        </section>
        <div className={styles.zl_Rs_two}>
          <Row gutter={32}>
            <Col className="gutter-row" span={12}>
              <div>
                <div className={styles.head}>
                  <div />
                  <span>营收金额</span>
                </div>
                <div className={styles.zl_Rs_two_box}>
                  <div className={styles.chart}>
                    {str ? <Chart
                      height={192}
                      data={marketingChart}
                      forceFit
                      padding={{ top: 0, bottom: 30 }}
                    >
                      <Coord type="theta" innerRadius={0.75} />
                      <Tooltip showTitle={false} />
                      <Geom
                        type="intervalStack"
                        position="value"
                        color="type"
                        shape="sliceShape"
                      />
                    </Chart> : ''}
                    {!str ? <div className={styles.zl_Rs_two_emy}><div></div></div> : ''}
                  </div>
                  <div>
                    <Table dataSource={marketing || []} columns={columns} pagination={false} scroll={{ y: 220 }} />
                  </div>
                </div>
              </div>
            </Col>
            <Col className="gutter-row" span={12}>
              <div>
                <div className={styles.head}>
                  <div />
                  <span>明细数据</span>
                </div>
                <div className={styles.zl_Rs_two_boxs}>
                  <h3 className={styles.h}>办卡/续费收入</h3>
                  <Row className={styles.row_data}>
                    <Col className={styles.col_datas} span={6}>充值办卡</Col>
                    <Col className={styles.col_datas} span={6}>计次卡办卡</Col>
                    <Col className={styles.col_datas} span={6}>充值卡续费</Col>
                  </Row>
                  <Row className={styles.row_data}>
                    <Col className={styles.col_data} span={6}>{details.transactCard ? details.transactCard.firstRecharge : ''}</Col>
                    <Col className={styles.col_data} span={6}>{details.transactCard ? details.transactCard.firstCounting : ''}</Col>
                    <Col className={styles.col_data} span={6}>{details.transactCard ? details.transactCard.recharge : ''}</Col>
                    <Col className={styles.col_data} span={6}></Col>
                  </Row>
                  {/* <Table dataSource={details.transactCard || []} columns={columns1} pagination={false} /> */}
                  <h3 className={styles.h}>会员卡消费</h3>
                  <Row className={styles.row_data}>
                    <Col className={styles.col_datas} span={6}>充值卡扣</Col>
                    <Col className={styles.col_datas} span={6}>计次卡扣次数</Col>
                    <Col className={styles.col_datas} span={6}>计次卡扣金额</Col>
                    <Col className={styles.col_datas} span={6}>赠送卡扣次数</Col>
                  </Row>
                  <Row className={styles.row_data}>
                    <Col className={styles.col_data} span={6}>{details.buckleCard ? details.buckleCard.recharge : ''}</Col>
                    <Col className={styles.col_data} span={6}>{details.buckleCard ? details.buckleCard.counting : ''}</Col>
                    <Col className={styles.col_data} span={6}>{details.buckleCard ? details.buckleCard.countingMoney : ''}</Col>
                    <Col className={styles.col_data} span={6}>{details.buckleCard ? details.buckleCard.presenter : ''}</Col>
                  </Row>
                  {/* <Table dataSource={details.buckleCard || []} columns={columns2} pagination={false} /> */}
                  <h3 className={styles.h}>当前会员卡余额</h3>
                  <Row className={styles.row_data}>
                    <Col className={styles.col_datas} span={6}>充值卡余额</Col>
                    <Col className={styles.col_datas} span={6}>计次卡剩余次数</Col>
                    <Col className={styles.col_datas} span={6}>计次卡剩余金额</Col>
                    <Col className={styles.col_datas} span={6}>赠送卡剩余次数</Col>
                  </Row>
                  <Row className={styles.row_data}>
                    <Col className={styles.col_data} span={6}>{details.clientCardBalance ? details.clientCardBalance.rechargeMoney : ''}</Col>
                    <Col className={styles.col_data} span={6}>{details.clientCardBalance ? details.clientCardBalance.counting : ''}</Col>
                    <Col className={styles.col_data} span={6}>{details.clientCardBalance ? details.clientCardBalance.countingMoney : ''}</Col>
                    <Col className={styles.col_data} span={6}>{details.clientCardBalance ? details.clientCardBalance.presenter : ''}</Col>
                  </Row>
                  {/* <Table dataSource={details.clientCardBalance || []} columns={columns3} pagination={false} /> */}
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    )
  }
}
function mapStateToProps(state) {
  const { collect, details, marketing, storesList } = state.storesDataPerformance
  return { collect, details, marketing, storesList }
}
export default connect(mapStateToProps)(Form.create()(Settlement))
