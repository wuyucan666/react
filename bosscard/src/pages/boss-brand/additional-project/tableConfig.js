export default {
  screen: {
    col: 4,
    rules: [
      {
        type: "text",
        prop: "projectName",
        placeholder: "项目名称",
      },
      {
        type: "list",
        label: "项目状态",
        prop: "statusTem",
        list: [
          {
            name: "停用",
            value: 0,
          },
          {
            name: "启用",
            value: 1,
          },
        ],
      },
      {
        type: "tree",
        label: "维修类型",
        prop: "maintainTypeId",
        placeholder: "全部类型",
        list: [],
      },
    ],
  },
}
