import { Component } from "react"
import { Form, Modal, Input } from "antd"
import CommonTable from "../../../components/CommonTable/index"
import { connect } from "dva"
import services from "../../../services"
import validate from "../../../utils/validate"

const FormItem = Form.Item
const Tkbox = Form.create({
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
      const { validateFields, resetFields } = this.props.form
      const { hideModal, dispatch, type, editItem } = this.props
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
        if (type === "add") {
          services
            .insert({ data: values, keys: { name: "brand/unit" } })
            .then(res => {
              if (res.success) {
                hideModal()
                resetFields()
                dispatch({
                  type: "table/getData",
                  payload: "brand/unit",
                })
              }
            })
        } else {
          values.unitId = editItem.unitId
          services
            .update({ data: values, keys: { name: "brand/unit" } })
            .then(res => {
              if (res.success) {
                hideModal()
                resetFields()
                dispatch({
                  type: "table/getData",
                  payload: "brand/unit",
                })
              }
            })
        }
      })
    }

    render() {
      const { getFieldDecorator } = this.props.form
      const { visible, hideModal, type, editItem } = this.props
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
            className="unit-footer-button"
            title={type === "add" ? "新建单位" : "编辑单位"}
            visible={visible}
            onOk={this.handleSubmit.bind(this)}
            onCancel={hideModal}
            okText="发布"
            cancelText="取消"
          >
            <Form>
              <FormItem {...formItemLayout} label="单位名称">
                {getFieldDecorator(
                  "unitName",
                  validate("单位名称", {
                    required: true,
                    max: 30,
                    type: "string",
                    sole: true,
                    model: 'Unit',
                    _var: '0|1',
                    id: editItem.unitId,
                  })
                )(<Input placeholder="请输入单位名称" size="large" />)}
              </FormItem>
            </Form>
          </Modal>
        </div>
      )
    }
  }
)

class brandunit extends Component {
  state = {
    visible: false,
    type: "",
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
      dispatch({ type: "brandunit/edit", payload: {} })
      this.showModal()
      this.setState({
        type: "add",
      })
    }
    if (e === 11) {
      dispatch({ type: "brandunit/edit", payload: v })
      this.setState({
        type: "edit",
      })
      this.showModal()
    }
  }

  render() {
    const { dispatch, editItem } = this.props
    return (
      <div>
        <CommonTable name="brand/unit" onTableChange={this.onTableChange} />
        <Tkbox
          visible={this.state.visible}
          hideModal={this.hideModal.bind(this)}
          showModal={this.showModal}
          dispatch={dispatch}
          editItem={editItem}
          type={this.state.type}
        />
      </div>
    )
  }
}

function mapStateToProps(state) {
  const { editItem } = state.brandunit
  return { editItem }
}

export default connect(mapStateToProps)(brandunit)
