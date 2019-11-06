import React, { Component } from 'react'
import { connect } from "dva"
import { message, InputNumber, Button, Spin } from 'antd'

import services from 'services'

const arrow = require('../images/xuanzhong.png')
const style = require('./index.less')

// 默认支付方式的图标
const alipay = require("../images/alipay.png")
const weixin = require("../images/wexinpay.png")
const money = require("../images/money.png")
const card = require("../images/card.png")
const blend = require("../images/blend.png")

type pageProps = {
  dispatch: any,
  fromOrder: any,
  orderInfo: any,
}
  
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

class payModal extends Component<pageProps> {

  state = {
    loading: false,
    payList: [],
    pendingPay: 0,
    amount: 0,
  }

  async componentWillMount () {
    const { dispatch, fromOrder, orderInfo } = this.props
    
    console.log('----重新获取订单')
    this.setState({loading: true})
    // 获取支付方式
    let paymentList = await this.getPayList()

    // 获取用户充值卡信息
    const { list } = await services.LIST({keys: {name: 'store/clientCardSpecies'}, data: {q: {where: {
        clientId: orderInfo.clientId,
        orderId: orderInfo.orderId,
      }}}
    })

    let cardList = list
    .map((v: any) => ({
      ...v, 
      payType: 2,
      checked: false,
      paymentMoney: 0, //消耗金额
      isMix: false, //混合支付
      balance: (v.rechargeMoney *1000 + v.giveMoney * 1000) / 1000,
    }))
    .filter((e: any) => e.balance > 0)
    .sort((a, b) => (b.balance - a.balance))

    //获取订单信息
    let res: any
    res = await services.EDIT({keys: {name: 'maintain/completeOrder', id: this.props.orderInfo.orderId}})
    if(res.success) {
      this.setState({loading: false})
      const { data } = res
      let payList = cardList.map((v: any) => ({...v, canUse: v.balance > data.amount ? data.amount : v.balance}))
      .concat(paymentList)
      let goodsList = data.project.map((v: any) => ({
        ...v, 
        payList: [...payList.map((v: any) => ({...v}))],
        id: v.projectId,
        name: v.projectName,
        amount: v.itemTotal,
        pendingPay: v.itemTotal,
      }))
      .concat(
        data.product.map((v: any) => ({
          ...v, 
          payList: [...payList.map((v: any) => ({...v}))],
          id: v.productId,
          name: v.productName,
          amount: v.itemTotal,
          pendingPay: v.itemTotal,
        }))
      )
      this.setState({payList, pendingPay: data.amount, amount: data.amount})
      dispatch({ type: 'maintainBilling/setOrder', payload: {
        payList,
        goodsList,
        amount: data.amount,
        pendingPay: data.amount,
        totalAmount: data.totalAmount,
      }})
    }
  }

  async getPayList() {
    let list = []
    await services.list({ keys: { name: "store/payment" } }).then((res: any) => {
      res.list = res.list.filter(_ => _.statusTem === 1)
      list = res.list
      .filter((_) => _.id !== 5 && _.paymentId !== 7 && _.paymentId !== 1 && _.paymentId !== 2 && _.paymentId !== 4)
      .map(({ paymentId, paymentName }) => ({
        paymentId,
        paymentName,
        paymentMoney: 0, //支付金额
        payType: 1,
        isMix: false,
        show: true,
        img: getImg(paymentId),
      }))
    })
    return list
  }

  async cardPay(payment: any) {
    let { dispatch } = this.props
    let { payList, amount} = this.state
    let goMix = false
    payList.map((v: any) => {
      if(v.clientCardId === payment.clientCardId) {
        if(v.balance >= amount) {
          v.checked = !payment.checked
          v.paymentMoney = v.checked ? amount : 0
          this.setState({pendingPay: v.checked ? 0 : amount})
          dispatch({type: 'maintainBilling/setOrder', payload:{ pendingPay: v.checked ? 0 : amount }})
        }else {
          message.warn('该卡余额不足,已自动为您开启混合支付!')
          goMix = true
        }
      }else {
        v.checked = false
        v.paymentMoney = 0
      }
      return v
    })
    this.setState({ payList })
    await dispatch({type: 'maintainBilling/setOrder', payload:{ payList }})
    this.countPendingPay()
    if(goMix) {
      this.goMix(payment, true)
    }
  }

  async paymentPay(payment: any) {
    let { dispatch } = this.props
    let { payList, amount } = this.state
    payList = payList.map((v: any) => {
      if(v.paymentId === payment.paymentId) {
        v.checked = !payment.checked
        v.paymentMoney = v.checked ? amount : 0
        this.setState({pendingPay: v.checked ? 0 : amount})
        dispatch({type: 'maintainBilling/setOrder', payload: { pendingPay: v.checked ? 0 : amount }})
      }else {
        v.checked = false
        v.paymentMoney = 0
      }
      return v
    })
    this.setState({ payList })
    await dispatch({type: 'maintainBilling/setOrder', payload:{ payList }})
    this.countPendingPay()
  }

  goMix = (payment: any, isCard: boolean) => {
    let { dispatch, fromOrder } = this.props
    let { payList } = this.state
    this.setState({pendingPay: fromOrder.amount})
    payList = payList.map((v: any) => {
      if(v.paymentId === 3) { //混合支付不显示欠款
        v.show = payment.isMix
      }
      v = {...v, isMix: !payment.isMix, checked: false, paymentMoney: 0}
      if(isCard && v.clientCardId === payment.clientCardId) { //卡余额不足支付，默认使用所有余额
        v.checked = true
        v.paymentMoney = payment.balance
        this.setState({ pendingPay: (fromOrder.amount*1000 - payment.balance*1000) / 1000})
      }
      return v
    })
    this.setState({payList})
    dispatch({type: 'maintainBilling/setOrder', payload:{ payList, pendingPay: fromOrder.amount }})
  }

