/* global window */
/* global document */
/* global location */
/* eslint no-restricted-globals: ["error", "event"] */

import { routerRedux } from 'dva/router'
// import { parse } from 'qs'
import config from 'config'
import { message } from 'antd'
// import { EnumRoleType } from 'enums'
// import queryString from 'query-string'
import services from '../services/index'
import meuns from '../utils/menus'

const { prefix } = config

const dontNeedBackgroundPages = config.dontNeedBackgroundPages // contentData不需要样式的页面路由

export default {
  namespace: 'app',
  state: {
    user: { username: window.localStorage.getItem('loginInfo') },
    hasAccountPermission: false, //是否拥有结账权限
    permissions: [],
    menu: [],
    menuPopoverVisible: false,
    siderFold: window.localStorage.getItem(`${prefix}siderFold`) === 'true',
    darkTheme: window.localStorage.getItem(`${prefix}darkTheme`) === 'true' || true,
    isNavbar: document.body.clientWidth < 769,
    navOpenKeys: JSON.parse(window.localStorage.getItem(`${prefix}navOpenKeys`)) || [],
    locationPathname: '',
    locationQuery: {},
    addBreads: {},
    isAdding: false, //是否急件入库中
    lastActive: -1, //记录离开的位置
    isdone: false, //是否入库完毕
    backRoute: '', //返回的路由
    contentStyle: {}, // 当前路由页面的样式
    isModal: false, // 全局的流程modal状态
    showResetPasswordModal: false, // 是否显示修改密码弹窗
    messageList:[],//系统通知条数
    hasRecevice:false,//系统跟新
    feedbackVisible: false,// 意见反馈
    showService: false,// 显示/隐藏客服
    resetBreads: {}, // 自定义面包屑
  },
  subscriptions: {
    setupHistory({ dispatch, history }) {
      history.listen(location => {
        dispatch({ type: 'setBreads' }) //清空新建bread
        if(localStorage.getItem('permissionRole')) {
          dispatch({
            type: 'setAccountPermission',
            payload: { hasAccountPermission: JSON.parse(localStorage.getItem('permissionRole')).findIndex(_ => _ === '45287e22') > -1 },
          })
        }
        // 验证是否登录
        if (location.pathname !== '/login') {
          if(location.pathname !== '/'){
            if (!sessionStorage.getItem('tk')) {
              dispatch({
                type: 'backLogin',
              })
            }else {
              // 权限路由
              const { pathname } = location
              window.localStorage.setItem('curPath', pathname)
              let temp, show
              const findPermission = menu => {
                menu.forEach(v => {
                  if (v.route && v.route === pathname) {
                    temp = v.permissions
                    show = v.show
                  }
                  if (v.children) {
                    findPermission(v.children)
                  }
                })
                return temp
              }
              let curPermission = findPermission(meuns)
              if (localStorage.getItem('permissionRole')) {
                let permissionRole = JSON.parse(localStorage.getItem('permissionRole'))
                if (curPermission) {
                  const isParentMenu = Array.isArray(curPermission)
                  if (isParentMenu) {
                    let flag = false
                    for (let i = 0; i < curPermission.length; i++) {
                      if (permissionRole.indexOf(curPermission[i]) > -1) {
                        flag = true
                        break
                      }
                    }
                    if (!flag) {
                      message.error('无访问权限!')
                      setTimeout(() => {
                        history.goBack()
                      }, 300)
                    }
                  } else {
                    if (permissionRole.indexOf(curPermission) === -1) {
                      message.error('无访问权限!')
                      setTimeout(() => {
                        history.goBack()
                      }, 300)
                    }
                  }
                } else {
                  if (show) {
                    if (!show()) {
                      message.error('无访问权限!')
                      setTimeout(() => {
                        history.goBack()
                      }, 300)
                    }
                  }
                }
              }
            }
          }
        }
        /** 当前的路由不需要背景等基础样式时, 进行调整 */
        if (dontNeedBackgroundPages.find(path => path === location.pathname)) {
          dispatch({
            type: 'setContentStyle',
            payload: {},
          })
        } else {
          dispatch({
            type: 'setContentStyle',
            payload: {
              marginTop: '32px',
              paddingBottom: '32px',
              background: 'white',
              boxShadow: '5px 0px 10px rgba(0, 0, 0, 0.03)',
            },
          })
        }
        dispatch({
          type: 'updateState',
          payload: {
            locationPathname: location.pathname,
            locationQuery: location.query,
            menu: meuns,
          },
        })
      })
    },
    setup({ dispatch }) {
      dispatch({ type: 'setDefault' })
      let tid
      window.onresize = () => {
        clearTimeout(tid)
        tid = setTimeout(() => {
          dispatch({ type: 'changeNavbar' })
        }, 300)
      }
    },
  },
  effects: {
    *backLogin(t, { put }) {
      yield put(routerRedux.push({ pathname: '/login' }))
    },
    *setDefault(t, { put }) {
      yield put({
        type: 'updateState',
      })
      // 默认跳转登录页
      const { pathname } = location
      if (pathname === '' || pathname === '/') {
        yield put(routerRedux.push({ pathname: '/login' }))
      }
    },

    *changeNavbar(action, { put, select }) {
      const { app } = yield select(_ => _)
      const isNavbar = document.body.clientWidth < 769
      if (isNavbar !== app.isNavbar) {
        yield put({ type: 'handleNavbar', payload: isNavbar })
      }
    },
    //--------系统通知(当刷新页面和从新登陆时候触发)-------------messageNoifyStore门店  messageNoifyBrand品牌商
    *getSystemMessage(action,{ put ,call }){
      const loginType = localStorage.getItem('loginType')
      if( loginType * 1 === 2 || loginType * 1 === 3 ){
        const { list  } = yield call(loginType*1 === 3 ? services.messageNoifyStore :services.messageNoifyBrand  )
        yield put({
          type:'setSystemMessage',
          payload:list.sort((b,a)=>a.time-b.time),
        })
      }
    },
    //-------------------------------------------------------
    *logout(t, { put }) {
      yield put({
        type: 'updateState',
      })
      yield put(routerRedux.push({ pathname: '/login' }))
      localStorage.clear()
      sessionStorage.clear()
    },
  },
  reducers: {
    setSystemMessage(state,{ payload }){
       return {
          ...state,
          messageList:payload,
       }
    },
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },
    switchSider(state) {
      window.localStorage.setItem(`${prefix}siderFold`, !state.siderFold)
      return {
        ...state,
        siderFold: !state.siderFold,
      }
    },
    setAccountPermission(state, { payload } ) {
     return {
       ...state,
       hasAccountPermission: payload.hasAccountPermission,
     }
    },
    switchTheme(state) {
      window.localStorage.setItem(`${prefix}darkTheme`, !state.darkTheme)
      return {
        ...state,
        darkTheme: !state.darkTheme,
      }
    },

    switchMenuPopver(state) {
      return {
        ...state,
        menuPopoverVisible: !state.menuPopoverVisible,
      }
    },

    goFeedback(state) {
      return {
        ...state,
        feedbackVisible: !state.feedbackVisible,
      }
    },

    toshowService(state) {
      console.log(11111,state.showService)
      return {
        ...state,
        showService: !state.showService,
      }
    },

    handleNavbar(state, { payload }) {
      return {
        ...state,
        isNavbar: payload,
      }
    },

    handleNavOpenKeys(state, { payload: navOpenKeys }) {
      return {
        ...state,
        ...navOpenKeys,
      }
    },

    setBreads(state, { payload }) {
      return {
        ...state,
        addBreads: payload,
      }
    },

    changeStatus(state, { payload }) {
      let key = payload.key
      return {
        ...state,
        [key]: payload.value,
      }
    },

    resetState(state) {
      return {
        ...state,
        isAdding: false,
        lastActive: -1,
        isdone: false,
        backRoute: '',
      }
    },

    setContentStyle(state, { payload }) {
      return {
        ...state,
        contentStyle: payload,
      }
    },

    changeModal(state) {
      const { isModal } = state
      return {
        ...state,
        isModal: !isModal,
      }
    },

    showSetPassword(state, { payload }) {
      return {
        ...state,
        showResetPasswordModal: payload,
      }
    },
    // 自定义面包屑
    resetBreads(state, { payload }) {
      return {
        ...state,
        resetBreads: payload,
      }
    },
  },
}
