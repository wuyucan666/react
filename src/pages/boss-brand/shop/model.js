// import services from '../../services'
import { model } from "utils/model"
import modelExtend from "dva-model-extend"
import services from "../../../services"
import listTurnTree from "utils/listTurnTree"

export default modelExtend(model, {
  namespace: "shop",
  state: {
    editItem: {},
    areaList: [],
    roleList: [],
  },
  reducers: {
    save(state, { payload }) {
      let editItem = payload
      editItem.storeTel = editItem.storeTel
        ? parseInt(editItem.storeTel)
          ? editItem.storeTel
          : ""
        : ""
      return { ...state, editItem }
    },
    setAreaList(state, { payload }) {
      return {
        ...state,
        areaList: payload,
      }
    },
    setRoleList(state, { payload }) {
      return {
        ...state,
        roleList: payload,
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
    *getAreaList(t, { call, put }) {
      const { list } = yield call(services.list, {
        keys: { name: "brand/area" },
      })
      if (list && list.length) {
        let obj = list.map(i => {
          return Object.assign(i, { value: i.areaId, label: i.blockName })
        })
        let arr = listTurnTree("areaId", "pId", obj)
        let ary = arr.filter(v => v.pId === 0)
        yield put({
          type: "setAreaList",
          payload: ary,
        })
      }
    },
    *getRoleList(t, { call, put }) {
      const { list } = yield call(services.list, {
        keys: { name: "brand/manage/role" },
        data: {q: {page:-1,limit: -1, where: {role_type_id: 2}}},
      })
      if (list && list.length) {
        yield put({
          type: "setRoleList",
          payload: list,
        })
      }
    },
  },
})
