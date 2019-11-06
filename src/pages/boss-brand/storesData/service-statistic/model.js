import services from "../../../../services"
import { model } from "utils/model"
import modelExtend from "dva-model-extend"

export default modelExtend(model, {
  namespace: "storesDataStatistic",
  state: {
    editItem: {},
    cardSList: [],
    storesList: [],
  },
  reducers: {
    save(state, { payload }) {
      const { editItem } = payload
      return { ...state, editItem }
    },
    savedata(state, { payload }) {
      return { ...state, cardSList: payload }
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
      // const { list } = yield call(services.getWideClientCard, {
      //   data: payload,
      // })
      console.log('vvv', payload, call)
      let list = []
      list.clientCardBalance.give = list.clientCardBalance ? parseFloat(list.clientCardBalance.rechargeMoney) + parseFloat(list.clientCardBalance.giveMoney) : 0
      yield put({
        type: "savedata",
        payload: list,
      })
    },
    *getStoresList(r, { put, call }) {
      const { list } = yield call(services.LIST, {
        keys: { name: "common/store/list" },
        data: { q: { "page": -1, "limit": -1, "where": { work: 1 } } },
      })
      let arr = list.map(_ => ({ ..._, value: _.id, name: _.storeName }))
      // arr.unshift({ value: 0, name: '全部门店' })
      yield put({
        type: "goStoresList",
        payload: arr,
      })
    },
  },
})
