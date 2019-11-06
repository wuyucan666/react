import { Component } from "react"
import router from "umi/router"
import { Button, message, Form, Input, Select, Cascader, Radio, Popover, Icon, Tooltip, Row, Col } from "antd"
import services from "../../../services"
import { allQueryArray } from "utils"
import validate from "../../../utils/validate"
import Tabbar from "components/Tabbar"
import Addwarehouse from './addwarehouse.js'
import styles from "./styles.less"

const FormItem = Form.Item
const { TextArea } = Input
const Option = Select.Option
const RadioGroup = Radio.Group
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
        visible: false,
        warehouseIdValue: "",
        loading: false,
        warehouseList: [],
        product_name: '',
        commodity_code: '',
        roadWorkTypeState: props.editItem.roadWorkType || 4, // 施工提成 => 1实收比例   2原价比例    3不提成
        salesTypeState: props.editItem.salesType || 4, // 销售提成 => 1实收比例  3不提成
      }
    }

    goMaintain = () => {
      const { dispatch } = this.props
      setTimeout(() => {
        router.push({ pathname: "/boss-store/maintain-billing" })
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

    publish() {
      const { dispatch, hideModal, type, editItem, isAdding, setNotPrice } = this.props
      const { validateFieldsAndScroll } = this.props.form
      this.setState({ loading: true })
      validateFieldsAndScroll((err, values) => {
        if (err) {
          this.setState({ loading: false })
          return
        }
        for (let i in values) {
          if (!values[i]) {
            values[i] = ""
          }
        }
        values.categoryId = values.categoryId[values.categoryId.length - 1]
        values.maintainTypeId = values.maintainTypeId[values.maintainTypeId.length - 1]
        if (!values.minimumStock) {
          values.minimumStock = 0
        }
        if (!values.accessoryProperties) {
          values.accessoryProperties = 0
        }
        if (!values.warehouseId) {
          values.warehouseId = 0
        }
        if (!values.type) {
          values.type = 0
        }

        values.salesCommissions = { money: values.salesMoney || 0, percent: values.salesType === 4 ? 0 : values.salesPercent || 0, type: values.salesType }
        values.roadWorkCommissions = { money: values.roadWorkMoney || 0, percent: values.roadWorkType === 4 ? 0 : values.roadWorkPercent || 0, type: values.roadWorkType }

        values.salesPercent = undefined
        values.salesType = undefined
        values.roadWorkMoney = undefined
        values.roadWorkPercent = undefined
        values.roadWorkType = undefined

        if (type === "add") {
          services.insert({ data: values, keys: { name: "store/product" } }).then(res => {
            this.setState({ loading: false })
            if (res.success) {
              message.success("添加成功!")
              hideModal()
              if (isAdding) {
                //添加急件
                this.goMaintain()
              } else {
                dispatch({
                  type: "table/getData",
                  payload: "store/product",
                })
              }
            } else {
              message.error(res.content)
            }
          })
        } else {
          values.productId = editItem.productId
          services.update({ data: values, keys: { name: "store/product" } }).then(res => {
            this.setState({ loading: false })
            if (res.success) {
              message.success("修改成功!")
              setNotPrice()
              dispatch({
                type: "table/getData",
                payload: "store/product",
              })
              hideModal()
            } else {
              message.error(res.connect)
            }
          })
        }
      })
    }
    componentDidMount() {
      this.getwarehouseList()
    }
    /**
     * 监听消耗值
     */
    setconsume = e => {
      let str = /^[0-9]+\.{0,1}[0-9]{0,2}$/
      if (e.target.value && !str.test(e.target.value)) {
        message.warning("请输入正确的消耗值!")
      }
    }
    // 获取仓库列表
    getwarehouseList = () => {
      services.warehouseList().then((res) => {
        let warehouseList = [...res.list]
        this.setState({ warehouseList }, () => {
          let item = warehouseList.find(v => v.isDefaultWarehouse === 1)
          this.setState({ warehouseIdValue: item ? item.warehouseId : "" })
        })
      })
    }
    /**
     * 施工提成
     */
    changeRoadWorkType = e => {
      this.setState({ roadWorkTypeState: e })
      const { setFieldsValue } = this.props.form
      setFieldsValue({ 'roadWorkPercent': 0, 'roadWorkMoney': 0 })
    }
    changeRoadWorkPercent = (key, me, e) => {
      if (this.state.roadWorkTypeState !== 2) {
        return false
      }
      // 当  施工提成比例/售价   发生变化时产生计算
      const { setFieldsValue, getFieldValue, getFieldError } = this.props.form
      let p = getFieldValue(key)
      let er = getFieldError(key)
      let price = getFieldValue("roadWorkMoney")
      let priceer = getFieldError("roadWorkMoney")
      if (getFieldError(me) || !e.target.value) {
        if (!er && p && price && !priceer) {
          if (me === 'sellingPriceTem') {
            setFieldsValue({ 'sellingPriceTem': (parseFloat(price) / parseFloat(p) * 100).toFixed(1) })
          } else if (me === 'roadWorkPercent') {
            setFieldsValue({ 'roadWorkPercent': (parseFloat(price) / parseFloat(p) * 100).toFixed(1) })
          }
        }
        return false
      }
      if (!er && p) {
        setFieldsValue({ 'roadWorkMoney': (parseFloat(p) * parseFloat(e.target.value) / 100).toFixed(1) })
      } else if (price && !priceer) {
        if (me === 'sellingPriceTem') {
          setFieldsValue({ 'sellingPriceTem': (parseFloat(price) / parseFloat(e.target.value) * 100).toFixed(1) })
        } else if (me === 'roadWorkPercent') {
          setFieldsValue({ 'roadWorkPercent': (parseFloat(price) / parseFloat(e.target.value) * 100).toFixed(1) })
        }
      }
    }
    changeRoadWorkMoney = e => {
      if (this.state.roadWorkTypeState !== 2) {
        return false
      }
      // 当施工提成  发生变化时产生计算roadWorkPercent
      const { setFieldsValue, getFieldValue, getFieldError } = this.props.form
      let p = getFieldValue("sellingPriceTem")
      let er = getFieldError("sellingPriceTem")
      let price = getFieldValue("roadWorkPercent")
      let priceer = getFieldError("roadWorkPercent")
      if (getFieldError("roadWorkMoney") || !e.target.value) {
        if (!er && p && price && !priceer) {
          setFieldsValue({ 'roadWorkMoney': (parseFloat(p) * parseFloat(price) / 100).toFixed(1) })
        }
        return false
      }
      if (!er && p) {
        setFieldsValue({ 'roadWorkPercent': (parseInt(e.target.value) / parseFloat(p) * 100).toFixed(1) })
      } else if (price && !priceer) {
        setFieldsValue({ 'sellingPriceTem': (parseFloat(e.target.value) / parseFloat(price) * 100).toFixed(1) })
      }
    }
    /**
     * 销售提成
     */
    changeSalesType = e => {
      const { setFieldsValue } = this.props.form
      setFieldsValue({ 'salesPercent': 0, 'salesMoney': 0 })
      this.setState({ salesTypeState: e })
    }
    /**
     * 去创建分类
     */
    goAddCategory = () => {
      router.push("/boss-store/product-category")
    }
    // 添加仓库
    addWarehouse = () => {
      this.setState({ visible: true })
    }
    // 新建仓库后
    hideModalvisible = (e) => {
      this.setState({ visible: false })
      if (e) {
        // 刷新仓库列表
        this.getwarehouseList()
      }
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
      const sellingPriceTem = getFieldError('sellingPriceTem') ? 0 : (Number(getFieldValue('sellingPriceTem') || 0))
      const salesType = getFieldValue('salesType')
      const roadWorkType = getFieldValue('roadWorkType')
      if (salesType === 2) {
        const salesPercent = getFieldError('salesPercent') ? 0 : (Number(getFieldValue('salesPercent') || 0) / 100)
        const salesMoney = getFieldError('salesMoney') ? 0 : (Number(getFieldValue('salesMoney') || 0))
        switch (property) {
          case 'sellingPriceTem':
            if (salesPercent) {
              const money = Number(val) * salesPercent
              setFieldsValue({ salesMoney: money.toFixed(1) })
            } else if (salesMoney) {
              const percent = salesMoney / Number(val) / 100
              setFieldsValue({ salesPercent: percent.toFixed(1) })
            }
            break
          case 'salesPercent':
            if (val) {
              const money = sellingPriceTem * (val / 100)
              setFieldsValue({ salesMoney: money.toFixed(1) })
            } else if (sellingPriceTem && salesMoney) {
              const d = salesMoney * 100 / sellingPriceTem
              setFieldsValue({ salesPercent: d.toFixed(1) })
            } else {
              setFieldsValue({ salesPercent: '0.0' })
            }
            break
          case 'salesMoney':
            if (val && sellingPriceTem) {
              const percent = val * 100 / sellingPriceTem
              setFieldsValue({ salesPercent: percent.toFixed(1) })
            } else if (sellingPriceTem && salesPercent) {
              const d = sellingPriceTem * salesPercent
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
        const roadWorkMoney = getFieldError('roadWorkMoney') ? 0 : (Number(getFieldValue('roadWorkMoney') || 0))
        switch (property) {
          case 'sellingPriceTem':
            if (roadWorkPercent) {
              const money = Number(val) * roadWorkPercent
              setFieldsValue({ roadWorkMoney: money.toFixed(1) })
            } else if (roadWorkMoney) {
              const percent = roadWorkMoney / Number(val) / 100
              setFieldsValue({ roadWorkPercent: percent.toFixed(1) })
            }
            break
          case 'roadWorkPercent':
            if (val) {
              const money = sellingPriceTem * (val / 100)
              setFieldsValue({ roadWorkMoney: money.toFixed(1) })
            } else if (sellingPriceTem && roadWorkMoney) {
              const d = roadWorkMoney * 100 / sellingPriceTem
              setFieldsValue({ roadWorkPercent: d.toFixed(1) })
            } else {
              setFieldsValue({ roadWorkPercent: '0.0' })
            }
            break
          case 'roadWorkMoney':
            if (val && sellingPriceTem) {
              const percent = val * 100 / sellingPriceTem
              setFieldsValue({ roadWorkPercent: percent.toFixed(1) })
            } else if (sellingPriceTem && roadWorkPercent) {
              const d = sellingPriceTem * roadWorkPercent
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
    // 选选择外采类型时，显示默认提成
    miningOutside=(e)=> {
      const {setFieldsValue} = this.props.form
      if (e.target.value === 0) {
        services.LIST({keys: {name: 'store/setting/general-commission/0'}}).then(res => {
          if(res.code === '0') {
            let miningData = res.data.commission
            setFieldsValue({
              type: e.target.value,
              salesType: miningData.sales.type,
              salesMoney: miningData.sales.money,
              salesPercent: miningData.sales.percent,
              roadWorkMoney: miningData.construction.money,
              roadWorkPercent: miningData.construction.percent,
              roadWorkType: miningData.construction.type,
            })
          }
        })
      } else {
        setFieldsValue({
          salesType: 4,
          salesMoney: 0,
          salesPercent: '',
          roadWorkMoney: 0,
          roadWorkPercent: '',
          roadWorkType: 4,
        })
      }
    }

    render() {
      const { getFieldDecorator, getFieldError, getFieldValue } = this.props.form
      const { hideModal, category, productUnit, type, editItem, isAdding, maintaintype } = this.props
      const { warehouseList } = this.state
      const handleChange = value => {
        console.log(`selected ${value}`)
      }
      const errshow = getFieldError("phoneTem")
      const reviseCategory = type === 'edit' ? getFieldValue('categoryId') !== editItem.categoryId : false

      /**显示利润比例提成的提示 */
      const showProfitScaleTip = (show) => <span style={{ display: show ? 'block' : "none", color: '#FF6F28' }}>注：利润 = 原价 - 成本</span>

      return (
        <div>
          <div>
            {/* <div className={styles.brandhead}>
              {type === "add" ? "新建产品" : "编辑产品"}
            </div> */}
            <div className={styles.centerDiv}>
              <p className={styles.brandhead}>
                <span></span>基本信息
              </p>
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
                          sole: editItem.productId ? editItem.formTem !== 1 : true,
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
                          disabled={
                            editItem.formTem !== 1
                              ? false
                              : type === "edit"
                                ? true
                                : false
                          }
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
                          sole: editItem.productId
                            ? editItem.formTem !== 1
                            : true,
                          model: "Product",
                          id: editItem.productId,
                          _var:  { '_': Number(localStorage.getItem('coiling')) === 1 ? '1|2' : 2, product_name: this.state.product_name},
                        })
                      )(
                        <Input
                          size="large"
                          placeholder="请输入编码"
                          onChange={(e) => {
                            this.setState({commodity_code: e.target.value}, () => {
                              this.props.form.validateFields(['productName'],{force: true})
                            })
                          }}
                          disabled={
                            editItem.formTem !== 1
                              ? false
                              : type === "edit"
                                ? true
                                : false
                          }
                        />
                      )}
                    </FormItem>
                  </Col>

                  <Col span={8} className={styles['form-style']}>
                    <FormItem label="产品类型">
                      {getFieldDecorator("type", { initialValue: 1 })(
                        <RadioGroup onChange={this.miningOutside.bind(this)}>
                          <Radio value={1}>自有产品</Radio>
                          <Radio value={0}>外采产品</Radio>
                        </RadioGroup>
                      )}
                    </FormItem>
                  </Col>

                  <Col span={8} className={styles['form-style']}>
                    <FormItem label="单位">
                      {getFieldDecorator(
                        "unitId",
                        validate("单位", { required: true })
                      )(
                        <Select
                          placeholder="请选择"
                          size="large"
                          disabled={
                            editItem.formTem !== 1
                              ? false
                              : type === "edit"
                                ? true
                                : false
                          }
                        >
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
                    <FormItem
                      label="产品分类"
                      extra={
                        category.length === 0 && (
                          <div className={styles.newposi}>
                            尚未创建分类<span style={{ color: '#2FC25BFF', marginLeft: '20px', cursor: 'pointer' }} onClick={this.goAddCategory}>前往创建 >></span>
                          </div>
                        )
                      }
                      help={reviseCategory ? <span style={{ color: '#ff6f28 ' }}>注意：分类修改后，项目不再享有原分类折扣</span> : ''}
                    >
                      <div>
                        {getFieldDecorator(
                          "categoryId",
                          validate("产品分类", { required: true })
                        )(
                          <Cascader
                            size="large"
                            disabled={
                              editItem.formTem !== 1
                                ? false
                                : type === "edit"
                                  ? true
                                  : false
                            }
                            placeholder="请选择分类"
                            options={category}
                            expandTrigger="hover"
                          />
                        )}
                      </div>
                    </FormItem>
                  </Col>

                  <Col span={8} className={styles['form-style']}>
                    <FormItem label="业务类型">
                      <div style={{ position: 'relative' }}>
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
                                  : false
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
                  </Col>

                  <Col span={8} className={styles['form-style']}>
                    <FormItem label="售价">
                      {getFieldDecorator(
                        "sellingPriceTem",
                        validate("售价", {
                          required: true,
                          type: "price1",
                          len: 100000,
                        })
                      )(
                        <Input
                          size="large"
                          addonAfter="元"
                          onChange={(e) => this.dataChange('sellingPriceTem', e.target.value)}
                          // onBlur={this.changeRoadWorkPercent.bind(this, 'roadWorkPercent', 'sellingPriceTem')}
                          placeholder="请输入售价"
                        />
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
                          {showProfitScaleTip(getFieldValue('salesType') === 5)}
                        </FormItem>
                      </div>
                      <div className={styles['all-percent-flexitem']}>
                        {getFieldValue('salesType') === 4 ? <FormItem extra={
                          (getFieldValue('salesMoney')*1 > getFieldValue('sellingPriceTem')*1 || (getFieldValue('salesMoney')*1>0 && !getFieldValue('sellingPriceTem'))) && (
                            <div className={styles.newposi}>
                              提成金额大于售价，请留意
                            </div>
                          )
                        }>
                          {getFieldDecorator('salesMoney', {
                            ...validate("", { required: true, type: "money" }),
                            initialValue: '0.0',
                          })(
                            <Input
                              style={{ marginTop: '40px' }}
                              placeholder="固定金额"
                              size="large"
                              addonAfter='元'
                              onBlur={(e) => this.salesMoneyChange(e.target.value)}
                            />
                          )}
                        </FormItem> : ''}
                        <FormItem style={{display: getFieldValue('salesType') === 4 ? 'none' : 'block'}}>
                          {getFieldDecorator('salesPercent', {
                            ...validate("", { required: true, type: "money", len: 100 }),
                            initialValue: 0,
                          })(
                            <Input
                              style={{ marginTop: '40px' }}
                              placeholder="销售提成比例"
                              size="large"
                              disabled={getFieldValue('salesType') === 3}
                              addonAfter="%"
                              onBlur={(e) => this.dataChange('salesPercent', e.target.value)}
                            />
                          )}
                        </FormItem>
                      </div>
                      {(getFieldValue('salesType') === 2) ? <div className={styles['all-percent-money']}>
                        <div className={styles['all-percent-money-txt']}><span>即提成</span></div>
                        <div>
                          <FormItem>
                            {getFieldDecorator('salesMoney', {
                              ...validate("销售提成", {
                                required: getFieldValue('salesType') === 2,
                                type: "money",
                                len: getFieldError('sellingPriceTem') ? 0 : (Number(getFieldValue('sellingPriceTem') || 0)).toFixed(1),
                              }),
                              initialValue: 0,
                            })(
                              <Input
                                size="large"
                                // onBlur={this.changeRoadWorkMoney}
                                addonAfter="元"
                                onBlur={(e) => this.dataChange('salesMoney', e.target.value)}
                              />
                            )}
                          </FormItem>
                        </div>
                      </div> : ''}
                    </div>
                  </Col>

                  <Col span={8} className={styles['form-style']}>
                    <div className={styles['all-percent-flex']}>
                      <div className={styles['all-percent-flexitem-one']}>
                        <FormItem label="施工提成" extra={getFieldValue('roadWorkType') === 6 && <div style={{color: '#FF6F28'}}>注：毛利 = 消耗 - 成本</div>}>
                          {getFieldDecorator('roadWorkType', { ...validate("施工提成", { required: true }), initialValue: 4 })(
                            <Select size="large" onChange={this.changeRoadWorkType}>
                              <Option value={1}>实收比例</Option>
                              <Option value={2}>原价比例</Option>
                              <Option value={4}>固定金额</Option>
                              <Option value={5}>利润比例</Option>
                              <Option value={6}>毛利提成</Option>
                              <Option value={3}>不提成</Option>
                            </Select>
                          )}
                          {showProfitScaleTip(getFieldValue('roadWorkType') === 5)}
                        </FormItem>
                      </div>
                      <div className={styles['all-percent-flexitem']}>
                        {getFieldValue('roadWorkType') === 4 ? <FormItem extra={
                          (getFieldValue('roadWorkMoney')*1 > getFieldValue('sellingPriceTem')*1 || (getFieldValue('roadWorkMoney')*1>0 && !getFieldValue('sellingPriceTem'))) && (
                            <div className={styles.newposi}>
                              提成金额大于售价，请留意
                            </div>
                          )
                          }>
                          {getFieldDecorator('roadWorkMoney', {
                            ...validate("", { required: true, type: "money" }),
                            initialValue: '0.0',
                          })(
                            <Input
                              placeholder="固定金额"
                              style={{ marginTop: '40px' }}
                              size="large"
                              addonAfter='元'
                              onBlur={(e) => this.roadWorkMoneyChange(e.target.value)}
                            />
                          )}
                        </FormItem> : ''}
                        <FormItem style={{display: getFieldValue('roadWorkType') === 4 ? 'none' : 'block'}}>
                          {getFieldDecorator('roadWorkPercent', {
                            ...validate('', { required: true, type: "money", len: 100 }),
                            initialValue: 0,
                          })(
                            <Input
                              placeholder="施工提成比例"
                              // onBlur={this.changeRoadWorkPercent.bind(this, 'sellingPriceTem', 'roadWorkPercent')}
                              disabled={getFieldValue('roadWorkType') === 3}
                              style={{ marginTop: '40px' }}
                              size="large"
                              addonAfter="%"
                              onBlur={(e) => this.dataChange('roadWorkPercent', e.target.value)}
                            />
                          )}
                        </FormItem>
                      </div>
                      {(getFieldValue('roadWorkType') === 1 || getFieldValue('roadWorkType') === 2) ? <div className={styles['all-percent-money']}>
                        <div className={styles['all-percent-money-txt']}>
                          {getFieldValue('roadWorkType') === 1 ? '' : <span>即提成</span>}
                          {getFieldValue('roadWorkType') === 1 ? <span>
                            <Tooltip className={styles.spans} placement="top" title='实收比例计算的提成低于保底提成时，按保底提成计算。'><Icon type="question-circle" style={{ marginRight: '10px', fontSize: '16px' }} /></Tooltip><span className={styles.span}>保底提成</span>
                          </span> : ''}
                        </div>
                        <div>
                          <FormItem>
                            {getFieldDecorator('roadWorkMoney', {
                              ...validate("施工提成", {
                                required: getFieldValue('roadWorkType') !== 3,
                                type: "money",
                                len: getFieldError('sellingPriceTem') ? 0 : (Number(getFieldValue('sellingPriceTem') || 0)).toFixed(1),
                              }),
                              initialValue: 0,
                            })(
                              <Input
                                size="large"
                                // onBlur={this.changeRoadWorkMoney}
                                addonAfter="元"
                                onBlur={(e) => this.dataChange('roadWorkMoney', e.target.value)}
                              />
                            )}
                          </FormItem>
                        </div>
                      </div> : ''}
                    </div>
                  </Col>
                </Row>
                <div style={{ width: '100%', height: '40px' }}></div>
                <Row gutter={196}>
                  <Col span={8} className={styles['form-style']}>
                    <FormItem label="状态">
                      {getFieldDecorator("statusTem", { initialValue: 1 })(
                        <RadioGroup
                          disabled={
                            editItem.formTem !== 1
                              ? false
                              : type === "edit"
                                ? true
                                : false
                          }
                        >
                          <Radio value={1}>启用</Radio>
                          <Radio value={2}>停用</Radio>
                        </RadioGroup>
                      )}
                    </FormItem>
                  </Col>

                  <Col span={8} className={styles['form-style']}>
                    <FormItem
                      label="产品简称"
                      extra={
                        !errshow && (
                          <div className={styles.newposi}>
                            此命名用于客户打印凭证的产品名称显示
                        </div>
                        )
                      }
                    >
                      {getFieldDecorator(
                        "intro",
                        validate("产品简称", {
                          required: false,
                          type: "string",
                          len: 100000,
                        })
                      )(
                        <Input
                          size="large"
                          placeholder="请输入产品简称"
                        />
                      )}
                    </FormItem>
                  </Col>

                  <Col span={8} className={styles['form-style']}>
                    <FormItem label="配件属性">
                      {getFieldDecorator("accessoryProperties")(
                        <Select
                          size="large"
                          initialValue=""
                          onChange={handleChange}
                          disabled={
                            editItem.formTem !== 1
                              ? false
                              : type === "edit"
                                ? true
                                : false
                          }
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
                          sole: editItem.productId ? editItem.formTem !== 1 : true,
                          model: "Product",
                          id: editItem.productId,
                        })
                      )(
                        <Input
                          size="large"
                          placeholder="请输入条形码"
                          disabled={
                            editItem.formTem !== 1
                              ? false
                              : type === "edit"
                                ? true
                                : false
                          }
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
                          placeholder="请输入型号"
                          disabled={
                            editItem.formTem !== 1
                              ? false
                              : type === "edit"
                                ? true
                                : false
                          }
                        />
                      )}
                    </FormItem>
                  </Col>

                  <Col span={8} className={styles['form-style']}>
                    <FormItem label="规格">
                      {getFieldDecorator(
                        "specificationTem",
                        validate("规格", {
                          required: false,
                          max: 30,
                          type: "string",
                        })
                      )(
                        <Input
                          size="large"
                          placeholder="请输入规格"
                          disabled={
                            editItem.formTem !== 1
                              ? false
                              : type === "edit"
                                ? true
                                : false
                          }
                        />
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <p className={styles.brandhead}>
                  <span></span>库存信息
                </p>
                <Row gutter={196}>
                  <Col span={8} className={styles['form-style']}>
                    <div className={styles['form-style-add']}>
                      <div>
                        <FormItem label="默认仓库">
                          {getFieldDecorator("warehouseId", {
                            initialValue: this.state.warehouseIdValue,
                          })(
                            <Select placeholder="请选择" size="large">
                              {warehouseList.map(v => {
                                return (
                                  <Option key={v} value={v.warehouseId}>
                                    {v.warehouseName}
                                  </Option>
                                )
                              })}
                            </Select>
                          )}
                        </FormItem>
                      </div>
                      <div className={styles['form-style-add-btn']} onClick={this.addWarehouse}><Icon type="plus" /></div>
                    </div>
                  </Col>

                  <Col span={8} className={styles['form-style']}>
                    <FormItem label="最低库存">
                      {getFieldDecorator(
                        "minimumStock",
                        validate("最低库存", {
                          required: false,
                          max: 5,
                          type: "number",
                        })
                      )(
                        <Input
                          size="large"
                          placeholder="请输入最低库存"
                          onBlur={async () => {
                            if (!getFieldError("minimumStock")) {
                              if (!getFieldValue("warehouseId")) {
                                this.props.form.setFields({
                                  minimumStock: {
                                    errors: [new Error("请先选择默认仓库！")],
                                  },
                                })
                              }
                            }
                          }}
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
              <Button size='large' onClick={() => {
                if (isAdding) {
                  this.goMaintain()
                } else {
                  hideModal()
                }
              }}>取消</Button>
              <Button type='primary' size='large' loading={this.state.loading} onClick={this.publish.bind(this)}>提交</Button>
            </div>
          </Tabbar>
          <Addwarehouse visible={this.state.visible} tabledata={warehouseList} hideModal={this.hideModalvisible}></Addwarehouse>
        </div>
      )
    }
  }
)
export default Add
