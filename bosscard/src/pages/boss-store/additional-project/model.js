import { model } from "utils/model"
import modelExtend from "dva-model-extend"
import services from "../../../services"
import listTurnTree from "utils/listTurnTree"

export default modelExtend(model, {
  namespace: "projectAdditional",
  state: {
    editItem: {},
    maintaintype: [],
  },
  reducers: {
    save(state, { payload }) {
      let editItem = payload
      return { ...state, editItem }
    },
    setType(state, { payload }) {
      return {
        ...state,
        maintaintype: payload.maintaintype,
      }
    },
  },
  effects: {
    *edit({ payload }, { put }) {
      yield put({
        type: "save",
        payload: payload,
      })
    },
    *getType(t, { call, put }) {
      const { list } = yield call(services.getMaintaintype, { data: { q: { page: -1, limit: 100000 } } })
      let g = ""
      if (list && list.length) {
        let obj = list.map(i => {
          return Object.assign(i, {
            value: i.maintainTypeId,
            label: i.name,
          })
        })
        g = listTurnTree("maintainTypeId", "pId", obj)
      }
      yield put({
        type: "setType",
        payload: {
          maintaintype: g,
        },
      })
    },
  },
})
