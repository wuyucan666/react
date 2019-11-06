import React, { Component } from "react"
import { connect } from "dva"
import { Form, DatePicker, Button } from "antd"
import G2 from "@antv/g2"
import styles from "./styles.less"
import Table from "./table"
import moment from "moment"
const { RangePicker } = DatePicker
var sliceNumber = 0.01
//自定义饼状结构统计图
G2.Shape.registerShape("interval", "sliceShape", {
  draw: function draw(cfg, container) {
    var points = cfg.points
    var path = []
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
//图形渲染
const PieChart = (data, o) => {
  var chart = new G2.Chart({
    ...o,
  })
  chart.source(data)
  chart.coord("theta", {
    innerRadius: 0.75,
  })
  chart.tooltip({
    showTitle: false,
  })
  chart
    .intervalStack()
    .position("value")
    .color("type")
    .shape("sliceShape")

  chart.render()
}
class Settlement extends Component {
  constructor() {
    super()
    this.state = {
      tab: 0,
      marketing: [],
      actual: [],
      noActual: [],
      giveaway: [],
      tabButton: ["今日", "本月", "本年", "历史"],
      color: ['#1890FFFF', '#13C2C2FF', '#2FC25BFF', '#FACC14FF', '#F04864FF', '#8543E0FF'],
      end: 0,
      start: 0,
      timeValue: [],
      time: false, // 搜索框里面是否有搜索内容
    }
  }
  UNSAFE_componentWillMount() { }
  componentDidMount() {
    const { dispatch } = this.props
    dispatch({
      type: "settlementType/getDataPay",
      payload: '',
    }).then(() => {
      this.changeButton(0)
    })
  }
  changeButton = (tab) => {
    this.setState({
      timeValue: null,
      start: 0,
      end: 0,
    })
    let day = moment().format('YYYY-MM-DD')
    let m = moment().format('YYYY-MM')
    let y = moment().format('YYYY')
    let days = day + ' 23:59:59'
    let start, end
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
      case 3:
        start = 0
        end = 0
        break
      default:
        return
    }
    // if (st === true) {
    //   this.requestData(start, end)
    // }
    this.setState({
      tab,
      start,
      end,
    }, () => {
      this.goData()
    })
  }
  requestData = (start, end) => {
    const { dispatch } = this.props
    const o = {
      forceFit: true,
      height: 220,
      width: 220,
      padding: 0,
    }
    dispatch({
      type: "settlementType/getData",
      payload: this.state.tab === 3 ? '' : [start, end],
    }).then(() => {
      const { settlementData } = this.props
      this.setState({
        marketing: settlementData.marketing ? settlementData.marketing.list.map(v => ({
          ...v,
          value: v.be ? parseFloat(v.be) : 0,
          price: v.money,
          type: v.title,
        })) : [],
        actual: settlementData.actual ? settlementData.actual.list.map((v) => ({
          ...v,
          value: v.be ? parseFloat(v.be) : 0,
          price: v.totalMoney,
          type: v.paymentName,
        })) : [],
        noActual: settlementData.noActual ? settlementData.noActual.list.map((v) => ({
          ...v,
          value: v.be ? parseFloat(v.be) : 0,
          price: v.totalMoney,
          type: v.paymentName,
        })) : [],
        giveaway: settlementData.giveaway ? settlementData.giveaway.list.map(v => ({
          ...v,
          value: v.be ? parseFloat(v.be) : 0,
          price: v.totalMoney,
          type: v.title,
        })) : [],
      }, () => {
        if (settlementData.marketing && settlementData.marketing.total && this.marketing) {
          this.marketing.innerHTML = ''
          PieChart(this.state.marketing, {
            container: "marketing",
            ...o,
          })
        }
        if (settlementData.actual && settlementData.actual.total && this.actual) {
          this.actual.innerHTML = ''
          PieChart(this.state.actual, {
            container: "actual",
            ...o,
          })
        }
        if (settlementData.noActual && settlementData.noActual.total && this.noActual) {
          this.noActual.innerHTML = ''
          PieChart(this.state.noActual, {
            container: "noActual",
            ...o,
          })
        }
        if (settlementData.giveaway && settlementData.giveaway.total && this.giveaway) {
          this.giveaway.innerHTML = ''
          PieChart(this.state.giveaway, {
            container: "giveaway",
            ...o,
          })
        }
      })
    })
  }
  /**
   * 查询
   */
  goData = () => {
    this.requestData(this.state.start, this.state.end)
  }
  /**
   * 选择时间
   */
  onChange = (e, time) => {
    let days = time[1] + ' 23:59:59'
    this.setState({
      timeValue: e,
      tab: -1,
      start: moment(time[0]).unix(),
      end: moment(days).unix(),
    }, () => {
      this.goData()
    })
  }
  render() {
    const { marketing, actual, noActual, giveaway, color } = this.state
    const { dataList, pay } = this.props
    return (
      <div className={styles.settlementWrap}>
        <div className={styles.settlementTop}>
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
          <RangePicker size="large" onChange={this.onChange.bind(this)} value={this.state.timeValue} style={{ width: '532px' }} />
          <Button size="large" type="primary" onClick={this.goData.bind(this)} style={{ marginLeft: "24px" }}>
            查询
          </Button>
        </div>
        <div className={styles.head}>
          <div />
          <span>营收金额</span>
        </div>
        <div className={styles.dataBox}>
          <div className={styles.dataBoxFirst}>
            <div className={styles.title}>环形图示</div>
            <div className={styles.dataCirBox}>
              <div id="marketing" ref={(marketing) => this.marketing = marketing} />
            </div>
            {/* {(settlementData.marketing && settlementData.marketing.total) ? <div className={styles.dataCirBox}>
              <div id="marketing" ref={(marketing) => this.marketing = marketing} />
            </div> : ''}
            {(settlementData.marketing && settlementData.marketing.total <= 0) ? <div className={styles.circleBox}><div className={styles.circleXBox}></div></div> : ''} */}
          </div>
          <div className={styles.dataBoxTwo}>
            <div className={styles.title}>
              <div>实收项目</div>
              <div>占比</div>
              <div>金额</div>
            </div>
            <div className={styles.cont}>
              {marketing && marketing.map((item, index) => {
                return (
                  <div className={styles.title} key={index}>
                    <div>
                      <span style={{ 'background': index <= 5 ? color[index] : color[5] }} />
                      {item.type}
                    </div>
                    <div>{item.be}</div>
                    <div>{item.price}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className={styles.head}>
          <div />
          <span>实收金额</span>
        </div>
        <div className={styles.dataBox}>
          <div className={styles.dataBoxFirst}>
            <div className={styles.title}>环形图示</div>
            <div className={styles.dataCirBox}>
              <div id="actual" ref={(actual) => this.actual = actual} />
            </div>
            {/* {(settlementData.actual && settlementData.actual.total) ? <div className={styles.dataCirBox}>
              <div id="actual" ref={(actual) => this.actual = actual} />
            </div> : ''}
            {(settlementData.actual && settlementData.actual.total <= 0) ? <div className={styles.circleBox}><div className={styles.circleXBox}></div></div> : ''} */}
          </div>
          <div className={styles.dataBoxTwo}>
            <div className={styles.title}>
              <div>名称</div>
              <div>占比</div>
              <div>金额</div>
              <div>会员计次卡</div>
              <div>会员充值卡</div>
              <div>工单现结</div>
            </div>
            <div className={styles.cont}>
              {actual.map((item, index) => {
                return (
                  <div className={styles.title} key={index}>
                    <div>
                      <span style={{ 'background': index <= 5 ? color[index] : color[5] }} />
                      {item.type}
                    </div>
                    <div>{item.be}</div>
                    <div>{item.price}</div>
                    <div>{item.recodesCardMoney}</div>
                    <div>{item.speciesCardMoney}</div>
                    <div>{item.maintainMoney}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className={styles.head}>
          <div />
          <span>非实收金额</span>
        </div>
        <div className={styles.dataBox}>
          <div className={styles.dataBoxFirst}>
            <div className={styles.title}>环形图示</div>
            <div className={styles.dataCirBox}>
              <div id="noActual" ref={(noActual) => this.noActual = noActual} />
            </div>
            {/* {(settlementData.noActual && settlementData.noActual.total) ? <div className={styles.dataCirBox}>
              <div id="noActual" ref={(noActual) => this.noActual = noActual} />
            </div> : ''}
            {(settlementData.noActual && settlementData.noActual.total <= 0) ? <div className={styles.circleBox}><div className={styles.circleXBox}></div></div> : ''} */}
          </div>
          <div className={styles.dataBoxTwo}>
            <div className={styles.title}>
              <div>名称</div>
              <div>占比</div>
              <div>金额</div>
              <div>会员计次卡</div>
              <div>会员充值卡</div>
              <div>工单现结</div>
            </div>
            <div className={styles.cont}>
              {noActual.map((item, index) => {
                return (
                  <div className={styles.title} key={index}>
                    <div>
                      <span style={{ 'background': index <= 5 ? color[index] : color[5] }} />
                      {item.type}
                    </div>
                    <div>{item.be}</div>
                    <div>{item.price}</div>
                    <div>{item.recodesCardMoney}</div>
                    <div>{item.speciesCardMoney}</div>
                    <div>{item.maintainMoney}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className={styles.head}>
          <div />
          <span>优惠金额</span>
        </div>
        <div className={styles.dataBox}>
          <div className={styles.dataBoxFirst}>
            <div className={styles.title}>环形图示</div>
            <div className={styles.dataCirBox}>
              <div id="giveaway" ref={(giveaway) => this.giveaway = giveaway} />
            </div>
            {/* {(settlementData.giveaway && settlementData.giveaway.total) ? <div className={styles.dataCirBox}>
              <div id="giveaway" ref={(giveaway) => this.giveaway = giveaway} />
            </div> : ''}
            {(settlementData.giveaway && settlementData.giveaway.total <= 0) ? <div className={styles.circleBox}><div className={styles.circleXBox}></div></div> : ''} */}
          </div>
          <div className={styles.dataBoxTwo}>
            <div className={styles.title}>
              <div>实收项目</div>
              <div>占比</div>
              <div>金额</div>
            </div>
            <div className={styles.cont}>
              {giveaway.map((item, index) => {
                return (
                  <div className={styles.title} key={index}>
                    <div>
                      <span style={{ 'background': index <= 5 ? color[index] : color[5] }} />
                      {item.type}
                    </div>
                    <div>{item.be}</div>
                    <div>{item.price}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className={styles.head}>
          <div />
          <span>明细数据</span>
        </div>
        <Table dataList={dataList} pay={pay} />
      </div>
    )
  }
}
function mapStateToProps(state) {
  const { settlementData, dataList, pay } = state.settlementType
  return { settlementData, dataList, pay }
}
export default connect(mapStateToProps)(Form.create()(Settlement))
