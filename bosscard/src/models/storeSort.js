import { model } from "utils/model"
import listTurnTree from "utils/listTurnTree"
import modelExtend from "dva-model-extend"
import services from "../services"

export default modelExtend(model, {
  namespace: "storeSort",
  state: {
    editItem: {},
    projectList: [],
    category: [],
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
    saveRole(state, { payload }) {
      let { productUnit, category, maintaintype } = payload
      return {
        ...state,
        productUnit,
        category,
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
            // category: list,
          },
        })
      }
    },
    *getRole({ payload }, { call, put }) {
      console.log('oklaaa')
      const productUnit = yield call(services.productUnit, payload)
      const category = yield call(services.productStoreCategory, payload)
      const { list } = yield call(services.getMaintaintype, { data: { q: { page: -1, limit: 100000 } } })
      let g = ""
      if (category.list && category.list.length) {
        let obj = category.list.map(i => {
          return Object.assign(i, {
            value: i.categoryId,
            label: i.categoryName,
            name: i.categoryName,
          })
        })
        g = listTurnTree("categoryId", "pId", obj)
      }
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
        type: "saveRole",
        payload: {
          productUnit: productUnit.list,
          category: g,
          // maintaintype: y,
        },
      })
    },
  },
})
