import React,{Component} from 'react'
import moment from 'moment'
import styles from './index.less'
import CommonTable from 'components/CommonTable/index'
import tableConfig from './tableConfig'
import {connect} from 'dva'
import service from 'services'
import {  Button,Form, Modal, Input, Icon,DatePicker,message,Select ,Spin } from 'antd'
import validate from "../../../utils/validate"



var lastMonth = moment().subtract(1, 'months')


const { MonthPicker } = DatePicker
const FormItem = Form.Item
const { TextArea } = Input
const Option = Select.Option




class salarylist extends Component{
    constructor(){
      super()
      this.state = {
        visible: false,//是否弹窗
        id:'',//修改薪资id
        time: lastMonth,//上月时间monent类型
        isShow:true,//默认公共表格渲染
        isLock: false,//是否锁定考勤
        isCalc: false,//是否计算薪资
        array:[],//list下拉门店数据
        name:'',//默认门店名字
        value: '',//默认门店id
      }

    }
    UNSAFE_componentWillMount(){
      this.setState({
        isShow:false,
      },()=>{
        service
        .LIST({
          keys: { name: "brand/store/list" },
          data: {
            q: { page: 1, limit: -1, where: {} },
          },
        })
        .then(res => {
          let array=[]
          res.list.forEach(e=>{
            if(e.see===1){
              array.push({value: e.storeId, name: e.storeName})
            }
          })
          this.setState({
            array,
            name:array[0]?array[0].name:'',
            value:array[0]?array[0].value:'',
            isShow:true,
          },()=>{
              //请求状态
              const {time} = this.state
              let m = this.formatTime(time)
              if(array.length!==0){
                service
                .getBrandStatus({
                  data:{yearMonth: m, storeId:array[0]?array[0].value:'' },
                }).then(v=>{
                  if(v.code==='0'){
                    v.data.isLock===0? this.setState({isLock:false}) : this.setState({isLock:true})
                    v.data.isCalc===0? this.setState({isCalc:false}) : this.setState({isCalc:true})
                  }
                })
              }
          })
        })
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
    //每行表格数据修改
    onTableChange = (e, v) => {
      if(e === 11){
        this.setState({visible:true, id: v.id})
      }
    }

    //表格重置按钮
    onReSet = () => {
      const { array } = this.state
      let name=array[0].name
      let value=array[0].value
      service.getBrandStatus({
        data: {yearMonth: this.formatTime(lastMonth), storeId: value},
      }).then(res=>{
        if(res.code==='0'){
          res.data.isLock === 0 ? this.setState({isLock: false}) : this.setState({isLock: true})
          res.data.isCalc === 0 ? this.setState({isCalc: false}) : this.setState({isCalc: true})
          this.setState({
            time: lastMonth,
            name,
            value,
            isShow:false,
          },()=>{
            this.setState({
              isShow:true,
            })
          })
        }
      })
      return {}
    }

    //月份筛选
    changeMonth = (date) => {
      const {value} = this.state
      service.getBrandStatus({
        data:{yearMonth: this.formatTime(date), storeId: value},
      }).then(v=>{
        if(v.code==='0'){
          v.data.isLock === 0 ? this.setState({isLock: false, time: date, isShow:false},()=>{this.setState({isShow: true})}) : this.setState({isLock: true, time: date, isShow:false},()=>{this.setState({isShow: true})})
          v.data.isCalc === 0 ? this.setState({isCalc: false, time: date, isShow:false},()=>{this.setState({isShow: true})}) : this.setState({isCalc: true, time: date, isShow:false},()=>{this.setState({isShow: true})})
        }
      })
    }
    //控制月份范围
    disabledDate=(current)=>{
      return  current && current > moment().subtract(1, 'months')
    }
    //门店筛选
    select=(value)=>{
      const { array ,time} = this.state
      let newList=[...array]
      .filter(item=>item.value===value)
      let name = newList[0].name
      service.getBrandStatus({
        data:{yearMonth: this.formatTime(time), storeId: value },
      }).then(res=>{
        if(res.code==='0'){
          res.data.isLock=== 0 ? this.setState({isLock:false, name, value, isShow: false},()=>{this.setState({isShow: true})}) : this.setState({isLock:true, name, value, isShow: false},()=>{this.setState({isShow: true})})
          res.data.isCalc=== 0 ? this.setState({isCalc:false, name, value, isShow: false},()=>{this.setState({isShow: true})}) : this.setState({isCalc:true, name, value, isShow: false},()=>{this.setState({isShow: true})})
        }
      })

    }

    //锁定
    lock = ()=>{
      const {isLock,time,value} = this.state
      var m = this.formatTime(time)
      if(isLock){
        service.getBrandLock({
          data:{yearMonth: m, storeId: value, lock: 0},
        }).then(res=>{
          console.log('解锁成功数据',res)
          this.setState({
            isLock:false,
          })
        })
      }else{
        service.getBrandLock({
          data:{yearMonth: m, storeId: value, lock: 1},
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
      const {isCalc,time,value} = this.state
      var m = this.formatTime(time)
      console.log('jisuan',isCalc)
      service.getBrandWagesCalculation({
          data:{yearMonth: m, storeId: value},
      }).then(res=>{
          if(res.code==='0'){
            service.getBrandStatus({
              data: {yearMonth: m, storeId: value},
            }).then(res=>{
              if(res.code==='0'){
                res.data.isLock === 0 ? this.setState({isLock: false,isShow:false},()=>{this.setState({isShow:true})}) : this.setState({isLock: true,isShow:false},()=>{this.setState({isShow:true})})
                res.data.isCalc === 0 ? this.setState({isCalc: false,isShow:false},()=>{this.setState({isShow:true})}) : this.setState({isCalc: true,isShow:false},()=>{this.setState({isShow:true})})
              }
            })
          }
      })
    }
    //表单提交
    handleOk = (e) => {
      const {id} = this.state
      e.preventDefault()
      this.props.form.validateFields((err, values) => {
        if (!err) {
          service.getBrandWagesChange({
            keys: { name: "brand/wages",id },
            data: {
              ...values ,
            },
          }).then(res=>{
            if(res.code==='0'){
                message.success('修改成功')
                this.setState({isShow:false},()=>{this.setState({isShow:true})})
                this.props.dispatch({
                  type:'table/getData',
                  payload:{new:true},
                })
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
      let {time,isLock,isCalc,isShow,array,name,value} = this.state

      const { getFieldDecorator } = this.props.form

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
      tableConfig.screen.rules[1].component = (
        <div style={{position:'relative'}}>
            <label style={{margin:'0 8px 0 10px',position:'absolute',left:'0px',top:'12px'}}>选择门店</label>
            <Select  value={ name } style={{ width: 190,position:'absolute',left:'75px',top:'0px' }} onChange={this.select}>
              {array.map((item,idx)=>{
                return (
                  <Option   key={idx} value={item.value}>{item.name}</Option>
                )
              })}
            </Select>
        </div>
      )

      let b = this.formatTime(time)

      tableConfig.screen.query = {
        'ym': b,'storeId':value,
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
      console.log('isShow',isShow)
      return(
        <div  style={ { position:'relative' } }>
          <div>
            <div style={{ display: isShow ? '' : 'none' }}>
              <div style={{ position: 'absolute', right: '32px', top: '32px', zIndex: 1000 }}>
                <span style={{ marginRight: '24px' }}>考勤状态:<span style={{ marginLeft: '5px' }} className={isLock === false ? styles.no_lockColor : styles.lockColor}>{isLock === false ? '未锁定' : '已锁定'}</span></span>
                <span style={{ marginRight: '24px' }}>计算状态:<span style={{ marginLeft: '5px' }} className={isCalc === false ? styles.no_lockColor : styles.lockColor}>{isCalc === false ? '未计算' : '已计算'}</span></span>
                <Button type="primary" style={{ width: '120px', height: '40px', marginRight: '20px' }} disabled={isCalc === false ? false : true} onClick={this.lock} ><Icon type="lock" />{isLock === false ? '锁定出勤' : (isLock === true && isCalc === true ? '已锁定考勤' : '解锁考勤')} </Button>
                <Button type="primary" style={{ width: '120px', height: '40px' }} disabled={isLock === true && isCalc === false ? false : true} onClick={this.compute}>+/= {isCalc === false ? '计算薪资' : '已计算薪资'}</Button>
              </div>
              <div style={{display:this.state.visible?'none':''}}>
              <CommonTable
                New
                name="brand/wages"
                tableConfig={tableConfig}
                onDataChangeBefore={this.changeDate}
                onTableChange={this.onTableChange}
                onReSet={this.onReSet}
              >
              </CommonTable>
              </div>
            </div>
            <div style={{ display: isShow ? 'none' : '' }}>
              <Spin spinning={true}>
                <div style={{ position: 'absolute', right: '32px', top: '32px', zIndex: 1000 }}>
                  <span style={{ marginRight: '24px' }}>考勤状态:<span style={{ marginLeft: '5px' }} ></span></span>
                  <Button type="primary" style={{ width: '120px', height: '40px', marginRight: '20px' }} ><Icon type="lock" />锁定出勤</Button>
                  <Button type="primary" style={{ width: '120px', height: '40px' }} >+/= 计算薪资</Button>
                </div>
                <div style={{display:this.state.visible?'none':''}}>
                <CommonTable
                  New
                  name="brand/wages"
                  tableConfig={tableConfig}
                  onDataChangeBefore={this.changeDate}
                >
                </CommonTable>
                </div>
              </Spin>
            </div>
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
      )
    }
}

export default connect()(Form.create()(salarylist))


