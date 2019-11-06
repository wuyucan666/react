import services from '../../../services'
import validate from '../../../utils/validate'
import { Form, Modal, Input, Select, message } from 'antd'
import { Component } from 'react'
import styles from "./shop.less"

const FormItem = Form.Item
const Option = Select.Option
const Tkbox = Form.create()(
  class extends Component {
    state = {
      roadWorkTypeState: 4, // 施工提成 => 1实收比例   2原价比例    3不提成
      salesTypeState: 4, // 销售提成 => 1实收比例  3不提成
    }
    handleSubmit = () => {
      const { validateFields, resetFields } = this.props.form
      const { hideModal, projectId } = this.props
      validateFields((err, values) => {
        if (err) {
          return
        }
        let obj = {}
        obj.salesCommissions = { money: values.salesType === 4 ? values.salesPercent : 0, percent: values.salesType === 4 ? 0 : values.salesPercent, type: values.salesType }
        obj.roadWorkCommissions = { money: values.roadWorkType=== 4 ? values.roadWorkPercent :0, percent: values.roadWorkType=== 4 ? 0 : values.roadWorkPercent, type: values.roadWorkType }
        obj.projectId = projectId
        services.INSERT({ data: obj, keys: { name: "store/project/updateCommissios" } }).then(res => {
          if (res.success) {
            resetFields()
            message.success("设置成功！")
            hideModal(true)
          } else {
            message.error(res.content)
          }
        })
      })
    }
    /**
     * 施工提成
     */
    changeRoadWorkType = e => {
      this.setState({ roadWorkTypeState: e })
      const { setFieldsValue } = this.props.form
      setFieldsValue({ 'roadWorkPercent': e === 3 ? 0 : '0.0', 'roadWorkMoney': e === 3 ? 0 : '0.0' })
    }
    /**
     * 销售提成
     */
    changeSalesType = e => {
      const { setFieldsValue } = this.props.form
      setFieldsValue({ 'salesPercent': e === 3 ? 0 : '0.0' })
      this.setState({ salesTypeState: e })
    }
    roadWorkMoneyChange=(val) =>{
      const { setFieldsValue, getFieldValue } = this.props.form
      if(getFieldValue('roadWorkType') === 4) {
        setFieldsValue({roadWorkPercent: (val*1).toFixed(1)})
      }
    }
    salesMoneyChange=(val) =>{
      const { setFieldsValue, getFieldValue } = this.props.form
      if(getFieldValue('salesType') === 4) {
        setFieldsValue({salesPercent: (val*1).toFixed(1)})
      }
    }

    render() {
      const { getFieldDecorator, getFieldValue } = this.props.form
      const { visible, hideModal, projectId } = this.props
      // const { roadWorkTypeState, salesTypeState } = this.state
      const formItemLayouts = {
        labelCol: { span: 0 },
        wrapperCol: { span: 24 },
      }
      const formItemLayoutd = {
        labelCol: { span: 8 },
        wrapperCol: { span: 14 },
      }

      return (
        <div>
          <Modal
            title='批量设置提成规则'
            visible={visible}
            onOk={this.handleSubmit.bind(this)}
            onCancel={hideModal}
            okText="确定"
            width="570px"
            cancelText="取消">
            <div style={{ marginRight: '40px' }}>
              <div className={styles['roadWorkCommissions-top']}>已选 <span>{projectId.length}</span> 个项目</div>
              <Form>
                <div className={styles.roadWorkCommissions} style={{ marginBottom: '20px' }}>
                  <div className={styles.percentType}>
                    <FormItem {...formItemLayoutd} label="销售提成" extra={
                        getFieldValue('salesType') === 5 ? (
                          <div style={{color: '#FF6F28'}}>
                            注:利润 = 原价 - 成本
                        </div>
                        ) : getFieldValue('salesType') === 6 ? <div style={{color: '#FF6F28'}}>注：毛利 = 消耗 - 成本</div> : ''
                      }>
                      {getFieldDecorator('salesType', { ...validate("销售提成", { required: true }), initialValue: 4 })(
                        <Select style={{ width: '175px', marginTop: '1px' }} size="large" onChange={this.changeSalesType}>
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
                  <div className={styles.percent}>
                    <FormItem {...formItemLayouts}>
                      {getFieldDecorator('salesPercent', {
                        ...validate("", { required: true, type: "money", len: getFieldValue('salesType') === 4 ? undefined : 100 }),
                        initialValue: '0.0',
                      })(
                        <Input
                        placeholder={getFieldValue('salesType') === 4 ? '固定金额' : '销售提成比例'}
                          size="large"
                          onBlur={(e) => this.salesMoneyChange(e.target.value)}
                          disabled={getFieldValue('salesType') === 3 ? true : false}
                          addonAfter={getFieldValue('salesType') === 4 ? '元':"%"}
                        />
                      )}
                    </FormItem>
                  </div>
                </div>
                <div className={styles.roadWorkCommissionsw}>
                  <div className={styles.roadWorkCommissions}>
                    <div className={styles.percentType}>
                      <FormItem {...formItemLayoutd} label="施工提成" extra={
                        getFieldValue('roadWorkType') === 5 ? (
                          <div style={{color: '#FF6F28'}}>
                            注:利润 = 原价 - 成本
                        </div>
                        ) : getFieldValue('roadWorkType') === 6 ? <div style={{color: '#FF6F28'}}>注：毛利 = 消耗 - 成本</div> : ''
                      }>
                        {getFieldDecorator('roadWorkType', { ...validate("施工提成", { required: true }), initialValue: 4 })(
                          <Select style={{ width: '175px', marginTop: '1px' }} size="large" onChange={this.changeRoadWorkType}>
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
                    <div className={styles.percent}>
                      <FormItem {...formItemLayouts}>
                        {getFieldDecorator('roadWorkPercent', {
                          ...validate("", { required: true, type: "money", len: getFieldValue('roadWorkType') === 4 ? undefined : 100  }),
                          initialValue: '0.0',
                        })(
                          <Input
                          placeholder={getFieldValue('roadWorkType') === 4 ? '固定金额' : '施工提成比例'}
                            disabled={getFieldValue('roadWorkType') === 3 ? true : false}
                            size="large"
                            onBlur={(e) => this.roadWorkMoneyChange(e.target.value)}
                            addonAfter={getFieldValue('roadWorkType') === 4 ? '元':"%"}
                          />
                        )}
                      </FormItem>
                    </div>
                  </div>
                </div>
                {/* <div className={styles.roadWorkCommissions}>
                  <div className={styles.percentType}>
                    <p>
                      {roadWorkTypeState === 1 ? '' : <span className={styles.span}>即提成</span>}
                      {roadWorkTypeState === 1 ? <span>
                        <Tooltip className={styles.spans} placement="top" title='实收比例计算的提成低于保底提成时，按保底提成计算。'><Icon type="question-circle" style={{ marginLeft: '10px', fontSize: '16px' }} /></Tooltip><span className={styles.span}>保底提成</span>
                      </span> : ''}
                    </p>
                  </div>
                  <div className={styles.percent}>
                    <FormItem {...formItemLayouts}>
                      {getFieldDecorator('roadWorkMoney', {
                        ...validate("施工提成", { required: true, type: "price1" }),
                      })(
                        <Input
                          size="large"
                          onBlur={this.changeRoadWorkMoney}
                          addonAfter="元"
                        />
                      )}
                    </FormItem>
                  </div>
                </div> */}
              </Form>
            </div>
          </Modal>
        </div>
      )
    }
  }
)

export default Tkbox
