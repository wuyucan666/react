
import moment from 'moment'

const headers = [
  {
    name: '卡名称',
    prop: 'cardName',
    width: '10%',
  },
  {
    name: '业绩',
    prop: 'output',
    width: '8%',
  },
  {
    name: '总提成 （元）',
    prop: 'deduct',
    width: '10%',
  },
  {
    name: '提成规则',
    prop: 'deductType',
    width: '20%',
  },
  {
    name: '提成人员',
    prop: 'deductStaffName',
    width: '8%',
  },
  {
    name: '分摊比例',
    prop: 'deductPercent',
    width: '8%',
    render: (record) => {
      return record.deductPercent + '%'
    },
  },
  {
    name: '分摊提成 （元）',
    prop: 'speciesDeduct',
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
    width: '240px',
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


const memberConfig = {
  headers,
  screen,
  id: 'test',
  moreBtn: [],
  hasCheck: false,
  hasTotal: true,
}



export default { memberConfig }
