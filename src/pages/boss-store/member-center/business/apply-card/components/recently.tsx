import services from 'services';
import React, { Component } from 'react';
import moment = require('moment');
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Spin } from 'antd';
const empty = require("../../../img/no_card.jpg")
const style = require('./recently.less');

/**最近办卡 */
export default connect()(class Recently extends Component<any> {
  state = {
    list: [],
    current: 0, // 当前查询次数
  }
  getRecently() {
    if(this.state.current > 3) {
      return false
    }
    services
      .LIST({
        keys: { name: "orderCard/index" },
        data: { q: { limit: 3, page: 1 } },
      })
      .then((res) => {
        if (res.code === "0") {
          this.setState({ list: res.list }, () => {
            if (this.state.list.find(_ => !_.sellingPrice)) {
              setTimeout(() => {
                this.setState({ current: this.state.current + 1})
                this.getRecently()
              }, 1000)
            }
          })
        }
      })
  }
  componentDidMount() {
    this.getRecently()
  }
  refresh() {
    this.getRecently()
  }
  /**跳转到办卡明细 */
  goList = () => this.props.dispatch(routerRedux.push({ pathname: '/boss-store/member-card' }))
  render() {
    return (
      <div className={style.wrap}>
        <div className="title flex">
          <div className="item">最近办卡</div>
          <div className="link" onClick={this.goList}>查看全部</div>
        </div>
        <div className="content">
        {this.state.list.length === 0  && <div style={{textAlign: 'center'}}><img src={empty} alt="" style={{margin:'0 auto'}}/><br />无最近办卡</div>}
          {this.state.list.map((_) => (
            <div className="card-consume" key={_.created}>
              <div className="head flex center">
                <div
                  className="label flex center"
                  style={{ background: _.cardType !== 1 ? "#FF9900" : "" }}
                >
                  {_.cardType === 1 ? "充值卡" : "计次卡"}
                </div>
                <div>{_.clientCardName}</div>
                <div className="has-line" />
                <div>{_.clientName}</div>
                <div className="has-line" />
                <div>{_.clientPhone}</div>
                <div className="item">
                  {moment.unix(_.created).format("YYYY-MM-DD HH:mm")}
                </div>
              </div>
              <div className="main">
                <div className="cell flex center">
                  <div className="item">售价：￥{_.totalAmount}</div>
                  <div className="item">
                    实收金额：￥{_.sellingPrice || "0.00"}
                  </div>
                  <div className="item">
                    {_.payment.reduce(
                      (total, pay) =>
                        (total !== "" ? total + ", " : total) +
                        pay.paymentName +
                        "：￥" +
                        pay.paymentMoney,
                      ""
                    )}
                  </div>
                </div>
                <div className="cell flex center">
                  <div className="item">业绩：{_.sellingPrice ? '￥' + _.sellingPrice : <span>计算中...</span>}</div>
                  <div className="item">
                    {_.staff.reduce(
                      (total, staff) =>
                        (total !== "" ? total + ", " : total) +
                        staff.staffName +
                        "：" +
                        staff.percentage +
                        "%",
                      ""
                    )}
                  </div>
                  <div className="item">&nbsp;</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }
}
)
