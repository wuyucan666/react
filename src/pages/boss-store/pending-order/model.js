import modelExtend from 'dva-model-extend'
import moment from 'moment'
import services from '../../../services'
import { model } from 'utils/model'

export default modelExtend(model, {
  namespace: 'pendingOrder',
  state: {
    editItem: {},
    orderData: [],
    totalPage: 1,
  },
  reducers: {
    save(state, { payload }) {
      let editItem = payload
      return { ...state, editItem }
    },
    setData(state, { payload }) {
      let arr = []
      if (payload.page === 1) {
        arr = payload.arr
      } else if (payload.page > 1) {
        arr = state.orderData.concat(payload.arr)
      }
      return { ...state, orderData: arr, totalPage: payload.totalPage }
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
    * getData({ payload }, { put, call }) {
      const list = yield call(services.LIST, {
        keys: { name: "maintain/order", id: payload },
        data: { q: { "page": payload.page, "limit": 12, "where": { "state": [1, 3], "clientName[~]|clientPhone[~]|licenseNo[~]|vehicleType[~]": payload.val || undefined, status: 1 }, "order": {} } },
      })
      let arr = list.list.map(_ => ({ ..._, created: moment(_.created * 1000).format('YYYY-MM-DD HH:mm'), updated: moment(_.updated * 1000).format('YYYY-MM-DD HH:mm') }))
      yield put({
        type: 'setData',
        payload: { arr, totalPage: list.totalPage, page: payload.page },
      })
    },
  },
})
