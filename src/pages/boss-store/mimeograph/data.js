
let a=new Date()
//小票数据源
export const data={
    storeName:"XXX",
    orderId:123121233,
    created:a.getTime()/1000,
    clientName:"*小姐",
    balance:8888.88,
    project: [{
                 name:"消费项目1",
                 amount:888,
                 count:1,
                 cash:888,
              },
              {
                 name:"消费项目2",
                 amount:888,
                 cash:888,
                 count:1,
              }],

    totalPrice:1776,
    //充值金额
    rechargeMoney:888,
    //赠送金额
    giveMoney:888,
    payType:[
        {
          name:"支付方式1",
          money:888,
        }
       ,{
         name:"支付方式2",
         money:888,
        },
    ],
    remark:"",
    give:[{
            name:"赠送项目",
            amount:888,
            count:1,
            cash:888,
            }],
    phone:1300000000,
    address:"",
}
//表单数据源
export const formData=[
    {
       label:'开户行',
       value:'bankType',

    },
    {
        label:'银行卡号',
        value:'bankNumber',
        num:true,
    },
    {
        label:'税号',
        value:'taxRegNo',
        // num:true,
    },
    {
        label:'服务热线',
        value:'hotLine',
        // num:true,
    },
    {
        label:'道路救援热线',
        value:'sosHotLine',
        // num:true,
    },
    {
        label:'地址',
        value:'address',
    },
    {
        label:'门店备注',
        value:'remark',
        strong:true,
    },
]

export  const  project=[
    {
    name:'序号',
    flex:1,
  },
//   {
//      name:'编码',
//      flex:1,
//   },
  {
     name:'服务内容',
     flex:2,
     otherName:'服务内容',
  },
  {
     name:'施工',
     flex:1,
  },
  {
      name:'单价',
      flex:1,
  },
  {
      name:'数量',
      isProduct:true,
      otherName:'数量',
      flex:1,
  },
  {
      name:'原价折扣',
      flex:1,
  },
  {
      name:'卡抵扣',
      flex:1,
  },
  {
      name:'实收',
      flex:1,
  },
  {
      name:'卡剩余',
      flex:1,
  },
]
export const product =[
    {
        name:'序号',
        flex:1,
      },
    //   {
    //      name:'编码',
    //      flex:1,
    //   },
      {
         name:'产品',
         flex:2,
      },
      {
         name:'施工',
         flex:1,
      },
      {
          name:'单价',
          flex:1,
      },
      {
          name:'数量',
          flex:1,
      },
      {
          name:'原价折扣',
          flex:1,
      },
      {
          name:'卡抵扣',
          flex:1,
      },
      {
          name:'实收',
          flex:1,
      },
      {
          name:'卡剩余',
          flex:1,
      },
]
export  const attrachProject=[
    {
      name:'序号',
      flex:2,
    },
    {
      name:'附加费用',
      flex:2,
    },
    {
      name:'施工',
      flex:1,
    },
    {
      name:'单价',
      flex:1,
    },
    {
      name:'数量',
      flex:2,
    },
    {
      name:'折扣',
      flex:2,
    },
    {
      name:'金额',
      flex:1,
    },
   ]
export  const  otherProject=[ {
    name:'序号',
    flex:1,
  },
//   {
//      name:'编码',
//      flex:1,
//   },
  {
     name:'项目',
     flex:2,
  },
  {
     name:'施工',
     flex:1,
  },
  {
     name:'销售',
     flex:1,
  },
  {
      name:'单价',
      flex:1,
  },
  {
      name:'数量',
      flex:1,
  },
  {
      name:'原价折扣',
      flex:1,
  },
  {
      name:'卡抵扣',
      flex:1,
  },
  {
      name:'实收',
      flex:1,
  },
  {
      name:'卡剩余',
      flex:1,
  },
]
export const otherProduct=[ {
    name:'序号',
    flex:1,
  },
//   {
//      name:'编码',
//      flex:1,
//   },
  {
     flex:2,
     otherName:'产品',
  },
  {
     name:'施工',
     flex:1,
  },
  {
     name:'销售',
     flex:1,
  },
  {
      name:'单价',
      flex:1,
  },
  {
      name:'数量',
      flex:1,
  },
  {
      name:'原价折扣',
      flex:1,
  },
  {
      name:'卡抵扣',
      flex:1,
  },
  {
      name:'实收',
      flex:1,
  },
  {
      name:'卡剩余',
      flex:1,
  },
]
export  const  materiel=[ {
    name:'序号',
    flex:1,
  },
  {
     name:'编码',
     flex:1,
  },
  {
     name:'产品',
     flex:2,
  },
  {
     name:'仓库',
     flex:1,
  },
  {
     name:'单价',
     flex:1,
  },
  {
      name:'数量',
      flex:1,
  },
  {
      name:'单位',

      flex:1,
  },
  {
      name:'折扣',
      flex:1,
  },

  {
      name:'金额',
      flex:1,
  },
  {
      name:'备注',
      flex:1,
  },
]
export const construction=[
    {
        name:'序号',
        flex:1,
      },
      {
         name:'项目',
         flex:2,
      },
      {
         name:'施工',
         flex:2,
      },
      {
         name:'单价',
         flex:2,
      },
      {
         name:'数量',
         flex:2,
      },
      {
          name:'备注',
          flex:2,
      },
]
