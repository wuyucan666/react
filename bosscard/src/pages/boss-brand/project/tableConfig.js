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
        type: "tree",
        label: "项目类别",
        prop: "categoryId",
        list: [],
      },
    ],
  },
}
