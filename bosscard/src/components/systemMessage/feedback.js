import React , { useState , useRef  , useEffect }   from 'react' 
import moment from 'moment'
import {  Modal  , Spin ,message } from 'antd'
import services from 'services'

import style from './style.less'

function Detail(props){
    const { activeId ,handerShow ,visible, remark } = props
    const [ activeItem , selectActive ] = useState(null),[ loading , showLoad ] =useState(false)
    const detailContent = useRef(null)
    useEffect(() => {
        visible &&  showLoad(true)
        visible &&  services.messageNoifyShow({ keys:{ name:'messageNoify/show/{id}',id:activeId }  }).then( async res=>{
                if(res.code==='0'){
                    await selectActive({
                        title:res.data.title,
                        time:res.data.time,
                    })
                    await showLoad(false)
                    detailContent.current.innerHTML = remark ? remark : '您的宝贵建议已收到，请保持手机畅通，平台专人将尽快与您联系。'
                }else{
                    message.error('网络错误')
                }
            })  
        return function(){  if(detailContent && detailContent.current ) detailContent.current.innerHTML  = ''   } 
    },[ activeId  ])
    return <div>
        <Spin spinning={loading} >
          <Modal
          title={<p>{ activeItem ? activeItem.title : null  } <span className={ style.zl_addTile } ></span> </p>}
          width='900px'
          visible={visible}
          onCancel={ async ()=>{  handerShow() }}
          footer={null}
          >
           <div style={{ paddingBottom:'30px' }} >
            <div style={{color: '#666666FF', marginBottom: '19px'}}>意见反馈回复</div>
            <div style={{color:'#999999FF', paddingBottom: '19px'}}>{activeItem ? moment(activeItem.time*1000).format('YYYY-MM-DD  HH:mm:ss') : ''}</div>
            <div ref={detailContent} style={{color:'#999999FF', padding: '19px 0', borderTop: '1px solid #E1E1E6FF'}}>
            </div>
            <div onClick={async ()=>{  handerShow() }} style={{height:'40px', margin: '80px 0 40px 0', textAlign: 'right'}}>
                <span style={{width:'88px', display: 'inline-block', cursor: 'pointer', textAlign: 'center', lineHeight: '40px', background:'#4AACF7FF', color: '#fff'}}>知道了</span>
            </div>
           </div>
         </Modal>
        </Spin>
    </div>
}
export default  Detail