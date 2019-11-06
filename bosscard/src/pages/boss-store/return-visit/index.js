import React, { Component } from 'react'
import  styles  from './styles.less'
import CommonMenu from './components/commonMenu'
import CommonTable from "../../../components/CommonTable/index"
import tableConfig from "./tableConfig"
import { Button,Form,Tag} from "antd"
import services from "../../../services"
import { connect } from 'dva'
import RecordModel from './components/recordModel'
import WarnModel from './components/warnModel'
import moment from 'moment'
// import table from '@/components/MenuTable/table'
class Index extends Component {
  constructor(props){
     super(props)
     this.state={
       record:false,
       warn:false,
       rowData:{},
       data:[],
     }
  }
  // UNSAFE_componentWillMount(){
  //       // this.getRecord(clientInfo.clientId)
  //       // console.log('props',this.props)

  // }
  // 消费记录
  getRecord = (clientId) => {
    services.LIST({keys: {name: 'maintain/recently'},data: {q: {page:1,limit: 2,where: {clientId}}}}).then(res => {
      if(res.success){
        const {dispatch} = this.props
        dispatch({
          type:'speedyBilling/setAccount',
          payload:{
            record: res.list,
          },
        })
      }
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
    // this.setState({loading: true})
    // services.LIST({
    //   keys : {
    //     name: 'store/clients',
    //   },
    //   data:{
    //     name:value,
    //     q: {page: this.state.page},
    //   },
    // }).then(res => {
    //   this.setState((prevState => ({
    //     value,
    //     result: isScroll ? prevState.result.concat(res.list) : res.list,
    //     totalPage: res.totalPage,
    //     loading: false,
    //   })))
    // })
  }
  componentDidMount(){
    console.log('第二步：是否接收到回访设置页面跳转过来的参数',this.props.location.state)
    let o = this.props.location.state
    if(o){
      this.onTableChange(11,o.rowData)
    }
  }
  /**
   *
   *显示隐藏弹框
   */
  hide(type){
    console.log('type')
    switch (type) {
      case 'warn':
        this.setState({
          warn:false,
        })
        break
        case 'commonRecord':
        this.setState({
          recordShow:false,
        })
        break
      default:
      this.setState({
        record:false,
      })
        break
    }
  }
  componentWillReceiveProps(nextprops){
    if(nextprops.totalSize===this.props.totalSize){
      return
    }
    const { dispatch } = this.props
      dispatch({
        type:'maintianList/customizeNumber',
        payload:{
          count:nextprops.totalSize,
          type:'getReturnTatal',
          index:0,
        },
     })
  }
  onTableChange(e,v){
    this.setState({
      rowData:v,
    })
    // const {dispatch} = this.props
    if(e===11){
      // 如果是开单回访，默认请求施工到期回访
      let type = v.type*1 ===7 ? 6 : v.type
      services.getReturnProject({keys:{name:'returnVisit/item'},data:{type:type}}).then(res=>{
        this.setState({
          data:res.list,
        })
      })
      // dispatch({type:'returnVisit/getRecordInfo',payload:{v:v.id}})
      // services.getReturnVisitRecord({keys:{name:`returnVisit/record/1212`}}).then(res=>{
      //   if(res.code==='0'){
      //     this.setState({
      //       recordData:res.list,
      //     })
      //     console.log('data',this.state.recordData)
      //   }
      // })
      this.setState({
        record:true,
      })
    }
  }
  setMember = (carId) => {
    // const {result} = this.state
    // const clientInfo = result.find((_) => _.carId === Number(carId))
    // this.getRecord(clientInfo.clientId)
    // this.setState({carId, clientInfo})
    // this.props.onChange && this.props.onChange(clientInfo)
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
  goAdd = () => {
    this.props.addClient()
  }
  goEdit = (e) => {
    e.preventDefault()
    const { showClient }  = this.props
    const { clientInfo }  = this.state
    showClient(clientInfo.clientId)
  }
  goClient=(e,num)=>{
    const {dispatch,history,match} = this.props
    if(e.orderNo){
      dispatch({
        type: "maintianList/goDetail",
        payload: {
        orderId:e.orderNo, //orderID
        orderType: e.orderType , //orderType
        path:match.path,
        goClient:num===1?true:false , //是否跳转到顾客资料
        isHideDetailBtns: true,
        },
        })

        history.push("/boss-store/maintain-list/orderAll")
    }

    }
  handeleAdd(e){
   this.setState({
    warn:true,
   })
   console.log('e',e)
  }
  handleSubmit = (e) => {
    e.preventDefault()

    this.props.form.validateFields((err, fieldsValue) => {
      // console.log('form',fieldsValue)
      // if (err) {
      //   return
      // }

      // Should format date value before submit.
      const rangeValue = fieldsValue['visitTime']
      const rangeTimeValue = fieldsValue['visitStaff']
      // const values = {
      //   ...fieldsValue,
      //   'date-picker': fieldsValue['date-picker'].format('YYYY-MM-DD'),
      //   'date-time-picker': fieldsValue['date-time-picker'].format('YYYY-MM-DD HH:mm:ss'),
      //   'month-picker': fieldsValue['month-picker'].format('YYYY-MM'),
      //   'range-picker': [rangeValue[0].format('YYYY-MM-DD'), rangeValue[1].format('YYYY-MM-DD')],
      //   'range-time-picker': [
      //     rangeTimeValue[0].format('YYYY-MM-DD HH:mm:ss'),
      //     rangeTimeValue[1].format('YYYY-MM-DD HH:mm:ss'),
      //   ],
      //   'time-picker': fieldsValue['time-picker'].format('HH:mm:ss'),
      // }
      // console.log('Received values of form: ', rangeValue,rangeTimeValue,fieldsValue['visitTime'].format('YYYY-MM-DD'))
    })
  }
  render() {
    tableConfig.moreBtn=[
      {
        name: "添加回访记录",
        power: "Edit",
        icon: "icon-tianjiahuifangjilu",
        type: 11,
      },
      {
        name: "删除",
        power: "Delete",
        icon: "icon-shanchu",
        type: 1,
        show:(e)=>{
         if(e.source===2){
            return true
         }else{
           return false
         }
        },
      },
     ]
    tableConfig.headers[0].render=((e)=>{
      return (<div className={styles.lyc_carAttn}>
        <span>{e.plateNumber}</span>
        <span onClick={this.goClient.bind(this,{orderNo:e.orderNo,orderType:null},1)}>{e.clientName}&nbsp;({e.phone})</span>
      </div>)
    })
    tableConfig.headers[8].render=((e)=>{
      return (<div onClick={this.goClient.bind(this,{orderNo:e.orderNo,orderType:null},2)} style={{color:'#4aacf7',cursor:'pointer'}}>
      {e.orderNo}
      </div>)
    })
    tableConfig.headers[7].name='待回访时间'
    tableConfig.headers[7].render=(e)=>{
      return (<div className={styles.lyc_tag}>
        <Tag visible={e.overdueTime>0} color="#FF6F28">逾期</Tag>
        <span >{moment(e.visitTime*1000).format('YYYY-MM-DD')}</span>
      </div>)
    }
    tableConfig.screen.query={state:1}
    tableConfig.screen.moreContent = (
      <div style={{ display: "flex" }}>
        <Button
          style={{ width: "120px", margin: "0 24px 0 20px", height: '40px' }}
          type="primary"
          icon="plus"
          onClick={this.handeleAdd.bind(this)}
        >
          添加提醒
        </Button>
        {/* <Button
          style={{ width: "120px", height: '40px' }}
          type="primary"
          shape="circle"
          icon="export"
        >
          导出
        </Button> 这次迭代暂时不做*/}
      </div>
    )
    return (
      <div >
        {/* <div className={styles.zl_tableBox}><CommonMenu index={0}></CommonMenu></div> */}
        <CommonTable
        name="returnVisit/visit"
        tableConfig={tableConfig}
        query={{state:1}}
        New
        onTableChange={this.onTableChange.bind(this)}
        ></CommonTable>
        <RecordModel tableData={this.state.data.reverse()} info={this.state.rowData} hide={this.hide.bind(this)} visible={this.state.record} that={this.props}></RecordModel>
        <WarnModel info={this.state.rowData} hide={this.hide.bind(this)} visible={this.state.warn}></WarnModel>
      </div>
    )
  }
}
function mapStateToProps(state) {
  const {returnVisit} = state
  const { totalSize } = state.table
  return { returnVisit,totalSize }
}
const WrappedTimeRelatedForm = Form.create({ name: 'time_related_controls' })(Index)
export default connect(mapStateToProps)(WrappedTimeRelatedForm)
