// import services from '../../services'
import { model } from "utils/model"
import listTurnTree from "utils/listTurnTree"
import modelExtend from "dva-model-extend"
import services from "../../../services"

export default modelExtend(model, {
  namespace: "project",
  state: {
    editItem: {},
    projectList: [],
    maintaintypeAll: [],
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
        projectList: payload,
      }
    },
    saveMaintain(state, { payload }) {
      let { maintaintype, maintaintypeAll } = payload
      return { ...state, maintaintype, maintaintypeAll }
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
      const { list } = yield call(services.list, {
        keys: { name: "brand/projectcategory" },
      })
      if (list && list.length) {
        let obj = list.map(i => {
          return Object.assign(i, {
            value: i.categoryId,
            label: i.categoryName,
            name: i.categoryName,
          })
        })
        yield put({
          type: "setType",
          payload: listTurnTree("categoryId", "pId", obj),
        })
      }
    },
    *getMaintain(t, { call, put }) {
      const { list } = yield call(services.getBrandMaintaintype, { data: { q: { page: -1, limit: 100000 } } })
      let y = ""
      if (list && list.length) {
        let obj = list.map(i => {
          return Object.assign(i, {
            value: i.maintainTypeId,
            label: i.name,
          })
        })
        y = listTurnTree("maintainTypeId", "pId", obj)
      }
      yield put({
        type: "saveMaintain",
        payload: {
          maintaintype: y,
          maintaintypeAll: list,
        },
      })
    },
  },
})
