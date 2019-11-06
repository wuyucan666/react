import services from "../../../../services"
import { model } from "utils/model"
import modelExtend from "dva-model-extend"

export default modelExtend(model, {
  namespace: "storesDataPerformance",
  state: {
    editItem: {},
    collect: {},
    details: {},
    marketing: [],
    storesList: [],
  },
  reducers: {
    save(state, { payload }) {
      const { editItem } = payload
      return { ...state, editItem }
    },
    savedata(state, { payload }) {
      let arr = payload.marketing.list.map(_ => ({ ..._, value: parseFloat(_.be), price: _.money, type: _.title }))
      return { ...state, collect: payload.collect, details: payload.details, marketing: arr }
    },
    goStoresList(state, { payload }) {
      return { ...state, storesList: payload }
    },
  },
  effects: {
    *edit({ payload }, { put }) {
      yield put({
        type: "save",
        payload: payload,
      })
    },
    *getData({ payload }, { put, call }) {
      const { data } = yield call(services.LIST, {
        keys: { name: 'brand/wide/center/store/revenue' },
        data: { q: { where: { 'completed[<>]': payload.time }, store_id: payload.id } },
      })
      yield put({
        type: "savedata",
        payload: data,
      })
    },
    *getStoresList(r, { put, call }) {
      const { list } = yield call(services.LIST, {
        keys: { name: "common/store/list" },
        data: { q: { "page": -1, "limit": -1, "where": { work: 1 } } },
      })
      yield put({
        type: "goStoresList",
        payload: list,
      })
    },
  },
})
