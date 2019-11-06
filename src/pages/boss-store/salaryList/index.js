import React,{Component} from 'react'
import { connect } from 'dva'
import moment from 'moment'
import styles from './index.less'
import CommonTable from 'components/CommonTable/index'
import tableConfig from './tableConfig'
import service from 'services'
import {  Button,Form, Modal, Input, Icon,DatePicker,message} from 'antd'
import validate from "../../../utils/validate"

var lastMonth = moment().subtract(1, 'months')
var currentMonth = moment()
// console.log(lastMonth,currentMonth)

const { MonthPicker } = DatePicker
const FormItem = Form.Item
const { TextArea } = Input

class salarylist extends Component{
    constructor(){
      super()
      this.state = {
        visible: false,//是否弹窗
        id:'',//修改薪资id
        time: lastMonth,//上月时间monent类型
        isShow:true,//默认公共表格渲染
        isLock: false,//是否锁定考勤   '0'代表未锁定 ， '1'代表已锁定
        isCalc: false,//是否计算薪资   '0'代表未计算 ， '1'代表已计算
        isShowLockBtn:true,//是否显示考勤按钮
        isShowCalcBtn:false,//是否显示计算按钮
        see:'',// 1代表纳入总部管理的门点(只展示)   2代表未纳入总部管理的门店(可操作)
      }
    }
    UNSAFE_componentWillMount(){

      let see = localStorage.getItem("see")
      console.log('see',typeof(see),see)
      this.setState({
        see,
      })
      const {time} = this.state
      let m = this.formatTime(time)
      service.getStoreStatus({
        data:{ yearMonth: m },
      }).then(v=>{
        console.log('状态数据',v)
        if(v.code==='0'){
          v.data.isLock===0? this.setState({isLock:false}) : this.setState({isLock:true})
          v.data.isCalc===0? this.setState({isCalc:false}) : this.setState({isCalc:true})
        }
      })
    }
    //格式化时间
    formatTime = (v)=>{
      var ti = moment(v).format('YYYY-MM')
      var a = ti.split('-')
      var b = a.join('')
      return b
    }

    //进入表格数据,加个唯一标识key
    changeDate = (e) => {
      e || []
      return e.map((v,idx) => ({...v, key:idx}))
    }
    //修改
    onTableChange = (e, v) => {
      if(e === 11){
        this.setState({visible:true, id: v.id})
      }
    }
    //表格重置按钮
    onReSet = () => {
      service.getStoreStatus({
        data:{ yearMonth: this.formatTime(lastMonth) },
      }).then(res=>{
        if(res.code==='0'){
          res.data.isLock===0? this.setState({isLock:false, time: lastMonth, isShow:false},()=>{this.setState({isShow: true})}) : this.setState({isLock:true, time: lastMonth, isShow:false},()=>{this.setState({isShow: true})})
          res.data.isCalc===0? this.setState({isCalc:false, time: lastMonth, isShow:false},()=>{this.setState({isShow: true})}) : this.setState({isCalc:true, time: lastMonth, isShow:false},()=>{this.setState({isShow: true})})
        }
      })
      return {}
    }
    //月份
    changeMonth = (date) => {
      service.getStoreStatus({
        data:{ yearMonth: this.formatTime(date) },
      }).then(res=>{
        if(res.code==='0'){
          res.data.isLock === 0 ? this.setState({isLock: false, time: date, isShow:false},()=>{this.setState({isShow: true})}) : this.setState({isLock: true, time: date, isShow:false},()=>{this.setState({isShow: true})})
          res.data.isCalc === 0 ? this.setState({isCalc: false, time: date, isShow:false},()=>{this.setState({isShow: true})}) : this.setState({isCalc: true, time: date, isShow:false},()=>{this.setState({isShow: true})})
        }
      })
    }
    //控制月份范围
    disabledDate=(current)=>{
      return  current && current > moment().subtract(1, 'months')
    }
    //锁定
    lock = ()=>{
      const {isLock,time} = this.state
      var m = this.formatTime(time)
      if(isLock){
        service.getStoreLock({
          data:{yearMonth: m, lock: 0},
        }).then(res=>{
          console.log('解锁成功数据',res)
          this.setState({
            isLock:false,
          })
        })
      }else{
        service.getStoreLock({
          data:{yearMonth: m, lock: 1},
        }).then(res=>{
          console.log('锁定成功数据',res)
          this.setState({
            isLock: true,
          })
        })
      }
    }
    //计算薪资
    compute = ()=>{
      const {isCalc,time} = this.state
      var m = this.formatTime(time)
      console.log('jisuan',isCalc)
      service.getStoreWagesCalculation({
          data:{yearMonth: m},
      }).then(res=>{
        if(res.code==='0'){
          res.data.isLock === 0 ? this.setState({isLock: false, isShow:false},()=>{this.setState({isShow: true})}) : this.setState({isLock: true, isShow:false},()=>{this.setState({isShow: true})})
          res.data.isCalc === 0 ? this.setState({isCalc: false, isShow:false},()=>{this.setState({isShow: true})}) : this.setState({isCalc: true, isShow:false},()=>{this.setState({isShow: true})})
        }
      })
    }

