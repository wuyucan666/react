export default {
  id: "id",
  screen: {
    col: 5,
    rules: [
      {
        type: "text",
        prop: "no",
        placeholder: "单号",
      },
      {
        type: "list",
        label: "供应商",
        placeholder: "全部供应商",
        prop: "supplier",
        list: [],
      },
    ],
  },
}
