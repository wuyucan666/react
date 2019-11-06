import { routerRedux } from 'dva/router'
import { message } from 'antd'
import switchRouter from '../../utils/switchRouter'
import request from 'utils/request'
export default {
  namespace: 'login',
  state: {
    type: 1, // 页面类型 1 登录 2 找回密码
  },
  reducers: {
    setState(state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },
  },
  effects: {
    *login({ payload, callback }, { put, call, select }) {
      const data = yield call(request, { url: 'login', method: 'post', data: payload, skip: true })
      const { locationQuery } = yield select(_ => _.app)
      if (data.success && data.statusCode === '0') {
        sessionStorage.setItem('tk', data.list.token)

        const { from } = locationQuery
        localStorage.setItem('permissionRole', JSON.stringify(data.list.permission))
        if (!data.list.permission.length) {
          message.error('请联系管理员设置权限')
          return
        }
				/**
				 * 储存登录用户类型
				 * 用来判断操作权限
				 */
        localStorage.setItem('loginType', JSON.stringify(data.list.loginType))
        localStorage.setItem(
          'loginInfo',
          JSON.stringify({ name: data.list.loginName, img: data.list.headImg, brandName: data.list.brandName, storeName: data.list.storeName, roleName: data.list.roleName })
        )
        localStorage.setItem('category', data.list.category)
        localStorage.setItem('see', data.list.see)
        localStorage.setItem('coiling', data.list.coiling)
        localStorage.setItem('storeId', data.list.storeId)
        localStorage.setItem('staffId', data.list.staffId)
        if (from && from !== '/login') {
          yield put(routerRedux.push(from))
        } else {
          // loginType 字段
          // 1	管理员
          // 2	品牌商
          // 3	门店
          switch (data.list.loginType) {
            case 1:
              const peimissions = [
                {
                  key: 79,
                  path: '/super-admin/administor',
                },
                {
                  key: 81,
                  path: '/super-admin/role',
                },
                {
                  key: 82,
                  path: '/super-admin/brand-manage',
                },
                {
                  key: '3403ea6c',
                  path: '/super-admin/implement-monitoring',
                },
                {
                  key: '1fe723bb',
                  path: '/super-admin/systemInformation',
                },
              ]
              yield put(routerRedux.push(switchRouter(peimissions)))
              break
            case 2:
              yield put(routerRedux.push('/boss-brand/index'))
              break
            case 3:
              yield put(routerRedux.push('/boss-store/index'))
              break
            default:
              console.error('登录类型不合法')
          }
        }
      } else {
        callback({ type: data.code, text: data.message })
      }
    },
  },
}
