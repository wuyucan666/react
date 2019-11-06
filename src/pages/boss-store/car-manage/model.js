import { model } from 'utils/model'
import listTurnTree from 'utils/listTurnTree'
import modelExtend from 'dva-model-extend'
import services from "../../../services"

export default  modelExtend(model, {
  namespace: 'carManage',
  state:{
    editItem:{},
    projectList: [],
    unitList: [],
    plateList: [],
  },
  reducers: {
    save(state, { payload }){
      let editItem = payload
      console.log(editItem, 'editItem')
      return { ...state, editItem}
    },
    setType(state, { payload }){
      return {
        ...state,
        projectList: payload,
      }
    },
    setUnitList(state, { payload }){
      return {
        ...state,
        unitList: payload,
      }
    },
    count(state) {
      console.log(state)
      return state
    },
    setPlateList(state, { payload }){
      return {
        ...state,
        plateList: payload,
      }
    },
  },
  effects: {
    * edit({payload},{ put }){
      yield put({
        type: 'save',
        payload: payload,
      })
    },
    * getType(t,{  call, put }){
      const {list} = yield call(services.list, {keys: {name: 'store/projectcategory'}})
      if (list && list.length) {
        let obj = list.map(i => {
          return Object.assign(i, {value: i.categoryId, label: i.categoryName})
        })
        yield put({
          type: 'setType',
          payload: listTurnTree('categoryId','pId',obj),
        })
      }
    },
    * getUnitList(t,{  call, put }){
      const {list} = yield call(services.list, {keys: {name: 'store/unit'}})
      if (list && list.length) {
        yield put({
          type: 'setUnitList',
          payload: list,
        })
      }
    },
    * getPlateList(t,{  call, put }){
      const {list} = yield call(services.list, {keys: {name: 'store/projectcategory'}})
      if (list && list.length) {
        let obj = list.map(i => {
          return Object.assign(i, {value: i.categoryId, label: i.categoryName})
        })
        yield put({
          type: 'setPlateList',
          payload: obj,
        })
      }
    },
  },
})
