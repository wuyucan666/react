import services from "../../../../../services"
const intialState = {
  selectCard: [],
  customerCar: [], // 车辆信息
  editItem: {}, // 客户信息
  rechargeCard: [], // 充值卡
  channelList: [],
}

export default {
  namespace: "customersImport",
  state: { ...intialState },
  reducers: {
    setCInformation(state, { payload }) {
      return {
        ...state,
        editItem: payload,
      }
    },
    setCustomerCar(state, { payload }) {
      return {
        ...state,
        customerCar: payload,
      }
    },
    setRechargeCard(state, { payload }) {
      return {
        ...state,
        rechargeCard: payload,
      }
    },
    setSelectCardCard(state, { payload }) {
      return {
        ...state,
        selectCard: payload,
      }
    },
    setChannelList(state, { payload }) {
      return {
        ...state,
        channelList: payload,
      }
    },
    setEmpty(state) {
      return {
        ...state,
        selectCard: [],
        customerCar: [], // 车辆信息
        editItem: {}, // 客户信息
        rechargeCard: [], // 充值卡
      }
    },
  },
  effects: {
    *goEmpty({ payload }, { put }) {
      // 清空
      yield put({
        type: "setEmpty",
        payload,
      })
    },
    *goCustomerCar({ payload }, { put }) {
      // 车辆信息
      yield put({
        type: "setCustomerCar",
        payload,
      })
    },
    *goCustomerInformation({ payload }, { put }) {
      // 客户信息
      yield put({
        type: "setCInformation",
        payload,
      })
    },
    *goRechargeCard({ payload }, { put }) {
      // 充值卡数据
      yield put({
        type: "setRechargeCard",
        payload,
      })
    },
    *goSelectCardCard({ payload }, { put }) {
      // 计次卡（含赠送卡）数据
      yield put({
        type: "setSelectCardCard",
        payload,
      })
    },
    * getChannelList(t, { call, put }) {
      const { list } = yield call(services.list, { keys: { name: 'store/channel' }, data: { q: { page: -1, where: { statusTem: 1 } } } })
      yield put({
        type: 'setChannelList',
        payload: list,
      })
    },
  },
}
