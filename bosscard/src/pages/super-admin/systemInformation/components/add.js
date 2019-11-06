import React , { useState ,useRef   } from 'react'
import { Select ,Button ,Modal, message } from 'antd'
import BraftEditor  from 'braft-editor'
import 'braft-editor/dist/index.css'
import moment from 'moment'

import uploadImg from '../../../../utils/uploadImg'
import style from '../style.less'
import service from '../../../../services'

const { Option } = Select
const HanderOption = React.memo(({ des ,handerChange ,list ,defaultValue ,New })=>{
    const SelectType = {}
    if(des.type===2)SelectType.mode = 'multiple'
    return  (
     <div className={style.zl_optionItem} >
      <span style={{ marginRight:'15px' }} >{des.content}</span>
      <Select  
         disabled={New ? true : false }
         defaultValue={defaultValue}   
         { ...SelectType }
         style={{ width: 290 }} 
         size='large' 
         placeholder='选择类型'  
         onChange={(value)=>{ handerChange(des.type,value) }}>
         {
         list.map((item,i)=><Option key={item.id} value={item.id}  >{ item.name }</Option>)   
         } 
      </Select>
      </div>)
},(pre,next)=> pre.defaultValue === next.defaultValue)
function Index (props){
    const { typeList , data ,handerShow } = props 
    const [ editorState , setEditorState ] = useState( BraftEditor.createEditorState(data.id ? data.content : null ) )
    const [ visible , modelShow ] = useState(null) , previewDetail = useRef(null)
    const [ messageType , setMessageType ] =useState(()=>{
        if(data.id){
             return data.messageNotifyTypeId
        }else{
            return null
        }
    }) ,[ theType , setThetype ] = useState(()=>{
        if(data.id){
           let  type = [] 
           if(data.isBrand)type.push(1)
           if(data.isStore)type.push(2)
           return type
        }else{
           return []
        }
    })
    const handerChange=(type,value)=>{
       if(type===1){ //修改类型
           setMessageType(value)  
       }else if(type===2){
           setThetype(value)
       }
    }
    const submitContent= async ()=>{
        const htmlContent = editorState.toHTML()
        if(!messageType){
            message.info('请选择通知类型')
            return
        }
        if(theType.length === 0){
            message.info('请选择接受端口')
            return
        }
        if(data.id){//编辑通知
         await service.messageNoifyPut({ keys: { name: "messageNoify/messageNotify/{id}", id : data.id } ,data:{ content :htmlContent } }).then(res=>{
            if(res.code==='0'){ message.success('修改成功')    }
         })  
        }else{
        // 添加通知
          await service.messageNoifyAdd({ data:{ messageNotifyTypeId:messageType , isStore : theType.includes(2) ,isBrand :theType.includes(1) ,content :htmlContent   }  })
         .then(res=>{   if(res.code==='0'){  message.success('添加成功')  } 
         })
        }  
        handerShow()   
    }
    //上传文件
    const uploadFn = (parmam) =>{
        const successFn = (url) => {
            parmam.success({
              url, 
            })
          }
        uploadImg( parmam.file , 'noticeManage' ,(id,url)=>{
            successFn(url) 
        })    
    } 
    const toPreviewDetail = async ()=>{
       await modelShow( !visible )
       previewDetail.current.innerHTML= editorState.toHTML()
    }
    return (
    <div className={style.zl_addBox} >
        <Button  onClick={ ()=>{ handerShow() } } type='primary' size='large' style={{ position:'absolute' ,right:'30px',top:'30px' }} >返回上一页</Button>
        <HanderOption handerChange={handerChange} New={ data.id ? true : false }  defaultValue={messageType}  list={typeList} des={{ content:'通知类型 ' , type:1  }} />
        <HanderOption handerChange={handerChange} New={ data.id ? true : false } defaultValue={theType}  list={[ { id:1 , name:'品牌商' } , { id:2,name:'门店' } ]} des={{ content:'接受端口 ' , type:2  }} />
        <div className={ style.zl_BraftEditor } >
            <BraftEditor
                value={editorState}
                onChange={(editorState)=>{ setEditorState(editorState)   }}
                media={{ uploadFn }}
            />
        </div>
        <div className={ style.zl_btns } >
            <Button size='large'  style={{ width:'120px',marginRight:'30px' }} onClick={toPreviewDetail}  >预览详情</Button>
            <Button size='large' type='primary' onClick={submitContent} style={{ width:'120px' }}   >发送</Button>
        </div>
        <Modal
          title={<p>{ messageType  && typeList.filter(i=>i.id === messageType)[0].name  } <span className={ style.zl_addTile } >{  moment( new Date() ).format('YYYY-MM-DD  HH:mm:ss') }</span> </p>}
          width='80%'
          visible={visible}
          onCancel={()=>{ modelShow(!visible)  }}
          onOk={()=>{ modelShow(!visible) }}
        >
          <div ref={previewDetail} ></div>
        </Modal>
    </div>
    )
}
export default Index