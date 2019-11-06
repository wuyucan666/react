import React, { Component } from 'react'
import { Modal,Form, DatePicker ,Select,Radio,Table,message,Spin, Button,Input} from "antd"
import  styles  from '../styles.less'
// import moment from 'moment'
import services from "../../../../services"
import { connect } from 'dva'
import moment from 'moment'
const Option=Select.Option
const {TextArea}=Input

class RecordModel extends Component {
  constructor(props){
    super(props)
    this.state = {
      recordData:[],
      hide:true,
      status:true,
      localTime:null,
      data:[],
      carId: '',
    clientInfo: {},
    result: [],
    page: 1,
    totalPage: 1,
    loading: false,
    type:null,
    spin:false,
    value:'',
    }
  }
  UNSAFE_componentWillMount(){
    var time=new Date().getTime()
    // console.log('infosl',this.props.info)
   this.setState({
     localTime:time,
   })
    // this.props.form.setFilds
  }
  async componentDidMount(){
    console.log(this.props.that,'继承父组件的this.props')
    let o = this.props.that.location.state
    if(o){
      let visitStaff = o.visitStaff || ''
      let survey = o.survey || ''
      await this.onSearch()
      this.props.form.setFieldsValue({'visitStaff':visitStaff})
      this.props.form.setFieldsValue({'survey':survey})
    }
  }
  UNSAFE_componentWillReceiveProps(){
    // console.log('visit,',visitRecord['0'].validity)
    // this.setState({
    //   data:this.props.tableData,
    // })
    //施工项目到期默认有员工
  }
  hideModal(){
    this.props.hide('record')
    this.props.form.resetFields()
    this.setState({
      data:[],
    })
  }
  handleSubmit = (e) => {
    // console.log('test',this.props)
    this.props.form.setFieldsValue({'ravilidity':'slsdkjasd'})
    const {id}= this.props.info
    const {status,data}=this.state
    e.preventDefault()
    var score=[]
    // console.log('data',data)
    if(status){
      score=data.map((val)=>{return{
        item_id:val.id,
        score:val.grade?Number(val.grade):null,
       }})
    }
    this.props.form.validateFields((err, fieldsValue) => {
      if(err){
        message.error('添加失败')
        return

      }
      if(status){
        var bul=true
        score.map((item)=>{
          if(item.score===null){
            bul=false
          }
        })
        if(bul&&score.length){
          this.setState({
            spin:true,
          })
        const record={
          visitId:id,
          visitTime:parseInt(fieldsValue['visitTime'].valueOf()/1000),
          staffId:fieldsValue['visitStaff'],
          satisfaction:Number(fieldsValue['survey']),
          validity:status,
          nextTime:parseInt(fieldsValue['visitTime'].valueOf()/1000),
          remark:fieldsValue['remark']?fieldsValue['remark']:'',
        }
        // items:this.props.tableData.map(item=>{return {id:item.id,score:item.score}}),
        services.addReturnVisitRecord({keys:{name:"returnVisit/record"},data:{visit:record,score:score}}).then((res)=>{
          this.setState({
            spin:false,
            data:[],
          })
          if(res.code==='0'){
            message.success('添加成功')
            this.props.hide('record')
            this.setState({
              data:[],
            })
            this.props.dispatch({
              type: "table/getData",
              payload: { new: true },
            })
            this.props.form.resetFields()

          }else{
            message.error('添加失败')
          }
        })
        }else{
          const {tableData} = this.props
          if(tableData.length===0){
            message.warn('请去设置回访项')
          }else{
            message.warn('请选择评分')
          }
        }
      }else{
        this.setState({
          spin:true,
        })
      const record={
        visitId:id,
        visitTime:parseInt(fieldsValue['visitTime'].valueOf()/1000),
        staffId:fieldsValue['visitStaff'],
        satisfaction:fieldsValue['survey']?Number(fieldsValue['survey']):0,
        validity:status,
        nextTime:parseInt(fieldsValue['visitTime'].valueOf()/1000),
        remark:fieldsValue['remark']?fieldsValue['remark']:'',
      }
      // items:this.props.tableData.map(item=>{return {id:item.id,score:item.score}}),
      services.addReturnVisitRecord({keys:{name:"returnVisit/record"},data:{visit:record,score:[]}}).then((res)=>{
        this.setState({
          spin:false,
          data:[],
        })
        if(res.code==='0'){
          message.success('添加成功')
          this.props.hide('record')
          this.setState({
            data:[],
            value:'',
          })
          this.props.dispatch({
            type: "table/getData",
            payload: { new: true },
          })
          this.props.form.resetFields()

        }else{
          message.error('添加失败')
        }
      })
      }
    })
  }
  // 跳去设置回访项
  goToSetVisit(){
    const {history,location} = this.props.that
    const {type} = this.props.info
    history.push({
      pathname:`/boss-store/project-warn`,
      state: {
        type,
        currentpath: location.pathname,
        rowData: this.props.info,
        visitStaff:this.props.form.getFieldValue('visitStaff'),// 回访员工id
        survey: this.props.form.getFieldValue('survey'), // 满意度调查
      },
    })
  }
  radioOnchange(){
    var bul=!this.state.status
    this.setState({
      status:bul,
    })
  }
  onChangeRecord(index,val){
   var item=this.props.tableData
   item[index].grade=val
   this.setState({
     data:item,
   })
  }
  onSearch = (value) => {
    console.log(value)
    this.setState({page: 1, result: []},()=>{
      this.getResult(value)
    })
  }
  /**
   * 搜索会员
   */
  getResult = (value, isScroll) => {
    this.setState({loading: true})
    services.LIST({
      keys : {
        name: 'store/staff/list',
      },
      data:{
        name:value,
        q: {page: this.state.page},
      },
    }).then(res => {
      // if(res.totalSize===0){
      //   this.props.form.setFieldsValue({visitStaff:null})
      // }
      this.setState((prevState => ({
        value,
        result: isScroll ? prevState.result.concat(res.list) : res.list,
        totalPage: res.totalPage,
        loading: false,
      })))
    })
  }

