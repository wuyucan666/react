import { model } from "utils/model"
import listTurnTree from "utils/listTurnTree"
import modelExtend from "dva-model-extend"
import services from "../../../services"

export default modelExtend(model, {
  namespace: "projectStore",
  state: {
    editItem: {},
    projectList: [],
    category: [],
    maintaintype: [],
  },
  reducers: {
    save(state, { payload }) {
      let editItem = payload
      editItem.salesType = editItem.salesType ? editItem.salesType : 1
      editItem.roadWorkType = editItem.roadWorkType ? editItem.roadWorkType : 2
      return { ...state, editItem }
    },
    setType(state, { payload }) {
      return {
        ...state,
        projectList: payload.projectList,
        category: payload.category,
      }
    },
    count(state) {
      console.log(state)
      return state
    },
    saveMaintain(state, { payload }) {
      let { maintaintype } = payload
      return { ...state, maintaintype }
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
        keys: { name: "store/projectcategory" },
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
          payload: {
            projectList: listTurnTree("categoryId", "pId", obj),
            category: list,
          },
        })
      }
    },
    *getMaintain(t, { call, put }) {
      const { list } = yield call(services.getMaintaintype, { data: { q: { page: -1, limit: 100000 } } })
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
        },
      })
    },
  },
})
