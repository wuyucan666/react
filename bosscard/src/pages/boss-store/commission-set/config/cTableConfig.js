
import moment from 'moment'

const headers = [
  {
    name: '项目',
    prop: 'name',
    width: '6%',
  },
  {
    name: '单号',
    prop: 'orderGoodsNo',
    width: '8%',
  },
  {
    name: '业绩',
    prop: 'receipts',
    width: '8%',
  },
  {
    name: '总提成 （元）',
    prop: 'deductPoint',
    width: '10%',
  },
  {
    name: '提成规则',
    prop: 'commissions',
    width: '11%',
  },
  {
    name: '施工人员',
    prop: 'staffDeduct',
    width: '8%',
    className: 'table_border_left',
    render: (c) => {
      return c.staffDeduct.map((v, i) => {
        return <div className='ainier-table-td' key={i}>{v.staffName}</div>
      })
    },
  },
  {
    name: '分摊比例',
    prop: 'temp1',
    width: '8%',
    className: 'table_border_left',
    render: (c) => {
      return c.staffDeduct.map((v, i) => {
        return <div className='ainier-table-td' key={i}>{v.deductPercent}%</div>
      })
    },
  },
  {
    name: '分摊提成 （元）',
    prop: 'deduct',
    width: '11%',
    className: 'table_border_left',
    render: (c) => {
      return c.staffDeduct.map((v, i) => {
        return <div className='ainier-table-td' key={i}>{v.deduct}</div>
      })
    },
  },
  {
    name: '分摊业绩',
    prop: 'temp3',
    width: '10%',
    className: 'table_border_left',
    render: (c) => {
      return c.staffDeduct.map((v, i) => {
        return <div className='ainier-table-td' key={i}>{v.receipts}</div>
      })
    },
  },
  {
    name: '更新时间',
    prop: 'completed',
    width: '210px',
    className: 'table_border_left',
    render: c => {
      return <div className="ainier-table-td"> {moment(c.completed * 1000).format('YYYY-MM-DD HH:mm')}</div>
    },
  },
]

const screen = { //查询
  col: 7,
  query: { type: 1 },
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


const projectConfig = {
  headers,
  screen,
  id: 'test',
  moreBtn: [],
  hasCheck: false,
  hasTotal: true,
}

const productConfig = {
  headers: [{
    name: '产品',
    prop: 'name',
    width: '6%',
  }, {
    name: '编码',
    prop: 'commodityCode',
    width: '6%',
  }, ...headers.slice(1)],
  screen: { ...screen, query: { type: 2 } },
  id: 'test',
  moreBtn: [],
  hasCheck: false,
  hasTotal: true,
}

const additionConfig = {
  headers,
  screen: { ...screen, query: { type: 3 } },
  id: 'test',
  moreBtn: [],
  hasCheck: false,
  hasTotal: true,
}


export default { projectConfig, productConfig, additionConfig }
