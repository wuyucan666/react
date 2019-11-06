import React , { useState , useRef  , useEffect }   from 'react' 
import moment from 'moment'
import {  Modal  , Spin , message } from 'antd'
import services from 'services'

import style from './style.less'

function Detail(props){
    const { activeId ,handerShow ,visible } = props
    const [ activeItem , selectActive ] = useState(null),[ loading , showLoad ] =useState(false)
    const detailContent = useRef(null)
    useEffect(()=>{
        visible &&  showLoad(true)
        visible &&  services.messageNoifyShow({ keys:{ name:'messageNoify/show/{id}',id:activeId }  }).then( async res=>{
                if(res.code==='0'){
                    await selectActive({
                        title:res.data.title,
                        time:res.data.time,
                    })
                    await showLoad(false)
                    detailContent.current.innerHTML = res.data.content
                }else{
                    message.error('网络错误')
                }
            })  
        return function(){  if(detailContent && detailContent.current ) detailContent.current.innerHTML  = ''   } 
    },[ activeId  ])
    return <div>
        <Spin spinning={loading} >
          <Modal
          title={<p>{ activeItem ? activeItem.title : null  } <span className={ style.zl_addTile } >{ activeItem ? moment(activeItem.time*1000).format('YYYY-MM-DD  HH:mm:ss') : null }</span> </p>}
          width='900px'
          visible={visible}
          onCancel={ async ()=>{  handerShow() }}
          footer={null}
          >
           <div style={{ paddingBottom:'30px' }} >
             <div  className={style.zl_itemDetail} ref={detailContent} >
             </div>
           </div>
         </Modal>
        </Spin>
    </div>
}
export default  Detail