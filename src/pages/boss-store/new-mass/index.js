import React, { Component } from 'react'
import moment from 'moment'
import { DatePicker, Button,Input,Select,Icon,Message,Modal,Checkbox, message} from 'antd'
import services from "../../../services"
import { connect } from 'dva'
import styles from './styles.less'
const {TextArea} = Input
const Option = Select.Option
function range(start, end) {
  const result = []
  for (let i = start; i < end; i++) {
    result.push(i)
  }
  return result
} 
/**
 * 拼接成1，2，3字符串发送会员id
 */
function getText(arr) {
       var str = ""
      for(var i = 0; i < arr.length; i++) {
          str+= arr[i].id+ ","
      }
      //去掉最后一个逗号(如果不需要去掉，就不用写)
     if(str.length > 0) {
          str= str.substr(0, str.length - 1)
    }
     return str
 }
/**
 * 
 * @param {过滤时间销售金额筛选} current 
 */
function filterArr(peopleArr,min,max,type) {
  var current=moment().endOf('days')
     var timeDiff=null
     var arr=[]
    arr=peopleArr.filter((item)=>{
      timeDiff=type==='time'?Math.abs(moment(item.lastShop*1000).diff(current,'days')):item.amount
      if((timeDiff<=max)&&(timeDiff>=min)){
        return true
      }
    })
    console.log('筛选得到的会员',arr)
    return arr
}
/**
 * 
 * @param {根据当前时间禁用日期} current 
 */
function disabledDate(current) {
  // Can not select days before today and today
  return current && current < moment().subtract(1, "days")
}
/**
 * 禁用时间段
 */
function disabledDateTime(current=moment().subtract(0, "days")) {
  if(current.format('YYYY-MM-DD')===moment().subtract(0, "days").format('YYYY-MM-DD')){
    if(current.format('YYYY-MM-DD HH')===moment().subtract(0, "days").format('YYYY-MM-DD HH')){
      return {
        disabledHours: () => range(0, 24).splice(0,moment().hours()),
        disabledMinutes: () => range(0, 60).splice(0,moment().minutes()),
        disabledSeconds: () => range(0,60).splice(0,moment().seconds()),
      }
    }else{
      return {
        disabledHours: () => range(0, 24).splice(0,moment().hours()),
        // disabledMinutes: () => range(0, 60),
        // disabledSeconds: () => range(0,60),
      }
    }
  }
}

