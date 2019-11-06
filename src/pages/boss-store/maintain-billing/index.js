import React, { Component } from "react"
import ServiceLimitationLayer from "components/ServiceLimitationLayer"
import PageLayout from "components/PageLayout/index"
import SearchMember from "./components/search-member/index"
import AddProject from "./components/add-project/index"
import AddProduct from "./components/add-product/index"
import SelectGiveItems from "../member-center/components/select-give-items/index"
import Car from "./components/check-car/car"
import Check from "./components/check-car/check"
import ReceiveCar from "./components/receive-car"
import Rencently from "./components/recently-order"
import Confirm from "./components/confirm-tc"
import Account from "./components/account"
import PayModal from "./components/pay-content/index"
import SeparatePay from "./components/separate-pay/index"
import BulkChoose from "./components/bulk-choose/index"
import BulkInStorage from "./components/bulk-inStorage/index"
// import CardInfo from "./components/card-info/index"
import Print from "../mimeograph/receipts/billingPay"
import PrintCarInspection from "../mimeograph/receipts/billingCarInspection"
import PrintCityOrder from '../mimeograph/receipts/billingCityOrder'
import Introduce from 'components/IntroduceModal'
import tip1 from './components/images/tip1.png'
import tip2 from './components/images/tip2.png'
import tip3 from './components/images/tip3.png'
import BindCarOwn from 'components/BindCarOwn'
import { __PROJECT_TYPE__, __PRODUCT_TYPE__ } from "utils/globalConfig"
import router from "umi/router"
import moment from "moment"

import { Button, message, Input, Switch, Modal, Popover } from "antd"
import { connect } from "dva"

import service from "services"
import styles from "./style.less"
import collectData from 'utils/collectData'

const { Item } = PageLayout
const { TextArea } = Input

class Index extends Component {
  constructor(props) {
    super(props)
    this.layout = React.createRef()
  }

  state = {
    visible: false, // 结算确认商品
    showTip: false, // 结算完成提示modal
    debt: false, // 是否欠款
    active: -1,
    order: false, // 最近开单
    showPrint: false, // 打印
    allCardGoods: false, // 是否全部卡内
    isZero: false, //是否零元订单
    printData: {}, // 打印数据
    loading: false,
    isShowBottomTabbar: true,//是否显示底部tabbar布局
    showCarCheck: false, //常规车检
    showChecks: false, //36项检查
    showAllValidit: false, //批量设置
    is1440: false, //是否1440屏幕
    showBulkChoose: false, //批量选择人员
    showStorageIn: false, //批量入库
    curType: 0, //当前批量 产品/项目 1项目 2产品
    printType: 0, // 打印类型 0维修 1快捷
    showPrintCarInspection: false,// 车检是否打印
    printCarData: {},// 车检打印数据
    showPrintCityOrder: false,// 36车检是否打印
    printCityOrderData: {},// 车36检打印数据
    showBind: false, // 显示绑定车主弹窗
  }

  async componentDidMount() {
    /**
     * 查看权限
     * 如果是门店预留手机账号，不具有开单等业务的权限
     */
    const loginType = localStorage.getItem('loginType') // 为3是门店
    const staffId = localStorage.getItem('staffId') // 为0是门店预留手机号
    //如果是门店预留手机账号，不具有开单等业务的权限，（即显示图片时）此时把底部tabbar布局隐藏掉
    if (loginType === '3' && staffId === '0') {
      this.setState({ isShowBottomTabbar: false })
    }
    const {
      dispatch,
      isAdding,
      orderInfo,
      isFromOrder,
      productInfo,
      projectInfo,
      isPay,
    } = this.props

    if (isAdding) {
      console.log("用户其他操作")
      //用户其他操作,清除redux数据
      await dispatch({ type: "maintainBilling/resetState" })
      await dispatch({ type: "app/resetState" })
    }

    if (orderInfo.orderId) {
      if (orderInfo.operate) {
        //b单
        this.layout.current.setCurrent(1)
      }
      if (isFromOrder) {  //来自订单列表，默认选中支付方式
        if (isPay) { //结算
          setTimeout(() => {
            this.layout.current.setCurrent(0)
          }, 300)
        } else { // 编辑修改
          if (projectInfo.length > 0) {
            this.layout.current.setCurrent(2)
          }
          if (productInfo.length > 0) {
            this.layout.current.setCurrent(1)
          }
        }
        dispatch({
          type: "maintainBilling/changeStatus",
          payload: { key: "isFromOrder", value: false },
        })
      }
    }

    // 施工人员
    service
      .LIST({
        keys: { name: "store/staff/list" },
        data: {
          q: { page: 1, limit: -1, where: { "business[~]": 4, isJob: 1 } },
        },
      })
      .then((res) => {
        if (res.success) {
          dispatch({
            type: "maintainBilling/setStaffList",
            payload: {
              list: res.list.map((v) => ({
                ...v,
                id: v.staffId,
                name: v.staffName,
              })),
              key: "workStaff",
            },
          })
        }
      })
    // 销售人员
    service
      .LIST({
        keys: { name: "store/staff/list" },
        data: {
          q: { page: 1, limit: -1, where: { "business[~]": 3, isJob: 1 } },
        },
      })
      .then((res) => {
        if (res.success) {
          dispatch({
            type: "maintainBilling/setStaffList",
            payload: {
              list: res.list.map((v) => ({
                ...v,
                id: v.staffId,
                name: v.staffName,
              })),
              key: "saleStaff",
            },
          })
        }
      })

    window.addEventListener('resize', this.handleResize.bind(this)) //监听窗口大小改变
    this.handleResize()
  }
  componentWillUnmount() {
    const { dispatch, isAdding } = this.props
    window.removeEventListener('resize', this.handleResize.bind(this))
    if (!isAdding) {
      dispatch({
        type: "maintainBilling/resetState",
      })
    }
  }

  handleResize = () => {
    const content = document.querySelector(".ant-layout-content")
    if (content) {
      if (content.clientWidth <= 1250) { //1440屏幕下
        this.setState({ is1440: true })
      } else {
        this.setState({ is1440: false })
      }
    }
  }

  // 最近开单
  setOrder = () => {
    this.setState(() => {
      return {
        order: true,
      }
    })
  }
  // 切换tab
  toggleTab = (current) => {
    this.layout.current.setCurrent(current)
  }

