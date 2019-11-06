import React from 'react'
import moment from "moment"
import { construction  } from '../data'
// const  data={
//     created:1212123312,
//     storeName:'林哥的店',
//     orderId:123213111,
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
//     expectDone:12312311132,//预计完工时间
//     describe:'年少的那我i大苏打哇大王的哇唔哇i撒到我吊袜带2我弟娃儿额哇',//描述
//     maintainSuggest:'尽快拥有车，请马上要用车',
//     projectRemark:'尽快修车，客户马上要用车',
//     project:[
//        {
//            maintainProject:'补胎',//维修项目
//            construction:'小白白',//施工
//            price:250,//单价
//            workTime:20,//工时
//            unit:'个',
//            remark:'哈哈这个不哦',
//        },
//        {
//         maintainProject:'补胎',//维修项目
//         construction:'小白白',//施工
//         price:250,//单价
//         workTime:20,//工时
//         unit:'个',
//         remark:'哈哈这个不哦',
//         },
//     ],
//     address:'广州市白云区五号停机场',
//     telPhone:'020-48998555',
// }
const OliType=['','空','小于1/4','1/4','1/2','3/4','满']
  //判断油表类型
const  handerOilType=(Type)=>{
    return OliType[Type]
 }
const C=function(props){
  const { scale,data } = props
  setTimeout(()=>{
    window.print()
},1000)
  const D={ width:(198.48*scale)+'px',boxSizing:'border-box',border:'1px solid #000' ,paddingLeft:(20*scale)+'px' ,color:'#000' }
  const S={ width:(421.77*scale)+'px',boxSizing:'border-box' ,border:'1px solid #000',paddingLeft:(20*scale)+'px' ,color:'#000' }
  const T={ height:(63*scale)+'px',width:(2481*scale)+'px',fontSize:(32*scale)+'px',lineHeight:(63*scale)+'px'  ,color:'#000' }
  const O={ borderBottom:'1px solid #000', display:'inline-block',width:(318*scale)+'px',height:(120*scale)+'px',marginRight:(34*scale)+'px'  }
  const M = { marginBottom:0 ,paddingLeft:(20*scale)+'px',paddingBottom:(20*scale)+'px' ,paddingTop:(20*scale)+'px', lineHeight:(40*scale)+'px',color:'#000',fontSize:(32*scale)+'px' }
  const B = {  borderLeft:'1px solid #000',borderRight:'1px solid #000',borderBottom:'1px solid #000' ,display:'flex' }
  const L = {  fontSize:(32*scale)+'px',lineHeight:(95*scale)+'px',listStyle:'none',color:'#000' }
//   const S ={ borderBottom:'1px solid #000', display:'inline-block',width:(900*scale)+'px',height:(120*scale)+'px',marginRight:(60*scale)+'px'  }
  return  <div style={{marginLeft:'5%', marginTop: '8%'}}>
            <div style={{ paddingTop:(1*scale)+'px',width:(2150*scale)+'px' }} >
                            <h1 style={ { fontWeight:'bold', textAlign:'center', marginBottom:(20*scale)+'px',height:(60*scale)+'px',fontSize:(58*scale)+'px',lineHeight:(58*scale)+'px',color:'#000' } } >{data.storeName}（施工单）</h1>
                            <p style={{ height:(178*scale)+'px',fontSize:(42*scale)+'px',lineHeight:(178*scale)+'px',color:'#000',position:'relative',marginBottom:0 } } >
                                  <span style={ { float:'left' } } >单号：{ data.orderId }</span>
                                  <span style={{ float:'right' }} >打印日期：{ moment(data.created * 1000).format("YYYY-MM-DD") }</span>
                            </p>
                            <table style={{ borderCollapse:'collapse',width:'100%' }} >
                                  <tbody>
                                      <tr style={ T } >
                                          <td style={ D } >姓名：</td>
                                          <td style={ S } >{ data.clientName } </td>
                                          <td style={ D } >电话：</td>
                                          <td style={ S } >{ data.phone }</td>
                                          <td style={ D } >油表：</td>
                                          <td style={ S } >{ handerOilType(data.oilMeter) }</td>
                                          <td style={ D } >备注：</td>
                                          <td style={ S } >{ data.remark }</td>
                                      </tr>
                                      <tr style={ T } >
                                          <td style={ D } >车牌：</td>
                                          <td style={ S } >{ data.carNum }</td>
                                          <td style={ D } >车架号：</td>
                                          <td style={ S } >{  data.carCarriage }</td>
                                          <td style={ D } >进店里程：</td>
                                          <td style={ S } >{ data.storeMileage }公里</td>
                                          <td style={ D } >进厂时间：</td>
                                          <td style={ S } >{ data.inFactoryTime===0?'':moment(data.inFactoryTime * 1000).format("YYYY-MM-DD") }</td>
                                      </tr>
                                      <tr style={ T } >
                                          <td style={ D } >车型：</td>
                                          <td style={ S } >{ data.carType }</td>
                                          <td style={ D } >发动机号：</td>
                                          <td style={ S } >{ data.motorNum }</td>
                                          <td style={ D } >服务顾问：</td>
                                          <td style={ S } >{  data.serviceAdvisor  }</td>
                                          <td style={ D } >预计完工：</td>
                                          <td style={ S } >{ data.outFactoryTime===0?'':moment(data.outFactoryTime * 1000).format("YYYY-MM-DD")   }</td>
                                      </tr>
                                  </tbody>
                            </table>
                            <div style={ B } >
                                  <p style={ M  } >故障描述：{ data.describe  }</p>
                            </div>
                            <div style={ B } >
                                  <p style={ M  } >维修建议：{ data.advice  }</p>
                            </div>
                            <div style={ { ...B,...L } } >
                              {
                                  construction.map((item,i )=>{
                                      return <span key={ i }  style={ { flex:item.flex,textAlign:'left',color:'#000',paddingLeft:'5px' } } >{ item.name }</span>
                                  })
                              }
                              </div>
                              {
                              data.project.map((item,i)=>{
                                  return ( <ul  key={i}  style={ { marginBottom:0,paddingBottom:(1*scale)+'px' ,paddingTop:(1*scale)+'px',...B,paddingLeft:'5px' ,borderBottom:'0 none'} } >
                                              <li style={ { flex: 1,...L} } >{i+1}</li>
                                              <li style={ { flex: 2,...L} } >{ item.maintainProject }</li>
                                              <li style={ { flex: 2,...L} } >{ item.construct }</li>
                                              <li style={ { flex: 2,...L} } >{ item.price }</li>
                                              <li style={ { flex: 2,...L} } >{ item.count }</li>
                                              <li style={ { flex: 2,...L} } >{ item.remark }</li>
                                          </ul> )
                              })
                              }
                              <div style={ B } >
                                  <p style={ M  } >备注：{ data.billingRemark  }</p>
                              </div>
                              <ul style={ { marginBottom:0,paddingBottom:(1*scale)+'px' ,paddingTop:(1*scale)+'px',...B,paddingLeft:'5px' } } >
                                  <li style={ { flex: 1,...L} } >地址：{ data.storeSetting.address }</li>
                                  <li style={ { flex: 1,...L} } >电话：{ data.storeSetting.hotline  }</li>
                              </ul>
                              <div style={ { fontSize:(42*scale)+'px' ,height:(182*scale)+'px',lineHeight:(182*scale)+'px',color:'#000' } } >
                              服务顾问：<span style={ O }  ></span> 质检员 ：<span  style={ O } ></span>制单：<span  style={ O } ></span>客户签字：<span  style={ O } ></span>
                              </div>
                  </div>
            </div>

}
export default C
