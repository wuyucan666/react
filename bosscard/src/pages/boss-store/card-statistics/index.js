import React, { Component } from "react"
import { connect } from "dva"
import { Form, Row, Col, DatePicker, Tabs } from "antd"
import styles from "./styles.less"
import moment from "moment"
import CardRank from './card-rank'
const { MonthPicker} = DatePicker
const TabPane = Tabs.TabPane
class Settlement extends Component {
  constructor() {
    super()
    this.state = {
      tab: 0,
      end: 0,
      start: 0,
      timeArr: [], // 搜索框里面是否有搜索内容
      noButtonClick: false, //用于控制按钮是否被点击
      current:0,
    }
  }
  UNSAFE_componentWillMount() { }
  componentDidMount() {
    this.changeButton(0, true)
  }
  /**
   * 选择时间
   */
  onChange = (e, time) => {
    this.setState({ timeArr: time })
    let start = moment(time).unix()
    let end = moment().month(moment(time).month()).endOf('month').unix()
    this.setState({
      tab: -1,
      start,
      end,
    })
    this.requestData(start, end)
  }
  /**
   * 默认本月
   */
  changeButton = () => {
    let m = moment().format('YYYY-MM')
    let start, end
    this.setState({ timeArr: [] })
    start = moment(m).unix()
    end = moment().month(moment().month()).endOf('month').unix()
    this.setState({
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
      type: "cardStatistics/getData",
      payload: { startTime: start, stopTime: end },
    })
    this.setState({
      noButtonClick: true,
    })
    setTimeout(() => {
      this.setState({
        noButtonClick: false,
      })
    }, 300)
  }
  goData = () => {
    this.requestData(this.state.start, this.state.end)
  }
  callback(key){
    // console.log('key',key)
    if(key === '1'){
      this.setState({current:0})
    }else if(key === '2'){
      this.setState({current:1})
    }
  }

