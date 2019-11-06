import React , { useState  }   from 'react'
import { Icon , Tooltip  } from 'antd'
import moment from 'moment'
import style from './style.less'
import D from './detail'
import Wfeedback from './feedback'

export default  React.memo(({ list , handerShow })=> {
  const [ visible , modelShow ] = useState(false)
  const [ feedbackvisible, modelfeedback ] = useState(false)
  const [ activeId , setActiveID ] = useState(null)
  const [ itemRemark , setItemRemark ] = useState(null)
  const IconColor=(messageNotifyTypeId)=>{
    switch(messageNotifyTypeId * 1) {
      case 1:
        return {color:'#FEC78C',icon:'icon-xitong'}
      case 2:
        return {color:'#7EE8A9' , icon:'icon-fuwuqi'}  
      case 3:
        return {color:'#F46C6C' , icon:'icon-yichang'}
      case 4:
        return {color:'#4AACF7' ,icon:'icon-banben'}
      case 5:
        return {color:'#EF76F7', icon:'icon-tongzhi1'}
      case 6:
        return {color:'#4AACF7' , icon:'icon-fankui'}
      default:
        return {color:'#ccc' , icon:'icon-xitong'}
    }
  }
  const  handerSelectItem = (item) =>{
    setActiveID(item.id)
    setItemRemark(item.remark)
    if(item.messageNotifyTypeId === 6) {
      modelfeedback(!feedbackvisible)
    } else {
      modelShow(!visible)
    }
  }
  return <div  className={style.zl_messageBox} >
    <div className={style.zl_M_head} >消息中心<span onClick={()=>{ handerShow() }} ><Icon type="close" /></span></div>
    <div className={style.zl_M_Content}>
      {
        list.map(item => (
          <div className={style.zl_item_box} ><div key={item.id}  className={style.zl_M_Item} onClick={ handerSelectItem.bind(this,item) }>
            <div className={style.zl_Icon} >
              <i  className={`iconfont  ${ IconColor(item.messageNotifyTypeId).icon }  ` } style={{ color:IconColor(item.messageNotifyTypeId).color }}></i>
            </div>
            <div className={style.zl_text} >
              <p>{ item.title }</p>
              <p>{ item.remark.length > 20 ? <Tooltip title={item.remark} ><span>{item.remark.slice(0,20)+'...'}</span></Tooltip> : item.remark}</p>
            </div> 
            <span className={style.zl_span} >{ moment(item.time*1000).format('MM月DD日') }</span>
         </div></div>)
        )
      }
      <p  className={style.zl_noMore}  >没有更多消息了~</p>
      <D visible={visible}  activeId={activeId}  handerShow = {function(){modelShow(!visible)}} />
      <Wfeedback visible={feedbackvisible}  activeId={activeId} remark={itemRemark}  handerShow = {function(){modelfeedback(!feedbackvisible)}} />
    </div>
  </div>
},(pre,next)=>pre.handerShow === next.handerShow )