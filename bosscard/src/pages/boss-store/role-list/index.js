import { Component } from "react"
import { Form, Input, Button, Radio } from "antd"
import CommonTable from "../../../components/CommonTable/index"
import { connect } from "dva"
import services from "../../../services"
import Per from "./per"
import validate from "../../../utils/validate"
import styles from "./styles.less"

const FormItem = Form.Item
const { TextArea } = Input
const RadioGroup = Radio.Group

const Newrole = Form.create({
  mapPropsToFields(props) {
    //编辑操作,表单默认
    const { type, editItem } = props
    if (type === "edit") {
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
      const { validateFields, resetFields, setFields } = this.props.form
      const { hideModal, dispatch, type, editItem } = this.props
      validateFields((err, values) => {
        if (err) {
          return
        }
        const fun = () => {
          Object.keys(values).map(key => {
            if (!values[key]) {
              values[key] = ""
            }
            return true
          })
          if (type === "add") {
            services
              .insert({ data: values, keys: { name: "store/role" } })
              .then(res => {
                if (res.success) {
                  hideModal()
                  resetFields()
                  dispatch({
                    type: "table/getData",
                    payload: "admin/role",
                  })
                }
              })
          } else {
            values.roleId = editItem.roleId
            services
              .update({ data: values, keys: { name: "store/role" } })
              .then(res => {
                if (res.success) {
                  hideModal()
                  resetFields()
                  dispatch({
                    type: "table/getData",
                    payload: "admin/role",
                  })
                }
              })
          }
        }
        const errorFun = () => {
          setFields({
            roleName: {
              value: values.roleName,
              errors: [new Error(`${values.roleType === 1 ? '品牌商' : '门店'}下此角色名称已使用！`)],
            },
          })
        }
        const data = {
          key: 'roleName',
          value: values.roleName,
          model: 'AuthRole',
          _var: {
            _: Number(localStorage.getItem('coiling')) === 1 ? '1|2' : 2,
            role_type: values.roleType,
          },
        }
        // 校验字段唯一
        if (editItem.roleId) {
          services.validateEdit({ keys: { id: editItem.roleId }, data }).then(res => {
            if (res.code !== 0) {
              errorFun()
            } else {
              fun()
            }
          })
        } else {
          services.validate({ data }).then(res => {
            if (res.code !== 0) {
              errorFun()
            } else {
              fun()
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
      const { visible, hideModal, type } = this.props
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
        <div className="from-wrap-margin">
          <div className={styles.brandhead}>
            {type === "add" ? "新建角色" : "编辑角色"}
          </div>
          <div className={styles.centerDiv} visible={visible}>
            <Form>
              <FormItem {...formItemLayout} label="角色名称">
                {getFieldDecorator(
                  "roleName",
                  validate("角色名称", {
                    required: true,
                    max: 30,
                    type: "string",
                    // sole: true,
                    // model: 'AuthRole',
                    // _var: {
                    //   _: parseInt(localStorage.getItem('loginType') - 1,0),
                    //   role_type: 2,
                    // },
                    // id: editItem.roleId,
                  })
                )(
                  <Input
                    className={styles.espInput350}
                    size="large"
                    placeholder="请输入角色名称"
                  // onBlur={async () => {
                  //   if (!getFieldError("roleName")) {
                  //     if (
                  //       type === "edit" &&
                  //       editItem.roleName === getFieldValue("roleName")
                  //     ) {
                  //       return false
                  //     }
                  //     const { code } = await services.validate({
                  //       keys: { name: "store/role" },
                  //       data: {
                  //         field: "roleName",
                  //         roleName: getFieldValue("roleName"),
                  //       },
                  //     })
                  //     if (code !== 0) {
                  //       this.props.form.setFields({
                  //         roleName: {
                  //           errors: [new Error("此角色名称已使用")],
                  //         },
                  //       })
                  //     }
                  //   }
                  // }}
                  />
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="角色类型">
                {getFieldDecorator(
                  "roleType",
                  validate("角色类型", { required: true, type: 'select' })
                )(
                  <RadioGroup name="roleType">
                    <Radio value={1} disabled>
                      品牌商
                    </Radio>
                    <Radio value={2}>门店</Radio>
                  </RadioGroup>
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="备注">
                {getFieldDecorator(
                  "remark",
                  validate("备注", { required: false, max: 200 })
                )(
                  <TextArea
                    style={{ width: "350px", height: "80px" }}
                    placeholder="请输入备注信息"
                  />
                )}
              </FormItem>
            </Form>
            <div className={styles.btnDiv}>
              <Button
                type="primary"
                onClick={this.handleSubmit.bind(this)}
                size="large"
              >
                发布
              </Button>
              <Button onClick={hideModal} size="large">
                取消
              </Button>
            </div>
          </div>
        </div>
      )
    }
  }
)

class roleList extends Component {
  state = {
    visible: false,
    type: "",
    roleId: 0,
  }

  showModal = () => {
    this.setState({
      visible: true,
    })
  }

  hideModal = () => {
    this.setState({
      visible: false,
    })
  }

  onTableChange = (e, v) => {
    const { dispatch } = this.props
    if (e === 217) {
      this.showModal()
      this.setState({
        type: "add",
      })
    }
    if (e === 11) {
      dispatch({ type: "store/roleList/edit", payload: v })
      this.setState({
        type: "edit",
      })
      this.showModal()
    }
    if (e === 12) {
      this.setState({
        roleId: v.roleId,
      })
      dispatch({ type: "store/roleList/setPerModalStatus", payload: true })
    }
  }

  render() {
    const { dispatch, editItem } = this.props
    return (
      <div>
        {this.state.visible&&(
          <Newrole
            hideModal={this.hideModal.bind(this)}
            showModal={this.showModal}
            dispatch={dispatch}
            editItem={editItem}
            type={this.state.type}
          />
        )}
        <div style={{display:this.state.visible?'none':''}}><CommonTable name="store/role" onTableChange={this.onTableChange} /></div>
        {this.props.perModalStatus ? <Per roleId={this.state.roleId} /> : ""}
      </div>
    )
  }
}

function mapStateToProps(state) {
  const { editItem, perModalStatus } = state["store/roleList"]
  return { editItem, perModalStatus }
}

export default connect(mapStateToProps)(roleList)
