import { Component } from "react"
import router from "umi/router"
import { Button, message, Form, Input, Select, Cascader, Radio, Popover, Icon, Tooltip, Row, Col } from "antd"
import services from "../../../services"
import validate from "../../../utils/validate"
import Tabbar from "components/Tabbar"
import styles from "./shop.less"
import { allQueryArray } from "utils"

const FormItem = Form.Item
const { TextArea } = Input
const Option = Select.Option
const RadioGroup = Radio.Group
const Add = Form.create({
  mapPropsToFields(props) {
    //编辑操作,表单默认
    const { type, editItem, projectList, maintaintype } = props
    if (type === "edit") {
      let obj = {}
      editItem.categoryId = allQueryArray(
        projectList,
        editItem.categoryId,
        "categoryId"
      )
      editItem.maintainTypeId = allQueryArray(
        maintaintype,
        editItem.maintainTypeId,
        "maintainTypeId"
      )
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
    constructor(props) {
      super(props)
      this.state = {
        loading: false,
      }
    }
    goMaintain = () => {
      const { dispatch, backRoute } = this.props
      setTimeout(() => {
        router.push({ pathname: backRoute })
      }, 300)
      dispatch({
        type: "app/changeStatus",
        payload: { key: "isAdding", value: false },
      })
      dispatch({
        type: "app/changeStatus",
        payload: { key: "isdone", value: true },
      })
    }

    handleSubmit() {
      this.setState({ loading: true })
      const { validateFields, resetFields } = this.props.form
      const { hideModal, dispatch, type, editItem, isAdding, setNotPrice } = this.props
      validateFields((err, values) => {
        if (err) {
          this.setState({ loading: false })
          return
        }
        values.priceTem = values.priceTem ? values.priceTem : 0
        values.costTem = values.costTem ? values.costTem : 0
        Object.keys(values).map(key => {
          if (!values[key] && key !== "statusTem") {
            values[key] = ""
          }
          return true
        })
        values.categoryId = values.categoryId ? values.categoryId[values.categoryId.length - 1] : 0
        values.maintainTypeId = values.maintainTypeId ? values.maintainTypeId[values.maintainTypeId.length - 1] : 0
        values.salesCommissions = { money: values.salesMoney || 0, percent: values.salesType === 4 ? 0 : values.salesPercent || 0, type: values.salesType }
        values.roadWorkCommissions = { money: values.roadWorkMoney || 0, percent: values.roadWorkType === 4 ? 0 : values.roadWorkPercent || 0, type: values.roadWorkType }
        values.salesPercent = undefined
        values.salesType = undefined
        values.roadWorkMoney = undefined
        values.roadWorkPercent = undefined
        values.roadWorkType = undefined
        if (type === "add") {
          services.insert({ data: values, keys: { name: "store/project" } }).then(res => {
            this.setState({ loading: false })
            if (res.success) {
              hideModal()
              resetFields()
              message.success("添加成功！")
              if (isAdding) {
                //添加急件
                this.goMaintain()
              } else {
                dispatch({
                  type: "table/getData",
                  payload: "store/project",
                })
              }
            } else {
              message.error(res.content)
            }
          })
        } else {
          values.projectId = editItem.projectId
          services.update({ data: values, keys: { name: "store/project" } }).then(res => {
            this.setState({ loading: false })
            if (res.success) {
              hideModal()
              resetFields()
              message.success("修改成功！")
              setNotPrice()
              dispatch({
                type: "table/getData",
                payload: "store/project",
              })
            } else {
              message.error(res.content)
            }
          })
        }
      })
    }
    setconsume = e => {
      let str = /^[0-9]+\.{0,1}[0-9]{0,2}$/
      if (e.target.value && !str.test(e.target.value)) {
        message.warning("请输入正确的消耗值!")
      }
    }
    /**
     * 施工提成
     */
    changeRoadWorkType = () => {
      const { setFieldsValue } = this.props.form
      setFieldsValue({ 'roadWorkPercent': 0, 'roadWorkMoney': 0 })
    }
    /**
     * 销售提成
     */
    changeSalesType =() => {
      const { setFieldsValue } = this.props.form
      setFieldsValue({ 'salesPercent': 0, salesMoney: 0 })
    }
    roadWorkMoneyChange = (val) => {
      const { setFieldsValue } = this.props.form
      setFieldsValue({ roadWorkMoney: (val * 1).toFixed(1) })
    }
    salesMoneyChange = (val) => {
      const { setFieldsValue } = this.props.form
      setFieldsValue({ salesMoney: (val * 1).toFixed(1) })
    }
    dataChange = (property, vals) => {
      let val = (vals && vals * 1) ? (vals * 1) : 0
      const { getFieldError, getFieldValue, setFieldsValue } = this.props.form
      const priceTem = getFieldError('priceTem') ? 0 : (Number(getFieldValue('priceTem') || 0))
      const salesType = getFieldValue('salesType')
      const roadWorkType = getFieldValue('roadWorkType')
      if (salesType === 2) {
        const salesPercent = getFieldError('salesPercent') ? 0 : (Number(getFieldValue('salesPercent') || 0) / 100)
        const salesMoney = getFieldError('salesMoney') ? 0 : (Number(getFieldValue('salesMoney') || 0))
        switch (property) {
          case 'priceTem':
            if (salesPercent) {
              const money = val * salesPercent
              setFieldsValue({ salesMoney: money.toFixed(1) })
            } else if (salesMoney) {
              const percent = salesMoney / val / 100
              setFieldsValue({ salesPercent: percent.toFixed(1) })
            }
            break
          case 'salesPercent':
            if (val) {
              const money = priceTem * (val / 100)
              setFieldsValue({ salesMoney: money.toFixed(1) })
            } else if (priceTem && salesMoney) {
              const d = salesMoney * 100 / priceTem
              setFieldsValue({ salesPercent: d.toFixed(1) })
            } else {
              setFieldsValue({ salesPercent: '0.0' })
            }
            break
          case 'salesMoney':
            if (val && priceTem) {
              const percent = val * 100 / priceTem
              setFieldsValue({ salesPercent: percent.toFixed(1) })
            } else if (priceTem && salesPercent) {
              const d = priceTem * salesPercent
              setFieldsValue({ salesMoney: d.toFixed(1) })
            } else {
              setFieldsValue({ salesMoney: '0.0' })
            }
            break
          default:
            console.log(property)
        }
      }
      if (roadWorkType === 2) {
        const roadWorkPercent = getFieldError('roadWorkPercent') ? 0 : (Number(getFieldValue('roadWorkPercent') || 0) / 100)
        const roadWorkMoney = getFieldError('roadWorkMoney') ? 0 : Number(getFieldValue('roadWorkMoney') || 0)
        switch (property) {
          case 'priceTem':
            if (roadWorkPercent) {
              const money = val * roadWorkPercent
              setFieldsValue({ roadWorkMoney: money.toFixed(1) })
            } else if (roadWorkMoney) {
              const percent = roadWorkMoney / (val / 100)
              setFieldsValue({ roadWorkPercent: percent.toFixed(1) })
            }
            break
          case 'roadWorkPercent':
            if (val) {
              const money = priceTem * (val / 100)
              setFieldsValue({ roadWorkMoney: money.toFixed(1) })
            } else if (priceTem && roadWorkMoney) {
              const d = roadWorkMoney * 100 / priceTem
              setFieldsValue({ roadWorkPercent: d.toFixed(1) })
            } else {
              setFieldsValue({ roadWorkPercent: '0.0' })
            }
            break
          case 'roadWorkMoney':
            if (val && priceTem) {
              const percent = val * 100 / priceTem
              setFieldsValue({ roadWorkPercent: percent.toFixed(1) })
            } else if (priceTem && roadWorkPercent) {
              const d = priceTem * roadWorkPercent
              setFieldsValue({ roadWorkMoney: d.toFixed(1) })
            } else {
              setFieldsValue({ roadWorkMoney: '0.0' })
            }
            break
          default:
            console.log(property)
        }
      }
    }
    render() {
      const { getFieldDecorator, getFieldValue, getFieldError } = this.props.form
      // const errshow = getFieldError("phoneTem")
      const {
        hideModal,
        type,
        projectList,
        editItem,
        isAdding,
        maintaintype,
        visible,
      } = this.props
      const reviseCategory = type === 'edit' ? getFieldValue('categoryId') !== editItem.categoryId : false
      return (
        <div className='project_add'>
          {/* <p className={styles.title}>
            {type === "edit" ? "编辑项目" : "新增项目"}
          </p> */}
          <div className={styles.centerDiv}>
            <p className={styles.title}>
              <span></span>基本信息
            </p>
            <Form>
              <Row gutter={196}>
                <Col span={8} className={styles['form-style']}>
                  <FormItem label="项目名称">
                    {getFieldDecorator(
                      "projectName",
                      validate("项目名称", {
                        required: true,
                        type: "string",
                        sole: true,
                        key: 'name',
                        model: 'Project',
                        id: editItem.projectId,
                        _var: Number(localStorage.getItem('coiling')) === 1 ? '1|2' : 2,
                      })
                    )(
                      <Input
                        size="large"
                        disabled={editItem.formTem === 1 ? true : false}
                        placeholder="输入项目名称"
                      />
                    )}
                  </FormItem>
                </Col>

                {editItem.isSystem !== 1 ? <Col span={8} className={styles['form-style']}>
                  <FormItem label="分类" help={reviseCategory ? <span style={{ color: '#ff6f28 ' }}>注意：分类修改后，项目不再享有原分类折扣</span> : ''}>
                    {getFieldDecorator(
                      "categoryId",
                      validate("分类", { required: true, type: "select" })
                    )(
                      <Cascader
                        size="large"
                        placeholder="请选择分类"
                        options={projectList}
                        disabled={
                          editItem.formTem !== 1
                            ? false
                            : type === "edit"
                              ? true
                              : editItem.isSystem !== 1 ? false : true
                        }
                        expandTrigger="hover"
                        allowClear={false}
                      />
                    )}
                  </FormItem>
                </Col> : ''}

                {editItem.isSystem !== 1 ? <Col span={8} className={styles['form-style']}>
                  <FormItem label="业务类型">
                    <div className={styles.espInput350} style={{ position: 'relative' }}>
                      {getFieldDecorator(
                        "maintainTypeId",
                        validate("业务类型", { required: true, type: "select" })
                      )(
                        <Cascader
                          size="large"
                          disabled={
                            editItem.formTem !== 1
                              ? false
                              : type === "edit"
                                ? true
                                : editItem.isSystem !== 1 ? false : true
                          }
                          placeholder="请选择业务类型"
                          options={maintaintype}
                          expandTrigger="hover"
                        />
                      )}
                      <span style={{ position: 'absolute', left: '65px', top: '-38px' }}>
                        <Popover
                          trigger="click"
                          content="门店内所有业务的板块分类。"
                          placement="bottom"
                        >
                          <Icon
                            style={{ color: "#4AACF7", marginLeft: "10px", fontSize: '16px' }}
                            type="question-circle"
                          />
                        </Popover>
                      </span>
                    </div>
                  </FormItem>
                </Col> : ''}

                {editItem.isSystem !== 1 ? <Col span={8} className={styles['form-style']}>
                  <FormItem label="售价">
                    {getFieldDecorator("priceTem", {
                      ...validate("售价", { required: true, type: "price1" }),
                    })(
                      <Input
                        placeholder="输入售价"
                        size="large"
                        addonAfter="元"
                        onChange={(e) => this.dataChange('priceTem', e.target.value)}
                      />
                    )}
                  </FormItem>
                </Col> : ''}

                {editItem.isSystem !== 1 ? <Col span={8} className={styles['form-style']}>
                  <FormItem label="成本">
                    {getFieldDecorator(
                      "costTem",
                      validate("成本", { min: 0, type: "money" })
                    )(
                      <Input
                        placeholder="输入成本"
                        size="large"
                        addonAfter="元"
                        disabled={
                          editItem.formTem !== 1
                            ? false
                            : type === "edit"
                              ? true
                              : editItem.isSystem !== 1 ? false : true
                        }
                      />
                    )}
                  </FormItem>
                </Col> : ''}

                <Col span={8} className={styles['form-style']}>
                  <FormItem label="状态">
                    {getFieldDecorator("statusTem", { initialValue: 1 })(
                      <RadioGroup
                        disabled={editItem.formTem === 1 ? true : false}
                      >
                        <Radio value={1}>启用</Radio>
                        <Radio value={0}>停用</Radio>
                      </RadioGroup>
                    )}
                  </FormItem>
                </Col>

                <Col span={8} className={styles['form-style']}>
                  <div className={styles['all-percent-flex']}>
                    <div className={styles['all-percent-flexitem-one']}>
                      <FormItem label="销售提成" extra={getFieldValue('salesType') === 6 && <div style={{color: '#FF6F28'}}>注：毛利 = 消耗 - 成本</div>}>
                        {getFieldDecorator('salesType', { ...validate("销售提成", { required: true }), initialValue: 4 })(
                          <Select size="large" onChange={this.changeSalesType}>
                            <Option value={1}>实收比例</Option>
                            <Option value={2}>原价比例</Option>
                            <Option value={4}>固定金额</Option>
                            <Option value={5}>利润比例</Option>
                            <Option value={6}>毛利提成</Option>
                            <Option value={3}>不提成</Option>
                          </Select>
                        )}
                      </FormItem>
                    </div>
                    <div className={styles['all-percent-flexitem']}>
                      {getFieldValue('salesType') === 4 ? <FormItem extra={
                          (getFieldValue('salesMoney')*1 > getFieldValue('priceTem')*1 || (getFieldValue('salesMoney')*1>0 && !getFieldValue('priceTem'))) && (
                            <div className={styles.newposi}>
                              提成金额大于售价，请留意
                            </div>
                          )
                          }>
                        {getFieldDecorator('salesMoney', {
                          ...validate("固定金额", { required: true, type: "money" }),
                          initialValue: '0.0',
                        })(
                          <Input
                            size="large"
                            style={{ marginTop: '40px' }}
                            addonAfter='元'
                            onBlur={(e) => this.salesMoneyChange(e.target.value)}
                          />
                        )}
                      </FormItem> : ''}
                      {getFieldValue('salesType') === 4 ? '' : <FormItem>
                        {getFieldDecorator('salesPercent', {
                          ...validate("销售提成比例", { required: true, type: "money", len: 100 }),
                          initialValue: 0,
                        })(
                          <Input
                            size="large"
                            style={{ marginTop: '40px' }}
                            disabled={getFieldValue('salesType') === 3}
                            addonAfter="%"
                            onBlur={(e) => this.dataChange('salesPercent', e.target.value)}
                          />
                        )}
                      </FormItem>}
                    </div>
                    {(getFieldValue('salesType') === 2 && editItem.isSystem !== 1) ? <div className={styles['all-percent-money']}>
                      <div className={styles['all-percent-money-txt']}><span>即提成</span></div>
                      <div>
                        <FormItem>
                          {getFieldDecorator('salesMoney', {
                            ...validate("销售提成", {
                              required: getFieldValue('salesType') === 2,
                              type: "money",
                              len: getFieldError('priceTem') ? 0 : (Number(getFieldValue('priceTem') || 0)).toFixed(1),
                            }),
                            initialValue: 0,
                          })(
                            <Input
                              size="large"
                              addonAfter="元"
                              onBlur={(e) => this.dataChange('salesMoney', e.target.value)}
                            />
                          )}
                        </FormItem>
                      </div>
                    </div> : ''}
                  </div>
                  {
                    getFieldValue('salesType') === 5 && <div className={styles.profitCommission}>注：利润 = 原价 - 成本</div>
                  }
                </Col>

                <Col span={8} className={styles['form-style']}>
                  <div className={styles['all-percent-flex']}>
                    <div className={styles['all-percent-flexitem-one']}>
                      <FormItem label="施工提成" extra={getFieldValue('roadWorkType') === 6 && <div style={{color: '#FF6F28'}}>注：毛利 = 消耗 - 成本</div>}>
                        {getFieldDecorator('roadWorkType', { ...validate("施工提成", { required: true }), initialValue: 4 })(
                          <Select size="large" onChange={this.changeRoadWorkType}>
                            <Option value={2}>原价比例</Option>
                            <Option value={1}>实收比例</Option>
                            <Option value={4}>固定金额</Option>
                            <Option value={5}>利润比例</Option>
                            <Option value={6}>毛利提成</Option>
                            <Option value={3}>不提成</Option>
                          </Select>
                        )}
                      </FormItem>
                    </div>
                    <div className={styles['all-percent-flexitem']}>
                      {getFieldValue('roadWorkType') === 4 ? <FormItem extra={
                          (getFieldValue('roadWorkMoney')*1 > getFieldValue('priceTem')*1 || (getFieldValue('roadWorkMoney')*1>0 && !getFieldValue('priceTem'))) && (
                            <div className={styles.newposi}>
                              提成金额大于售价，请留意
                            </div>
                          )
                          }>
                        {getFieldDecorator('roadWorkMoney', {
                          ...validate('固定金额', { required: true, type: "money" }),
                          initialValue: '0.0',
                        })(
                          <Input
                            style={{ marginTop: '40px' }}
                            size="large"
                            addonAfter='元'
                            onBlur={(e) => this.roadWorkMoneyChange(e.target.value)}
                          />
                        )}
                      </FormItem> : ''}
                      {getFieldValue('roadWorkType') === 4 ? '' : <FormItem>
                        {getFieldDecorator('roadWorkPercent', {
                          ...validate('施工提成比例', { required: true, type: "money", len: 100 }),
                          initialValue: 0,
                        })(
                          <Input
                            disabled={getFieldValue('roadWorkType') === 3}
                            style={{ marginTop: '40px' }}
                            size="large"
                            addonAfter="%"
                            onBlur={(e) => this.dataChange('roadWorkPercent', e.target.value)}
                          />
                        )}
                      </FormItem>}
                    </div>
                    {(editItem.isSystem !== 1 && (getFieldValue('roadWorkType') === 1 || getFieldValue('roadWorkType') === 2)) ? <div className={styles['all-percent-money']}>
                      <div className={styles['all-percent-money-txt']}>
                        {(getFieldValue('roadWorkType') === 1) ? '' : <span className={styles.span}>即提成</span>}
                        {getFieldValue('roadWorkType') === 1 ? <span>
                          <Tooltip className={styles.spans} placement="top" title='实收比例计算的提成低于保底提成时，按保底提成计算。'><Icon type="question-circle" style={{ marginRight: '10px', fontSize: '16px' }} /></Tooltip><span className={styles.span}>保底提成</span>
                        </span> : ''}

                      </div>
                      {getFieldValue('roadWorkType') !== 5 && <div>
                        <FormItem>
                          {getFieldDecorator('roadWorkMoney', {
                            ...validate("施工提成", {
                              required: getFieldValue('roadWorkType') !== 3,
                              type: "money",
                              len: getFieldError('priceTem') ? 0 : (Number(getFieldValue('priceTem') || 0)).toFixed(1),
                            }),
                            initialValue: 0,
                          })(
                            <Input
                              size="large"
                              addonAfter="元"
                              onBlur={(e) => this.dataChange('roadWorkMoney', e.target.value)}
                            />
                          )}
                        </FormItem>
                      </div>}

                    </div> : ''}
                  </div>
                  {
                    getFieldValue('roadWorkType') === 5 && <div className={styles.profitCommission}>注：利润 = 原价 - 成本</div>
                  }
                </Col>
                {editItem.formTem !== 1 && editItem.isSystem !== 1 ? <Col span={8} className={styles['form-style']}>
                  <FormItem label="备注">
                    {getFieldDecorator("remark", validate("备注", { max: 200 }))(
                      <TextArea
                        style={{ height: "80px" }}
                        placeholder="备注"
                      />
                    )}
                  </FormItem>
                </Col> : ''}
              </Row>
            </Form>
          </div>
          {visible ? <Tabbar>
            <div className={styles.btnDiv}>
              <Button size='large' onClick={() => {
                if (isAdding) {
                  this.goMaintain()
                } else {
                  hideModal()
                }
              }}>取消</Button>
              <Button type='primary' loading={this.state.loading} size='large' onClick={this.handleSubmit.bind(this)}>提交</Button>
            </div>
          </Tabbar> : ''}
        </div>
      )
    }
  }
)
export default Add
