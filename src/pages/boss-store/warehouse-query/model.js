import { model } from 'utils/model'
import services from "services"
import modelExtend from 'dva-model-extend'
export default  modelExtend(model, {
    namespace: 'queryData',
    state:{
    	warehouseList:[],
    	productcategoryList:[],
    },
    reducers: {
       	warehouseData(state, { payload }){
	        return {
	          ...state,
	          warehouseList: payload,
	        }
      	},
      	productcategoryData(state, { payload }){
	        return {
	          ...state,
	          productcategoryList: payload,
	        }
      	},
    },
    effects: {
    	* getwarehouseList(t,{  call, put }){
	        const {list} = yield call(services.list, {keys: {name: 'store/warehouse'}})
	        if (list && list.length) {
	          	yield put({
	            	type: 'warehouseData',
	            	payload: list,
	          	})
	        }
	    },
	    * getproductcategoryList(t,{  call, put }){
	        const {list} = yield call(services.list, {keys: {name: 'store/productcategory'}})
	        if (list && list.length) {
	          	yield put({
	            	type: 'productcategoryData',
	            	payload: list,
	          	})
	        }
	    },
	    
    },
  })
  