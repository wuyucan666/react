import services from '../../../services'
import { model } from 'utils/model'
import modelExtend from 'dva-model-extend'

export default modelExtend(model, {
  namespace: 'brandSupervisor',
  state:{
    editItem:{},
    roleList: [],
    storeList: [],
  },
  reducers: {
    save(state, { payload }){
      let editItem = payload
      return { ...state, editItem}
    },
    saveRole(state, { payload }){
      let roleList = payload
      return { ...state, roleList}
    },
    saveStore(state, { payload }){
      let storeList = payload
      return { ...state, storeList}
    },
  },
  effects: {
    * edit({
      payload,
    },{  put }){
      yield put({
        type: 'save',
        payload: payload,
      })
    },
    * getRole({},{ call, put }){
      const { list } = yield call(services.list, {
        keys: { name: "brand/manage/role" },
        data: {q: {page:-1,limit: -1, where: {role_type_id: 1}}},
      })
      yield put({
        type: 'saveRole',
        payload: list,
      })
    },
    * getStore({
      payload,
    },{ call, put }){
      const { list } = yield call (services.brandStore,payload)
      yield put({
        type: 'saveStore',
        payload: list,
      })
    },
  },
})
