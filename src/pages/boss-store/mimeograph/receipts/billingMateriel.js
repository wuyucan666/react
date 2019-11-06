import React from 'react'
import moment from "moment"
import { materiel } from '../data'
// const data={
//     created:11213122,//打印日期
//     orderId:323423,
//     carNum:12133,
//     product:[{
//         serialNumber:1232321412, //编码
//         productName:'补胎', //维修配件
//         price:500, //单价
//         number:13,//数量
//         unit:'个',//单位
//         discount:10,//折扣
//         remark:'备注',//备注
//         warehouseName:'这是一个仓库',//仓库
//     },
// ],
// }
//配置领料退料单
//scale 配置缩放比
//type 类型 0 领料 1 退料
//data 数据
const getTotalCount=(data)=>{
   let num=0
   data.product.forEach(item=>{
       num+=item.number
   })
   return num
}
const getTotalPrice=(data)=>{
    let price=0
    data.product.forEach(item=>{
        price+=(item.price)*(item.number).toFixed(2)
    })
    return price
}
const M =function(props ){
   const {  type , scale ,data  } = props
   setTimeout(()=>{
    window.print()
    },1000)
   const O = {  borderLeft:'1px solid #000',borderRight:'1px solid #000',borderBottom:'1px solid #000' ,display:'flex' }
   const L = {  fontSize:(32*scale)+'px',lineHeight:(95*scale)+'px',listStyle:'none',color:'#000' }
   const S ={ borderBottom:'1px solid #000', display:'inline-block',width:(900*scale)+'px',height:(120*scale)+'px',marginRight:(15*scale)+'px'  }
    return  <div style={{marginLeft:'5%'}}>
              <div style={{ paddingTop:(236*scale)+'px',width:(2150*scale)+'px'}} >
                          <h1 style={ { fontWeight:'bold', textAlign:'center', marginBottom:(20*scale)+'px',height:(60*scale)+'px',fontSize:(58*scale)+'px',lineHeight:(58*scale)+'px',color:'#000' } } >{ type === 0 ? '领料单' : '退料单'  }</h1>
                          <p style={{ height:(178*scale)+'px',fontSize:(42*scale)+'px',lineHeight:(178*scale)+'px',color:'#000',position:'relative',marginBottom:0 } } >
                                  <span style={ { float:'left' } } >车牌号：{ data.carNum }</span>
                                  <span style={ { position:'absolute',left:'50%',transform:'translate(-50%,0)' } } >单号：{ data.orderId }</span>
                                  <span style={{ float:'right' }} >打印日期：{ moment(Date.parse(new Date())).format("YYYY-MM-DD") }</span>
                          </p>
                          <div style={ { ...O,...L ,borderTop:'1px solid #000'} } >
                              {
                                  materiel.map((item,i )=>{
                                      return <span key={ i }  style={ { flex:item.flex,textAlign:'left',color:'#000',paddingLeft:'5px' } } >{ item.name }</span>
                                  })
                              }

                          </div>
                          {
                              data.product.map((item,i)=>{
                                  return ( <ul  key={i}  style={ { marginBottom:0,paddingBottom:(38*scale)+'px' ,paddingTop:(38*scale)+'px',...O,paddingLeft:'5px' } } >
                                              <li style={ { flex: 1,...L} } >{i+1}</li>
                                              <li style={ { flex: 1,...L} } >{ item.serialNumber }</li>
                                              <li style={ { flex: 2,...L} } >{ item.productName }</li>
                                              <li style={ { flex: 1,...L} } >{ item.warehouseName }</li>
                                              <li style={ { flex: 1,...L} } >{ item.price }</li>
                                              <li style={ { flex: 1,...L} } >{ item.number }</li>
                                              <li style={ { flex: 1,...L} } >{ item.unit }</li>
                                              <li style={ { flex: 1,...L} } >{ item.discount }</li>
                                              <li style={ { flex: 1,...L} } >{ item.amount }</li>
                                              <li style={ { flex: 1,...L} } >{ item.remark }</li>
                                          </ul> )
                              })
                          }
                          <ul style={ { marginBottom:0,paddingBottom:(38*scale)+'px' ,paddingTop:(38*scale)+'px',...O,paddingLeft:'5px' } } >
                                  <li style={ { flex: 6,...L} } >小计：</li>
                                  <li style={ { flex: 3,...L,fontWeight:'bold'} } >{ getTotalCount(data) }</li>
                                  <li style={ { flex: 2,...L,fontWeight:'bold' } } >{ getTotalPrice(data) }</li>
                          </ul>
                          <div style={ { fontSize:(42*scale)+'px' ,height:(182*scale)+'px',lineHeight:(182*scale)+'px',color:'#000' } } >
                              { type===0 ? <span>领用人</span> : <span>退料人</span> }：<span style={ S }  ></span> 仓管 ：<span  style={ S } ></span>
                          </div>
                    </div>
            </div>
}

export default M