  // 点击结算
  account = () => {
    collectData('order')
    const { hasAccountPermission } = this.props
    if(!hasAccountPermission) {
      message.error('您没有结账权限，请联系管理人员设置权限!')
      return
    }
    const { projectInfo, productInfo, parkInfo, orderInfo } = this.props
    if (!orderInfo.carId) {
      message.error("请选择客户车辆")
      return false
    }
    if (!(parkInfo.mileage && parkInfo.counselor)) {
      this.layout.current.setCurrent(0)
      message.error("请输入并保存接车信息")
      return false
    }
    // if (!parkInfo.counselor) {
    //   this.layout.current.setCurrent(0)
    //   message.error("请选择服务顾问")
    //   return false
    // }
    if (projectInfo.length === 0 && productInfo.length === 0) {
      message.error("请先选择项目或者产品再完成结算")
      return false
    }
    if (productInfo.filter((v) => !v.pick).length > 0) {
      this.layout.current.setCurrent(1)
      message.error("有产品尚未领料,请先前往领料")
      return false
    }
    this.setState({ visible: true })
  }

  // 生成订单数据
  async createData(type, callBack) {
    const {
      orderInfo,
      parkInfo,
      checks,
      checkCar,
      projectInfo,
      productInfo,
      giveInfo,
    } = this.props
    if (!orderInfo.carId) {
      message.error("请选择客户车辆")
      return false
    }
    const loading = message.loading("数据处理中..", 0)
    // 数据整合
    let obj = {
      orderInfo: {
        ...orderInfo,
        type, //订单类型  1保存 2挂起 3结算
        from: 1, // 订单来源 1pc  2 小程序
      },
      parkInfo: {
        ...parkInfo,
        baguetteTime: parkInfo.baguetteTime
          ? moment(parkInfo.baguetteTime).unix()
          : undefined,
        carTime: parkInfo.carTime ? moment(parkInfo.carTime).unix() : undefined,
        insurance: parkInfo.insurance
          ? moment(parkInfo.insurance).unix()
          : undefined,
        carInsurance: parkInfo.carInsurance
          ? moment(parkInfo.carInsurance).unix()
          : undefined,
      },
    }
    if (orderInfo.isCheck) {
      obj.checkCar = {
        ...checkCar,
        fileList: checkCar.fileList.map((item) => item.imgId),
        checks,
      }
    } else {
      obj.checkCar = {
        checks,
      }
    }
    obj.projectInfo = projectInfo.map((v) => {
      console.log(v)
      let temp = {
        remark: v.remark,
        priceTem: v.price,
        num: v.num,
        discount: Number(v.discount).toFixed(1),
        itemTotal: v.itemTotal,
        constructors: v.constructors || [],
        salesman: v.salesman || [],
        projectName: v.name,
      }
      if (v.detailId) {
        //卡内
        return {
          ...temp,
          id: v.detailId,
          rangeId: v.soleId,
          packageId: v.cardId,
          projectId: v.id,
          itemTotal: 0.00,
        }
      } else {
        return { ...temp, projectId: v.id, rangeId: 0 }
      }
    })
    obj.productInfo = productInfo.map((v) => {
      let temp = {
        history: v.history, //领料历史
        pick: v.pick,
        remark: v.remark,
        priceTem: v.price,
        num: v.num,
        discount: Number(v.discount).toFixed(1),
        itemTotal: v.itemTotal,
        constructors: v.constructors || [],
        salesman: v.salesman || [],
        productName: v.name,
      }
      if (v.detailId) {
        return {
          ...temp,
          id: v.detailId,
          rangeId: v.soleId,
          packageId: v.cardId,
          productId: v.id,
          itemTotal: 0.00,
        }
      } else {
        return { ...temp, productId: v.id, rangeId: 0 }
      }
    })

    obj.give = giveInfo.slice(0, giveInfo.length - 1).map(v => {
      return {
        pId: v.pId,
        pName: v.pName,
        typeTem: v.typeTem,
        numTem: v.numTem,
        balidityPeriod: v.balidityPeriod,
        unitPrice: v.unitPrice,
        deadlineTime: v.deadlineStatus * 1 === 1 ? moment(v.deadlineTime).unix() : -1,
      }
    }) || []

    // return obj
    if (orderInfo.orderId) {
      // 修改订单
      if (orderInfo.operate) {
        // B单
        delete obj.parkInfo
        delete obj.checkCar
        delete obj.orderInfo.operate
        obj.operate = 3
      }
      this.setState({ loading: true })
      await service
        .UPDATE({
          keys: { name: "maintain/order", id: orderInfo.orderId },
          data: obj,
        })
        .then((res) => {
          loading()
          this.setState({ loading: false })
          if (res.success) {
            callBack && callBack(res)
          }
        })
        .catch(() => {
          loading()
          this.setState({ loading: false })
        })
    } else {
      // 新增订单
      this.setState({ loading: true })
      await service
        .INSERT({ keys: { name: "maintain/order" }, data: obj })
        .then((res) => {
          loading()
          this.setState({ loading: false })
          if (res.success) {
            callBack && callBack(res)
          }
        })
        .catch(() => {
          loading()
          this.setState({ loading: false })
        })
    }
  }

  // // 挂起
  // hangUp = () => {
  //   const callBack = () => {
  //     message.success("挂起成功!")
  //     this.props.history.push("/boss-store/maintain-list/hangUp")
  //   }
  //   this.createData(2, callBack)
  // }

  // 登记保存
  save = () => {
    collectData('order')
    const callBack = () => {
      message.success("保存成功!")
      this.props.history.push("/boss-store/pending-order")
    }
    this.createData(1, callBack)
  }

