export default {
  screen: {
    col: 4,
    rules: [
      {
        type: "list",
        label: "状态",
        prop: "status",
        placeholder: "全部状态",
        list: [
          {
            name: "待审核",
            value: 0,
          },
          {
            name: "已通过",
            value: 1,
          },
          {
            name: "未通过",
            value: 2,
          },
        ],
      },
      {
        type: "date",
        label: "日期",
        prop: "created",
      },
    ],
  },
}
