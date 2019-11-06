import React, { Component } from 'react'
import { Modal,Form, DatePicker ,Select,Input,message,Spin} from "antd"
import  styles  from '../styles.less'
// import moment from 'moment'
import services from "../../../../services"
import { connect } from 'dva'
import debounce from 'lodash/debounce'
const Option=Select.Option
const { TextArea } = Input
class WarnModel extends Component {
  constructor(props){
    super(props)
    this.state = {
      visible:false,
       addWarnShow:false,
       data:[],
       value: '',
    carId: '',
    clientInfo: {},
    result: [],
    page: 1,
    totalPage: 1,
    loading: false,
    hide:true,
    type:null,
    order:[],
    spin:false,
    orderValue:'',
    }
    this.onSearch = debounce(this.onSearch, 500)
  }
  hideWarn(){
    this.props.hide('warn')
    this.props.form.resetFields()
    this.setState({
      type:null,
      value:'',
      orderValue:'',
    })
    this.props.dispatch({
      type: "table/getData",
      payload: { new: true },
    })
  }
  handleSubmit = (e) => {
    e.preventDefault()

    e.preventDefault()
    // this.props.form.validateFields((err, fieldsValue) => {
    //   if(err){
    //     message.err('添加失败')
    //     return
    //   }
    //   // returnVisitId:id,
    // const remind={
    //   type:fieldsValue['visitTime'].format('YYYY-MM-DD'),
    //   values:fieldsValue['visitStaff'],
    //   satisfaction:fieldsValue['survey'],
    //   validity:fieldsValue['ravilidity'],
    //   nextTime:fieldsValue['visitTime'].format('YYYY-MM-DD'),
    //   items:this.props.tableData.map(item=>{return {id:item.id,score:item.score}}),
    // }
    // services.addReturnVisitRecord({keys:{name:"returnVisit/record"},data:{record:record}}).then(()=>{
    //   message.success('添加成功')
    //   this.props.hide('record')
    // })
    // })
  }
  addSubmit(){
    this.props.form.validateFields((err, fieldsValue) => {
      if(err){
        return
      }
      this.setState({
        spin:true,
      })
      let clientId = fieldsValue['selectClient']
      // const {result} = this.state
      // let clientId = result.find((_) => _.carId === Number(carId)) ? result.find((_) => _.carId === Number(carId)).clientId : ''
      const returnVisit={
        // carId,
        clientId,
        type:Number(fieldsValue['warnType']),
        reason:fieldsValue['reason'],
        orderNo:String(fieldsValue['orderNo']),
        nextTime:parseInt(fieldsValue['next'].valueOf()/1000),
      }
      if(this.state.type!==6){
        delete returnVisit.orderNo
      }else{
        if(this.state.order.length===0){
          message.warn('暂无关联订单号')
          return
        }
      }

      services.addRemindWarn({keys:{name:'returnVisit/visit'},data:returnVisit}).then(res=>{
        this.setState({
          spin:false,
        })
        if(res.code==='0'){
          message.success('添加成功')
          this.props.form.resetFields()
          this.setState({
            type:null,
            value:'',
            orderValue:'',
          })
          this.props.hide('warn')
          this.props.dispatch({
            type: "table/getData",
            payload: { new: true },
          })
        }else{
          message.error('添加失败')
        }
      })
    })
  }
  onSearch = (value) => {
    this.setState({page: 1, result: []},()=>{
      this.getResult(value)
    })
  }
  /**
   * 搜索会员
   */
  getResult = (value, isScroll) => {
    const {page}=this.state
    this.setState({loading: true})
    services.LIST({
      keys : {
        name: 'store/clients',
      },
      data:{
        name:value,
        q: {page: page},
      },
    }).then(res => {
      if(res.totalSize===0){
        this.props.form.setFieldsValue({visitStaff:null})
      }
      if(res.code==='0'){
        this.setState((prevState => ({
          value,
          result: isScroll ? prevState.result.concat(res.list) : res.list,
          totalPage: res.totalPage,
          loading: false,
        })))
      }
    })
  }
  /**
   * 关联订单号
   */
  getOrder(value){
    var id=this.props.form.getFieldValue('selectClient')
    // console.log('type',typeof(this.state.type))
    if(this.state.type===6){
      services.getOrderNo({keys:{name:'maintain/selector'},data:{q:{where:{'orderNo[~]':value,clientId:id}}}}).then(res=>{
        // this.setState((prevState => ({
        //   order: isScroll ? prevState.order.concat(res.list) : res.list,
        // })))
        // console.log('sdf',res)
        this.setState({
          order:res.list,
        })
      })
    }
    this.setState({
      orderValue:value,
    })
  }
  setMember = (carId) => {
    const {result} = this.state
    const clientInfo = result.find((_) => _.carId === Number(carId))
    this.setState({carId, clientInfo})
  }

