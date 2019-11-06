import PageLayout from "components/PageLayout/index"
import SearchMember from "../../components/search-member/index"
import SelectCard from "../../components/select-card/index"
import SelectPay from "../../components/select-pay/index"
import ServiceLimitationLayer from 'components/ServiceLimitationLayer'
import CarStaff from './components/car-staff'
import { Button, message, Icon } from "antd"
import { connect } from "dva"
import services from "services"
import moment from "moment"
import styles from "./index.less"
import { Component } from "react"
import React from "react"
import Print from "../../components/print"
import SelectGiveItems from "../../components/select-give-items"
import Introduce from 'components/IntroduceModal'
import tip1 from '../../img/tip1.png'
import tip4 from '../../img/tip4.png'
import xvka_none from '../../img/xvka_none.png'

let searchMemberComponent = {}
let pageLayoutComponent = {}
class ExtendCard extends Component {
  getRef(e) {
    searchMemberComponent = e
  }
  state = {
    active: -1,
    loading: false,
    orderId: 0,
  }

  handleSubmit() {
    const {
      memberId,
      selectPay,
      selectStaff,
      remark,
      selectCar,
      selectCardDetail,
      gives,
      hasAccountPermission,
    } = this.props

    if(!hasAccountPermission) {
      message.error('您没有结账权限，请联系管理人员设置权限!')
      return
    }

    if (selectCardDetail.rechargeMoney * 1 === 0) {
      return message.warn("续卡金额不能为0")
    }

    const _selectStaff = selectStaff.filter((_) => _.checked)

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
      .extendCard({
        data: {
          clientId: memberId,
          vehicles: selectCar.map((_) => _.clientCarId),
          remark,
          card: {
            id: selectCardDetail.extendId,
            renewal: selectCardDetail.rechargeMoney,
            give: selectCardDetail.giveMoney,
            deadline: selectCardDetail.deadlineStatus
              ? moment(selectCardDetail.deadlineTime).unix()
              : -1,
          },
          commission: _selectStaff.map((_) => ({
            staffId: _.staffId,
            scale: _.scale,
          })),
          payments: selectPay.map((_) => ({
            paymentId: _.paymentId,
            paymentMoney: _.paymentMoney || selectCardDetail.rechargeMoney,
          })),
          give: gives
            .filter((_) => _.pId)
            .map((_) => ({
              pId: _.pId,
              pName: _.pName,
              typeTem: _.typeTem,
              numTem: _.numTem,
              balidityPeriod: _.balidityPeriod,
              deadlineTime: _.deadlineStatus ? moment(_.deadlineTime).unix() : -1,
              unitPrice: _.unitPrice,
            })),
        },
      })
      .then((res) => {
        this.setState({ loading: false })
        hide()
        if (res.code === "0") {
          pageLayoutComponent.setCurrent(-1)
          searchMemberComponent.reset()
          this.setState({ orderId: res.data.orderId, showSelectPay: false })
        } else {
          message.error(res.content || "办理失败")
        }
        this.forceUpdate()
      })
      .catch(() => this.setState({ loading: false }))
  }

