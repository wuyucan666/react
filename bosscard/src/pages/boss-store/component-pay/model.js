import services from '../../../services'
import { model } from 'utils/model'
import modelExtend from 'dva-model-extend'

export default  modelExtend(model, {
  namespace: 'comppayment',
  state:{
    editItem:{},
    paymentList: [],
  },
  reducers: {
    save(state, { payload }){
      let editItem = payload
      return { ...state, editItem}
    },
    saveData(state, { payload }){
      let list = payload
      return { ...state, paymentList: list}
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
    * getData({
      payload,
    },{ call, put }){
      const {list} = yield call(services.paymentList, payload)
      yield put({
        type: 'saveData',
        payload: list,
      })
    },
  },
})
