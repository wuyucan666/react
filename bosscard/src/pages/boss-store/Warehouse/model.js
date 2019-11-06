// import services from '../../services'
import { model } from 'utils/model'
import modelExtend from 'dva-model-extend'

export default  modelExtend(model, {
  namespace: 'warehouse',
  state:{
    editItem:{},
    type: '',
    addItem:{},
  },
  reducers: {
    save(state, { payload }){
      let { editItem, type } = payload
      return { ...state, editItem, type}
    },
    adds(state, { payload }){
      let { addItem, type } = payload
      console.log('typetypetype', type)
      return { ...state, addItem, type}
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
    * addData({
      payload,
    },{  put }){
      yield put({
        type: 'adds',
        payload: payload,
      })
    },
  },
})
