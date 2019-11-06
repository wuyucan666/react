export default {
  screen: {
    col: 4,
    query: {},
    rules: [
      {
        type: "text",
        prop: "projectName,commodityCode",
        placeholder: "项目名称/编码",
      },
      {
        type: "list",
        label: "项目状态",
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
        label: "项目类别",
        prop: "categoryId",
        list: [],
      },
      {
        type: 'check',
        label: '仅显示未设置销售价格、成本的项目',
        prop: 'priceTem',
        regProp: 'priceTem',
        value: '',
      },
    ],
  },
}
