import services from '../../../services'
import { model } from 'utils/model'
import modelExtend from 'dva-model-extend'

export default  modelExtend(model, {
  namespace: 'inquiryName',
  state:{
    inquiryList: [],
  },
  reducers: {
    savequiry(state, { payload }){
      let inquiryList = payload
      return { ...state, inquiryList}
    },
  },
  effects: {
    * getInquiry({
        payload,
      },{ call, put }){
        const { list } = yield call (services.role, payload)
        yield put({
          type: 'savequiry',
          payload: list,
        })
      },
  },
})