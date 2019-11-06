/**
 * create tree model
 * 用来返回一个完整的tree页面数据模型
 * 2018-8-20
 * 李冯
 * @type {String}
 */

import services from 'services'
import { arrayToTreeData } from 'utils'
import { message } from 'antd'
import config from 'utils/tree'
import { delay } from 'redux-saga'

export default type => (opts = config[type]) => ({
	namespace: opts.type,

	state: {
		treeData: [],
		loaded: false,
		showCreate: false,
		btnLoading: false,
		workTypeList: [],
	},

	effects: {
		/**
		 * 获取数据
		 * @param  {Object}    payload 请求参数
		 * @param  {function}    call    包裹异步方法
		 * @return {Generator}         [description]
		 */
		*getTreeData(t, { call, put }) {
			yield put({
				type: 'setLoad',
				payload: false,
			})

			const api = yield opts.apiIsNew ? services.LIST : services.list

			const { list } = yield call(api, {
				keys: { name: opts.api },
				data: {
					q: { limit: 1000 },
				},
			})

			if (list && list.length) {
				yield put({
					type: 'setData',
					payload: arrayToTreeData(
						list.map(_ => ({
							..._,
							title: _[opts.apiName],
							key: _[opts.id],
						})),
						'pId',
						opts.id,
						0
					).children,
				})
			} else {
				yield put({
					type: 'setData',
					payload: [],
				})
			}
			yield put({
				type: 'setLoad',
				payload: true,
			})
		},

		/**
		 * 添加子节点数据
		 * @param  {[type]}    payload [description]
		 * @param  {[type]}    name    [description]
		 * @param  {[type]}    call    [description]
		 * @param  {[type]}    put     [description]
		 * @return {Generator}         [description]
		 */
		*add(
			{
				payload: { formData, form },
			},
			{ call, put }
		) {
			yield put({
				type: 'setBtnLoading',
				payload: true,
			})

			yield put({
				type: 'setLoad',
				payload: false,
			})

			const api = yield opts.apiIsNew ? services.INSERT : services.insert

			const res = yield call(api, {
				keys: { name: opts.api },
				data: { ...formData },
			})

			yield put({
				type: 'setBtnLoading',
				payload: false,
			})

			if (res.code === '0') {
				yield put({
					type: 'setShowCreate',
					payload: false,
				})
				yield form.resetFields()
				yield put({
					type: 'getTreeData',
				})
				yield message.success(<span>添加成功</span>)
			} else {
				yield message.error(res.content)
			}
		},

		/**
		 * 删除
		 * @param  {[type]}    payload [description]
		 * @param  {[type]}    put     [description]
		 * @param  {[type]}    call    [description]
		 * @return {Generator}         [description]
		 */
		*del(
			{
				payload: { id, cb },
			},
			{ put, call }
		) {
			yield put({
				type: 'setLoad',
				payload: false,
			})

			let res

			if (opts.apiIsNew) {
				res = yield call(services.DELETE, {
					keys: { name: opts.api, id },
					data: { type: 1 },
				})
			} else {
				res = yield call(services.del, {
					keys: { name: opts.api },
					data: { [opts.id]: id },
				})
			}

			if (res.code === '0') {
				yield put({
					type: 'getTreeData',
				})
				yield cb(() =>
					message.success(
						<span>
							删除成功
							{/* <span
                className="btn"
                onClick={() =>
                  dispatch({ type: opts.type + "/revoke", payload: { id } })
                }
              >
                撤回
              </span> */}
						</span>
					)
				)
			} else {
				yield put({
					type: 'setLoad',
					payload: true,
				})
			}
		},

		/**
		 * 撤回
		 * @param  {[type]}    payload [description]
		 * @param  {[type]}    put     [description]
		 * @param  {[type]}    call    [description]
		 * @return {Generator}         [description]
		 */
		*revoke(
			{
				payload: { id },
			},
			{ put, call }
		) {
			yield put({
				type: 'setLoad',
				payload: false,
			})

			let res

			if (opts.apiIsNew) {
				res = yield call(services.DELETE, {
					keys: { name: opts.api, id },
					data: { type: 0 },
				})
			} else {
				res = yield call(services.revoke, {
					keys: { name: opts.api },
					data: { [opts.id]: id },
				})
			}

			if (res.code === '0') {
				yield put({
					type: 'getTreeData',
				})
				yield message.success(<span>撤回成功</span>)
			} else {
				yield put({
					type: 'setLoad',
					payload: true,
				})
			}
		},

		/**
		 * 更新
		 * @param  {[type]}    payload [description]
		 * @param  {[type]}    put     [description]
		 * @param  {[type]}    call    [description]
		 * @return {Generator}         [description]
		 */
		*update(
			{
				payload: { id, formData, form, pid },
			},
			{ put, call }
		) {
			yield put({
				type: 'setShowCreate',
				payload: false,
			})

			yield put({
				type: 'setBtnLoading',
				payload: true,
			})

			yield put({
				type: 'setLoad',
				payload: false,
			})

			let res
			if (opts.apiIsNew) {
				res = yield call(services.UPDATE, {
					keys: { name: opts.api, id },
					data: { ...formData, pid },
				})
			} else {
				res = yield call(services.update, {
					keys: { name: opts.api },
					data: { [opts.id]: id, ...formData },
				})
			}

			if (res.code === '0') {
				yield form.resetFields()
				yield put({
					type: 'setBtnLoading',
					payload: false,
				})
				yield put({
					type: 'getTreeData',
				})
				yield message.success(<span>修改成功</span>)
			} else {
				yield put({
					type: 'setBtnLoading',
					payload: false,
				})
				yield put({
					type: 'setLoad',
					payload: true,
				})
			}
		},

		/**
		 * 自动加载动画
		 * @param  {[type]}    n   [description]
		 * @param  {[type]}    put [description]
		 * @return {Generator}     [description]
		 */
		*autoLoad(n, { put }) {
			yield put({ type: 'setLoad', payload: false })
			yield delay(400)
			yield put({ type: 'setLoad', payload: true })
		},
	},

	reducers: {
		/**
		 * 写入数据
		 * @param {[type]} state   [description]
		 * @param {[type]} payload [description]
		 */
		setData(state, { payload }) {
			console.log(payload)
			return {
				...state,
				treeData: payload,
				loaded: true,
			}
		},

		/**
		 * 设置树的加载状态
		 * @param {[type]} state   [description]
		 * @param {[type]} payload [description]
		 */
		setLoad(state, { payload }) {
			return {
				...state,
				loaded: payload,
			}
		},

		/**
		 * 设置创建表单模态窗显示
		 * @param {[type]} state   [description]
		 * @param {[type]} payload [description]
		 */
		setShowCreate(state, { payload }) {
			return {
				...state,
				showCreate: payload,
			}
		},

		/**
		 * 设置按钮的加载状态
		 * @param {[type]} state   [description]
		 * @param {[type]} payload [description]
		 */
		setBtnLoading(state, { payload }) {
			return {
				...state,
				btnLoading: payload,
			}
		},

		setWorkTypeList(state, { payload }) {
			return {
				...state,
				workTypeList: payload,
			}
		},
	},
})
