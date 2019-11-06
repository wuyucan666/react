import { model } from "utils/model"
import modelExtend from "dva-model-extend"
import services from "../../../services"

export default modelExtend(model, {
  namespace: "sms",
  state: {
    smsAmount:'',
  },
  reducers: {
    initId(state, { payload }) {
      const {smsAmount}=payload
      return { ...state,
        smsAmount,
      }
    },
  },
  effects: {
    *getRecordInfo(t, { call, put }) {
      const { data } = yield call(services.msmNum,{keys:{name:`store/smsGroupMessage/create`}})
      yield put({
        type: "initId",
        payload: {
          smsAmount:data.smsAmount,
        },
      })
    },
  },
})