  // 结算
  onOk = () => {
    const callBack = (res) => {
      const { dispatch, orderInfo } = this.props
      this.layout.current.setCurrent(0)
      const allCardGoods = !!res.data.allCardGoods // 区分是否全部卡内服务
      let isZero = false
      if (!allCardGoods) { //非全部卡内， 判断是否0元订单
        isZero = orderInfo.orderAmount * 1 === 0
      }
      const orderId = res.data.id
      if (!this.props.orderInfo.orderId) {
        dispatch({
          type: "maintainBilling/setOrderInfo",
          payload: { orderId },
        })
      }
      const data = {
        orderId: orderId || this.props.orderInfo.orderId,
        remark: orderInfo.remark,
        payment: [{ payType: 1, paymentId: 74, paymentMoney: 0 }],
        commodity: [],
      }
      if (allCardGoods) {
        // 全部卡内
        const loading = message.loading("全部卡内服务，结算中..", 0)
        service
          .UPDATE({
            keys: {
              name: "maintain/completeOrder",
              id: orderId || this.props.orderInfo.orderId,
            },
            data,
          })
          .then((res) => {
            loading()
            if (res.success) {
              this.setState({
                visible: false,
                showTip: true,
                allCardGoods,
                isZero,
              })
            }
          })
          .catch(() => {
            loading()
          })
      } else {
        if (isZero) {
          // 零元订单
          const loading = message.loading("订单金额为0，结算中..", 0)
          service
            .UPDATE({
              keys: {
                name: "maintain/completeOrder",
                id: orderId || this.props.orderInfo.orderId,
              },
              data,
            })
            .then((res) => {
              loading()
              if (res.success) {
                this.setState({
                  visible: false,
                  showTip: true,
                  allCardGoods,
                  isZero,
                })
              }
            })
            .catch(() => {
              loading()
            })
        } else {
          this.setState({
            visible: false,
            allCardGoods,
            isZero,
          })
          dispatch({
            type: "maintainBilling/changeStatus",
            payload: { key: "isPay", value: true },
          })
        }
      }
    }
    this.setState({ active: 0 })
    this.createData(3, callBack)
  }
  // 生成B单
  saveB = () => {
    const callBack = () => {
      message.success("保存成功!")
      this.props.history.push("/boss-store/maintain-list/blist")
    }
    const { orderInfo } = this.props
    this.createData(orderInfo.type, callBack)
  }

  onCancel = () => {
    this.setState({ visible: false })
  }
  // 车辆搜索
  onSearchChange = (value) => {
    const { vin, engineNo, prevMileage, clientId, carId } = value
    const { dispatch } = this.props
    dispatch({
      type: "maintainBilling/setAccount",
      payload: {
        clientInfo: value,
      },
    })
    dispatch({
      type: "maintainBilling/setParkInfo",
      payload: {
        vin,
        engineNo,
        prevMileage,
      },
    })
    dispatch({
      type: "maintainBilling/setOrderInfo",
      payload: {
        clientId,
        carId,
      },
    })
    dispatch({
      type: "maintainBilling/addGuide",
      payload: {
        clientId,
      },
    })
    dispatch({
      type: "maintainBilling/addPackage",
      payload: {
        clientId,
        carId,
      },
    })
    this.layout.current.setCurrent(0)
  }
  // 返回修改
  goBack = () => {
    const { dispatch } = this.props
    dispatch({
      type: "maintainBilling/modification",
    })
    this.layout.current.setCurrent(-1)
  }
  // 修改订单
  updateOrder = () => {
    const loading = message.loading("数据处理中..", 0)
    service
      .LIST({
        keys: { name: `maintain/order/${this.props.orderInfo.orderId}/edit` },
      })
      .then((res) => {
        loading()
        if (res.success) {
          const { dispatch } = this.props
          const { data } = res
          dispatch({
            type: "maintainBilling/setOrderInfo",
            payload: data.orderInfo,
          })
          dispatch({
            type: "maintainBilling/setAccount",
            payload: {
              clientInfo: data.clientInfo,
            },
          })
          dispatch({
            type: "maintainBilling/setParkInfo",
            payload: {
              ...data.parkInfo,
              baguetteTime: data.parkInfo.baguetteTime
                ? moment(data.parkInfo.baguetteTime * 1000)
                : undefined,
              carTime: data.parkInfo.carTime
                ? moment(data.parkInfo.carTime * 1000)
                : undefined,
              insurance: data.parkInfo.insurance
                ? moment(data.parkInfo.insurance * 1000)
                : undefined,
              carInsurance: data.parkInfo.carInsurance
                ? moment(data.parkInfo.carInsurance * 1000)
                : undefined,
            },
          })
          dispatch({
            type: "maintainBilling/setCheckCar",
            payload: {
              ...data.checkCar,
              fileList: data.checkCar.fileList
                ? data.checkCar.fileList.map((item) => ({
                  uid: item.id,
                  imgId: item.id,
                  url: item.requestAddress,
                }))
                : [],
            },
          })
          dispatch({
            type: "maintainBilling/setChecks",
            payload: data.checkCar.checks || [],
          })
          dispatch({
            type: "maintainBilling/setProjectInfo",
            payload: data.projectInfo.map((item) => {
              if (item.cardType === 2 || item.cardType === 3) {
                //卡内
                console.log("1111111111111卡内", item)
                return {
                  ...item,
                  soleId: item.rangeId,
                  detailId: item.rangeId, //卡内id
                  type: __PROJECT_TYPE__,
                }
              } else {
                return {
                  ...item,
                  soleId: item.id,
                  type: __PROJECT_TYPE__,
                }
              }
            }),
          })
          dispatch({
            type: "maintainBilling/setProductInfo",
            payload: data.productInfo.map((item) => {
              if (item.cardType === 2 || item.cardType === 3) {
                //卡内
                return {
                  ...item,
                  soleId: item.rangeId,
                  detailId: item.rangeId, //卡内id
                  type: __PRODUCT_TYPE__,
                }
              } else {
                return {
                  ...item,
                  soleId: item.id,
                  type: __PRODUCT_TYPE__,
                }
              }
            }),
          })
          let total = {
            key: -1,
            pName: "总计",
            discount: "",
            unitPrice: "",
            numTem: 0,
            balidityPeriod: 0,
          }
          data.give = data.give.map((item, i) => {
            total.numTem = total.numTem + Number(item.numTem)
            total.balidityPeriod =
              total.balidityPeriod + Number(item.balidityPeriod)
            return {
              ...item,
              key: i + 1,
              projectName: item.pName,
              productName: item.pName,
              deadlineTime: moment(item.deadlineTime * 1000),
              deadlineStatus: item.deadlineTime * 1 === -1 ? 0 : 1,
            }
          })
          total.balidityPeriod = total.balidityPeriod.toFixed(2)
          const giveInfo = [...data.give, total]
          dispatch({
            type: "maintainBilling/setGiveInfo",
            payload: giveInfo,
          })
          dispatch({
            type: "maintainBilling/changeStatus",
            payload: { key: "remark", value: "" },
          })
          dispatch({
            type: "maintainBilling/setStaffList",
            payload: { key: "paymentList", list: [] },
          })
          dispatch({
            type: "maintainBilling/changeStatus",
            payload: { key: "isPay", value: false },
          })
          // 清空获取订单信息
          dispatch({
            type: "maintainBilling/setOrder",
            payload: {
              totalAmount: 0,
              isSeparate: false,
              newCardList: [],
              isPackage: false,
            },
          })
          this.layout.current.setCurrent(0)
        }
      })
      .catch(() => {
        loading()
      })
  }

