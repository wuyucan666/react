import PageLayout from "components/PageLayout/index"
import ServiceLimitationLayer from "components/ServiceLimitationLayer"
import SearchMember from "../../components/search-member/index"
import SelectCard from "../../components/select-card/index"
import SelectPay from "../../components/select-pay/index"
import SelectStaff from "../../components/select-staff/index"
import SelectCar from "../../components/select-car/index"
import { Button, message } from "antd"
import { connect } from "dva"
import services from "services"
import styles from "./index.less"
import moment from "moment"
import { Component } from "react"
import React from "react";
let searchMemberComponent = {}
let pageLayoutComponent = {}
class Index extends Component {
  getRef(e) {
    searchMemberComponent = e
  }
  state = {
    active: -1,
    loading: false,
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
          getRef={this.getRef}
          onReset={() =>
            dispatch({
              type: "upcard/reset",
            })
          }
          onChange={(value) =>
            dispatch({ type: "upcard/setMemberId", payload: value })
          }
        />
      </div>
    )

    const content = [
      {
        title: "选择充值卡",
        value: selectCard.cardName || "",
        main: (
          <Item title="选择充值卡">
            <SelectCard
              onChange={(selected) => {
                dispatch({ type: "upcard/setSelectCard", payload: selected })
                dispatch({ type: "upcard/setCardDetail", payload: {} })
              }}
              selected={selectCard}
            />
          </Item>
        ),
      },
      {
        title: "支付方式",
        value: selectPay.length
          ? selectPay.length > 1
            ? "混合支付"
            : selectPay[0].paymentName
          : "",
        main: (
          <Item title="支付方式">
            <SelectPay
              onChange={(selected) =>
                dispatch({ type: "upcard/setSelectPay", payload: selected })
              }
              selected={selectPay}
              totalMoney={selectCardDetail.rechargeMoney || 0}
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
                dispatch({ type: "upcard/setSelectCar", payload: selecteds })
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
                dispatch({ type: "upcard/setSelectStaff", payload: selected })
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
                  type: "upcard/setRemark",
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
          <div className="item">充值卡售价</div>
          <div className="price">￥{selectCardDetail.rechargeMoney || 0}</div>
        </div>
        <Button
          type="primary"
          block
          loading={this.state.loading}
          size="large"
          onClick={() => {
            if (!memberId) {
              return message.warn("请先选择客户")
            }
            if (!selectCardDetail.speciesId) {
              return message.warn("请先选择充值卡")
            }
            if (!_selectStaff.length) {
              return message.warn("请先选择提成人员")
            }
            if (!selectPay.length) {
              return message.warn("请先选择支付方式")
            }
            this.setState({ loading: true })
            const hide = message.loading("办理中...")
            services
              .recharge({
                data: {
                  clientId: memberId,
                  cardName: selectCardDetail.cardName,
                  staff: _selectStaff.map((_) => ({
                    staffId: _.staffId,
                    percentage: _.scale,
                  })),
                  statusTem: 1,
                  cardId: selectCardDetail.speciesId,
                  sellingPrice: selectCardDetail.rechargeMoney,
                  totalAmount: selectCardDetail.rechargeMoney,
                  remark,
                  payment: [
                    {
                      paymentId: selectPay[0].paymentId,
                      paymentMoney: selectCardDetail.rechargeMoney,
                    },
                  ],
                  limit: selectCar.map((_) => _.clientCarId),
                  deadlineTime: selectCardDetail.deadlineStatus
                    ? moment(selectCardDetail.deadlineTime).unix()
                    : -1,
                  rechargeMoney: selectCardDetail.rechargeMoney,
                  giveMoney: selectCardDetail.giveMoney,
                },
              })
              .then((res) => {
                this.setState({ loading: false })
                hide()
                if (res.code === "0") {
                  pageLayoutComponent.setCurrent(-1)
                  searchMemberComponent.reset()
                  message.success("办理成功")
                } else {
                  message.error(res.content || "办理失败")
                }
                this.forceUpdate()
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
          ref={(e) => (pageLayoutComponent = e)}
          head={head}
          content={content}
          bottom={bottom}
          active={this.state.active}
        />
      </ServiceLimitationLayer>
    )
  }
}

export default connect(
  ({
    upcard: {
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
