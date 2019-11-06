import { model } from 'utils/model'
import modelExtend from 'dva-model-extend'
import services from "../../../services/index"

export default  modelExtend(model, {
  namespace: 'clientManage',
  state:{
    channelList: [],//客户来源
  },
  reducers: {
    setChannelList(state, { payload }){
      return {
        ...state,
        channelList: payload,
      }
    },
  },
  effects: {
    * getChannelList(t,{  call, put }){
      const {list} = yield call(services.list, {keys: {name: 'store/channel'},data:{q:{page:-1, where: {statusTem: 1}}}})
      yield put({
        type: 'setChannelList',
        payload: list,
      })
    },
  },
})
