export default {
  // isScroll: true,
  // hasTotal: true,
  screen: {
    col: 4,
    rules: [
      {
        type: "date<>",
        label: "办卡时间",
        prop: "created",
        defaultValue: [],
      },
      {
        type: "list",
        label: "卡类型",
        prop: "cardType",
        list: [
          {
            name: "充值卡",
            value: 1,
          },
          {
            name: "计次卡",
            value: 2,
          },
        ],
      },
      {
        type: "list",
        label: "售卡人",
        prop: "staffId",
        list: [],
      },
      {
        type: "component",
        label: "有效状态",
        prop: "deadlineTime",
        list: [],
      },
      {
        type: "list",
        label: "支付方式",
        prop: "paymentId",
        list: [],
      },
    ],
  },
}