  render() {
    const {
      dispatch,
      memberId,
      selectCard,
      selectPay,
      remark,
      selectCardDetail,
    } = this.props
    const { Item } = PageLayout

    const head = (
      <div>
        <SearchMember
          getRef={this.getRef}
          onReset={() => {
            dispatch({
              type: "extendcard/reset",
            })
            pageLayoutComponent.setCurrent(-1)
          }}
          onChange={(value) => {
            dispatch({
              type: "extendcard/setMemberId", payload: value,
            })
            pageLayoutComponent.setCurrent(0)
          }}
        />
      </div>
    )

    const content = [
      {
        title: "选择充值卡",
        value: selectCard.cardName || "",
        main: (
          <Item
            title={null}
          >
            <SelectCard
              // 是否是续卡
              isExtend={true}
              selectClient={memberId}
              onChange={(selected) => {
                dispatch({
                  type: "extendcard/setSelectCard",
                  payload: selected,
                })
              }}
              selected={selectCard}
            />
          </Item>
        ),
      },
      {
        title: "车辆/分成",
        value: '',
        main: <CarStaff></CarStaff>,
      },
      {
        title: "赠送",
        value: "",
        main: (
          <Item
            title="选择赠送商品"
            rightTip={
              <Button
                size="large"
                type="primary"
                style={{ marginLeft: 25 }}
                onClick={() => {
                  this.props.dispatch({
                    type: "extendcard/setAllValidity",
                    payload: true,
                  })
                }}
              >
                <i
                  style={{ fontSize: 14, marginRight: 8 }}
                  className="iconfont icon-piliang"
                />
                批量设置有效期
                </Button>
            }
          >
            <SelectGiveItems
              onChange={(selected) => {

                this.props.dispatch({
                  type: "extendcard/setGives",
                  payload: selected,
                })
              }}
              openSetAll={this.props.showAllValidit}
              giveItems={this.props.gives}
              hideSetAllModal={() => {
                this.props.dispatch({
                  type: "extendcard/setAllValidity",
                  payload: false,
                })
              }}
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
                  type: "extendcard/setRemark",
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
          <div className="item">金额</div>
          <div className="price">￥{selectCardDetail.rechargeMoney || 0}</div>
        </div>
        <div
          className="flex center select-pay-left-item"
          onClick={() => {
            pageLayoutComponent.setCurrent(-1)
            this.setState({
              showSelectPay: true,
            })
          }}
        >
          <div className="item" style={{ fontWeight: 'bold', fontSize: '16px' }}>支付方式</div>
          <div className="info">
            {selectPay.length
              ? selectPay.length > 1
                ? "混合支付"
                : selectPay[0].paymentName
              : ""}
          </div>
          <Icon type="right" theme="outlined" />
        </div>
        <Button
          type="primary"
          block
          size="large"
          loading={this.state.loading}
          onClick={this.handleSubmit.bind(this)}
        >
          发布
        </Button>
      </div>
    )

    return (
      <div>
      <ServiceLimitationLayer>
        <PageLayout
          extra={72}
          ref={(e) => (pageLayoutComponent = e)}
          head={head}
          content={content}
          bottom={bottom}
          active={this.state.active}
          customContent={
            this.state.showSelectPay ? (
              <Item title="支付方式">
                <SelectPay
                  onChange={(selected) => {
                    dispatch({
                      type: "extendcard/setSelectPay",
                      payload: selected,
                    })
                  }}
                  totalMoney={selectCardDetail.rechargeMoney}
                  selected={selectPay}
                />
              </Item>
            ): (<div className={styles.none_img}><img src={xvka_none} alt="" /></div>)
          }
        />
        <Print orderId={this.state.orderId} type={7} />
        <Introduce
          title='如何续卡'
          content={
            [
              {
                title: <div>输入 <span style={{ color: '#4AACF7' }}>【客户搜索-手机号/车牌号/姓名】</span>，确定登记办卡客户信息，首次开单客户通过 <span style={{ color: '#4AACF7' }}>【新建会员】</span>录入后再次输入即可</div>,
                content: <img src={tip1} alt="" />,
              },
              {
                title: <div>点击 <span style={{ color: '#4AACF7' }}>【选择充值卡】 </span>选择已办卡进行充值操作，编辑卡项内容，确定即可到下一步</div>,
                content: <img src={tip4} alt="" />,
              },
              {
                title: <div>点击 <span style={{ color: '#4AACF7' }}>【车辆分成】 </span>选择客户绑定车辆（可新建客户绑定车辆），选择提成人员后即可到下一步操作 <span style={{ color: '#FF6F28' }}>注：一张卡可同时绑定多个客户车辆信息</span></div>,
              },
              {
                title: <div>可使用 <span style={{ color: '#4AACF7' }}>【赠送】 </span> 功能，添加相应项目或产品，并设定有效使用时间进行对客户本单赠送服务 </div>,
              },
              {
                title: <div>可使用 <span style={{ color: '#4AACF7' }}>【备注】 </span> 功能，记录本次订单具体相关情况</div>,
              },
              {
                title: <div>选择 <span style={{ color: '#4AACF7' }}>【付款方式】 </span> 功能，选择付款方式后即可完成本次操作</div>,
              },
            ]
          }
        />
        </ServiceLimitationLayer>
      </div>
    )
  }
}

export default connect(({ extendcard, app }) => ({...extendcard, ...app}))(ExtendCard)
