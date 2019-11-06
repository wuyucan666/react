export default {
  screen: {
    col: 5,
    rules: [
      {
        type: "text",
        prop: "productName,specification,commodityCode",
        placeholder: "商品名称/编码/规格",
      },      
      {
        type: "list",
        label: "商品分类",
        prop: "categoryId",
        list: [],
      },
      {
        type: 'list',
        label: '预警库存',
        placeholder: '全部状态',
        prop: 'warning',
        list: [
          {
            name:'全部商品',
            value:0,
          },
          {
            name:'低于最低库存',
            value:1,
          },
        ],
      },
    ],
  },
}
