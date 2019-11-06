/**
 * Created by kikazheng on 2019/7/3
 */
import React,{ Component } from 'react'
import {Modal, Form, Input, InputNumber, message} from 'antd'

import service from 'services'

class Index extends Component{
  state = {
    loading: false,
  }

  handleOk = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({loading: true})
        const {editItem} = this.props
        if(editItem.id){
          service.UPDATE({keys: {name: 'admin/store/tag', id: editItem.id}, data: {...values}}).then(res => {
            this.setState({loading: false})
            if(res.success){
              message.success('修改成功')
              this.props.form.resetFields()
              this.props.onOk()
            }
          }).catch(() => {
            this.setState({loading: false})
          })
        }else {
          service.INSERT({keys: {name: 'admin/store/tag'}, data: {...values}}).then(res => {
            this.setState({loading: false})
            if(res.success){
              message.success('添加成功')
              this.props.form.resetFields()
              this.props.onOk()
            }
          }).catch(() => {
            this.setState({loading: false})
          })
        }
      }
    })
  }

  handleCancel = () => {
    this.props.form.resetFields()
    this.props.onCancel()
  }
  render(){
    const { getFieldDecorator } = this.props.form
    const {editItem, visible} = this.props
    const {loading} = this.state
    return(
      <Modal
        title={editItem.id ? '编辑标签' : '新建标签'}
        visible={visible}
        confirmLoading={loading}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
      >
        <Form layout='horizontal' labelCol={{ span: 6 }} colon={false} wrapperCol={{ span: 15 }}>
          <Form.Item label='标签名称' style={{marginBottom: 30}}>
            {getFieldDecorator('name', {
              initialValue: editItem.name,
              rules: [{ required: true, message: '请输入名称!' }],
            })(
              <Input placeholder="请输入" size='large' />,
            )}
          </Form.Item>
          <Form.Item label='排序编号'>
            {getFieldDecorator('sort', {
              initialValue: editItem.sort,
            })(
              <InputNumber style={{width: '100%'}} placeholder="请输入" size='large' min={0} precision={0} />,
            )}
          </Form.Item>
        </Form>
      </Modal>
    )
  }
}

export default Form.create()(Index)
