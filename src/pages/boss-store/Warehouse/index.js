import { Component } from "react"
import { Form, Modal, Input, Checkbox, Icon, message } from "antd"
import CommonTable from "../../../components/CommonTable/index"
import { connect } from "dva"
import services from "../../../services"
import validate from "../../../utils/validate"
import styles from "./index.less"
import tableConfig from "./tableConfig"

const FormItem = Form.Item
const { TextArea } = Input

const Tkbox = Form.create({
  mapPropsToFields(props) {
    //编辑操作,表单默认
    const { type, editItem, addItem } = props
    if (type === "edit") {
      let obj = {}
      Object.keys(editItem).map(v => {
        return (obj[v] = Form.createFormField({
          value: editItem[v],
        }))
      })
      return obj
    } else if (type === "adds") {
      let obj = {}
      Object.keys(addItem).map(v => {
        return (obj[v] = Form.createFormField({
          value: addItem[v],
        }))
      })
      return obj
    }
  },
})(
  class extends Component {
    state = {
      othervisible: false,
      istransfer: false,
    };
    handleSubmit() {
      const { validateFields, resetFields } = this.props.form
      const { istransfer } = this.state
      const { hideModal, dispatch, type, editItem, checked, tabledata } = this.props
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
        if (type === "adds") {
          if (checked) {
            values.isDefaultWarehouse = 1
            if (tabledata.length === 0) {
              values.replaceDefault = 1
            } else {
              if (istransfer) {
                values.replaceDefault = 1
              } else {
                values.replaceDefault = 0
              }
            }

          } else {
            values.isDefaultWarehouse = 0
            values.replaceDefault = 0
          }
          services
            .insert({ data: values, keys: { name: "store/warehouse" } })
            .then(res => {
              if (res.success) {
                hideModal()
                resetFields()
                this.setState({
                  istransfer: false,
                })
                dispatch({
                  type: "table/getData",
                  payload: "store/warehouse",
                })
              }
            })
        } else {
          values.warehouseId = editItem.warehouseId
          if (checked) {
            values.isDefaultWarehouse = 1
            if (istransfer) {
              values.replaceDefault = 1
            } else {
              values.replaceDefault = 0
            }
          } else {
            values.isDefaultWarehouse = 0
            values.replaceDefault = 0
          }
          services
            .update({ data: values, keys: { name: "store/warehouse" } })
            .then(res => {
              if (res.success) {
                hideModal()
                resetFields()
                this.setState({
                  istransfer: false,
                })
                dispatch({
                  type: "table/getData",
                  payload: "store/warehouse",
                })
              }
            })
        }
      })
    }

    render() {
      const { getFieldDecorator } = this.props.form
      const {
        visible,
        hideModal,
        editItem,
        goChange,
        checked,
        dispatch,
        type,
        addItem,
        tabledata,
      } = this.props
      const onChange = e => {
        if (type === 'edit') {
          if (tabledata.length === 1) {
            return message.warning("只有一个仓库，系统把该仓库为默认仓库!")
          }
        }
        if (type === 'adds') {
          if (tabledata.length === 0) {
            return message.warning("系统默认把第一个新建的仓库为默认仓库!")
          }
        }
        const { validateFields } = this.props.form
        validateFields((err, values) => {
          if (err) {
            return
          }
          if (e.target.checked === true) {
            this.setState({
              othervisible: true,
            })
            dispatch({
              type: "warehouse/addData",
              payload: { addItem: values, type: type },
            })
          } else {
            goChange(false)
          }
        })
      }
      const handleOk = () => {
        this.setState({
          othervisible: false,
          istransfer: true,
        })
        goChange(true)
      }
      const handleCancel = () => {
        this.setState({
          othervisible: false,
          istransfer: false,
        })
        goChange(true)
      }
      const formItemLayout = {
        labelCol: {
          xs: { span: 25 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 25 },
          sm: { span: 5 },
        },
      }
      const changeName = e => {
        if (type === "edit") {
          dispatch({
            type: "warehouse/edit",
            payload: {
              editItem: { ...editItem, warehouseName: e.target.value },
              type: type,
            },
          })
        } else {
          if (tabledata.length === 0) {
            if (e.target.value.length > 0) {
              goChange(true)
            } else {
              goChange(false)
            }
          }
          dispatch({
            type: "warehouse/addData",
            payload: {
              addItem: { ...addItem, warehouseName: e.target.value },
              type: type,
            },
          })
        }
      }
      const changeRemark = e => {
        if (type === "edit") {
          dispatch({
            type: "warehouse/edit",
            payload: {
              editItem: { ...editItem, remark: e.target.value },
              type: type,
            },
          })
        } else {
          dispatch({
            type: "warehouse/addData",
            payload: {
              addItem: { ...addItem, remark: e.target.value },
              type: type,
            },
          })
        }
      }
      return (
        <div>
          <Modal
            title="新建仓库"
            className="warehouse-footer-button"
            visible={visible}
            onOk={this.handleSubmit.bind(this)}
            onCancel={hideModal}
            okText="发布"
            cancelText="取消"
          >
            <Form className="from-wrap-margin">
              <FormItem {...formItemLayout} label="仓库名称">
                {getFieldDecorator(
                  "warehouseName",
                  validate("仓库名称", {
                    required: true,
                    max: 30,
                    type: "string",
                    sole: true,
                    model: "Warehouse",
                    id: editItem.warehouseId,
                  })
                )(
                  <Input
                    placeholder="请输入仓库名称"
                    onChange={changeName}
                    style={{ width: "350px", maxWidth: "350px" }}
                    size="large"
                  />
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="备注">
                {getFieldDecorator("remark", {
                  ...validate("备注", { required: false, max: 200 }),
                })(
                  <TextArea
                    style={{
                      width: "350px",
                      height: "80px",
                      maxWidth: "350px",
                    }}
                    onChange={changeRemark}
                    className="inputwidth"
                    placeholder="备注"
                  />
                )}
              </FormItem>
              <FormItem className="from-wrap-remark">
                <div className={styles.checkDiv}>
                  <Checkbox checked={checked} onChange={onChange}>
                    设置默认仓库
                  </Checkbox>
                </div>
              </FormItem>
            </Form>
          </Modal>
          <Modal
            title="设置提醒"
            visible={this.state.othervisible}
            onOk={handleOk}
            onCancel={handleCancel}
            cancelText="否"
            okText="是"
          >
            <p>
              <Icon type="exclamation-circle-o" className={styles.ico} />
              <span className={styles.classP}>
                是否将之前默认仓库中的所有产品移至当前仓库？
              </span>
            </p>
          </Modal>
        </div>
      )
    }
  }
)

