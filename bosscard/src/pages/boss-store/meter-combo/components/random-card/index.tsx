import React, { Component } from 'react'
import validate from 'utils/validate'
import services from 'services'
import { connect } from 'dva'

import FormTitle from 'components/FormTitle'
import Mast from '../../../card-stage/components/mast'
import Tabbar from 'components/Tabbar'
import TableList from '../../table'
import { Form, Row, Col, Input, InputNumber, Select, Button, message, Popover } from "antd"

const styles = require('./index.less')

type pageProps = {
  id: string,
  /**编辑的项 */
  editItem: any,
  /**当前处理类型 */
  type: string,
  form: any,
  hideModal: Function,
  dispatch: any,
}

const FormItem = Form.Item
const Option = Select.Option

class RandomCard extends Component<pageProps> {

  state = {
    mastShow: false, // 控制会员卡弹窗
    recordsInfo: [], //计次卡详情
    deleteArr: [],
  }


  componentDidMount() {
    const { editItem, type } = this.props
    if (type === 'edit') {
      this.setState({
        recordsInfo: editItem.recordsInfo,
      })
    }
  }

  isDisable = (e) => {
    if (Number(e) === 1) {
      this.props.form.setFieldsValue({
        deadlineNum: 1,
      })
    } 
  }

  saleDisable() {
    const {setFieldsValue} = this.props.form
    setFieldsValue({salesPercent: 0})
    setFieldsValue({salesMoney: 0})
  }

  showMast = () =>{
    const { mastShow } = this.state
    this.setState({
      mastShow: !mastShow,
    })
  }

  salesChange = (property: string, val: any) => {
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

  getRecordsInfo(recordsInfo) {
    console.log('recordsInfo', recordsInfo)
    this.setState({
      recordsInfo: recordsInfo,
    })
  }

  getDeleArr = (deleteArr) => {
    this.setState({
      deleteArr: deleteArr,
    })
  }

  countChange = (e) => {
    let val = e.target.value
    const { recordsInfo } = this.state
    let warn = false
    let result = recordsInfo.map(item => {
      if(val <= item.goodNum) {
        warn = true
        item.goodNum = val - 1 || ''
      }
      return item
    })
    if(warn) {
      message.warn('服务最多次数需小于卡总次数')
    }
    this.setState({ recordsInfo: result })
  }

  publish = () => {
    const { validateFields, getFieldValue } = this.props.form
    const { type = 'add', hideModal } = this.props
    validateFields((err, values) => {
      if (err) {
        return
      }

      if (this.state.recordsInfo.length === 0) {
        message.error('请添加产品或项目')
        return false
      }
      let canSumit = true
      values.salesCommissions = { type: values['salesType'], percent: values['salesPercent'] || 0, money: values.salesMoney || 0 }
      values.recordsInfo = this.state.recordsInfo
      values.cardType = 4 //随选卡
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
            message.success('新建随选卡成功!')
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
            message.success('修改随选卡成功!')
            if (this.props.type) { hideModal() }
          } else {
            message.error(res.content)
          }
        })
      }
    })
  }

  back = () => {
    const { hideModal, dispatch } = this.props
    hideModal()
    dispatch({
      type: 'app/setBreads',
    })
  }
  
  render() {
    const { form: { getFieldValue, getFieldDecorator, getFieldError}, editItem, type} = this.props
    return (
      <div>
        <div className={styles.part_one}>
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
              <Col span={6}>
                <FormItem
                label="总次数"
                >
                  {getFieldDecorator('packageCount',validate('次数',{required: true, type: 'number'}))(
                    <InputNumber style={{width: '100%'}} min={1} size="large" onBlur={this.countChange}/>
                  )}
                  <Popover placement="top" content={'任选卡内服务进行开单，用完总次数该卡即失效。'}>
                    <i className= {styles.question + ' iconfont icon-wenhao1' }></i>
                  </Popover>
                </FormItem>
              </Col>
            </Row>
            <Row type="flex" justify="space-between">
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
                      disabled={getFieldValue('neverValid')*1 === 1}
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
                      disabled={getFieldValue('neverValid')*1 === 1}
                    >
                      <Option value={1}>年</Option>
                      <Option value={2}>月</Option>
                      <Option value={3}>日</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
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
                    <div style={{display: 'flex', justifyContent: 'flex-end', alignItems: 'center'}}>
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
                          <Input size="large" style={{ width: 175}} addonAfter='元' onChange={(e) => this.salesChange('salesMoney', e.target.value)}/>
                        )}
                      </FormItem>
                    </div>
                  )
                }
              </Col>
              <Col span={6} style={{position:'relative'}}  >
                <FormItem
                  label="卡类型"
                >
                  <span onClick={this.showMast} style={{position:'absolute',top:'-38px',left:'60px',fontSize:'7px',fontFamily:'MicrosoftYaHei',fontWeight:400,color:'#4AACF7',cursor:'pointer'}}>什么是卡类型?</span>
                  {getFieldDecorator('stage', validate('卡类型', { required: 'true' }))(
                    <Select
                      size="large"
                      placeholder="请选择类型"
                      // value={this.state.deadlineUnit}
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
          </Form>
        </div>
        <div className={styles.line}></div>
        <div className={styles.part_tow}>
          <FormTitle name="套餐"></FormTitle>
          <TableList 
          type={type}
          editItem={editItem} 
          isRandom={true}
          maxNum={getFieldValue('packageCount')}
          getDeleArr={this.getDeleArr} 
          getRecordsInfo={this.getRecordsInfo.bind(this)} 
          ></TableList>
        </div>
        <Tabbar>
          <div className={styles.tabbar}>
            <Button size="large" type="primary" onClick={this.publish.bind(this)}>发布</Button>
            <Button size="large" onClick={this.back}>取消</Button>
          </div>
        </Tabbar>
        {  
          this.state.mastShow && 
          <Mast handerMastHidden={this.showMast} />  
        }
      </div>
    )
  }
}

function mapStateToProps(state) {
  const { editItem } = state.meterCombo
  return { editItem }
}

export default connect(mapStateToProps)(
  Form.create({
    mapPropsToFields(props: any) { //编辑操作,表单默认
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
  })(RandomCard) 
)