  /**单一支付方式 2: 充值卡支付, 1: 支付方式支付*/
  singlePay = (payment: any) => {
    if(payment.isMix && payment.paymentId !== 5) { //混合支付中
      return false
    }
    if(payment.paymentId === 5) { //混合支付
      this.goMix(payment, false)
      return false
    }
    if(payment.payType === 2) {
      this.cardPay(payment)
    }else {
      this.paymentPay(payment)
    }
  }

  countPendingPay = () => {
    const { dispatch, fromOrder: { payList, amount } } = this.props
    let total = 0 
    let received = 0
    let buckle = 0
    payList.filter(_ => _.paymentMoney > 0).forEach(e => {
      if(e.checked) {
        total += e.paymentMoney * 1000
        if(e.payType === 1) {
          if(e.paymentId*1 !== 3) {
            received += e.paymentMoney * 1000
          }
        }else {
          buckle += e.paymentMoney * 1000
        }
      }
    })
    let pendingPay = (amount*1000 - total) / 1000
    received = received/1000
    buckle = buckle/1000
    dispatch({type: 'maintainBilling/setOrder', payload:{ pendingPay, received, buckle }})
  }

  setHybridPay = ((e: any, item: any) => {
    let { payList, amount} = this.state
    payList.map((v: any) => {
      if(v.clientCardId === item.clientCardId && item.payType === 2) {
        v.paymentMoney = e
      }
      if(v.paymentId === item.paymentId && item.payType === 1) {
        v.paymentMoney = e
      }
      if(v.paymentMoney > 0) {
        v.checked = true
      }else {
        v.checked = false
      }
      return v
    })
    let hybridMoney = payList.reduce((total, _) =>  _.paymentMoney * 1000 + total, 0) / 1000
    let pendingPay = (amount*1000 - hybridMoney*1000) / 1000
    this.setState({payList, pendingPay})
  })

  render() {
    const { payList, pendingPay, amount } = this.state
    const { fromOrder } = this.props
    const cardList = payList.length > 0 ? payList.filter(v => v.payType === 2) : []
    const paymentList = payList.length > 0 ? payList.filter(v => v.payType === 1) : []
    return (
      <Spin spinning={this.state.loading}>
        <div>
          <div className={style.total}>此订单共{amount}元您还有<span style={{color: '#FF6F28', fontWeight: 'bold'}}>{fromOrder.pendingPay}</span>元需要选择支付方式</div>
          <div className={style.content}>
            {
              cardList.map((v: any) => {
                return (
                  <div 
                  onClick={() => this.singlePay(v)}
                  key={v.clientCardId} 
                  className={style.card + (v.checked ? " " + style.choose : " ")}
                  >
                    <div>{v.cardName}</div>
                    {
                      v.isMix ? 
                      <InputNumber 
                      min={0}
                      precision={2}
                      max={v.canUse}
                      placeholder='输入金额' 
                      value={v.paymentMoney}
                      style={{marginTop: 10}}
                      onChange={(e) => this.setHybridPay(e, v)}
                      ></InputNumber>
                      :
                      <div className={style.msg}>
                        {
                          v.checked &&
                          <span>-{v.paymentMoney}元， </span>
                        }
                        <span>当前余额{(v.balance*1000 - v.paymentMoney*1000)/1000}元</span>
                      </div>
                    }
                    {
                      v.checked && <img alt="" src={arrow}></img>
                    }
                  </div>
                )
              })
            }
            {
              paymentList.filter((_: any) => _.show).map((v: any) => {
                return (
                  <div 
                  onClick={() => this.singlePay(v)}
                  key={v.paymentId}
                  className={style.payment + (v.checked ? " " + style.choose : " ")} 
                  >
                    <div className={style.left}>
                      {
                        v.img ? 
                        <img src={v.img} alt=""></img>
                        :
                        <div>{v.paymentName.slice(0,1)}</div>
                      }
                    </div>
                    <div className={style.right}>
                      <div className={style.tit}>{v.paymentName}</div>
                      {
                        v.isMix ? 
                          (
                            v.paymentId === 5 
                          ?
                            (
                              pendingPay === 0 ?
                              <Button 
                              type='primary' 
                              style={{width: 96, marginTop: 10}} 
                              onClick={async (e: any) => {
                                e.stopPropagation()
                                let { payList, pendingPay } = this.state
                                payList = payList.map((v: any) => ({...v, isMix: false}))
                                this.setState({payList})
                                await this.props.dispatch({
                                  type: 'maintainBilling/setOrder', 
                                  payload:{ payList, pendingPay}
                                })
                                this.countPendingPay()
                              }}
                              >确定</Button>
                              :
                              <div style={{marginTop: 16, color: '#FF0000'}}>待分配: {pendingPay}</div>
                            )
                          :
                          <InputNumber 
                          min={0}
                          precision={2}
                          placeholder='输入金额' 
                          value={v.paymentMoney}
                          style={{marginTop: 10}}
                          onChange={(e) => this.setHybridPay(e, v)}
                          ></InputNumber>)
                        :
                        v.paymentMoney > 0 &&
                        <div className={style.msg}>已支付{v.paymentMoney}元</div>
                      }
                      
                    </div>
                    {
                      v.checked && <img alt="" src={arrow}></img>
                    }
                  </div>
                )
              })
            }
          </div>
        </div>
      </Spin>
    )
  }
}

const mapStateToProps = (state: any) => {
  return {
    ...state.maintainBilling,
  }
}

export default connect(mapStateToProps)(payModal)