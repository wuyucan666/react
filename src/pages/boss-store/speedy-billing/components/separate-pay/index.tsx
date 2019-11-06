import React, { Component } from 'react'
import { connect } from "dva"
import { message, InputNumber, Button } from 'antd'

const arrow = require('../images/xuanzhong.png')
const style = require('./index.less')

type pageProps = {
  dispatch: any,
  /**单曲拆分支付商品 */
  commodity: any,
  /**订单信息 */
  fromOrder: any,
}
  
class separatePay extends Component<pageProps> {

  state = {
    payList: [],
    pendingPay: 0,
    amount: 0,
  }

  async componentWillMount () {
    const { commodity } = this.props
    this.setState({payList: [...commodity.payList.map(item => ({...item}))], amount: commodity.amount, pendingPay: commodity.pendingPay})
  }
  
  async cardPay(payment: any) {
    let { dispatch, commodity, fromOrder } = this.props
    let { payList, amount} = this.state
    let goMix = false

    let hasUse = 0
    fromOrder.goodsList.forEach(e => {
      e.payList.filter((item: any) => item.paymentMoney > 0).forEach(_ => {
        if(_.clientCardId === payment.clientCardId ) {
          hasUse += _.paymentMoney * 1000
        }
      })
    });
    let canUse = (payment.balance * 1000 - hasUse)/1000 // 当前余额
    console.log(9999, canUse)
    payList.map((v: any) => {
      if(v.clientCardId === payment.clientCardId) {
        v.canUse = canUse
        if(v.canUse >= amount) {
          v.checked = !payment.checked
          v.paymentMoney = v.checked ? amount : 0
          this.setState({pendingPay: v.checked ? 0 : amount})
          commodity = {...commodity, pendingPay: v.checked ? 0 : amount}
          dispatch({type: 'speedyBilling/setGoodsItem', payload:{ commodity }})
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
    commodity = {...commodity, payList: [...payList.map(v => ({...v}))]}
    await dispatch({type: 'speedyBilling/setGoodsItem', payload:{ commodity }})
    this.countPendingPay()
    if(goMix) {
      this.goMix({...payment, canUse}, true)
    }
  }

  async paymentPay(payment: any) {
    let { dispatch, commodity } = this.props
    let { payList, amount } = this.state
    payList = payList.map((v: any) => {
      if(v.paymentId === payment.paymentId) {
        v.checked = !payment.checked
        v.paymentMoney = v.checked ? amount : 0
        this.setState({pendingPay: v.checked ? 0 : amount})
        commodity = {...commodity, pendingPay: v.checked ? 0 : amount}
        dispatch({type: 'speedyBilling/setGoodsItem', payload: { commodity }})
      }else {
        v.checked = false
        v.paymentMoney = 0
      }
      return v
    })
    this.setState({ payList })
    commodity = {...commodity, payList: [...payList.map(v => ({...v}))]}
    await dispatch({type: 'speedyBilling/setGoodsItem', payload:{ commodity }})
    this.countPendingPay()
  }

  goMix = (payment: any, isCard: boolean) => {
    let { dispatch, commodity } = this.props
    let { payList, amount} = this.state
    this.setState({ pendingPay: commodity.amount })
    payList = payList.map((v: any) => ({...v, isMix: !payment.isMix, checked: false, paymentMoney: 0}))
    commodity = {...commodity, payList: [...payList.map(v => ({...v}))], pendingPay: amount}
    dispatch({type: 'speedyBilling/setGoodsItem', payload:{ commodity }})

    if(isCard) {
      payList = payList.map((v: any) =>{
        if(isCard && v.clientCardId === payment.clientCardId && payment.canUse > 0) { //卡余额不足支付，默认使用所有余额
          v.checked = true
          v.paymentMoney = payment.canUse
          this.setState({ pendingPay: (amount*1000 - payment.canUse*1000) / 1000})
        }
        return v
      })
    }
    this.setState({payList})
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
    const { dispatch, fromOrder: { goodsList, amount } } = this.props
    let total = 0 
    let received = 0
    let buckle = 0
    goodsList.forEach((v: any) => {
      v.payList.filter(_ => _.paymentMoney > 0).forEach(e => {
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
    })
    let pendingPay = (amount*1000 - total) / 1000
    received = received/1000
    buckle = buckle/1000
    console.log(111111, pendingPay, total, received)
    dispatch({type: 'speedyBilling/setOrder', payload:{ pendingPay, received, buckle }})
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
    const { commodity, fromOrder } = this.props
    const cardList = payList.length > 0 ? payList.filter(v => v.payType === 2) : []
    const paymentList = payList.length > 0 ? payList.filter(v => v.payType === 1) : []
    return (
      <div>
        <div className={style.total}>
          此{commodity.type === 1  ? '项目' : '产品' }共{amount}元您还有<span style={{color: '#FF6F28', fontWeight: 'bold'}}>{commodity.pendingPay}</span>元需要选择支付方式
        </div>
        <div className={style.content}>
          {
            cardList.map((v: any) => {
              let hasUse = 0
              fromOrder.goodsList.forEach(e => {
                e.payList.filter((item: any) => item.paymentMoney > 0).forEach(_ => {
                  if(_.clientCardId === v.clientCardId ) {
                    hasUse += _.paymentMoney * 1000
                  }
                })
              });
              let canUse = (v.balance * 1000 - hasUse)/1000 // 当前余额
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
                    max={canUse}
                    disabled={canUse*1 === 0}
                    placeholder='输入金额' 
                    value={v.paymentMoney}
                    style={{marginTop: 10}}
                    onChange={(e) => {
                      if(e >= canUse) {
                        message.warn(`最大只能输入${canUse}`)
                        e = canUse
                      }
                      this.setHybridPay(e, v)
                    }}
                    ></InputNumber>
                    :
                    <div className={style.msg}>
                      {
                        v.checked &&
                        <span>-{v.paymentMoney}元， </span>
                      }
                      <span>当前余额{canUse}元</span>
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
            paymentList.map((v: any) => {
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
                              payList = [...payList.map((v: any) => ({...v, isMix: false}))]
                              let commodity = {...this.props.commodity, payList, pendingPay}
                              this.setState({payList})
                              await this.props.dispatch({
                                type: 'speedyBilling/setGoodsItem', 
                                payload:{ commodity },
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
    )
  }
}

const mapStateToProps = (state: any) => {
  return {
    ...state.speedyBilling,
  }
}

export default connect(mapStateToProps)(separatePay)