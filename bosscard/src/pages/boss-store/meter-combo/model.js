import services from '../../../services'
import { model } from 'utils/model'
import modelExtend from 'dva-model-extend'

export default  modelExtend(model, {
  namespace: 'meterCombo',
  state:{
    editItem:{},
  },
  reducers: {
    save(state, { payload }){
      let editItem = payload
      editItem.recordsInfo.map(v => {
        if(v.goodNum === -1) {
          v.goodNum = 0
        } 
        return v
      })
      return { ...state, editItem}
    },
    clearState(state) {
      return {
        ...state,
        editItem: {},
      }
    },
  },
  effects: {
    * edit({
      payload,
    },{  call ,put }){
      const { list } = yield call(services.detail,{data:{recordsId: payload.recordsId}, keys: {'name': 'store/records'}})
      yield put({
        type: 'save',
        payload: {...list, amount: list.amount * 1, packageCount: list.packageCount * 1},
      })
    },
  },
})