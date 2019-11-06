import React, { Component } from 'react';
import { Spin } from 'antd';
import services from 'services';

interface BottomProp {
	text: string;
	value: number;
	unit: string;
}

interface Grid {
	/** 主题色 */
	color: string;
	title: string;
	icon: string;
	value: number;
	bottom: Array<BottomProp>;
}

/**
 * 数据汇总格子
 */
let grids: Array<Grid> = [
	{
		color: '#13C2C2',
		title: '今日会员到店车辆',
		icon: 'icon-huiyuancheliang',
		value: 0,
		bottom: [
			{
				text: '本月',
				value: 0,
				unit: '辆'
			}
		]
	},
	{
		color: '#2FC25B',
		title: '今日散客到店车辆',
		icon: 'icon-sankecheliang',
		value: 0,
		bottom: [
			{
				text: '本月',
				value: 0,
				unit: '辆'
			}
		]
	},
	{
		color: '#FACC14',
		title: '今日总到店车辆',
		icon: 'icon-quanbucheliang',
		value: 0,
		bottom: [
			{
				text: '本月',
				value: 0,
				unit: '辆'
			}
		]
	},
	{
		color: '#1890FF',
		title: '今日实收',
		icon: 'icon-shishoujine',
		value: 0,
		bottom: [
			{
				text: '本月',
				value: 0,
				unit: '元'
			}
		]
	},
	{
		color: '#13C2C2',
		title: '今日卡扣',
		icon: 'icon-benyuexiaohao',
		value: 0,
		bottom: [
			{
				text: '本月',
				value: 0,
				unit: '元'
			}
		]
	},
	{
		color: '#2FC25B',
		title: '会员卡余额',
		icon: 'icon-huiyuanqiayue',
		value: 0,
		bottom: [
			{
				text: '充值卡余额',
				value: 0,
				unit: '元'
			},
			{
				text: '计次卡余额',
				value: 0,
				unit: '元'
			}
		]
	}
];

export default class MainData extends Component {
	state = {
		list: [...grids],
		loading: true
	};
	componentDidMount() {
		this.getData();
	}
	getData() {
		services.LIST({ keys: { name: 'brand/wide/index/collect' }, data: {} }).then(res => {
			if (res.code === '0') {
				grids[0].value = parseInt(res.data.clientVehicles.day);
				grids[0].bottom[0].value = parseInt(res.data.clientVehicles.month);
				grids[1].value = parseInt(res.data.touristVehicles.day);
				grids[1].bottom[0].value = parseInt(res.data.touristVehicles.month);
				grids[2].value = parseInt(res.data.totalVehicles.day);
				grids[2].bottom[0].value = parseInt(res.data.totalVehicles.month);
				grids[3].value = res.data.performance.day;
				grids[3].bottom[0].value = res.data.performance.month;
				grids[4].value = res.data.consume.day;
				grids[4].bottom[0].value = res.data.consume.month;
				grids[5].value = res.data.balance.total;
				grids[5].bottom[0].value = res.data.balance.species;
				grids[5].bottom[1].value = res.data.balance.records;
				this.setState({
					list: [...grids],
					loading: false
				});
			}
		});
	}
	render() {
		return (
			<div className="main-data">
				{this.state.list.map((_, index) => (
					<div key={index}>
						<Spin spinning={this.state.loading}>
							<div className="content flex center">
								<div className="item">
									<i className={'iconfont ' + _.icon} style={{ color: _.color }} />
								</div>
								<div className="detail">
									<div className="title">{_.title}</div>
									<div className="value">{_.value}</div>
								</div>
							</div>
							<div className="bottom-content flex center left">
								{_.bottom.map((bottom, index) => (
									<span key={index}>
										{bottom.text} <span style={{ color: _.color }}>{bottom.value}</span>{' '}
										{bottom.unit}
									</span>
								))}
							</div>
						</Spin>
					</div>
				))}
			</div>
		);
	}
}
