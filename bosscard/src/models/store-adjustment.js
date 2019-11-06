import { model } from 'utils/model'

import modelExtend from 'dva-model-extend'
import services from "services"
export default  modelExtend(model, {
    namespace: 'storeAdjustment',
    state:{
        productTypeList:[],
        dataList:[],
        maxNumL:null,
        urgent:false,
    },
    reducers: {
        productType(state, { payload }){
            return {
              ...state,
              productTypeList: payload,
            }
          },
        getProduct(state, { payload }){
            return {
              ...state,
              dataList: payload,
            }
          },
        getNumber(state, { payload }){
            return {
              ...state,
              maxNumL: payload,
            }
        },
        changeStatus(state,{ payload }){
             return {
               ...state,
               urgent:payload,
             }
        },
    },
    effects: {
      * get(t,{  call, put }){
        const {list} = yield call(services.goodsTypeMenu, {keys: {name: 'common/category/tree'},data:{ q:{ where :{ type:2 } } }})
        if (list && list.length) {
          yield put({
            type: 'productType',
            payload: list,
          })
  
        }
        },
      * getData(t,{  call, put }){
        const {list,totalSize} = yield call(services.getTypeGoods, {keys: {name: '/erp/stock/inventory'},data:{...t.payload}})
          yield put({
            type: 'getProduct',
            payload: list,
          })
          yield put({
            type: 'getNumber',
            payload: totalSize,
          })
        },
      * outStore(t,{  call }){
           yield call(services.outStore, {keys: {name: '/erp/stock/inventory/storage/output'},data:{...t.payload}})
        },
      * inStore(t,{  call }){
        yield call(services.inStore, {keys: {name: '/erp/stock/inventory/storage/input'},data:{...t.payload}})
        },
      * getProductData(t,{  call, put }){
        const {list,totalSize} = yield call(services.getTypeProduct, {keys: {name: '/erp/product/selector'},data:{...t.payload}})
          yield put({
            type: 'getProduct',
            payload: list,
          })
          yield put({
            type: 'getNumber',
            payload: totalSize,
          })
        },
       //紧急入库
       * urgent (t,{ put}){
        yield put({
           type:'changeStatus',
           payload:t.payload.status,
        })
    },
    },
  })
  