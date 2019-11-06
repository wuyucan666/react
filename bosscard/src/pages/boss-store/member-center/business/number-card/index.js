import PageLayout from "components/PageLayout/index"
import ServiceLimitationLayer from "components/ServiceLimitationLayer"
import SearchMember from "../../components/search-member/index"
import SelectCard from "../../components/select-number-card/index"
import SelectPay from "../../components/select-pay/index"
import SelectStaff from "../../components/select-staff/index"
import SelectCar from "../../components/select-car/index"
import { InputNumber, Button, Icon, message } from "antd"
import services from "services"
import { connect } from "dva"
import styles from "./index.less"
import moment from "moment"
import React, { Component } from "react"
let searchMemberComponent

class Index extends Component {
  constructor(props) {
    super(props)
    this.selectCard = React.createRef()
  }
  getRef(e) {
    searchMemberComponent = e
  }
  state = {
    totalMoney: 0, // 总计金额
    discount: 10, // 折扣
    actualMoney: 0, // 实际金额
    showSelectPay: false,
    active: 0, // 当前选择的模块
    loading: false, // 当前请求状态
  }

  reset() {
    this.props.dispatch({
      type: "numbercard/reset",
    })
    this.setState({
      totalMoney: 0, // 总计金额
      discount: 10, // 折扣
      actualMoney: 0, // 实际金额
      showSelectPay: false,
      active: 0, // 当前选择的模块
    })
  }

  /**
   * 批量设置有效期
   */
  setCardAllValidity() {
    this.props.dispatch({
      type: "numbercard/setCardAllValidity",
      payload: true,
    })
  }

