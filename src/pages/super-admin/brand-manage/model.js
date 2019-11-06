import { model } from 'utils/model'
import modelExtend from 'dva-model-extend'
import services from "../../../services"

export default  modelExtend(model, {
  namespace: 'brandManage',
  state:{
    editItem:{},
    roleList: [],
    unitList: [],
    permission: [],
  },
  reducers: {
    save(state, { payload }){
      let editItem = payload
      console.log(editItem, 'editItem')
      return { ...state, editItem}
    },
    setRole(state, { payload }){
      return {
        ...state,
        roleList: payload,
      }
    },
    setPermission(state, {payload}){
      return {
        ...state,
        permission: payload,
      }
    },
  },
  effects: {
    * edit({payload},{ put }){
      yield put({
        type: 'save',
        payload: payload,
      })
    },
    * getRole(t,{  call, put }){
      const {list} = yield call(services.list, {keys: {name: 'admin/manage/role'},data: {q: {page: -1, limit: -1}}})
      if (list && list.length) {
        let obj = list.map(i => {
          return Object.assign(i, {value: i.roleId, label: i.roleName})
        })
        yield put({
          type: 'setRole',
          payload: obj,
        })
      }
    },
    * getPermission(t,{  call, put }){
      const {list} = yield call(services.list, {keys: {name: 'permission/group-types'}})
      if (list) {
        yield put({
          type: 'setPermission',
          payload: list.map(item => ({label: item.name, value: item.id})),
        })
      }
    },
  },
})
