import { TableConfig } from "components/CommonTable";
import moment = require("moment");

const config: TableConfig = {
  id: 'staffName',
  hasTotal: true,
  screen: {
    order: {
      output: 'ascend'
    },
    rules: [
      {
        type: 'month',
        defaultValue: moment(),
        label: '选择月份',
        prop: 'created'
      }
    ]
  },
  moreBtn: [],
  headers: [
    { name: '员工', prop: 'staffName', width: '7%' },
    { name: '工单数', prop: 'orderCount', width: '8%', sortFilterType: 'sort' },
    { name: '业绩', prop: 'output', width: '8%', sortFilterType: 'sort' },
    { name: '业绩占比', prop: 'outputProportion', width: '8%' },
    { name: '销售业绩', prop: 'salesOutput', width: '8%', sortFilterType: 'sort' },
    { name: '施工业绩', prop: 'builderOutput', width: '8%', sortFilterType: 'sort' },
    { name: '项目业绩', prop: 'projectSalesOutput', width: '8%', sortFilterType: 'sort' },
    { name: '产品业绩', prop: 'productSalesOutput', width: '8%', sortFilterType: 'sort' },
    { name: '充值卡业绩', prop: 'speciesOutput', width: '8%', sortFilterType: 'sort' },
    { name: '计次卡业绩', prop: 'recordsOutput', width: '8%', sortFilterType: 'sort' },
    { name: '消耗', prop: 'consume', width: '8%', sortFilterType: 'sort' },
    { name: '充值卡消耗', prop: 'speciesConsume', width: '8%', sortFilterType: 'sort' },
  ]
}

export default config
