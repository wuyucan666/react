import services from "../../../services"
import { model } from "utils/model"
import modelExtend from "dva-model-extend"
import listTurnTree from "utils/listTurnTree"

export default modelExtend(model, {
  namespace: "storeproduct",
  state: {
    editItem: {},
    category: [],
    productUnit: [],
    maintaintype: [],
  },
  reducers: {
    save(state, { payload }) {
      let editItem = payload
      editItem.salesType = editItem.salesType ? editItem.salesType : 1
      editItem.roadWorkType = editItem.roadWorkType ? editItem.roadWorkType : 2
      editItem.accessoryProperties = (!editItem.accessoryProperties || editItem.accessoryProperties === '0') ? '' : editItem.accessoryProperties
      return { ...state, editItem: { ...editItem } }
    },
    saveRole(state, { payload }) {
      let { productUnit, category, maintaintype } = payload
      return {
        ...state,
        productUnit,
        category,
        maintaintype,
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
    *getRole({ payload }, { call, put }) {
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
          maintaintype: y,
        },
      })
    },
  },
})
