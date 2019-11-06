
import moment from 'moment'



const BTN = {
    name: "撤回",
    icon: "icon-shanchu",
    type: 1,
    power: "Delete",
    btnColor: '#FE6060FF',
    
}
const DEL_BTN={
   ...BTN,
   type:66,
   show:(item)=> item.state * 1 === 1 && item.messageNotifyTypeId * 1 !==4 ,
}
const HEADER_ADD_BTN = {
    ...BTN,
    name: "新增",
    icon: "icon-xinzeng",
    type: 217,
  }

const DETAIL_BTN_XQ = {
    name: "详情",
    power: "permission",
    icon: "icon-chanpinfenlei",
    type: 14,
  }
  const EDIT_BTN = {
    name: "修改",
    power: "Edit",
    icon: "icon-bianji",
    type: 11,
    show:(item)=> item.state * 1 === 0 || item.messageNotifyTypeId * 1 ===4 
  }

export const tableConfig = {
    hasCheck: false,
    id: "id",
    moreBtn: [
        DETAIL_BTN_XQ ,
        EDIT_BTN,
        DEL_BTN,
        { ...HEADER_ADD_BTN, btnName: '新建通知' },
    ],
    headers: [
      {
        name:'发送时间',
        prop:'time',
        width:'22%',
        render:(record)=>(
          <span> {  record.time===0 ?'' : moment(record.time * 1000).format("YYYY-MM-DD HH:mm:ss") } </span>
        ),
      },
      {
        name: "通知类型",
        prop: "title",
        width: "21%",
        render:(record)=>(
          <span> { record.title } </span>
        ),
      },
      {
        name: "操作人",
        prop: "operatorName",
        width: "18%",
      },
      {
        name: '状态',
        prop: 'status',
        width: '14%',
        render:(record)=>(
          <span>{ record.state === 0 ? '已撤销' : '已发送'  }</span>
        ),     
      },
    ],
    screen: {
      rules:[],
      query:{

      },
    //   rules: [
    //     {
    //         type: 'list',
    //         placeholder: '选择类型',
    //         prop: 'type',
    //         list: [
    //           {
    //             name:'版本更新',
    //             value:1,
    //           },
    //           {
    //             name:'系统通知',
    //             value:2,
    //           },
    //           {
    //             name:'服务器维护',
    //             value:3,
    //           },
    //           {
    //             name:'异常处理引导',
    //             value:4,
    //           },
    //         ],
    //       },
    //   ],
    },
  }