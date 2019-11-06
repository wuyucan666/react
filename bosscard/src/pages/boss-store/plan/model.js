// import services from '../../services'
import { model } from 'utils/model'
import modelExtend from 'dva-model-extend'
import services from "../../../services"
import { setPlan } from './util'

export default modelExtend(model, {
  namespace: 'storeStaffPlan',
  state: {
    editItem: {},
    storePlan: [],
    planId: 0, // 计划详情id
    staffArr: [], // 门店计划详情
    status: 0, // 计划详情状态
    staffPlan: [],
    staffPlanData: [], // 员工计划详情
    currentStaff: '',
    statusStaff: 0, // 员工计划详情状态
    planIdStaff: 0, // 员工计划详情id
  },
  reducers: {
    save(state, { payload }) {
      let editItem = payload
      return { ...state, editItem }
    },
    goStaff(state, { payload }) {
      let staffArr = payload
      return { ...state, staffArr }
    },
    goStorePlan(state, { payload }) {
      const { planId, storePlan, status, noActual } = payload
      return { ...state, storePlan, planId, status, noActual }
    },
    goPlan(state, { payload }) {
      // 编辑计划
      const { str, index, current } = payload
      let item = current ? state.staffPlanData[index] : state.storePlan[index]
      let d = item.totaldata / str * 100
      let strd = str
      if (str.split('.')[1] === undefined) {
        strd = str * 1
      }
      if (current) {
        state.staffPlanData[index].plandata = strd
        state.staffPlanData[index].complete = (item.totaldata && str) ? d >= 100 ? 100 : parseInt(d) : 0
        state.staffPlanData[index].progress = (item.totaldata && str) ? parseInt(d) : 0
      } else {
        state.storePlan[index].plandata = strd
        state.storePlan[index].complete = (item.totaldata && str) ? d >= 100 ? 100 : parseInt(d) : 0
        state.storePlan[index].progress = (item.totaldata && str) ? parseInt(d) : 0
      }
      return { ...state, storePlan: state.storePlan, staffPlanData: state.staffPlanData }
    },
    goStoreStaffplan(state, { payload }) {
      const { staffPlan, staffArr } = payload
      return { ...state, staffPlan, staffArr }
    },
    gosetStaffPlan(state, { payload }) {
      const { staffPlanData, statusStaff, planIdStaff, currentStaff } = payload
      return { ...state, staffPlanData, statusStaff, planIdStaff, currentStaff }
    },
  },
  effects: {
    * edit({
      payload,
    }, { put }) {
      yield put({
        type: 'save',
        payload: payload,
      })
    },
    *getStorePlan({ payload }, { put, call }) {
      const { data } = yield call(services.getStorePlanData, { data: { createMonth: payload } })
      let storePlan = []
      let planId = 0
      let status = 0
      let noActual = []
      if (data.plandata) {
        storePlan = setPlan(data.plandata, data.totaldata)
        planId = data.plandata.id
        status = data.plandata.status
        let g = storePlan[0].totaldata ? parseFloat(storePlan[0].totaldata) : 0
        let f = storePlan[0].not ? parseFloat(storePlan[0].not) : 0
        noActual = [{ type: "已完成", value: g }, { type: "未完成", value: f }]
      }

      yield put({
        type: "goStorePlan",
        payload: { storePlan, planId, status, noActual },
      })
    },
    *getStoreStaffplan({ payload }, { put, call }) {
      // 请求员工计划数据
      const { list } = yield call(services.getStoreStaffplan, { data: { createMonth: payload } })
      const staff = yield call(services.staffListData, payload)
      let arr = staff.list
      for (let i in list) {
        let p = list[i].planOutput ? parseFloat(list[i].planOutput) : 0
        let t = list[i].completeOutput ? parseFloat(list[i].completeOutput) : 0
        list[i].progress = ((p && t) ? parseInt(t / p * 100) : 0) + '%'
        list[i].key = i
        for (let j in arr) {
          // 把已经有计划的员工删除
          if (arr[j].staffId === list[i].staffId) {
            arr.splice(j, 1)
          }
        }
      }
      yield put({
        type: "goStoreStaffplan",
        payload: { staffPlan: list, staffArr: arr },
      })
    },
    *setPlan({ payload }, { put }) {
      // 编辑计划
      yield put({
        type: "goPlan",
        payload: payload,
      })
    },
    *setStaffPlan({ payload }, { put, call }) {
      const { data } = yield call(services.DETAIL, {
        keys: { name: "store/staffplan", id: payload.id },
        data: { createMonth: payload.time },
      })
      let staffPlanData = []
      let planIdStaff = 0
      let statusStaff = 0
      let currentStaff = ''
      if (data.plandata) {
        staffPlanData = setPlan(data.plandata, data.totaldata, true)
        planIdStaff = data.plandata.id
        statusStaff = data.plandata.status
        currentStaff = data.staffName
      }
      yield put({
        type: "gosetStaffPlan",
        payload: { staffPlanData, statusStaff, planIdStaff, currentStaff },
      })
    },
  },
})
