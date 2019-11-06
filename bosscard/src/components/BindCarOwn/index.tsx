import React, { Component } from 'react'
import { Modal, Form, Input, message } from 'antd'
import services from 'services'

interface pageProps {
  visible: boolean,
  form: any,
  onCancel: any,
  bindCar: any,
}

class bindCarOwn extends Component<pageProps, {}> {

  onOk = () => {
    const { validateFieldsAndScroll } = this.props.form
    validateFieldsAndScroll((err, values) => {
      if(!err) {
        console.log(values)
        this.props.bindCar(values)
      }
    })
  }

  onChange = (e) => {
    console.log(e.target.value)
    const { value } = e.target
    if(value.length === 11) {
      services.LIST({ 
        keys: { name: 'store/client/list'}, 
        data: {q: { page: -1, limit: -1, where: {'phoneTem[~]': value}}}
      }).then(res => {
        if(res.code === '0') {
          const { setFieldsValue } = this.props.form
          if(res.list.length > 0) {
            message.info('当前手机号已绑定车主, 为您自动填入姓名')
            setFieldsValue({
              name: res.list[0].clientName
            })
          } else {
            setFieldsValue({
              name: ''
            })
          }
        }
      })
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: {
        sm: { span: 4 },
      },
      wrapperCol: {
        sm: { span: 20 },
      },
    }

    return (
      <div>
        <Modal
          title="绑定车主"
          okText="绑定"
          cancelText="取消"
          visible={this.props.visible}
          onCancel={() => {
            const { resetFields } = this.props.form
            resetFields()
            this.props.onCancel()
          }}
          onOk={this.onOk}
        >
          <Form {...formItemLayout}>
            <Form.Item label="车主手机" style={{marginBottom: 40}}>
              {
                getFieldDecorator('phone', {
                  rules: [
                    {
                      required: true,
                      message: '请输入车主手机'
                    }
                  ]
                })(
                  <Input size='large' maxLength={11} placeholder='请输入手机号' onChange={this.onChange.bind(this)}></Input>
                )
              }
            </Form.Item>
            <Form.Item label="车主姓名" style={{marginBottom: 40}}>
              {
                getFieldDecorator('name', {})(
                  <Input size='large' placeholder='请输入姓名'></Input>
                )
              }
            </Form.Item>
          </Form>
        </Modal>
      </div>
    )
  }
}

export default Form.create()(bindCarOwn)