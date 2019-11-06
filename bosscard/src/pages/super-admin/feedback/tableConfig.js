export default {
  screen: {
    col: 4,
    rules: [
      {
        type: "text",
        prop: "brandName,storeName",
        placeholder: "请输入品牌名称/门店名称",
      },
      {
        type: "list",
        label: "问题类型",
        prop: "type",
        list: [
          {
            name: "遇到问题",
            value: 1,
          },
          {
            name: "功能建议",
            value: 2,
          },
        ],
      },
      {
        type: "list",
        label: "处理状态",
        prop: "status",
        list: [
          {
            name: "全部",
            value: -999,
          },
          {
            name: "已处理",
            value: 1,
          },
          {
            name: "未处理",
            value: 0,
          },
        ],
      },
      {
        type: 'date',
        prop: 'dealAt',
        label: '日期查询',
      },
    ],
  },
}
