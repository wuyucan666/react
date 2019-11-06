import moment from "moment"
export default {
  id: "repayOrderId",
  screen: {
    query: {},
    rules: [
      {
        type: "text",
        placeholder: "单号/客户姓名",
        prop: "clientName,orderId",
      },
      {
        type: "date<>",
        prop: "created",
      },
      {
        type: "list",
        label: "支付方式",
        placehodler: "全部类型",
        prop: "paymentId",
        list: [],
      },
    ],
  },
  moreBtn: [
    // {
    //   type: 17,
    //   name: "查看详情",
    //   icon: "icon-chakanxiangqing",
    // },
  ],
  headers: [
    {
      name: "时间",
      prop: "createdAt",
      width: "20%",
      render(ret) {
        return moment.unix(ret["createdAt"]).format("YYYY-MM-DD HH:mm")
      },
    },
    {
      name: "客户姓名",
      prop: "clientName",
      width: "10%",
    },
    {
      name: "实收还款金额（元）",
      prop: "repayment",
      width: "13%",
    },
    {
      name: "欠款金额（元）",
      prop: "arrears",
      width: "13%",
    },
    {
      name: "操作人",
      prop: "staffName",
      width: "13%",
    },
    {
      name: "单号",
      prop: "orderId",
      width: "13%",
    },
  ],
}