  setMember = (carId) => {
    const {result} = this.state
    const clientInfo = result.find((_) => _.carId === Number(carId))
    // this.getRecord(clientInfo.clientId)
    this.setState({carId, clientInfo})
    this.props.onChange && this.props.onChange(clientInfo)
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
    if (target.scrollTop + target.offsetHeight === target.scrollHeight) {
      const {page, totalPage, value} = this.state
      if(page < totalPage){
        this.setState({
          page: page + 1,
        },()=>{
          this.getResult(value, true)
        })
      }
    }
  }
  render() {
    const {localTime,result,spin,loading,value} = this.state
    const {visible,info,tableData} = this.props
    const columns = [{
      title: '序号',
      dataIndex: 'order',
      width: '10%',
    },
     {
      title: '回访项',
      dataIndex: 'item',
      width: '55%',
      render:text=>{
        return <p style={{width:'510px'}}>{text}</p>
      },
    }, {
      title: '合格分',
      dataIndex: 'score',
      width:'15%'},
      {
        title: '评分',
        dataIndex: '',
        width:'20%',
        render:(score,record,index)=>{return <div><span style={{color:'red',margin:'0 5px'}}>*</span><Select value={this.state.data[index]?this.state.data[index].grade:''} onChange={this.onChangeRecord.bind(this,index)} placeholder="选择分数" style={{ width: '120px' }}>
        <Option value="1">1</Option>
        <Option value="2">2</Option>
        <Option value="3">3</Option>
        <Option value="4">4</Option>
        <Option value="5">5</Option>
      </Select></div>},
      },
      ]
    const { getFieldDecorator } = this.props.form
    return (
      <Spin spinning={spin}>
      <div>
        <Modal
          style={{minWidth:'1000px'}}
          title="添加回访记录"
          visible={visible}
          loading={loading}
          onOk={this.handleSubmit.bind(this)}
          onCancel={this.hideModal.bind(this)}
          okText="发布"
          cancelText="取消"
          maskClosable={false}
        >
         <div className={styles.lyc_modalBox}>
            <div style={{marginBottom:'10px'}}><span>回访对象：</span><span>{info.clientName}（{info.phone}）</span><span>{info.plateNumber}</span></div>
            <div><span>回访原因：</span>{info.reason}</div>
            <div>回访详情</div>
            <div><Form ref='getFormValue' layout='inline' >
              <Form.Item
                label="回访时间"
              >
                {getFieldDecorator('visitTime',{
            rules: [{ required: true, message: '请输入时间' }],
            initialValue:moment(localTime),
          })(
                  <DatePicker format={'YYYY-MM-DD'} style={{width:'350px'}} />
                )}
              </Form.Item>
              <Form.Item
              label='回访员工'>
                {getFieldDecorator('visitStaff', {
                rules: [{ required: true,type:'number', message: '请选择员工' }],initialValue:value})(
                  <Select
                    style={{ width: '350px', boxSizing: 'border-box' }}
                    size="large"
                    className="item"
                    showSearch
                    defaultActiveFirstOption={false}
                    showArrow={false}
                    filterOption={false}
                    getPopupContainer={trigger => trigger.parentNode}
                    onSearch={this.onSearch.bind(this)}
                    onFocus={this.onSearch.bind(this)}
                    onChange={this.setMember.bind(this)}
                    onPopupScroll={this.popupScroll}
                  >
                    {result.map((_,index) => (
                      <Option key={index} value={_.staffId}>{_.staffName}</Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
              <Form.Item
              label='回访有效性'>
                {getFieldDecorator('ravilidity', {
                rules: [{ required: true,type:'string', message: '请选择有效性' ,initialValue:'ehlek'}]})(<Radio  style={{display:'none'}}/>)}
                <div style={{width:'350px',textAlign:'left'}}><Radio onChange={this.radioOnchange.bind(this)} checked={this.state.status} style={{color:'#333'}}>有效</Radio><Radio onChange={this.radioOnchange.bind(this)} checked={!this.state.status}>无效</Radio></div>
              </Form.Item>
              {(!this.state.status)&&<Form.Item
                label="下次回访时间"
              >
                {getFieldDecorator('nextVisitTime', {
                  rules: [{ required:!this.state.status, message: '请选择下次回访时间' }],
                })(
                  <DatePicker allowClear={false} format={'YYYY-MM-DD'} style={{width:'350px'}} />
                )}
              </Form.Item>}
              {(this.state.status)&&<Form.Item
              label='满意度调查'>
                {getFieldDecorator('survey', {
                rules: [{ required: this.state.status,type:'string', message: '请选择满意程度' }]})(
                  <Select
                  showSearch
                  style={{width:'350px'}}
                  placeholder="满意度调查"
                  optionFilterProp="surveychildren"
                  >
                  <Option value="5">很满意</Option>
                  <Option value="4">满意</Option>
                  <Option value="3">一般</Option>
                  <Option value="2">不满意</Option>
                  <Option value="1">很不满意</Option>
                </Select>
                )}
              </Form.Item>}
             <Form.Item
                label="备注信息"
                style={{width:'100%',textAlign:'left'}}
              >
                {getFieldDecorator('remark', {
                  rules: [{ required:false, message: '请输入备注信息' }],
                })(
                  <TextArea maxlength='50' placeholder="请输入备注信息"  style={{width:'808px'}}/>
                )}
              </Form.Item>
            </Form></div>
            {this.state.status&&<div><span>回访项</span></div>}
            {this.state.status&&<div className={styles['visitHistory']}>
              { tableData.length !== 0 ?
                  <Table
                    pagination={false}
                    dataSource={tableData} columns={columns}
                  ></Table>
                :
                <div style={{position:'relative'}}>
                    <Table
                        pagination={false}
                        dataSource={[]}
                        columns={columns}
                      >
                    </Table>
                    <div style={{position:'absolute',left:'50%',top:'72px',zIndex:1,width:'220px',height:'150px',background:'#fff',transform:'translate(-50%,0)',display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
                        <div style={{display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
                          <div style={{fontSize:'14px',fontFamily:'MicrosoftYaHei',fontWeight:'400',color:'#666',marginBottom:'17px'}}>需要设置好回访项再进行回访哦~</div>
                          <Button type="primary" onClick={this.goToSetVisit.bind(this)}>马上去设置</Button>
                        </div>
                    </div>
                </div>
              }
            </div>}
          </div>
        </Modal>
      </div>
      </Spin>
    )
  }
}
function mapStateToProps(state) {
  const {visitRecord} = state.returnVisit
  return { visitRecord }
}
const WrappedTimeRelatedForm = Form.create({ name: 'time_related_controls' })(RecordModel)
export default connect(mapStateToProps)(WrappedTimeRelatedForm)
