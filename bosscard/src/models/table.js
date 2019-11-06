/**
 * 表格组件的redux
 */
import tableConfig from "../utils/table"
import services from "../services"
import { message } from "antd"

let pageData = {}
let getDataKey = ''

Object.keys(tableConfig).map((key) => {
  if (pageData[key]) {
    throw new Error("重复的表格配置: " + key)
  } else {
    pageData[key] = {
      page: 1, // 当前第几页, 1开始
      limit: 10, // 每页多少条数据
      total: 0, // 数据总数
      where: {}, // 自定义条件查询
      order: {}, // 排序条件
    }
  }
  return false
})

/**
 * 得到最终headers存入state
 */

export default {
  namespace: "table",
  state: {
    data: [], // 表格展示数据
    header: [], // 当前头部
    total: {},
    loading: false, // 表格是否加载
    // tableConfig, // 表格所有配置
    pageData, // 表格加载数据的条件
    curSize: 0, // 当前一页有几条数据 甘明凤2019-05-15
    name: "", // 表格当前名称
    colSpan: 8, // 头部筛选组件显示规则
    totalSize: 0, //总数量
    selectedRowKeys: [], // 表格选择的项
    // 阻断时间 当请求的时间小于这个时间，请求的数据作废
    interdictTime: 0,
  },
  effects: {
    /**
     * 获取表格数据
     * @param  {[type]} options.payload [description]
     * @param  {[type]} options.put     [description]
     * @return {[type]}                 [description]
     */
    *getData({ payload = {} }, { put, call, select }) {
      yield put({ type: "setLoading", payload: true })
      const startTime = new Date().getTime()
      const name = yield select((_) => _.table.name)
      let pageData = yield select((_) => _.table.pageData[name])
      if (name === 'maintain/order') {
        pageData.where['type'] && delete pageData.where['state|deleted']
      }
      getDataKey = new Date().getTime() + name
      const res = yield call(
        payload.new ? services.LIST : services.list,
        {
          keys: { name },
          data: payload.mock ? {} : { ...payload.wrapperQuery, q: { ...pageData, total: undefined } },
          proxy: payload.mock,
          key: getDataKey,
        }
      )
      if (res && res.key === getDataKey) {
        const { totalSize, list, total, curSize } = res
        const interdictTime = yield select((_) => _.table.interdictTime)
        if (interdictTime < startTime) {
          yield put({
            type: "setTotalData",
            payload: total,
          })
          yield put({
            type: "setData",
            payload: list,
          })
          yield put({
            type: 'setTotalSize',
            payload: totalSize,
          })
          yield put({ type: "setPageData", payload: { total: totalSize, curSize } })
          yield put({ type: "setLoading", payload: false })
        }
      } else {
        yield put({ type: "setLoading", payload: false })
      }
    },

    /**
     * 获取当前表格配置
     * @param  {Object} payload [description]
     * @param  {function} put     [description]
     * @return {[type]}                 [description]
     */
    *getTableConfig({ payload }, { put }) {
      yield put({ type: "setName", payload })
      /**
       * 此处比较本地头部数据
       * 优先使用本地数据
       * @type {String}
       */
    },

    /**
     * 删除
     * @param  {[type]}    payload [description]
     * @param  {[type]}    put     [description]
     * @param  {[type]}    call    [description]
     * @param  {[type]}    select  [description]
     * @return {Generator}         [description]
     */
    *del({ payload }, { put, call, select }) {
      yield put({ type: "setLoading", payload: true })
      const name = yield select((_) => _.table.name)
      let res = ""
      if (payload.new) {
        res = yield call(services.DELETE, {
          keys: { name, id: payload.idVal },
          data: { type: 1 },
          proxy: payload.mock,
        })
      } else {
        res = yield call(services.del, { keys: { name }, data: payload })
      }
      if (res.code === "0") {
        message.success(
          <span>
            删除成功
            {/* <span
              style={{ margin: "0 6px", color: "#4AACF7", cursor: "pointer" }}
              onClick={() => payload.cb()}
            >
              撤回
            </span> */}
          </span>
        )
        yield put({ type: "getData", payload: { new: payload.new } })
      } else {
        yield put({ type: "setLoading", payload: false })
      }
    },

    /**
     * 撤回
     * @param  {[type]}    payload [description]
     * @param  {[type]}    put     [description]
     * @param  {[type]}    call    [description]
     * @param  {[type]}    select  [description]
     * @return {Generator}         [description]
     */
    *revoke({ payload }, { put, call, select }) {
      yield put({ type: "setLoading", payload: true })
      const name = yield select((_) => _.table.name)
      let res
      if (payload.new) {
        res = yield call(services.DELETE, {
          keys: { name, id: payload.idVal },
          data: { type: 0 },
          proxy: payload.mock,
        })
      } else {
        res = yield call(services.revoke, { keys: { name }, data: payload })
      }
      if (res.code === "0") {
        yield message.destroy()
        yield put({ type: "getData", payload: { new: payload.new } })
        yield message.success(<span>撤回成功</span>)
      }
    },
    /**
     * 搜索表格数据
     * @param {Object} param0
     * @param {Object} param1
     */
    *search({ payload }, { put }) {
      console.log('dispatch search success')
      yield put({
        type: "setPageData",
        payload: {
          where: payload.query,
          page: 1,
        },
      })
      yield put({
        type: "getData",
        payload: { new: payload.new, mock: payload.mock, wrapperQuery: payload.wrapperQuery || {} },
      })
    },
  },

  reducers: {
    /**
     * 设置加载状态
     * @param {[type]} state           [description]
     * @param {[type]} options.payload [description]
     */
    setLoading(state, { payload }) {
      return {
        ...state,
        loading: payload,
      }
    },
    setTotalSize(state, { payload }) {
      return {
        ...state,
        totalSize: payload,
      }
    },
    /**
     * 设置表格模块名称
     * @param {[type]} state           [description]
     * @param {[type]} options.payload [description]
     */
    setName(state, { payload }) {
      return {
        ...state,
        name: payload,
      }
    },

    /**
     * 设置表格数据
     * @param {[type]} state           [description]
     * @param payload
     */
    setData(state, { payload }) {
      return {
        ...state,
        data: payload.map((_, index) => ({
          ..._,
          key: new Date().getTime() + index,
        })),
        selectedRowKeys: [],
      }
    },
    /**
     * 设置合计的数据
     * @param {Object} state state
     * @param {Object} param1 total数据
     */
    setTotalData(state, { payload }) {
      return {
        ...state,
        total: payload,
      }
    },

    /**
     * 设置页面数据条件信息
     * @param {[type]} state   [description]
     * @param {[type]} payload [description]
     */
    setPageData(state, { payload }) {
      let newPageData = { ...state.pageData }

      newPageData[state.name] = {
        ...newPageData[state.name],
        ...payload,
      }

      return {
        ...state,
        pageData: newPageData,
      }
    },

    /**
     * 设置高亮行
     * @param {[type]} state   [description]
     * @param {[type]} payload [description]
     */
    setRowActive(state, { payload }) {
      let newData = [...state.data]

      newData = newData.map((v) => {
        if (v.key === payload.key) {
          return {
            ...v,
            ...payload,
          }
        } else {
          return v
        }
      })

      return {
        ...state,
        data: newData,
      }
    },

    /**
     * 设置col组件显示规则
     * @param {Object} state State
     * @param {Object} param1 Redux Actions
     */
    setColSpan(state, { payload }) {
      return {
        ...state,
        colSpan: payload,
      }
    },

    /**
     * 设置选择的项
     */
    setSelectedRowKeys(state, { payload }) {
      return {
        ...state,
        selectedRowKeys: payload,
      }
    },
    /**设置阻断时间 */
    setInterdictTime(state, { payload }) {
      return {
        ...state,
        interdictTime: payload,
      }
    },
  },
  subscriptions: {
    setup({ dispatch }) {
      const getInfo = () => {
        const tableScreenWindow = document.querySelector(".screen-container")
        if (tableScreenWindow) {
          dispatch({
            type: "setColSpan",
            payload: tableScreenWindow.clientWidth > 558 ? 8 : 12,
          })
          dispatch({
            type: "setWidth",
            payload: tableScreenWindow.clientWidth,
          })
          dispatch({
            type: 'setInterdictTime',
            payload: new Date().getTime(),
          })
        }
      }
      dispatch({ type: "query" })
      let tid
      window.onresize = () => {
        clearTimeout(tid)
        tid = setTimeout(getInfo, 100)
      }
    },
  },
}
