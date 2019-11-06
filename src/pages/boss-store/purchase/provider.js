import React, { Component } from 'react'
import { Form, Select, Input, message, Modal } from 'antd'
import styles from './style.less'
import validate from "../../../utils/validate"
import services from 'services'
const FormItem = Form.Item
const Option = Select.Option

class Provider extends Component {
  static defaultProps = {
    visible: true,
  }
  constructor(props) {
    super(props)
    this.state = {
      selectPro: {},
      selectVisible: true,
      visible: null,
    }

    console.log('super', props.visible)
  }
  showModal() {
    this.setState({
      visible: true,
    })
  }
  hideModal() {
    this.setState({
      visible: false,
    })
    this.props.form.resetFields()
    this.props.hide()
  }
  componentWillReceiveProps(nextprops) {
    // console.log('visi',pre.visible,this.state.visible)

    if (nextprops.visible !== this.state.visible) {
      console.log(nextprops.visible)
      this.setState({
        visible: nextprops.visible,
      })
    }

  }
  addPrivider() {
    console.log('prosp', this.props)
    this.props.form.validateFields((err, values) => {
      // let obj={}
      // obj.persionInChargeName=values.persionInChargeName
      // obj.businessTelephone=values.businessPhone
      // obj.settlementMethod=values.settlementMethod
      // obj.supplierName=values.supplierName
      // console.log('obj',obj)
      if (err) {
        return
      }
      if (!values.sortTem) {
        values.sortTem = 0
      }
      if (!values.businessTelephone) {
        values.businessTelephone = 0
      }
      values.reconciliationDate = ""
      services
        .insert({ data: values, keys: { name: "store/supplier" } })
        .then(res => {
          if (res.code === '0') {
            message.success("添加成功!")
            this.props.provider()
            this.props.form.resetFields()
            console.log("okkla")
            // dispatch({
            //   type: "table/getData",
            //   payload: "store/supplier",
            // })
            this.hideModal()
          } else {

          }
        })
    })
  }
  settlementMethod(v) {
    console.log('v', v)
  }
  render() {
    const { getFieldDecorator } = this.props.form
    // rowSelection object indicates the need for row selection
    const visible = this.state.visible !== null ? this.state.visible : this.props.visible
    const formItemLayout = {
      labelCol: {
        sm: { span: 6 },
      },
      wrapperCol: {
        sm: { span: 16 },
      },
    }
    return (
      <Modal
        title="新建供应商"
        visible={visible}
        onOk={this.addPrivider.bind(this)}
        onCancel={this.hideModal.bind(this)}
      >
        <div>
          <FormItem {...formItemLayout} label="供应商名称">
            {getFieldDecorator(
              "supplierName",
              validate("供应商名称", {
                required: true,
                max: 30,
                type: "string",
                sole: true,
                model: "Supplier",
              })
            )(
              <Input
                className={styles.espInput350}
                placeholder="请输入供应商名称"
                size="large"
              // onBlur={async () => {
              //   if (!getFieldError("supplierName")) {
              //     if (
              //       type === "edit" &&
              //       editItem.supplierName ===
              //         getFieldValue("supplierName")
              //     ) {
              //       return false
              //     }
              //     const { code } = await services.validate({
              //       keys: { name: "store/supplier" },
              //       data: {
              //         field: "supplierName",
              //         supplierName: getFieldValue("supplierName"),
              //       },
              //     })
              //     if (code !== 0) {
              //       this.props.form.setFields({
              //         supplierName: {
              //           errors: [new Error("此供应商名称已使用")],
              //         },
              //       })
              //     }
              //   }
              // }}
              />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="联系人">
            {getFieldDecorator(
              "persionInChargeName",
              validate("联系人", {
                required: true,
                max: 30,
                type: "string",
              })
            )(
              <Input
                className={styles.espInput350}
                placeholder="请输入联系人"
                size="large"
              />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="业务手机">
            {getFieldDecorator(
              "businessPhone", {
                ...validate("手机号", {
                  required: true,
                  type: "phone",
                  max: 11,
                  sole: true,
                  model: 'Supplier',
                }),
              }
            )(
              <Input
                className={styles.espInput350}
                placeholder="请输入业务手机"
                size="large"
              />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="结算方式">
            <div className={styles.espInput350}>
              {getFieldDecorator(
                "settlementMethod",
                validate("结算方式", { required: true })
              )(
                <Select style={{ width: '100%', height: '40px' }} initialValue="" onChange={this.settlementMethod.bind(this)}>
                  <Option value={1}>月结</Option>
                  <Option value={2}>签单</Option>
                </Select>
              )}
            </div>
          </FormItem>
        </div>
      </Modal>
    )
  }
}
export default Form.create()(Provider)