class warehouse extends Component {
  state = {
    visible: false,
    checked: false,
  }

  showModal = () => {
    this.setState({
      visible: true,
      checked: false,
    })
  }

  hideModal = () => {
    this.setState({
      visible: false,
    })
  }
  goChange = e => {
    this.setState({
      checked: e,
    })
  }
  onTableChange = (e, v) => {
    const { dispatch } = this.props
    if (e === 217) {
      dispatch({
        type: "warehouse/edit",
        payload: { editItem: {}, type: "add" },
      })
      this.showModal()
      dispatch({
        type: "warehouse/addData",
        payload: { addItem: { warehouseName: "", remark: "" }, type: "adds" },
      })
    }
    if (e === 11) {
      dispatch({
        type: "warehouse/edit",
        payload: { editItem: v, type: "edit" },
      })

      setTimeout(() => {
        const { editItem } = this.props
        this.setState({
          checked: editItem.isDefaultWarehouse === 1 ? true : false,
        })
      }, 500)
      this.showModal()
    }
  };
  render() {
    const { dispatch, editItem, type, addItem, tabledata } = this.props
    return (
      <div>
        <CommonTable
          name="store/warehouse"
          onTableChange={this.onTableChange}
          tableConfig={tableConfig}
        />
        <Tkbox
          visible={this.state.visible}
          hideModal={this.hideModal.bind(this)}
          showModal={this.showModal}
          dispatch={dispatch}
          editItem={editItem}
          type={type}
          addItem={addItem}
          goChange={this.goChange}
          checked={this.state.checked}
          tabledata={tabledata}
        />
      </div>
    )
  }
}

function mapStateToProps(state) {
  const { editItem, type, addItem } = state.warehouse
  const tabledata = state.table.data
  return { editItem, type, addItem, tabledata }
}

export default connect(mapStateToProps)(warehouse)
