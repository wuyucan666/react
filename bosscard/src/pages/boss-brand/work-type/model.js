import services from '../../../services'
import { model } from 'utils/model'
import modelExtend from 'dva-model-extend'

export default  modelExtend(model, {
  namespace: 'brandWorkType',
  state:{
    editItem: {},
    roleList: [],
  },
  reducers: {
    save(state, { payload  }){
      let editItem = payload
      return { ...state, editItem }
    },
    saveRole(state, { payload }){
      let roleList = payload
      return { ...state, roleList}
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
    * getRole({
        payload,
      },{ call, put }){
        const { list } = yield call (services.brandRoles, payload)
        yield put({
          type: 'saveRole',
          payload: list,
        })
      },
  },
})