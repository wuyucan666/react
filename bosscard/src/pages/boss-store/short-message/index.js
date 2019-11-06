import React, { Component } from 'react'
import { Icon, message,Button } from "antd"
import CommonTable from "../../../components/CommonTable/index" 
import services from "../../../services"
import { connect } from 'dva'
import tableConfig from './tableConfig'
import styles from './styles.less'
import Add from "./components/add"

class Index extends Component {
  constructor(props){
    super(props)
    this.state={
      smsAmount:'',
      showAdd: false,
    }
  }
  UNSAFE_componentWillMount(){
    services.msmNum({keys: {name: 'store/smsGroupMessage/create'},data: {q: {page:-1,limit: -1,where: {}}}}).then((res)=>{
    if(res.code==='0'){
      var num=res.data.smsAmount
      this.setState({smsAmount:num})
    }
   })
  }
  // shouldComponentUpdate(nextProps, nextState){
  //   console.log('next',nextState.smsAmount)
  //   if(this.state.smsAmount!==nextState.smsAmount){
  //     return true
  //   }
  // }
  showAdd = () => {
    this.setState({
      showAdd: true,
    })
  }
  hideAdd = () => {
    this.setState({
      showAdd: false,
    })
  }
  onTableChange(type,value){
    if(type===11){
      services.deleteNote({keys:{name:'store/smsGroupMessage',id:value.id}}).then((res=>{
        if(res.code==='0'){
          message.success('删除成功')
          this.props.dispatch({
            type: "table/getData",
            payload: { new: true },
          })
        }
      }))
    }
  }
  render() {
    const {smsAmount, showAdd}=this.state
    tableConfig.screen={
      col: 4,
      rules: [
      {
        type: "text",
        placeholder: '标题/内容',
        prop: "title,content",
      }],
      moreContent:(<div className={styles.headerBtn}>
      {smsAmount<90&&(<div className={styles.pop}>
      <p style={{color:'#666666',fontWeight:'bold',fontSize:'12px'}}><Icon type='warning' style={{color:'#ff6f28',marginRight:'2px'}}></Icon> 短信剩余次数不多，请联系客服进行购买</p>
      <p>客服热线：<span style={{color:'#4aacf7'}}>18565513563</span></p>
      </div>)}
    <p style={{color:'#333333',fontWeight:'bold'}}>剩余短信 <span style={{color:'#ff6f28'}}>{smsAmount}</span></p>
    <Button type='primary' size='large' onClick={()=>{this.setState({showAdd:!showAdd})}} style={{marginLeft:'24px',cursor:'pointer'}}>新增</Button>
    </div>)}
    return (
      <div>
        {showAdd && <Add
          // type='add'
          // editItem={{}}
          onCancel={this.hideAdd}
          // onUpdate={this.updateDetail}
          goBack={this.hideAdd}
          styles={styles}
        />}
        {!showAdd && <CommonTable
          name="store/smsGroupMessage"
          tableConfig={tableConfig}
          onTableChange={this.onTableChange.bind(this)}
          New
          ></CommonTable>
        }
        
      </div>
    )
  }
}
function mapStateToProps(state) {
  const {sms} = state
  return { sms }
}
export default connect(mapStateToProps)(Index)