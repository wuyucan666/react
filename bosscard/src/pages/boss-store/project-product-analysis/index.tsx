import React, { Component } from 'react';
import { Tabs } from 'antd';
import CategoryAnalysis from './category';
import ProjectRank from './projectRank';
import { connect } from 'dva';

/**项目产品分析 */
export default connect(({ table }) => ({ table }))(
	class ProjectProductAnalysis extends Component<any> {
		state = {
			activeKey: ''
		};
		componentDidMount = () => this.setState({ activeKey: this.props.location.query.tab || '1' });
		handleTabChange = (activeKey: string) => {
			if (!this.props.table.loading) {
				this.setState({ activeKey });
			}
		};
		render() {
			const { TabPane } = Tabs;
			return (
				<div>
					<Tabs tabBarStyle={{margin: '30px 0 0 30px'}} onChange={this.handleTabChange} activeKey={this.state.activeKey}>
						<TabPane tab="项目分类" key="1">
							{this.state.activeKey === '1' && <CategoryAnalysis type={1} />}
						</TabPane>
						<TabPane tab="产品分类" key="2">
							{this.state.activeKey === '2' && <CategoryAnalysis type={2} />}
						</TabPane>
						<TabPane tab="项目排行" key="project">
							{this.state.activeKey === 'project' && <ProjectRank type="project" />}
						</TabPane>
						<TabPane tab="产品排行" key="product">
							{this.state.activeKey === 'product' && <ProjectRank type="product" />}
						</TabPane>
					</Tabs>
				</div>
			);
		}
	}
);