class Index extends Component {
  constructor(){
    super()
    this.state={
    title:'',
    content:'',
    sendTime:null,
    time:'',
    maxLength:0,
    sendType:'0',
    sms:false,
    visible:false,
    allCheck:true,
    sellMin:null,
    sellMax:null,
    timeMin:null,
    timeMax:null,
    dressPerson:0,//筛选人员
    smsAmount:'',
    peopleNum:0,
    peopleArr:[],
    screenArr:[],
    checkPeople:0,
    }
  }
  UNSAFE_componentWillMount(){
    console.log('hi',this.props)
    services.getMenberData({keys: {name: 'store/smsGroupMessage',id:localStorage.getItem('storeId')}}).then(res=>{
      this.setState({
        peopleNum:res.list.length,
        peopleArr:res.list,
      })
    })
    // this.setState({smsAmount:this.props.location.params.smsAmount})
    services.msmNum({keys: {name: 'store/smsGroupMessage/create'},data: {q: {page:-1,limit: -1,where: {}}}}).then((res)=>{
      if(res.code==='0'){
        var num=res.data.smsAmount
        this.setState({
          smsAmount:num,
          sms:num<90?true:false,
        })
      }
     })
    this.setState({
      sendTime: moment().format('YYYY-MM-DD HH:mm:ss'),
    },()=>this.initTime())
  }
  timeOnchange(v){
   this.setState({
     sendTime:v.format('X'),
   })
  }
  /**
   * 确认发送短信 
   * */
  /**
   * 选择会员确定
   */
  handleOk(){
    const {allCheck,peopleArr,screenArr}=this.state
    if(allCheck){
      this.setState({
        checkPeople:peopleArr.length,
      })
    }else{
      this.setState({
        checkPeople:screenArr.length,
      })
    }
  this.setState({
    visible:false,
    sellMax:null,
    sellMin:null,
    timeMax:null,
    timeMin:null,
    dressPerson:0,
  })
  }
  submit(){
    const {title,content,sendType,screenArr,sendTime,peopleArr,allCheck,checkPeople}=this.state
    var client=""
    if(allCheck){
      client=getText(peopleArr)
    }else{
      client=getText(screenArr)
    }
    switch(true){
     case !title:
     Message.warn('请输入标题')
     break
     case !content:
     Message.warn('请输入内容')
     break
     case sendTime===null&&sendType==='1':
     Message.warn('请选择时间')
     break
     case checkPeople===0:
     Message.warn('请选择会员')
     break
     default:
     services.sentNote({keys: {name: 'store/smsGroupMessage'},data:{title,content,timingSendingTime:sendType==='1'?sendTime:null,client}}).then(res=>{
       if(res.code==='0'){
         message.success('发送成功')
         setTimeout(() => {
          this.props.history.goBack()
        }, 300)
         this.setState({
           title:'',
           content:'',
           screenArr:[],
           sendTime:null,
           checkPeople:0,
         })
       }
     })
     break
    }
  }
  /**
 * 初始化时间
 */
  initTime() {
  const time=this.state.sendTime
  const day = ['周一', '周二', '周三', '周四', '周五', '周六', '周日' ]
  const _day = moment(time).format('d') - 1
  this.setState({
    time:moment(time).format(`MM月DD日 ${day[_day]} HH:mm`),
  }) 
}
/**
 * 筛选
 */
screen(){
  const {sellMax,sellMin,timeMin,timeMax,peopleArr}=this.state
  if(sellMin<=sellMax){
   if(timeMin<=timeMax){
     var data=[]
     if(timeMax===0||timeMax===null){
       if(sellMax===0||sellMax===null){
        message.warn('请填写正确区间')
       }else{
         console.log('1',timeMax)
        data=filterArr(peopleArr,sellMin,sellMax,'sell')
       }
     }else {
      if(sellMax===0||sellMax===null){
        console.log('2')
        data=filterArr(peopleArr,timeMin,timeMax,'time')
      }else{
        console.log('3')
        data=filterArr(peopleArr,sellMin,sellMax,'sell')
        data=filterArr(data,timeMin,timeMax,'time')
      }
     }
   }else{
    message.warn('请输入正确到店时间区间')
   }
  }else{
    message.warn('请输入正确销售金额区间')
  }
  
  this.setState({
    screenArr:data,
    dressPerson: Object.prototype.toString.call(data).slice(8,-1) === 'Array' ?  data.length : 0 ,
  })
}
/**
 * 
 */
onChangeValue(type,v){
var value=v.target.value
//  var sell=value.replace(/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/,Number(value))
//  var time=value.replace(/^[+]{0,1}(\d+)$/,Number(value))
var sell=value.replace(/\D/g,'')
var time=value.replace(/\D/g,'')
 switch (type) {
   case 'sellMin':
          this.setState({sellMin:Number(sell)})
     break
     case 'sellMax':
        this.setState({sellMax:Number(sell)})
     break
     case 'timeMin':
        this.setState({timeMin:Number(time)})
     break
     case 'timeMax':
        this.setState({timeMax:Number(time)})
     break
   default:
     break
 }
}
  render() {
    const {content,time,maxLength,sendType,sms,visible,allCheck,sellMin,sellMax,timeMax,timeMin,smsAmount,title,
      peopleNum,screenArr,checkPeople,dressPerson,
    } = this.state
    return (
      <div className={styles.newMass}>
        <div>
           <div>
            <p className={styles.itemTitle}><span>标题</span><span>注：标题仅用于区分群发内容，不会显示给顾客看到</span></p>
            <div  className={styles.formItem}>
              <Input placeholder='输入标题' value={title} onChange={(e) => this.setState({ title: e.target.value })}></Input>
            </div>
            <p className={styles.itemTitle}><span>短信内容</span><span>建议：请尽可能使用简洁的短语，避免使用长句或过于啰嗦</span></p>
            <div style={{position:'relative'}}  className={styles.formItem}>
              <TextArea placeholder='输入内容' value={content} maxLength={70} onChange={(e) => this.setState({ content: e.target.value, maxLength: e.target.value.length })}></TextArea>
              <span style={{color:'#ccc',position:'absolute',right:'18px',bottom:'2px'}}>{maxLength}/70</span>
            </div>
            <p className={styles.sendObj}><span>发送对象</span><span>已选择{checkPeople}人</span></p>
            <div  className={styles.formItem}>
              <Button onClick={()=>this.setState({visible:true})} style={{ color: '#4AACF7' }} type='dashed' icon='plus' block>选择会员</Button>
            </div>
            <p className={styles.itemTitle}><span>发送时间</span></p>
            <div  className={styles.formItem}>
              <Select defaultValue="0" style={{ width: 120 }} onChange={(v)=>this.setState({
                sendType:v,
              })}>
                <Option value='0'>立即发送</Option>
                <Option value='1'>定时发送</Option>
              </Select>
              {sendType==='1'&&<DatePicker
                format="YYYY-MM-DD HH:mm:ss"
                disabledDate={disabledDate}
                disabledTime={disabledDateTime}
                showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                onChange={this.timeOnchange.bind(this)}
                allowClear={false}
              />}
            </div>
            <div  className={styles.formItem}>
              <Button type='primary' style={{height:'40px'}} disabled={checkPeople>smsAmount} onClick={this.submit.bind(this)}>确认发送</Button>
              <div className={styles.tip}>
                <p style={{ color: '#333333', fontWeight: 'bold' }}>剩余短信 <span style={{ color: '#ff6f28' }}>{smsAmount}</span></p>
                {sms&&<div className={styles.pop}>
                  <Icon type='close' onClick={()=>this.setState({sms:false})} style={{ position: 'absolute', right: '10px', top: '10px', cursor: 'pointer', padding: '2px' }}></Icon>
                  <p style={{ color: '#666666', fontWeight: 'bold', fontSize: '12px' }}><Icon type='warning' style={{ color: '#ff6f28', marginRight: '2px' }}></Icon> 短信剩余次数不多，请联系客服进行购买</p>
                  <p>客服热线：<span style={{ color: '#4aacf7' }}>18565513563</span></p>
                </div>}
              </div>
            </div>
          </div>
          <div className={styles.divider}></div>
          <Modal
          title="选择会员"
          visible={visible}
          onOk={this.handleOk.bind(this)}
          onCancel={()=>this.setState({visible:false,sellMax:null,
            sellMin:null,
            timeMax:null,
            checkPeople:0,
            screenArr:[],
            dressPerson:0,
            timeMin:null})}
          maskClosable={false}
        >
          <div style={{display:'flex',color:'#333333'}}>
            <Checkbox checked={allCheck} onChange={()=>this.setState({allCheck:!allCheck})}></Checkbox><span>全部会员</span><p style={{marginLeft:"8px"}}>共<span style={{color:'#4aacf7'}}>{peopleNum}</span>人</p>
          </div>
          <div style={{color:'#333333'}}><Checkbox onChange={()=>this.setState({allCheck:!allCheck})} checked={!allCheck}></Checkbox><span>筛选会员</span></div>
          {!allCheck&&<div style={{border:'1px solid #78B6E8',padding:'16px 20px 34px',marginTop:'20px'}}>
            <div style={{display:'flex',alignItems:'center',marginBottom:'20px',color:'#333333'}}>
              <span style={{marginRight:'5px'}}>累计消费金额</span>
              <Input placeholder='请输入' value={sellMin} onChange={this.onChangeValue.bind(this,'sellMin')} addonAfter='元' style={{width:150}}></Input>&nbsp;~&nbsp;<Input placeholder='请输入' value={sellMax} onChange={this.onChangeValue.bind(this,'sellMax')} addonAfter='元' style={{width:150}}></Input>
            </div>
            <div style={{display:'flex',alignItems:'center',marginBottom:'20px',color:'#333333'}}>
              <span style={{marginRight:'5px'}}>最近到店时间</span>
              <Input placeholder='请输入' value={timeMin} onChange={this.onChangeValue.bind(this,'timeMin')}  addonAfter='天' style={{width:150}}></Input>&nbsp;~&nbsp;<Input placeholder='请输入' value={timeMax} onChange={this.onChangeValue.bind(this,'timeMax')} addonAfter='天' style={{width:150}}></Input>
            </div>
            <div><Button onClick={this.screen.bind(this)} style={{marginRight:'5px'}} type='primary' size='small'>筛选</Button>筛选结果<span style={{color:'#4aacf7',marginLeft:'5px'}}>{dressPerson}</span>&nbsp;人</div>
          </div>}
        </Modal>
        </div>
        <div >
          {/* <div className={styles.desc}>短信预览</div> */}
          <div className={styles.back} onClick={()=>this.props.history.goBack()}><Icon type='left'></Icon>返回列表</div>
          <div className={styles.mobile}>
            <div>
              <p>短信/彩信</p>
              <p>{time}</p>
              <div>
                <div style={{ wordBreak: 'break-all' }}>{content}<i className="iconfont icon-duihuaqipao-zuo"></i></div>
                <div>收到了，亲爱的。<i className="iconfont icon-duihuaqipao-you"></i></div>
                <div>谢谢通知。<i className="iconfont icon-duihuaqipao-you"></i></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
// const WrappedHorizontalLoginForm = Form.create({ name: 'confir_send' })(Index)
// export default WrappedHorizontalLoginForm
function mapStateToProps(state) {
  const {sms} = state
  return { sms }
}
export default connect(mapStateToProps)(Index)