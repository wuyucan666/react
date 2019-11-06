import { model } from 'utils/model'
import moment from 'moment'
import modelExtend from 'dva-model-extend'
import services from "../services"
export default  modelExtend(model, {
    namespace: 'maintianList',
    state:{
        dataList:[],
        selectList:{},
        maxNumL:null,
        contentsArray:[],
        mealArray: [],
        customizeNumber:{},
        goDetail:{},
        cardList:[],
    },
    reducers: {
      getList(state, { payload }){
          return {
            ...state,
            dataList: payload,
          }
        },
      customizeNumber(state,{payload}){
         return {
           ...state,
           customizeNumber:payload,
         }
      },
      goDetail(state, { payload }){
          return {
            ...state,
            goDetail:payload,
          }
      },
      getlistDetail(state,{payload}){
        return {
          ...state,
          selectList: payload,
        }
      },
      getNumber(state, { payload }){
        return {
          ...state,
          maxNumL: payload,
        }
      },
      mealData(state, { payload }){
        return {
          ...state,
          mealArray: payload,
        }
      },
      getcardList(state, { payload }){
        return {
          ...state,
          cardList: payload,
        }
      },
      cardetailData(state, { payload }){
        // console.log(payload,'0000000-payload-0000000')
        payload[0].apartTime = Math.floor((payload[0].endvalidity - payload[0].startvalidity) / 86400 )
        if(payload[0].endvalidity !== -1){
            payload[0].startvalidity = moment(payload[0].startvalidity*1000).format('YYYY-MM-DD')
            payload[0].endvalidity = moment(payload[0].endvalidity*1000).format('YYYY-MM-DD')
        }
        return {
          ...state,
          contentsArray: payload[0],
        }
      },
    },
    effects: {
      * getData(t,{  call, put }){
        const {list,totalSize} = yield call(services.maintainList, {keys: {name: 'maintain/order'},data:{...t.payload}})
          yield put({
            type: 'getList',
            payload: list,
          })
          yield put({
            type: 'getNumber',
            payload: totalSize,
          })
        },
      *getlistDetail(t,{ call ,put }){
       const { list  }= yield call(services.request,{keys : {link: 'maintainList/detail'}})
         yield put({
          type: 'getlistDetail',
          payload: list,
        })
      },
      * getmealList(t,{  call, put }){
        const {list} = yield call(services.clientCard, { data:{clientId: t.payload.clientId}})
        if (list && list.length) {
            yield put({
              type: 'mealData',
              payload: list,
            })
        }
      },
      * getcontentsList(t,{  call, put }){
        // console.log('zzzzzzzzzz',t.payload.id)
        const {list} = yield call(services.clientCardInfo, { data:{clientCardId: t.payload.id}})
        if (list && list.length) {
            yield put({
              type: 'cardetailData',
              payload: list,
            })
            console.log('zzzlist',list)
        }
      },
      * getdataList(t,{  call, put }){
        const { list } = yield call(services.DETAIL, {keys: {name: 'client/card', id: t.payload.clientId}})
          yield put({
            type: 'getcardList',
            payload: list,
          })
        },
    },
  })
