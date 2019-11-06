/**
 * Created by kikazheng on 2019/4/24
 */
import React,{Component} from 'react'
import {Modal, Input, Message} from 'antd'
import service from '../../../../services'
import styles from '../index.less'

const {TextArea} = Input

class DisposeFeedback extends Component{
  state = {
    visible: false,
    message: '',
  }
  handleOk=()=> {
    const { item, remark } = this.props
    let message = this.state.message
    if(!remark) {
      message = message ? message : '您的宝贵建议已收到，请保持手机畅通，平台专人将尽快与您联系。'
    } else {
      if(!message) {
        return Message.warn('内容不能为空！')
      }
    }
    if(remark) {
      service.UPDATE({
        keys: { name: 'message/opinion/feedback', id:  item.id},
        data: {remarks: message},
      }).then(() => {
        Message.success('已发送！')
        this.setState({message: ''})
        this.props.onClone(true)
      })
    } else {
      if(message.length > 500 || message.length < 6){
        return Message.warn('内容不能大于500个字符，小于6个字符！')
      }
      service.EDIT({
        keys: { name: 'message/opinion/feedback', id:  item.id},
        data: {message: message},
      }).then(() => {
        Message.success('已发送！')
        this.setState({message: ''})
        this.props.onClone(true)
      })
    }
  }
  handleCancel=()=> {
    this.setState({message: ''})
    this.props.onClone()
  }
  onChange=(e)=> {
    this.setState({message: e.target.value})
  }
  render(){
    const {visible, remark} = this.props
    return(
      <div>
        <Modal
          title={remark ? '备注' : "处理反馈"}
          className='dispose_modal'
          width='570px'
          okText={remark ? '保存' : '确定处理'}
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <div className={styles.dispose_wrap}>
            <div className={styles.dispose_title}>{remark ? '处理信息备注' : '反馈用户消息'}</div>
            {remark ? '' : <div className={styles.dispose_p}>消息将在确定处理后推送到用户</div>}
            <TextArea className={styles.dispose_textArea} onChange={this.onChange} value={this.state.message} placeholder={remark? '' : '您的宝贵建议已收到，请保持手机畅通，平台专人将尽快与您联系。'}></TextArea>
          </div>
        </Modal>
      </div>
    )
  }
}

export default DisposeFeedback
