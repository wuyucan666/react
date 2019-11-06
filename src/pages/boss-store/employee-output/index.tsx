import React, { Component } from 'react';
import CommonTable from 'components/CommonTable';
import tableConfig from './tableConfig';

export default class EmployeeOutput extends Component {
	render() {
		return (
			<div>
				<CommonTable name="wide-business/staff/employeeAnalysis/list" New tableConfig={tableConfig} />
			</div>
		);
	}
}
