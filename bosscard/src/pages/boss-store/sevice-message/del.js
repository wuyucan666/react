import React, { Component } from 'react'
import {Modal} from 'antd'
import { connect } from 'dva'
import styles from './styles.less'

class DelBox extends Component {
  constructor(){
    super()
    this.state={
    }
  }
  handleOk=()=>{
    this.props.onCancel(true)
  }
  handleCancel=()=> {
    this.props.onCancel()
  }
  render() {
    const {visible}= this.props
    return (
      <div>
        <Modal
          title=""
          width="674px"
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          className='delete_modal'
        >
          <div className={styles.s_message_del_w}>
            <div className={styles.s_message_del_t}><span className='iconfont icon-shanchu'></span></div>
            <div className={styles.s_message_del_txt}>删除后该服务不会再发送短信，确定删除？</div>
          </div>
        </Modal>
      </div>
    )
  }
}
export default connect()(DelBox)
