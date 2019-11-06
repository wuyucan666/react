import { model } from 'utils/model'
import modelExtend from 'dva-model-extend'
export default modelExtend(model, {
  namespace: 'customersImportAll',
  state: {
    customersImportAll: {},
  },
  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        customersImportAll: payload,
      }
    },
  },
  effects: {
    *getCustomersImportAll({ payload }, { put }) {
      yield put({
        type: 'save',
        payload,
      })
    },
  },
})
