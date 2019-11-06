import React, { Component } from 'react'
import moment from "moment"
import { Modal } from 'antd'
import { getLodop } from '../../../../utils/LodopFuncs'
import service from 'services'
const confirm = Modal.confirm
//----------------------by赵林
  //小票打印 billingReceipt组件
        //通过计算缩放比来控制打印单/小票的大小
        // scale 配置缩放比 默认是0.25
        // type  配置小票/打印单类型 1开单办卡小票 0 是充值小票
        // data  小票/打印单数据源
  //----------------------------------------
class R  extends Component{
   constructor(props){
      super(props)
      this.state={

      }
      this.r=null
   }
   static defaultProps = {
      scale:0.25,
   }

   async componentDidMount(){
       const { print } = this.props
       if(print){
           console.log(window.localStorage.getItem('isLoad'),'ooooooooooooooooo')
        if (window.localStorage.getItem('isLoad') && !JSON.parse(window.localStorage.getItem('isLoad'))) {
            console.log(5555)
            confirm({
                title: '温馨提示',
                content: '云打印插件加载失败，确保已经下载',
                // cancelText:'不需要下载',
                okText:'下载',
                onCancel(){
                   setTimeout(()=>window.print(),500)
                },
                onOk(){
                    setTimeout(() => {
                        window.open('http://www.lodop.net/download.html')
                    }, 500)  
                    return false
                },
                zIndex:20001,
            })    
        }
        else {
             // 获取设置好的打印份数
             let num 
            await  service.printingReceipt({ keys: {name: 'printing/setting/ticket'} }).then(res=>{
                if(res.code==='0'){
                   num=res.data.printPiece*1
                }
                else{
                    num=1
                }
            })
            setTimeout(() => {
                
                let LODOP = getLodop(null,null,true)// 调用getLodop获取LODOP对象
                   console.log(LODOP)
                // console.log(1111, this.$refs['lodop'].offsetHeight, this.$refs['lodop'].offsetWidth)
                LODOP.PRINT_INIT('lodop打印订单...')
                LODOP.SET_PRINT_PAGESIZE(3, '55mm', `0mm`, '')
                LODOP.ADD_PRINT_HTM(30, 0, '100%', this.r.offsetHeight, `${this.r.innerHTML}`)
                LODOP.SET_PRINT_COPIES(num) // 打印份数
                // LODOP.PRINT()
                LODOP.PREVIEW()
            }, 500)
        }
      }
   }
   render(){
    const { scale,type ,data  } = this.props 
     console.log(data)
    return <div ref={(r)=>this.r=r} >
        {
            <div style={ { width:(673*scale)+'px',paddingLeft:(35*scale)+'px' ,paddingRight:(35*scale)+'px',paddingBottom:(46*scale)+'px'  } }  >
                 <h1 style={{ marginTop:(76*scale)+'px',fontSize:(66*scale)+'px',lineHeight:(58*scale)+'px',height:(58*scale)+'px',textAlign:'center' }} >欢迎光临</h1>
                 <h2 style={{ marginTop:(35*scale)+'px' , fontSize:(42*scale)+'px',textAlign:'center' }} >【{ data.storeName  }】</h2>
                 <p  style={{ marginBottom:0,color:'#000', height:(63*scale)+'px',fontSize:(40*scale)+'px',lineHeight:(63*scale)+'px',marginTop:(35*scale)+'px' }  } >单号：{ data.orderId }</p>
                 <p  style={{ marginBottom:0,color:'#000', height:(63*scale)+'px',fontSize:(40*scale)+'px',lineHeight:(63*scale)+'px' }  } >日期：{ moment(data.created * 1000).format("YYYY-MM-DD") }</p>
                 <p  style={{ marginBottom:0,color:'#000', height:(63*scale)+'px',fontSize:(40*scale)+'px',lineHeight:(63*scale)+'px' }  } >姓名：{ data.clientName }</p>
                 <p  style={{ color:'#000', height:(63*scale)+'px',fontSize:(40*scale)+'px',lineHeight:(50*scale)+'px' }  } >余额：{ data.balance }</p>
                 <p  style={{ marginBottom:(-6*scale)+'px',color:'#000',fontSize:(66*scale)+'px' }} >* * * * * * * * * * * * *</p>
                { type===1 ? <div>
                    <div style={{ marginBottom:(15*scale)+'px', lineHeight:(63*scale)+'px',fontSize:(40*scale)+'px',height:(63*scale)+'px',borderBottom:(3*scale)+'px dashed #000 ',position:'relative' }}  >
                   <span style={{ color:'#000',position:'absolute',left:0,display:'block', lineHeight:(63*scale)+'px'}} >服务</span>
                   <span style={{ color:'#000',position:'absolute',left:'30%',transform:'translate(-50%,0)',display:'block', lineHeight:(63*scale)+'px'}} ></span>
                   <span style={{ color:'#000',position:'absolute',left:'45%',display:'block', lineHeight:(63*scale)+'px'}} >原价</span>
                   <span style={{ color:'#000',position:'absolute',right:0,display:'block', lineHeight:(63*scale)+'px'}} >实收</span>
                 </div>
{ [...data.project,...data.give.map(item=>{ return { ...item , isGive:true } })].map((item,i)=>{
          return <div key={i} >
                    <p style={{ color:'#000', marginBottom:0,fontSize:(40*scale)+'px',height:(50*scale)+'px',lineHeight:(50*scale)+'px' }}  > { item.isGive && `【送】`   }{ item.name } </p>
                        <div style={{ position:'relative',fontSize:(40*scale)+'px',height:(50*scale)+'px' }}  >                  
                            <span style={{ color:'#000',position:'absolute',left:'30%',transform:'translate(-50%,0)',display:'block', lineHeight:(50*scale)+'px'}} ></span>
                            <span style={{ color:'#000',position:'absolute',left:'45%',display:'block', lineHeight:(50*scale)+'px'}} >{ item.amount }</span>
                            <span style={{ color:'#000',position:'absolute',right:0,display:'block', lineHeight:(50*scale)+'px'}} >{ item.cash }</span>
                        </div>
                 </div>
                
}) }
                <p style={{color:'#000', marginBottom:(5*scale)+'px',height:(60*scale)+'px',borderBottom:(3*scale)+'px dashed #000 ',fontSize:(40*scale)+'px', textAlign:'right',lineHeight:(63*scale)+'px' }} >
                  实收：<span style={{ fontWeight:'bold' }} >{ data.totalPrice }</span>
                 </p>  
                </div> : null }
                { type===0 ? <div>
                    <p  style={{ marginBottom:0,color:'#000', height:(63*scale)+'px',fontSize:(40*scale)+'px',lineHeight:(63*scale)+'px' }  } >充值金额：{ data.rechargeMoney }</p>
                    <p  style={{ marginBottom:0,color:'#000', height:(63*scale)+'px',fontSize:(40*scale)+'px',lineHeight:(63*scale)+'px',borderBottom:(3*scale)+'px dashed #000 ' }  } >赠送金额：{ data.giveMoney }</p>
                </div> : null }
                
{ data.payType.map((item,i)=>{
         return  <p key={i}   style={{color:'#000', marginBottom:(5*scale)+'px',height:(60*scale)+'px',fontSize:(40*scale)+'px', textAlign:'right' ,lineHeight:(60*scale)+'px'}} >
                         <span>{ item.name }</span>：<span style={{ fontWeight:'bold' }} >{ item.money }</span>
                 </p>  
  }) }            
                 <p  style={{ marginBottom:(-6*scale)+'px',color:'#000',fontSize:(66*scale)+'px' }} >* * * * * * * * * * * * *</p>  
                 <p  style={{ marginBottom:0,color:'#000',fontSize:(40*scale)+'px',lineHeight:(63*scale)+'px' }  } >备注： {data.remark}</p> 
                 <p  style={{ marginBottom:0,color:'#000', height:(63*scale)+'px',fontSize:(40*scale)+'px',lineHeight:(63*scale)+'px' }  } >电话：{ data.phone }</p>
                 <p  style={{ marginBottom:0,color:'#000',fontSize:(40*scale)+'px',lineHeight:(63*scale)+'px' }  } >地址：{ data.address }</p>
                 <p  style={{ marginBottom:(30*scale)+'px',color:'#000',height:(115*scale)+'px',fontWeight:'bold',lineHeight:(115*scale)+'px',borderTop:(3*scale)+'px dashed #000' ,borderBottom:(3*scale)+'px dashed #000' }}>签字 ：</p>
                 <p  style={{marginBottom:0, color:'#000',textAlign:'center',fontSize:(40*scale)+'px',lineHeight:(43*scale)+'px' }} >请妥善保管消费小票</p>
                 <p  style={{marginBottom:0, color:'#000',textAlign:'center',fontSize:(40*scale)+'px',lineHeight:(43*scale)+'px' }} >多谢惠顾！</p>
                 
            </div>
        }
           </div>
   } 
}
export default R