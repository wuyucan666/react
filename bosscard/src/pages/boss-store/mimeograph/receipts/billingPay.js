import React from 'react'
import moment from "moment"
import { project ,otherProject ,product  ,otherProduct } from '../data'

// var data={
//     storeName:'林哥的店',
//     orderId:12134231, //单号
//     cardId:123413233,//卡号
//     remainder:500.6,//余额
//     created:121213333,
//     storePhone:13333333333,//门店电话
//     clientName:'白大姐',//顾客姓名
//     phone:'1112123',//顾客电话
//     serviceAdvisor:'大王', //服务顾问
//     remark:'无',
//     carNum:12341,
//     carType:'丰田凯美瑞',//车型
//     payTime:121321312, //支付时间
//     storeMileage:1222,//进店里程
//     oilMeter:12,//油表
//     carCarriage:'mx-490',//车架号
//     motorNum:'vm-440',//发动机号
//     inFactoryTime:12131231,//进厂时间
//     outFactoryTime:12421212,//出厂时间
//     describe:'年少的那我i大苏打哇大王的哇唔哇i撒到我吊袜带2我弟娃儿额哇',//描述
//     billingRemark:'尽快拥有车，请马上要用车',
//     project:[{
//         code:1232321412, //编码
//         maintainProject:'补胎', //维修项目
//         construct:'小白白', //施工
//         price:500, //单价
//         workTime:13,//工时
//         unit:'个',//单位
//         discount:10,//折扣
//         money:'金额',
//         salePerson:'小白白',//销售
//         packageBalance:0,//套餐剩余
//     }],
//     product:[
//         {
//             code:1232321412, //编码
//             maintainProject:'补胎', //维修项目
//             construct:'小白白', //施工
//             price:500, //单价
//             count:13,//数量
//             unit:'个',//单位
//             discount:10,//折扣
//             money:'金额',
//             packageBalance:0,//套餐剩余
//             salePerson:'小白白',
//         },
//     ],
//     attrachProject:[
//         {
//             attrachPay:5000,//附件费用
//             construct:'小白白',//施工
//             price:200,//单价
//             discount:10,//折扣
//             money:500,//金额
//             count:20,//数量
//         },
//     ],
//     storeSetting:{
//         depositBank:'广州白云黄石分行',//开户行
//         bankCard:'12313121231212',//银行卡号
//         hotline:400641224 ,//服务热线
//         SOShotline:1232434,//道路救援热线
//         address:'广州白云区五号',//地址
//         remark:'这个不错哦',//门店备注
//         dutyParagraph:1243232121212,//税号
//     },
//     computerPrice:{
//         workPrice:400,//工时费
//         projectPrice:200,//项目费
//         partsPrice:400,//配件费
//         attrachPrice:800,//附加费
//         totalPrice:900,//合计
//         preferentialPrice:500,//优惠金额
//         amountReceived:23233,//实收金额
//         upperPrice:'叁仟是十元整 ',
//         payType:{
//             name:'混合支付',
//             options:[
//                 {
//                    name:'支付宝',
//                    value:200,
//                 },
//                 {
//                     name:'微信',
//                     value:200,
//                 },
//             ],
//         },
//     },
// }
//结算单打印 billingPay组件
//通过配置缩放比控制打印结算单大小
//scale 缩放比 默认为1
//type 结算单类型 0 结算单-维修开单 1结算单-快捷开单 2 B单打印-维修开单 3 B单打印-快捷开单
//data 数据源
//自定义表单头部


const OliType=['','空','小于1/4','1/4','1/2','3/4','满']
  //判断油表类型
const  handerOilType=(Type)=>{
    return OliType[Type]
 }