  reset = () => {
    this.setState({
      carId: '',
    })
    this.props.goBack()
  }

  popupScroll = (e) => {
    e.persist()
    let target = e.target
    if ((target.scrollTop + target.offsetHeight) === target.scrollHeight) {
      const {page, totalPage, value} = this.state
      if(page < totalPage){
        this.setState({page: page + 1},()=>{
          this.getResult(value, true)
        })
      }
    }
  }
  onChangeType(val){
    this.setState({
      type:Number(val),
    })
  }
  render() {
    const {visible} = this.props
    const { result, value, loading,order,spin,orderValue} = this.state
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 18 },
        sm: { span: 18 },
      },
    }
    return (
      <Spin spinning={spin}>
      <div>
        <Modal
          style={{minWidth:'570px'}}
          title="添加自定义提醒"
          visible={visible}
          onOk={this.addSubmit.bind(this)}
          onCancel={this.hideWarn.bind(this)}
          okText="发布"
          cancelText="取消"
          maskClosable={false}
        >
            <div className={styles.lyc_warn}><Form layout='vertical' onSubmit={this.handleSubmit.bind(this)}>
              <Form.Item
                {...formItemLayout}
                label="选择客户"
              >
                {getFieldDecorator('selectClient', {rules: [{ required: true,type:'number', message: '请选择客户' }]})(
                  <Select
                    size="large"
                    className="item"
                    style={{width:'350px'}}
                    showSearch
                    placeholder='客户姓名/车牌号/手机号'
                    loading={loading}
                    defaultActiveFirstOption={false}
                    showArrow={false}
                    value={value||undefined}
                    filterOption={false}
                    getPopupContainer={trigger => trigger.parentNode}
                    notFoundContent={loading ? <Spin size='small' /> : null}
                    onSearch={this.onSearch}
                    onChange={this.setMember.bind(this)}
                    onPopupScroll={this.popupScroll}
                  >
                    {result&&result.map((_,index) => (
                      <Option key={index} value={_.clientId}><a>{_.plate}</a> － {_.name} － {_.phone}</Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
              <Form.Item
              {...formItemLayout}
              label='提醒类型'>
                {getFieldDecorator('warnType', {rules: [{ required: true, message: '请选择项目类型' }]})(
                  <Select
                  showSearch
                  style={{width:'350px'}}
                  size='large'
                  optionFilterProp="children"
                  onChange={this.onChangeType.bind(this)}
                  placeholder="请选择项目类型">
                  <Option value="6">施工项目到期</Option>
                  <Option value="1">车辆保险到期</Option>
                  <Option value="2">年检(年审)到期</Option>
                  <Option value="4">客户异常到店</Option>
                  <Option value="3">会员卡到期</Option>
                </Select>
                )}
              </Form.Item>
              <Form.Item
              style={{alignItems:'flex-start'}}
              {...formItemLayout}
              label='提醒原因'>
                {getFieldDecorator('reason', {rules: [{ required: true, message: '请输入原因' }]})(
                 <TextArea style={{width:'350px',boxSizing:'border-box'}} rows={4}></TextArea>
                )}
              </Form.Item>
            <Form.Item
              {...formItemLayout}
              label="关联订单号"
            >
              {getFieldDecorator('orderNo', {rules: [{ required:this.state.type===6?true:false, message: '请选择关联订单号' }],initialValue:orderValue || undefined})(
                <Select
                size="large"
                style={{width:'350px'}}
                className="item"
                showSearch
                placeholder="订单编号"
                defaultActiveFirstOption={false}
                showArrow={false}
                filterOption={false}
                getPopupContainer={trigger => trigger.parentNode}
                onSearch={this.getOrder.bind(this)}
                onChange={this.getOrder.bind(this)}
                onFocus={this.getOrder.bind(this)}
              >
                {order&&order.map((_,index) => (
                  <Option key={index} value={_.id}><a >{_.orderNo}</a> － <a>{_.licensePlate} </a>－ <a>{_.completed}</a></Option>
                ))}
              </Select>
              )}
            </Form.Item>
              <Form.Item
                {...formItemLayout}
                label="下次回访时间"
              >
                {getFieldDecorator('next', {rules: [{ required:true, message: '请选择时间' }]})(
                  <DatePicker  size='large' allowClear={false} format={'YYYY-MM-DD'} placeholder='选择时间' style={{width:'350px',boxSizing:'border-box'}} />
                )}
              </Form.Item>
            </Form></div>
        </Modal>
      </div>
      </Spin>
    )
  }
}
function mapStateToProps(state) {
  const {returnVisit} = state
  return { returnVisit }
}
const WrappedTimeRelatedForm = Form.create({ name: 'time_related_controls' })(WarnModel)
export default connect(mapStateToProps)(WrappedTimeRelatedForm)
