
export default {
  id: 'key',
  hasCheck: false,
  isScroll: true,
  hasTotal: true,
  moreBtn: [
    {
      name: "修改",
      power: "Edit",
      icon: "icon-bianji",
      type: 11,
    },
  ],
  headers:[
    {
      name: "员工姓名",
      prop: "staffName",
      width: '124px',
    },
    {
      name: "基本工资",
      prop: "baseWages",
      width: '98px',
    },
    {
      name: "应出勤天数",
      prop: "shouldDay",
      width: '112px',
    },
    {
      name: "实际出勤天数",
      prop: "actualDay",
      width: '126px',
    },
    {
      name: "基础工资应发",
      prop: "shouldWages",
      width: '126px',
    },
    {
      name: "销售提成",
      prop: "sellDeduct",
      width: '98px',
    },
    {
      name: "施工提成",
      prop: "constructDeduct",
      width: '98px',
    },
    {
      name: "充值卡提成",
      prop: "speciesDeduct",
      width: '112px',
    },
    {
      name: "计次卡提成",
      prop: "recordsDeduct",
      width: '112px',
    },
    {
      name: "充值卡消耗提成",
      prop: "speciesDeduct",
      width: '140px',//新加
    },
    {
      name: "业绩奖励提成",
      prop: "performanceDeduct",
      width: '126px',
    },
    {
      name: "薪资调整",
      prop: "adjustMoney",
      width: '98px',
    },
    {
      name: "薪资调整备注",
      prop: "salaryRemark",
      // width: '180px',
      width: '98px',
      className: 'table-padding0',
      render: e=>{
        let adjust = e.adjust || []
        return (
          adjust.map((v,idx)=>{
            return (
              <div key={idx}
                style={{margin:0,width:'120px',whiteSpace:'nowrap',textOverflow:'ellipsis',overflow:'hidden'}}
                // className={e.adjust.length > 1 ? 'ainier-table-item' :'jishu-table-item '}
              >
                {v.adjustDesc + '(' + v.adjustMoney +')'}
              </div>
            )
          })
        )
      },
    },
    {
      name: "工资合计",
      prop: "totalWages",
      width: '98px',
    },
  ],
  screen: {
    col: 3,
    rules: [
      {
        type: "component",
        label: '选择月份',
        prop: 'ym',
      },
      {
        type: 'component',
        label: '选择门店',
        prop: 'storeId',
      },
    ],
  },
}
