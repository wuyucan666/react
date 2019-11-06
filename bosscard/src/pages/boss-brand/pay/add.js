import { Component } from "react"
import { Button, message, Form, Input, Radio } from "antd"
import services from "../../../services"
import validate from "../../../utils/validate"
import * as styles from "./styles.less"

const FormItem = Form.Item
const { TextArea } = Input
const RadioGroup = Radio.Group

const Add = Form.create({
  mapPropsToFields(props) {
    //编辑操作,表单默认
    const { type, editItem } = props
    if (type === "edit") {
      let obj = {}
      Object.keys(editItem).map(v => {
        return (obj[v] = Form.createFormField({
          value: editItem[v] ? editItem[v] : "",
        }))
      })
      return obj
    }
  },
})(
  class extends Component {
    publish() {
      const { dispatch, hideModal, type, editItem } = this.props
      const { validateFields } = this.props.form
      validateFields((err, values) => {
        if (err) {
          return
        }
        for (let i in values) {
          if (!values[i]) {
            values[i] = ""
          }
        }
        if (type === "add") {
          services
            .insert({ data: values, keys: { name: "brand/payment" } })
            .then(res => {
              if (res.success) {
                message.success("添加成功!")
                dispatch({
                  type: "table/getData",
                  payload: "brand/payment",
                })
                hideModal()
              } else {
                message.error(res.content)
              }
            })
        } else {
          values.paymentId = editItem.paymentId
          services
            .update({ data: values, keys: { name: "brand/payment" } })
            .then(res => {
              if (res.success) {
                message.success("修改成功!")
                dispatch({
                  type: "table/getData",
                  payload: "brand/payment",
                })
                hideModal()
              } else {
                message.error(res.connect)
              }
            })
        }
      })
    }
    render() {
      const {
        getFieldDecorator,
        // getFieldError,
        // getFieldValue,
      } = this.props.form
      const { hideModal, type, editItem } = this.props
      const formItemLayout = {
        labelCol: {
          sm: { span: 8 },
        },
        wrapperCol: {
          sm: { span: 16 },
        },
      }
      return (
        <div className="from-wrap-margin">
          <div>
            <div className={styles.brandhead}>
              {type === "add" ? "新建支付方式" : "编辑支付方式"}
            </div>
            <div className={styles.centerDiv}>
              <Form>
                <FormItem {...formItemLayout} label="支付名称">
                  {getFieldDecorator(
                    "paymentName",
                    validate("支付名称", {
                      required: true,
                      max: 30,
                      type: "string",
                      sole: true,
                      model: 'PaymentType',
                      id: editItem.paymentId,
                      _var: '0|1',
                    })
                  )(
                    <Input
                      className={styles.espInput350}
                      placeholder="请输入支付名称"
                      size="large"
                    />
                  )}
                </FormItem>
                <FormItem {...formItemLayout} label="备注">
                  {getFieldDecorator(
                    "remark",
                    validate("备注", { required: false, max: 200 })
                  )(
                    <TextArea
                      style={{
                        width: "350px",
                        height: "80px",
                        maxWidth: "350px",
                      }}
                      placeholder="请输入备注信息"
                    />
                  )}
                </FormItem>
                <FormItem {...formItemLayout} label="是否开启">
                  {getFieldDecorator("statusTem", { initialValue: 1 })(
                    <RadioGroup name="statusTem">
                      <Radio value={1}>是</Radio>
                      <Radio value={2}>否</Radio>
                    </RadioGroup>
                  )}
                </FormItem>
                <FormItem {...formItemLayout} label="是否收现">
                  {getFieldDecorator("typeTem", { initialValue: 1 })(
                    <RadioGroup name="typeTem">
                      <Radio value={1}>是</Radio>
                      <Radio value={2}>否</Radio>
                    </RadioGroup>
                  )}
                </FormItem>
              </Form>
              <div className={styles.btnDiv}>
                <Button size="large" type="primary" onClick={this.publish.bind(this)}>
                  发布
                </Button>
                <Button size="large" onClick={hideModal}>取消</Button>
              </div>
            </div>
          </div>
        </div>
      )
    }
  }
)
export default Add
