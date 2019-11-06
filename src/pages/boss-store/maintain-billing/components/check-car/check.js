/**
 * Created by kikazheng on 2018/12/3
 */
import React,{Component} from "react"
import styles from "./style.less"
// import yanche from "../images/36jiancha.png"
import bentian from "../images/bentian.png"
import {Modal,Table,Badge,Select,Input, Button} from 'antd'
import {data} from '../../cacheData'
import clonedeep from 'lodash.clonedeep'

const { Column } = Table
const { Option } = Select
const { TextArea } = Input

class Check extends Component{
  state = {
    visible: false,
    dataSource: [],
  }
  componentDidMount() {
    this.initData()
  }
  initData = () => {
    const {checks} = this.props
    const dataSource = clonedeep(data)
    checks.forEach(item => {
      const index = dataSource.findIndex(item2 => item2.index === item.index)
      if(index > -1){
        dataSource[index] = {
          ...dataSource[index],
          result:item.result,
          explain:{
            ...dataSource[index].explain,
            value:[...item.explain],
          },
          scheme:{
            ...dataSource[index].scheme,
            value:[...item.scheme],
          },
          time:item.time,
          remark:item.remark,
        }
      }
    })
    this.setState({
      dataSource,
    })
  }
  toggleModal = () => {
    this.setState((prevState)=>{
      return {
        visible:!prevState.visible,
      }
    })
  }
  handleChange = (property,index,value) => {
    const {dataSource} = this.state
    if(property === 'explain' || property === 'scheme'){
      dataSource[index][property].value = value
    }else {
      dataSource[index][property] = value
    }
    this.setData(dataSource)
  }
  checkAll = (carType) => {
    const {dataSource} = this.state
    dataSource.forEach(item => {
      if(item.index > 0 && item.carType === carType){
        item.result = 1
      }
    })
    this.setData(dataSource)
  }
  setData = (data) => {
    // const {dispatch} = this.props
    // const checks = data.filter(item => item.index > 0 && (item.explain.value.length || item.scheme.value.length || item.time || item.remark) ).map(item => ({
    //   index:item.index,
    //   result:item.result,
    //   explain:item.explain.value,
    //   scheme:item.scheme.value,
    //   time:item.time,
    //   remark:item.remark,
    // }))
    // dispatch({
    //   type:'maintainBilling/setChecks',
    //   payload:checks,
    // })
    this.setState({
      dataSource:data,
    })
  }
  onOk = () => {
    const { dataSource } = this.state
    const {dispatch} = this.props
    const checks = dataSource.filter(item => item.index > 0 ).map(item => ({
      index:item.index,
      result:item.result,
      explain:item.explain.value,
      scheme:item.scheme.value,
      time:item.time,
      remark:item.remark,
    }))
    dispatch({
      type:'maintainBilling/setChecks',
      payload:checks,
    })
    this.props.onOk()
  }
  onCancel = () => {
    this.initData()
    this.props.onCancel()
  }
  //打印
  printCarInspection=()=> {
    this.props.onPrintCityOrder()
  }
  render(){
    const {visible,dataSource} = this.state
    const {checks, visible: showModal} = this.props
    const checkNum =  checks.length
    const unusualNum = checks.filter(item => (item.result === 2)).length
    return(
      <Modal
        title='36项检查'
        visible={showModal}
        width={1110}
        destroyOnClose
        maskClosable={false}
        onOk={this.onOk}
        onCancel={this.onCancel}
        footer={null}
      >
        <div  style={{height: 570, overflowY: 'scroll'}}>
          <div className={styles.checkTip}>
            门店36项通常在实际的运用过程中，往往不知道怎样跟客户进行沟通和销售，所以此例将针对于36项该如何运用进行一个说明，主要分为体验式、销售式、提醒式三个环节。-- <a onClick={this.toggleModal}>查看案列</a>
          </div>
          <div className={styles.tableHead}>
            <div className={styles.check}>
              <span>检查方法：</span>
              <span>目测检查</span>
              <span>手动检查</span>
              <span>专用工具检查</span>
            </div>
            <div>已经查 <span style={{color:'#4AACF7'}}>{checkNum}</span> 项，<span style={{color:'#F90D09'}}>{unusualNum}</span> 项异常</div>
          </div>
          <Table
            scroll={{ x: 1036}}
            className={styles.checkTable}
            style={{marginBottom:33}}
            rowKey={record => record.index}
            rowClassName={record => {return record.index < 0 ? 'tableTitle' : ''}}
            dataSource={dataSource}
            pagination={false}
          >
            <Column
              title="序号"
              dataIndex="index"
              key="index"
              width={70}
              align='left'
              render={(text,record)=> {
                const index = record.index
                if (index < 0) {
                  return ''
                }else {
                  return text
                }
              }}
            />
            <Column
              title="检查项目"
              dataIndex="project"
              key="project"
              width={170}
              align='left'
              render={(text,record) => {
                if(record.index > 0){
                  return(
                    <div className={styles.project}>
                      {
                        record.type === 'D' &&
                        <div className={styles.manual}>D</div>
                      }
                      {
                        record.type === 'G' &&
                        <div className={styles.tool}>G</div>
                      }
                      {
                        record.type === 'M' &&
                        <div className={styles.visual}>M</div>
                      }
                      <div style={{flex:1}}>{text}</div>
                    </div>
                  )
                }else {
                  return text
                }
              }}
            />
            <Column
              title="检查结果"
              dataIndex="result"
              key="result"
              width={150}
              align='left'
              className='projectBadge'
              render={(text,record,index)=> {
                const dIndex = record.index
                if (dIndex < 0) {
                  return <div style={{textAlign:'center'}}><a  onClick={()=>this.checkAll(record.carType)}>全部正常</a></div>
                }else {
                  return (
                    <div className={styles.result} style={{alignItem:'center'}}>
                      {
                        text === 0 &&
                        <Badge status="default"  />
                      }
                      {
                        text === 1 &&
                        <Badge status="success" />
                      }
                      {
                        text === 2 &&
                        <Badge status="error"  />
                      }
                      <Select
                        style={{flex:1,minWidth:114}}
                        size='large'
                        placeholder='未检查'
                        value={text ? text : undefined}
                        onChange={(value)=>this.handleChange('result',index,value)}
                        getPopupContainer={triggerNode => triggerNode.parentNode}
                      >
                        <Option value={1}>正常</Option>
                        <Option value={2}>异常</Option>
                      </Select>
                    </div>
                  )
                }
              }}
            />
            <Column
              title="结果说明"
              dataIndex="explain"
              key="explain"
              width={220}
              align='left'
              render={(text,record,index)=> {
                const dIndex = record.index
                if (dIndex < 0) {
                  return {
                    children: '',
                    props: {
                      colSpan: 4,
                    },
                  }
                }else {
                  return (
                    <Select
                      disabled={!record.result}
                      className='explainSelect'
                      mode='multiple'
                      size='large'
                      style={{width:'100%'}}
                      value={text.value}
                      onChange={(value)=>this.handleChange('explain',index,value)}
                      getPopupContainer={triggerNode => triggerNode.parentNode}
                    >
                      {
                        text.list.map((item,index)=>(
                          <Option value={item} key={index}>{item}</Option>
                        ))
                      }
                    </Select>
                  )
                }
              }}
            />
            <Column
              title="解决方案"
              dataIndex="scheme"
              key="scheme "
              width={220}
              align='left'
              render={(text,record,index)=> {
                const dIndex = record.index
                if (dIndex < 0) {
                  return {
                    children:'',
                    props:{
                      colSpan:0,
                    },
                  }
                }else {
                  return (
                    <Select
                      disabled={!record.result}
                      className='explainSelect'
                      mode='multiple'
                      size='large'
                      style={{width:'100%'}}
                      value={text.value}
                      onChange={(value)=>this.handleChange('scheme',index,value)}
                      getPopupContainer={triggerNode => triggerNode.parentNode}
                    >
                      {
                        text.list.map((item,index)=>(
                          <Option value={item} key={index}>{item}</Option>
                        ))
                      }
                    </Select>
                  )
                }
              }}
            />
            {/* <Column
              title="工时"
              dataIndex="time"
              key="time "
              width={100}
              align='left'
              render={(value, row,index) => {
                const obj = {
                  children: <InputNumber size='large' min={0} precision={1} disabled={!row.result}  value={value?value:undefined} onChange={value => this.handleChange('time',index,value)}/>,
                  props: {},
                }
                const dIndex = row.index
                if (dIndex < 0) {
                  obj.props.colSpan = 0
                }
                return obj
              }}
            /> */}
            <Column
              title="备注"
              dataIndex="remark"
              key="remark "
              width={250}
              align='left'
              render={(value, row,index) => {
                const obj = {
                  children: <TextArea size='large' style={{minHeight:40,padding:'10px 11px'}} disabled={!row.result} value={value} autosize={true} onChange={e => this.handleChange('remark',index,e.target.value)}/>,
                  props: {},
                }
                const dIndex = row.index
                if (dIndex < 0) {
                  obj.props.colSpan = 0
                }
                return obj
              }}
            />
          </Table>
          <Modal
            title="案例说明"
            visible={visible}
            width={1110}
            footer={null}
            onCancel={this.toggleModal}
          >
            <div className={styles.goBack} onClick={this.toggleModal}><i className='iconfont icon-xiangzuo'/>返回检查表</div>
            <div style={{height: 617, overflowY: 'scroll'}}>
              <div className={styles.exampleTitle}>进店车辆</div>
              <div className={styles.exampleCar}>
                <img src={bentian} alt=""/>
                <div className={styles.carInfo}>
                  <div>
                    <span>06款本田雅阁</span>
                    <span>公里数12万公里</span>
                  </div>
                  <div>
                    <span>个人用车</span>
                    <span>平常保养一般</span>
                  </div>
                </div>
              </div>
              <div className={styles.exampleTitle}>体验式</div>
              <div>
                <p className={styles.infoDesc}><span className={styles.infoTitle}>技师/服务顾问：</span>XX哥/姐您好，刚刚师傅在帮您检查/保养的过程中发现您的雨刮片刮的不是很干净了，有点模糊。不过没有关系，我刚跟师傅沟通过了，让他帮您免费处理下，玻璃磨磨泥、雨刮片打磨下，如果可以的话就可以了，不可以的话估计就要更换雨刮片了。</p>
                <p className={styles.infoDesc}><span className={styles.infoTitle}>顾客：</span>可以呀，谢谢啊。</p>
                <p className={styles.infoDesc}><span className={styles.infoTitle}>技师/服务顾问：</span>不客气，这是我们应该做的。</p>
              </div>
              <div className={styles.exampleTitle}>销售式</div>
              <div>
                <p className={styles.infoDesc}><span className={styles.infoTitle}>技师/服务顾问：</span>您好XX哥/姐，刚雨刮片帮您已经打磨处理了，但是刮起来还是有点模糊。</p>
                <p className={styles.infoDesc}><span className={styles.infoTitle}>顾客：</span>那咋办嘞？</p>
                <p className={styles.infoDesc}><span className={styles.infoTitle}>技师/服务顾问：</span>您看最近雨季蛮多的，雨刮不干净又会影响我们的安全行车视线，所以建议您更换一对。</p>
                <p className={styles.infoDesc}><span className={styles.infoTitle}>顾客：</span>那多少钱呀？用段时间在说吧。</p>
                <p className={styles.infoDesc}><span className={styles.infoTitle}>技师/服务顾问：</span>没多少钱的，刚好我们店里雨刮片在做活动原价XX钱一对，现在活动只需要XX钱就可以了。</p>
                <p className={styles.infoDesc}>您看XX哥/姐，刚刚我让师傅已经帮您处理过了，还是不行，您就是在用段估计也会越来越差，还是建议您换一对比较安全，刚好咱门店里现在有个雨刮片的活动。</p>
              </div>
              <div className={styles.exampleTitle}>提醒式</div>
              <div style={{paddingBottom:121}}>
                <p className={styles.infoDesc}><span className={styles.infoTitle}>技师/服务顾问：</span>您好XX哥/姐，刚咱们师傅帮您检查的时候发现刹车片的厚度呀已经挺薄的啦。</p>
                <p className={styles.infoDesc}><span className={styles.infoTitle}>顾客：</span>那咋办嘞？</p>
                <p className={styles.infoDesc}><span className={styles.infoTitle}>技师/服务顾问：</span>没关系，按照您的这个厚度，大概还能用到XX公里，您多留意下里程，快到了XX公里，您就把车开过来，我们再帮您检查一下。</p>
              </div>
            </div>
          </Modal>
        </div>
        <div style={{padding: '32px 0', textAlign: 'right'}}>
          <Button style={{width:'88px', marginLeft:'24px'}} onClick={this.onCancel} size='large'>取消</Button>
          <Button style={{width:'88px', marginLeft:'24px'}} onClick={this.printCarInspection} size='large'>打印</Button>
          <Button style={{width:'88px', marginLeft:'24px'}} onClick={this.onOk} type='primary' size='large'>确定</Button>
        </div>
      </Modal>
    )
  }
}

export default Check
