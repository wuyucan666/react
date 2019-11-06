import services from '../../../services'
import { model } from 'utils/model'
import modelExtend from 'dva-model-extend'

export default modelExtend(model, {
  namespace: 'cards',
  state:{
    editItem:{},
  },
  reducers: {
    save(state, { payload }){
      let editItem = payload
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
      const { list } = yield call(services.cardsDetail,{data:{speciesId: payload.speciesId}})
      yield put({
        type: 'save',
        payload: list,
      })
    },
  },
})