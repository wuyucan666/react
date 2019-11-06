import services from '../../../services'
import validate from '../../../utils/validate'
import { Form, Modal, Input, message } from 'antd'
import { Component } from 'react'

const FormItem = Form.Item
const Tkbox = Form.create({}) (
  class extends Component {
    handleSubmit () {
      const { validateFields, resetFields } = this.props.form
      const { hideModal } = this.props
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
        services.insert({data:values, keys:{'name': 'store/staffgroup'}}).then(res => {
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

    render() {
      const { getFieldDecorator } = this.props.form
      const { visible, hideModal } = this.props
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
            title="新建班组"
            visible={visible}
            onOk={this.handleSubmit.bind(this)}
            onCancel={hideModal}
            okText="发布"
            cancelText="取消">
            <Form>
              <FormItem
              {...formItemLayout}
              label="班组名称"
              >
                {getFieldDecorator('groupName',validate('班组名称',{
                  required: true,
                  max: 30,
                  type: 'string',
                  sole: true,
                  model: 'StaffGroup',
                  id: '',
                }))(
                  <Input placeholder="请输入班组名称" size='large' />
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
