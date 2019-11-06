import React, { Component } from 'react'
import { message, InputNumber, Button, Spin, Modal } from 'antd'

import services from 'services'

const arrow = require('../../../maintain-billing/components/images/xuanzhong.png')
const style = require('./index.less')

// 默认支付方式的图标
const alipay = require("../../../maintain-billing/components/images/alipay.png")
const weixin = require("../../../maintain-billing/components/images/wexinpay.png")
const money = require("../../../maintain-billing/components/images/money.png")
const card = require("../../../maintain-billing/components/images/card.png")
const blend = require("../../../maintain-billing/components/images/blend.png")

type pageProps = {
  /**订单id */
  orderId: Number,
  /**客户id */
  clientId: Number,
  /**是否显示弹窗 */
  visible: boolean,
  /**隐藏弹窗事件 */
  onCancel: Function,
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

class repayModal extends Component<pageProps> {

  state = {
    loading: false,
    payList: [],
    pendingPay: 0,
    amount: 0,
    saveAmount: 0,
  }

  async componentWillMount () {
    const { orderId, clientId } = this.props
    
    console.log('----重新获取订单')
    this.setState({loading: true})
    // 获取支付方式
    let paymentList = await this.getPayList()

    // 获取用户充值卡信息
    const { list } = await services.LIST({keys: {name: 'store/clientCardSpecies'}, data: {q: {where: {
        clientId: clientId,
        orderId: orderId,
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
    res = await services.EDIT({keys: {name: 'repayment/order', id: orderId}})
    if(res.success) {
      this.setState({loading: false})
      const { data } = res
      let payList = cardList.map((v: any) => ({...v, canUse: v.balance > data.amount ? data.amount : v.balance}))
      .concat(paymentList)
      this.setState({payList, pendingPay: data.amount, amount: data.amount})
    }
  }

  async getPayList() {
    let list = []
    await services.list({ keys: { name: "store/payment" } }).then((res: any) => {
      res.list = res.list.filter(_ => _.statusTem === 1)
      list = res.list
      .filter((_) => _.id !== 5 && _.paymentId !== 7 && _.paymentId !== 1 && _.paymentId !== 2 && _.paymentId !== 4 && _.paymentId !== 3)
      .map(({ paymentId, paymentName }) => ({
        paymentId,
        paymentName,
        paymentMoney: 0, //支付金额
        payType: 1,
        show: true,
        isMix: false,
        img: getImg(paymentId),
      }))
    })
    return list
  }

  cardPay = (payment: any) => {
    let { payList, amount} = this.state
    let goMix = false
    payList.map((v: any) => {
      if(v.clientCardId === payment.clientCardId) {
        if(v.balance >= amount) {
          v.checked = !payment.checked
          v.paymentMoney = v.checked ? amount : 0
          this.setState({pendingPay: v.checked ? 0 : amount})
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
    if(goMix) {
      this.goMix(payment)
    }
  }

  paymentPay = (payment: any) => {
    let { payList, amount } = this.state
    payList = payList.map((v: any) => {
      if(v.paymentId === payment.paymentId) {
        v.checked = !payment.checked
        v.paymentMoney = v.checked ? amount : 0
        this.setState({pendingPay: v.checked ? 0 : amount})
      }else {
        v.checked = false
        v.paymentMoney = 0
      }
      return v
    })
    this.setState({ payList })
  }

  goMix = (payment: any) => {
    let { payList, amount } = this.state
    payList = payList.map((v: any) => {
      if(v.paymentId === 3) { //混合支付不显示欠款
        v.show = payment.isMix
      }
      v = {...v, isMix: !payment.isMix, checked: false, paymentMoney: 0}
      return v
    })
    this.setState({payList, pendingPay: amount})
  }

  /**单一支付方式 2: 充值卡支付, 1: 支付方式支付*/
  singlePay = (payment: any) => {
    if(payment.isMix && payment.paymentId !== 5) { //混合支付中
      return false
    }
    if(payment.paymentId === 5) { //混合支付
      this.goMix(payment)
      return false
    }
    if(payment.payType === 2) {
      this.cardPay(payment)
    }else {
      this.paymentPay(payment)
    }
  }

  onOk = () => {
    const { payList, pendingPay } = this.state
    const { orderId } = this.props
    let payment = payList.filter(v => v.paymentMoney > 0) || []
    if(payment.length === 0) {
      message.warn('请先选择支付方式再确认还款')
      return
    }
    if(pendingPay !== 0) {
      message.warn('请分配完待支付金额')
      return
    }
    let obj = {
      orderId: orderId,
      remark: '',
      payment: [],
      commodity: [],
    }

    obj.payment = payment.map(_ => {
      if(_.payType === 2) { 
        _ = {
          payType: 2,
          clientCardId: _.clientCardId,
          consumption: _.paymentMoney,
        }
      }else {
        _ = {
          payType: 1,
          paymentId: _.paymentId,
          paymentMoney: _.paymentMoney,
        }
      }
      return _
    })
    services
      .UPDATE({
        keys: { name: "repayment/order", id: orderId },
        data: obj,
      })
      .then((res: any) => {
        if(res.success) {
          message.success('还款成功!')
          const { onCancel } = this.props
          onCancel()
        }
      })
  }

  onCancel = () => {
    const { onCancel } = this.props
    onCancel()
  }

  setHybridPay = ((e: any, item: any) => {
    let { payList, amount} = this.state
    payList.map((v: any) => {
      if(v.clientCardId === item.clientCardId && item.payType === 2) {
        v.paymentMoney = e
        if(e > 0) {
          v.checked = true
        }
      }
      if(v.paymentId === item.paymentId && item.payType === 1) {
        v.paymentMoney = e
        if(e > 0) {
          v.checked = true
        }
      }
      return v
    })
    let hybridMoney = payList.reduce((total, _) =>  _.paymentMoney * 1000 + total, 0) / 1000
    let pendingPay = (amount*1000 - hybridMoney*1000) / 1000
    this.setState({payList, pendingPay})
  })

  render() {
    const { payList, pendingPay, amount } = this.state
    const { visible } = this.props
    const cardList = payList.length > 0 ? payList.filter(v => v.payType === 2) : []
    const paymentList = payList.length > 0 ? payList.filter(v => v.payType === 1) : []
    return (
      <Modal visible={visible} title='还款' width={1200} onOk={this.onOk} onCancel={this.onCancel}>
        <Spin spinning={this.state.loading}>
          <div className={style.scroll}>
            <div className={style.total}>此订单共{amount}元您还有<span style={{color: '#FF6F28', fontWeight: 'bold'}}>{pendingPay}</span>元需要选择支付方式</div>
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
                        precision={1}
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
                                onClick={(e: any) => {
                                  e.stopPropagation()
                                  let { payList, pendingPay } = this.state
                                  payList = payList.map((v: any) => ({...v, isMix: false}))
                                  this.setState({payList})
                                }}
                                >确定</Button>
                                :
                                <div style={{marginTop: 16, color: '#FF0000'}}>待分配: {pendingPay}</div>
                              )
                            :
                            <InputNumber 
                            min={0}
                            precision={1}
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
      </Modal>
    )
  }
}



export default repayModal