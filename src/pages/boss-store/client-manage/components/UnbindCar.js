/**
 * Created by kikazheng on 2019/4/15
 */
import React, {Component} from 'react'
import {Modal} from 'antd'

class UnbindCar extends Component{
  state = {
    loading: false,
  }
  onOk = async () => {
    this.setState({loading: true})
    const callBack = () => {
      this.setState({loading: false})
    }
    this.props.onOk(callBack)
  }
  onCancel = () => {
    this.props.onCancel()
  }
  render(){
    const {visible} = this.props
    const {loading} = this.state
    return(
      <Modal
        title=' '
        wrapClassName='unbind-car'
        width={570}
        confirmLoading={loading}
        visible={visible}
        onOk={this.onOk}
        onCancel={this.onCancel}
      >
        <div>
          <i className='iconfont icon-tishi' style={{color: '#FF6F28',marginRight: 16}}/>
          解绑此车辆后，车辆信息不会删除，可重新绑定，是否继续？
        </div>
      </Modal>
    )
  }
}

export default UnbindCar
