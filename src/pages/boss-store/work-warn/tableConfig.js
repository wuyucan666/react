import Status from "components/CommonTable/status"

export default {
  id: "id",
  // hasTotal: true,
  pagination:false,
  hasCheck: true,
  moreBtn: [
    {
      name: "修改",
      power: "Edit",
      icon: "icon-bianji",
      type: 11,
    },
    {
      name: "删除",
      icon: "icon-shanchu",
      type: 1,
      power: "Delete",
    },
    {
      name: "禁用",
      power: "Forbidden",
      icon: "icon-tingyong",
      type: 13,
      show:(e)=>{
      if(e.isDisabled){
        return false
      }else{
        return true
      }
      },
    },
    {
      name: "启用",
      power: "permission",
      icon: "icon-qiyong",
      type: 16,
      show:(e)=>{
        if(e.isDisabled){
          return true
        }else{
          return false
        }
        },
    },
  ],
  headers: [
    {
      name: "项目名称",
      prop: "projectName",
      width: 20,
    },
    {
      name: "回访提醒时间",
      prop: "time",
      width: 20,
    },
    {
      name: "提醒人",
      prop: "staffName",
      width: 20,
      render:(v)=>{
        if(v.staffName){
          return v.staffName
        }else{
          return '服务顾问'
        }
      },
    },
    {
      name: "状态",
      prop: "isDisabled",
      width: 20,
      render: (ret) => (
        <Status status={!ret.isDisabled}>
          {ret.isDisabled ? "停用" : "启用"}
        </Status>
      ),
    },
  ],
  screen: {
    col: 4,
    rules: [
      {
        type: "text",
        placeholder: "项目名称",
        prop: "projectName",
      },
      {
        type: "list",
        label: "状态",
        prop: "state",
        list: [
          {
            name: "停用",
            value: 2,
          },
          {
            name: "启用",
            value: 1,
          },
        ],
      },
    ],
  },
}
