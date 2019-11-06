import React,{ Component } from 'react'
import { Form ,Input ,Button , message } from 'antd'
import style from '../style.less'
import { formData } from '../data'
import services from 'services'
const FormItem = Form.Item
//
class payBilling extends Component{
    constructor(){
        super()
        this.state={
            data:[],
            id:null,
        }
    }
    handleSubmit=(e)=>{
        const { id  } = this.state
        e.preventDefault()
        this.props.form.validateFields((err,value)=>{
             if(!err){
                var o={}
                for(var key in value  ){
                    value[key] ? o[key]=value[key] :null
                }
                services.SettingPrinting({keys: {name: 'printing/setting/order'}, data:{ ...o,id } }).then(res=>{
                     res.success ? message.success('修改成功') : message.info('网络异常')
                })
             }
        })
    }
    getDefaultValue=( data ,val )=>{
       let value
       for(let key in data  ){
           key === val ? value=data[key] : null
       }
       return value
    }
    componentDidMount(){
     services.printingSetting({  keys: {name: 'printing/setting/order'} }).then(res=>{
          if( res.success ){
              this.setState({
                  data:formData.map(item=>{
                      return {
                                ...item,
                                defaultValue:this.getDefaultValue( res.data , item.value),
                             }
                  }),
                  id:res.data.id,
                })
          }
     })
   }
    handerReset=()=>{
       this.props.form.resetFields()
    }
    render(){
        const { getFieldDecorator } = this.props.form
        const { data } =this.state
        return <div  className={ style.zl_payBillingForm } >
                    <Form onSubmit={this.handleSubmit}  layout="inline" style={{ height:'500px' ,position:'relative'}} >
                          {
                      data.map((item,idx)=>{
                    return   idx<(data.length-1)?<FormItem  key={ idx }   style={ { marginBottom:'30px',width:'30%' } }   labelCol={{span: 5, offset: 1.5}}   label={ item.label } >
                                    {getFieldDecorator(item.value, {
                                        //   rules: [{ required: true, message: '此项必填' }],
                                      initialValue:item.defaultValue,
                                    })(
                                    <Input   style={ {width:'400px', height: item.strong ? '80px' : '40px'  } } type={ 'text'  }   />
                                    )}
                               </FormItem> :<FormItem  key={ idx }   style={ { marginBottom:'30px',width:'30%' } }   labelCol={{span: 5, offset: 1.5}}   label={ item.label } >
                                    {getFieldDecorator(item.value, {
                                        //   rules: [{ required: true, message: '此项必填' }],
                                      initialValue:item.defaultValue,
                                    })(
                                    <Input.TextArea   style={ {width:'400px'}} />
                                    )}
                               </FormItem> 
                      })
                          }
                        <div style={ { position:'absolute',left:0,zIndex:2000 } } >
                            <FormItem   >
                                <Button type="primary" htmlType="submit" style={ {  width:'120px',height:'40px' } }  >保存</Button>
                            </FormItem>
                            <FormItem   >
                                <Button onClick={ this.handerReset }   style={ {  width:'120px',height:'40px' } }  >取消</Button>
                            </FormItem>
                        </div>

                    </Form>

               </div>
    }
}
export default Form.create()(payBilling)
