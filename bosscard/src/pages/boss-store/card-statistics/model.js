import services from "../../../services"
import { model } from "utils/model"
import modelExtend from "dva-model-extend"

export default modelExtend(model, {
  namespace: "cardStatistics",
  state: {
    editItem: {},
    cardSList: [],
  },
  reducers: {
    save(state, { payload }) {
      const { editItem } = payload
      return { ...state, editItem }
    },
    savedata(state, { payload }) {
      return { ...state, cardSList: payload }
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
      const { list } = yield call(services.getWideClientCard, {
        data: payload,
      })
      list.clientCardBalance.give = list.clientCardBalance ? parseFloat(list.clientCardBalance.rechargeMoney) + parseFloat(list.clientCardBalance.giveMoney) : 0
      yield put({
        type: "savedata",
        payload: list,
      })
    },
  },
})
