import services from '../../../services'
import { model } from 'utils/model'
import modelExtend from 'dva-model-extend'

export default modelExtend(model, {
  namespace: 'staff',
  state: {
    Listwork: [],
    editItem: {},
    type: '',
  },
  reducers: {
    setTistwork(state, { payload }) {
      return {
        ...state,
        Listwork: payload,
      }
    },
    save(state, { payload }) {
      const { editItem, type } = payload
      return { ...state, editItem, type }
    },
  },
  effects: {
    * edit({
      payload,
    }, { put }) {
      yield put({
        type: 'save',
        payload: payload,
      })
    },
    * getworklists(t, { call, put }) {//获取工种列表下拉接口
      const { list } = yield call(services.list, { keys: { name: 'store/manage/role' },    data: {q: {page:-1,limit: -1, where: {role_type_id: 2}}} })
      if (list && list.length) {
        yield put({
          type: 'setTistwork',
          payload: list,
        })
      }
    },
  },
})
