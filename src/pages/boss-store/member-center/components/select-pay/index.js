import { Component } from "react"
import { Spin, InputNumber, Button } from "antd"
import services from "services"
import styles from "./index.less"
import checkedImage from "../images/xuanzhong.png"

// 默认支付方式的图标
import alipay from "../images/alipay.png"
import weixin from "../images/wexinpay.png"
import money from "../images/money.png"
import card from "../images/card.png"
import blend from "../images/blend.png"
/**
 * 获取对应支付方式的图标
 * @param {Number} id 支付方式的唯一标识符
 */
function getImg(id) {
  switch (id) {
    case 74:
      return weixin
    case 73:
      return alipay
    case 8:
      return card
    case 1:
      return money
    case 2:
      return blend
    default:
      return undefined
  }
}

class SelectPay extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      list: [], // 支付方式的列表
      checked: props.selected,
      edit: false,
      edited: false,
      hybrid: [], // 混合支付方式的每个支付方式分别支付的集合
      hybridMoney: 0, // 混合支付总金额
    }
    this.getPayList()
  }
  /**
   * 获取支付方式
   */
  getPayList() {
    services.list({ keys: { name: "store/payment" } }).then((res) => {
      const list = res.list
        .map((_) => ({
          ..._,
          img: getImg(_.paymentId),
        }))
        // 暂时限制
        .filter(
          (_) =>
            _.paymentId !== 7 &&
            _.paymentId !== 1 &&
            _.paymentId !== 2 &&
            _.paymentId !== 3 &&
            _.paymentId !== 4 &&
            _.statusTem === 1
        )
      this.setState({
        list: [...list],
        loading: false,
        hybrid: list.map((_) => ({ ..._, paymentMoney: 0 })),
      })
    })
  }

  /**
   * 选择支付方式
   * @param {Object} item 支付方式
   */
  check(item) {
    /**
     * 选择混合支付时
     * 显示所有支付方式的输入框
     * 输入的值对比付款金额
     */
    let payList = [...this.state.checked]
    if (item.paymentName === "混合支付") {
      this.setState({ edit: !this.state.edit, checked: [], edited: false })
      this.props.onChange && this.props.onChange([])
    } else if (!this.state.edit) {
      const index = this.state.checked.findIndex(
        (_) => _.paymentId === item.paymentId
      )
      if (index > -1) {
        payList.splice(index, 1)
      } else {
        payList.splice(0, 1, item)
      }
      this.setState({
        checked: payList,
        edited: false,
      })
      this.props.onChange && this.props.onChange(payList)
    }
  }

  /**
   * 设置混合支付方式里面的支付方式的值
   */
  setHybridPay(index, value) {
    const hybrid = [...this.state.hybrid]
    hybrid.splice(index, 1, {
      ...hybrid[index],
      paymentMoney: value || 0,
    })
    const hybridMoney = hybrid.reduce((total, _) => _.paymentMoney + total, 0)
    this.setState({
      hybrid,
      hybridMoney,
    })
  }

  render() {
    const remainingPrice = ((this.props.totalMoney * 100 - this.state.hybridMoney * 100) / 100).toFixed(2)
    return (
      <Spin wrapperClassName={styles.wrap} spinning={this.state.loading}>
        <div className="grid">
          {this.state.list.map((_, index) => (
            <div
              className={
                ((this.state.edit || this.state.edited) && _.paymentId === 5) ||
                  this.state.checked.find(
                    (item) => _.paymentId === item.paymentId
                  )
                  ? "pay-item flex center left active"
                  : "pay-item flex center left"
              }
              onClick={() => this.check(_)}
              key={index}
            >
              {this.state.checked.paymentId === _.paymentId && (
                <div className="checked-icon">
                  <img src={checkedImage} alt="" />
                </div>
              )}
              {_.img ? (
                <img className="main-img" src={_.img} alt="" />
              ) : (
                  <div className="pay-icon">{_.paymentName.slice(0, 1)}</div>
                )}
              <div>
                <h2>{_.paymentName}</h2>
                {/* 当为混合方式时，显示input，输入每个支付方式的付款金额 */}
                {this.state.edit && _.paymentId !== 5 && (
                  <InputNumber
                    value={this.state.hybrid[index].paymentMoney}
                    onChange={this.setHybridPay.bind(this, index)}
                    min={0}
                    precision={2}
                  />
                )}
                {/* 混合支付方式下面的相关 */}
                {_.paymentId === 5 &&
                  this.state.edit &&
                  this.state.hybridMoney === Number(this.props.totalMoney) && (
                    <Button
                      type="primary"
                      onClick={(e) => {
                        e.stopPropagation()
                        this.setState({ edited: true, edit: false })
                        this.props.onChange(
                          this.state.hybrid.filter((v) => v.paymentMoney > 0)
                        )
                      }}
                    >
                      确认
                    </Button>
                  )}
                {_.paymentId === 5 &&
                  this.state.edit &&
                  this.state.hybridMoney !== Number(this.props.totalMoney) && (
                    <span className="value">
                      待分配:
                      {remainingPrice}
                      元
                    </span>
                  )}
              </div>
            </div>
          ))}
        </div>
      </Spin>
    )
  }
}

export default SelectPay
