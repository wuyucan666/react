import React, { Component } from 'react';
import CommonTable from 'components/CommonTable';
import tableConfig from './tableConfig';

export default class RepairType extends Component {
	render() {
		return (
			<div>
				<CommonTable name="wide-business/maintain/type/list" New tableConfig={tableConfig} />
			</div>
		);
	}
}
