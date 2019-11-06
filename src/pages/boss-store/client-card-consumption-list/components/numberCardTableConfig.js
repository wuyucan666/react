import moment from "moment"
export default {
  id: "index",
  isScroll: false,
  hasTotal: false,
  screen: {
    query: {},
    rules: [
      {
        type: "text",
        placeholder: "卡名称/产品/项目/单号",
        prop: "cardName,title,orderNo",
      },
      {
        type: "date<>",
        prop: "completed",
      },
      {
        type: "list",
        label: "选择卡",
        placehodler: "全部卡",
        prop: "cardRecordsId",
        list: [],
      },
    ],
  },
  moreBtn: [],
  headers: [
    // {
    //   name: "卡名称",
    //   prop: "cardName",
    //   width: "240px",
    // },
    // {
    //   name: "卡号",
    //   prop: "cardNo",
    //   width: "200px",
    // },
    // {
    //   name: "车牌",
    //   prop: "licenseNo",
    //   width: "172px",
    // },
    // {
    //   name: "客户姓名",
    //   prop: "clientName",
    //   width: "172px",
    // },

    {
      name: "时间",
      prop: "completed",
      width: "200px",
      render(ret) {
        return moment.unix(ret["completed"]).format("YYYY-MM-DD HH:mm")
      },
    },
    {
      name: "单号",
      prop: "orderNo",
      width: "200px",
    },
    {
      name: "项目/产品",
      prop: "title",
      width: "200px",
      render: (text, item) => {
        return <div style={{width:'200px', wordWrap:'break-word',wordBreak:'break-all'}}>
          {text.title}
        </div>
      },
    },
    {
      name: "编码",
      prop: "commodityCode",
      width: "100px",
      render: (text, item) => {
        return <div style={{width:'100px', wordWrap:'break-word',wordBreak:'break-all'}}>
          {text.commodityCode}
        </div>
      },
    },
    {
      name: "卡名称",
      prop: "cardName",
      width: "200px",
    },
    // {
    //   name: "销售",
    //   prop: "staff",
    //   width: "172px",
    //   render(ret) {
    //     return (
    //       <div>
    //         {(ret["staff"] || []).map((_, i) => (
    //           <div key={i}>{_.staffName + _.deductPercent}</div>
    //         ))}
    //       </div>
    //     )
    //   },
    // },
    // {
    //   name: "余额",
    //   prop: "total",
    //   width: "172px",
    // },
    {
      name: "消耗",
      prop: "consume",
      width: "172px",
    },
    {
      name: "使用前次数",
      prop: "oldNum",
      width: "172px",
      render(ret) {
        return ret.oldNum === -1 ? "无限" : ret.oldNum
      },
    },
    {
      name: "使用次数",
      prop: "number",
      width: "172px",
    },
    {
      name: "剩余次数",
      prop: "overage",
      width: "172px",
      render(ret) {
        return ret.overage === -1 ? "无限" : ret.overage
      },
    },
    // {
    //   name: "到期时间",
    //   prop: "deadline",
    //   width: "172px",
    //   render(ret) {
    //     return moment.unix(ret["deadline"]).format("YYYY-MM-DD HH:mm:ss")
    //   },
    // },
  ],
}
