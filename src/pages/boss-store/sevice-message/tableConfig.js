export default {
  screen: {
    col: 4,
    query: {},
    rules: [
      {
        type: "text",
        prop: "projectName,productName",
        placeholder: "项目名称/产品名称",
      },
      {
        type: "list",
        label: "产品类型",
        prop: "type",
        list: [
          {
            name: "项目",
            value: 1,
          },
          {
            name: "产品",
            value: 2,
          },
        ],
      },
    ],
  },
}