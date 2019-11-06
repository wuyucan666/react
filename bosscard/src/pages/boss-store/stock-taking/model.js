import services from "../../../services"
import { model } from "utils/model"
import modelExtend from "dva-model-extend"
import listTurnTree from "utils/listTurnTree"

export default modelExtend(model, {
  namespace: "stockTaking",
  state: {
    editItem: {},
    category: [],
    allCategory: [],
    warehouseList: [],
    erpList: [],
  },
  reducers: {
    save(state, { payload }) {
      let editItem = payload
      return { ...state, editItem }
    },
    saveRole(state, { payload }) {
      let { category, warehouseList, allCategory } = payload
      return { ...state, category, warehouseList, allCategory }
    },
    saveErp(state, { payload }) {
      let { erpList } = payload
      return { ...state, erpList }
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
      const category = yield call(services.productStoreCategory, payload)
      let g = ""
      if (category.list && category.list.length) {
        let obj = category.list.map(i => {
          return Object.assign(i, {
            value: i.categoryId,
            label: i.categoryName,
          })
        })
        g = listTurnTree("categoryId", "pId", obj)
      }
      const warehouseList = yield call(services.warehouseList, payload)
      yield put({
        type: "saveRole",
        payload: {
          category: g,
          allCategory: category.list,
          warehouseList: warehouseList.list,
        },
      })
    },
    *getErp({ payload }, { call, put }) {
      const erpList = yield call(services.getTypeGoods, { keys: payload })
      yield put({
        type: "saveErp",
        payload: { erpList: erpList.list },
      })
    },
  },
})
