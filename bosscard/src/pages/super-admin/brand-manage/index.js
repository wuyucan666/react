import { Form, Input, Select, Button, Checkbox, DatePicker, Row, Col, Radio } from "antd"
import { Component } from "react"
import { allQueryArray } from "utils"
import validate from "utils/validate"
import PropTypes from "prop-types"
import moment from 'moment'
import { connect } from "dva"
import CommonTable from "../../../components/CommonTable/index"
import services from "../../../services"
import styles from "./index.less"
import { message } from "antd/lib/index"
import Tabbar from "components/Tabbar"

const FormItem = Form.Item
const Option = Select.Option
const CheckboxGroup = Checkbox.Group
const RadioGroup = Radio.Group

const Tkbox = Form.create({
  mapPropsToFields(props) {
    //编辑操作,表单默认
    const { type, editItem, roleList } = props
    if (type === "edit") {
      let obj = {}
      editItem.categoryId = allQueryArray(
        roleList,
        editItem.categoryId,
        "categoryId"
      )
      editItem.expiredAt = editItem.expiredAt ? moment(editItem.expiredAt) : undefined
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
        values.expiredAt =  values.expiredAt ? moment(values.expiredAt).format('YYYY-MM-DD') : undefined
        values.roleId = editItem.roleId
        if (type === "add") {
          services
            .insert({ data: values, keys: { name: "admin/brand" } })
            .then(res => {
              if (res.success) {
                hideModal()
                resetFields()
                message.success("添加成功！")
                dispatch({
                  type: "table/getData",
                  payload: "admin/brand",
                })
              }
            })
        } else {
          values.brandId = editItem.brandId
          services
            .update({ data: values, keys: { name: "admin/brand" } })
            .then(res => {
              if (res.success) {
                hideModal()
                resetFields()
                message.success("修改成功！")
                dispatch({
                  type: "table/getData",
                  payload: "admin/brand",
                })
              }
            })
        }
      })
    }
    render() {
      const { getFieldDecorator } = this.props.form
      const { hideModal, type, permission, editItem } = this.props
      const pwdFun = () => {
        console.log(type)
        if (type === "edit") {
          return ""
        }
        return (
          <FormItem label="密码">
            {getFieldDecorator(
              "pwd",
              validate("密码", { required: true, type: "pwd" })
            )(
              <Input
                placeholder="输入密码"
                type="password"
                size="large"
              />
            )}
          </FormItem>
        )
      }
      return (
        <div className="from-wrap-margin">
          <p className={styles.title}>
            <span></span>{type === "edit" ? "编辑品牌商" : "新增品牌商"}
          </p>
          <div className={styles.centerDiv}>
            <Form>
              <Row gutter={196}>
                <Col span={8} className={styles['form-style']}>
                  <FormItem label="联系人">
                    {getFieldDecorator(
                      "userName",
                      validate("联系人", {
                        required: true,
                        max: 30,
                        type: "string",
                      })
                    )(
                      <Input
                        placeholder="输入联系人"
                        size="large"
                      />
                    )}
                  </FormItem>
                </Col>
                <Col span={8} className={styles['form-style']}>
                  <FormItem label="手机号">
                    {getFieldDecorator(
                      "phoneTem",
                      validate("手机号", {
                        required: true,
                        type: "phone" ,
                        sole: true,
                        model: 'Staff|Admin|Supervisor',
                        _var: false,
                        id: editItem.adminId,
                      })
                    )(
                      <Input
                        size="large"
                        maxLength={11}
                        placeholder="输入手机号"
                      />
                    )}
                  </FormItem>
                </Col>
                <Col span={8} className={styles['form-style']}>
                  {pwdFun()}
                </Col>
                <Col span={8} className={styles['form-style']}>
                  <Form.Item label="功能模块">
                    {getFieldDecorator('moduleIds',{
                      rules: [{required: true, message: '请选择功能模块'}],
                    })(
                      <CheckboxGroup options={permission}/>
                    )}
                  </Form.Item>
                </Col>
                <Col span={8} className={styles['form-style']}>
                  <FormItem label="品牌名字">
                    {getFieldDecorator(
                      "brandName",
                      validate("品牌名字", {
                        required: true,
                        max: 30,
                        type: "string",
                      })
                    )(
                      <Input
                        size="large"
                        placeholder="输入品牌名字"
                      />
                    )}
                  </FormItem>
                </Col>
                <Col span={8} className={styles['form-style']}>
                  <FormItem label="公司名">
                    {getFieldDecorator(
                      "companyTem",
                      validate("公司名", {
                        required: true,
                        max: 30,
                        type: "string",
                      })
                    )(
                      <Input
                        size="large"
                        placeholder="输入公司名"
                      />
                    )}
                </FormItem>
                </Col>
                <Col span={8} className={styles['form-style']}>
                  <FormItem label="地址">
                    {getFieldDecorator(
                      "addressTem",
                      validate("地址", { max: 30, type: "string" })
                    )(
                      <Input
                        size="large"
                        placeholder="输入地址"
                      />
                    )}
                  </FormItem>
                </Col>
                <Col span={8} className={styles['form-style']}>
                  <FormItem label="店铺数量">
                    {getFieldDecorator(
                      "storeNum",
                      validate("店铺数量", { max: 9, type: "integer" })
                    )(
                      <Input
                        size="large"
                        placeholder="输入店铺数量"
                      />
                    )}
                  </FormItem>
                </Col>
                <Col span={8} className={styles['form-style']}>
                  <FormItem label="有效期至">
                    {getFieldDecorator(
                      "expiredAt",
                    )(
                    <DatePicker size='large' style={{width: '100%'}}/>
                    )}
                  </FormItem>
                </Col>
                <Col span={8} className={styles['form-style']}>
                  <FormItem label="是否开启">
                    {getFieldDecorator("status",{initialValue: 1})(
                      <RadioGroup>
                        <Radio value={1}>是</Radio>
                        <Radio value={0}>否</Radio>
                      </RadioGroup>
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Tabbar>
                <div className={styles.btnDiv}>
                  <Button size='large' onClick={hideModal}>取消</Button>
                  <Button type='primary' size='large' onClick={this.handleSubmit.bind(this)}>提交</Button>
                </div>
              </Tabbar>
            </Form>
          </div>
        </div>
      )
    }
  }
)

class brandManage extends Component {
  state = {
    visible: false,
    type: "",
  }
  componentDidMount() {
    this.props.dispatch({ type: "brandManage/getRole" })
    this.props.dispatch({ type: "brandManage/getPermission" })
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
  handleChange = v => {
    console.log(v, 9999999)
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
      dispatch({ type: "brandManage/edit", payload: v })
      this.showModal()
      this.setState({
        type: "edit",
      })
    }
  }

  render() {
    const { dispatch, editItem, roleList, unitList, permission } = this.props
      return (
        <div>
          <div style={{ display: this.state.visible ? 'none' : '' }}>
            <CommonTable
              name="admin/brand"
              refresh
              onTableChange={this.onTableChange}
            >
              <div className={styles.tool}>
                <div className={styles["tool-item"]}>
                  项目状态
                <Select
                    size="large"
                    className={styles.sel}
                    style={{ width: 220 }}
                    onChange={this.handleChange}
                  >
                    <Option value="jack">Jack</Option>
                    <Option value="lucy">Lucy</Option>
                    <Option value="disabled" disabled>
                      Disabled
                  </Option>
                    <Option value="Yiminghe">yiminghe</Option>
                  </Select>
                </div>
                <div className={styles["tool-item"]}>
                  项目分类
                <Select
                    size="large"
                    className={styles.sel}
                    style={{ width: 220 }}
                    onChange={this.handleChange}
                  >
                    <Option value="jack">Jack</Option>
                    <Option value="lucy">Lucy</Option>
                    <Option value="disabled">Disabled</Option>
                    <Option value="Yiminghe">yiminghe</Option>
                  </Select>
                </div>
                <div className={styles["tool-item"]}>
                  <Button type="primary" size="large" onClick={this.handleOk}>
                    查询
                </Button>
                </div>
              </div>
            </CommonTable>
          </div>
          {this.state.visible&&<Tkbox
            visible={this.state.visible}
            hideModal={this.hideModal.bind(this)}
            showModal={this.showModal}
            dispatch={dispatch}
            editItem={editItem}
            roleList={roleList}
            unitList={unitList}
            permission={permission}
            type={this.state.type}
          />}
        </div>
      )
  }
}

brandManage.propTypes = {
  dispatch: PropTypes.func,
}

function mapStateToProps(state) {
  const { editItem, roleList, unitList, permission } = state.brandManage
  return { editItem, roleList, unitList, permission }
}

export default connect(mapStateToProps)(brandManage)
