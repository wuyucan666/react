import React, { Component } from 'react'
import { Modal, Form, DatePicker, Select, Radio, Table, message, Tabs } from "antd"
import { connect } from 'dva'
import styles from '../styles.less'
// import moment from 'moment'
import services from "../../../../services"
import moment from 'moment'
const TabPane = Tabs.TabPane
 /**
* tab标题切换
*/
function returnVisit(item,index,length){
 var val=moment(item.visitTime*1000).format('YYYY-MM-DD')
 var count='n'
 switch (length) {
   case 3:
     if(index===0){
       count='三'
     }else if(index===1){
       count='二'
     }else{
      count='一'
     }
     break
     case 2:
     if(index===0){
      count='二'
    }else{
     count='一'
    }
     break
     case 1:
      count='一'
     break
   default:
     break
 }
  if(length>3){
    if(index===0){
      count='三'
    }else if(index===1){
      count='二'
    }else if(index===2){
     count='一'
    }
  }
  var validity=item.validity===1?'有效':'无效'
  var tab=`第${count}次回访（${val}）【${validity}】`
  return tab
}
function satisfied(val){
  var  satisfied
  switch (Number(val)) {
    case 5:
  satisfied = '很满意'
  break
    case 4:
  satisfied = '满意'
  break
    case 3:
  satisfied = '一般'
  break
      case 2:
  satisfied = '不满意'
  break
      case 1:
  satisfied = '很不满意'
  break
  default:
  satisfied=''
  break
}
return satisfied
}
function visitType(val){
  var project
  switch (Number(val)){
    case 6:
    project='施工项目到期'
      break
      case 1:
      project='车辆保险到期'
      break
      case 2:
      project='车辆年检到期'
      break
      case 4:
      project='客户异常到店'
      break
      case 3:
      project='会员卡到期'
      break
    default:
    project=''
  }
  return project
}
class CommonRecord extends Component {
  constructor(props) {
    super(props)
  }
  hideModel() {
    console.log(this.props.visitRecord)
    this.props.hide('commonRecord')
  }
  onChange(){
    const {visitRecord}=this.props
    console.log('props',this.props)
  }

  /**
   * 满意度
   */

  /**
   * 类型判断
   */

  render() {
    const {visitRecord,info,visible}=this.props
    var arr=[]
    visitRecord.map((val)=>
    arr.unshift(val)
    )
    const columns= [{
      title: '序号',
      dataIndex:'order',
      width:'10%',
    },
    {
    title:'回访项',
    dataIndex:'item',
    width:'70%',
    render:text=>{
      return <p style={{width:'600px'}}>{text}</p>
    },
    },{
    title:'合格分',
    dataIndex:'qualified',
    width:'10%',
    },
    {
      title:'评分',
      dataIndex:'score',
      width:'10%',
    },
  ]
    return (
      <div>
        <Modal
          style={{ minWidth: '1000px' }}
          title="回访记录"
          visible={visible}
          footer={null}
          onCancel={this.hideModel.bind(this)}
          maskClosable={false}>
          <Tabs defaultActiveKey="1" onChange={this.onChange.bind(this)}>
            {arr.map((item,index)=>{
              return <TabPane tab={returnVisit(item,index,arr.length)} key={index}>
              <div className={styles.lyc_reordTab}>
                <div>
                <p><span>回访对象</span>{info.clientName+'('+info.phone+') '+' '+info.plateNumber}</p>
                <p><span>回访类型</span>{visitType(info.type)}</p>
                <p><span>回访原因</span>{info.reason}</p>
                <p><span>回访员工</span>{item.staffName}</p>
                </div>
                <div>
                <p><span>回访有效性</span>{item.validity===1?'有效':'无效'}</p>
                {item.validity===1&&<p><span>满意度调查</span>{satisfied(item.satisfaction)}</p>}
                {item.validity!==1&&<p><span>下次回访时间</span>{moment(item.nextTime*1000).format('YYYY-MM-DD')}</p>}
                <p><span>备注</span>{item.remark}</p>
                </div>
              </div>
              {item.validity&&<Table pagination={false} columns={columns} dataSource={item.record}></Table>}
              </TabPane>
            })}
          </Tabs>
        </Modal>
      </div>
    )
  }
}
function mapStateToProps(state) {
  const { visitRecord } = state.returnVisit
  return { visitRecord }
}
const WrappedTimeRelatedForm = Form.create({ name: 'time_related_controls' })(CommonRecord)
export default connect(mapStateToProps)(WrappedTimeRelatedForm)
