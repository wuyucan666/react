import services from "../../../services"
import { model } from "utils/model"
import modelExtend from "dva-model-extend"
// import moment from "moment"

export default modelExtend(model, {
  namespace: "memberCards",
  state: {
    staffList: [],
    editItem: {},
    payList: [],
    details: {},
  },
  reducers: {
    save(state, { payload }) {
      let { staffList, editItem, payList } = payload
      return { ...state, staffList, editItem, payList }
    },
    saveEdit(state, { payload }) {
      let { details } = payload
      // console.log('mydetails:',details)
      return { ...state, details }
    },
  },
  effects: {
    *getList({ payload }, { call, put }) {
      const { list } = yield call(services.getStaffList, {
        data: { q: { where: { isJob: 1 } } },
      })
      const { data } = yield call(services.getPaytypeList, payload)
      let arr = list.map(v => ({ ...v, name: v.staffName, value: v.staffId }))
      yield put({
        type: "save",
        payload: {
          editItem: payload,
          staffList: arr,
          payList: data,
        },
      })
    },
    *edit({ payload }, { call, put }) {   
      const { data } = yield call(services.getClientcardOperation, {
        keys: {
          name: "store/clientcard/operation/",
          id: payload.editItem.cardId,
        },
      })
      // deadlineTime: moment(v.deadlineTime * 1000).format('YYYY-MM-DD'), times: moment(v.deadlineTime * 1000).format('YYYY-MM-DD'), selvalue1: v.neverValid === 1 ? 0 : 1
      // let card = data.card.map(v => ({
      //   ...v,
      //   times: (v.deadlineTime === -1 || v.deadlineTime === '-1') ? '' : moment(v.deadlineTime * 1000).format('YYYY-MM-DD'),
      //   selvalue1: (v.deadlineTime === -1 || v.deadlineTime === '-1') ? 0 : 1,
      // }))
      // let datas = { ...data, card: [...card] }
      // console.log('mydata:',{...data,cardId:payload.editItem.cardId})
      yield put({
        type: "saveEdit",
        payload: {
          details: {...data,cardId:payload.editItem.cardId},
        },
      })
    },
    *operation({ payload }, { put }) {
      yield put({
        type: "saveEdit",
        payload: {
          details: payload,
        },
      })
    },
  },
})
