import { Component } from "react"
import { Form, Input, Select, Button, message } from "antd"
import validate from "../../../utils/validate"
import * as styles from "./index.less"
import services from "../../../services"

const FormItem = Form.Item
const Option = Select.Option
const { TextArea } = Input

const Add = Form.create({
  mapPropsToFields(props) {
    //编辑操作,表单默认
    const { type, editItem, roleList } = props
    if (type === "edit") {
      let obj = {}
      Object.keys(editItem).map((v) => {
        if (v === "roleId") {
          return (obj[v] = Form.createFormField({
            value: roleList.findIndex(item => item.id === editItem.roleId) > -1 ? editItem.roleId : undefined,
          }))
        } else {
          return (obj[v] = Form.createFormField({
            value: editItem[v],
          }))
        }
      })
      return obj
    }
  },
})(
  class extends Component {
    state = {
      isChange: false,
      readOnly: "readonly",
    }
    componentWillMount() {
      setTimeout(() => this.setState({ readOnly: "" }), 500)
    }
    publish() {
      const { dispatch, hideAdd, type, editItem } = this.props
      const { validateFields } = this.props.form
      validateFields((err, values) => {
        if (err) {
          return
        }
        Object.keys(values).map((key) => {
          if (!values[key]) {
            values[key] = ""
          }
          return true
        })
        if (type === "add") {
          services
            .insert({ data: values, keys: { name: "admin" } })
            .then((res) => {
              if (res.success) {
                message.success("添加成功!")
                dispatch({
                  type: "table/getData",
                  payload: "admin",
                })
                hideAdd()
              }
            })
        } else {
          values.adminId = editItem.adminId
          services
            .update({ data: values, keys: { name: "admin" } })
            .then((res) => {
              if (res.success) {
                message.success("修改成功!")
                dispatch({
                  type: "table/getData",
                  payload: "admin",
                })
                hideAdd()
              }
            })
        }
      })
    }
    render() {
      const { getFieldDecorator } = this.props.form
      const { hideAdd, roleList, type } = this.props
      const formItemLayout = {
        labelCol: {
          sm: { span: 8 },
        },
        wrapperCol: {
          sm: { span: 8 },
        },
      }
      return (
        <div className={styles.marginT}>
          <div className={styles.brandhead}>
            {type === "add" ? "新建管理员" : "编辑管理员"}
          </div>
          <Form className="from-wrap-margin">
            <FormItem
              onSubmit={this.handleSubmit}
              {...formItemLayout}
              label="姓名"
            >
              {getFieldDecorator(
                "userName",
                validate("管理员姓名", {
                  required: true,
                  max: 30,
                  type: "string",
                })
              )(
                <Input
                  placeholder="请输入管理员姓名"
                  size="large"
                  autoComplete="off"
                  readOnly={this.state.readOnly}
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="角色">
              {getFieldDecorator(
                "roleId",
                validate("角色", { required: true, type: "select" })
              )(
                <Select
                  size="large"
                  placeholder="请选择"
                  // onChange={this.onChange.bind(this)}
                >
                  {roleList.map((v) => {
                    return <Option key={v.id} value={v.id}>{v.name}</Option>
                  })}
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="手机号码">
              {getFieldDecorator(
                "phoneTem",
                validate("手机号", { required: true, type: "phone"})
              )(
                <Input
                  placeholder="请输入手机号码"
                  size="large"
                  maxLength={11}
                  readOnly={this.state.readOnly}
                />
              )}
            </FormItem>
            {type === "add" && (
              <FormItem {...formItemLayout} label="登录密码">
                {getFieldDecorator(
                  "pwd",
                  validate("密码", { required: true, type: "pwd" })
                )(
                  <Input
                    placeholder="请输入密码"
                    type="password"
                    size="large"
                    readOnly={this.state.readOnly}
                  />
                )}
              </FormItem>
            )}
            <FormItem {...formItemLayout} label="备注">
              {getFieldDecorator(
                "remark",
                validate("备注", { required: false, max: 200 })
              )(<TextArea placeholder="备注" rows={4} />)}
            </FormItem>
            <FormItem {...formItemLayout} className={styles.marginL}>
              <Button
                className={styles.margin24}
                size="large"
                onClick={hideAdd}
              >
                取消
              </Button>
              <Button
                type="primary"
                size="large"
                onClick={this.publish.bind(this)}
              >
                发布
              </Button>
            </FormItem>
          </Form>
        </div>
      )
    }
  }
)

export default Add
