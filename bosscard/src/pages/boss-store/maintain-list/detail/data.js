export  const selectList={
    order:{
        id:null,
        orderId:null,
        carNum:'',
        carType:'',
        clientName:'',
        phone:null,
        created:null,
        carMlie:'',
        service:'',
        updated:null,
        paytime:null,
        payPerson:'',
        sendCar:null,
        price:null,
        maintainType:'',
    },
   progress:[
       {
          name:'',
          time:null,
       },
       {
            name:'',
            time:null,
       },
   ],
   project:[{
       id:null,
       projectName:'',
       orderId:null,
       construction:[],
       salePerson:[],
       everyPrice:null,
       worktime:null,
       unit:'',
       discount:null,
       price:null,
   }],
   product:[
       {
        id:null,
        productName:'',
        orderId:null,
        construction:[],
        salePerson:[],
        everyPrice:null,
        count:null,
        unit:'',
        discount:null,
        price:null,
       },
   ],
   attachProject:[{
        id:null,
        projectName:'',
        construction:[],
        salePerson:[],
        everyPrice:null,
        count:null,
        discount:null,
        price:null,
   }],
   storeRecord:[{
       id:null,
       productName:'',
       count:'',
       store:'',
       created:null,
       stuffPerson:'',
       workPerson:'',
   }],
   orderDetail:{
      payType:'',
      price:'',
      clientSay:'',
      remark:'',
      cancelReason:'',
      kindRemin:'', //温馨提示,
      oilMeter:'',  //油表提示
      instruction:'',
      finalInspection:true,
      mainSug:'',
      faultDes:'',
   },
   paymentRecord:[
    {
      paymentMoney:0,
      paymentName:'',
      type:1,
      balance:0
    }
   ]
}
export  const historyList=[
    {
        id:null,
        name:'',
        operation:'',
        laststate:'',
        nowstate:'',
        created:null,
   },
]
export const data=[
    {
   id:12131,
   index:111,
   orderId:111212121212,
   created:121321231232,
   carNum:'粤A 21536',
   carType:'大众',
   clientName:'赵先生',
   phone:1555555555,
   project:[{ projectName:'补胎补胎补胎',payment:'会员卡' }],
   product:[ {productName:'欧司朗灯泡',status:1} ,{productName:'欧司朗灯泡',status:2}  ],
   additional:[],
   state:1,
   isB:false,
   price:500,
   productPrice:200,
   updated:232422323,
   worktime:1231212,
   buytime:12334,
   paytime:21313121,
   carPerson:'小周迅',
   payPerson:'林哥',
   payType:'支付种类',
   remark:'这个很不错哦',
 },
]
export  const Blist={
    order:{
        id:null,
        orderId:null,
        carNum:'',
        carType:'',
        clientName:'',
        phone:null,
        created:null,
        carMlie:'',
        service:'',
        updated:null,
        paytime:null,
        payPerson:'',
        sendCar:null,
        price:null,
        maintainType:'',
    },
   project:[
    //    {
    //    id:null,
    //    projectName:'',
    //    orderId:null,
    //    construction:'',
    //    salePerson:'',
    //    everyPrice:250.5,
    //    worktime:2,
    //    unit:'个',
    //    discount:10,
    //    price:500,
    //     }
],
   product:[
    //    {
    //     id:12131231,
    //     productName:'补胎',
    //     orderId:114257668,
    //     construction:'补偿',
    //     salePerson:'林慧',
    //     everyPrice:250.5,
    //     count:2,
    //     unit:'个',
    //     discount:10,
    //     price:500,
    //    },
   ],
   attachProject:[
    //    {
    //     id:12131231,
    //     projectName:'补胎',
    //     construction:'补偿',
    //     salePerson:'林慧',
    //     everyPrice:250.5,
    //     count:2,
    //     discount:10,
    //     price:500,
    //     }
    ],
   orderDetail:{
      payType:'',
      price:'',
      clientSay:'',
      remark:'',
      cancelReason:'',
      kindRemin:'', //温馨提示,
      oilMeter:'',  //油表提示
      instruction:'',
      finalInspection:null,
      mainSug:'',
      faultDes:'',
   },
}
export const reportData={
    functions:[],
    items:[],
    appearance:[],
    images:[],
    remark:'',
}
export const CarDes = [
    {
       name:'车身右侧',
       style:{
        left:'30px',
        top:'50px',
        position:'absolute',
        width:'437px',
       },
     },
     {
        name:'车顶',
        style:{
         left:'600px',
         top:'50px',
         width:'184',
         position:'absolute',
        },
      },
      {
        name:'车头',
        style:{
         left:'860px',
         top:'50px',
         width:'189px',
         position:'absolute',
        },
      },
      {
        name:'车身左侧',
        style:{
         left:'30px',
         top:'380px',
         position:'absolute',
         width:'437px',
        },
      },
      {
        name:'车尾',
        style:{
         left:'860px',
         top:'380px',
         width:'189px',
         position:'absolute',
        },
      },
    ]
    export const damage = [
        {
          text:'划痕',
          symbol:'H',
        },
        {
         text:'破裂',
         symbol:'P',
        },
        {
         text:'掉漆',
         symbol:'D',
        },
        {
         text:'凹陷',
         symbol:'A',
        },
        {
         text:'裂痕',
         symbol:'L' ,
        },
        {
         text:'其他',
         symbol:'X',
        },
        ]
export  const  reportData36=[
    {
        time:null,
        index:null,
        scheme:[],
        explain:[],
        remark:'',
        result:null,
    },
]
