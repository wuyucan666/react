import { Component } from "react"
import { Form, Input, Button, Select, message, Icon, Row, Col } from "antd"
import services from "../../../services"
import validate from "../../../utils/validate"
import styles from "./brand.less"
import Tabbar from "components/Tabbar"
import Tkbox from "./Tkbox"

const FormItem = Form.Item
const { TextArea } = Input
const Option = Select.Option
const Add = Form.create({
  mapPropsToFields(props) {
    //编辑操作,表单默认
    const { type, editItem } = props
    if (type === "edit") {
      let obj = {}
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
      bankVisible: false,
      loading: false,
      bankCard: [],
      cardType: "add",
      cardIndex: -1,
    }
    publish() {
      this.setState({ loading: true })
      const { dispatch, hideModal, type, editItem } = this.props
      const { validateFields } = this.props.form
      validateFields((err, values) => {
        if (err) {
          this.setState({ loading: false })
          return
        }
        for (let i in values) {
          if (!values[i]) {
            values[i] = ""
          }
        }
        values.bankCard = {}
        values.bankCard.update = []
        values.bankCard.delete = []
        values.bankCard.insert = []
        this.state.bankCard.forEach(v => {
          if (v.state === "add") {
            values.bankCard.insert.push({
              accountName: v.accountName,
              bankTem: v.bankTem,
              cardNumber: v.cardNumber,
            })
          }
          if (v.bankCardId) {
            if (v.state === "edit") {
              values.bankCard.update.push({
                bankCardId: v.bankCardId,
                accountName: v.accountName,
                bankTem: v.bankTem,
                cardNumber: v.cardNumber,
              })
            }
            if (v.state === "del") {
              values.bankCard.delete.push({
                bankCardId: v.bankCardId,
                accountName: v.accountName,
                bankTem: v.bankTem,
                cardNumber: v.cardNumber,
              })
            }
          }
        })
        if (err) {
          return
        }
        if (!values.sortTem) {
          values.sortTem = 0
        }
        if (!values.businessTelephone) {
          values.businessTelephone = 0
        }
        if (type === "add") {
          services
            .insert({ data: values, keys: { name: "store/supplier" } })
            .then(res => {
              this.setState({ loading: false })
              if (res.success) {
                message.success("添加成功!")
                dispatch({
                  type: "table/getData",
                  payload: "store/supplier",
                })
                hideModal()
              } else {
                // message.error(res.content)
              }
            })
        } else {
          values.supplierId = editItem.supplierId
          services
            .update({ data: values, keys: { name: "store/supplier" } })
            .then(res => {
              this.setState({ loading: false })
              if (res.success) {
                message.success("修改成功!")
                dispatch({
                  type: "table/getData",
                  payload: "store/supplier",
                })
                hideModal()
              } else {
                // message.error(res.connect)
              }
            })
        }
      })
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
      if (nextProps.bank && nextProps.bank.length) {
        this.setState({
          bankCard: [...nextProps.bank],
        })
      }
    }
    /**
     * 添加银行卡
     */
    showModalBank = () => {
      this.setState({
        bankVisible: true,
      })
    }
    hideModalBank = () => {
      this.setState({
        bankVisible: false,
        cardIndex: -1,
      })
    }
    recive = e => {
      if (this.state.cardType === "edit") {
        let arr = [...this.state.bankCard]
        arr[this.state.cardIndex] = {
          ...e,
          state: "edit",
          bankCardId: arr[this.state.cardIndex].bankCardId,
        }
        this.setState({
          bankCard: arr,
        })
      } else {
        let arr = this.state.bankCard
        arr.push({ ...e, state: "add" })
        this.setState({
          bankCard: arr,
        })
      }
      this.setState({
        cardType: "add",
        cardIndex: -1,
      })
      // const { setFieldsValue } = this.props.form
      // let ary = this.state.bankCard.filter(v => v.state !== "del")
      // console.log("rrrrrrrrrrrrrrrrrrrrrr", ary, this.state.bankCard)
      // if (ary.length === 1) {
      //   setFieldsValue({ bankCard: [{ 1: 1 }] })
      // }
    }
    editAdd() {
      const { setFieldsValue } = this.props.form
      setFieldsValue({ bankCard: this.state.bankCard })
    }
    render() {
      const {
        getFieldDecorator,
        // getFieldError,
        // getFieldValue,
      } = this.props.form
      const { hideModal, editItem, dispatch, showAdd } = this.props
      const handleChange = value => {
        console.log(`selected ${value}`)
      }
      /**
       * 添加银行卡
       */
      const showModalBankBtn = () => {
        this.setState({
          cardType: "add",
        })
        this.showModalBank()
      }
      const editCard = e => {
        this.setState({
          cardType: "edit",
          cardIndex: e,
        })
        this.showModalBank()
      }
      const detetleCard = e => {
        let arr = this.state.bankCard
        arr[e].state = "del"
        this.setState({
          bankCard: arr,
        })
      }
      return (
        <div className="from-wrap-margin">
          {/* <div className={styles.brandhead}>
            {type === "edit" ? "编辑供应商" : "新增供应商"}
          </div> */}
          <div className={styles.centerDiv}>
            <p className={styles.brandhead}>
              <span></span>基本信息
            </p>
            <Form>
              <Row gutter={196}>
                <Col span={8} className={styles['form-style']}>
                  <FormItem label="供应商名称">
                    {getFieldDecorator(
                      "supplierName",
                      validate("供应商名称", {
                        required: true,
                        max: 30,
                        type: "string",
                        sole: true,
                        model: "Supplier",
                        id: editItem.supplierId,
                      })
                    )(
                      <Input
                        placeholder="请输入供应商名称"
                        size="large"
                      />
                    )}
                  </FormItem>
                </Col>

                <Col span={8} className={styles['form-style']}>
                  <FormItem label="联系人">
                    {getFieldDecorator(
                      "persionInChargeName",
                      validate("联系人", {
                        required: false,
                        max: 30,
                        type: "string",
                      })
                    )(
                      <Input
                        placeholder="请输入联系人"
                        size="large"
                      />
                    )}
                  </FormItem>
                </Col>

                <Col span={8} className={styles['form-style']}>
                  <FormItem label="业务手机">
                    {getFieldDecorator(
                      "businessPhone", {
                        ...validate("手机号", {
                          required: false,
                          type: "phone",
                          max: 11,
                          sole: true,
                          model: 'Supplier',
                          id: editItem.supplierId,
                        }),
                      }
                    )(
                      <Input
                        placeholder="请输入业务手机"
                        size="large"
                      />
                    )}
                  </FormItem>
                </Col>

                <Col span={8} className={styles['form-style']}>
                  <FormItem label="排序">
                    {getFieldDecorator(
                      "sortTem",
                      validate("排序", {
                        required: false,
                        max: 6,
                        type: "integer",
                      })
                    )(
                      <Input
                        placeholder="请输入排序"
                        size="large"
                      />
                    )}
                  </FormItem>
                </Col>

                <Col span={8} className={styles['form-style']}>
                  <FormItem label="结算方式">
                    <div>
                      {getFieldDecorator(
                        "settlementMethod",
                        validate("结算方式", { required: true })
                      )(
                        <Select initialValue="" onChange={handleChange} size="large">
                          <Option value={1}>月结</Option>
                          <Option value={2}>签单</Option>
                        </Select>
                      )}
                    </div>
                  </FormItem>
                </Col>

                <Col span={8} className={styles['form-style']}>
                  <FormItem label="对账日期">
                    {getFieldDecorator(
                      "reconciliationDate",
                      validate("对账日期", {
                        required: false,
                        len: 31,
                        type: "integer",
                      })
                    )(
                      <Input
                        placeholder="请输入对账日期"
                        size="large"
                      />
                    )}
                  </FormItem>
                </Col>

                <Col span={8} className={styles['form-style']}>
                  <FormItem label="银行账号">
                    <div>
                      <Button
                        type="dashed"
                        size="large"
                        onClick={showModalBankBtn}
                        className={styles.brandbankbtn}
                      >
                        添加
                      </Button>
                    </div>
                  </FormItem>
                </Col>
                <div>
                  <div>
                    {this.state.bankCard.length > 0 &&
                      this.state.bankCard.map((v, index) => {
                        if (v.state !== "del") {
                          return (
                            <Col span={8} className={styles['form-style']} key={index} style={{ marginBottom: '20px' }}>
                              <div
                                className={
                                  this.state.cardIndex === index
                                    ? styles.bankbtnicomcur
                                    : ""
                                }
                              >
                                <div className={styles.brandbank}>
                                  <Icon
                                    onClick={editCard.bind(this, index)}
                                    className={styles.brandbankbtnicom}
                                    type="form"
                                  />
                                  <Icon
                                    onClick={detetleCard.bind(this, index)}
                                    className={styles.brandbankbtnicomed}
                                    type="delete"
                                  />
                                  <div style={{ marginTop: "5px" }}>
                                    {v.accountName}
                                  </div>
                                  <div>{v.bankTem}</div>
                                  <div>{v.cardNumber}</div>
                                </div>
                              </div>
                            </Col>)
                        } else {
                          return ""
                        }
                      })}
                  </div>
                </div>
              </Row>
              <p className={styles.brandhead}>
                <span></span>其他业务
              </p>
              <Row gutter={196}>
                <Col span={8} className={styles['form-style']}>
                  <FormItem label="业务电话">
                    {getFieldDecorator(
                      "businessTelephone",
                      validate("业务电话", {
                        required: false,
                        max: 20,
                        type: "tel",
                      })
                    )(
                      <Input
                        placeholder="请输入业务电话"
                        size="large"
                      />
                    )}
                  </FormItem>
                </Col>

                <Col span={8} className={styles['form-style']}>
                  <FormItem label="微信">
                    {getFieldDecorator(
                      "weChat",
                      validate("微信", { required: false, max: 30 })
                    )(
                      <Input
                        placeholder="请输入微信"
                        size="large"
                      />
                    )}
                  </FormItem>
                </Col>

                <Col span={8} className={styles['form-style']}>
                  <FormItem label="传真">
                    {getFieldDecorator(
                      "faxTem",
                      validate("传真", { required: false, max: 20 })
                    )(
                      <Input
                        placeholder="请输入传真"
                        size="large"
                      />
                    )}
                  </FormItem>
                </Col>

                <Col span={8} className={styles['form-style']}>
                  <FormItem label="地址">
                    {getFieldDecorator(
                      "addressTem",
                      validate("地址", { required: false, max: 100 })
                    )(
                      <TextArea
                        style={{ height: "80px" }}
                        placeholder="请输入地址"
                        size="large"
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
                        style={{ height: "80px" }}
                        placeholder="请输入备注信息"
                      />
                    )}
                  </FormItem>
                </Col>
              </Row>
            </Form>
          </div>
          {showAdd ? <Tabbar>
            <div className={styles.btnDiv}>
              <Button size='large' onClick={hideModal}>取消</Button>
              <Button type='primary' size='large' loading={this.state.loading} onClick={this.publish.bind(this)}>提交</Button>
            </div>
          </Tabbar> : ''}
          <Tkbox
            bankVisible={this.state.bankVisible}
            hideModal={this.hideModalBank.bind(this)}
            showModal={this.showModalBank}
            dispatch={dispatch}
            editItem={this.state.bankCard[this.state.cardIndex]}
            type={this.state.cardType}
            recive={this.recive}
          />
        </div>
      )
    }
  }
)
export default Add
