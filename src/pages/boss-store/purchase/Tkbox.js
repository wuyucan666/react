import services from '../../../services'
import validate from '../../../utils/validate'
import { Form, Modal, Input, message, Select } from 'antd'
import { Component } from 'react'

const FormItem = Form.Item
const Option = Select.Option
const Tkbox = Form.create() (
  class extends Component {
    handleSubmit () {
      const { validateFields, resetFields } = this.props.form
      const { hideModal, dispatch } = this.props
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
        let obj = {
          ...values,
          addressTem: "",
          bankCard: {update: [], delete: [], insert: []},
          faxTem: "",
          reconciliationDate: "",
          remark: "",
          sortTem: 0,
          weChat: "",
        }
        services.insert({data:obj, keys:{'name': 'store/supplier'}}).then(res => {
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
      const handleChange = value => {
        console.log(`selected ${value}`)
      }

      return (
        <div>
          <Modal
            title='新建供应商'
            visible={visible}
            onOk={this.handleSubmit.bind(this)}
            onCancel={hideModal}
            okText="确定"
            cancelText="取消">
            <Form className="from-wrap-margin">
              <FormItem
              {...formItemLayout}
              label="供应商名称"
              >
                {getFieldDecorator(
                  "supplierName",
                  validate("供应商名称", {
                    required: true,
                    max: 30,
                    type: "string",
                    sole: true,
                    model: "Supplier",
                    id: '',
                  })
                )(
                  <Input
                    placeholder="请输入供应商名称"
                    size="large"
                  />
                )}
              </FormItem>
              <FormItem
              {...formItemLayout}
              label="联系人"
              >
                {getFieldDecorator(
                  "persionInChargeName",
                  validate("联系人", {
                    required: false,
                    max: 30,
                    type: "string",
                  })
                )(
                  <Input
                    placeholder="请输入联系人"
                    size="large"
                  />
                )}
              </FormItem>
              <FormItem
              {...formItemLayout}
              label="业务手机"
              >
                {getFieldDecorator(
                  "businessPhone", {
                    ...validate("业务手机", {
                      required: false,
                      type: "phone",
                      max: 11,
                      sole: true,
                      model: 'Supplier',
                      id: '',
                    }),
                  }
                )(
                  <Input
                    placeholder="请输入业务手机"
                    size="large"
                  />
                )}
              </FormItem>
              <div className="from-wrap-margin-bottom">
                <FormItem
                {...formItemLayout}
                label="结算方式"
                >
                  {getFieldDecorator(
                    "settlementMethod",
                    validate("结算方式", { required: true })
                  )(
                    <Select initialValue="" onChange={handleChange} size="large">
                      <Option value={1}>月结</Option>
                      <Option value={2}>签单</Option>
                    </Select>
                  )}
                </FormItem>
              </div>
            </Form>
          </Modal>
        </div>
      )
    }
  }
)

export default Tkbox
