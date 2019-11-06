export default {
  id: "stocktakingInfoId",
  screen: {
    col: 5,
    rules: [
      {
        type: "text",
        prop: "name,code",
        placeholder: "产品名称/编码",
      },
      {
        type: "list",
        label: "盘点人",
        prop: "staffId",
        placeholder: "全部员工",
        list: [],
      },
      {
        type: "tree",
        label: "产品分类",
        placeholder: "全部分类",
        prop: "categoryId",
        list: [],
      },
      {
        type: "component",
        label: "全部商品",
        prop: "id",
        query: {},
        list: [
          {
            name: "全部",
            value: 0,
          },
          {
            name: "库存异常商品",
            value: 1,
          },
          {
            name: "库存正常商品",
            value: 2,
          },
        ],
      },
    ],
  },
}
