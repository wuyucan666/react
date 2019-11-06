import React, { Component } from 'react';
import Title from './title.js';
import { Chart, Geom, Tooltip, Axis } from 'bizcharts';
import { Spin } from 'antd';
import services from 'services';

/** */
export default class ContnuatioinCardChart extends Component {
	state = {
		loading: false,
		data: []
	};
	componentDidMount() {
		this.getData();
	}
	getData() {
		this.setState({ loading: true });
		services.LIST({ keys: { name: 'store/index/client/card' }, data: {} }).then(res => {
			this.setState({ loading: false });
			if (res.code === '0') {
				this.setState({ data: res.list });
			}
		});
	}
	render() {
		const data = this.state.data.map(_ => ({ ..._, 数量: _.count }));
		return (
			<div style={{ gridColumnEnd: 'span 4' }}>
				<Title title="客户办卡情况" />
				<div className="box" style={{ background: '#fff', padding: 32 }}>
					<Spin spinning={this.state.loading}>
						{!this.state.loading && (
							<Chart height={400} padding={'auto'} data={data} forceFit>
								<Axis name="title" />
								<Axis name="数量" />
								{/* <Coord type="theta" innerRadius={0.75} /> */}
								<Tooltip showTitle={false} />
								<Geom type="interval" position="title*数量" />
							</Chart>
						)}
					</Spin>
				</div>
			</div>
		);
	}
}
