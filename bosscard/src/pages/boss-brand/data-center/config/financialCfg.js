
const headers = [
  {
    name: '日期',
    prop: 'date',
    width: '12%',
  },
  {
    name: '银行卡',
    prop: 'classify',
    width: '12%',
  },
  {
    name: '现金',
    prop: 'sellNum',
    width: '12%',
  },
  {
    name: '微信',
    prop: 'performance',
    width: '12%',
  },
  {
    name: '支付宝',
    prop: 'cost',
    width: '12%',
  },
 
]

const screen = { //查询
  col: 3,
  query: {},
  rules: [
    {
      type: 'component',
      label: '',
      prop: '',
      query: {},
    },
    {
      type: 'date<>',
      label: '',
      prop: 'completed',
    },
  ],
}


const financialCfg = {
  headers,
  screen,
  id: 'test',
  moreBtn: [],
  hasCheck: false,
  isScroll: true,
  hasTotal: true,
  // hideFirstCol: true,
  hidePagenation: true,
}




export default financialCfg