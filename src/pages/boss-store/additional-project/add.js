import { Component } from "react"
import { message, Form, Input, Radio, Modal, Cascader } from "antd"
import services from "../../../services"
import validate from "../../../utils/validate"
import { allQueryArray } from "utils"

const FormItem = Form.Item
const { TextArea } = Input
const RadioGroup = Radio.Group
const Add = Form.create({
  mapPropsToFields(props) {
    //编辑操作,表单默认
    const { type, editItem, maintaintype } = props
    if (type === "edit") {
      let obj = {}
      editItem.maintainTypeId = allQueryArray(
        maintaintype,
        editItem.maintainTypeId,
        "maintainTypeId"
      )
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
    state = {
      count: 0,
      min: 0,
    }

    handleSubmit() {
      const { dispatch, hideModal, type, editItem } = this.props
      const { validateFields } = this.props.form
      validateFields((err, values) => {
        if (err) {
          return
        }
        for (let i in values) {
          if (!values[i] && i !== 'status') {
            values[i] = ""
          }
        }
        values.maintainTypeId = values.maintainTypeId.length ?
          values.maintainTypeId[values.maintainTypeId.length - 1] : 0
        if (type === "add") {
          services
            .INSERT({ data: values, keys: { name: "store/project/addition" } })
            .then(res => {
              if (res.success) {
                message.success("添加成功!")
                dispatch({
                  type: "table/getData",
                  payload: { new: "store/project/addition" },
                })
                hideModal()
              } else {
                message.error(res.content)
              }
            })
        } else {
          values.projectId = editItem.projectId
          services
            .UPDATE({ data: values, keys: { name: "store/project/addition", id: editItem.projectId } })
            .then(res => {
              if (res.success) {
                message.success("修改成功!")
                dispatch({
                  type: "table/getData",
                  payload: { new: "store/project/addition" },
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
      const { getFieldDecorator } = this.props.form
      const { hideModal, type, maintaintype, visible, editItem } = this.props
      const formItemLayout = {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 17 },
        },
      }
      return (
        <div>
          <Modal
            className="additional-project"
            title={type === "edit" ? "编辑附加项目" : "新增附加项目"}
            visible={visible}
            onOk={this.handleSubmit.bind(this)}
            onCancel={hideModal}
            okText="发布"
            cancelText="取消"
            width="570px"
          >
            <div className="from-wrap-margin additional-wrap">
              <Form>
                <FormItem {...formItemLayout} label="名称">
                  {getFieldDecorator(
                    "projectName",
                    validate("名称", {
                      required: true,
                      max: 30,
                      type: "string",
                      sole: true,
                      model: 'ProjectAdditional',
                      key: 'name',
                      id: editItem.projectId,
                      _var: Number(localStorage.getItem('coiling')) === 1 ? '1|2': 2,
                    })
                  )(<Input placeholder="输入名称" size="large" />)}
                </FormItem>
                <FormItem {...formItemLayout} label="成本">
                  {getFieldDecorator(
                    "cost",
                    validate("金额", {
                      required: true,
                      max: 30,
                      type: "price",
                    })
                  )(<Input placeholder="输入金额" size="large" />)}
                </FormItem>
                <FormItem {...formItemLayout} label="售价">
                  {getFieldDecorator(
                    "priceTem",
                    validate("售价", {
                      required: true,
                      max: 30,
                      type: "price",
                    })
                  )(<Input placeholder="输入金额" size="large" />)}
                </FormItem>
                <FormItem {...formItemLayout} label="维修类型">
                  {getFieldDecorator(
                    "maintainTypeId",
                    validate("维修类型", { required: false, type: "select" })
                  )(
                    <Cascader
                      size="large"
                      placeholder="请选择维修类型"
                      options={maintaintype}
                      expandTrigger="hover"
                    />
                  )}
                </FormItem>
                <FormItem {...formItemLayout} label="状态">
                  {getFieldDecorator("status", { initialValue: 1 })(
                    <RadioGroup>
                      <Radio value={1}>启用</Radio>
                      <Radio value={0}>停用</Radio>
                    </RadioGroup>
                  )}
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label="备注"
                  className="from-wrap-remark"
                >
                  {getFieldDecorator("remark", validate("备注", { max: 200 }))(
                    <TextArea
                      style={{ width: "358px", height: "80px" }}
                      className="inputwidth"
                      placeholder="备注"
                    />
                  )}
                </FormItem>
              </Form>
            </div>
          </Modal>
        </div>
      )
    }
  }
)
export default Add
