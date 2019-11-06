export default {
  screen: {
    col: 4,
    rules: [
      {
        type: "text",
        prop: "storageNo,staffName",
        placeholder: "单号",
      },
      {
        type: "list",
        label: "出库员",
        prop: "staffId",
        list: [],
        render: (text) => {
          return text ? text : "管理员"
        },
      },
      {
        type: "date",
        label: "日期",
        prop: "created",
      },
    ],
  },
}
