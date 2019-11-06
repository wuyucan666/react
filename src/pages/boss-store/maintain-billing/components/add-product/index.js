import React, { Component } from 'react'
import { connect } from "dva"
import router from "umi/router"
import { Form, message } from "antd"

import { __PRODUCT_TYPE__ } from 'utils/globalConfig'
import Drawer from 'components/Drawer'
import List from './list'

import services from 'services'
import empty from '../images/no_product.jpg'
import styles from './style.less'

class addProduct extends Component {

  constructor(props) {
    super(props)
    this.state = {
      show: false,
    }
  }

  state = {
    singelList: [],
  }

  componentWillMount() {
    const { list } = this.props
    // 项目为空时自动打开抽屉
    if (list.length === 0) {
      this.setState({ show: true })
    }
  }

  componentDidMount() {
    const { dispatch, isdone, lastActive, onRef } = this.props
    if (onRef) {
      onRef(this)
    }
    // 添加产品重置数据
    if (isdone && lastActive === 2) {
      this.setState({ show: true })
      dispatch({ type: 'app/changeStatus', payload: { key: 'isdone', value: false } })
    }
  }

  hideModal = () => {
    this.setState({
      show: false,
    })
  }

  showModal = () => {
    this.setState({ show: true })
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
        v = { ...this.props.list[idx] }
      } else {
        let salesman = saleStaff.find(_ => _.staffId === parkInfo.counselor)
        v = {
          ...v,
          num: 1,
          remark: '',
          pick: false,
          history: [],
          type: __PRODUCT_TYPE__,
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
      data: { q: { where: { clientId: orderInfo.clientId, goodId: item.id, goodType: 2, clientCarId: orderInfo.carId } } },
    }).then(res => {
      if (res.success) {
        let newList = this.props.list
        item.cardInfo = res.list
        let cardList = [...res.list].map(v => {
          console.log(v)
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
              cardInfo: res.list,
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

  updateDate = () => {
    this.productRef.getAll()
    this.productRef.getCard()
  }

  setPrice = (item) => {
    this.productRef.getAll()
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
    console.log(6666, value, key, item)
    if (value === undefined) {
      message.error("操作不合理")
      value = 1
    }
    this.props.list.map(v => {
      if (v.soleId === item.soleId) {
        v[key] = value
        if (key === 'num') {
          if (item.detailId) { //卡内数量不能超过剩余次数
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
        if (v.price !== 0 && v.discount > 10) {
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
    if (item.pick) {
      message.error('已领料的产品不可删除!')
      return false
    }
    let arr = this.props.list.filter(v => v.soleId !== item.soleId)
    this.productRef.resetSelected(arr)
    this.props.changeInfo(arr)
  }

  onRef = (ref) => {
    this.productRef = ref
  }

  async singel(item) { //单个
    const { dispatch, productInfo, orderInfo, createData } = this.props
    let msg = { orderId: orderInfo.orderId }
    if (!item.pick) { //领料
      if (!orderInfo.orderId) {
        await createData(1, (res) => {
          msg.orderId = res.data.id
          dispatch({
            type: "maintainBilling/setOrderInfo",
            payload: { orderId: res.data.id },
          })
        })
      } else {
        await createData(1, () => {
          msg.orderId = orderInfo.orderId
        })
      }
      let obj = {
        status: 2,
        orderId: msg.orderId,
        storekeeperId: 0,
        operatorId: localStorage.getItem('staffId'),
        product: [{ id: item.id, goodsNum: item.num, rangeId: item.soleId }],
      }
      services.INSERT({ keys: { name: 'erp/stock/material/pick' }, data: obj }).then(res => {
        if (res.code === '0') {
          message.success('领料成功!')
          productInfo.map(v => {
            if (v.soleId === item.soleId) {
              v.pick = true
              v.pickId = res.data[0].id
              v.history.push({ id: res.data[0].id, pick: true })
              v.stock = res.data[0].goodsNums
            }
            return v
          })
          this.updateDate()
          dispatch({
            type: "maintainBilling/setProductInfo",
            payload: productInfo,
          })
        }
      })
    } else {
      let obj = {
        status: 1,
        orderId: msg.orderId,
        storekeeperId: 0,
        operatorId: localStorage.getItem('staffId'),
        product: [{
          goodsNum: item.num,
          rangeId: item.soleId,
          id: item.id,
          pickId: item.history[item.history.length - 1].id,
        }],
      }
      services.INSERT({ keys: { name: 'erp/stock/material/return' }, data: obj }).then(res => {
        if (res.code === '0') {
          message.success('退料成功!')
          productInfo.map(v => {
            if (v.soleId === item.soleId) {
              v.pick = false
              v.pickId = 0
              v.history.push({ id: res.data[0].id, pick: false })
              v.stock = res.data[0].goodsNums
            }
            return v
          })
          this.updateDate()
          dispatch({
            type: "maintainBilling/setProductInfo",
            payload: productInfo,
          })
        }
      })
    }
  }

  cancel = (type) => {
    const { dispatch } = this.props
    const form = this.props.form
    form.resetFields()
    if (type === 1) {
      dispatch({ type: 'maintainBilling/changeStatus', payload: { key: 'showPick', value: false } })
    } else {
      dispatch({ type: 'maintainBilling/changeStatus', payload: { key: 'showReturn', value: false } })
    }
  }

  //添加急件
  toImport = () => {
    const { dispatch } = this.props
    dispatch({
      type: "app/changeStatus",
      payload: { key: "isAdding", value: true },
    })
    dispatch({
      type: "app/changeStatus",
      payload: { key: "backRoute", value: '/boss-store/maintain-billing' },
    })
    setTimeout(() => {
      router.push({ pathname: "/boss-store/purchase" })
    }, 300)
    dispatch({
      type: "app/changeStatus",
      payload: { key: "lastActive", value: 2 },
    })
  }

  render() {
    let drawerProps = {
      type: __PRODUCT_TYPE__,
      visible: this.state.show,
      selected: this.props.list,
      onOk: this.onOk,
      onRef: this.onRef,
      outsideType: true,
    }
    const { list, workStaff, saleStaff, orderInfo, parkInfo } = this.props
    return (
      <div>
        <Drawer
          {...drawerProps}
        ></Drawer>
        {
          list.length > 0 ?
            <div className={styles.project}>
              <List
                goodsList={this.props.list || []}
                is1440={this.props.is1440}
                onChange={this.onChange}
                deleteHandel={this.deleteHandel}
                setPrice={this.setPrice}
                workStaff={workStaff}
                saleStaff={saleStaff}
                orderInfo={orderInfo}
                toImport={this.toImport}
                updateDate={this.updateDate}
                parkInfo={parkInfo}
                singel={this.singel.bind(this)}
              ></List>
            </div>
            :
            <div className="ainier_empty animated bounceIn">
              <img src={empty} alt="" style={{ margin: '0 auto' }} />
              <p style={{ fontSize: '14px', color: '#333', textAlign: 'center' }}>您暂未添加任何产品</p>
            </div>
        }
      </div>
    )
  }
}

export default connect(
  ({ maintainBilling: { workStaff, saleStaff, productInfo, orderInfo, parkInfo, checks, checkCar, projectInfo }, app: { lastActive, isdone } }) => ({
    workStaff,
    saleStaff,
    productInfo,
    orderInfo,
    parkInfo,
    checks,
    checkCar,
    projectInfo,
    isdone,
    lastActive,
  })
)(Form.create()(addProduct))
