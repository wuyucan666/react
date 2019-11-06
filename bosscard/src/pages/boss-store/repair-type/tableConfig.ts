import { TableConfig } from "components/CommonTable";
import moment = require("moment");

const config: TableConfig = {
  id: 'id',
  hidePagenation: true,
  hasTotal: true,
  screen: {
    rules: [
      { type: 'month', defaultValue: moment(), prop: 'completed', label: '选择月份' }
    ]
  },
  moreBtn: [],
  headers: [
    { name: '业务类型', prop: 'maintainTypeName', width: "10%" },
    { name: '营业额', prop: 'totalReceipts', width: "11%", sortFilterType: 'sort' },
    { name: '营业额占比', prop: 'totalRate', width: "10%" },
    { name: '项目营业额', prop: 'projectReceipts', width: "11%", sortFilterType: 'sort' },
    { name: '产品营业额', prop: 'productReceipts', width: "11%", sortFilterType: 'sort' },
    { name: '毛利', prop: 'totalProfits', width: "11%", sortFilterType: 'sort' },
    { name: '产值', prop: 'output', width: "11%", sortFilterType: 'sort' },
    { name: '消耗', prop: 'consume', width: "10%", sortFilterType: 'sort' },
    { name: '工单数', prop: 'orderNumber', width: "10%", sortFilterType: 'sort' },
  ]
}

export default config
