const EDIT_BTN = {
  name: "修改",
  power: "Edit",
  icon: "icon-jicun1",
  type: 11,
}

export default {
  hasCheck: false,
  id: "key",
  moreBtn: [EDIT_BTN],
  headers: [
    {
      name: "会员",
      prop: "clientName",
    },
    {
      name: "商品名称",
      prop: "productName",
    },
    {
      name: "规格",
      prop: "specification",
    },
    {
      name: "编码",
      prop: "commodityCode",
    },
    {
      name: "单价",
      prop: "price",
    },
    {
      name: "数量",
      prop: "lockerNum",
    },
  ],
  screen: {
    col: 3,
    rules: [
      {
        type: "text",
        prop: "clientName,productName",
        placeholder: "会员/商品名称",
      },
    ],
  },
}
