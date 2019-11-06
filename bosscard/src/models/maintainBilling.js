import { model } from "utils/model"
import modelExtend from "dva-model-extend"
import cloneDeep from "lodash/cloneDeep"
import moment from 'moment'
import services from "services"
import listTurnTree from "utils/listTurnTree"

const defaultData = {
  isPay: false, //是否处于结账页面
  isFromOrder: false, //是否来自订单列表
  isRepayment: false, //是否还款订单
  showPick: false,
  showReturn: false,
  account: {
    // 账户信息
    clientInfo: {},
    consume: {}, // 消费数据
    record: [], // 消费记录
    package: [], //卡内项目/产品
    coupon: [], // 优惠券
    presentation: [], // 赠送
  },
  orderInfo: {
    //订单信息
    type: 0, //订单类型  1保存 2挂起 3结算
    isCheck: false, //是否常规车检
    clientId: 0, //67
    carId: 0, //42
    remark: '',
    orderAmount: 0, //订单金额
    cardDeduction: 0, //卡内抵扣
    discountAmount: 0, //优惠金额
    peddingPay: 0, //待支付
  },
  fromOrder: { //获取订单信息
    totalAmount: 0, //订单总金额
    amount: 0, //结账金额
    buckle: 0, //卡扣
    received: 0, //实收金额
    pendingPay: 0, //待付
    goodsList: [], //商品列表
    payList: [], //支付列表（充值卡+支付方式）
    isSeparate: false, //是否拆分支付
    isPackage: false, //是否套餐,如果是,则不需要支付方式
  },
  parkInfo: {
    //接车信息
    // counselor:'',//服务顾问  接口列表id
    // type:'',//维修类型   1普通维修 2保险维修 3内部维修 4其他维修
    // oil:'',//进店油表 1 =空 2=小于1/4  3=1/4  4=1/2 5=3/4 6满
    // mileage:'',//进店里程
    baguetteTime: moment(),//进店时间
    // carTime:'',//预计交车
    // enjoin:'',//车主嘱咐
    // remark:'',//备注
    // tip:'',//温馨提示
    // vin:'',//车架号
    // engineNo:'',//发动机号
    // insurance:'',//保险到期
    // desc:'',//故障描述
    // suggest:'',//维修建议
    // carInsurance:'',//车险到期
    // km:'',//质保 公里
    // days:'',//质保 天
    // finalInspection: true, //终检
  },
  checkCar: {
    //验车
    feature: [], ////功能确认
    goods: [], //物品确认
    car: [], //车模型
    fileList: [], //图片
    remark: "", //备注
  },
  checks: [], //36项检查
  projectInfo: [], //项目信息
  productInfo: [], //产品信息
  giveInfo: [], //赠送信息
  paymentList: [], //选择的支付方式 整单
  discountList: [], //选择的卡支付方式 整单
  discount: [], //卡扣支付
  remark: "", //备注
  workStaff: [], //施工人员
  saleStaff: [], //销售人员
  storageStaff: [], //仓库人员
  getStaff: [], //领料人员
  returnStaff: [], //退料人员
  totalCount: 0, //总计
  maintaintype: 0, //维修类型
}

