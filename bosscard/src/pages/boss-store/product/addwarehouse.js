import services from '../../../services'
import validate from '../../../utils/validate'
import { Form, Modal, Input, Checkbox, Icon, message } from "antd"
import { Component } from 'react'
import styles from "./styles.less"

const FormItem = Form.Item
const { TextArea } = Input
const Addwarehouse = Form.create()(
  class extends Component {
    state = {
      othervisible: false,
      istransfer: false,
      checked: false,
    }

    handleSubmit() {
      const { validateFields, resetFields } = this.props.form
      const { istransfer, checked } = this.state
      const { hideModal, tabledata } = this.props
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
        services.insert({ data: values, keys: { name: "store/warehouse" } }).then(res => {
          if (res.success) {
            hideModal(true)
            resetFields()
            this.setState({
              istransfer: false,
            })
          }
        })
      })
    }

    render() {
      const { getFieldDecorator } = this.props.form
      const { visible, hideModal, tabledata} = this.props
      const { addItem } = this.state
      const onChange = e => {
        if (tabledata.length === 0) {
          return message.warning("系统默认把第一个新建的仓库为默认仓库!")
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
            this.setState({addItem: values})
          } else {
            this.setState({checked: false})
          }
        })
      }
      const handleOk = () => {
        this.setState({
          othervisible: false,
          istransfer: true,
          checked: true,
        })
      }
      const handleCancel = () => {
        this.setState({
          othervisible: false,
          istransfer: false,
          checked: true,
        })
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
        if (tabledata.length === 0) {
          if (e.target.value.length > 0) {
            this.setState({checked: true})
          } else {
            this.setState({checked: false})
          }
        }
        this.setState({addItem: { ...addItem, warehouseName: e.target.value }})
      }
      const changeRemark = e => {
        this.setState({addItem: { ...addItem, remark: e.target.value }})
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
                    id: '',
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
                  <Checkbox checked={this.state.checked} onChange={onChange}>
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

export default Addwarehouse
