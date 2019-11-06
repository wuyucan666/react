/**
 * Created by kikazheng on 2018/12/3
 */
import React,{Component} from 'react'
import {Form,Row,Col,Select,Input,DatePicker,Switch,InputNumber,Button} from 'antd'

import services from 'services'
import collectData from 'utils/collectData'

import style from './style.less'

const FormItem = Form.Item
const {Option} = Select

class ReceiveCar extends Component{
  state = {
    counselor: [],
  }
  componentDidMount(){
    services.list({keys:{name:'store/staff'},data:{q:{page:-1, where: {'business[~]': 1, isJob: 1}}}}).then(res => {
      if(res.success){
        this.setState({
          counselor: res.list,
        })
      }
    })
  }
  handleSubmit = (e) => {
    collectData('order')
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if(!err){
        this.props.dispatch({
          type: 'maintainBilling/setParkInfo',
          payload: values,
        })
        this.props.onOk(1)
      }
    })
  }
  render(){
    const {getFieldDecorator} = this.props.form
    const {value} = this.props
    const {counselor} = this.state
    return(
      <Form className={style["receive-car"]}>
        <Row gutter={{lg:24,xxl:108}} >
          <Col span={8}>
            <FormItem label='服务顾问' colon={false}>
              {getFieldDecorator('counselor',{
                initialValue: value.counselor || undefined,
                rules:[{required: true, message: '请选择服务顾问'}],
              })(
                <Select size='large' getPopupContainer={triggerNode => triggerNode.parentNode}>
                  {
                    counselor.map(item => (
                      <Option key={item.staffId} value={item.staffId}>{item.staffName}</Option>
                      )
                    )
                  }
                </Select>
              )}
            </FormItem>
          </Col>
          <Col  span={8}>
            <FormItem label={<span><span>进店里程</span><span style={{color: '#999'}}>（{`上次里程：${value.prevMileage || 0}km`}）</span></span>} colon={false}>
              {getFieldDecorator('mileage',{
                initialValue:value.mileage || undefined,
                rules: [
                  {required: true, message: '请输入进店里程' },
                  {validator: (rule, val, callback) => {
                    const reg =  /^(0|\+?[1-9][0-9]*)$/
                    if(val && (!reg.test(val))){
                      callback('请输入正整数字')
                    }else if(val && (val < (value.prevMileage || 0))){
                      callback('输入里程不得小于上次里程')
                    }else {
                      callback()
                    }
                  }},
                ],
              })(
                <Input addonAfter='Km'  style={{width: '100%'}} size='large'/>
              )}
            </FormItem>
          </Col>
          <Col  span={8}>
            <FormItem label='维修类型' colon={false}>
              {getFieldDecorator('type',{initialValue:value.type || undefined})(
                <Select size='large' getPopupContainer={triggerNode => triggerNode.parentNode}>
                  <Option value={1}>普通维修</Option>
                  <Option value={2}>保险维修</Option>
                  <Option value={3}>内部维修</Option>
                  <Option value={4}>其他维修</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row  gutter={{lg:24,xxl:108}}>
          <Col  span={8}>
            <FormItem label='进店时间' colon={false}>
              {getFieldDecorator('baguetteTime',{initialValue:value.baguetteTime || undefined})(
                <DatePicker size='large' style={{width:'100%'}} getCalendarContainer={trigger => trigger.parentNode}/>
              )}
            </FormItem>
          </Col>
          <Col  span={8}>
            <FormItem label='进店油表' colon={false}>
              {getFieldDecorator('oil',{initialValue:value.oil || undefined})(
                <Select size='large' getPopupContainer={triggerNode => triggerNode.parentNode}>
                  <Option value={1}>空</Option>
                  <Option value={2}>小于1/4</Option>
                  <Option value={3}>1/4</Option>
                  <Option value={4}>1/2</Option>
                  <Option value={5}>3/4</Option>
                  <Option value={6}>满</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col  span={8}>
            <FormItem label='预计交车' colon={false}>
              {getFieldDecorator('carTime',{initialValue:value.carTime || undefined})(
                <DatePicker size='large' style={{width:'100%'}} placeholder='' getCalendarContainer={trigger => trigger.parentNode}/>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row  gutter={{lg:24,xxl:108}}>
          <Col  span={8}>
            <FormItem label='车主嘱咐' colon={false} >
              {getFieldDecorator('enjoin',{
                initialValue:value.enjoin || undefined,
                rules:[{max: 200, message: '最多输入200字'}],
              })(
                <Input  size='large' />
              )}
            </FormItem>
          </Col>
          <Col  span={8}>
            <FormItem label={<span><span>门店备注</span><span style={{color: '#999'}}>（仅供店内查看）</span></span>} colon={false}>
              {getFieldDecorator('remark',{
                initialValue:value.remark || undefined,
                rules:[{max: 200, message: '最多输入200字'}],
              })(
                <Input  size='large' />
              )}
            </FormItem>
          </Col>
          <Col  span={8}>
            <FormItem label={<span><span>温馨提示</span><span style={{color: '#999'}}>（顾客可见，打印到订单）</span></span>} colon={false}>
              {getFieldDecorator('tip',{
                initialValue:value.tip || undefined,
                rules:[{max: 200, message: '最多输入200字'}],
              })(
                <Input  size='large' />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row  gutter={{lg:24,xxl:108}}>
          <Col  span={8}>
            <FormItem label='车架号' colon={false}>
              {getFieldDecorator('vin',{
                initialValue:value.vin || undefined,
                rules: [
                  {pattern: '^[\\w\\s]+$', message: '请输入正确的车架号'},
                  {len: 17, message: '请输入17位正确的车架号'},
                  ],
              })(
                <Input size='large' />
              )}
            </FormItem>
          </Col>
          <Col  span={8}>
            <FormItem label='发动机号' colon={false}>
              {getFieldDecorator('engineNo',{
                initialValue:value.engineNo || undefined,
                rules: [
                  {pattern: '^[\\w\\s]+$', message: '请输入正确的发动机号'},
                  {min: 6, message: '请输入6-15位的发动机号'},
                  {max: 15, message: '请输入6-15位的发动机号'},
                  ],
              })(
                <Input size='large' />
              )}
            </FormItem>
          </Col>
          <Col  span={8}>
            <FormItem label='保险到期' colon={false}>
              {getFieldDecorator('insurance',{initialValue:value.insurance || undefined})(
                <DatePicker size='large' style={{width:'100%'}} placeholder='' getCalendarContainer={trigger => trigger.parentNode} />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row  gutter={{lg:24,xxl:108}}>
          <Col  span={8}>
            <FormItem label='故障描述' colon={false}>
              {getFieldDecorator('desc',{
                initialValue:value.desc || undefined,
                rules:[{max: 200, message: '最多输入200字'}],
              })(
                <Input  size='large' />
              )}
            </FormItem>
          </Col>
          <Col  span={8}>
            <FormItem label='维修建议' colon={false}>
              {getFieldDecorator('suggest',{
                initialValue:value.suggest || undefined,
                rules:[{max: 200, message: '最多输入200字'}],
              })(
                <Input  size='large' />
              )}
            </FormItem>
          </Col>
          <Col  span={8}>
            <FormItem label='车检(年审)到期' colon={false}>
              {getFieldDecorator('carInsurance',{initialValue:value.carInsurance || undefined})(
                <DatePicker size='large' style={{width:'100%'}} placeholder='' getCalendarContainer={trigger => trigger.parentNode}/>
              )}
            </FormItem>
          </Col>
        </Row>
        <div className='flex' style={{alignItem:'center',margin:'20px 0'}}>
          <FormItem  style={{margin:0}}>
            <span>质量保证期为</span>
            {getFieldDecorator('km',{initialValue:value.km || undefined})(
              <InputNumber precision={1} min={0} size='large' style={{width:80,margin:'0 5px'}} />
            )}
          </FormItem>
          <FormItem   style={{marginBottom:0}}>
            <span>公里或</span>
            {getFieldDecorator('days',{initialValue:value.days || undefined})(
              <InputNumber precision={0} min={0} size='large' style={{width:80,margin:'0 5px'}} />
            )}
            <span>天。</span>
          </FormItem>
          <FormItem style={{marginLeft: 100}}>
            <span style={{marginRight:20,color:'#333'}}>是否需要终检</span>
            {getFieldDecorator('finalInspection',{
              valuePropName: 'checked',
              initialValue:value.finalInspection})(
              <Switch/>
            )}
          </FormItem>
        </div>
        <div>
          <Button type='primary' size='large' style={{marginBottom: 32}} onClick={this.handleSubmit}>保存并下一步</Button>
        </div>
      </Form>
    )
  }
}

export default Form.create()(ReceiveCar)
