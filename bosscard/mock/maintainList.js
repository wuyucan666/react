const Mock = require('mockjs')

// const maintianList = Mock.mock({
//     'list | 10 ':[
//        {
//         'id|+1': 2008,
//         'orderId|+1':2008,
//         isB:false,
//         'created|+1':212121212,
//         carNum:'粤A 23231',
//         carType:'大众',
//         clientName:'彭先生',
//         'phone|+1':18241891385,
//         'state|0-2':0,
//         project: [
//             {
//                 projectName: '补胎',
//                 payment: '会员卡'
//             }
//         ],
//         'product|1-3':[
//                 { 
//                    productName:'欧司朗灯泡',
//                    status:1,
//                 },
//         ],
//         'price|500-1000':520,
//         'productPrice|200-300':200,
//         updated:12131213,
//         paytime:1213123131212,
//         carPerson:'小柏包',
//         payPerson:'林哥',
//         payType:'混合支付', 
//         remark:'这个不错哦',
//        }, 
//     ],
// })
// const maintianList={
//     'list':[
//        {
//         'id': 2008,
//         'orderId':2008,
//         isB:false,
//         'created':212121212,
//         carNum:'粤A 23231',
//         carType:'大众',
//         clientName:'彭先生',
//         'phone':18241891385,
//         'state':0,
//         project: [
//             {
//                 projectName: '补胎',
//                 payment: '会员卡'
//             }
//         ],
//         'product':[
//                 { 
//                    productName:'欧司朗灯泡',
//                    status:1,
//                 },
//         ],
//         'price':520,
//         'productPrice':200,

//         updated:12131213,
//         paytime:1213123131212,
//         carPerson:'小柏包',
//         payPerson:'林哥',
//         payType:'混合支付', 
//         remark:'这个不错哦',
//        }, 
//     ],
//     curPage:1,
//     curSize:10,
//     totalPage:25,
//     totalSize:250,
//     code:0

// }

const detailList=Mock.mock({
            order:{
                id:12131323,
                orderId:12213122,
                carNum:'辽J 123456',
                carType:'大众',
                clientName:'周嘉佳',
                phone:13841812463,
                created:1213214243,
                carMlie:'1200km',
                service:'林小辉',
                updated:12323212,
                paytime:12312133,
                payPerson:'林小辉',
                sendCar:121312121,
                price:892.16
            },
           progress:[
               {
                  name:"小周周",
                  time:1213121221,
               },
               {
                    name:"小周周",
                    time:1213121221,
               },
           ],
           project:[{
               id:12131231,
               projectName:'补胎',
               orderId:114257668,
               construction:'补偿',
               salePerson:'林慧',
               everyPrice:250.5,
               worktime:2,
               unit:'个',
               discount:10,
               price:500,
           }],
           product:[
               {
                id:12131231,
                productName:'补胎',
                orderId:114257668,
                construction:'补偿',
                salePerson:'林慧',
                everyPrice:250.5,
                count:2,
                unit:'个',
                discount:10,
                price:500,
               },
           ],
           attachProject:[{
                id:12131231,
                projectName:'补胎',
                construction:'补偿',
                salePerson:'林慧',
                everyPrice:250.5,
                count:2,
                discount:10,
                price:500,
           }],
           storeRecord:[{
               id:123131322,
               productName:'机油',
               count:'1',
               store:'领料',
               created:12131411,
               stuffPerson:'刘志勇',
               workPerson:'操作人',
           }],
           orderDetail:{
              payType:'微信支付',
              price:'892.16',
              clientSay:'后天结婚，婚车要整理干净',
              remark:'',
              cancelReason:'',
              kindRemin:'温馨提示', //温馨提示,
              oilMeter:'油表提示',  //油表提示
              instruction:'质量保证期为车辆行驶3000公里',
              finalInspection:true,
              mainSug:'赶紧修好',
              faultDes:'空调坏了，没有冷气，要换一换'
           },
           
    
    
})
module.exports = {
    [`GET /maintainList/detail`](req, res) {
      res.status(200).json({
        code: 0,
        list: detailList,
      })
    },
}    