  render() {
    const {
      dispatch,
      memberId,
      selectCard,
      selectPay,
      selectStaff,
      remark,
      selectCar,
      selectCardDetail,
    } = this.props

    const { Item } = PageLayout

    const _selectStaff = selectStaff.filter((_) => _.checked)

    const head = (
      <div>
        <SearchMember
          getRef={(e) => (searchMemberComponent = e)}
          onReset={this.reset.bind(this)}
          onChange={(value) =>
            dispatch({ type: "numbercard/setMemberId", payload: value })
          }
        />
      </div>
    )

    const content = [
      {
        title: "选择套餐",
        value: selectCardDetail.cardName || "",
        main: (
          <Item
            title="选择套餐"
            rightTip={
              !!selectCard && (
                <div>
                  <span
                    className="back-select-tip"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      dispatch({
                        type: "numbercard/setSelectCard",
                        payload: 0,
                      })
                      dispatch({
                        type: "numbercard/setCardDetail",
                        payload: {},
                      })
                    }}
                  >
                    <i className="iconfont icon-fanhui" />
                    重新选择
                  </span>
                  <Button
                    size="large"
                    type="primary"
                    style={{ marginLeft: 25 }}
                    onClick={this.setCardAllValidity.bind(this)}
                  >
                    <i
                      style={{ fontSize: 14, marginRight: 8 }}
                      className="iconfont icon-piliang"
                    />
                    批量设置有效期
                  </Button>
                </div>
              )
            }
          >
            <SelectCard
              onChange={(selected) =>
                dispatch({
                  type: "numbercard/setSelectCard",
                  payload: selected,
                })
              }
              onEdit={(totalMoney) => {
                const discount = parseFloat(this.state.discount).toFixed(1)
                this.setState({
                  actualMoney: (discount * 10 * totalMoney) / 100,
                  totalMoney,
                })
              }}
              selected={selectCard}
            />
          </Item>
        ),
      },
      {
        title: "绑定车辆",
        value: selectCar
          .map((_) => _.plateProvince + _.plateLetter + "·" + _.plateNumber)
          .join(", "),
        main: (
          <Item title="绑定车辆">
            <SelectCar
              id={memberId}
              onChange={(selecteds) =>
                dispatch({
                  type: "numbercard/setSelectCar",
                  payload: selecteds,
                })
              }
              selecteds={selectCar}
            />
          </Item>
        ),
      },
      {
        title: "提成人员",
        value:
          _selectStaff
            .slice(0, 2)
            .reduce(
              (total, _) =>
                total !== "" ? total + ", " + _.staffName : _.staffName,
              ""
            ) + (_selectStaff.length > 2 ? "..." : ""),
        main: (
          <Item title="提成人员">
            <SelectStaff
              onChange={(selected) =>
                dispatch({
                  type: "numbercard/setSelectStaff",
                  payload: selected,
                })
              }
              selected={selectStaff}
            />
          </Item>
        ),
      },
      {
        title: "备注",
        value: remark,
        main: (
          <Item title="备注">
            <textarea
              className={styles.textarea}
              value={remark}
              id=""
              cols="30"
              rows="10"
              onChange={(e) => {
                dispatch({
                  type: "numbercard/setRemark",
                  payload: e.target.value,
                })
              }}
            />
          </Item>
        ),
      },
    ]

    const bottom = (
      <div className={styles.bottom}>
        <div className="flex center">
          <div className="item">套餐售价</div>
          <div className="price">￥{this.state.totalMoney}</div>
        </div>
        <div className="flex center">
          <div className="item">折扣</div>
          <InputNumber
            value={this.state.discount}
            addonAfter="折"
            max={10}
            min={0}
            onChange={(num) => {
              this.setState({
                actualMoney:
                  ((parseFloat(num) || 10) * 10 * this.state.totalMoney) /
                    100 || 0,
                discount: num,
              })
            }}
          />
        </div>
        <div className="flex center">
          <div className="item">实收金额 </div>
          <InputNumber
            value={this.state.actualMoney}
            min={0}
            onChange={(actualMoney) => {
              actualMoney = actualMoney ? actualMoney : 0
              const discount = (actualMoney / this.state.totalMoney) * 10 || 10
              if (parseFloat(actualMoney) > this.state.totalMoney) return false
              this.setState({
                actualMoney,
                discount:
                  actualMoney === 0
                    ? 0
                    : parseFloat(discount > 10 ? 10 : discount).toFixed(1),
              })
            }}
            addonAfter="元"
          />
        </div>
        <div
          className="flex center select-pay-left-item"
          onClick={() => {
            this.refs.PageLayout.setCurrent(-1)
            this.setState({
              showSelectPay: true,
            })
          }}
        >
          <div className="item">支付方式</div>
          <div className="info">
            {selectPay.length
              ? selectPay.length > 1
                ? "混合支付"
                : selectPay[0].paymentName
              : ""}
          </div>
          <Icon type="right" theme="outlined" />
        </div>
        {/*
          提交数据
          判断数据完整性
          提交到后端
         */}
        <Button
          type="primary"
          loading={this.state.loading}
          block
          size="large"
          // 提交数据
          onClick={() => {
            if (!memberId) {
              return message.warn("请先选择客户")
            }
            if (!selectCard) {
              return message.warn("请先选择套餐")
            }
            if (!_selectStaff.length) {
              return message.warn("请先选择提成人员")
            }
            // if (!selectCar.length) {
            //   return message.warn("请先选择使用车辆")
            // }
            if (!selectPay.length) {
              return message.warn("请先选择支付方式")
            }
            this.setState({
              loading: true,
            })
            const data = {
              clientId: memberId,
              statusTem: 1,
              staff: _selectStaff.map((_) => ({
                staffId: _.staffId,
                percentage: _.scale,
              })),
              sellingPrice: this.state.actualMoney,
              totalAmount: this.state.totalMoney,
              limit: selectCar.map((_) => _.clientCarId),
              remark,
              payment: [
                {
                  paymentId: selectPay[0].paymentId,
                  paymentMoney: this.state.actualMoney,
                },
              ],
              cardId: selectCard,
              cardName: selectCardDetail.cardName,
              commodity: selectCardDetail.recordsInfo
                .slice(0, selectCardDetail.recordsInfo.length - 1)
                .map((_) => ({
                  ..._,
                  numTem: _.isInfiniteNum === 1 ? -1 : _.numTem,
                  deadlineTime: _.deadlineStatus
                    ? moment(_.deadlineTime).unix()
                    : -1,
                })),
            }
            const hide = message.loading("办理中...")
            services.createNumberCard({ data }).then((res) => {
              this.setState({ loading: false })
              hide()
              if (res.code === "0") {
                searchMemberComponent.reset()
                message.success("办理成功")
                this.forceUpdate()
              } else {
                message.error(res.content || "办理失败")
              }
            })
          }}
        >
          发布
        </Button>
      </div>
    )
    return (
      <ServiceLimitationLayer>
        <PageLayout
          extra={72}
          ref="PageLayout"
          active={this.state.active}
          head={head}
          content={content}
          bottom={bottom}
          customContent={
            this.state.showSelectPay && (
              <Item title="支付方式">
                <SelectPay
                  onChange={(selected) => {
                    dispatch({
                      type: "numbercard/setSelectPay",
                      payload: selected,
                    })
                  }}
                  totalMoney={this.state.actualMoney}
                  selected={selectPay}
                />
              </Item>
            )
          }
        />
      </ServiceLimitationLayer>
    )
  }
}

export default connect(
  ({
    numbercard: {
      memberId,
      selectCard,
      selectPay,
      selectStaff,
      remark,
      selectCar,
      selectCardDetail,
    },
  }) => ({
    memberId,
    selectCard,
    selectPay,
    selectStaff,
    remark,
    selectCar,
    selectCardDetail,
  })
)(Index)
