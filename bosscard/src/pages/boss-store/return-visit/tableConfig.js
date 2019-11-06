// import { Divider } from "antd"
import styles from './styles.less'
import {Tag} from 'antd'
import moment from 'moment'
export default {
  id: "id",
  // isScroll: true,
  // hasTotal: true,
  moreBtn: [
    // {
    //   name: "添加回访记录",
    //   power: "Edit",
    //   icon: "icon-tianjiahuifangjilu",
    //   type: 11,
    // },
    // {
    //   name: "删除",
    //   power: "Edit",
    //   icon: "icon-shanchu",
    //   props:'type,source',
    //   type: 1,
    //   show:(e)=>{
    //    if(e.source===2){
    //      return true
    //    }else{
    //      return false
    //    }
    //   },
    // },
   ],
  headers: [{
    name: "车牌/联系方式",
    prop: "plateNumber,clientName,clientPhone",
    width: '12%',
  },
  {
    name: "里程",
    prop: "mileage",
    width: '8%',
  },
  {
    name: "最近到店时间",
    prop: "lastTime",
    width: '8%',
    render:(e)=>{
      var time=(e.lastTime<=0)?'-':moment(e.lastTime*1000).format('YYYY-MM-DD')
     return time
    },
  },
  {
    name: "回访员工",
    prop: "staffName",
    width: '6%',
  },
  {
    name: "回访类型",
    prop: "type,source",
    width: '11%',
    render:e=>{
      if(e.type===6){
        return (<div className={styles.lyc_tag}>
          <Tag visible={e.source===2} color="#24C02F">自定义</Tag>
          <span>施工项目到期</span>
        </div>)
      }else if(e.type===7){
        return (<div className={styles.lyc_tag}>
         <Tag visible={e.source===2} color="#24C02F">自定义</Tag>
          <span>开单回访</span>
        </div>)
      }else if(e.type===1){
        return (<div className={styles.lyc_tag}>
         <Tag visible={e.source===2} color="#24C02F">自定义</Tag>
          <span>车辆保险到期</span>
        </div>)
      }else if(e.type===2){
        return (<div className={styles.lyc_tag}>
          <Tag visible={e.source===2} color="#24C02F">自定义</Tag>
          <span>车检(年审)到期</span>
        </div>)
      }else if(e.type===4){
        return (<div className={styles.lyc_tag}>
          <Tag visible={e.source===2} color="#24C02F">自定义</Tag>
          <span>客户异常到店</span>
        </div>)
      }else if(e.type===3){
        return (<div className={styles.lyc_tag}>
          <Tag visible={e.source===2} color="#24C02F">自定义</Tag>
          <span>会员卡到期</span>
        </div>)
      }
    },
  },
  {
    name: "项目",
    prop: "servicesProject",
    width: "12%",
    render: (e) => {
      if(e.type === 6){
        return Array.isArray(e.servicesProject)&&e.servicesProject.map(v=>{
          return (
            <div className={styles.lyc_carAttn}>
              <span>{v.name}</span>
            </div>
          )
        })
      }else{
        return '-'
      }
    },
  },
  {
    name: "提醒原因",
    prop: "reason",
    width: '9%',
    render:(e)=>{
      if(e.reason===''){
        return '-'
      }else{
        return e.reason
      }
    },
  },
  {
    name: "待回访时间",
    prop: "visitTime",
    width: '10%',
    render:e=>{
      return (<div className={styles.lyc_tag}>
        <Tag visible={e.overdueTime>0} color="#FF6F28">逾期</Tag>
        <span >{moment(e.visitTime*1000).format('YYYY-MM-DD')}</span>
      </div>)
    },
  },
  {
    name: "单号",
    prop: "orderNo",
    width: '11%',
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
            name: "施工项目到期",
            value: 6,
          },
          {
            name: "车辆保险到期",
            value: 1,
          },
          {
            name: "车检(年审)到期",
            value: 2,
          },
          {
            name: "客户异常到店",
            value: 4,
          },
          {
            name: "会员卡到期",
            value: 3,
          },
          {
            name: '开单回访',
            value: 7,
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
