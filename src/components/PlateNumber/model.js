import { model } from 'utils/model'
import modelExtend from 'dva-model-extend'
import services from 'services'

export default  modelExtend(model, {
  namespace: 'plateNumber',
  state:{
    plateList: [],
  },
  reducers: {
    setPlateList(state, { payload }){
      return {
        ...state,
        plateList: payload,
      }
    },
  },
  effects: {
    * getPlateList(t,{  call, put }){
      const {list} = yield call(services.list, {keys: {name: 'store/projectcategory'}})
      if (list && list.length) {
        let obj = list.map(i => {
          return Object.assign(i, {value: i.categoryId, label: i.categoryName})
        })
        yield put({
          type: 'setPlateList',
          payload: obj,
        })
      }
    },
  },
})
