export default {
  screen: {
    col: 4,
    query: {},
    rules: [
      {
        type: "text",
        prop: "productName,commodityCode,modelTem",
        placeholder: "产品名称/型号/编码",
      },
      {
        type: "list",
        label: "产品状态",
        prop: "statusTem",
        list: [
          {
            name: "停用",
            value: 2,
          },
          {
            name: "启用",
            value: 1,
          },
        ],
      },
      {
        type: "tree",
        label: "产品分类",
        prop: "categoryId",
        list: [],
      },
      {
        type: "list",
        label: "产品类型",
        prop: "type",
        list: [
          {
            name: "自有产品",
            value: 1,
          },
          {
            name: "外采产品",
            value: 2,
          },
        ],
      },
    ],
  },
}
