import services from "../../../services"
import { model } from "utils/model"
import modelExtend from "dva-model-extend"

export default modelExtend(model, {
  namespace: "administor",
  state: {
    editItem: {},
    roleList: [],
  },
  reducers: {
    save(state, { payload }) {
      let editItem = payload
      return { ...state, editItem }
    },
    saveRole(state, { payload }) {
      let roleList = payload
      return { ...state, roleList }
    },
  },
  effects: {
    *edit({ payload }, { put }) {
      yield put({
        type: "save",
        payload: payload,
      })
    },
    *getRole({  }, { call, put }) {
      const { list } = yield call(services.list, {
        keys: { name: "admin/manage/role" },
        data: {q: {page:-1,limit: -1}},
      })
      yield put({
        type: "saveRole",
        payload: list,
      })
    },
  },
})
