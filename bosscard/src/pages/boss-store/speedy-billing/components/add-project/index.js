import React, { Component } from 'react'
import { connect } from "dva"
import { message, Spin } from "antd"

import services from 'services'
import { __PROJECT_TYPE__ } from 'utils/globalConfig'
import Drawer from 'components/Drawer'

import List from './list'

import empty from '../images/no_project.jpg'
import styles from './style.less'

class addProject extends Component {

  constructor(props) {
    super(props)
    this.state = {
      show: false,
      loading: false,
    }
  }

  hideModal = () => {
    this.setState({
      show: false,
    })
  }

  componentWillMount() {
    const { list } = this.props
    // 项目为空时自动打开抽屉
    if (list.length === 0) {
      this.setState({ show: true })
    }
  }

  componentDidMount() {
    const { isdone, dispatch, lastActive, onRef } = this.props
    if (onRef) {
      onRef(this)
    }
    // 添加项目重置数据
    if (isdone && lastActive === 1) {
      this.setState({ show: true })
      dispatch({ type: 'app/changeStatus', payload: { key: 'isdone', value: false } })
    }
  }

  changeHandel = () => {
    this.props.changeInfo(this.props.list)
  }

  onOk = (e) => {
    const { saleStaff, parkInfo } = this.props
    let isNeed = false
    let curItem = {}
    e = e.map(v => {
      let idx = this.props.list.findIndex(_ => _.soleId === v.soleId)
      if (idx !== -1 && this.props.list[idx].num) {
        v = this.props.list[idx]
      } else {
        let salesman = saleStaff.find(_ => _.staffId === parkInfo.counselor)
        v = {
          ...v,
          num: 1,
          remark: '',
          type: __PROJECT_TYPE__,
          discount: (10).toFixed(1),
          originDiscount: (10).toFixed(1), //原始折扣
          originPrice: v.price, //原始价格
          itemTotal: (1 * v.price).toFixed(2),
          orderRemark: v.orderRemark,
          cardInfo: [],
          salesman: salesman ? [{ id: salesman.staffId, name: salesman.staffName, scale: 100 }] : [],
          constructors: this.props.list.length > 0 ? this.props.list[0].constructors : undefined,
        }
        if (!v.detailId) { //非卡内 获取商品充值卡折扣信息
          isNeed = true
          curItem = v
        }
      }
      return v
    })
    if (isNeed) {
      this.getCard(curItem, e)
    }
    this.props.changeInfo(e)
  }

  async getCard(item, list) {
    console.log('获取商品充值卡折扣信息', item, list)
    const { orderInfo } = this.props
    await services.LIST({
      keys: { name: 'maintain/shopCardSpecies' },
      data: { q: { where: { clientId: orderInfo.clientId, goodId: item.id, goodType: 1, clientCarId: orderInfo.carId } } },
    }).then(res => {
      this.setState({ loading: false })
      let newList = this.props.list
      if (res.success) {
        item.cardInfo = res.list
        let cardList = [...res.list].map(v => {
          if (v.discountType === 2) {
            v.itemTotal = v.discount
          } else {
            v.itemTotal = (v.discount / 10 * item.price).toFixed(2)
          }
          return v
        })
        let best = cardList.sort((a, b) => a.itemTotal - b.itemTotal)[0]
        newList = newList.map(_ => {
          if (_.soleId === item.soleId) {
            const getBestDiscount = (_best) => {
              const price = parseFloat(item.price)
              return price === 0 ? 10 : (_best.itemTotal * 10 / price).toFixed(1)
            }
            _ = {
              ...item,
              cardInfo: cardList,
              useCard: best,
              discount: best ? getBestDiscount(best) : item.discount,
              itemTotal: best ? (best.itemTotal * item.num).toFixed(2) : item.itemTotal,
              originDiscount: best ? getBestDiscount(best) : item.discount,
            }
          }
          return _
        })
        this.props.changeInfo(newList)
      }
    })
  }

  setPrice = (item) => {
    this.projectRef.getAll()
    let newList = this.props.list.map(v => {
      if (v.soleId === item.soleId) {
        let cardList = item.cardInfo.map(v => {
          if (v.discountType === 2) {
            v.itemTotal = v.discount
          } else {
            v.itemTotal = (v.discount / 10 * item.price).toFixed(2)
          }
          return v
        })
        let best = cardList.sort((a, b) => a.itemTotal - b.itemTotal)[0]
        const getBestDiscount = (_best) => {
          const price = parseFloat(item.price)
          return price === 0 ? 10 : (_best.itemTotal * 10 / price).toFixed(1)
        }
        v = {
          ...item,
          cardInfo: cardList,
          useCard: best,
          discount: best ? getBestDiscount(best) : item.discount,
          itemTotal: best ? (best.itemTotal * item.num).toFixed(2) : item.itemTotal,
          originDiscount: best ? getBestDiscount(best) : item.discount,
        }
      }
      return v
    })
    this.props.changeInfo(newList)
  }

  onChange = (value, item, key) => {
    if (value === undefined) {
      message.error("操作不合理")
      value = 1
    }
    this.props.list.map(v => {
      if (v.soleId === item.soleId) {
        v[key] = value
        if (key === 'num') {
          if (item.detailId) { //卡s内数量不能超过剩余次数
            if (value > item.number && item.number !== -1) {
              v[key] = item.number
              message.error('数量不能超出剩余数量')
            }
          }
        }
        if (key === 'itemTotal') {
          if (v.price * 1 !== 0) {
            v.discount = (v.itemTotal * 10 / (v.price * v.num)).toFixed(1)
          }
        }
        if (key === 'discount' || key === 'num' || key === 'price') {
          v.itemTotal = (v.price * v.discount / 10 * v.num).toFixed(2)
        }
        if (v.discount > 10) {
          v.discount = (10).toFixed(1)
          v.itemTotal = (v.price * v.discount / 10 * v.num).toFixed(2)
          message.error('注意当前折扣已超过10!')
        }
      }
      return v
    })
    this.changeHandel()
  }

  deleteHandel = (item) => {
    let arr = this.props.list.filter(v => v.soleId !== item.soleId)
    this.projectRef.resetSelected(arr)
    this.props.changeInfo(arr)
  }

  onRef = (ref) => {
    this.projectRef = ref
  }

  render() {
    let drawerProps = {
      type: __PROJECT_TYPE__,
      visible: this.state.show,
      selected: this.props.list,
      onOk: this.onOk,
      onRef: this.onRef,
      zeroDisable: true,
    }
    const { list, workStaff, saleStaff } = this.props
    return (
      <div>
        <Drawer
          {...drawerProps}
        ></Drawer>
        {
          list.length > 0 ?
            <div className={styles.project}>
              <Spin spinning={this.state.loading}>
                <List
                  goodsList={this.props.list}
                  is1440={this.props.is1440}
                  onChange={this.onChange}
                  setPrice={this.setPrice}
                  deleteHandel={this.deleteHandel}
                  workStaff={workStaff}
                  saleStaff={saleStaff}
                ></List>
              </Spin>
            </div>
            :
            <div className={"ainier_empty animated bounceIn"}>
              <img src={empty} alt="" />
              <p style={{ fontSize: '14px', color: '#333' }}>您暂未添加任何项目</p>
            </div>
        }
      </div>
    )
  }
}

export default connect(
  ({ speedyBilling: { workStaff, saleStaff, orderInfo, parkInfo }, app: { lastActive, isdone } }) => ({
    workStaff,
    orderInfo,
    saleStaff,
    isdone,
    lastActive,
    parkInfo,
  })
)(addProject)
