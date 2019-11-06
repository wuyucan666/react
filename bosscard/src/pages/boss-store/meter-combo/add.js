import { Component } from 'react'
import { Form, Input, InputNumber, Select, Button, message, Row, Col } from 'antd'
import { connect } from 'dva'

import validate from 'utils/validate'
import services from '../../../services'
import FormTitle from 'components/FormTitle'
import Tabbar from 'components/Tabbar'
import Mast from '../card-stage/components/mast'
import TableList from './table'

import styles from './style.less'

const FormItem = Form.Item
const Option = Select.Option
const { TextArea } = Input

const Add = Form.create({
  mapPropsToFields(props) { //编辑操作,表单默认
    const { editItem, type } = props
    if (type === 'edit') {
      let obj = {}
      Object.keys(editItem).map(v => {
        return obj[v] = Form.createFormField({
          value: editItem[v],
        })
      })
      console.log('type', editItem['salesType'])
      if (editItem['salesType'] === 0) {
        obj['salesType'] = Form.createFormField({
          value: 1,
        })
      }
      return obj
    } else {
      return {
        neverValid: Form.createFormField({ value: 0 }),
        deadlineUnit: Form.createFormField({ value: 1 }),
        deadlineNum: Form.createFormField({ value: 1 }),
      }
    }
  },
})(

  class extends Component {

    state = {
      cardName: '',
      amount: 0,
      packageCount: 0,
      goodAmount: 0,
      remark: '',
      recordsInfo: [], //计次卡详情
      disable: false,
      deleteArr: [],
      saleDisable: false,
      mastShow: false, // 控制会员卡弹窗
    }

    publish() {
      const { validateFields, getFieldValue } = this.props.form
      const { type = 'add', hideModal } = this.props
      validateFields((err, values) => {
        if (err) {
          return
        }

        if (getFieldValue('amount') === 0) {
          message.error('售价必须大于0！')
          return false
        }

        if (this.state.recordsInfo.length === 0) {
          message.error('请添加产品或项目')
          return false
        }

        Object.keys(values).map(key => {
          if (!values[key]) {
            values[key] = 0
            if (key === 'remark') {
              values.remark = ''
            }
          }
          return true
        })

        let canSumit = true
        values.salesCommissions = { type: values['salesType'], percent: values['salesPercent'] || 0, money: values.salesMoney || 0 }
        values.recordsInfo = this.state.recordsInfo
        values.cardType = 2 //计次卡
        values.recordsInfo.map(v => {
          if(v.info*1 === 2) {
            canSumit = false
          }
          if (v.goodNum === 0) {
            v.goodNum = -1
          }
          return v
        })
        if(!canSumit) {
          message.error('请设置价格!')
          return false
        }
        values.goodAmount = 0
        if (values.neverValid === 1) {
          values.deadlineNum = 0
        }
        if (type === 'add') {
          services.insert({ data: values, keys: { 'name': 'store/records' } }).then(res => {
            if (res.success) {
              this.props.dispatch({
                type:'table/getData',
                payload:{new:false},
              })
              message.success('新建计次卡成功!')
              if (this.props.type) { hideModal() }
            } else {
              message.error(res.content)
            }
          })
        } else {
          values.deleteArr = this.state.deleteArr
          values.recordsId = this.props.id
          services.update({ data: values, keys: { 'name': 'store/records' } }).then(res => {
            if (res.success) {
              this.props.dispatch({
                type:'table/getData',
                payload:{new:false},
              })
              message.success('修改计次卡成功!')
              if (this.props.type) { hideModal() }
            } else {
              message.error(res.content)
            }
          })
        }
      })
    }

    isDisable = (e) => {
      if (Number(e) === 1) {
        this.props.form.setFieldsValue({
          deadlineNum: 1,
        })
        this.setState({
          disable: true,
          neverValid: e,
        })
      } else {
        this.setState({
          disable: false,
          neverValid: e,
        })
      }
    }

    getRecordsInfo(recordsInfo) {
      const { setFieldsValue } = this.props.form
      this.setState({
        recordsInfo: recordsInfo,
      })
      let count = recordsInfo.reduce((total, { goodNum }) => {
        return parseFloat(goodNum) + parseFloat(total)
      }, 0)
      setFieldsValue({ packageCount: count })
    }

    getDeleArr = (deleteArr) => {
      this.setState({
        deleteArr: deleteArr,
      })
    }

    back = () => {
      const { hideModal, dispatch } = this.props
      hideModal()
      dispatch({
        type: 'app/setBreads',
      })
    }
    /**
     * 销售提成的禁用切换
     */
    saleDisable() {
      const {setFieldsValue} = this.props.form
      setFieldsValue({salesPercent: 0})
      setFieldsValue({salesMoney: 0})
    }
    componentDidMount() {
      const { editItem, type } = this.props
      if (type === 'edit') {
        this.setState({
          recordsInfo: editItem.recordsInfo,
        })
        if (editItem.neverValid === 1) {
          this.setState({
            disable: true,
          })
        }
      }
    }
    salesChange = (property, val) => {
      const { getFieldError, getFieldValue, setFieldsValue } = this.props.form
      const amount =  getFieldError('amount') ? 0 : Number(getFieldValue('amount') || 0)
      const salesPercent = getFieldError('salesPercent') ? 0 :Number(getFieldValue('salesPercent') || 0) / 100
      const salesMoney = getFieldError('salesMoney') ? 0 :Number(getFieldValue('salesMoney') || 0)
      const salesType = getFieldValue('salesType')
      if(salesType === 2){
        switch (property) {
          case 'amount':
            if(salesPercent){
              const money = (Number(val) || 0) * salesPercent
              setFieldsValue({salesMoney: money.toFixed(2)})
            }else if(salesMoney){
              const percent = salesMoney / (Number(val) || 0) /100
              setFieldsValue({salesPercent: percent.toFixed(2)})
            }
            break
          case 'salesPercent':
            const money = amount * ((Number(val) || 0) / 100)
            setFieldsValue({salesMoney: money.toFixed(2)})
            break
          case 'salesMoney':
            const percent = (Number(val) || 0) / amount * 100
            setFieldsValue({salesPercent: percent.toFixed(2)})
            break
          default:
            console.log(property)
        }
      }
    }
    //控制弹窗
    showMast=()=>{
      const { mastShow } = this.state
      this.setState({
        mastShow:!mastShow,
      })
    }
    render() {
      const { getFieldDecorator, getFieldValue, getFieldError } = this.props.form
      const { type = 'add', editItem } = this.props
      return (
        <div className="meterComboWrap">
          <div className={styles.part}>
            <FormTitle name="基本信息"></FormTitle>
            <Form layout="vertical">
              <Row type="flex" justify="space-between">
                <Col span={6}>
                  <FormItem
                    label="卡名称"
                  >
                    {getFieldDecorator('cardName', validate('卡名称', {
                      required: true,
                      max: 30,
                      type: 'string',
                      sole: true,
                      model: 'CardRecords',
                      id: editItem.recordsId,
                    }))(
                      <Input placeholder="请输入卡名称" size="large" />
                    )}
                  </FormItem>
                </Col>
                <Col span={6}>
                  <FormItem
                    label="售价"
                  >
                    {getFieldDecorator('amount', validate('售价', { required: true }))(
                      <InputNumber
                        style={{ width: '100%' }}
                        placeholder="请输入售价"
                        min={0}
                        max={9999999999}
                        precision={2}
                        size="large"
                        onChange={(val) => this.salesChange('amount', val)}
                      />
                    )}
                    <span className={styles.yuan}>元</span>
                  </FormItem>
                </Col>
                {/* <Col span={6}>
                  <FormItem
                  label="次数"
                  >
                    {getFieldDecorator('packageCount',validate('次数',{required: true, type: 'number'}))(
                      <InputNumber style={{width: '100%'}} min={1} size="large"/>
                    )}
                  </FormItem>
                </Col> */}
                <Col span={6} style={{ display: 'flex' }}>
                  <FormItem style={{ width: 100 }}
                    label="有效期"
                  >
                    {getFieldDecorator('neverValid', validate('期限', { required: true }))(
                      <Select placeholder="请选择" size="large" onChange={this.isDisable}>
                        <Option value={0} >有效期</Option>
                        <Option value={1} >无限期</Option>
                      </Select>
                    )}
                  </FormItem>
                  <FormItem style={{ flex: '1', marginTop: 27 }}
                  >
                    {getFieldDecorator('deadlineNum', validate('期限', { required: true }))(
                      <InputNumber size="large"
                        min={1}
                        style={{ width: '100%' }}
                        disabled={this.state.disable}
                      />
                    )}
                  </FormItem>
                  <FormItem style={{ width: 74, marginTop: 27 }}
                  >
                    {getFieldDecorator('deadlineUnit')(
                      <Select
                        className='selected-dark'
                        size="large"
                        placeholder="请选择"
                        disabled={this.state.disable}
                      >
                        <Option value={1}>年</Option>
                        <Option value={2}>月</Option>
                        <Option value={3}>日</Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row type="flex" justify="space-between">
                <Col span={6}>
                  <div  style={{ display: 'flex' }}>
                    <FormItem
                      label="销售提成"
                      style={{ flex: '1', marginBottom: 0 }}
                    >
                      {getFieldDecorator('salesType', { ...validate('销售提成', { required: true }), initialValue: 4 })(
                        <Select size="large" onChange={this.saleDisable.bind(this)}>
                          <Option value={1} >实收比例</Option>
                          <Option value={2} >原价比例</Option>
                          <Option value={4} >固定金额</Option>
                          <Option value={3} >不提成</Option>
                        </Select>
                      )}
                    </FormItem>
                    {getFieldValue('salesType') === 4 ? <FormItem style={{ flex: '1', marginTop: 27, marginBottom: 0 }}
                    >
                      {getFieldDecorator('salesMoney', {...validate('固定金额', { required: true, type: "money"}), initialValue: 0})(
                        <InputNumber size="large"
                          min={0}
                          precision={1}
                          style={{ width: '100%' }}
                          onChange={(val) => this.salesChange('salesMoney', val)}
                        />
                      )}
                    </FormItem> : ''}
                    {getFieldValue('salesType') === 4 ? '' : <FormItem style={{ flex: '1', marginTop: 27, marginBottom: 0 }}
                    >
                      {getFieldDecorator('salesPercent', {...validate('销售提成', { required: getFieldValue('salesType') !== 3, type: "price1" }), initialValue: 0})(
                        <InputNumber size="large"
                          min={0}
                          max={100}
                          precision={2}
                          style={{ width: '100%' }}
                          disabled={getFieldValue('salesType') === 3}
                          onChange={(val) => this.salesChange('salesPercent', val)}
                        />
                      )}
                    </FormItem>}
                    {getFieldValue('salesType') === 4 ? '' : <span className={styles.pencent}>%</span>}
                    {getFieldValue('salesType') === 4 ? <span className={styles.pencent}>元</span> : ''}
                  </div>
                  {
                    getFieldValue('salesType') === 2 && (
                      <div style={{display: 'flex', justifyContent: 'flex-end', alignItem: 'center'}}>
                        <span style={{lineHeight: '38px',marginRight: 15}}>即提成</span>
                        <FormItem style={{margin: 0, padding: 0}}
                        >
                          {getFieldDecorator('salesMoney',{
                            ...validate('销售提成',{
                              required: getFieldValue('salesType') === 2,
                              type: "price1" ,
                              len: getFieldError('amount') ? 0 : (Number(getFieldValue('amount') || 0)).toFixed(2),
                            }),
                            initialValue: 0,
                          })(
                            <Input size="large" style={{ width: 175}} addonAfter='元'   onChange={(e) => this.salesChange('salesMoney', e.target.value)}/>
                          )}
                        </FormItem>
                      </div>
                    )
                  }
                </Col>
                <Col span={6} style={{ marginRight: '37.5%', position:'relative'}}  >
                  <FormItem
                    label="卡阶段"
                  >
                    <span onClick={this.showMast} style={{position:'absolute',top:'-38px',left:'60px',fontSize:'7px',fontFamily:'MicrosoftYaHei',fontWeight:400,color:'#4AACF7',cursor:'pointer'}}>什么是卡类型?</span>
                    {getFieldDecorator('stage', validate('卡阶段', { required: 'true' }))(
                      <Select
                        size="large"
                        placeholder="请选择类型"
                        value={this.state.deadlineUnit}
                      >
                        <Option value={1}>吸客</Option>
                        <Option value={2}>养客</Option>
                        <Option value={3}>黏客</Option>
                        <Option value={4}>升客</Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row type="flex" justify="start">
                <Col span={6}>
                  <FormItem
                    label="备注"
                  >
                    {getFieldDecorator('remark')(
                      <TextArea placeholder="备注" maxLength="200" rows={4}></TextArea>
                    )}
                  </FormItem>
                </Col>
              </Row>
            </Form>
          </div>
          <div className={styles.line}></div>
          <div className={styles.part}>
            <FormTitle name="套餐"></FormTitle>
            <TableList getDeleArr={this.getDeleArr} getRecordsInfo={this.getRecordsInfo.bind(this)} editItem={editItem} type={type}></TableList>
          </div>
          <Tabbar>
            <div className={styles.tabbar}>
              <Button size="large" type="primary" onClick={this.publish.bind(this)}>发布</Button>
              <Button size="large" onClick={this.back}>取消</Button>
            </div>
          </Tabbar>
          {  this.state.mastShow && <Mast  handerMastHidden={this.showMast}  />  }
        </div>
      )
    }
  }
)


function mapStateToProps(state) {
  const { editItem } = state.meterCombo
  return { editItem }
}

export default connect(mapStateToProps)(Add)
