import { model } from 'utils/model'
import services from "services"
import modelExtend from 'dva-model-extend'
export default  modelExtend(model, {
    namespace: 'receivedetail',
    state:{
    	stockTypesList:[],
    },
    reducers: {
       	stockTypes(state, { payload }){
	        return {
	          ...state,
	          stockTypesList: payload,
	        }
      	},
    },
    effects: {
    	* getstockList(t,{  call, put }){
	        const {list} = yield call(services.LIST, {keys: {name: 'erp/stock/types'}})
	        if (list && list.length) {
	          	console.log('123456ssssss', list)
	          	yield put({
	            	type: 'stockTypes',
	            	payload: list,
	          	})
	        }
	    },
    },
  })
  
  