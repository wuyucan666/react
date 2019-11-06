// import services from '../../services'
import { model } from 'utils/model'
import modelExtend from 'dva-model-extend'
import services from 'services'
export default  modelExtend(model, {
  	namespace: 'storewarehouse',
  	state:{
    	amountMoneyList:{},
  	},
  	reducers: {
    	AmountMoneyOutData(state, { payload }){
	        return {
	          ...state,
	          amountMoneyList: payload,
	        }
      	},
  	},
  	effects: {
   		* getAmountMoneyOut({payload},{  call, put }){
				 console.log('zllll',payload)
	        const {list} = yield call(services.LIST, {keys: {name: 'erp/statistics/overview/inventory'}, data: {q:{where:{"created[<>]": payload.time, status: payload.statu}}}})
	        if (list) {
	          	yield put({
	            	type: 'AmountMoneyOutData',
	            	payload: list,
	          	})
	        }
	    },
  	},
})
