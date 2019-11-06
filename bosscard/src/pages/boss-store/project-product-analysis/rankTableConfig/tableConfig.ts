import { TableConfig } from "components/CommonTable";
import moment = require("moment");

const tableConfig: TableConfig = {
  id: 'id',
  screen: {
    wrapperQuery: {
      driver: 'project'
    },
    order: { receipts: 'ascend' },
    query: {},
    rules: [
      {
        type: 'month',
        label: '选择月份',
        prop: 'completed',
        defaultValue: moment()
      }
    ]
  },
  moreBtn: [],
  headers: [
    {
      name: '项目名称',
      prop: 'name',
      width: '15%',
    },
    {
      name: '营业额',
      prop: 'receipts',
      width: '10%',
      sortFilterType: "sort"
    },
    {
      name: '营业额占比',
      prop: 'receiptsPercent',
      width: '10%',
    },
    {
      name: '成本',
      prop: 'cost',
      width: '10%',
      sortFilterType: "sort"
    },
    {
      name: '毛利',
      prop: 'profit',
      width: '10%',
      sortFilterType: "sort"
    },
    {
      name: '产值',
      prop: 'output',
      width: '10%',
      sortFilterType: "sort"
    },
    {
      name: '消耗',
      prop: 'consume',
      width: '10%',
      sortFilterType: "sort"
    },
    {
      name: '工单数',
      prop: 'orderCount',
      width: '10%',
      sortFilterType: "sort"
    },
    {
      name: '提成',
      prop: 'deduct',
      width: '10%',
      sortFilterType: "sort"
    },
  ]
}

export default (type: string) => {
  let config = { ...tableConfig }
  if (type === 'product') {
    config.headers[0].name = "产品名称"
    config.headers[0].render = (record) => {
      return `${record.name} (${record.productCode})`
    }
  } else {
    config.headers[0].name = " 项目名称"
    config.headers[0].render = undefined
  }
  config.screen.wrapperQuery.driver = type
  return config
}