  render() {
    const { cardSList } = this.props
    const { current } = this.state
    return (
      <div className={styles.settlementWrap}>
        <Tabs defaultActiveKey="1" onChange={this.callback.bind(this)}>
          <TabPane tab="卡统计" key="1">
            {
              <div style={{display:current === 0?'':'none'}}>
                <div style={{height:'60px'}}>
                  <label>
                    <span style={{marginRight:'14px'}}>选择月份</span>
                    <MonthPicker onChange={this.onChange.bind(this)} placeholder={moment().format('YYYY-MM')} allowClear={false} size='large' />
                  </label>
                </div>
                <Row gutter={32}>
                  <Col className="gutter-row" span={8}><div className={styles.headTwo}>办卡/续费收入</div></Col>
                  <Col className="gutter-row" span={8}><div className={styles.headTwo}>卡扣消费支出</div></Col>
                  <Col className="gutter-row" span={8}><div className={styles.headTwo}>当前会员卡余额</div></Col>
                </Row>
                <section className={styles.zl_Rs_twoL}>
                  <Row gutter={32}>
                    <Col className="gutter-row" span={8}>
                      <div className="gutter-box">
                        <table>
                          <tbody>
                            <tr>
                              <td style={{ width: "30%" }}>充值卡办卡</td>
                              <td style={{ width: "70%", color: "#4AACF7FF" }}>{cardSList.transactCard ? cardSList.transactCard.firstRecharge : 0}</td>
                            </tr>
                            <tr>
                              <td style={{ width: "30%" }}>计次卡办卡</td>
                              <td style={{ width: "70%", color: "#4AACF7FF" }}>{cardSList.transactCard ? cardSList.transactCard.firstCounting : 0}</td>
                            </tr>
                            <tr>
                              <td style={{ width: "30%" }}>充值卡续费</td>
                              <td style={{ width: "70%", color: "#4AACF7FF" }}>{cardSList.transactCard ? cardSList.transactCard.recharge : 0}</td>
                            </tr>
                            <tr className={styles.total}>
                              <td style={{ width: "30%" }}>总办卡金额</td>
                              <td style={{ width: "70%" }}>
                                {cardSList.transactCard ? (cardSList.transactCard.firstRecharge*1 +cardSList.transactCard.firstCounting*1 +cardSList.transactCard.recharge*1).toFixed(2) : 0}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </Col>
                    <Col className="gutter-row" span={8}>
                      <div className="gutter-box">
                        <table>
                          <tbody>
                            <tr>
                              <td style={{ width: "30%" }}>充值卡扣金额</td>
                              <td style={{ width: "70%", color: "#4AACF7FF" }}>{cardSList.buckleCard ? cardSList.buckleCard.recharge : 0}</td>
                            </tr>
                            <tr>
                              <td style={{ width: "30%" }}>计次卡卡扣次数</td>
                              <td style={{ width: "70%", color: "#666666FF" }}>{cardSList.buckleCard ? cardSList.buckleCard.counting : 0}</td>
                            </tr>
                            <tr>
                              <td style={{ width: "30%" }}>计次卡扣金额</td>
                              <td style={{ width: "70%", color: "#4AACF7FF" }}>{cardSList.buckleCard ? cardSList.buckleCard.countingMoney : 0}</td>
                            </tr>
                            <tr>
                              <td style={{ width: "30%" }}>赠送卡卡扣次数</td>
                              <td style={{ width: "70%", color: "#666666FF" }}>{cardSList.buckleCard ? cardSList.buckleCard.presenter : 0}</td>
                            </tr>
                            <tr  className={styles.total}>
                              <td style={{ width: "30%" }}>总卡扣金额</td>
                              <td style={{ width: "70%" }}>
                                {cardSList.buckleCard ? (cardSList.buckleCard.countingMoney *1 + cardSList.buckleCard.recharge *1).toFixed(2): 0}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </Col>
                    <Col className="gutter-row" span={8}>
                      <div className="gutter-box">
                        <table>
                          <tbody>
                            <tr>
                              <td style={{ width: "30%" }}>充值卡余额</td>
                              <td style={{ width: "70%", color: "#666666FF" }}>{cardSList.clientCardBalance ? cardSList.clientCardBalance.rechargeMoney : 0}</td>
                            </tr>
                            <tr>
                              <td style={{ width: "30%" }}>计次卡剩余次数</td>
                              <td style={{ width: "70%", color: "#666666FF" }}>{cardSList.clientCardBalance ? cardSList.clientCardBalance.counting : 0}</td>
                            </tr>
                            <tr>
                              <td style={{ width: "30%" }}>计次卡剩余金额</td>
                              <td style={{ width: "70%", color: "#666666FF" }}>{cardSList.clientCardBalance ? cardSList.clientCardBalance.countingMoney : 0}</td>
                            </tr>
                            <tr>
                              <td style={{ width: "30%" }}>赠送卡剩余次数</td>
                              <td style={{ width: "70%", color: "#666666FF" }}>{cardSList.clientCardBalance ? cardSList.clientCardBalance.presenter : 0}</td>
                            </tr>
                            <tr  className={styles.total}>
                              <td style={{ width: "30%" }}>总余额</td>
                              <td style={{ width: "70%" }}>
                                {cardSList.clientCardBalance ? (cardSList.clientCardBalance.rechargeMoney*1 + cardSList.clientCardBalance.countingMoney *1 + cardSList.clientCardBalance.giveMoney *1).toFixed(2) : 0}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </Col>
                  </Row>
                </section>
              </div>
          }
        </TabPane>
        <TabPane tab="卡排行" key="2">
          {
            <div style={{display:current === 1?'':'none'}}>
              <CardRank></CardRank>
            </div>
          }
        </TabPane>
      </Tabs>
      </div>
    )
  }
}
function mapStateToProps(state) {
  const { cardSList } = state.cardStatistics
  return { cardSList }
}
export default connect(mapStateToProps)(Form.create()(Settlement))
