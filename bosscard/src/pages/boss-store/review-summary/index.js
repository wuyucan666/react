import React, { Component } from 'react'
import FormTitle from 'components/FormTitle'
import { Button,Modal,Form, DatePicker ,Select,Radio,Table, Input,Spin,message} from "antd"
import services from '../../../services'
import styles  from './styles.less'
const {  RangePicker } = DatePicker
const satisfaction=(code)=>{
  let num=parseInt(code)
  switch (num) {
    case 1:
      return '很不满意'
    case 2:
      return '不满意'
    case 3:
      return '一般'
    case 4:
      return '满意'
    case 5:
      return '很满意'
    default:
      return '未知满意度'
  }
}
export default class Index extends Component {
  constructor(){
      super()
      this.state={
        data:null,
        construction:null,
        insurance:null,
        examined:null,
        abnormalShop:null,
        membership:null,
        starTime:null,
        endTime:null,
      }
  }
  UNSAFE_componentWillMount(){
        // this.getRecord(clientInfo.clientId)
        this.getToday()
  }
  /**
   * 今日
   */
  getToday(){
    var starTime=parseInt(new Date(new Date().toLocaleDateString()).getTime()/1000)
    var endTime=parseInt(new Date().getTime()/1000)
    this.setState({
      endTime,
      starTime,
    })
    services.getReviewTotal({keys:{name:'returnVisit/summary'},data:{endTime:endTime,startTime:starTime}}).then(res=>{
      this.setState({
        construction:res.data.construction,
        insurance:res.data.insurance,
        examined:res.data.examined,
        abnormalShop:res.data.abnormalShop,
        membership:res.data.membership,
      })
    })
  }
  /**
   * 本月
   */
  getFirstDay(){
    const {endTime}=this.state
    var data=new Date()
    data.setDate(1)
    data.setHours(0)
    data.setSeconds(0)
    data.setMinutes(0)
    var start=parseInt(data.getTime()/1000)
    services.getReviewTotal({keys:{name:'returnVisit/summary'},data:{endTime:endTime,startTime:start}}).then(res=>{
      this.setState({
        construction:res.data.construction,
        insurance:res.data.insurance,
        examined:res.data.examined,
        abnormalShop:res.data.abnormalShop,
        membership:res.data.membership,
      })
    })
  }
  /**
   * 本年
   */
  getCurrentYear(){
    const {endTime}=this.state
    var date=new Date()
    date.setDate(1)
    date.setMonth(1)
    var startTime=parseInt(date.getTime()/1000)
    services.getReviewTotal({keys:{name:'returnVisit/summary'},data:{endTime:endTime,startTime:startTime}}).then(res=>{
      this.setState({
        construction:res.data.construction,
        insurance:res.data.insurance,
        examined:res.data.examined,
        abnormalShop:res.data.abnormalShop,
        membership:res.data.membership,
      })
    })
  }
  onChange(v){
    var starTime=parseInt(v[0].valueOf()/1000)
    var endTime=parseInt(v[1].valueOf()/1000)
    this.setState({
      starTime,
      endTime,
    })

  }
  search(){
    // console.log(v[0].valueOf())
    const {starTime,endTime}=this.state
    services.getReviewTotal({keys:{name:'returnVisit/summary'},data:{endTime:endTime,startTime:starTime}}).then(res=>{
      this.setState({
        construction:res.data.construction,
        insurance:res.data.insurance,
        examined:res.data.examined,
        abnormalShop:res.data.abnormalShop,
        membership:res.data.membership,
      })
    })
  }
  render() {
    const {construction,insurance,examined,abnormalShop,membership} =this.state
    const columns = [{
      title: '回访项',
      dataIndex: 'item',
      width: '35%',
    }, {
      title: '合格分',
      dataIndex: 'score',
      width:'10%'},
      {
        title: '数量',
        dataIndex: 'num',
        width:'10%',
      },
      {
        title: '平均分',
        dataIndex: 'average',
        width:'10%',
      },
      ]
    return (
      <div className={styles.lyc_summaryBox}>
        <div className={styles.lyc_summaryTop}>
          <Button type='primary' onClick={this.getToday.bind(this)} >今日</Button>
          <Button type='primary'onClick={this.getFirstDay.bind(this)}>本月</Button>
          <Button type='primary' onClick={this.getCurrentYear.bind(this)}>本年</Button>
          <RangePicker onChange={this.onChange.bind(this)} style={{ marginRight: '25px' }}></RangePicker>
          <Button type='primary' onClick={this.search.bind(this)}>查询</Button>
        </div>
        <FormTitle style={{borderTop:'1px solid blue'}} name='施工项目到期' ></FormTitle>
        {construction&&<div className={styles.lyc_tableBox}>
          <div>
            <div>满意度调查</div>
            <div className={styles.lyc_leftInfo}>
              <div><span>{construction.top.num}</span><span>回访数量</span></div>
              <div><div>{construction.top.average}<span>{satisfaction(construction.top.average)}</span></div><span>平均分</span></div>
            </div>
          </div>
            <div className={styles.lyc_table}>
              <Table dataSource={construction.details} columns={columns} pagination={false}></Table>
            </div>
        </div>}
         {construction&&<div className={styles.lyc_title} style={{borderTop:construction.details.length===1?'1px solid #f4f4f4':''}}><FormTitle name='车辆保险到期' ></FormTitle></div>}
        {insurance&&<div className={styles.lyc_tableBox}>
          <div>
            <div>满意度调查</div>
            <div className={styles.lyc_leftInfo}>
              <div><span>{insurance.top.num}</span><span>回访数量</span></div>
              <div><div>{insurance.top.average}<span>{satisfaction(insurance.top.average)}</span></div><span>平均分</span></div>
            </div>
          </div>
            <div className={styles.lyc_table}>
              <Table dataSource={insurance.details} columns={columns} pagination={false}></Table>
            </div>
        </div>}
         {insurance&&<div className={styles.lyc_title} style={{borderTop:insurance.details.length===1?'1px solid #f4f4f4':''}}><FormTitle name='车检(年审)到期' ></FormTitle></div>}
        {examined&&<div className={styles.lyc_tableBox}>
          <div>
            <div>满意度调查</div>
            <div className={styles.lyc_leftInfo}>
              <div><span>{examined.top.num}</span><span>回访数量</span></div>
              <div><div>{examined.top.average}<span>{satisfaction(examined.top.average)}</span></div><span>平均分</span></div>
            </div>
          </div>
            <div className={styles.lyc_table}>
              <Table dataSource={examined.details} columns={columns} pagination={false}></Table>
            </div>
        </div>}
        {examined&&<div className={styles.lyc_title} style={{borderTop:examined.details.length===1?'1px solid #f4f4f4':''}}><FormTitle name='客户到店异常' ></FormTitle></div>}
        {abnormalShop&&<div className={styles.lyc_tableBox}>
          <div>
            <div>满意度调查</div>
            <div className={styles.lyc_leftInfo}>
              <div><span>{abnormalShop.top.num}</span><span>回访数量</span></div>
              <div><div>{abnormalShop.top.average}<span>{satisfaction(abnormalShop.top.average)}</span></div><span>平均分</span></div>
            </div>
          </div>
            <div className={styles.lyc_table}>
              <Table dataSource={abnormalShop.details} columns={columns} pagination={false}></Table>
            </div>
        </div>}
        {abnormalShop&&<div className={styles.lyc_title} style={{borderTop:abnormalShop.details.length===1?'1px solid #f4f4f4':''}}><FormTitle name='会员卡到期' ></FormTitle></div>}
        {membership&&<div className={styles.lyc_tableBox}>
          <div>
            <div><div>满意度调查</div></div>
            <div className={styles.lyc_leftInfo}>
              <div><span>{membership.top.num}</span><span>回访数量</span></div>
              <div><div>{membership.top.average}<span>{satisfaction(membership.top.average)}</span></div><span>平均分</span></div>
            </div>
          </div>
            <div className={styles.lyc_table}>
              <Table dataSource={membership.details} columns={columns} pagination={false}></Table>
            </div>
        </div>}
        {membership&&<div className={styles.lyc_title} style={{borderTop:membership.details.length===1?'1px solid #f4f4f4':''}}></div>}
      </div>
    )
  }
}
