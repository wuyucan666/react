import { model } from 'utils/model'
import services from "services"
import modelExtend from 'dva-model-extend'
export default  modelExtend(model, {
    namespace: 'warningEarly',
    state:{
    	productcategoryList:[],
    },
    reducers: {
      	productcategoryData(state, { payload }){
	        return {
	          ...state,
	          productcategoryList: payload,
	        }
      	},
    },
    effects: {
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
  