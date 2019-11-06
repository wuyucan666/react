import services from 'services'
import { model } from 'utils/model'
import modelExtend from 'dva-model-extend'
import {arrayToTreeData} from 'utils'
import {message} from 'antd'

export default  modelExtend(model, {
  namespace: 'store/roleList',
  state:{
    editItem:{},
    loading: false,
    perModalStatus: false, // 权限分配modal窗口显示状态
    permission: [], // 权限列表
    btnLoading: false, // 按钮是否显示加载状态
    selectPermession: [], // 拥有的权限列表
  },
  reducers: {
    save(state, { payload }){
      let editItem = payload
      return { ...state, editItem}
    },
    setPerModalStatus (state, {payload}) {
      return {...state, perModalStatus: payload}
    },
    setPermission (state, {payload}) {
      return {
        ...state,
        permission: arrayToTreeData(payload, 'pid', 'perId').children,
      }
    },

    setBtnloading (state, {payload}) {
      return {
        ...state,
        btnLoading: payload,
      }
    },

    setLoadingStatus(state, {payload}) {
      return {
        ...state,
        loading: payload,
      }
    },

    setSelectPermession (state, {payload}) {
      return {
        ...state,
        selectPermession: payload.map(_ => String(_)),
      }
    },
  },
  effects: {
    /**
     * 获取用户权限数据
     * @param  {[type]}    payload [description]
     * @param  {[type]}    put     [description]
     * @param  {[type]}    call    [description]
     * @return {Generator}         [description]
     */
    * getPermission ({payload}, {put, call}) {
      yield put({type: 'setLoadingStatus', payload: true})

      const {permissions, checked} = yield call(services.list, {keys: {name: 'brand/permissionrole'}, data: {q: {where: {roleId: payload}}}})

      if (permissions) {
        yield put({type: 'setPermission', payload: permissions})
      }

      if (checked) {
        yield put({type: 'setSelectPermession', payload: checked})
      }

      yield put({type: 'setLoadingStatus', payload: false})

    },
    * edit({
      payload,
    },{  put }){
      yield put({
        type: 'save',
        payload: payload,
      })
    },

    /**
     * 分配权限
     * @param  {[type]}    payload [description]
     * @param  {[type]}    call    [description]
     * @param  {[type]}    put     [description]
     * @return {Generator}         [description]
     */
    * setPer ({payload}, {call, put}) {
      yield put({type: 'setBtnloading', payload: true})
      const {code} = yield call(services.distributeBrandPer, {data: payload})
      yield put({type: 'setBtnloading', payload: false})

      if (code === '0') {
        yield put({type: 'setPerModalStatus', payload: false})
        yield message.success('分配成功')
      } else {
        yield message.error('分配失败')
      }

      return code
    },
  },
})
