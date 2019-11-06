import React,{ Component } from 'react'
// import CommonTable from '../../../components/CommonTable/index'
import {connect}   from 'dva'
import { Form ,Input ,Button ,Icon,DatePicker,Select } from 'antd'
import  styles  from '../styles.less'
import services from 'services'
import moment from 'moment'
const Option =Select.Option
const FormItem = Form.Item
const { RangePicker } = DatePicker
const filterTime=(a)=>{
   return moment(`${moment(a).format('YYYY-MM-DD')} 00:00:00`).unix()
}
class commonForm extends Component{
    constructor(){
        super()
        this.state={
            searchShow:false,
            rotate:false,
            payTypeList:[],
            currentPage:1,
        }
    }
    handleSubmit=(e)=>{
        e.preventDefault()
        this.props.form.validateFields((err,value)=>{
             if(!err){
                 var o={}
                 for(var key in value){
                    switch(key){
                        case 'client' :
                             value[key] ? o['clientPhone[~]|clientName[~]']=value[key] :null
                             break
                        case 'completed':
                             value[key] ? o['completed[<>]']=value[key].map(i=>filterTime(i)) : null
                             break
                        case 'created' :
                            value[key] ? o['created[<>]']=value[key].map(i=>filterTime(i)) : null
                             break
                        case 'received':
                            value[key] ? o['received[<>]']=value[key].map(i=>filterTime(i)) : null
                             break
                        case 'cancelAccount':
                             value[key] ? o['cancelAccount[<>]']=value[key].map(i=>filterTime(i)) : null
                             break
                        default :
                            value[key] ? o[key+'[~]']=value[key] :null
                    }
                 }
                 console.log(o)
                 this.props.commitForm(o)
             }
        })
    }
    searchShow=()=>{
        this.setState({
            searchShow:!this.state.searchShow,
        })
    }
    UNSAFE_componentWillReceiveProps(nextsprops){
        const { currentPage } = nextsprops
        this.setState({
            currentPage,
        },()=>{
            console.log(this.state.currentPage)
        })
    }
    UNSAFE_componentWillMount(){
        services.paymentList({ keys: {name: 'store/payment/list'}  } ).then(res=>{
             this.setState( { payTypeList:res.list }  )
        })

    }
    ranch=()=>{
        this.setState({
            rotate:true,
        },()=>{
            window.ranch = setTimeout(()=>{
          this.setState({
              rotate:false,
              currentPage:1,
          })
           this.props.form.resetFields()
           this.props.getData(true)
           },0)
        })
    }
    changePayType=(val)=>{
        console.log(val)
    }
    componentWillUnmount(){
        clearTimeout(window.ranch)
    }
    onChange=(v)=>{
       console.log(v)
    }
    render(){
        const { getFieldDecorator } = this.props.form
        const { isDoing } = this.props
        const { payTypeList } = this.state
        return (<div  >
                     {/* <div className={styles.zl_r} >
                        <Icon   onClick={ this.ranch }  type="sync" spin={ this.state.rotate } />
                     </div> */}
                     <Form onSubmit={this.handleSubmit}  layout="inline" style={{ padding:'32px 40px 34px 40px ' }} >
                            <FormItem   style={ { marginBottom:'30px' } }    label="车牌号" >
                            {getFieldDecorator('licenseNo', {
                            })(
                                <Input style={ {width:'220px', height:'40px'  } }   />
                            )}
                            </FormItem>

                            <FormItem   style={ { marginBottom:'30px' } }    label="车架号" >
                            {getFieldDecorator('frameNumber', {
                            })(
                                <Input style={ {width:'220px', height:'40px'  } }   />
                            )}
                            </FormItem>

                             <FormItem   style={ { marginBottom:'30px' } }    label="客户信息" >
                            {getFieldDecorator('client', {
                            })(
                                <Input style={ {width:'220px', height:'40px'  }     }    placeholder="客户名称/手机号" />
                            )}
                            </FormItem>
                            <FormItem    style={ { marginBottom:'30px' } }    label="订单类型" >
                                {getFieldDecorator('listType', {
                                })(
                                    <Select  disabled  onChange={  this.changePayType   }  style={{ width: 220 ,height:40 }}  size='large'>
                                             <Option key={0}  value={0}>全部</Option>
                                             <Option key={1}  value={1}>快捷</Option>
                                             <Option key={2}  value={2}>维修</Option>
                                    </Select>
                                )}
                           </FormItem>


                            { !this.state.searchShow ? 
                             <FormItem    >
                                        <Button  style={ { height:'40px' , width:'88px' } }  type="primary" htmlType="submit"   >
                                           查询
                                        </Button>
                            </FormItem>
                            :
                            null 
                            }
                             { !this.state.searchShow ? 
                             <FormItem    >
                                        <Button  style={ { height:'40px' , width:'88px' } }  onClick={ this.ranch }  >
                                           重置
                                        </Button>
                            </FormItem>
                            :
                            null 
                            }
                            { this.state.searchShow ?  <div className={ styles.zl_searchShow }  onClick={ this.searchShow } >精简筛选条件 <Icon type="double-right" style={{ transform:'rotateZ(-90deg)' }} /></div> :   <div  className={ styles.zl_searchShow }  onClick={ this.searchShow }>更多筛选条件 <Icon type="double-left" style={{ transform:'rotateZ(-90deg)' }} /></div> }
                            { !this.state.searchShow || <div>
                            <FormItem   style={ { marginBottom:'30px' } }    label="订单号" >
                            {getFieldDecorator('orderNo', {
                            })(
                                <Input style={ {width:'220px', height:'40px'  }     }   />
                            )}
                            </FormItem>

                            <FormItem   style={ { marginBottom:'30px' } }    label="接车员" >
                            {getFieldDecorator('counselorName', {
                            })(
                                <Input  style={ {width:'220px', height:'40px'  }     }   placeholder="员工名称/手机号" />
                            )}
                            </FormItem>

                            <FormItem   style={ { marginBottom:'30px' } }    label="车型" >
                            {getFieldDecorator('vehicleType', {
                            })(
                                <Input style={ {width:'220px', height:'40px'  }     }   />
                            )}
                            </FormItem>

                            <FormItem   style={ { marginBottom:'30px' } }    label="商品" >
                            {getFieldDecorator('productName', {
                            })(
                                <Input  disabled  style={ {width:'220px', height:'40px'  }     }   placeholder="" />
                            )}
                            </FormItem>
                             <br />
                            <FormItem   style={ { marginBottom:'30px' } }    label="项目" >
                            {getFieldDecorator('projectName', {
                            })(
                                <Input  disabled  style={ {width:'220px', height:'40px'  }     }   placeholder="" />
                            )}
                            </FormItem>

                            { !isDoing || (
                                <FormItem   style={ { marginBottom:'30px' } }    label="支付方式" >
                                {getFieldDecorator('paymentMode', {
                                })(
                                    <Select    onChange={  this.changePayType   }  style={{ width: 220 ,height:40 }}  size='large'>
                                    {
                                        payTypeList.map(item => (
                                        <Option key={item.paymentId}  value={item.paymentId}>{item.paymentName}</Option>
                                        ))
                                    }
                                    </Select>
                                )}
                                </FormItem>
                            ) }

                           {
                               !isDoing || (
                                <FormItem   style={ { marginBottom:'30px' } }    label="销账状态" >
                                {getFieldDecorator('productName78', {
                                })(
                                    <Select  disabled   onChange={  this   }  style={{ width: 220 ,height:40 }}  size='large'>
                                        <Option key={0}  value={0}>全部</Option>
                                        <Option key={1}  value={1}>未挂账</Option>
                                        <Option key={2}  value={2}>已销账</Option>
                                    </Select>
                                )}
                                </FormItem>
                               )
                           }

                            <br/>
                             { !isDoing || (
                                 <div>

                             <FormItem    style={ { marginBottom:'30px' } }    label="结算时间" >
                            {getFieldDecorator('completed', {
                            })(
                                <RangePicker  size="large"   onChange={this.onChange}   style={ {width:'520px', height:'40px'  }     }   />
                            )}
                            </FormItem>


                              <FormItem    style={ { marginBottom:'30px' } }    label="销账时间" >
                            {getFieldDecorator('cancelAccount', {
                            })(
                                <RangePicker  size="large"   onChange={this.onChange}   style={ {width:'520px', height:'40px'  }     }   />
                            )}
                            </FormItem>


                            <br/>
                                 </div>
                             ) }
                             <FormItem   style={ { marginBottom:'10px' } }    label="开单时间" >
                            {getFieldDecorator('created', {
                            })(
                                <RangePicker  size="large"    style={ {width:'520px', height:'40px'  }     }   />
                            )}
                            </FormItem>


                              <FormItem   style={ { marginBottom:'10px' } }    label="进厂时间" >
                            {getFieldDecorator('received', {
                            })(
                                <RangePicker  size="large"    style={ {width:'520px', height:'40px'  }     }   />
                            )}
                            </FormItem>
                            <FormItem    >
                                        <Button  style={ { height:'40px',width:'88px'} }  type="primary" htmlType="submit"   >
                                           查询
                                        </Button>
                            </FormItem>
                            <FormItem    >
                                        <Button  onClick={ this.ranch }   style={ { height:'40px',width:'88px'} }    >
                                           重置
                                        </Button>
                            </FormItem>
                                  </div>
																	 }
                     </Form>



                </div>)
    }
}


export default connect()(Form.create()(commonForm))
