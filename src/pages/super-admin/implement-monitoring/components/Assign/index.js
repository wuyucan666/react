/**
 * Created by kikazheng on 2019/7/1
 */
import React,{Component} from 'react'
import {Modal, Select, Form, message} from 'antd'

import services from '../../../../../services'

const Option = Select.Option

class Index extends Component{
  state = {
    loading: false,
  }

  onOk = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({loading: true})
        const {storeId} = this.props.editItem
        const {implementAdminId} = values
        services.PUT({keys: {link: 'admin/implement/admin'}, data: {storeId, implementAdminId}}).then(res => {
          this.setState({loading: false})
          if(res.success){
            message.success('指定成功')
            this.props.onOk()
          }
        }).catch(() => {
          this.setState({loading: false})
        })
      }
    })
  }

  render(){
    const {list, onCancel, editItem} = this.props
    const {loading} = this.state
    const { getFieldDecorator} = this.props.form

    return(
      <Modal
        title='指定实施人'
        visible={true}
        width={570}
        confirmLoading={loading}
        onOk={this.onOk}
        onCancel={onCancel}
      >
        <Form layout="inline" hideRequiredMark>
          <Form.Item label='实施人' colon={false} style={{margin: '28px 0 28px 38px'}}>
            {getFieldDecorator('implementAdminId', {
              rules: [{ required: true, message: '请选择实施人' }],
              initialValue: editItem.implementAdminId || undefined,
            })(
              <Select
                size='large'
                style={{width: 350}}
                placeholder='请选择'
              >
                {
                  list.map(item => (
                    <Option value={item.adminId} key={item.adminId}>{item.userName}</Option>
                  ))
                }
              </Select>
            )}
          </Form.Item>
        </Form>
      </Modal>
    )
  }
}

export default Form.create()(Index)
