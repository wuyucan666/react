import moment from "moment"
export default {
  id: 'key',
  screen: {
    order: { receipts: 'ascend' },
    col: 3,
    rules: [
      {
        type: 'month',
        prop: 'completed',
        defaultValue: moment(),
        label: '选择月份',
      },
      {
        type: 'list',
        label: '卡类型',
        placeholder: '全部',
        prop: 'cardType',
        list: [
          {
            name: '全部',
            value: 0,
          },
          {
            name: '充值卡',
            value: 1,
          },
          {
            name: '计次卡',
            value: 2,
          },
        ],
      },
    ],
  },
}
