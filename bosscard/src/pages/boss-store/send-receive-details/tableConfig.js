export default {
  screen: {
    col: 4,
    rules: [
      {
        type: "text",
        prop: "productName,commodityCode",
        placeholder: "商品名称/编码",
      },
      {
        type: "list",
        label: "类型",
        prop: "typeId",
        list: [],
      },
      {
        type: 'date',
        label: '日期',
        prop: 'created',
      },
    ],
  },
}
