import { model } from 'utils/model'
import modelExtend from 'dva-model-extend'
import services from "../services"

export default modelExtend(model, {
  namespace: "miningOutside",
  state: {
    miningData: {},
  },
  reducers: {
    save(state, { payload }) {
      let miningData = payload
      return { ...state, miningData }
    },
  },
  effects: {
    *edit({ payload }, { put, call }) {
      const {data} = yield call(services.LIST, {keys: {name: 'store/setting/general-commission/0', id: payload}})
      yield put({
        type: "save",
        payload: data.commission,
      })
    },
  },
})
