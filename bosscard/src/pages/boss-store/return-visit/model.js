import { model } from "utils/model"
import modelExtend from "dva-model-extend"
import services from "../../../services"

export default modelExtend(model, {
  namespace: "returnVisit",
  state: {
    visitRecord:[],
  },
  reducers: {
    initRecord(state, { payload }) {
      const {visitRecord}=payload
      return { ...state,
        visitRecord:visitRecord,
      }
    },
  },
  effects: {
    *getRecordInfo(t, { call, put }) {
      const { list } = yield call(services.getReturnVisitRecord,{keys:{name:`returnVisit/record` ,id:t.payload.v }})
      
      yield put({
        type: "initRecord",
        payload: {
          visitRecord:list,
        },
      })
    },
  },
})