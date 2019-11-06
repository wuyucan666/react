/**
 * 基于antd与设计稿符合的树形组件
 * 2018-8-20
 * 李冯
 */

import { Component } from 'react'
import { Tree, Spin, Button, Icon, Tooltip } from 'antd'
import PropTypes from 'prop-types'
import style from './tree.less'
import moment from 'moment'
import { connect } from 'dva'
import router from 'umi/router'
const { TreeNode } = Tree

class Trees extends Component {
	constructor(props) {
		super(props)

		this.state = {
			showBtn: -1,
		}
	}

	componentDidMount() {}
	goGoodsPage = (type, categoryId) => {
		switch (type) {
			case 'projectCategory':
				router.push(`/boss-brand/project?categoryId=${categoryId}`)
				break
			case 'productCategory':
				router.push(`/boss-brand/product?categoryId=${categoryId}`)
				break
			case 'storeProjectCategory':
				router.push(`/boss-store/project-store?categoryId=${categoryId}`)
				break
			case 'storeProductCategory':
				router.push(`/boss-store/product?categoryId=${categoryId}`)
				break
			default:
				console.log(type)
		}
	};
	render() {
		const createBtn = (pid, level, quantity) => (
			<Button type="dashed" className={style.theme} onClick={() => this.props.add(pid, level, quantity)}>
				<Icon type="plus" />
				{this.props.addTitle}
			</Button>
		)
		const delBtn = (id, disabled) => (
			<span className={style.icon + (disabled ? ' disabled' : '')} onClick={() => this.props.del(id)}>
				<i className="icon-shanchu iconfont" />
			</span>
		)
		const editBtn = (arg, disabled) => (
			<span
				className={style.icon + (disabled ? ' disabled' : '')}
				onClick={() => this.props.edit(arg)}
				style={{
					cursor: disabled ? '' : 'pointer',
				}}
			>
				<i className="icon-bianji iconfont" />
			</span>
		)

		// 用户身份
		const loginType = localStorage.getItem('loginType')

		/** 门店服务分类类别 1 只可查看 2 可添加可编辑 */
		const category = Number(localStorage.getItem('category'))

		const renderTitle = prop => {
			let content = ''

			if (!this.props.isRegional) {
				content = (
					<span className="item" style={{ textAlign: 'right' }}>
						{!!prop.quantity && (
							<span
								style={{
									width: 14 + '%',
									display: 'inline-block',
									textAlign: 'left',
								}}
							>
								项目数：{prop.quantity}
								<a
									style={{ marginLeft: 10 }}
									onClick={() => this.goGoodsPage(prop.type, prop.categoryId)}
								>
									查看 >
								</a>
							</span>
						)}
						<span
							style={{
								width: 14 + '%',
								display: 'inline-block',
								textAlign: 'left',
							}}
						>
							来源：{prop.formTem === 1 ? '品牌商' : '门店'}
						</span>
						{this.props.isProject && prop.formTem !== 1 ? (
							<span
								style={{
									width: 14 + '%',
									display: 'inline-block',
									textAlign: 'left',
								}}
							>
								工时分类：{prop.manHourName}
							</span>
						) : (
							''
						)}
						<span
							style={{
								width: 18 + '%',
								display: 'inline-block',
								textAlign: 'left',
							}}
						>
							备注：
							<Tooltip title={prop.remark}>
								{prop.remark.length > 10 ? prop.remark.slice(0, 10) + '...' : prop.remark}
							</Tooltip>
						</span>
						<span
							style={{
								width: 25 + '%',
								display: 'inline-block',
								textAlign: 'left',
							}}
						>
							创建时间：
							{moment(prop.created * 1000).format('YYYY-MM-DD HH:mm:ss')}
						</span>
					</span>
				)
			}
			return (
				<div
					className="flex"
					onMouseEnter={() => this.setState({ showBtn: prop.pid })}
					onMouseLeave={() => this.setState({ showBtn: -1 })}
				>
					{prop.title}
					<div
						className={
							(this.state.showBtn === prop.pid || !this.props.hideBtn ? style.show : style.hide) +
							' item flex'
						}
						style={{ alignItems: 'center' }}
					>
						{content}{' '}
						{category !== 1 && editBtn(prop, prop.disabled && prop.type !== 'storeProjectCategory')}{' '}
						{category !== 1 && delBtn(prop[this.props.id], !!prop.quantity || prop.disabled)}
					</div>
				</div>
			)
		}

		/**
		 * 渲染树杈节点
		 * @param {Object} data 数据
		 * @param {Number} pid 父级的id
		 * @param {Boolean} parentDisbled 父级是否禁止
		 * @param {Number} level 层级
		 * @param {Number} quantity 含有项目数量
		 * @return {[type]}      [description]
		 */
		const renderTreeNodes = (data, pid = 0, parentDisbled, level, quantity) => {
			const list = data.map(item => {
				const disabled = item.formTem === 1 && Number(loginType) !== 2 && this.props.type !== 'productCategory'
				const title = renderTitle({
					pid: item[this.props.id],
					...item,
					disabled: disabled,
					type: this.props.type,
				})
				// 项目产品分类二级
				// 维修类型三级
				// 大区无限级
				if (item.children && (pid === 0 || this.props.isRegional || (this.props.isMaintenance && level < 3))) {
					return (
						<TreeNode title={title} key={String(item.key)} disabled={disabled}>
							{renderTreeNodes(item.children, item[this.props.id], disabled, level + 1, item.quantity)}
						</TreeNode>
					)
				}
				return <TreeNode key={item.key} title={title} disabled={disabled} />
			})
			if (category !== 1) {
				list.unshift(<TreeNode key={pid + 'base'} title={createBtn(pid, level, quantity)} />)
			}
			return list
		}

		let showTree = this.props.loaded || this.props.treeData.length

		setTimeout(() => (showTree = this.props.loaded), 3000)

		return (
			<Spin spinning={!this.props.loaded}>
				<div className={style.tree}>
					{showTree ? (
						<Tree onExpand={() => this.props.dispatch({ type: this.props.type + '/autoLoad' })} showLine>
							{renderTreeNodes(this.props.treeData, 0, false, 1, 0)}
						</Tree>
					) : (
						''
					)}
				</div>
			</Spin>
		)
	}
}

Trees.propTypes = {
	add: PropTypes.func, // 添加节点方法
	del: PropTypes.func, // 删除节点
	edit: PropTypes.func, // 删除节点
	loaded: PropTypes.bool, // 数据加载状态
	treeData: PropTypes.array, // 数据
	id: PropTypes.string, // id字段名
	hideBtn: PropTypes.bool, // 是否默认隐藏操作按钮
	type: PropTypes.string, // 模块名称
}

export default connect()(Trees)