    handleOk = (e) => {
      const {id} = this.state
      e.preventDefault()
      this.props.form.validateFields((err, values) => {
        if (!err) {
          service.getStoreWagesChange({
            keys: { name: "store/wages",id },
            data: {
              ...values ,
            },
          }).then(res=>{
            if(res.code==='0'){
                message.success('修改成功')
                this.setState({isShow: false},()=>{this.setState({isShow: true})})
            }else{
                message.info('网络出现错误')
            }
          })
          this.setState({
            visible:false,
          })
          this.props.form.setFields({"money":""})
          this.props.form.setFields({"desc":""})
        }
      })

    }


    render(){
      let {time,isLock,isCalc,isShow,see} = this.state
      const { getFieldDecorator } = this.props.form

      see !== '1' &&
      (tableConfig.moreBtn = [
        {
          name: "修改",
          power: "Edit",
          icon: "icon-bianji",
          type: 11,
        },
      ])

      tableConfig.screen.rules[0].component = (
        <div>
            <label style={{margin:'0 8px 0 10px'}}>选择月份</label>
            <MonthPicker
              allowClear={false}
              size='large'
              value={time}
              onChange={this.changeMonth}
              disabledDate={this.disabledDate}
            >
            </MonthPicker>
        </div>
      )

      let b = this.formatTime(time)

      tableConfig.screen.query = {
        'ym': b,
      }

      const formItemLayout = {
        labelCol: {
          xs: { span: 25 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 25 },
          sm: { span: 5 },
        },
      }

      return(
        <div  style={ { position:'relative' } }>
            {
              see==='1' ? (isShow?
                <div>
                  <div style={{position:'absolute',right:'32px',top:'32px',zIndex:1000}}>
                      <span style={{marginRight:'24px'}}>考勤状态:<span style={{marginLeft:'5px'}} className={isLock===false?styles.no_lockColor:styles.lockColor}>{isLock===false?'未锁定':'已锁定'}</span></span>
                      <span style={{marginRight:'24px'}}>计算状态:<span style={{marginLeft:'5px'}} className={isCalc===false?styles.no_lockColor:styles.lockColor}>{isCalc===false?'未计算':'已计算'}</span></span>
                  </div>
                  <CommonTable
                    New
                    name="store/wages"
                    tableConfig={tableConfig}
                    onDataChangeBefore={this.changeDate}
                    onReSet={this.onReSet}
                  >
                  </CommonTable>
                </div>
                : null
              ) :
              ( isShow ?
               <div>
                  <div style={{position:'absolute',right:'32px',top:'32px',zIndex:1000}}>
                    <span style={{marginRight:'24px'}}>考勤状态:<span style={{marginLeft:'5px'}} className={isLock===false?styles.no_lockColor:styles.lockColor}>{isLock===false?'未锁定':'已锁定'}</span></span>
                    <span style={{marginRight:'24px'}}>计算状态:<span style={{marginLeft:'5px'}} className={isCalc===false?styles.no_lockColor:styles.lockColor}>{isCalc===false?'未计算':'已计算'}</span></span>
                    <Button type="primary" style={{ width:'120px',height:'40px',marginRight:'20px' }} disabled={isCalc===false?false:true} onClick={this.lock} ><Icon type="lock"/>{isLock===false?'锁定出勤':(isLock===true&&isCalc===true?'已锁定考勤':'解锁考勤')} </Button>
                    <Button type="primary" style={{ width:'120px',height:'40px' }} disabled={isLock===true&&isCalc===false?false:true} onClick={this.compute}>+/= {isCalc===false?'计算薪资':'已计算薪资'}</Button>
                  </div>
                  <div style={{display:this.state.visible?'none':''}}>
                  <CommonTable
                    New
                    name="store/wages"
                    tableConfig={tableConfig}
                    onDataChangeBefore={this.changeDate}
                    onTableChange={this.onTableChange}
                    onReSet={this.onReSet}
                  >
                  </CommonTable>
                  </div>

                  <Modal
                    title="薪资调整"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={() => {
                      this.props.form.setFields({"money":""})
                      this.props.form.setFields({"desc":""})
                      this.setState({visible: false})
                    }}
                  >
                    <Form className="from-wrap-margin">
                      <FormItem {...formItemLayout} label="金额">
                        {getFieldDecorator("money",{
                          ...validate("金额", { required: true, max: 20, type:'price1'}),
                        })
                        (
                          <Input
                            placeholder="请输入金额"
                            style={{ width: "350px", maxWidth: "350px" }}
                            size="large"
                            addonAfter="元"
                          />
                        )}

                        <div className="wyc_zhu" style={{whiteSpace:'nowrap'}}><i className='iconfont icon-zhuyi'></i>金额输入为负数时，员工工资会减扣</div>
                      </FormItem>

                      <FormItem {...formItemLayout} label="备注">
                      {getFieldDecorator("desc", {
                          ...validate("备注", { required: true, max: 200 }),
                        })( <TextArea
                            style={{
                              width: "350px",
                              height: "80px",
                              maxWidth: "350px",
                            }}
                            className="inputwidth"
                            placeholder="备注"
                          />)
                        }
                      </FormItem>
                    </Form>
                  </Modal>
                </div>
                : null
              )
            }

        </div>
      )
    }
}

export default Form.create()(salarylist)


