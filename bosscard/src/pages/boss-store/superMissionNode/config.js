import moment from "moment"

export default {
    hasCheck: false,
    id: "key",
    moreBtn: [],
    headers: [
      {
        name: "日期",
        prop: "created",
        width: "13%",
        sortFilterType: "sort",
        render: (record) => (
            <span> { moment(record.created*1000).format(' YYYY-MM-DD HH:mm ') } </span>
          ),
      },
      {
        name:'会员姓名',
        prop:"clientName",
        width:'13%',
      },
      {
        name: "操作类型",
        prop: "type",
        width: "13%",
        render: (record) => (
            <span> { record.type * 1 === 1 ?  '项目数' : '余额'   } </span>
          ),
      },
      {
        name: "内容",
        prop: "projectName",
        width: "13%",
      },
      {
        name: "修改前内容",
        prop: "former",
        width: "13%",
        render:(e)=><span>{ e.former >= 0 ? e.former  : '无限'  }</span>,
      },
      {
        name: "修改后内容",
        prop: "after",
        width: "13%",
        render:(e)=><span>{ e.after >= 0 ? e.after  : '无限'  }</span>,
      },
      {
        name: "操作人",
        prop: "staffName",
        width: "114px",
      },
        
    ],
    screen: {
      col: 3,
      rules: [
        {
          type: "text",
          prop: "clientName",
          placeholder: "请输入会员名称",
        },
        {
            type: 'list',
            prop: 'type',
            label:'操作类型',
            placeholder:'选择操作类型',
            list:[
                {
                  name:'项目数',
                  value:1,
                },
                {
                  name:'余额',
                  value:2,
                },
            ],
          },  
      ],
    },
  }