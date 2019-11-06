import React, { Component } from 'react'
import styles from './styles.less'
import CommonMenu from './components/commonMenu'
import CommonTable from "../../../components/CommonTable/index"
import tableConfig from './tableConfig'
import { connect } from 'dva'
import services from "../../../services"
import { Button,Tag } from "antd"
import RecordModel from './components/recordModel'
import WarnModel from './components/warnModel'
import CommonRecord from './components/commonRecord'
import moment from 'moment'
// import table from '../card-statistics/table'

class VisitAlready extends Component {
  constructor(props){
    super(props)
    this.state={
      record:false,
      warn:false,
      rowData:{},
      data:[],
      recordShow:false,
      info:{
        clientName:null,
        type:null,
        staffName:null,
        reason:null,
      },
    }
  }
  componentDidMount(){
    console.log('第二步：是否接收到回访设置页面跳转过来的参数',this.props.location.state)
    let o = this.props.location.state
    if(o){
      this.onTableChange(11,o.rowData)
    }
  }
  hide(type){
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
  onTableChange(e,v){
    this.setState({
      rowData:v,
    })
    const {dispatch} = this.props
    if(e===11){
      // 如果是开单回访，默认请求施工到期回访
      let type = v.type*1 ===7 ? 6 : v.type
      services.getReturnProject({keys:{name:'returnVisit/item'},data:{type:type}}).then(res=>{
        this.setState({
          data:res.list,
        })
      })
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
    }else if(e===9){
      dispatch({type:'returnVisit/getRecordInfo',payload:{v:v.id}})
      this.setState({
        recordShow:true,
      })
      this.setState({
        info:v,
      })
    }
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
    componentWillUnmount(){
      tableConfig.screen.query={}//卸载时查询条件重置
    }
    componentWillReceiveProps(nextprops){
      if(this.props.totalSize===nextprops.totalSize){
        return
      }
      const { dispatch } = this.props
        dispatch({
          type:'maintianList/customizeNumber',
          payload:{
            count:nextprops.totalSize,
            type:'getReturnTatal',
            index:3,
          },
       })
    }
  render() {
    const {info}=this.state
    tableConfig.headers[0].render=((e)=>{
      return (<div className={styles.lyc_carAttn}>
        <span>{e.plateNumber}</span>
        <span onClick={this.goClient.bind(this,{orderNo:e.orderNo,orderType:null},1)}>{e.clientName}&nbsp;({e.phone})</span>
      </div>)
    })
    tableConfig.headers[7].name='最近回访时间'
    tableConfig.headers[7].render=(e)=>{
      return (<div className={styles.lyc_tag}>
        <Tag visible={e.overdueTime>0} color="#FF6F28">逾期</Tag>
        <span >{moment(e.latestAt*1000).format('YYYY-MM-DD')}</span>
      </div>)
    }
    tableConfig.headers[8].render=((e)=>{
      return (<div onClick={this.goClient.bind(this,{orderNo:e.orderNo,orderType:null},2)} style={{color:'#4aacf7',cursor:'pointer'}}>
      {e.orderNo}
      </div>)
    })
    tableConfig.screen.moreContent = (
      <div style={{ display: "flex" }}>
        {/* <Button
          style={{ width: "120px", height: '40px' }}
          type="primary"
          shape="circle"
          icon="printer"
        >
          打印
        </Button> */}
      </div>
    )
    //顾客信息跳过来的处理
    if(this.props.location.query.clientId){
    tableConfig.screen.query={state:3,'clientId':this.props.location.query.clientId}
    }else{
      tableConfig.screen.query={state:3}
    }
    tableConfig.screen.rules[3]= {
      type: "date<>",
      label: "回访时间",
      prop: "visitTime",
    }
    tableConfig.moreBtn=[
      {
        name: "添加记录",
        power: "Edit",
        icon: "icon-tianjiahuifangjilu",
        type: 11,
      },
      {
        name: "回访历史",
        power: "Edit",
        icon: "icon-huifangjilu",
        type: 9,
        show:(e)=>{
          if(e.visitTotal){
            return true
          }else{
            return false
          }
        },
      },
     ]
    return (
      <div>
        {/* <div className={styles.zl_tableBox}><CommonMenu index={3}></CommonMenu></div> */}
        <CommonTable
        name="returnVisit/visit"
        tableConfig={tableConfig}
        New
        onTableChange={this.onTableChange.bind(this)}
        ></CommonTable>
        <RecordModel tableData={this.state.data.reverse()} info={this.state.rowData} hide={this.hide.bind(this)} visible={this.state.record} that={this.props}></RecordModel>
        <WarnModel hide={this.hide.bind(this)} visible={this.state.warn}></WarnModel>
        <CommonRecord info={info} visible={this.state.recordShow} hide={this.hide.bind(this)}></CommonRecord>
      </div>
    )
  }
}
function mapStateToProps(state) {
  const {returnVisit} = state
  const { totalSize } = state.table
  return { returnVisit, totalSize }
}
// const WrappedTimeRelatedForm = Form.create({ name: 'time_related_controls' })(Index)
export default connect(mapStateToProps)(VisitAlready)
