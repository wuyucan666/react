import moment from 'moment'

const headers = [
  {
    name: '卡名称',
    prop: 'cardName',
    width: '14%',
  },
  {
    name: '业绩',
    prop: 'output',
    width: '8%',
  },
  {
    name: '总提成 （元）',
    prop: 'deduct',
    width: '11%',
  },
  {
    name: '提成规则',
    prop: 'deductType',
    width: '12%',
    render: (record) => {
      return (record.deductType === 1 ? '实收比例:' : record.deductType === 2 ? '原价比例:' : record.deductType === 4 ? '固定金额:' : '') + record.deductPoint
    },
  },
  {
    name: '提成人员',
    prop: 'deductStaffName',
    width: '9%',
  },
  {
    name: '分摊比例',
    prop: 'deductPercent',
    width: '9%',
  },
  {
    name: '分摊提成 （元）',
    prop: 'shareDeduct',
    width: '11%',
  },
  {
    name: '分摊业绩',
    prop: 'deductOutput',
    width: '10%',
  },
  {
    name: '更新时间',
    prop: 'create',
    width: '11%',
    render: c => {
      return moment(c.completed * 1000).format('YYYY-MM-DD HH:mm')
    },
  },
]

const screen = { //查询
  col: 3,
  query: {},
  rules: [
    {
      type: 'date<>',
      label: '更新时间',
      prop: 'completed',
      defaultValue: [moment().startOf('month'), moment().endOf('month')],
    },
    {
      type: 'list',
      label: '提成人员',
      prop: 'deductStaffId',
      list: [],
    },
  ],
}


const countConfig = {
  headers,
  screen,
  id: 'test',
  moreBtn: [],
  hasCheck: false,
  hasTotal: true,
}



export default { countConfig }
