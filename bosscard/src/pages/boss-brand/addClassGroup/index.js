import React,{ Component } from 'react'
import router from 'umi/router'
import style from './style.less'
import { Icon , Form ,Input , Button , Select , message}  from 'antd'
import services from "services"
import { Array } from 'core-js';

const FormItem = Form.Item
const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 8 },
}
const Option =Select.Option
const days=['0','0.5','1','1.5','2' ]
const times=[
     '00:00',
     '00:30',
     '01:00',
     '01:30',
     '02:00',
     '02:30',
     '03:00',
     '03:30',
     '04:00',
     '04:30',
     '05:00',
     '05:30',
     '06:00',
     '06:30',
     '07:00',
     '07:30',
     '08:00',
     '08:30',
     '09:00',
     '09:30',
     '10:00',
     '10:30',
     '11:00',
     '11:30',
     '12:00',
     '12:30',
     '13:00',
     '13:30',
     '14:00',
     '14:30',
     '15:00',
     '15:30',
     '16:00',
     '16:30',
     '17:00',
     '17:30',
     '18:00',
     '18:30',
     '19:00',
     '19:30',
     '20:00',
     '20:30',
     '21:00',
     '21:30',
     '22:00',
     '22:30',
     '23:00',
     '23:30',
     '24:00',
     ]
