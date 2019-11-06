import services from "../../../services"
import { model } from "utils/model"
import modelExtend from "dva-model-extend"

export default modelExtend(model, {
  namespace: "brand",
  state: {
    editItem: {},
    type: "",
    bank: [],
  },
  reducers: {
    save(state, { payload }) {
      const { editItem, type, bank } = payload
      return { ...state, editItem, type, bank }
    },
    changeType(state, { type }) {
      return { ...state, type }
    },
    empty(state) {
      return { ...state, bank: [] }
    },
  },
  effects: {
    *edit({ payload }, { put, call }) {
      let obj = { ...payload }
      if (obj.type === 'edit') {
        const { list } = yield call(services.supplierBank, {
          data: { q: { where: { supplierId: obj.editItem.supplierId } } },
        })
        obj.bank = list.map((v) => ({ ...v, state: "" }))
      }
      yield put({
        type: "save",
        payload: obj,
      })
    },
    *emptyBank(e, { put }) {
      yield put({
        type: "empty",
      })
    },
  },
})
