// import { Divider } from "antd"
import moment from 'moment'
export default {
  id: "visitId",
  moreBtn: [
    {
      name: "修改",
      power: "Edit",
      icon: "icon-bianji",
      type: 11,
    },
    {
      name: "删除",
      power: "Edit",
      icon: "icon-shanchu",
      type: 1,
    },
   ],
  headers: [{
    name: "车牌/联系方式",
    prop: "cardName",
    width: 14,
  },
  {
    name: "里程",
    prop: "mileage",
    width: 10,
  },
  {
    name: "最近到店时间",
    prop: "created",
    width: 12,
    render:(e)=>{
     return moment(e.created*1000).format('YYYY-MM-DD')
    },
  },
  {
    name: "回访员工",
    prop: "visitStaff",
    width: 11,
  },
  {
    name: "回访类型",
    prop: "visitType",
    width: 11,
  },
  {
    name: "回访主题",
    prop: "visitTitle",
    width: 11,
  },
  {
    name: "待回访时间",
    prop: "delayTime",
    width: 12,
  },
  {
    name: "单号",
    prop: "deadline",
    width: 19,
  },
],
  screen: {
    col: 4,
    rules: [
      {
        type: "text",
        placeholder: '客户姓名/车牌号/手机号/订单号',
        prop: "clientName,licenseNo,phoneNo,orederNo",
      },
      {
        type: "list",
        label: "回访类型",
        prop: "visitType",
        list: [
          {
            name: "充值卡",
            value: 1,
          },
          {
            name: "计次卡",
            value: 2,
          },
        ],
      },
      {
        type: "date<>",
        label: "提醒时间",
        prop: "warnTime",
      },
    ],
  },
}
