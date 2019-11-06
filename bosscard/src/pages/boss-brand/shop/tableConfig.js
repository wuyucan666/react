export default {
  id: "storeId",
  screen: {
    rules: [
      {
        type: "text",
        prop: "storeName,operator,phoneTem",
        placeholder: "门店名称/经营者/联系电话",
      },
      {
        type: "tree",
        label: "所属区域",
        prop: "areaId",
        placeholder: "全部区域",
        list: [],
      },
      {
        type: "list",
        label: "门店类型",
        prop: "storeTypeId",
        placeholder: "全部类型",
        list: [],
      },
      {
        type: "list",
        label: "状态",
        prop: "work",
        placeholder: "全部状态",
        list: [
          {
            name: "启用",
            value: 1,
          },
          {
            name: "禁用",
            value: 2,
          },
        ],
      },
    ],
  },
}
