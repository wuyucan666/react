import React,{ Component } from 'react'
import  styles  from '../styles.less'
import { Button ,message } from 'antd'
import  { historyList } from '../detail/data'
import services from "services"
import moment from "moment"
class PopMast extends Component{
     constructor(){
          super()
          this.state={
               historyList,
               loading:false,
               disabled:false,
          }
     }
     notShow=()=>{
          this.props.notShow()
     }
     //作废订单
     cancelOrder=(id)=>{
          const { reasonState } =this.props
          if( !reasonState && this.refs.reason.value === '' ) {
               message.info('作废原因不能为空')
               return
          }
          this.setState({
               loading:true,
               disabled:true,
          },()=>{
               let data = reasonState ? {} : {reason:this.refs.reason.value}
               services.DELETE({ keys: {name: 'maintain/cancelOrder',id} ,data  }).then(res=>{
                    if(res.success){
                          this.setState({
                              loading:false,
                              disabled:false,
                          },()=>{
                              this.props.notShow()
                              message.success('订单已作废!')
                              this.props.getData()
                          })
                    }else{
                         message.info('网络出现错误')
                    }
               })
          })

     }
     //获取订单历史
     getHistoryList=(id)=>{
          services.maintainHistoryList({ keys: {name: 'order/change/record/',id}  }).then(res=>{
               this.setState({
                    historyList:res.list,
               })
        })
     }
     UNSAFE_componentWillMount(){
        const {  cancelId ,mastType  } = this.props
        mastType ===2 ? this.getHistoryList(cancelId) : null
     }
     render(){
        const { mastType,cancelId, reasonState } =this.props
        const { historyList , disabled , loading }=this.state

        return <div className={ styles.zl_Mast } >
                    { mastType===1 ?  <div className={ styles.zl_cancelReason } >
                                         <p>作废原因 <span style={{cursor: 'pointer'}} onClick={ this.notShow } >&times; </span> </p>
                                         {reasonState ? <div className={styles.zl_cancelReason_txt}>确定删除该订单？</div> : ''}
                                         {reasonState ? '' : <div><textarea  ref="reason" className={styles.wyc_textarea}  placeholder="填写作废原因（必填）" ></textarea><br/></div> }
                                         <div className={styles.zl_cancelReason_btn}>
                                             <Button size="large" onClick={ this.notShow } style={ { marginRight:'24px',width: '88px' } }>取消</Button>
                                             <Button size="large" disabled={ disabled  } style={ {width: '88px' } } loading={loading} type="primary" onClick={this.cancelOrder.bind(this,cancelId) }> 确定</Button>
                                         </div>
                                     </div>
                                   : null    }
                    { mastType===2 ? <div className={ styles.zl_maintianHistory } >
                                         <p>修改订单历史 <span onClick={ this.notShow } style={{cursor:'pointer'}}>&times; </span> </p>
                                         <div>
                                             <ul className={ styles.zl_leftUl }  >
                                                 { historyList.map((i,n)=>{
                                                      return <li key={n} >
                                                                  <p>{moment(i.created * 1000).format("YYYY-MM-DD") }</p>
                                                                  <p>{moment(i.created * 1000).format(" HH:mm:ss") }</p>
                                                                  <i className={ styles.zl_cricleStatus } ></i>
                                                             </li>
                                                 }) }
                                             </ul>
                                             <ul className={ styles.zl_rightUl } >
                                                {
                                                  historyList.map((i,n)=>{
                                                       return <li key={ n } >
                                                                 <div>
                                                                      <p>{i.name}做了【{i.operation}】操作</p>
                                                                    { i.laststate===i.nowstate  ||   <p>订单状态：【{i.laststate}】改为【{i.nowstate}】</p>   }
                                                                 </div>
                                                              </li>
                                                  })

                                                }
                                                  <div style={{ height:'20px',background:'rgba(250,250,250,1)',width:'100% ' }} ></div>
                                             </ul>
                                         </div>
                                     </div>
                                   :null   }
               </div>
    }

}
export default PopMast
