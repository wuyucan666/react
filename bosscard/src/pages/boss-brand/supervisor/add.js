import { Component } from "react"
import { Form, Input, Select, Button, message, Switch } from "antd"
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
      Object.keys(editItem).map(v => {
        if (v === "statusTem") {
          return (obj[v] = Form.createFormField({
            value: Number(editItem.statusTem) === 1,
          }))
        } else if (v === "istrationStore") {
          let temp = editItem.istrationStore.split(",")
          return (obj[v] = Form.createFormField({
            value: temp,
          }))
        }else if(v === 'roleId'){
          return (obj[v] = Form.createFormField({
            value: roleList.findIndex(item => item.id === editItem.roleId) > -1 ? editItem.roleId : undefined,
          }))
        }
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
      isChange: false,
    }
    publish() {
      const { dispatch, hideAdd, type, editItem } = this.props
      const { validateFields } = this.props.form
      validateFields((err, values) => {
        if (err) {
          return
        }
        // console.log(values,777777777)
        Object.keys(values).map(key => {
          if (key === "statusTem") {
            if (values[key] === true) {
              values[key] = 1
            } else if (!values[key]) {
              values[key] = 2
            }
          }
          // if (!values[key]) {
          //   values[key] = ""
          // }
          return true
        })
        if (type === "add") {
          services
            .insert({ data: values, keys: { name: "brand/supervisor" } })
            .then(res => {
              if (res.success) {
                message.success("添加成功!")
                dispatch({
                  type: "table/getData",
                  payload: "brand/supervisor",
                })
                hideAdd()
              } else {
                message.error(res.content)
              }
            })
        } else {
          values.supervisorId = editItem.supervisorId
          services
            .update({ data: values, keys: { name: "brand/supervisor" } })
            .then(res => {
              if (res.success) {
                message.success("修改成功!")
                dispatch({
                  type: "table/getData",
                  payload: "brand/supervisor",
                })
                hideAdd()
              } else {
                message.error(res.content)
              }
            })
        }
      })
    }
    componentDidMount() {
      this.props.dispatch({ type: "brandSupervisor/getRole"})
      this.props.dispatch({ type: "brandSupervisor/getStore",payload:{data:{q:{page:-1,limit: -1}}}})
    }
    popupScroll = (e) => {
      e.persist()
      let target = e.target
      if (target.scrollTop + target.offsetHeight === target.scrollHeight) {
        // console.log("00000000000000")
      //   const {page, totalPage, value} = this.state
      //   if(page < totalPage){
      //     this.setState({
      //       page: page + 1,
      //     },()=>{
      //       this.getResult(value, true)
      //     })
      //   }
      // this.props.dispatch({ type: "brandSupervisor/getStore",payload:{data:{page:-1,limit: -1}}})
      }
    }
    render() {
      const { getFieldDecorator } = this.props.form
      const { hideAdd, roleList, type, storeList, editItem } = this.props
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
            {type === "add" ? "新建督导" : "编辑督导"}
          </div>
          <Form className="from-wrap-margin">
            <FormItem
              onSubmit={this.handleSubmit}
              {...formItemLayout}
              label="姓名"
            >
              {getFieldDecorator(
                "supervisorName",
                validate("督导姓名", {
                  required: true,
                  max: 30,
                  type: "string",
                  sole: true,
                  model: "Supervisor",
                  _var: false,
                  id: editItem.supervisorId,
                })
              )(<Input placeholder="请输入督导姓名" size="large" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="权限角色">
              {getFieldDecorator(
                "roleId",
                validate("角色", { required: true, type: "select" })
              )(
                <Select placeholder="请选择" size="large">
                  {roleList.map(v => {
                    return (
                      <Option key={v.id} value={v.id}>
                        {v.name}
                      </Option>
                    )
                  })}
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="门店范围">
              {getFieldDecorator(
                "istrationStore",
                validate("门店", { required: true, type: "select" })
              )(
                <Select mode="multiple" placeholder="请选择" showArrow={true} size="large" getPopupContainer={trigger => trigger.parentNode} onPopupScroll={this.popupScroll}>
                  {storeList.map(v => {
                    return <Option key={v.storeId}>{v.storeName}</Option>
                  })}
                </Select>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="手机号码"
            >
              {getFieldDecorator('phoneTem', validate('手机号', {
                required: true,
                type: 'phone',
                sole: true,
                model: 'Staff|Admin|Supervisor',
                _var: false,
                id: editItem.supervisorId,
              }))(
                <Input placeholder="请输入手机号码" size="large" maxLength={11}/>
              )}
            </FormItem>
            {type === "add" && (
              <FormItem {...formItemLayout} label="登录密码">
                {getFieldDecorator(
                  "pwd",
                  validate("密码", { required: true, type: "pwd" })
                )(<Input placeholder="请输入密码" size="large" />)}
              </FormItem>
            )}
            <FormItem {...formItemLayout} label="在职">
              {getFieldDecorator("statusTem", {
                valuePropName: 'checked',
                initialValue: true,
              })(
                <Switch />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="备注">
              {getFieldDecorator(
                "remark",
                validate("密码", { required: false, max: 200 })
              )(<TextArea style={{ width: "350px", height: "80px" }} placeholder="备注" />)}
            </FormItem>
            <FormItem {...formItemLayout} className={styles.marginL}>
              <Button size="large" className={styles.margin24} onClick={hideAdd}>
                取消
              </Button>
              <Button size="large" type="primary" onClick={this.publish.bind(this)}>
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
