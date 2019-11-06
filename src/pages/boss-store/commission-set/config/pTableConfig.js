
const headers = [
  {
    name: '提成人员',
    prop: 'staffName',
    width: '180px',
  },
  {
    name: '分摊销售业绩',
    prop: 'saleOutput',
    width: '180px',
  },
  {
    name: '分摊施工业绩',
    prop: 'constructionOutput',
    width: '180px',
  },
  {
    name: '充值卡业绩',
    prop: 'speciesOutput',
    width: '180px',
  },
  {
    name: '计次卡业绩',
    prop: 'recordsOutput',
    width: '180px',
  },
  {
    name: '总业绩',
    prop: 'totalOutput',
    width: '180px',
  },
  {
    name: '提成类型',
    prop: 'deductType',
    width: '180px',
    render: c => {
      return c.deductType === 1 ? '固定提成' : c.deductType === 2 ? '销售比例提成' : '毛利比例提成'
    },
  },
  {
    name: '提成',
    prop: 'deductPoint',
    width: '180px',
  },
  {
    name: '提成金额',
    prop: 'deduct',
    width: '180px',
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
      type: 'component',
      label: '',
      prop: '',
      query: {},
      converWidth: 2,
    },
    {
      type: 'list',
      label: '提成类型',
      prop: 'deductType',
      list: [
        {
          name: '固定提成',
          value: 1,
        },
        {
          name: '销售比例提成',
          value: 2,
        },
        {
          name: '毛利比例提成',
          value: 3,
        },
      ],
    },
    {
      type: 'list',
      label: '提成人员',
      prop: 'staffId',
      list: [],
    },
  ],
}


const perforConfig = {
  headers,
  screen,
  id: 'test',
  moreBtn: [],
  hasCheck: false,
  isScroll: true,
  hasTotal: true,
}



export default { perforConfig }