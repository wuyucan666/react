import moment from "moment"
const DETAIL_BTN = {
  name: "详情",
  power: "permission",
  icon: "icon-xiangqing",
  type: 14,
}
export default {
  hasCheck: false,
  id: "key",
  moreBtn: [
    {
      ...DETAIL_BTN,
    },
  ],
  headers: [
    {
      name: "时间",
      prop: "completed",
      width: "12%",
      render: (e) => {
        return e.completed ? moment(e.completed * 1000).format("YYYY-MM-DD  HH:mm") : ""
      },
    },
    {
      name: "单号",
      prop: "orderId",
      width: "8%",
    },
    {
      name: "项目/产品",
      prop: "goodsName",
      width: "11%",
      render: (text) => {
        return <div style={{ width: '154px', wordWrap: 'break-word', wordBreak: 'break-all' }}>
          {text.goodsName}
        </div>
      },
    },
    {
      name: "编码",
      prop: "commodityCode",
      width: "8%",
      render: (text) => {
        return <div style={{ width: '100%', wordWrap: 'break-word', wordBreak: 'break-all' }}>
          {text.commodityCode}
        </div>
      },
    },
    {
      name: "金额(元)",
      prop: "amount",
      width: "8%",
    },
    {
      name: "订单业绩",
      prop: "receipts",
      width: "8%",
    },
    {
      name: "销售业绩",
      prop: "sellStaff",
      width: "8%",
      render: (e) => {
        let sellStaff = e.sellStaff || []
        return (
          sellStaff.map((item, idx) => {
            return <div
              key={idx}
              style={{ margin: 0, width: '100%', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}
            >
              {item.staffName + ': ' + item.amount}&nbsp;
            </div>
          })
        )
      },
    },
    {
      name: "施工业绩",
      prop: "construct",
      width: "8%",
      render: (e) => {
        let construct = e.construct || []
        return (
          construct.map((item, idx) => {
            return <div
              key={idx}
              style={{ margin: 0, width: '100%', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}
            >
              {item.staffName + ': ' + item.amount}&nbsp;
            </div>
          })
        )
      },
    },
    {
      name: "结算方式",
      prop: "pays",
      width: "8%",
      render: (e) => {
        let pays = e.pays || []
        return (
          pays.map((item, idx) => {
            return <div
              key={idx}
              style={{ margin: 0, width: '100%', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}
            >
              {item.name + ' ' + item.money + ' '}
            </div>
          })
        )
      },
    },
    {
      name: "结算人",
      prop: "settlement",
      width: "8%",
    },
  ],
  screen: {
    col: 3,
    query: {},
    rules: [
      {
        type: "text",
        prop: "orderId,refOrderId,licenseNo,clientName,projectName,productName",
        placeholder: "单号/项目/产品",
      },
      { type: "list", prop: 'staffId', list: [], label: '选择员工' },
      {
        type: "date<>",
        prop: "completed",
      },
    ],
  },
}
