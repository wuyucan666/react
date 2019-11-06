import { Component } from "react"
import { connect } from "dva"
import { Input, Button, message } from "antd"
import styles from "./styles.less"

class comppayment extends Component {
  state = {
    payList: [], // 支付列表
    hybrid: false, // 混合支付开关
    pendPay: 10, // 待支付
    payTop: 10, // 产品总价格
  }
  componentDidMount() {
    this.props
      .dispatch({ type: "comppayment/getData", payload: {} })
      .then(() => {
        const { paymentList } = this.props
        let arr = paymentList.map((v) => ({
          ...v,
          paymentMoney: "",
          icon:
            v.paymentName === "支付宝"
              ? "iconfont icon-Alipay"
              : v.paymentName === "微信"
              ? "iconfont icon-WeChat"
              : v.paymentName === "银行卡"
              ? "iconfont icon-Bankcard1"
              : v.paymentName === "现金"
              ? "iconfont icon-cash"
              : v.paymentName === "混合支付"
              ? "iconfont icon-Mixedpayment"
              : "iconfont icon-Bankcard1",
        }))
        this.setState({
          payList: [...arr],
        })
        console.log(this.state.payList)
      })
  }
  /**
   * 混合支付提交
   */
  goData() {
    let arr = []
    arr = this.state.payList.filter((_) => _.paymentMoney)
    console.log("支付数组", arr)
  }
  /**
   * 混合支付输入金额，获取input支付金额
   */
  onChange(index, e) {
    let rel = /^[0-9]+\.{0,1}[0-9]{0,2}$/
    if (e.target.value && !rel.exec(e.target.value)) {
      return false
    }
    if (
      e.target.value - this.state.payList[index].paymentMoney >
      this.state.pendPay
    ) {
      return message.error("支付价格不能大于待支付价格！")
    }
    let arr = [...this.state.payList]
    arr[index].paymentMoney = e.target.value
    let g = this.state.payTop - this.paymentMoney(arr)
    this.setState({
      payList: arr,
      pendPay: g,
    })
  }
  /**
   * 混合支付计算待支付
   */
  paymentMoney(arr) {
    return arr.reduce(
      (tol, { paymentMoney }) =>
        paymentMoney
          ? parseFloat(paymentMoney) + parseFloat(tol)
          : parseFloat(tol),
      0
    )
  }
  /**
   * 混合支付阻止冒泡
   */
  clickInput(e) {
    e.stopPropagation()
    e.nativeEvent.stopImmediatePropagation()
  }
  /**
   * 选择支付方式
   */
  getSingle(index) {
    if (this.state.payList[index].paymentName === "混合支付") {
      if (this.state.hybrid) {
        this.setState({
          hybrid: false,
        })
      } else {
        this.setState({
          hybrid: true,
        })
      }
    } else {
      console.log("支付数组", this.state.payList[index])
    }
  }
  render() {
    /**
     * const { payment } = this.props
     * payment [Array] 编辑修改时从父组件传回来的支付数据
     */
    const { payment } = this.props
    return (
      <div className={styles.cardpaywrap}>
        <div className="clearfix">
          {this.state.payList.map((v, index) => {
            return (
              <div
                className={styles.cardpay}
                key={v.paymentName}
                onClick={this.getSingle.bind(this, index)}
              >
                <span className={styles.cardoutlined}>
                  {payment ? (
                    payment.length > 1 ? (
                      this.state.hybrid ? (
                        <i className="iconfont icon-quxiao_" />
                      ) : (
                        <i className="iconfont icon-xuanzhong_" />
                      )
                    ) : payment.length === 1 ? (
                      v.paymentName === payment[0].paymentName ? (
                        <i className="iconfont icon-xuanzhong_" />
                      ) : (
                        ""
                      )
                    ) : (
                      ""
                    )
                  ) : v.paymentName === "混合支付" ? (
                    this.state.hybrid ? (
                      <i className="iconfont icon-quxiao_" />
                    ) : (
                      ""
                    )
                  ) : (
                    ""
                  )}
                </span>
                <div className={styles.bflex}>
                  <div
                    className={
                      v.paymentName === "支付宝"
                        ? styles.zf
                        : v.paymentName === "微信"
                        ? styles.wx
                        : v.paymentName === "混合支付"
                        ? styles.hh
                        : v.paymentName === "现金"
                        ? styles.xj
                        : ""
                    }
                  >
                    <i className={v.icon} />
                  </div>
                </div>
                <div>
                  <div className={styles.paytxt}>
                    <p>{v.paymentName}支付</p>
                    {this.state.hybrid ? (
                      v.paymentName !== "混合支付" ? (
                        <Input
                          className={styles.inputw96}
                          value={v.paymentMoney}
                          onChange={this.onChange.bind(this, index)}
                          onClick={this.clickInput.bind(this)}
                          placeholder="输入金额"
                        />
                      ) : this.state.pendPay ? (
                        <div className={styles.pendPay}>
                          待分配: {this.state.pendPay}元
                        </div>
                      ) : (
                        <Button
                          type="primary"
                          onClick={this.goData.bind(this)}
                          style={{ height: "30px", marginTop: "10px" }}
                        >
                          确定
                        </Button>
                      )
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
}
function mapStateToProps(state) {
  const { editItem, paymentList } = state.comppayment
  console.log("000000000000000000000000", editItem)
  return { editItem, paymentList }
}
export default connect(mapStateToProps)(comppayment)
