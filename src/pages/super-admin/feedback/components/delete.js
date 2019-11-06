/**
 * Created by kikazheng on 2019/4/24
 */
import React,{Component} from 'react'
import {Modal, Icon, Message} from 'antd'
import service from '../../../../services'
import styles from '../index.less'

class DeleteFeedback extends Component{
  state = {
    visible: false,
  }
  componentDidMount(){
  }
  handleOk=()=> {
    const { item } = this.props
    service.EDIT({
      keys: { name: 'message/opinion/feedback', id:  item.id},
    }).then(() => {
      Message.success('删除成功！')
      this.props.onClone()
    })
  }
  handleCancel=()=> {this.props.onClone()}
  render(){
    const {visible} = this.props
    return(
      <div>
        <Modal
          title=""
          className='delete_modal'
          width='674px'
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <div className={styles.delete_wrap}>
            <div className={styles.delete_title}><Icon type="delete" /></div>
            <div className={styles.delete_p}>你确定要删除该意见反馈吗？</div>
          </div>
        </Modal>
      </div>
    )
  }
}

export default DeleteFeedback
