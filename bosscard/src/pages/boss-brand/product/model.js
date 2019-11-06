import services from "../../../services"
import { model } from "utils/model"
import modelExtend from "dva-model-extend"
import listTurnTree from "utils/listTurnTree"

export default modelExtend(model, {
  namespace: "product",
  state: {
    editItem: {},
    category: [],
    productUnit: [],
    maintaintype: [],
  },
  reducers: {
    save(state, { payload }) {
      let editItem = payload
      return { ...state, editItem }
    },
    saveRole(state, { payload }) {
      let { productUnit, category } = payload
      return { ...state, productUnit, category }
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
    *getRole({ payload }, { call, put }) {
      const productUnit = yield call(services.productUnitBrand, payload)
      const category = yield call(services.productCategory, payload)
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
      yield put({
        type: "saveRole",
        payload: {
          productUnit: productUnit.list,
          category: g,
        },
      })
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
        },
      })
    },
  },
})