  // 付款
  toPay = () => {
    const {
      fromOrder,
      orderInfo,
    } = this.props
    const { isSeparate, goodsList, payList } = fromOrder
    if (Number(fromOrder.pendingPay) !== 0) {
      message.error(`还有${fromOrder.pendingPay}元未付,请选择支付方式`)
      return false
    }
    const loading = message.loading("数据处理中..", 0)
    let obj = {
      orderId: orderInfo.orderId,
      remark: orderInfo.remark,
      payment: [],
      commodity: [],
    }
    if (isSeparate) {
      //拆分支付逻辑
      obj.commodity = goodsList.map((e) => {
        return {
          type: e.type,
          goodId: e.id,
          maintainServiceId: e.maintainServiceId,
          payment: e.payList
            .filter((_) => _.paymentMoney > 0)
            .map((v) => {
              if (v.payType === 1) {
                v = {
                  payType: 1,
                  paymentId: v.paymentId,
                  paymentMoney: v.paymentMoney,
                }
              } else {
                v = {
                  payType: 2,
                  consumption: v.paymentMoney,
                  clientCardId: v.clientCardId,
                }
              }
              return v
            }),
        }
      })
    } else {
      //整单支付
      obj.payment = payList.filter(v => v.paymentMoney > 0).map(_ => {
        if (_.payType === 2) {
          _ = {
            payType: 2,
            clientCardId: _.clientCardId,
            consumption: _.paymentMoney,
          }
        } else {
          _ = {
            payType: 1,
            paymentId: _.paymentId,
            paymentMoney: _.paymentMoney,
          }
        }
        return _
      })
    }
    if (fromOrder.totalAmount === 0) {
      obj.payment = [{ payType: 1, paymentId: 74, paymentMoney: 0 }]
    }
    console.log("------------", obj)
    this.setState({ loading: true }, () => {
      service
        .UPDATE({
          keys: { name: "maintain/completeOrder", id: orderInfo.orderId },
          data: obj,
        })
        .then((res) => {
          loading()
          this.setState({ loading: false })
          if (res.success) {
            // message.success("付款成功!")
            if (
              obj.payment.findIndex(
                (item) => item.paymentId === 3 && Number(item.paymentMoney) > 0
              ) > -1
            ) {
              this.setState({
                debt: true,
                showTip: true,
              })
            } else {
              this.setState({
                showTip: true,
              })
            }
          }
        })
        .catch(() => {
          loading()
          this.setState({ loading: false })
        })
    })

  }

  bindCar = (values) => {
    const { account, dispatch } = this.props
    const data = {
      ...values,
      plate: account.clientInfo.plate,
    }
    service.INSERT({
      data,
      keys: {name: 'store/client/car/bind'},
    }).then(res => {
      if(res.code === '0') {
        message.success('绑定成功')
        dispatch({
          type: "maintainBilling/setAccount",
          payload: {
            clientInfo: {...res.data, ...res.data.car},
          },
        })
        dispatch({
          type: "maintainBilling/setOrderInfo",
          payload: {
            clientId: res.data.clientId,
            carId: res.data.car.carId,
          },
        })
        this.searchMember.updateClientInfo(res.data)
        this.setState({showBind: false})
      }
    })
  }

  // 侧边栏点击
  menuClick = (current) => {
    // this.setState({ active: current })
    // this.layout.current.setCurrent(current)
    collectData('order')
    const { orderInfo, isPay, parkInfo } = this.props
    if (!orderInfo.carId) {
      message.warning("请先选择车辆")
      return
    }
    if (orderInfo.operate && !isPay) {
      // B单且不处于结账页面
      if (current === 0) {
        message.warning("B单该页面不可编辑")
      } else {
        this.setState({ active: current })
        this.layout.current.setCurrent(current)
      }
    }
    if (!isPay) {
      if (current !== 0) {
        if (!(parkInfo.counselor && parkInfo.mileage)) {
          message.warning("请先填写接车信息")
        } else {
          this.setState({ active: current })
          this.layout.current.setCurrent(current)
          const { account } = this.props
          if(current === 3 && !account.clientInfo.phone) { // 没有绑定手机号
            this.setState({showBind: true})
          }
        }
      } else {
        this.setState({ active: current })
        this.layout.current.setCurrent(current)
      }
    } else {
      this.setState({ active: current })
      this.layout.current.setCurrent(current)
    }
  }

  // 打印
  print = (orderType = 3, orderId) => {
    const { orderInfo } = this.props
    if (orderType === 3) {
      service
        .LIST({
          keys: {
            name: `printing/operation/order/statements/${orderId ? orderId : orderInfo.orderId}`,
          },
        })
        .then((res) => {
          if (res.success) {
            this.setState({
              printData: res.list,
              printType: 0,
              showPrint: true,
              showTip: false,
            })
          }
        })
    } else {
      service
        .LIST({
          keys: {
            name: `printing/operation/order/quick/${orderId ? orderId : orderInfo.orderId}`,
          },
        })
        .then((res) => {
          if (res.success) {
            this.setState({
              printData: res.list,
              printType: 1,
              showPrint: true,
              showTip: false,
            })
          }
        })
    }
  }

