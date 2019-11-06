import { Component } from "react"
import { Button, message, Form, Input, Select, Radio, Cascader, Popover, Icon, Row, Col } from "antd"
import services from "../../../services"
import { allQueryArray } from "utils"
import validate from "../../../utils/validate"
import styles from "./styles.less"
import Tabbar from "components/Tabbar"

const FormItem = Form.Item
const { TextArea } = Input
const RadioGroup = Radio.Group
const Option = Select.Option

const Add = Form.create({
  mapPropsToFields(props) {
    //编辑操作,表单默认
    const { type, editItem, category, maintaintype } = props
    if (type === "edit") {
      let obj = {}
      editItem.categoryId = allQueryArray(
        category,
        editItem.categoryId,
        "categoryId"
      )
      editItem.maintainTypeId = allQueryArray(
        maintaintype,
        editItem.maintainTypeId,
        "maintainTypeId"
      )
      editItem.type  = editItem.type === 0 ? 2 : editItem.type
      Object.keys(editItem).map(v => {
        return (obj[v] = Form.createFormField({
          value: editItem[v] ? editItem[v] : "",
        }))
      })
      return obj
    }
  },
})(
  class extends Component {
    state = {
      loading: false,
      product_name: '',
      commodity_code: '',
    }
    publish() {
      this.setState({loading: true})
      const { dispatch, hideModal, type, editItem } = this.props
      const { validateFields } = this.props.form
      validateFields((err, values) => {
        if (err) {
          this.setState({loading: false})
          return
        }
        for (let i in values) {
          if (!values[i] && i !== 'type') {
            values[i] = ""
          }
        }
        if (values.type === 2) {
          values.type = 0
        }
        if (!values.accessoryProperties) {
          values.accessoryProperties = 0
        }
        values.categoryId = values.categoryId[values.categoryId.length - 1]
        values.maintainTypeId =
          values.maintainTypeId[values.maintainTypeId.length - 1]
        if (type === "add") {
          services.insert({ data: values, keys: { name: "brand/product" } }).then(res => {
            this.setState({loading: false})
            if (res.success) {
              message.success("添加成功!")
              dispatch({
                type: "table/getData",
                payload: "brand/product",
              })
              hideModal()
            } else {
              message.error(res.content)
            }
          })
        } else {
          values.productId = editItem.productId
          services.update({ data: values, keys: { name: "brand/product" } }).then(res => {
            this.setState({loading: false})
            if (res.success) {
              message.success("修改成功!")
              dispatch({
                type: "table/getData",
                payload: "brand/product",
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
      const { getFieldDecorator, getFieldValue  } = this.props.form
      const {
        hideModal,
        category,
        productUnit,
        editItem,
        type,
        maintaintype,
      } = this.props
      const handleChange = value => {
        console.log(`selected ${value}`)
      }
      const handleRadio = e => {
        console.log(`checked = ${e.target.checked}`)
      }
      const reviseCategory = type === 'edit' ? getFieldValue('categoryId') !== editItem.categoryId : false
      return (
        <div className="from-wrap-margin">
          <div>
            <div className={styles.brandhead}>
              <span></span>{type === "add" ? "新建产品" : "编辑产品"}
            </div>
            <div className={styles.centerDiv}>
              <Form>
                <Row gutter={196}>
                  <Col span={8} className={styles['form-style']}>
                    <FormItem label="产品名称">
                      {getFieldDecorator(
                        "productName",
                        validate("产品名称", {
                          required: true,
                          max: 30,
                          type: "string",
                          sole: true,
                          key: "name",
                          model: "Product",
                          id: editItem.productId,
                          _var: { '_': Number(localStorage.getItem('coiling')) === 1 ? '1|2' : 2, commodity_code: this.state.commodity_code},
                        })
                      )(
                        <Input
                          size="large"
                          placeholder="请输入产品名称"
                          onChange={(e) => {
                            this.setState({product_name: e.target.value}, () => {
                              this.props.form.validateFields(['commodityCode'],{force: true})
                            })
                          }}
                        />
                      )}
                    </FormItem>
                  </Col>

                  <Col span={8} className={styles['form-style']}>
                    <FormItem label="编码">
                      {getFieldDecorator(
                        "commodityCode",
                        validate("编码", {
                          required: false,
                          max: 30,
                          sole: true,
                          model: "Product",
                          id: editItem.productId,
                          _var:  { '_': Number(localStorage.getItem('coiling')) === 1 ? '1|2' : 2, product_name: this.state.product_name},
                        })
                      )(
                        <Input
                          className={styles.espInput138}
                          size="large"
                          placeholder="请输入编码"
                          onChange={(e) => {
                            this.setState({commodity_code: e.target.value}, () => {
                              this.props.form.validateFields(['productName'],{force: true})
                            })
                          }}
                        />
                      )}
                    </FormItem>
                  </Col>

                  <Col span={8} className={styles['form-style']}>
                    <FormItem label="产品类型">
                      {getFieldDecorator("type", {
                        initialValue: 1,
                        rules: [{ required: true, message: '请选择产品类型' }],
                      })(
                        <RadioGroup>
                          <Radio value={1}>自有产品</Radio>
                          <Radio value={2}>外采产品</Radio>
                        </RadioGroup>
                      )}
                    </FormItem>
                  </Col>

                  <Col span={8} className={styles['form-style']}>
                    <FormItem label="单位">
                      {getFieldDecorator(
                        "unitId",
                        validate("单位", { required: true, type: "select" })
                      )(
                        <Select placeholder="请选择" size="large">
                          {productUnit.map(v => {
                            return (
                              <Option key={v} value={v.unitId}>
                                {v.unitName}
                              </Option>
                            )
                          })}
                        </Select>
                      )}
                    </FormItem>
                  </Col>

                  <Col span={8} className={styles['form-style']}>
                    <FormItem label="所属分类" help={reviseCategory ? <span style={{color: '#ff6f28 '}}>注意：分类修改后，项目不再享有原分类折扣</span> : ''}>
                      {getFieldDecorator(
                        "categoryId",
                        validate("所属分类", { required: true })
                      )(
                        <Cascader
                          size="large"
                          placeholder="请选择分类"
                          options={category}
                          expandTrigger="hover"
                        />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={8} className={styles['form-style']}>
                    <FormItem label="业务类型">
                      <div className={styles.espInput350} style={{position:'relative'}}>
                        {getFieldDecorator(
                          "maintainTypeId",
                          validate("业务类型", { required: true })
                        )(
                          <Cascader
                            size="large"
                            placeholder="请选择业务类型"
                            options={maintaintype}
                            expandTrigger="hover"
                          />
                        )}
                        <span style={{position:'absolute',left:'65px', top: '-40px'}}>
                          <Popover
                            trigger="click"
                            content="总部内所有业务的板块分类。"
                            placement="bottom"
                          >
                            <Icon
                              style={{ color: "#4AACF7", marginLeft: "10px",fontSize: '16px' }}
                              type="question-circle"
                            />
                          </Popover>
                        </span>
                      </div>
                    </FormItem>
                  </Col>
                  <Col span={8} className={styles['form-style']}>
                    <FormItem label="配件属性">
                      <div className={styles.espInput350}>
                        {getFieldDecorator("accessoryProperties")(
                          <Select
                            initialValue=""
                            onChange={handleChange}
                            size="large"
                          >
                            <Option key="1" value={1}>
                              原厂
                            </Option>
                            <Option key="2" value={2}>
                              同质
                            </Option>
                            <Option key="3" value={3}>
                              修复
                            </Option>
                            <Option key="4" value={4}>
                              其他
                            </Option>
                          </Select>
                        )}
                      </div>
                    </FormItem>
                  </Col>
                  <Col span={8} className={styles['form-style']}>
                    <FormItem label="条形码">
                      {getFieldDecorator(
                        "barCodeNumber",
                        validate("条形码", {
                          required: false,
                          max: 30,
                          type: "number",
                          sole: true,
                          model: "Product",
                          id: editItem.productId,
                        })
                      )(
                        <Input
                          className={styles.espInput350}
                          size="large"
                          placeholder="请输入条形码"
                        />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={8} className={styles['form-style']}>
                    <FormItem label="型号">
                      {getFieldDecorator(
                        "modelTem",
                        validate("型号", { required: false, max: 30 })
                      )(
                        <Input
                          size="large"
                          className={styles.espInput138}
                          placeholder="请输入型号"
                        />
                      )}
                    </FormItem>
                  </Col>

                  <Col span={8} className={styles['form-style']}>
                    <FormItem label="状态">
                      {getFieldDecorator("statusTem", { initialValue: 1 })(
                        <RadioGroup name="statusTem" onChange={handleRadio}>
                          <Radio value={1}>启用</Radio>
                          <Radio value={2}>停用</Radio>
                        </RadioGroup>
                      )}
                    </FormItem>
                  </Col>

                  <Col span={8} className={styles['form-style']}>
                    <FormItem label="规格">
                      {getFieldDecorator(
                        "specificationTem",
                        validate("规格", { required: false, max: 30 })
                      )(
                        <Input
                          size="large"
                          className={styles.espInput138}
                          placeholder="请输入规格"
                        />
                      )}
                    </FormItem>
                  </Col>

                  <Col span={8} className={styles['form-style']}>
                    <FormItem label="备注">
                      {getFieldDecorator(
                        "remark",
                        validate("备注", { required: false, max: 200 })
                      )(
                        <TextArea
                          style={{
                            height: "80px",
                          }}
                          placeholder="请输入备注信息"
                        />
                      )}
                    </FormItem>
                  </Col>
                </Row>
              </Form>
            </div>
          </div>
          <Tabbar>
            <div className={styles.btnDiv}>
              <Button size='large' onClick={hideModal}>取消</Button>
              <Button type='primary' size='large' loading={this.state.loading} onClick={this.publish.bind(this)}>提交</Button>
            </div>
          </Tabbar>
        </div>
      )
    }
  }
)
export default Add
