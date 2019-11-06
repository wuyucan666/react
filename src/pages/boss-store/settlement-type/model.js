import services from "../../../services"
import { model } from "utils/model"
import modelExtend from "dva-model-extend"

export default modelExtend(model, {
  namespace: "settlementType",
  state: {
    editItem: {},
    settlementData: [],
    dataList: [],
    pay: [],
    columns: [
      {
        title: "日期",
        dataIndex: "date",
        key: "date",
        width: 100,
      },
      {
        title: "实收总金额",
        dataIndex: "total",
        key: "total",
        width: 100,
      },
      {
        title: "实收类型",
        align: "center",
        children: [
          {
            title: "会员售卡",
            dataIndex: "records",
            key: "records",
            width: 160,
          },
          {
            title: "充值卡",
            dataIndex: "species",
            key: "species",
            width: 160,
          },
          {
            title: "挂账还款",
            dataIndex: "arrears",
            key: "arrears",
            width: 160,
          },
          {
            title: "项目/产品/附加项目",
            dataIndex: "goods",
            key: "goods",
            width: 160,
          },
        ],
      },
      {
        title: "收款方式",
        align: "center",
        children: [],
      },
    ],
  },
  reducers: {
    save(state, { payload }) {
      const { editItem } = payload
      return { ...state, editItem }
    },
    savedata(state, { payload }) {
      const { settlementData, dataList } = payload
      return { ...state, settlementData, dataList }
    },
    savedataPay(state, { payload }) {
      let arr = []
      arr = payload.map(v => ({ ...v, title: v.name, dataIndex: v.value, key: v.id, width: 160 }))
      state.columns[3].children = arr
      return { ...state, pay: state.columns }
    },
  },
  effects: {
    *edit({ payload }, { put }) {
      yield put({
        type: "save",
        payload: payload,
      })
    },
    *getDataPay({ payload }, { put, call }) {
      const { list } = yield call(services.getPaymentList, {
        data: payload,
      })
      yield put({
        type: "savedataPay",
        payload: list,
      })
    },
    *getData({ payload }, { put, call }) {
      const { data } = yield call(services.getPaymentTypeCollect, {
        data: payload ? { q: { where: { "completed[<>]": payload } } } : {},
      })
      const dataList = yield call(services.getPaymentTypeList, {
        data: payload ? { q: { where: { "completed[<>]": payload } } } : {},
      })
      let lists = data
      lists.marketing.total = (data && data.marketing) ? parseFloat(data.marketing.total) : 0
      lists.actual.total = (data && data.actual) ? parseFloat(data.actual.total) : 0
      lists.noActual.total = (data && data.noActual) ? parseFloat(data.noActual.total) : 0
      lists.giveaway.total = (data && data.giveaway) ? parseFloat(data.giveaway.total) : 0
      yield put({
        type: "savedata",
        payload: { settlementData: lists, dataList: dataList.list },
      })
    },
  },
})
