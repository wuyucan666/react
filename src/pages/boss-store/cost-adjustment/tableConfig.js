// const EDIT_BTN = {
//   name: "修改",
//   power: "Edit",
//   icon: "icon-jicun1",
//   type: 11,
// }
import moment from 'moment'
export default {
  hasCheck: false,
  id: "id",
  moreBtn: [],
  headers: [
    {
      name: "调整时间",
      prop: "createdAt",
      width: '18%',
      sortFilterType: "sort",
      render:(v)=>{
       return moment(v.createdAt*1000).format('YYYY-MM-DD HH:mm')
      },
    },
    {
      name: "产品",
      prop: "name",
      width: '154px',
      render: (text, item) => {
        return <div style={{width:'154px', wordWrap:'break-word',wordBreak:'break-all'}}>
          {text.name}
        </div>
      },
    },
    {
      name: "编码",
      prop: "commodityCode",
      width: '112px',
      render: (text, item) => {
        return <div style={{width:'112px', wordWrap:'break-word',wordBreak:'break-all'}}>
          {text.commodityCode}
        </div>
      },
    },
    {
      name: "规格",
      prop: "specification",
      width: '15%',
    },
    {
      name: "仓库",
      prop: "warehouseName",
      width: '12%',
    },
    {
      name: "调整前成本",
      prop: "original",
      width: '15%',
    },
    {
      name: "调整后成本",
      prop: "present",
      width: '12%',
    },
    {
      name: "操作人",
      prop: "staffName",
      width: '13%',
    },
  ],
  screen: {
    col: 3,
    rules: [
      {
        type: "text",
        prop: "name",
        placeholder: "产品名称",
      },
    ],
  },
}
