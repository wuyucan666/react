import { TableConfig } from "components/CommonTable";
import moment = require("moment");

const render = (record, text) => {
  if (record.key === '-1') {
    return <b>{text}</b>
  } else {
    return text
  }
}

const config: TableConfig = {
  id: 'key',
  // hasTotal: true,
  hideFirstCol: true,
  hidePagenation: true,
  screen: {
    order: {
      performance: 'ascend'
    },
    query: {
      goodsType: 1
    },
    rules: [
      {
        type: "month",
        label: '选择月份',
        defaultValue: moment(),
        prop: 'completed'
      }
    ]
  },
  moreBtn: [],
  headers: [
    {
      name: '分类',
      width: '16%',
      prop: 'name',
      render,
    },
    {
      name: '营业额',
      width: '12%',
      prop: 'performance',
      sortFilterType: "sort",
      render
    },
    {
      name: '营业额占比',
      width: '12%',
      prop: 'proportion',
      render
    },
    {
      name: '成本',
      width: '12%',
      prop: 'cost',
      sortFilterType: "sort",
      render
    },
    {
      name: '毛利',
      width: '12%',
      prop: 'gross',
      sortFilterType: "sort",
      render
    },
    {
      name: '产值',
      width: '12%',
      prop: 'output',
      sortFilterType: "sort",
      render
    },
    {
      name: '消耗',
      width: '12%',
      prop: 'consume',
      sortFilterType: "sort",
      render
    },
    {
      name: '提成',
      width: '12%',
      prop: 'deduct',
      sortFilterType: "sort",
      render
    },
  ]
}

export default (type): TableConfig => {
  config.screen.query.goodsType = type
  return config
}
