// import services from '../../services'
import { model } from 'utils/model'
import modelExtend from 'dva-model-extend'

export default  modelExtend(model, {
  namespace: 'teamGroup',
  state:{
    editItem:{},
  },
  reducers: {
    save(state, { payload }){
      let editItem = payload
      return { ...state, editItem}
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
  },
})