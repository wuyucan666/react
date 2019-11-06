// import moment from 'moment'

const headers = [
  {
    name: '一级分类',
    prop: 'name',
    width: '10%',
  },
  {
    name: '二级分类',
    prop: 'data',
    width: '9%',
    className: 'table-padding0',
    render: (e) => {
      return e.data.map((v, i) => {
        return <div
          key={i}
          className='ainier-table-item'
          style={{ color: v.isLast && '#333', fontWeight: v.isLast && 'bold' }}>{v.name}</div>
      })
    },
  },
  {
    name: '订单数量',
    prop: 'data',
    width: '9%',
    className: 'table-padding0',
    render: (e) => {
      return e.data.map((v, i) => {
        return <div
          key={i}
          className='ainier-table-item'
          style={{ color: v.isLast && '#333', fontWeight: v.isLast && 'bold', borderLeft: 0 }}>{v.orderCount}</div>
      })
    },
  },
  {
    name: '业绩',
    prop: 'data',
    width: '9%',
    className: 'table-padding0',
    render: (e) => {
      return e.data.map((v, i) => {
        return <div
          key={i}
          className='ainier-table-item'
          style={{ color: v.isLast && '#333', fontWeight: v.isLast && 'bold', borderLeft: 0 }}>{v.performance}</div>
      })
    },
  },
  {
    name: '业绩占比',
    prop: 'data',
    width: '9%',
    className: 'table-padding0',
    render: (e) => {
      return e.data.map((v, i) => {
        return <div
          key={i}
          className='ainier-table-item'
          style={{ color: v.isLast && '#333', fontWeight: v.isLast && 'bold', borderLeft: 0 }}>{v.proportion}</div>
      })
    },
  },
  {
    name: '成本',
    prop: 'data',
    width: '9%',
    className: 'table-padding0',
    render: (e) => {
      return e.data.map((v, i) => {
        return <div
          key={i}
          className='ainier-table-item'
          style={{ color: v.isLast && '#333', fontWeight: v.isLast && 'bold', borderLeft: 0 }}>{v.cost}</div>
      })
    },
  },
  {
    name: '毛利',
    prop: 'data',
    width: '9%',
    className: 'table-padding0',
    render: (e) => {
      return e.data.map((v, i) => {
        return <div
          key={i}
          className='ainier-table-item'
          style={{ color: v.isLast && '#333', fontWeight: v.isLast && 'bold', borderLeft: 0 }}>{v.gross}</div>
      })
    },
  },
  {
    name: '会员车辆',
    prop: 'data',
    width: '9%',
    className: 'table-padding0',
    render: (e) => {
      return e.data.map((v, i) => {
        return <div
          key={i}
          className='ainier-table-item'
          style={{ color: v.isLast && '#333', fontWeight: v.isLast && 'bold', borderLeft: 0 }}>{v.memberCar}</div>
      })
    },
  },
  {
    name: '散客车辆',
    prop: 'data',
    width: '9%',
    className: 'table-padding0',
    render: (e) => {
      return e.data.map((v, i) => {
        return <div
          key={i}
          className='ainier-table-item'
          style={{ color: v.isLast && '#333', fontWeight: v.isLast && 'bold', borderLeft: 0 }}>{v.ordinaryCar}</div>
      })
    },
  },
  {
    name: '总车辆',
    prop: 'data',
    width: '9%',
    className: 'table-padding0',
    render: (e) => {
      return e.data.map((v, i) => {
        return <div
          key={i}
          className='ainier-table-item'
          style={{ color: v.isLast && '#333', fontWeight: v.isLast && 'bold', borderLeft: 0 }}>{v.totalCar}</div>
      })
    },
  },
  {
    name: '客单均价',
    prop: 'data',
    width: '9%',
    className: 'table-padding0',
    render: (e) => {
      return e.data.map((v, i) => {
        return <div
          key={i}
          className='ainier-table-item'
          style={{ color: v.isLast && '#333', fontWeight: v.isLast && 'bold', borderLeft: 0 }}>{v.average}</div>
      })
    },
  },
]

const screen = { //查询
  col: 3,
  query: {},
  rules: [
    {
      type: "list",
      label: "选择门店",
      prop: "store_id",
      placeholder: "全部门店",
      list: [],
    },
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
  ],
}


const projectCfg = {
  headers,
  // screen,
  screen: { ...screen, query: { goodsType: 1 } },
  id: 'test',
  moreBtn: [],
  hasCheck: false,
  isScroll: true,
  hideFirstCol: true,
  hidePagenation: true,
}

const productCfg = {
  headers,
  screen: { ...screen, query: { goodsType: 2 } },
  id: 'test',
  moreBtn: [],
  hasCheck: false,
  isScroll: true,
  hideFirstCol: true,
  hidePagenation: true,
}



export default { projectCfg, productCfg } 