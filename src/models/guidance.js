import { model } from 'utils/model'
import modelExtend from 'dva-model-extend'


export default  modelExtend(model, {
  namespace: 'guidance',
  state:{
    current:0,
  },
  reducers: {
    save(state, { payload }){
      return {
        ...state,
        current: payload,
      }
    },
  },
  effects: {

  },
})