  // 打印 车检打印
  onPrintCarInspection = () => {
    const { orderInfo, checkCar, user, account, parkInfo, saleStaff } = this.props
    service.LIST({ keys: { name: 'printing/setting/order' } }).then(res => {
      let staff = {}
      if (parkInfo.counselor) {
        staff = saleStaff.find(_ => _.staffId === parkInfo.counselor)
      }
      let storeData = res.data
      let store = JSON.parse(user.username)
      let data = {
        licensePlate: account.clientInfo.plate,
        vehicleType: account.clientInfo.model,
        counselorName: staff ? staff.staffName : '',
        orderNo: orderInfo.orderId || '',
        createdAt: parkInfo.baguetteTime,
        mileage: parkInfo.mileage,
        clientName: account.clientInfo.clientName,
        isMember: account.clientInfo.clientId ? 1 : 0,
        clientPhone: account.clientInfo.phone,
        carType: account.clientInfo.clientType,
        function: checkCar.feature,
        appearance: checkCar.car,
        items: checkCar.goods,
        store: {
          name: store.storeName,
          hotLine: storeData.hotLine,
          sos_hot_line: storeData.sosHotLine,
          businessDays: storeData.businessDays,
          startOfDay: storeData.startTime,
          endOfDay: storeData.stopTime,
          address: storeData.address,
        },
      }
      this.setState({
        printCarData: data,
        printType: 0,
        showPrintCarInspection: true,
        showTip: false,
      })
    })
  }
  // 打印 36项打印
  onPrintCityOrder = () => {
    const { user, account, checks, parkInfo, saleStaff } = this.props
    service.LIST({ keys: { name: 'printing/setting/order' } }).then(res => {
      let staff = {}
      if (parkInfo.counselor) {
        staff = saleStaff.find(_ => _.staffId === parkInfo.counselor)
      }
      let storeData = res.data
      let store = JSON.parse(user.username)
      let data = {
        licensePlate: account.clientInfo.plate,
        counselorName: staff ? staff.staffName : '',
        security: [...checks],
        store: {
          name: store.storeName,
          hotLine: storeData.hotLine,
          sos_hot_line: storeData.sosHotLine,
          businessDays: storeData.businessDays,
          startOfDay: storeData.startTime,
          endOfDay: storeData.stopTime,
          address: storeData.address,
        },
      }
      this.setState({
        printCityOrderData: data,
        printType: 0,
        showPrintCityOrder: true,
        showTip: false,
      })
    })
  }

  // 结算modal ok
  handleOk = () => {
    const { dispatch } = this.props
    this.setState({ showTip: false })
    this.searchMember.reset()
    dispatch({
      type: 'maintainBilling/modification',
    })
  }

  showCarCheck = (isCheck = false) => {
    collectData('order')
    this.setState((prevState) => {
      return {
        showCarCheck: !prevState.showCarCheck,
      }
    })
    this.props.dispatch({
      type: 'maintainBilling/setOrderInfo',
      payload: {
        isCheck,
      },
    })
  }

  showChecks = () => {
    collectData('order')
    this.setState((prevState) => {
      return {
        showChecks: !prevState.showChecks,
      }
    })
  }

  hiddenBulk = () => {
    this.setState({ showBulkChoose: false })
  }

  bulkOk = (salesman, constructors) => {
    this.setState({ showBulkChoose: false })
    const { dispatch, projectInfo, productInfo } = this.props
    const { curType } = this.state
    if (curType === 1) {
      let info = projectInfo.map(v => {
        return {
          ...v,
          salesman: salesman.length > 0 ? salesman : v.salesman,
          constructors: constructors.length > 0 ? constructors : v.constructors,
        }
      })
      dispatch({
        type: "maintainBilling/setProjectInfo",
        payload: info,
      })
    } else {
      let info = productInfo.map(v => {
        return {
          ...v,
          salesman: salesman.length > 0 ? salesman : v.salesman,
          constructors: constructors.length > 0 ? constructors : v.constructors,
        }
      })
      dispatch({
        type: "maintainBilling/setProductInfo",
        payload: info,
      })
    }
  }

  storageOk = (data, pick) => {
    this.setState({ showStorageIn: false })
    let { productInfo, dispatch } = this.props
    productInfo = productInfo.map(v => {
      let idx = data.findIndex(_ => _.soleId === v.soleId)
      if (idx !== -1) {
        v.stock = v.stock * 1 + data[idx].number * 1
      }
      return v
    })
    console.log('productInfo', productInfo, this.product)
    this.product.updateDate()
    dispatch({
      type: "maintainBilling/setProductInfo",
      payload: productInfo,
    })
    if (pick) {
      console.log('批量入库自动领料')
      let defaultList = data.map(v => {
        v = productInfo.find(_ => _.soleId === v.soleId)
        return v
      })
      this.bulkPick(defaultList)
    }
  }

  // 批量领料
  async bulkPick(defaultList) {
    const { productInfo, orderInfo, dispatch } = this.props
    let orderId = orderInfo.orderId
    if (!orderInfo.orderId) {
      await this.createData(1, (res) => {
        orderId = res.data.id
        dispatch({
          type: "maintainBilling/setOrderInfo",
          payload: { orderId: res.data.id },
        })
      })
    } else {
      await this.createData(1)
    }
    const pickList = defaultList.length > 0 ? defaultList : productInfo.filter(v => !v.pick)
    let obj = {
      status: 2,
      orderId,
      storekeeperId: 0,
      operatorId: localStorage.getItem('staffId'),
      product: pickList.map(v => {
        return {
          id: v.id,
          goodsNum: v.num,
          rangeId: v.soleId,
        }
      }),
    }
    service.INSERT({ keys: { name: 'erp/stock/material/pick' }, data: obj }).then(res => {
      if (res.code === '0') {
        message.success('批量领料成功!')
        let newList = productInfo.map(v => {
          let idx = res.data.findIndex(_ => _.rangeId === v.soleId)
          if (idx !== -1) {
            v.pick = true
            v.pickId = res.data[idx].id
            v.history.push({ id: res.data[idx].id, pick: true })
            v.stock = res.data[idx].goodsNums
          }
          return v
        })
        this.product.updateDate()
        dispatch({
          type: "maintainBilling/setProductInfo",
          payload: newList,
        })
      }
    })
  }

  // 批量退料
  async bulkReturn() {
    const { productInfo, orderInfo, dispatch } = this.props
    let orderId = orderInfo.orderId
    if (!orderInfo.orderId) {
      await this.createData(1, (res) => {
        orderId = res.data.id
        dispatch({
          type: "maintainBilling/setOrderInfo",
          payload: { orderId: res.data.id },
        })
      })
    }
    const pickList = productInfo.filter(v => v.pick)
    let obj = {
      status: 1,
      orderId,
      storekeeperId: 0,
      operatorId: localStorage.getItem('staffId'),
      product: pickList.map(v => {
        return {
          id: v.id,
          goodsNum: v.num,
          rangeId: v.soleId,
          pickId: v.history[v.history.length - 1].id,
        }
      }),
    }
    service.INSERT({ keys: { name: 'erp/stock/material/return' }, data: obj }).then(res => {
      if (res.code === '0') {
        message.success('批量退料成功!')
        let newList = productInfo.map(v => {
          let idx = res.data.findIndex(_ => _.rangeId === v.soleId)
          if (idx !== -1) {
            v.pick = false
            v.pickId = 0
            v.history.push({ id: res.data[idx].id, pick: false })
            v.stock = res.data[idx].goodsNums
          }
          return v
        })
        this.product.updateDate()
        dispatch({
          type: "maintainBilling/setProductInfo",
          payload: newList,
        })
      }
    })
  }