class addClassGroup extends Component{
    constructor(prop){
        super(prop)
        this.state={
           warningShow : true,
           isAddClass:true,//判断是否是新增
           startIndex:-1, // 记录开始时间索引
           endIndex:50,//记录结束索引
           defaultValue:{
             name:'', //班次名称
             attendanceNumber:'', //出勤数
             salaryPlanNumber:'', //计薪数
             startTime:'',//开始时间
             endTime:'',//结束时间
             index:'', //序号
             remarks:'',//备注
           },
        }
    }
    onTableChange=(e)=>{
       if(e===217){
           console.log(8888)
           router.push('/boss-brand/addClassGroup')
       }
    }
    closeWarning=()=>{
        this.setState({
            warningShow:false,
        })
    }
    formatArray = (array)=>{
        let  arr = Array.from( new Set( array.sort((b,a)=>a.year*1-b.year*1).map(i=>i.year) ) ) //遍历所有年份
        let trueArray =[]
        arr.forEach(item=>{
            let newArray = [ ...array.filter(i=>i.year*1 === item) ]
            .map(i=>{
                return {
                    ...i,
                    timeStamp:i.year+'-'+i.date,  // 添加时间戳格式
                }
            })
            .sort((b,a)=>Date.parse(a.timeStamp)-Date.parse(b.timeStamp))
        trueArray.push(newArray)       
        })
        return trueArray
    }
    UNSAFE_componentWillMount(){
        const { location } = this.props
        let id =location.query.id
        if(id){
            services.giveStoreShift({ keys:{ name:'brand/shift',id }  }).then(res=>{
                if(res.code==='0'){
                    this.setState({
                        defaultValue:res.data,
                        isAddClass:false,
                        id,
                    })
                }
            })
        }
    }
    handleSubmit=(e)=>{
        e.preventDefault()
        const { isAddClass , id } = this.state
        if(isAddClass){
            this.props.form.validateFields((err,value)=>{
                if(!err){
                    console.log(value.name)
                    services.addStoreShift({ keys: {name: 'brand/shift'} ,data:{ ...value } }).then(res=>{
                        if(res.code==='0'){
                            message.success('添加成功')
                            this.timer=setTimeout(()=>{
                                router.push('/boss-brand/classManagement')
                            },500)
                        }else{
                            message.info('网络出现错误')
                        }
                    })
                }
            })
        }
        else{
            this.props.form.validateFields((err,value)=>{
                if(!err){
                    console.log(value.name)
                    services.setStoreShift({ keys: {name: 'brand/shift' , id } ,data:{ ...value } }).then(res=>{
                        if(res.code==='0'){
                            message.success('修改成功')
                            this.timer=setTimeout(()=>{
                                router.push('/boss-brand/classManagement')
                            },500)
                        }else{
                            message.info('网络出现错误')
                        }
                    })
                }
            })
        }

    }
    componentWillUnmount(){
        clearTimeout(this.timer)
    }
    selectStartTime=(e)=>{
      console.log('start',e)
      this.setState({
          startIndex:times.indexOf(e),
          endIndex:50,
      })
    }
    selectEndTime=(e)=>{
      this.setState({
          endIndex:times.indexOf(e),
          startIndex:-1,
      })
    }
    resertForm=()=>{
        this.props.form.resetFields()
        router.push('/boss-brand/classManagement')
    }
    validateName=()=>{
      this.props.form.validateFields( ['name'],(err,value)=>{
         if(value.name==='休息'  ){
             this.props.form.setFields({
                name: {
                errors: [new Error('名称不能为休息')],
                },
              })
         }
         else if(value.name===''){
            this.props.form.setFields({
                name: {
                errors: [new Error('名称不能为')],
                },
              })
         }
         else{
             services.validate({ keys:{ name:'data/validate' } ,data:{ key:'name',model:'Shift',value:value.name, _var: '0|1' } }).then(res=>{
                if(!res.success){
                    this.props.form.setFields({
                        name: {
                        errors: [new Error(res.content)],
                        },
                    })
                }else{
                    return false
                }
             })
         }
      })
    }
    render(){
        const {
             warningShow ,
             defaultValue ,
             startIndex ,
             endIndex ,
             } = this.state
        console.log(startIndex,endIndex)
        const { getFieldDecorator } = this.props.form
        const s={ height:'40px', width:'350px' }
        const placeholderInitialValue={
            attendanceNumber:defaultValue.attendanceNumber ? {  initialValue:defaultValue.attendanceNumber } : {},
            salaryPlanNumber:defaultValue.salaryPlanNumber ? {  initialValue:defaultValue.salaryPlanNumber } : {},
            startTime:defaultValue.startTime ? {  initialValue:defaultValue.startTime } : {},
            endTime:defaultValue.endTime ? {  initialValue:defaultValue.endTime } : {},
        }
        return <div>
          <div className={ style.zl_addHeader }  ><p>新建班次</p></div>
          { warningShow
             &&
          <div className={ style.zl_warning } >此功能为员工进行排班使用 <Icon style={{ float:'right' , marginTop:'22px' , marginRight:'25px' }}  onClick={ this.closeWarning }  type="close" /> </div> }
          <div className={ style.zl_formContent } >
           <Form onSubmit={this.handleSubmit}   >
            <FormItem
            label="班次说明"
            style={{ marginBottom:'40px' }}
            { ...formItemLayout }
            >
             {getFieldDecorator('name', {
              rules: [{
               required: true,
               message: '请输入班次说明,班次名称长度不能超过7个字符',
               max:7,
                }],
                initialValue:defaultValue.name,
             })(
             <Input style={s} onBlur={ this.validateName }  placeholder="请输入班次说明"  type="text" />
            )}
            </FormItem>
             <FormItem
            label="出勤数"
            style={{ marginBottom:'40px' }}
            { ...formItemLayout }
            >
             {getFieldDecorator('attendanceNumber', {
              rules: [{
               required: true, message: '请选择出勤数',
                }],
                ...placeholderInitialValue.attendanceNumber,
              })(
             <Select  size="large"  style={s} placeholder="请选择出勤数" >
             { days.map((item,idx)=><Option   value={item} key={idx}  >{item}</Option>) }
             </Select>
            )}
             </FormItem>
             <FormItem
            label="计薪数"
            style={{ marginBottom:'40px' }}
            { ...formItemLayout }
            >
             {getFieldDecorator('salaryPlanNumber', {
              rules: [{
               required: true, message: '请选择计薪数',
                }],
                ...placeholderInitialValue.salaryPlanNumber,
             })(
             <Select   size="large" style={s} placeholder="请选择计薪数" >
             { days.map((item,idx)=><Option value={item}  key={idx}  >{item}</Option>) }
             </Select>
            )}
             </FormItem>
             <FormItem
            label="开始时间"
            style={{ marginBottom:'40px' }}
            { ...formItemLayout }
            >
             {getFieldDecorator('startTime', {
              rules: [{
               required: true, message: '请选择开始时间',
                }],
                ...placeholderInitialValue.startTime,
             })(
             <Select  onSelect={this.selectStartTime}  dropdownClassName={style.zl_scoll}   size="large" style={s} placeholder="请选择开始时间" >
             { times.map((item,idx)=><Option value={item}   disabled={endIndex>idx? false : true }   key={idx}  >{item}</Option>) }
             </Select>
            )}
            </FormItem>
            <FormItem
            label="结束时间"
            style={{ marginBottom:'40px' }}
            { ...formItemLayout }
            >
             {getFieldDecorator('endTime', {
              rules: [{
               required: true, message: '请选择结束时间',
                }],
               ...placeholderInitialValue.endTime,
             })(
             <Select  onSelect={this.selectEndTime}  size="large" style={s} placeholder="请选择结束时间" >
             { times.map((item,idx)=><Option value={item} disabled={startIndex<idx ? false : true  }   key={idx}  >{item}</Option>) }
             </Select>
            )}
            </FormItem>
            {/* <FormItem
            label="序号"
            style={{ marginBottom:'40px' }}
            { ...formItemLayout }
            >
             {getFieldDecorator('index', {
                initialValue:defaultValue.index,
             })(
             <Input style={s} type="text" />
            )}
            </FormItem> */}
            <FormItem
            label="备注"
            { ...formItemLayout }
            style={{ marginBottom:'40px' }}
            >
             {getFieldDecorator('remarks', {
                initialValue:defaultValue.remarks,
             })(
             <Input style={{ ...s , height:'80px' }}  placeholder="请输入备注信息"   type="text" />
            )}
            </FormItem>
            <FormItem style={{ marginLeft:'17%' }} >
              <Button  style={{ width:'88px' , height:'40px' }}  type="primary" htmlType="submit"   >
                    完成
              </Button>
              <Button  style={{ marginLeft:'16px',  height:'40px' , width:'88px' } }  onClick={ this.resertForm }  >
                 取消
             </Button>
            </FormItem>
           </Form>
          </div>
        </div>
    }
}
export default  Form.create()(addClassGroup)
