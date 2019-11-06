// import moment from 'moment'

const headers = [
  {
    name: '所属分类',
    prop: 'categoryName',
    width: '16%',
  },
  {
    name: '销售数量',
    prop: 'number',
    width: '16%',
    sortFilterType: "sort",
  },
  {
    name: '业绩金额',
    prop: 'receipts',
    width: '16%',
    sortFilterType: "sort",
  },
  {
    name: '成本',
    prop: 'cost',
    width: '18%',
    sortFilterType: "sort",
  },
  {
    name: '毛利',
    prop: 'profit',
    width: '18%',
    sortFilterType: "sort",
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


const projectCfg = {
  headers: [  {
    name: '项目名称',
    prop: 'name',
    width: '16%',
  }, ...headers],
  screen: {...screen, query: {goodsType: 1}},
  id: 'test',
  moreBtn: [],
  hasCheck: false,
  isScroll: true,
  hideFirstCol: true,
  hasTotal: true,
}

const productCfg = {
  headers: [{
    name: '产品名称',
    prop: 'name',
    width: '16%',
  },{
    name: '编码',
    prop: 'commodityCode',
    width: '10%',
  }, ...headers],
  screen: {...screen, query: {goodsType: 2}},
  id: 'test',
  moreBtn: [],
  hasCheck: false,
  isScroll: true,
  hideFirstCol: true,
  hasTotal: true,
}



export default { projectCfg, productCfg } 