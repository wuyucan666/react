export default {
  screen: {
    col: 3,
    rules: [
      {
        type: "text",
        prop: "statusTem,cardName",
        placeholder: "套餐名称",
      },
      {
        type: "list",
        label: "卡状态",
        prop: "statusTem",
        list: [
          {
            name: "启用",
            value: 1,
          },
          {
            name: "停用",
            value: 0,
          },
          {
            name: "全部状态",
            value: -999,
          },
        ],
      },
    ],
  },
}