export default modelExtend(model, {
  namespace: "maintainBilling",
  state: { ...cloneDeep(defaultData) },
  reducers: {
    setProjectInfo(state, { payload }) {
      let orderAmount = 0
      let peddingPay = 0
      let cardDeduction = 0
      let discountAmount = 0
      payload.forEach(e => {
        orderAmount += e.price * e.num * 1000
        if(!e.detailId) {
          peddingPay += e.itemTotal * 1000
        }else {
          cardDeduction += e.itemTotal * 1000
        }
      })
      state.productInfo.forEach(e => {
        orderAmount += e.price * e.num * 1000
        if(!e.detailId) {
          peddingPay += e.itemTotal * 1000
        }else {
          cardDeduction += e.itemTotal * 1000
        }
      })
      discountAmount = (orderAmount*1000 - peddingPay*1000 - cardDeduction*1000)/1000
      return {
        ...state,
        projectInfo: payload,
        orderInfo: {
          ...state.orderInfo,
          orderAmount: orderAmount/1000,
          peddingPay: peddingPay/1000,
          cardDeduction: cardDeduction/1000,
          discountAmount: discountAmount/1000,
        },
      }
    },
    setProductInfo(state, { payload }) {
      let orderAmount = 0
      let peddingPay = 0
      let cardDeduction = 0
      let discountAmount = 0
      payload.forEach(e => {
        orderAmount += e.price * e.num * 1000
        if(!e.detailId) {
          peddingPay += e.itemTotal * 1000
        }else {
          cardDeduction += e.itemTotal * 1000
        }
      })
      state.projectInfo.forEach(e => {
        orderAmount += e.price * e.num * 1000
        if(!e.detailId) {
          peddingPay += e.itemTotal * 1000
        }else {
          cardDeduction += e.itemTotal * 1000
        }
      })
      discountAmount = (orderAmount*1000 - peddingPay*1000 - cardDeduction*1000)/1000
      return {
        ...state,
        productInfo: payload,
        orderInfo: {
          ...state.orderInfo,
          orderAmount: orderAmount/1000,
          peddingPay: peddingPay/1000,
          cardDeduction: cardDeduction/1000,
          discountAmount: discountAmount/1000,
        },
      }
    },
    setGiveInfo (state, { payload }) {
      return {
        ...state,
        giveInfo: payload,
      }
    },
    changeStatus(state, { payload }) {
      let key = payload.key
      return {
        ...state,
        [key]: payload.value,
      }
    },
    setParkInfo(state, { payload }) {
      return {
        ...state,
        parkInfo: {
          ...state.parkInfo,
          ...payload,
        },
      }
    },
    setCheckCar(state, { payload }) {
      return {
        ...state,
        checkCar: {
          ...state.checkCar,
          ...payload,
        },
      }
    },
    setChecks(state, { payload }) {
      return {
        ...state,
        checks: payload,
      }
    },
    setStaffList(state, { payload }) {
      let key = payload.key
      return {
        ...state,
        [key]: payload.list,
      }
    },
    setOrderInfo(state, { payload }) {
      return {
        ...state,
        orderInfo: {
          ...state.orderInfo,
          ...payload,
        },
      }
    },
    setAccount(state, { payload }) {
      return {
        ...state,
        account: {
          ...state.account,
          ...payload,
        },
      }
    },
    setOrder(state, { payload }) {
      return {
        ...state,
        fromOrder: {
          ...state.fromOrder,
          ...payload,
        },
      }
    },
    setDiscount(state, { payload }) {
      return {
        ...state,
        discount: payload,
      }
    },
    setGoodsItem(state, { payload: { commodity } }) {
      let goodsList = [...state.fromOrder.goodsList]
      goodsList = goodsList.map(v => {
        if(v.id === commodity.id && v.type === commodity.type ) {
          v = {...commodity}
        }
        return v
      })
      return {
        ...state,
        fromOrder: {
          ...state.fromOrder,
          goodsList,
        },
      }
    },
    modification(state) {
      //修改
      return {
        ...cloneDeep(defaultData),
        workStaff: state.workStaff,
        saleStaff: state.saleStaff,
      }
    },
    setMaintain(state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },
    resetState() {
      console.log('重置数据')
      return {
        ...cloneDeep(defaultData),
      }
    },
    saveMaintain(state, { payload }) {
      let { maintaintype } = payload
      return { ...state, maintaintype }
    },
  },
  effects: {
    *addGuide({ payload }, { call, put }) {
      const { success, data } = yield call(services.LIST, {
        keys: { name: "wide-client/service/help" },
        data: { q: { where: { ...payload } } },
      })
      if (success) {
        yield put({
          type: "setAccount",
          payload: {
            consume: data,
          },
        })
      }
    },
    *addPackage({ payload }, { call, put }) {
      // 卡内
      const { success, list } = yield call(services.LIST, {
        keys: { name: "store/ClientProject" },
        data: { ...payload },
      })
      if (success) {
        yield put({
          type: "setAccount",
          payload: {
            package: list,
          },
        })
      }
      //赠送
      const res = yield call(services.LIST, { keys: { name: 'store/ClientPresenterProject' }, data: { ...payload } })
      if (res.success) {
        yield put({
          type: 'setAccount',
          payload: {
            presentation: res.list,
          },
        })
      }
    },
    *getMaintain(t, { call, put }) {
      const { list } = yield call(services.getMaintaintype, t)
      let y = ""
      if (list && list.length) {
        let obj = list.map(i => {
          return Object.assign(i, {
            value: i.maintainTypeId,
            label: i.name,
          })
        })
        y = listTurnTree("maintainTypeId", "pId", obj)
      }
      yield put({
        type: "saveMaintain",
        payload: {
          maintaintype: y,
        },
      })
    },
  },
})