const  getTableTitle=(type,scale,data)=>{
     if( type === 1 || type === 0 ){
          return (<div>
                    <p style={{ height:(178*scale)+'px',fontSize:(42*scale)+'px',lineHeight:(178*scale)+'px',color:'#000',marginBottom:0 } } >
                        <span style={ { float:'left' } } >单号：{ data.orderId }</span>
                        <span style={ { float:'right' } } >日期：{ data.created===0?  '':moment(data.created * 1000).format("YYYY-MM-DD") } </span>
                    </p>
                 </div>)
     }else if( type === 2 || type === 3 ){
          return (<div>
                    <p style={{ height:(178*scale)+'px',fontSize:(42*scale)+'px',lineHeight:(178*scale)+'px',color:'#000',position:'relative',marginBottom:0 } } >
                        <span style={ { float:'left' } } >单号：{ data.orderId }</span>
                        <span style={ { position:'absolute',left:'50%',transform:'translate(-50%,0)' } } >电话：{ data.storePhone }</span>
                        <span style={{ float:'right' }} >日期：{ data.created===0?  '':moment(data.created * 1000).format("YYYY-MM-DD") }</span>
                    </p>
                  </div> )
     }
}
//自定义表头结构
const getTableheader=(type,scale,data)=>{
    const D={ width:(210.48*scale)+'px',boxSizing:'border-box',border:'1px solid #000' ,paddingLeft:(20*scale)+'px' ,color:'#000' }
    const S={ width:(421.77*scale)+'px',boxSizing:'border-box' ,border:'1px solid #000',paddingLeft:(20*scale)+'px' ,color:'#000' }
    const T={ height:(63*scale)+'px',width:(2481*scale)+'px',fontSize:(32*scale)+'px',lineHeight:(63*scale)+'px'  ,color:'#000' }
    const D1={ width:(275.7*scale)+'px',boxSizing:'border-box',border:'1px solid #000' ,paddingLeft:(20*scale)+'px',color:'#000'  }
    const S1={ width:(551.3*scale)+'px',boxSizing:'border-box',border:'1px solid #000' ,paddingLeft:(20*scale)+'px',color:'#000'  }
    switch(type){
        case 0 :
        return ( <tbody>
                     <tr style={ T } >
                        <td style={ D } >姓名：</td>
                        <td style={ S } >{ data.clientName } </td>
                        <td style={ D } >电话：</td>
                        <td style={ S } >{ data.phone }</td>
                        <td style={ D } >服务顾问：</td>
                        <td style={ S } >{ data.serviceAdvisor }</td>
                        <td style={ D } >备注：</td>
                        <td style={ S } >{ data.remark }</td>
                     </tr>
                     <tr style={ T } >
                        <td style={ D } >车牌：</td>
                        <td style={ S } >{ data.carNum }</td>
                        <td style={ D } >车型：</td>
                        <td style={ S } >{ data.carType }</td>
                        <td style={ D } >车架号：</td>
                        <td style={ S } >{ data.carCarriage }</td>
                        <td style={ D } >发动机号：</td>
                        <td style={ S } >{ data.motorNum }</td>
                     </tr>
                     <tr style={ T } >
                        <td style={ D } >油表：</td>
                        <td style={ S } >{ handerOilType(data.oilMeter) }</td>
                        <td style={ D } >进店里程：</td>
                        <td style={ S } >{ data.storeMileage }KM</td>
                        <td style={ D } >进厂时间：</td>
                        <td style={ S } >{ data.inFactoryTime===0?  '':moment(data.inFactoryTime * 1000).format("YYYY-MM-DD HH:mm ") }</td>
                        <td style={ D } >出厂时间：</td>
                        <td style={ S } >{data.outFactoryTime===0?  '': moment(data.outFactoryTime * 1000).format("YYYY-MM-DD HH:mm  ") }</td>
                     </tr>
                 </tbody> )
        case 1 :
        return ( <tbody>
                     <tr style={ T } >
                        <td style={ D1 } >姓名：</td>
                        <td style={ S1 } >{ data.clientName } </td>
                        <td style={ D1 } >电话：</td>
                        <td style={ S1 } >{ data.phone }</td>
                        <td style={ D1 } >备注：</td>
                        <td style={ S1 } >{ data.remark }</td>
                     </tr>
                     <tr style={ T } >
                        <td style={ D1 } >车牌：</td>
                        <td style={ S1 } >{ data.carNum }</td>
                        <td style={ D1 } >车型：</td>
                        <td style={ S1 } >{ data.carType }</td>
                        <td style={ D1 } >服务顾问：</td>
                        <td style={ S1 } >{ data.serviceAdvisor }</td>
                     </tr>
                     <tr style={ T } >
                        <td style={ D1 } >进店里程：</td>
                        <td style={ S1 } >{ data.storeMileage }KM</td>
                        <td style={ D1 } >进厂时间：</td>
                        <td style={ S1 } >{data.inFactoryTime===0?  '': moment(data.inFactoryTime * 1000).format("YYYY-MM-DD HH:mm  ") }</td>
                        <td style={ D1 } >结算时间：</td>
                        <td style={ S1 } >{ data.payTime===0?  '': moment(data.payTime * 1000).format("YYYY-MM-DD HH:mm  ") }</td>
                     </tr>
                </tbody> )
        case 2 :
        return ( <tbody>
                    <tr style={ T } >
                        <td style={ D } >姓名：</td>
                        <td style={ S } >{ data.clientName } </td>
                        <td style={ D } >电话：</td>
                        <td style={ S } >{ data.phone }</td>
                        <td  colSpan={4}  style={ { width:(1240.5*scale)+'px',boxSizing:'border-box',border:'1px solid #000' ,paddingLeft:(20*scale)+'px' ,color:'#000' } } ></td>
                    </tr>
                    <tr style={ T } >
                        <td style={ D } >车牌：</td>
                        <td style={ S } >{ data.carNum }</td>
                        <td style={ D } >车型：</td>
                        <td style={ S } >{ data.carType }</td>
                        <td style={ D } >车架号：</td>
                        <td style={ S } >{ data.carCarriage }</td>
                        <td style={ D } >发动机号：</td>
                        <td style={ S } >{ data.motorNum }</td>
                     </tr>
                     <tr style={ T } >
                        <td style={ D } >服务顾问：</td>
                        <td style={ S } >{ data.serviceAdvisor }</td>
                        <td style={ D } >进店里程：</td>
                        <td style={ S } >{ data.storeMileage }KM</td>
                        <td style={ D } >进厂时间：</td>
                        <td style={ S } >{ data.inFactoryTime===0?  '':moment(data.inFactoryTime * 1000).format("YYYY-MM-DD HH:mm  ") }</td>
                        <td style={ D } >出厂时间：</td>
                        <td style={ S } >{data.outFactoryTime===0?  '': moment(data.outFactoryTime * 1000).format("YYYY-MM-DD HH:mm  ") }</td>
                     </tr>
                </tbody> )
        case 3 :
        return  (<tbody>
                    <tr style={ T } >
                        <td style={ D1 } >姓名：</td>
                        <td style={ S1 } >{ data.clientName } </td>
                        <td style={ D1 } >电话：</td>
                        <td style={ S1 } >{ data.phone }</td>
                        <td style={ { width:(827*scale)+'px',boxSizing:'border-box',border:'1px solid #000' ,paddingLeft:(20*scale)+'px' ,color:'#000' } } colSpan={2} ></td>
                    </tr>
                    <tr style={ T } >
                        <td style={ D1 } >车牌：</td>
                        <td style={ S1 } >{ data.carNum }</td>
                        <td style={ D1 } >车型：</td>
                        <td style={ S1 } >{ data.carType }</td>
                        <td style={ D1 } >服务顾问：</td>
                        <td style={ S1 } >{ data.serviceAdvisor }</td>
                     </tr>
                     <tr style={ T } >
                        <td style={ D1 } >进店里程：</td>
                        <td style={ S1 } >{ data.storeMileage }KM</td>
                        <td style={ D1 } >进厂时间：</td>
                        <td style={ S1 } >{ data.inFactoryTime===0?  '' : moment(data.inFactoryTime * 1000).format("YYYY-MM-DD HH:mm  ") }</td>
                        <td style={ D1 } >结算时间：</td>
                        <td style={ S1 } >{ data.payTime===0?  '': moment(data.payTime * 1000).format("YYYY-MM-DD HH:mm  ") }</td>
                     </tr>
                 </tbody>)
        default:
        return
    }
}
//2列 3列排列模式
const getTableMoreProListType = (type,scale,data,O,L) => {
    const { product , project , give } = data
    const totalLength = product.length + project.length + give.length
    const proList = [ ...project , ...product , ...give.map(item=>{
        return {
            ...item,
            maintainProject:item.name,
            const:item.num,
            actuallyPaid:'0.00',
            isGive:true,
        }
    }) ]
    // 3列情况 渲染行数
    let col , idx = 0
    totalLength > 24 ? col = 3 : col = 2
    let renderList = []
    let colLengrh = Math.ceil(totalLength / col)
    for(let i = 0 ; i < col ; i++ ){
        renderList.push( proList.slice( i * colLengrh , ( i + 1 ) * colLengrh ) )
    }

    return <div style={{ display:'flex'  }} >
          {
            renderList.map((item,index)=>{
                let tureItem =[ ...item ]
                if(renderList.length!==colLengrh){
                   for(let i=0; i<colLengrh-item.length;i++ ){
                      tureItem.push({
                          isNull:true,
                      })
                   }
                }
                return <div  style={{ flex:1,fontSize:(32*scale)+'px' }} key={index} >
                <div style={ { ...O,...L,paddingLeft:'5px',borderRight:index === renderList.length-1 ? '1px solid #000' : '0 none'  } } >
                    <span style={ { textAlign:'left',color:'#000',flex:2 } }  >序号</span>
                    <span style={ { textAlign:'left',color:'#000',flex:4 } }  >服务内容</span>
                    <span style={ { textAlign:'left',color:'#000',flex:4 } }  >实收(元)</span>
                </div>
                {
                    tureItem.map((it,i)=>{
                        idx++
                        return <ul  key={i}  style={ { minHeight:(98*scale)+'px', marginBottom:0,paddingBottom:(1*scale)+'px' ,paddingTop:(1*scale)+'px',...O,paddingLeft:'5px',borderRight:index === renderList.length-1 || it.isNull ? '1px solid #000' : '0 none'  } }  >
                           <li style={ { flex:2 ,...L} } >{ it.isNull || idx }</li>
                           <li style={ { flex:4 ,...L,position:'relative'} } > { it.isGive && <span style={{ position:'absolute',left:-(120*scale)+'px' }} >【送】</span> }  { it.isNull || it.maintainProject.length < 24/col ? it.maintainProject : it.maintainProject.slice(0,24/col)+'...'    }</li>
                           { it.isNull || <li style={ { flex:4 ,...L} }>{  it.actuallyPaid} ({it.price}*{it.count || it.num }) </li> }
                        </ul>
                    })
                }
             </div>
            })
          }
       </div>

}
const getTableProListType=(type,scale,data,project,O,L,B)=>{
    if(data.product.length + data.project.length + (data.give || [] ).length > 12 && type !==2 && type !==3){
        return getTableMoreProListType(type,scale,data,O,L,B)
    }
    return ( <div style={ { fontSize:(32*scale)+'px'} } >
                    <div style={ { ...O,...L,paddingLeft:'5px' } } >
                    {
                        project.map((item,i )=>{
                            return <span key={ i }  style={ { flex:item.flex,textAlign:'left',color:'#000' } } >{ item.name }</span>
                        })
                    }
                    </div>
    {
    //   data.project.map((item,i)=>{
    //       return ( <ul  style={ { marginBottom:0,paddingBottom:(1*scale)+'px' ,paddingTop:(1*scale)+'px',...O,paddingLeft:'5px' } } >
    //                   <li style={ { flex:1 ,...L} } >{i+1}</li>
    //                   {/* <li style={ { flex:1 ,...L} } >{ item.code }</li> */}
    //                   <li style={ { flex:2 ,...L} } >{ item.maintainProject.length > 24 ? item.maintainProject.slice(0,24)+'...' : item.maintainProject   }</li>
    //                   <li style={ { flex:1 ,...L} } >{ item.construct }</li>
    //                   {  B ?  <li style={ { flex:1 ,...L} } >{ item.salePerson }</li> : null    }
    //                   <li style={ { flex:1 ,...L} } >{ item.price }</li>
    //                   <li style={ { flex:1,...L} } >{ item.count }</li>
    //                   <li style={ { flex:1 ,...L} } >{ item.discount }</li>
    //                   <li style={ { flex:1 ,...L} } >{ item.cardDeduction }</li>
    //                   <li style={ { flex:1,...L} } >{ item.actuallyPaid }</li>
    //                   <li style={ { flex:1,...L} } >{ item.cardRemain }</li>
    //               </ul> )
    //   })
    }
                {/* <div style={ { ...O,...L } } >
                {
                    product.map((item,i )=>{
                        return <span key={ i }  style={ { flex:item.flex,textAlign:'left',color:'#000',paddingLeft:'5px' } } >{ item.otherName ||item.name }</span>
                    })
                }
                </div> */}
    {
     [...data.project,...data.product,...(data.give || [] ).map(item=>{
         return {
             ...item,
             maintainProject:item.name,
             construct:'',
             salePerson:'',
             discount:'',
             cardDeduction:'',
             actuallyPaid:'0.00',
             cardRemain:'',
             isGive:true,
             count:item.num,
         }
     })].map((item,i)=>{
          return ( <ul  key={i}  style={ { marginBottom:0,paddingBottom:(1*scale)+'px' ,paddingTop:(1*scale)+'px',...O,paddingLeft:'5px' } } >
                      <li style={ { flex:1 ,...L} } >{i+1}</li>
                      {/* <li style={ { flex:1 ,...L} } >{ item.code }</li> */}
                      <li style={ { flex:2 ,...L,position:'relative'} } >{ item.isGive && <span style={{ position:'absolute',left:-(120*scale)+'px' }} >【赠送】</span> }{ item.maintainProject.length > 12 ? item.maintainProject: item.maintainProject  }</li>
                      <li style={ { flex:1 ,...L} } >{ item.construct }</li>
                      {  B ?  <li style={ { flex:1 ,...L} } >{ item.salePerson }</li> : null    }
                      <li style={ { flex:1 ,...L} } >{ item.price }</li>
                      <li style={ { flex:1 ,...L} } >{ item.count }</li>
                      {/* <li style={ { flex:1 ,...L} } >{ item.unit }</li> */}
                      <li style={ { flex:1 ,...L} } >{ item.discount }</li>
                      <li style={ { flex:1 ,...L} } >{ item.cardDeduction }</li>
                      <li style={ { flex:1,...L} } >{ item.actuallyPaid }</li>
                      <li style={ { flex:1,...L} } >{ item.cardRemain }</li>
                  </ul> )
      })
    }
    { data.product.length + data.project.length + (data.give || [] ).length  !==0   || <p style={{ ...O,...L ,marginBottom:0,textAlign:'center',display:'block'  }} >暂无数据</p>  }
    { type===1|| type===3 || <div>
    {/* <div style={ { ...O , ...L } } >
      {
          attrachProject.map((item,i )=>{
              return <span key={ i }  style={ { flex:item.flex,textAlign:'left',color:'#000',paddingLeft:'5px' } } >{ item.name }</span>
          })
      }
    </div> */}
    {/* {
       data.attrachProject.map((item,i)=>{
        //   let name = item.construct.map(item=>{
        //        return item.staff_name+'.'
        //   }).join('')
           return ( <ul key={i}  style={ { marginBottom:0,paddingBottom:(1*scale)+'px' ,paddingTop:(1*scale)+'px',...O,paddingLeft:'5px' } } >
                       <li style={{ flex:attrachProject[0].flex ,...L }} >{i+1}</li>
                       <li style={{ flex:attrachProject[1].flex ,...L }} >{item.attrachPay}</li>
                       <li style={{ flex:attrachProject[2].flex ,...L }} >{Item.construct}</li>
                       <li style={{ flex:attrachProject[3].flex ,...L }} >{item.count}</li>
                       <li style={{ flex:attrachProject[4].flex ,...L }} >{item.price}</li>
                       <li style={{ flex:attrachProject[5].flex ,...L }} >{item.discount}</li>
                       <li style={{ flex:attrachProject[6].flex ,...L }} >{item.money}</li>
                   </ul> )
       })
    }
    { data.attrachProject.length!==0 || <p style={{ ...O,...L,marginBottom:0,textAlign:'center',display:'block'  }} >暂无数据</p>  } */}
    </div>  }
  </div>)
}
//创建表格列表结构
const getTableProList=(type,scale,data)=>{
    const O = {  borderLeft:'1px solid #000',borderRight:'1px solid #000',borderBottom:'1px solid #000' ,display:'flex' }
    const L = {  fontSize:(32*scale)+'px',padding: '14px 0',listStyle:'none',color:'#000' }
    if( type===0 || type===1 ){
        return  getTableProListType(type,scale,data,project,O,L,false,product)
    }
   if( type===2 || type===3 ){
        return  getTableProListType(type,scale,data,otherProject,O,L,true,otherProduct)
   }
}
//创建门店设置结构
const getTableProSetting=( type,scale,data,B,D)=>{
    console.log(type,scale,data)
    const V = { display:'inline-block',width:'30%' }
    return (<div style={{  ...B , position:'relative' }} >
                <p style={ D } ><span style={ V } >开户行：{ data.depositBank }</span> <span style={ V } >服务热线 { data.hotline } </span> <span style={ V }  style={{ width:'37%', height:'80%' , position:'absolute' }} > 门店备注 ：{ data.remark } </span> </p>
                <p style={ D } ><span style={ V} >银行卡号：{ data.bankCard }</span> <span style={ V } >道路救援： { data.SOShotline }</span> </p>
                <p style={ D } > <span style={ V } > 税号：{ data.dutyParagraph } </span> <span style={ V } > 地址：{ data.address } </span>  </p>
            </div>)
}
//创建表格底部结构
const getTableFooter=(scale)=>{
    const S ={ borderBottom:'1px solid #000', display:'inline-block',width:(425*scale)+'px',height:(120*scale)+'px',marginRight:(60*scale)+'px'  }
   return <div style={ { fontSize:(42*scale)+'px' ,height:(182*scale)+'px',lineHeight:(182*scale)+'px',color:'#000' } } >
              服务顾问：<span style={ S }  ></span> 收银员 ：<span  style={ S } ></span> 客户签字 ： <span  style={ S } ></span>
          </div>
}
//创建表格结算结构
const getTableComputerPrice=(type,scale,data,B,D)=>{
    const T ={ marginRight:(108*scale)+'px',fontWeight:'bold' }
    switch(type){
        case 0 :
        console.log(data.payType)
         return ( <div style={ { ...B,position:'relative' } } >
                   <p style={ D } > 项目费 ：<span style={ T } > { data.projectPrice } </span> 产品费 ：<span style={ T } > { data.partsPrice } </span> 附加费 ：<span style={ T } > { data.attrachPrice } </span> 优惠金额 ： <span style={ T } >{ data.preferentialPrice }</span> </p>
                   <p style={ { ...D,width:'70%' } } > 支付方式: { data.payType.length===0|| <span>{data.payType.map((item,i)=><span key={i} >{item.name}{ item.paymentType*1!==2 && item.value }{ item.rest ?  `(余额:${item.rest})`  :null }  { data.payType.length -1 === i ? '' : '/'  }  </span>)}</span> }  </p>
                   <div style={ { position:'absolute',top:0,right:0,marginRight:(38*scale)+'px'  } } >
                       <p style={ D } >实收金额 ：<span style={ { fontWeight:'bold',fontSize:(40*scale)+'px' } } > { data.amountReceived } </span>  </p>
                       <p style={ D } >大写 ： { data.upperPrice  }</p>
                   </div>
                 </div> )
        case 1 :
         return (<div style={ {  ...B,position:'relative' } } >
                   <p style={ D } > 项目费 ：<span style={ T } > { data.projectPrice } </span> 产品费 ：<span style={ T } > { data.partsPrice } </span> 优惠金额 ： <span style={ T } >{ data.preferentialPrice }</span> </p>
                   <p style={ { ...D,width:'70%' } } > 支付方式: { data.payType.length===0|| <span>{data.payType.map((item,i)=><span key={i} >{item.name}{  item.paymentType*1!==2 && item.value } { item.rest ?  `(余额:${item.rest})`  :null }  { data.payType.length -1 === i ? '' : '/'  }</span>)}</span> }  </p>
                   <div style={ { position:'absolute',top:0,right:0,marginRight:(38*scale)+'px'  } } >
                       <p style={ D } >实收金额 ：<span style={ { fontWeight:'bold',fontSize:(40*scale)+'px' } } > { data.amountReceived } </span>  </p>
                       <p style={ D } >大写 ： { data.upperPrice  }</p>
                   </div>
                 </div>)
        case 2 :
         return (<div style={ {  ...B,position:'relative' } } >
                    <p style={ D } > 项目费 ：<span style={ T } > { data.projectPrice } </span>  产品费：<span style={ T } > { data.partsPrice }</span> 附加费 ：<span style={ T } > { data.attrachPrice } </span> </p>
                    {/* <p style={ D } > 支付方式 :{ data.payType.options.length===0||(data.payType.options.length === 1 ? data.payType.options[0].name :'混合支付' ) }  { data.payType.options.length===0|| data.payType.options.length===1  ||   <span>({data.payType.options.map((item,i)=><span key={i} >{item.name}:{item.value};</span>)})</span>  }  </p> */}
                    <p style={ { ...D,width:'70%',height:'40px' } }></p>
                    <div style={ { position:'absolute',top:0,right:0,marginRight:(38*scale)+'px'  } } >
                        <p style={ D } >实收金额 ：<span style={ { fontWeight:'bold',fontSize:(40*scale)+'px' } } > { data.totalPrice } </span>  </p>
                        <p style={ D } >大写 ： { data.upperPrice  }</p>
                    </div>
                 </div>)
        case 3 :
        return  (<div style={ {  ...B,position:'relative' } } >
                    <p style={ D } > 项目费 ：<span style={ T } > { data.projectPrice } </span>  产品费：<span style={ T } > { data.partsPrice }</span>  </p>
                    {/* <p style={ D } > 支付方式 :{ data.payType.options.length===0||(data.payType.options.length === 1 ? data.payType.options[0].name :'混合支付' ) }  { data.payType.options.length===0|| data.payType.options.length===1  || <span>({data.payType.options.map((item,i)=><span key={i} >{item.name}:{item.value};</span>)})</span>  } </p> */}
                    <p style={ { ...D,width:'70%',height:'40px' } }></p>
                    <div style={ { position:'absolute',top:0,right:0,marginRight:(38*scale)+'px'  } } >
                        <p style={ D } >实收金额 ：<span style={ { fontWeight:'bold',fontSize:(40*scale)+'px' } } > { data.totalPrice } </span>  </p>
                        <p style={ D } >大写 ： { data.upperPrice  }</p>
                    </div>
                </div>)
        default:
        return
    }
}
const  P = React.memo( ({ scale , type , data ,reload })=>{
  console.log('渲染次数')
  setTimeout(()=>{
      window.print()
      if(reload){
        window.location.reload()
      }
  },1000)
  const B = { borderLeft:'1px solid #000',borderRight:'1px solid #000',borderBottom:'1px solid #000' }
  const D = { marginBottom:0 ,paddingLeft:(20*scale)+'px',paddingBottom:(20*scale)+'px' ,paddingTop:(20*scale)+'px', lineHeight:(40*scale)+'px',color:'#000',fontSize:(32*scale)+'px' }
  return <div   style={{marginLeft:'5%', marginTop: '8%'}} >
            <div style={{ paddingTop:(1*scale)+'px',width:(2150*scale)+'px' }} >
                <h1 style={ { fontWeight:'bold', textAlign:'center', marginBottom:(20*scale)+'px',height:(60*scale)+'px',fontSize:(58*scale)+'px',lineHeight:(58*scale)+'px',color:'#000' } } >{ data.storeName }(结算单)</h1>
                  { getTableTitle(type,scale,data)  }
                <table style={{ borderCollapse:'collapse',width:'100%' }} >
                  { getTableheader(type,scale,data ) }
                </table>
                <div style={ { ...B  } } >
                       <p style={ { ...D }  } >描述：{ data.describe  }</p>
                </div>
                  { getTableProList(type,scale,data)  }
                  { getTableComputerPrice(type,scale,data.computerPrice || data.setComputerPrice ,B,D) }
                <div style={{ ...B }} >
                       <p style={ { ...D }  } > 单据备注： { data.billingRemark  }</p>
                </div>
                  { getTableProSetting( type,scale,data.storeSetting,B,D ) }
                  { getTableFooter(scale) }
            </div>
         </div>
},(pre,next)=> pre.type === next.type )
export default P
