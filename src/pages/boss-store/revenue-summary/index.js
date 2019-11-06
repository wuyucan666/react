import React, { Component } from "react"
import { connect } from "dva"
import { DatePicker, Button, Form } from "antd"
import styles from "./style.less"
import { tabData, dataCir, payData, paydata } from "./mockData"
import G2 from "@antv/g2"
// import Table from "./components/commonTable"
import moment from "moment"
const filterTime = a => {
  return moment(`${moment(a).format("YYYY-MM-DD")} 00:00:00`).unix()
}
const { RangePicker } = DatePicker
const FormItem = Form.Item
const tabButton = ["今日", "本月", "本年"]
const lastDate = ["昨日", "上月", "去年"]
// const TabPane = Tabs.TabPane
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
  let intival = {
    itemTpl: '<li data-index={index}>'
      + '<span style="background-color:{color};width:8px;height:8px;border-radius:50%;display:inline-block;margin-right:8px;"></span>'
      + '{name}|<span class="g2-tooltip-value" style="color:#4aacf7" >{value}%</span>'
      + '</li>',
  }
  chart.tooltip({
    showTitle: false,
    ...intival,
  })
  chart
    .intervalStack()
    .position("value")
    .color("type")
    .shape("sliceShape")

  chart.render()
}
//获得本月第一天
const getThisMonthFirstDay = () => {
  var date = new Date()
  date.setDate(1)
  return date
}
//获得本年第一天
const getThisYearFirstDay = () => {
  var currentDate = new Date()
  var currentYear = currentDate.getFullYear()
  var currentYearFirstDate = new Date(currentYear, 0, 1)
  return currentYearFirstDate
}
class RevenueSummary extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tab: 0,
      dataCir,
      payData,
      paydata: [],
      tabData,
      noPayData: true,
      visible: true,
      noDataCir: true,
      noButtonClick: false, //用于控制按钮是否被点击
    }
    this.dataCir = null
    this.payData = null
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  tabButton = tab => {
    this.props.form.resetFields()
    let start, end
    let day = moment().format('YYYY-MM-DD ')
    let days = day + ' 23:59:59'
    let o
    switch (tab) {
      case 0:
        start = moment(day).unix() * 1000
        end = moment(days).unix() * 1000
        o = {
          type: 'day',
          'completed[<>]': [Math.ceil(start / 1000), Math.ceil(end / 1000)],
        }
        break
      case 1:
        start = getThisMonthFirstDay()
        end = new Date()
        o = {
          type: 'month',
          'completed[<>]': [Math.ceil(start / 1000), Math.ceil(end / 1000)],
        }
        break
      case 2:
        start = getThisYearFirstDay()
        end = new Date()
        o = {
          type: 'year',
          'completed[<>]': [Math.ceil(start / 1000), Math.ceil(end / 1000)],
        }
        break
      default:
        return
    }
    this.requestData(o)
    this.setState({
      tab,
    })
  }
  requestData = (o) => {
    const { dispatch } = this.props
    this.setState({
      noButtonClick: true,
    }, async () => {
      await dispatch({
        type: "revenueSummary/getProduct",
        payload: { q: { where: { ...o } } },
      })
      await dispatch({
        type: "revenueSummary/getProject",
        payload: { q: { where: { ...o } } },
      })
      await dispatch({
        type: 'revenueSummary/getCollect',
        payload: { q: { where: { ...o } } },
      })
      this.setState({
        noButtonClick: false,
      })
    })
  }
  reset = () => {
    this.props.form.resetFields()
    this.tabButton(0)
  }
  UNSAFE_componentWillMount() {
    this.tabButton(0)
  }
  componentDidMount() {
    const { collectList } = this.props
    this.handerData(collectList)
  }
  //对返回的数据进行处理
  UNSAFE_componentWillReceiveProps(nextProps) {
    const { collectList } = nextProps
    if (collectList !== this.props.collectList) {
      this.handerData(collectList)
    }
  }
  handerData = (collectList) => {
    const o = {
      forceFit: true,
      height: 220,
      width: 220,
      padding: 0,
      // content:(<div></div>),
    }
    const {
      currentData,
      previousData,
      project,
      settlementMethod,
    } = collectList
    var v = [
      {
        lastState: previousData ? previousData.receipts : 0,
        nowState: currentData ? currentData.receipts : 0,
      },
      {
        lastState: previousData ? previousData.clientCarCount : 0,
        nowState: currentData ? currentData.clientCarCount : 0,
      },
      {
        lastState: previousData ? previousData.memberCarCount : 0,
        nowState: currentData ? currentData.memberCarCount : 0,
      },
      {
        lastState: previousData ? previousData.carCount : 0,
        nowState: currentData ? currentData.carCount : 0,
      },
    ]
    const { tabData, dataCir } = this.state
    console.log(dataCir)
    this.setState({
      tabData: tabData
        .map((item, i) => {
          return Object.assign({}, item, v[i])
        }),
      dataCir: dataCir
        .map((item, i) => {
          return {
            ...item,
            ...project[i],
            value: project[i].beReceipts * 1,
            type: project.length !== 0 ? project[i].project + '  ￥' + project[i].receipts : item.type,
          }
        }),
      paydata: settlementMethod
        .map((item, i) => {
          let color
          i <= 5 ? color = paydata[i].color : color = '#8543E0'
          return {
            ...item,
            value: item.bePaymentMoney * 1,
            color,
            type: item.name,
          }
        }),
    }, () => {
      // index=0 // 重置索引初始值
      if (this.dataCir) this.dataCir.innerHTML = ''
      let newDataCir = [...this.state.dataCir].filter(i => i.value !== 0)
      if (newDataCir.length === 0) {
        this.setState({
          noDataCir: true,
        })
      } else {
        this.setState({
          noDataCir: false,
        }, () => {
          PieChart(newDataCir, {
            container: "dataCir",
            ...o,
          })
        })
      }
      if (this.payData) this.payData.innerHTML = ''
      var handerPayData
      if (this.state.paydata.length > 6) {
        var otherPerencnt = 100
        handerPayData = []
        this.state.paydata
          .forEach((item, i) => {
            if (i < 5) { otherPerencnt = (otherPerencnt - item.value * 1) }
            if (i === 5) {
              handerPayData.push(
                {
                  ...item,
                  type: '其他',
                  value: ((otherPerencnt * 100) / 100),
                })
            } else if (i < 5) {
              handerPayData.push(
                item
              )
            }
          })

      } else {
        handerPayData = [...this.state.paydata]
      }
      if (handerPayData.length === 0) {
        this.setState({
          noPayData: true,
        })
      } else {
        this.setState({
          noPayData: false,
        }, () => {
          PieChart(handerPayData, {
            container: "payData",
            ...o,
          })
        })
      }
    })
  }
  async handleSubmit(value) {
    const { dispatch } = this.props
    let o = {}
    o["completed[<>]"] = value.length!==0? value.map(i => filterTime(i)) : [null,null]
    console.log(o)
    await this.setState({
      noButtonClick: true,
    })
    await dispatch({
      type: "revenueSummary/getProduct",
      payload: { q: { where: { ...o } } },
    })
    await dispatch({
      type: "revenueSummary/getProject",
      payload: { q: { where: { ...o } } },
    })
    await dispatch({
      type: "revenueSummary/getCollect",
      payload: { q: { where: { ...o } } },
    })
    this.setState({
      tab: -1,
      noButtonClick: false,
    })
  }
  render() {
    const { tab, dataCir, paydata, tabData, noButtonClick, noDataCir, noPayData } = this.state
    const { getFieldDecorator } = this.props.form
    // const { productList, projectList } = this.props
    return (
      <div className={styles.zl_Revenue_Summary}>
        <div style={{ height: "40px", display: "flex", marginBottom: "50px" }}>
          {tabButton.map((item, i) => (
            <Button
              key={i}
              style={{
                width: "88px",
                height: "40px",
                marginRight: "24px",
                verticalAlign: "middle",
              }}
              onClick={this.tabButton.bind(this, i)}
              type={tab === i ? "primary" : null}
              disabled={noButtonClick}
              loading={noButtonClick}
            >
              {item}
            </Button>
          ))}
          <Form onSubmit={this.handleSubmit} layout="inline">
            <FormItem>
              {getFieldDecorator("created", {})(
                <RangePicker
                  size="large"
                  onChange={this.handleSubmit}
                  style={{ width: "542px", height: "60px" }}
                />
              )}
            </FormItem>
            {/* <FormItem>
              <Button
                style={{ height: "40px", width: "88px" }}
                type="primary"
                htmlType="submit"
                disabled={noButtonClick}
                loading={noButtonClick}
              >
                查询
              </Button>
            </FormItem>
            <FormItem>
              <Button
                style={{ height: "40px", width: "88px" }}
                onClick={this.reset}
                disabled={noButtonClick}
                loading={noButtonClick}
              >
                重置
              </Button>
            </FormItem> */}
          </Form>
        </div>
        <section className={styles.zl_Rs_one}>
          <ul>
            {tabData.map((item, i) => {
              return (
                <li key={i} >
                  <div style={{ overflow: "hidden" }}>
                    <i
                      style={{ float: "left", color: item.color }}
                      className={`iconfont icon-${item.icon} `}
                    />
                    <div className={styles.zl_rs1_box}>
                      <p>{item.content}</p>
                      <p>{item.nowState}</p>
                    </div>
                  </div>
                  {
                    tab < 0 ||
                    <p className={styles.zl_rs1_price}>
                      <span>{lastDate[tab]}</span>
                      {item.content}
                      <span style={{ color: "#66C4FF", marginLeft: "5px" }}>
                        {item.lastState}
                      </span>{" "}
                      {i === 0 ? '元' : '辆'}
                    </p>
                  }
                </li>
              )
            })}
          </ul>
        </section>
        <section className={styles.zl_Rs_two}>
          <div className={styles.zl_Rs_twoL}>
            <p>实收数据</p>
            <div
              style={{
                display: "flex",
                paddingLeft: "0px",
                paddingTop: "70px",
                position: "relative",
              }}
            >
              {noDataCir ? <div className={styles.zl_circleBox}><div className={styles.zl_circleXBox}></div></div> :
                <div id="dataCir" ref={(dataCir) => this.dataCir = dataCir} style={{ width: "50%" }} />
              }
              <table style={{ width: '50%' }}  >
                <thead>
                  <tr>
                    <td style={{ width: "50%" }}>实收项目</td>
                    <td style={{ width: "20%" }}>占比</td>
                    <td style={{ width: "30%" }}>金额</td>
                  </tr>
                </thead>
                <tbody>
                  {dataCir.map((item, idx) => {
                    return (
                      <tr key={idx}>
                        <td style={{ width: "50%" }}>
                          {" "}
                          <span
                            className={styles.zl_Rs_oneCir}
                            style={{ backgroundColor: item.color }}
                          />{" "}
                          {item.project}
                        </td>
                        <td style={{ width: "20%" }}>{item.beReceipts}%</td>
                        <td style={{ width: "30%" }}>￥{item.receipts}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <div className={styles.zl_Rs_twoR}>
            <p>结算方式数据</p>
            <div
              style={{
                display: "flex",
                paddingTop: "70px",
                position: "relative",
              }}
            >
              {noPayData ? <div className={styles.zl_circleBox}><div className={styles.zl_circleXBox}></div></div> :
                <div id="payData" ref={(payData) => this.payData = payData} style={{ width: "50%", height: "220px" }} />
              }
              <div className={styles.zl_Rs_twoRbox} style={{ width: '50%' }} >
                <table>
                  <thead>
                    <tr>
                      <td style={{ width: "28%" }}>结算方式</td>
                      <td style={{ width: "28%" }}>分类</td>
                      <td style={{ width: "16%" }}>占比</td>
                      <td style={{ width: "28%" }}>金额</td>
                    </tr>
                  </thead>
                  <tbody>
                    {paydata.map((item, i) => {
                      return (
                        <tr key={i}>
                          <td style={{ width: "28%" }}>
                            {" "}
                            <span
                              className={styles.zl_Rs_oneCir}
                              style={{ backgroundColor: item.color }}
                            />{" "}
                            {item.name}
                          </td>
                          <td style={{ width: "28%" }}>{item.category}</td>
                          <td style={{ width: "16%" }}>{item.bePaymentMoney}%</td>
                          <td style={{ width: "28%" }}>￥{item.paymentMoney}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
        {/* <section className={styles.zl_Rs_three}>
          <p>业绩分类</p>
          <Tabs defaultActiveKey="1" onChange={this.changTab}>
            <TabPane tab="项目数据" key="1">
              <Table type={1} dataList={projectList} />
            </TabPane>
            <TabPane tab="产品数据" key="2">
              <Table type={2} dataList={productList} />
            </TabPane>
          </Tabs>
        </section> */}
      </div>
    )
  }
}
function mapStateToProps(state) {
  const { projectList, productList, collectList } = state.revenueSummary
  return { productList, projectList, collectList }
}
export default connect(mapStateToProps)(Form.create()(RevenueSummary))
