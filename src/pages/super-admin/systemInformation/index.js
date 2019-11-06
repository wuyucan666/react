import React ,  {  useState , useEffect } from 'react'
import { connect } from 'dva'
import { Select, message } from 'antd'

import CommonTable from "../../../components/CommonTable/index"
import Add from './components/add'
import { tableConfig } from './config'   
import style from './style.less'
import service from '../../../services'
import D from '../../../components/systemMessage/detail'

const { Option } = Select
function  Index (props){
   const [ addShow , showAdd  ] = useState( { isShow:false ,data:{} } ) , staticPow = true
   const [ newTableConfig , setTableConfig ] = useState( tableConfig )
   const [ typeList ,setTypeList ] = useState([]) 
   const [ activeId , setActiveID ] = useState(null) , [ visible , showDetail ] = useState(false)
   const resetQuery =()=>{ //重置查询条件
      if(newTableConfig.screen.query.messageNotifyTypeId){
        delete newTableConfig.screen.query.messageNotifyTypeId 
      }
   }
   const handerTableEvent =(e,item) =>{ //表格操作
       if(e===217){      //新增
          resetQuery()
          showAdd({ isShow: !addShow.isShow , data:{}  })
       }else if(e===14){ //详情 
          setActiveID(item.id)
          showDetail(!visible) 
       }else if(e===11){ //编辑
          resetQuery()
         service.messageNoifyEdit({ keys: { name: "messageNoify/messageNotify/{id}/edit", id : item.id } }).then(res=>{ 
             if(res.code==='0') showAdd({ isShow:!addShow.isShow ,data:res.data })
         })
       }else if(e===66){
         service.messageNoifyDel({ keys: { name: "messageNoify/messageNotify", id : item.id } }).then(res=>{ 
            if(res.code==='0') { 
               message.success('撤回成功')
               props.dispatch({
                  type: "table/getData",
                  payload:"messageNoify/messageNotify",
              })
             }
        })
       }
   }
   const handleChange = (val) =>{ //筛选条件
        setTableConfig(()=>{
            if(!val){
              resetQuery()
              return newTableConfig
            }
            newTableConfig.screen.query.messageNotifyTypeId = val 
            return newTableConfig
        })
        props.dispatch({
            type: "table/getData",
            payload:"messageNoify/messageNotify",
        })
   }
   useEffect(()=>{
        service.messageNoifyType().then(res=>{
           if(res.code==='0') setTypeList( res.list )
        })
        return function () {  resetQuery()   }  
   },[ staticPow ])
   return <div style={{ position:'relative'  }} >
      {
         !addShow.isShow &&
        <div className={ style.zl_head } >
         <Select  style={{ width: 290 }} size='large' placeholder='请选择分类'  onChange={handleChange}>
           {
             [{ id:0,name:'全部' }, ...typeList].map((item,i)=><Option key={i} value={item.id}  >{ item.name }</Option>)   
           } 
         </Select>
        </div>  
      }
      {
         addShow.isShow ? <Add  data={ addShow.data }   handerShow={function(){   showAdd({ isShow: !addShow.isShow , data:{}  })    }}  typeList={typeList}  />  : <CommonTable tableConfig={newTableConfig}  name='messageNoify/messageNotify' New onTableChange={handerTableEvent}    />
      }
        <D visible={visible}   activeId={activeId}  handerShow = { function(){ showDetail(!visible)  } }   /> 
   </div>
}
export default connect()(Index)