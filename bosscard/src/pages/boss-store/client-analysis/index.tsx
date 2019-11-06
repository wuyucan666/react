import React, { Component } from 'react';
import ContnuatioinCardChart from './components/contnuationCardChart';
import ContinuationCardPie from './components/continuationCardPie';

const styles = require('./index.less');
export default class ClientAnaysis extends Component {
	render() {
		return (
			<div className={styles.page}>
				<ContinuationCardPie />
				<div className="main-margin" />
				<ContnuatioinCardChart />
			</div>
		);
	}
}
