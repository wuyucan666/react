import { model } from 'utils/model'

import modelExtend from 'dva-model-extend'
import services from "../../../services"
export default  modelExtend(model, {
    namespace: 'revenueSummary',
    state:{
       productList:{
        categoryOne:[],
        categoryTwo:[],
       },
       projectList:{
        categoryOne:[],
        categoryTwo:[],
       },
       collectList:{
        project:[{
          project:'', 
        },{
          project:'', 
        },{
          project:'', 
        },{
          project:'', 
        }],
        settlementMethod:[],
       },
    },
    reducers: {
          getProjectList(state, { payload }){
            return {
              ...state,
              projectList: payload,
            }
          },
          getProductList(state, { payload }){
            return {
              ...state,
              productList: payload,
            }
          },
          getCollectList(state,{ payload }){
            return {
              ...state,
              collectList:payload,
            }
          },
    },
    effects: {
        //获取产品信息
      * getProduct(t,{  call, put }){
        const {data} = yield call(services.revenueProductList, {keys: {name: '/wide-business/marketing/product'},data:{...t.payload}})
          yield put({
            type: 'getProductList',
            payload: data,
          })
        },
        //获取项目信息
     * getProject(t,{  call, put }){
            const {data} = yield call(services.revenueProjectList, {keys: {name: '/wide-business/marketing/project'},data:{...t.payload}})
              yield put({
                type: 'getProjectList',
                payload: data,
              })
            },
      * getCollect(t,{ call, put }){
            const {data} = yield call(services.marketingCollect, {keys: {name: '/wide-business/marketing/collect'},data:{...t.payload}})
            yield put({
              type: 'getCollectList',
              payload: data,
            })
            },
    },
  })