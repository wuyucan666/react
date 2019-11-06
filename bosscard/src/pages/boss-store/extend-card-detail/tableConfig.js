import moment from 'moment'
export default {
  id: 'id',
  isScroll: false,
  hasTotal: false,
  screen: {
    query: {},
    rules: [
      {
        type: 'text',
        placeholder: '客户姓名/充值卡/备注',
        prop: 'clientName,cardName,remark',
      },
      {
        type: 'date<>',
        prop: 'deadline',
        label: '起止日期',
      },
    ],
  },
  moreBtn: [
    {
      name: '详情',
      icon: 'icon-dayin',
      type: 14,
    },
    {
      name: '打印',
      icon: 'icon-dayin',
      type: 24,
    },
    {
      name: "作废",
      power: "Edit",
      icon: "icon-chedan",
      type: 18,
      btnColor:'#FE6060',
    },
  ],
  headers: [
    {
      name: '客户姓名',
      prop: 'clientName',
      width: '8%',
    },
    {
      name: '充值卡',
      prop: 'cardName',
      width: '12%',
    },
    {
      name: '续卡金额',
      prop: 'renewal',
      width: '9%',
    },
    {
      name: '赠送金额',
      prop: 'give',
      width: '9%',
    },
    {
      name: '续卡后余额',
      prop: 'balance',
      width: '9%',
    },
    {
      name: '卡到期日期',
      prop: 'deadline',
      width: '9%',
      render(ret) {
        return ret.deadline === -1 ? '无限期' : moment.unix(ret['deadline']).format('YYYY-MM-DD')
      },
    },
    {
      name: '支付方式',
      prop: 'deadline',
      width: '12%',
      render(ret) {
        let payments = ret.payments || []
        if (payments.length === 1) {
          return payments[0].name
        } else {
          return payments.reduce(
            (total, _) => (total === '' ? '' : total + '; ') + _.name + '￥' + _.amount,
            ''
          )
        }
      },
    },
    {
      name: '提成人员',
      prop: 'deadline',
      width: '10%',
      render(ret) {
        let commissions = ret.commissions || []
        if (commissions.length === 1) {
          return commissions[0].name
        } else {
          return commissions.reduce(
            (total, _) => (total === '' ? '' : total + '; ') + _.name + _.scale + '%',
            ''
          )
        }
      },
    },
    {
      name: '备注',
      prop: 'remark',
      width: '8%',
    },
  ],
}
