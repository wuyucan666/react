import { Component } from "react"
import { Form, Input, Select, Button, Radio, Cascader, Row, Col, Icon } from "antd"
import { allQueryArray } from "utils"
import services from "../../../services"
import styles from "./shop.less"
import Modal from './modal'
import { message } from "antd/lib/index"
import validate from "utils/validate"
import Tabbar from "components/Tabbar"

const FormItem = Form.Item
const Option = Select.Option
const RadioGroup = Radio.Group

export default Form.create({
  mapPropsToFields(props) {
    //编辑操作,表单默认
    const { type, editItem, areaList, roleList } = props
    if (type === "edit") {
      let obj = {}
      editItem.areaId = allQueryArray(areaList, editItem.areaId, "areaId")
      editItem.roleId = roleList.findIndex(item => item.id === editItem.roleId) > -1 ? editItem.roleId : undefined,
      Object.keys(editItem).map((v) => {
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
      btnLoading: false,
      createModal: false,
      type: 'add',
      formData: {},
      listType: [],
    }
    handleSubmit() {
      this.setState({
        btnLoading: true,
      })
      const { validateFields, resetFields } = this.props.form
      const { hideModal, dispatch, type, editItem } = this.props
      validateFields((err, values) => {
        if (err) {
          this.setState({
            btnLoading: false,
          })
          return
        }
        Object.keys(values).map((key) => {
          if (!values[key]) {
            values[key] = ""
          }
          return true
        })
        if (type === "add") {
          values.areaId = values.areaId[values.areaId.length - 1]
          services
            .insert({ data: values, keys: { name: "brand/store" } })
            .then((res) => {
              this.setState({
                btnLoading: false,
              })
              if (res.success) {
                hideModal()
                resetFields()
                message.success("添加成功！")

                dispatch({
                  type: "table/getData",
                  payload: "brand/store",
                })
              } else {
                message.error(res.content)
              }
            })
        } else {
          values.adminId = editItem.adminId
          values.areaId = values.areaId[values.areaId.length - 1]
          services
            .update({ data: values, keys: { name: "brand/store" } })
            .then((res) => {
              this.setState({
                btnLoading: false,
              })
              if (res.success) {
                hideModal()
                resetFields()
                message.success("修改成功！")
                dispatch({
                  type: "table/getData",
                  payload: "brand/store",
                })
              } else {
                message.error(res.content)
              }
            })
        }
      })
    }
    componentDidMount() {
      this.getStoreType()
    }
    // 获取门店类型
    getStoreType=()=> {
      services.list({keys: { name: "brand/storetype" }}).then((res) => {
        let listType = [...res.list]
        this.setState({listType})
      })
    }

    displayRender(label) {
      return label[label.length - 1]
    }
    // 新增门店类型
    addstoreType=()=> {
      this.setState({createModal: true})
    }

    createModalsuccess=(noCleandata)=> {
      if(noCleandata){
         this.setState({createModal: false})
      }else{
        this.setState({createModal: false})
        this.getStoreType()
      }
    }

    render() {
      const { getFieldDecorator } = this.props.form
      const {
        hideModal,
        areaList,
        roleList,
        editItem,
      } = this.props
      const {listType} = this.state
      return (
        <div>
          <div className={styles.centerDiv}>
            <p className={styles.title}>
              <span></span>基本信息
            </p>
            <Form className="from-wrap-margin">
              {/* <div className={styles.boundary}>基本信息 </div> */}
              <Row gutter={196}>
                <Col span={8} className={styles['form-style']}>
                  <FormItem label="门店名称">
                    {getFieldDecorator(
                      "storeName",
                      validate("门店名称", {
                        required: true,
                        type: "string",
                        max: 30,
                        sole: true,
                        model: "Store",
                        id: editItem.storeId,
                      })
                    )(
                      <Input
                        placeholder="输入门店名称"
                        refs="storeName"
                        size="large"
                      />
                    )}
                  </FormItem>
                </Col>
                <Col span={8} className={styles['form-style']}>
                  <div className={styles['form-style-add']}>
                    <div>
                      <FormItem label="门店类型">
                        {getFieldDecorator(
                          "storeTypeId",
                          validate("门店名称", { required: true, type: "select" })
                        )(
                          <Select placeholder="请选择门店类型" size="large">
                            {listType.map((v) => {
                              return (
                                <Option key={v} value={v.storeTypeId}>
                                  {v.storeTitle}
                                </Option>
                              )
                            })}
                          </Select>
                      )}
                    </FormItem>
                    </div>
                    <div className={styles['form-style-add-btn']} onClick={this.addstoreType}><Icon type="plus" /></div>
                  </div>
                </Col>
                <Col span={8} className={styles['form-style']}>
                  <FormItem label="门店区域">
                    {getFieldDecorator(
                      "areaId",
                      validate("门店区域", { required: true, type: "select" })
                    )(
                      <Cascader
                        placeholder="请选择门店区域"
                        options={areaList}
                        expandTrigger="hover"
                        size="large"
                      />
                    )}
                  </FormItem>
                </Col>
                <Col span={8} className={styles['form-style']}>
                  <FormItem label="门店编号">
                    {getFieldDecorator(
                      "storeNo",
                      validate("门店编号", {
                        required: true,
                        type: "string",//integer
                        max: 30,
                        sole: true,
                        key: "storeNumber",
                        model: "Store",
                        id: editItem.storeId,
                      })
                    )(
                      <Input
                        placeholder="输入门店编号"
                        size="large"
                      />
                    )}
                  </FormItem>
                </Col>
                <Col span={8} className={styles['form-style']}>
                  <FormItem label="门店地址">
                    {getFieldDecorator(
                      "storeAdd",
                      validate("门店地址", {
                        required: true,
                        type: "string",
                        max: 100,
                      })
                    )(
                      <Input
                        placeholder="输入门店地址"
                        size="large"
                      />
                    )}
                  </FormItem>
                </Col>
                <Col span={8} className={styles['form-style']}>
                  <FormItem label="经营者姓名">
                    {getFieldDecorator(
                      "operator",
                      validate("经营者姓名", {
                        required: true,
                        type: "string",
                        max: 30,
                      })
                    )(
                      <Input
                        placeholder="输入经营者姓名"
                        size="large"
                      />
                    )}
                  </FormItem>
                </Col>
                <Col span={8} className={styles['form-style']}>
                  <FormItem label="经营者手机（默认为门店超级管理员账号）">
                    {getFieldDecorator(
                      "phoneTem",
                      validate("经营者手机", {
                        required: true,
                        type: "phone",
                        sole: true,
                        model: "Staff|Admin|Supervisor",
                        _var: false,
                        id: editItem.adminId,
                      })
                    )(
                      <Input
                        placeholder="输入经营者手机"
                        size="large"
                        maxLength={11}
                      />
                    )}
                  </FormItem>
                </Col>

                {this.props.type === "edit" ? '' : <Col span={8} className={styles['form-style']}>
                  <FormItem label="账号登录密码">
                    {getFieldDecorator(
                      "password",
                      validate("账号登录密码", { required: true, type: "loginpwd" })
                    )(
                      <Input
                        placeholder="账号登录密码"
                        size="large"
                      />
                    )}
                  </FormItem>
                </Col>}

                <Col span={8} className={styles['form-style']}>
                  <FormItem label="座机电话">
                    {getFieldDecorator(
                      "storeTel",
                      validate("座机电话", { type: "tel" })
                    )(
                      <Input
                        placeholder="输入座机电话"
                        size="large"
                      />
                    )}
                  </FormItem>
                </Col>

                <Col span={8} className={styles['form-style']}>
                  <FormItem label="权限角色">
                    {getFieldDecorator(
                      "roleId",
                      validate("权限角色", { required: true, type: "select" })
                    )(
                      <Select placeholder="请选择权限角色" size="large">
                        {roleList.map((v) => {
                          return (
                            <Option key={v} value={v.id}>
                              {v.name}
                            </Option>
                          )
                        })}
                      </Select>
                    )}
                  </FormItem>
                </Col>
                
              </Row>
              <p className={styles.title}>
                <span></span>门店配置
              </p>
              <Row gutter={196}>
                <Col span={8} className={styles['form-style']}>
                  <FormItem label="是否开启门店">
                    {getFieldDecorator("work", { initialValue: 1 })(
                      <RadioGroup size="large">
                        <Radio value={1}>开启</Radio>
                        <Radio value={2}>关闭</Radio>
                      </RadioGroup>
                    )}
                  </FormItem>
                </Col>
                <Col span={8} className={styles['form-style']}>
                  <FormItem label="是否联网">
                    {getFieldDecorator("currency", { initialValue: 2 })(
                      <RadioGroup size="large">
                        <Radio value={1}>是</Radio>
                        <Radio value={2}>否</Radio>
                      </RadioGroup>
                    )}
                  </FormItem>
                </Col>
                <Col span={8} className={styles['form-style']}>
                  <FormItem label="纳入总部管理">
                    {getFieldDecorator("see", { initialValue: 1 })(
                      <RadioGroup size="large">
                        <Radio value={1}>是</Radio>
                        <Radio value={2}>否</Radio>
                      </RadioGroup>
                    )}
                  </FormItem>
                </Col>
                <Col span={8} className={styles['form-style']}>
                  <FormItem label="测试状态">
                    {getFieldDecorator("test", { initialValue: 1 })(
                      <RadioGroup size="large">
                        <Radio value={1}>开启</Radio>
                        <Radio value={2}>关闭</Radio>
                      </RadioGroup>
                    )}
                  </FormItem>
                </Col>
                <Col span={8} className={styles['form-style']}>
                  <FormItem label="是否继承">
                    {getFieldDecorator("coiling", { initialValue: 1 })(
                      <RadioGroup size="large" disabled={this.props.type === 'edit' ? true : false}>
                        <Radio value={1}>继承</Radio>
                        <Radio value={2}>复制</Radio>
                        <Radio value={3}>关闭</Radio>
                      </RadioGroup>
                    )}
                  </FormItem>
                </Col>
                <Col span={8} className={styles['form-style']}>
                  <FormItem label="门店服务分类管理">
                    {getFieldDecorator("category", { initialValue: 1 })(
                      <RadioGroup size="large">
                        <Radio value={1}>仅可查看</Radio>
                        <Radio value={2}>可查看、新建、编辑、删除</Radio>
                      </RadioGroup>
                    )}
                  </FormItem>
                </Col>
              </Row>
              <FormItem label="备注">
                    {getFieldDecorator(
                      "remark",
                      validate("备注", {
                        required: false,
                        max: 200,
                      })
                    )(
                      <Input
                        placeholder="备注"
                        size="large"
                      />
                    )}
                  </FormItem>
            </Form>
          </div>
          <Tabbar>
            <div className={styles.btnDiv}>
              <Button size='large' onClick={hideModal}>取消</Button>
              <Button type='primary' size='large' loading={this.state.btnLoading} onClick={this.handleSubmit.bind(this)}>提交</Button>
            </div>
          </Tabbar>
          <Modal formData={this.state.formData} btnLoading={this.state.btnLoading} setBtnLoading={payload => this.setState({btnLoading: payload})} type={this.state.type} show={this.state.createModal} success={this.createModalsuccess}></Modal>
        </div>
      )
    }
  }
)
