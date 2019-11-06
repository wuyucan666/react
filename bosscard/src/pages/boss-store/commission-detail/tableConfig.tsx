import { TableConfig } from 'components/CommonTable';
import moment = require('moment');

import { __COMMISSION_TYPES__ } from 'utils/globalConfig';

const config: TableConfig = {
	id: 'id',
	screen: {
		rules: [
			{
				type: 'list',
				prop: 'staffId',
				list: [],
				label: '选择员工'
			},
			{
				type: 'list',
				prop: 'commissionType',
				list: __COMMISSION_TYPES__,
				label: '提成类型'
			},
			{
				type: 'date<>',
				prop: 'commissionedAt',
				label: '选择时间'
			}
		]
	},
	headers: [
		{
			name: '时间',
			prop: 'commissionedAt',
			width: '13%',
			render: record => {
				return moment.unix(record.commissionedAt).format('YYYY-MM-DD HH:mm:ss');
			}
		},
		{ name: '员工', prop: 'staffName', width: '10%' },
		{
			name: '类型',
			prop: 'commissionType',
			width: '10%',
			render: record => {
				if (record.serviceType * 1 < 3) {
					return record.commissionType * 1 === 1 ? '施工提成' : '销售提成';
				} else {
					return record.serviceType * 1 === 3 ? '计次卡提成' : '充值卡提成';
				}
			}
		},
		{
			name: '服务/卡',
			prop: 'name',
			width: '16%',
			render: record => {
				if (record.productType === 0) {
					return (
						<div>
							<div
								className="flex center"
								style={{
									width: 38,
									height: 18,
									color: '#fff',
									backgroundColor: '#1890FF',
									lineHeight: 1
								}}
							>
								外采
							</div>
							{record.name}
						</div>
					);
				} else {
					return record.name;
				}
			}
		},
		{
			name: '提成规则',
			prop: 'rule',
			width: '10%',
			render: record =>
				__COMMISSION_TYPES__.find(_ => _.value === record.rule.type * 1).name +
				', ' +
				(record.rule.type * 1 === 4 ? record.rule.money + '元' : (record.rule.percent || 0) + '%')
		},
		{ name: '提成基准', prop: 'standard', width: '10%' },
		{ name: '分成比例', prop: 'proportion', width: '8%', render: (record) => record.proportion + '%' },
		{ name: '提成金额', prop: 'amount', width: '8%' }
	],
	moreBtn: [
		{
			name: '订单详情',
			type: 20
		}
	]
};

export default config;
