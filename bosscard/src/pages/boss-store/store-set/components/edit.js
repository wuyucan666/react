import React, { Component } from 'react'
import {
  Form,
  Input,
  Icon,
  Row,
  Col,
  Button,
  TimePicker,
  message,
} from 'antd'
import  services from '../../../../services/index'
import style from '../style.less'
import moment from 'moment'
const { TextArea } = Input

 class Edit extends Component {
   constructor(props){
     super(props)
     this.state={
      weekState: false,
      weekArr: [
          { name: '周一', id: 1, change: false },
          { name: '周二', id: 2, change: false },
          { name: '周三', id: 3, change: false },
          { name: '周四', id: 4, change: false },
          { name: '周五', id: 5, change: false },
          { name: '周六', id: 6, change: false },
          { name: '周日', id: 7, change: false },
      ],
      week:'',
      startTime:'',
      endTime:'',
     }
   }
   show (arr) {
    for (let j in this.weekArr) {
        this.weekArr[j].change = false
        for (let i in arr) {
            if (parseInt(arr[i]) === this.weekArr[j].id) {
                this.weekArr[j].change = true
            }
        }
    }
    this.weekState = !this.weekState
}
changeWeek () {
  const {weekArr}=this.state
    let str = ''
    let arr = []
    let d = ''
    for (let j in weekArr) {
        if (weekArr[j].change) {
            arr.push(weekArr[j].id)
            if ((parseInt(d) + 1) < parseInt(j) && d !== '') {
                str = str + ','
            }
            str = str + weekArr[j].name
            d = j
        }
    }
    let ay = str ? str.split(',') : []
    let g = ''
    for (let i in ay) {
        let st = ay[i] + '、'
        if (ay[i].length > 4) {
            st = st.substring(0, 2) + '至' + st.substring((ay[i].length - 2), ay[i].length) + '、'
        }
        g = g + st
    }
    g = g.substring(0, g.length - 1)
    // this.$emit('changeWeek', { str: g, arr: arr })
    this.setState({
      weekState:false,
      week:g,
    })
}
getWeek (index) {
    const {weekArr}=this.state
    let arr=weekArr
    arr[index].change = !weekArr[index].change
    this.setState({
       weekArr:arr,
    })
    this.changeWeek()
}
   handleSubmit(){
     const {startTime,endTime,week}=this.state
     this.props.form.validateFields((err,values)=>{
       if(err){
         return
       }
       values.startTime=startTime
       values.stopTime=endTime
       values.id=this.props.data.id
       values.businessDays=week?week:this.props.data.businessDays
       services.setStoreInfo({
        keys:{name:'printing/setting/order'},
        data:{...values},
       }).then((res)=>{
         if(res.code==='0'){
          message.success('修改成功！')
         }
         this.props.onOk()
       })
     })
   }
   handleTime(v,e,s){
     switch (v) {
       case 'start':
         this.setState({
           startTime:s,
         })
         break
     
       default:
         this.setState({
           endTime:s,
         })
         break
     }
   }
   disabledHours(){
    //  console.log('hour',v)
    //  return [1,2,4]
   }
   handleCancel(){
     this.props.onCancel()
   }
   hanleTel = (rule, value, callback) => {
    const PHONE = /^[1]([3-9])[0-9]{9}$/
    const TEL = /^0\d{2,3}-?\d{7,8}$/
    if (TEL.test(value)||PHONE.test(value)||value==='') {
        callback()
    }else{
      callback('请输入正确电话')
    }

    // Note: 必须总是返回一个 callback，否则 validateFieldsAndScroll 无法响应
}
hanlePhone = (rule, value, callback) => {
  const PHONE = /^[1]([3-9])[0-9]{9}$/
  const TEL = /^0\d{2,3}-?\d{7,8}$/
  if (TEL.test(value)||PHONE.test(value)||value==='') {
      callback()
  }else{
    callback('请输入正确电话')
  }

  // Note: 必须总是返回一个 callback，否则 validateFieldsAndScroll 无法响应
}
  render() {
    const { getFieldDecorator } = this.props.form
    const {weekArr,week}=this.state
    const {data}=this.props
    const format = 'HH:mm'
    return (
      <div className={style.edit}>
        <Form>
        <Row gutter={24}>
        <Col span={8}>
          <Form.Item colon={false} label='服务电话' colon={false}>
            {getFieldDecorator(`hotLine`, {
              rules: [
                {
                  required: false,
                  message: '请输入正确电话',
                },
                  {
                    validator:this.hanlePhone.bind(this),
                  },
              ],
              initialValue:data.hotLine,
            })(<Input size='large'/>)}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item  colon={false} label='道路救援电话'>
            {getFieldDecorator(`sosHotLine`, {
              rules: [
                {
                  required: false,
                  message: '请输入正确电话',
                },
                {
                  validator:this.hanleTel.bind(this),
                },
              ],
              initialValue:data.sosHotLine,
            })(<Input size='large'/>)}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item   colon={false} label='门店地址'>
            {getFieldDecorator(`address`, {
              rules: [
                {
                  required: false,
                  message: 'Input something!',
                },
              ],
              initialValue:data.address,
            })(<Input  size='large'/>)}
          </Form.Item>
        </Col>
        </Row>
        <Row gutter={24}>
        <Col span={8}>
          <Form.Item  colon={false} label='开户行' colon={false}>
            {getFieldDecorator('bankType', {
              rules: [
                {
                  required: false,
                  message: 'Input something!',
                },
              ],
              initialValue:data.bankType,
            })(<Input  size='large'/>)}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item   colon={false} label='银行卡号'>
            {getFieldDecorator(`bankNumber`, {
              rules: [
                {
                  required: false,
                  message: 'Input something!',
                },
              ],
              initialValue:data.bankNumber,
            })(<Input size='large'/>)}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item  colon={false} label='税号'>
            {getFieldDecorator(`taxRegNo`, {
              rules: [
                {
                  required: false,
                  message: 'Input something!',
                },
              ],
              initialValue:data.bankNumber,
            })(<Input size='large' />)}
          </Form.Item>
        </Col>
        </Row>
        <Row gutter={24}>
        <Col span={8}>
          <Form.Item   colon={false} label='营业时间' colon={false}>
            {getFieldDecorator(`businessDays`, {
              rules: [
                {
                  required: false,
                  message: 'Input something!',
                },
              ],
              initialValue:data.taxRegNo,
            })(<div className={style.time}>
              <div className={style.selWeek}><Icon style={{position:'absolute',zIndex:'100',left:'10px',top:'14px',color:'#999999'}} type='calendar'></Icon>
              <Input size='large' value={week?week:data.businessDays} style={{paddingLeft:"25px"}}></Input >
              <div className={style.pop}>
                {weekArr.map((item,index)=><div key={index} onClick={this.getWeek.bind(this,index)} style={{background:item.change?'#4AACF7':'',color:item.change?'#fff':''}}>{item.name}</div>)}
              </div>
              </div>
              <div>
                <TimePicker size='large' defaultValue={data.startTime?moment(data.startTime,'HH:mm'):""} format={format} placeholder='开始时间' style={{width:'98px'}} disabledHours={this.disabledHours.bind(this)} onChange={this.handleTime.bind(this,'start')}></TimePicker>
              <TimePicker size='large' defaultValue={data.stopTime?moment(data.stopTime,'HH:mm'):''} format={format} placeholder='结束时间' style={{width:'98px'}} onChange={this.handleTime.bind(this,'end')}></TimePicker>
              </div>
            </div>)}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item    colon={false} label='备注'>
            {getFieldDecorator(`remark`, {
              rules: [
                {
                  required: false,
                  message: 'Input something!',
                },
              ],
              initialValue:data.remark,
            })(<TextArea maxlength='50' placeholder="请输入备注信息" />)}
          </Form.Item>
        </Col>
        </Row>
        <div style={{marginTop:'30px'}}>
        <Button type='primary' style={{marginRight:'12px'}} htmlType="submit" onClick={this.handleSubmit.bind(this)}>保存</Button>
        <Button onClick={this.handleCancel.bind(this)}>取消</Button>
        </div>
        </Form>
      </div>
    )
  }
}
const WrappedRegistrationForm = Form.create({ name: 'register' })(Edit)
export default WrappedRegistrationForm