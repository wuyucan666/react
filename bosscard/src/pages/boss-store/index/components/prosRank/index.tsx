import React , { memo }  from 'react'


const style = require( './style.less')

interface typeProps {
    type : number, // 0 卡  1 项目 2 产品
    data :any,
    callBack:Function
}
const handerName=(type:number,kind:number)=>{
    switch(type){
        case 0:
            if(!kind)  return '卡名称'
            return '会员卡排名'
        case 1:
            if(!kind)  return '项目名称'
            return '项目排名'
        case 2:
          if(!kind)  return '产品名称'
            return '产品排名'
    }
}
export default memo(({  type , data , callBack } : typeProps )=>{
    return <div className={ style.zl_table_box }  >
      <p style={{height: 25, lineHeight: '25px'}}><span>{handerName(type,1)}</span><span onClick={()=>{ callBack(type,'routeGo') }}  >详细 <i className='iconfont icon-quchakan' style={{marginLeft: 5}}/>  </span></p>
      <div className={style.zl_tableHead} >
          <div>排名</div>
          <div>{ handerName(type,0) }</div>
          <div>订单数</div>
      </div>
      <div className={style.zl_tableContent} >
         {
           data.map((item:any,index:number)=>
           <div key={index} className={style.zl_item}  >
             <div>{index+1}</div>
             <div>{ type === 0 ? <p style={{padding:'0'}}  ><span style={{ color:'#4AACF7' }} >{item.type === 1 ? '充值卡-':'计次卡-' }</span>{item.cardName}</p> : item.name  }</div>
             <div style={{ paddingLeft : type ===0 ? '10px' : '5px' }} >{ type === 0 ? item.quantity : item.orderCount  }</div>
           </div>)
         }
      </div>
    </div>
},(pre,next)=> JSON.stringify(pre.data) === JSON.stringify(next.data) )
