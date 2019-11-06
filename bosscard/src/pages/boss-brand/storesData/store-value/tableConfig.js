// import moment from 'moment'

const headers = [
  {
    name: '维修类型',
    prop: 'maintainTypeName',
  },
  {
    name: '工单数',
    prop: 'orderNumber',
  },
  {
    name: '项目产值',
    prop: 'projectOutput',
  },
  {
    name: '产品产值',
    prop: 'productOutput',
  },
  {
    name: '单车产值',
    prop: 'singleOutput',
  },
  {
    name: '总产值',
    prop: 'totalOutput',
  },
  {
    name: '总值占比',
    prop: 'totalRate',
  },
]

const header = [
  {
    name: '姓名',
    prop: 'staffName',
  },
  {
    name: '所属门店',
    prop: 'storeName',
  },
  {
    name: '工单数',
    prop: 'orderNumber',
  },
  {
    name: '项目产值',
    prop: 'projectOutput',
  },
  {
    name: '产品产值',
    prop: 'productOutput',
  },
  {
    name: '单车产值',
    prop: 'singleOutput',
  },
  {
    name: '总产值',
    prop: 'totalOutput',
  },
  {
    name: '产值占比',
    prop: 'totalRate',
  },
]

const screen = { //查询
  col: 3,
  query: {},
  rules: [
    {
      type: "list",
      label: "选择门店",
      placeholder: "全部门店",
      prop: "store_id",
      list: [],
    },
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


const types = {
  headers,
  screen,
  id: 'test',
  moreBtn: [],
  hasCheck: false,
  isScroll: true,
}

const products = {
  headers: header,
  screen,
  id: 'test',
  moreBtn: [],
  hasCheck: false,
  isScroll: true,
}



export default { types, products }