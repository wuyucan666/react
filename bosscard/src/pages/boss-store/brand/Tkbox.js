import { Component } from "react"
import { Form, Input, Modal } from "antd"
import validate from "../../../utils/validate"

const FormItem = Form.Item

const Tkbox = Form.create({
  mapPropsToFields(props) {
    //编辑操作,表单默认
    const { type, editItem } = props
    console.log(props)
    if (type === "edit" && editItem) {
      let obj = {}
      Object.keys(editItem).map(v => {
        return (obj[v] = Form.createFormField({
          value: editItem[v],
        }))
      })
      return obj
    }
  },
})(
  class extends Component {
    handleSubmit() {
      const { validateFields, resetFields } = this.props.form
      const { hideModal, type, recive } = this.props
      validateFields((err, values) => {
        if (err) {
          return
        }
        Object.keys(values).map(key => {
          if (!values[key]) {
            values[key] = ""
          }
          return true
        })
        recive(values)
        if (type === "add") {
          hideModal()
          resetFields()
        } else {
          hideModal()
          resetFields()
        }
      })
    }

    render() {
      const { getFieldDecorator } = this.props.form
      const { bankVisible, hideModal } = this.props
      const formItemLayout = {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 6 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
      }

      return (
        <div>
          <Modal
            title="新建银行卡号"
            visible={bankVisible}
            onOk={this.handleSubmit.bind(this)}
            onCancel={hideModal}
            okText="确定"
            cancelText="取消"
          >
            <div className="from-wrap-margin additional-wrap">
              <Form>
                <FormItem {...formItemLayout} label="户名">
                  {getFieldDecorator(
                    "accountName",
                    validate("用户", {
                      required: true,
                      max: 30,
                      type: "string",
                    })
                  )(<Input placeholder="请输入户名" size="large" />)}
                </FormItem>
                <FormItem {...formItemLayout} label="开户行">
                  {getFieldDecorator(
                    "bankTem",
                    validate("开户行", {
                      required: true,
                      max: 30,
                      type: "string",
                    })
                  )(<Input placeholder="请输入卡户行" size="large" />)}
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label="银行卡号"
                  className="from-wrap-remark"
                >
                  {getFieldDecorator(
                    "cardNumber",
                    validate("银行卡号", {
                      required: true,
                      max: 50,
                      min: 16,
                      type: "number",
                    })
                  )(<Input placeholder="请输入银行卡号" size="large" />)}
                </FormItem>
              </Form>
            </div>
          </Modal>
        </div>
      )
    }
  }
)
export default Tkbox
