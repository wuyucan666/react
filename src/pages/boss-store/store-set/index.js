import React, { Component } from 'react'
import services from '../../../services/index'
import { Button } from 'antd'
import Edit from './components/edit'
import style from './style.less'

export default class Index extends Component {
  constructor(props){
    super(props)
    this.state={
      data:{},
      visible:false,
    }
  }
  componentWillMount(){
    this.getData()
  }
  getData(){
    services.getStoreSetInfo({
      keys:{name:'printing/setting/order'},
    }).then(res=>{
      if(res.code==='0'){
        this.setState({
          data:res.data,
        })
      }
    })
  }
  hideEdit(){
    this.setState({
      visible:false,
    })
  }
  handleOk(){
    this.getData()
    this.setState({
      visible:false,
    })
  }
  render() {
    const {visible,data}=this.state
    return (
      <div>
      {!visible&&<div className={style.store}>
        <div>
          <div className={style.title}>结算单展示信息</div>
          <p><span>开户行:</span>{data.bankType}</p>
          <p><span>银行卡号:</span>{data.bankNumber}</p>
          <p><span>税号:</span>{data.taxRegNo}</p>
          <p><span>服务热线:</span>{data.hotLine}</p>
          <p><span>道路救援热线:</span>{data.sosHotLine}</p>
          <p><span>门店地址:</span>{data.address}</p>
          <p><span>门店备注:</span>{data.remark}</p>
        </div>
        <div>
          <div className={style.title}>小程序展示信息:</div>
          <p><span>营业时间:</span>{data.businessDays}</p>
          <p><span>服务热线:</span>{data.hotLine}</p>
          <p><span>门店地址:</span>{data.address}</p>
        </div>
      </div>
      }
      {
        !visible&&<Button style={{marginLeft:'32px'}} onClick={()=>{this.setState({visible:true})}} type='primary'>编辑</Button>
      }
      {visible&&<Edit data={data} onCancel={this.hideEdit.bind(this)} onOk={this.handleOk.bind(this)}></Edit>}
      </div>
    )
  }
}
