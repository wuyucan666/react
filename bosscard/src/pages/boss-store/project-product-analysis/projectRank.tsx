import React, { Component } from 'react';
import CommonTable from 'components/CommonTable';
import getTableConfig from './rankTableConfig/tableConfig';

interface Props {
	type: string;
}

export default class ProjectRank extends Component<Props> {
	render() {
		return (
			<div>
				<CommonTable name="wide-ranking/details" New tableConfig={getTableConfig(this.props.type)} />
			</div>
		);
	}
}