  render() {
    const {
      dispatch,
      projectInfo,
      productInfo,
      giveInfo,
      showPick,
      showReturn,
      parkInfo,
      checkCar,
      checks,
      orderInfo,
      account,
      isPay,
      fromOrder,
      history,
      isAdding,
      workStaff,
      saleStaff,
    } = this.props
    const { showPrint, printData, allCardGoods, isZero, showTip, printType, showCarCheck, showChecks, showPrintCarInspection, printCarData, printCityOrderData, showPrintCityOrder } = this.state
    let isNeedIn = false
    let isNeedSet = false
    const disGoods = !projectInfo
      .concat(productInfo)
      .map((item) => ({
        ...item,
        constructors: item.constructors || [],
        salesman: item.salesman || [],
      }))
      .filter((item) => {
        if (item.type === 2 && item.num > item.stock && !item.pick) {
          isNeedIn = true
        }
        if (item.info * 1 === 2) {
          isNeedSet = true
        }
        if (item.detailId) {
          return !item.constructors.length
        } else {
          return !item.constructors.length || !item.salesman.length
        }
      }).length
    const saveDisabled = !(
      orderInfo.carId &&
      parkInfo.mileage &&
      parkInfo.counselor &&
      (productInfo.length || projectInfo.length)
    )
    const payDisabled = !(
      orderInfo.carId &&
      parkInfo.mileage &&
      parkInfo.counselor &&
      (productInfo.length || projectInfo.length) &&
      disGoods && !isNeedSet && !isNeedIn
    )

    let tips = ""
    if (!disGoods) tips = "请选择销售/施工人员"
    if (productInfo.length === 0 && projectInfo.length === 0)
      tips = "请选择项目/产品"
    if (isNeedSet) tips = '请设置价格'
    if (isNeedIn) tips = '请先入库'
    if (!parkInfo.mileage || !parkInfo.counselor) tips = "请填写接车信息!"
    if (!orderInfo.carId) tips = "请添加车辆!"

    const head = (
      <div>
        <SearchMember
          dispatch={dispatch}
          history={history}
          clientInfo={account.clientInfo}
          isAdding={isAdding}
          isPay={isPay}
          type={orderInfo.type}
          onChange={this.onSearchChange}
          goBack={this.goBack}
          toggleTab={this.toggleTab}
          onRef={(ref) => (this.searchMember = ref)}
        />
      </div>
    )
    let parkInfoMsg = ""
    if (parkInfo.mileage && parkInfo.counselor) {
      parkInfoMsg = "已接车"
    }
    // const carCheck = !!(checkCar.feature.length || checkCar.goods.length || checkCar.car.length || checkCar.fileList.length || checkCar.remark.length)
    const content = [
      {
        title: "接车",
        value: parkInfoMsg ? <span style={{ color: '#4AACF7' }}>{parkInfoMsg}</span> : "请接车",
        main: (
          <Item
            title="接车"
            operation={[
              {
                name: orderInfo.isCheck ? <Button size='large' className={styles.btn + ' ' + styles.active} onClick={() => this.showCarCheck(true)}>常规车检·已检</Button> : <Button size='large' className={styles.btn} onClick={() => this.showCarCheck(false)}>常规车检·未检</Button>,
                handel: () => {

                },
              }, {
                name: (!!checks.length) ? <Button size='large' className={styles.btn + ' ' + styles.active} onClick={this.showChecks}>36项检查·已检</Button> : <Button size='large' className={styles.btn} onClick={this.showChecks}>36项检查·未检</Button>,
                handel: () => {

                },
              },
            ]}
          >
            {/*<CheckCar*/}
            {/*dispatch={dispatch}*/}
            {/*isCheck={orderInfo.isCheck}*/}
            {/*checkCar={checkCar}*/}
            {/*checks={checks}*/}
            {/*parkInfo={parkInfo}*/}
            {/*onOk={this.toggleTab}*/}
            {/*/>*/}
            <ReceiveCar
              dispatch={dispatch}
              value={parkInfo}
              onOk={this.toggleTab}
            />
            <Car
              visible={showCarCheck}
              dispatch={dispatch}
              checkCar={checkCar}
              isCheck={orderInfo.isCheck}
              onOk={() => this.showCarCheck(true)}
              onCancel={() => this.showCarCheck(orderInfo.isCheck)}
              onPrintCarInspection={this.onPrintCarInspection}
            />
            <Check
              visible={showChecks}
              dispatch={dispatch}
              checks={checks}
              onOk={this.showChecks}
              onCancel={this.showChecks}
              onPrintCityOrder={this.onPrintCityOrder}
            />
          </Item>
        ),
      },
      {
        title: "产品",
        value: productInfo.length ? <span style={{ color: '#4AACF7' }}>已选产品 {productInfo.length}</span> : "请选择",
        main: (
          <Item title="添加产品"
            operation={[
              {
                name: <Button type='primary' size='large'>批量选择人员</Button>,
                hidden: productInfo.length === 0,
                handel: () => { this.setState({ showBulkChoose: true, curType: 2 }); collectData('order')},
              },
              {
                name: <Button type='primary' size='large' onClick={() => { this.setState({ showStorageIn: true }); collectData('order')}} disabled={productInfo.filter(v => v.num > v.stock).length === 0}>批量入库</Button>,
                hidden: productInfo.length === 0,
                handel: () => console.log('批量入库'),
              },
              {
                name: <Button type='primary' size='large' onClick={() => { this.bulkPick([]); collectData('order')}} disabled={!productInfo.filter(v => (!v.pick && (v.num < v.stock))).length > 0}>批量领料</Button>,
                hidden: productInfo.length === 0,
                handel: () => console.log('批量领料'),
              },
              {
                name: <Button type='primary' size='large' onClick={() => { this.bulkReturn(); collectData('order')}} disabled={productInfo.filter(v => v.pick).length === 0}>批量退料</Button>,
                hidden: productInfo.length === 0,
                handel: () => console.log('批量退料'),
              },
            ]}
          >
            <AddProduct
              dispatch={dispatch}
              list={productInfo}
              is1440={this.state.is1440}
              showPick={showPick}
              showReturn={showReturn}
              onRef={(ref) => (this.product = ref)}
              createData={this.createData.bind(this)}
              changeInfo={(info) =>
                dispatch({
                  type: "maintainBilling/setProductInfo",
                  payload: info,
                })
              }
            />
          </Item>
        ),
      },
      {
        title: "项目",
        value: projectInfo.length ? <span style={{ color: '#4AACF7' }}>已选项目 {projectInfo.length}</span> : "请选择",
        main: (
          <Item title="添加项目"
            operation={[
              { name: <Button type='primary' size='large'>批量选择人员</Button>, hidden: projectInfo.length === 0, handel: () => { this.setState({ showBulkChoose: true, curType: 1 }); collectData('order')} },
            ]}>
            <AddProject
              list={projectInfo}
              is1440={this.state.is1440}
              onRef={(ref) => (this.project = ref)}
              changeInfo={(info) =>
                dispatch({
                  type: "maintainBilling/setProjectInfo",
                  payload: info,
                })
              }
            />
          </Item>
        ),
      },
      {
        title: "赠送",
        type: 'dark',
        value: (giveInfo.length > 0 ? giveInfo.length - 1 : 0) || "",
        main: (
          <Item
            title="选择赠送商品"
            rightTip={
              <Button
                size="large"
                type="primary"
                style={{ marginLeft: 25 }}
                onClick={() => {
                  this.setState({ showAllValidit: true })
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
                console.log('select', selected)
                dispatch({
                  type: 'maintainBilling/setGiveInfo',
                  payload: selected,
                })
                // const total = selected[selected.length - 1]
                // this.setState({
                //   actualMoney: total.balidityPeriod, // 实际金额
                //   giveLength: total.numTem, // 赠送数量
                // })
              }}
              openSetAll={this.state.showAllValidit}
              giveItems={giveInfo}
              hideSetAllModal={() => {
                this.setState({ showAllValidit: false })
              }}
            />
          </Item>
        ),
      },
      {
        title: "备注",
        type: 'dark',
        value: orderInfo.remark || "",
        main: (
          <Item title="备注">
            <TextArea
              row={4}
              value={orderInfo.remark}
              style={{ marginTop: "30px", height: "112px" }}
              onChange={(e) => {
                dispatch({
                  type: "maintainBilling/setOrderInfo",
                  payload: { remark: e.target.value },
                })
              }}
            />
          </Item>
        ),
      },
      {
        title: "账户信息",
        value: "",
        hidden: true,
        main: (
          <Item title="账户信息">
            <Account account={account} />
          </Item>
        ),
      },
    ]
    const payContent = [
      {
        title: "支付方式",
        node: true,
        value:
          (
            (fromOrder.payList.length > 0 && fromOrder.payList.filter(v => v.paymentMoney > 0).length > 0) ?
              fromOrder.payList.filter(v => v.paymentMoney > 0).map(_ => {
                return (
                  <div>{_.cardName || _.paymentName}支付{_.paymentMoney}元</div>
                )
              })
              :
              "请选择"
          ),
        main: (
          <Item title="支付方式">
            <PayModal></PayModal>
          </Item>
        ),
      },
    ]

    let separateList = []
    // 拆分支付
    if (fromOrder.isSeparate) {
      separateList = fromOrder.goodsList.map((v, i) => {
        return {
          title: v.name,
          node: true,
          value: (
            <div style={{ paddingRight: "10px" }} key={i}>
              {v.payList
                .filter((v) => v.paymentMoney * 1 > 0)
                .map((_) => {
                  return (
                    <div>{_.cardName || _.paymentName}支付{_.paymentMoney}元</div>
                  )
                })}
            </div>
          ),
          main: (
            <Item title="支付方式">
              <SeparatePay key={v.id} commodity={{ ...v }} />
            </Item>
          ),
        }
      })
    }

    const tipContent = (
      <div>
        <div>拆分支付:</div>
        <div>将订单拆分， 每个项目或者产品单独选择支付方式</div>
      </div>
    )

    const customLeft = (
      <div className="flex" style={{ height: 66, lineHeight: "66px" }}>
        <div style={{ flex: 1 }} />
        <div>
          <Popover overlayClassName={styles.ainier_pop} placement="top" content={tipContent}>
            <i className='iconfont icon-wenhao1' style={{ color: '#818181', marginRight: 6, cursor: 'pointer' }}></i>
          </Popover>
          <span style={{ marginRight: "24px", color: "#333" }}>拆分支付</span>
          <Switch
            size="large"
            checked={fromOrder.isSeparate}
            onChange={() => {
              dispatch({
                type: "maintainBilling/setOrder",
                payload: {
                  pendingPay: fromOrder.amount,
                  buckle: 0,
                  received: 0,
                },
              })
              this.layout.current.setCurrent(0)
              dispatch({
                type: "maintainBilling/setOrder",
                payload: { isSeparate: !fromOrder.isSeparate },
              })
            }}
          />
        </div>
      </div>
    )

    const recently = (
      <Item
        title="最近开单"
        operation={
          !!this.state.order && [
            {
              name: <span style={{ color: '#4AACF7', cursor: 'pointer' }}>查看全部</span>,
              handel: () => {
                //之前版本跳已完成
                router.push("/boss-store/maintain-list/orderAll")
              },
            },
          ]
        }
      >
        <Rencently setOrder={this.setOrder} print={this.print} />
      </Item>
    )

    const tabbar = (
      <div className={styles.tabbar + " flex center"}>
        {!this.props.isPay ? (
          <div className={styles.left}>
            <span>
              订单金额: <b>￥{orderInfo.orderAmount.toFixed(2)}</b>
            </span>
            <span>
              卡内抵扣: <b>￥{orderInfo.cardDeduction.toFixed(2)}</b>
            </span>
            <span>
              优惠金额: <b>￥{orderInfo.discountAmount.toFixed(2)}</b>
            </span>
            <span className={styles.total}>
              待支付: <b>￥{orderInfo.peddingPay.toFixed(2)}</b>
            </span>
          </div>
        ) : (
            <div className={styles.left}>
              <span>
                待支付: <b>￥{fromOrder.amount.toFixed(2)}</b>
              </span>
              <span>
                充值卡抵扣: <b>￥{fromOrder.buckle.toFixed(2)}</b>
              </span>
              <span className={styles.total}>
                实付金额: <b>￥{fromOrder.received.toFixed(2)}</b>
              </span>
            </div>
          )}
        {!!orderInfo.operate && (
          <div className={styles.right}>
            {
              <div>
                <Button type="primary" size="large" onClick={this.saveB}>
                  保存
                </Button>
                <Button size="large" onClick={this.print}>
                  打印
                </Button>
              </div>
            }
          </div>
        )}
        {!orderInfo.operate && (
          <div className={styles.right}>
            {this.props.isPay ? (
              <div>
                <Button type="primary" size="large" onClick={this.updateOrder} disabled={this.props.isRepayment}>
                  修改订单
                </Button>
                <Button
                  size="large"
                  className={styles.account}
                  onClick={this.toPay}
                  loading={this.state.loading}
                >
                  {fromOrder.pendingPay > 0 ? "待付" : "付款"}
                  {fromOrder.pendingPay > 0 && (
                    <span style={{ marginLeft: "5px" }}>
                      {fromOrder.pendingPay.toFixed(2)}
                    </span>
                  )}
                </Button>
              </div>
            ) : (
                <div>
                  <span style={{ marginRight: 30, color: "#FF6F28" }}>
                    {tips}
                  </span>
                  <Button
                    type="primary"
                    disabled={saveDisabled}
                    size="large"
                    onClick={this.save}
                  >
                    保存订单
                </Button>
                  <Button
                    size="large"
                    className={payDisabled ? "" : styles.account}
                    disabled={payDisabled}
                    onClick={this.account}
                  >
                    结算
                </Button>
                </div>
              )}
          </div>
        )}
      </div>
    )
    const confirmProps = {
      visible: this.state.visible,
      onOk: this.onOk,
      onCancel: this.onCancel,
      loading: this.state.loading,
    }
    const bulkProps = {
      visible: this.state.showBulkChoose,
      onCancel: this.hiddenBulk,
      onOk: this.bulkOk,
      workStaff: workStaff,
      saleStaff: saleStaff,
    }
    const storageProps = {
      visible: this.state.showStorageIn,
      onOk: this.storageOk,
      onCancel: () => this.setState({ showStorageIn: false }),
      data: productInfo.filter(v => v.num > v.stock),
    }
    return (
      <ServiceLimitationLayer>
        <BindCarOwn 
        visible={this.state.showBind} 
        bindCar={this.bindCar}
        onCancel={() => {
          this.setState({showBind: false})
          this.layout.current.setCurrent(2)
        }}
        ></BindCarOwn>
        <Confirm {...confirmProps} />
        {
          this.state.showBulkChoose &&
          <BulkChoose {...bulkProps}></BulkChoose>
        }
        {
          this.state.showStorageIn &&
          <BulkInStorage {...storageProps}></BulkInStorage>
        }
        <PageLayout
          extra={138}
          ref={this.layout}
          active={this.state.active}
          head={head}
          content={
            this.props.isPay
              ? fromOrder.isSeparate
                ? separateList
                : fromOrder.isPackage
                  ? payContent.slice(1)
                  : payContent
              : content
          }
          tabbar={this.state.isShowBottomTabbar ? tabbar : false}
          customLeft={
            fromOrder.goodsList.length > 0 && !fromOrder.isPackage
              ? customLeft
              : false
          }
          customContent={recently}
          menuClick={this.menuClick}
        />
        <Modal
          title=" "
          width={570}
          visible={showTip}
          maskClosable={false}
          footer={null}
          onCancel={this.handleOk}
        >
          <div className={styles.payModal}>
            <div>
              <i className="iconfont icon-xuanzhong" />
            </div>
            <div>
              {allCardGoods
                ? "全部卡内服务，已直接完成结算！"
                : isZero
                  ? "订单金额为0，已直接完成结算！"
                  : "订单结算完成！"}
            </div>
            <div>
              <Button size="large" onClick={this.handleOk}>
                好的
              </Button>
              <Button size="large" type="primary" onClick={this.print}>
                打印订单
              </Button>
            </div>
          </div>
        </Modal>
        {showPrint && (
          <div className={styles.print}>
            <Print scale={0.5} type={printType} reload={true} data={printData} />
          </div>
        )}
        {showPrintCarInspection && (
          <div className={styles.print}>
            <PrintCarInspection scale={0.5} type={printType} reload={true} data={printCarData} />
          </div>
        )}
        {showPrintCityOrder && (
          <div className={styles.print}>
            <PrintCityOrder scale={0.5} type={printType} reload={true} data={printCityOrderData} />
          </div>
        )}

        <Introduce
          title='如何开单'
          content={
            [
              {
                title: (<div>输入 <span style={{ color: '#4AACF7' }}>【车辆信息-手机号/车牌号/姓名】</span> ，确定登记开单车辆信息，首次开单车辆通过 <span style={{ color: '#4AACF7' }}>【新建车辆】</span> 录入后再次输入即可</div>),
                content: (<img src={tip1} alt='' />),
              },
              {
                title: (<div>登记  <span style={{ color: '#4AACF7' }}>【接车】</span> (必选）信息，确定保存即可到下一步</div>),
                content: (<img src={tip2} alt='' />),
              },
              {
                title: (<div>登记  <span style={{ color: '#4AACF7' }}>【项目】</span>或 <span style={{ color: '#4AACF7' }}>【产品】</span>信息，确定添加 <span style={{ color: '#4AACF7' }}>【卡内项目/产品】</span> 或<span style={{ color: '#4AACF7' }}>【全部项目/产品】</span>选择 <span style={{ color: '#4AACF7' }}>【施工人员】</span>即可到结算订单 <span style={{ color: '#FF6F28' }}>注：快捷开单无需领料</span></div>),
                content: (<img src={tip3} alt='' />),
              },
              {
                title: (<div>可使用 <span style={{ color: '#4AACF7' }}>【赠送】</span>功能，添加相应项目或产品，并设定有效使用时间进行对客户本单赠送服务</div>),
              },
              {
                title: (<div>可使用  <span style={{ color: '#4AACF7' }}>【备注】</span>功能，记录本次订单具体相关情况</div>),
              },
            ]
          }
        />
      </ServiceLimitationLayer>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    ...state.maintainBilling,
    ...state.app,
  }
}

export default connect(mapStateToProps)(Index)
