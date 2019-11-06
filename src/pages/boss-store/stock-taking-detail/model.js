import services from "../../../services"
import { model } from "utils/model"
import modelExtend from "dva-model-extend"
import listTurnTree from "utils/listTurnTree"
export default modelExtend(model, {
  namespace: "stockTakingDetail",
  state: {
    editItem: {},
    staffList: [],
    category: [],
    allCategory: [],
  },
  reducers: {
    save(state, { payload }) {
      let editItem = payload
      let arr = []
      arr[0] = state.allCategory.find(
        v => v.categoryId === editItem.categoryId
      ).pId
      arr.push(editItem.categoryId)
      let ary = arr.filter(_ => _)
      editItem.categoryId = ary
      return { ...state, editItem }
    },
    saveRole(state, { payload }) {
      let { staffList, category, allCategory } = payload
      return { ...state, staffList, category, allCategory }
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
      const { list } = yield call(services.getStaffList, payload)
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
      let d = list.map((v) => ({
        ...v,
        name: v.staffName,
        value: v.staffId,
      }))
      yield put({
        type: "saveRole",
        payload: {
          staffList: d,
          category: g,
          allCategory: category.list,
        },
      })
    },
  },
})
