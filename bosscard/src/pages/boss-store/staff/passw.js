import services from '../../../services'
import validate from '../../../utils/validate'
import { Form, Modal, Input, message } from 'antd'
import { Component } from 'react'

const FormItem = Form.Item
const Tkbox = Form.create({}) (
  class extends Component {
    handleSubmit () {
      const { validateFields, resetFields } = this.props.form
      const { hideModal, id } = this.props
      validateFields((err, values) => {
        if (err) {
          return
        }
        Object.keys(values).map(key => {
          if(!values[key]){
            values[key] = ''
          }
          return true
        })
        services.UPDATE({data:values, keys:{'name': 'store/staff/password', id}}).then(res => {
          if (res.success) {
            hideModal(true)
            resetFields()
            message.success('添加成功！')
          } else {
            message.error(res.content)
          }
        })
      })
    }
    // 填写新密码
    onChange=() => {
      const { setFieldsValue } = this.props.form
      setFieldsValue({passwordConfirmation: ''})
    }

    render() {
      const { getFieldDecorator, getFieldValue } = this.props.form
      const { visible, hideModal, name } = this.props
      const formItemLayout = {
        labelCol: {
          sm: { span: 5 },
        },
        wrapperCol: {
          sm: { span: 18 },
        },
      }

      return (
        <div>
          <Modal
            title="重置密码"
            visible={visible}
            onOk={this.handleSubmit.bind(this)}
            onCancel={hideModal}
            okText="发布"
            width="570px"
            cancelText="取消">
            <div style={{marginBottom:'40px'}}>
              <div style={{margin: '0 0 30px 30px', fontWeight:'bold', color: '#333333FF'}}>{name}</div>
              <Form>
                <FormItem
                {...formItemLayout}
                label="新密码"
                >
                  {getFieldDecorator('password',validate('新密码',{
                    required: true,
                    type: 'loginpwd',
                  }))(
                    <Input placeholder="请输入新密码" size='large' onChange={this.onChange} />
                  )}
                </FormItem>
              </Form>
            </div>
            <Form>
              <FormItem
              {...formItemLayout}
              label="重复密码"
              >
                {getFieldDecorator('passwordConfirmation',validate('重复密码',{
                  required: true,
                  type: 'agpwd',
                  agpwd: getFieldValue('password'),
                }))(
                  <Input placeholder="请重新输入新密码" size='large' />
                )}
              </FormItem>
            </Form>
          </Modal>
        </div>
      )
    }
  }
)

export default Tkbox
