import { TableConfig } from 'components/CommonTable';
import moment = require('moment');

const tableConfig: TableConfig = {
  id: 'id',
  moreBtn: [
    {
      name: '详情',
      power: 'permission',
      icon: 'icon-xiangqing',
      type: 14
    },
    {
      name: '打印',
      icon: 'icon-xiangqing',
      type: 24
    }
  ],
  headers: [
    {
      name: '赠送时间',
      width: '10%',
      prop: 'created',
      render: record => moment.unix(record.created).format('YYYY-MM-DD HH:mm')
    },
    {
      name: '会员',
      width: '8%',
      prop: 'clientName'
    },
    {
      name: '手机号',
      width: '10%',
      prop: 'phone'
    },
    {
      name: '赠送数量',
      width: '10%',
      prop: 'num'
    },
    {
      name: '限制车辆',
      width: '14%',
      prop: 'car',
      render: record =>
        record.car.filter(_ => _).reduce((total, _) => {
          return (total ? total + '、' : total) + _.license_no;
        }, '')
    },
    {
      name: '赠送类型',
      width: '8%',
      prop: 'type'
    },
    {
      name: '赠送人员',
      width: '8%',
      prop: 'staffName'
    },
    {
      name: '备注',
      width: '17%',
      prop: 'remarks'
    }
  ]
};

export default tableConfig;
