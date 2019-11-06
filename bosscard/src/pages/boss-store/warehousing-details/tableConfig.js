export default {
  screen: {
    col: 5,
    rules: [
      {
        type: 'text',
        prop: 'productName,specification,commodityCode',
        placeholder: '商品名称/编号/规格',
      },
      {
        type: 'date',
        label: '日期',
        prop: 'created',
      },
    ],
  },
}
