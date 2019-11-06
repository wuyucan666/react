export default {
  hasCheck: true,
  selectTotal: ["inventoryLockerNum", "inventoryGoodsNum", "totalPrice"],
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
        label: "仓库",
        prop: "warehouseId ",
        list: [],
      },
      {
        type: "list",
        label: "分类",
        prop: "categoryId",
        list: [],
      },
      {
        type: "list",
        label: "状态",
        placeholder: "全部状态",
        prop: "status",
        list: [
          {
            name: "全部",
            value: "",
          },
          {
            name: "正常",
            value: 0,
          },
          {
            name: "已停用",
            value: 1,
          },
        ],
      },
    ],
  },
}
