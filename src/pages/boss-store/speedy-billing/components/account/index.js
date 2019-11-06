/**
 * Created by kikazheng on 2018/12/5
 */
import React,{Component} from 'react'
import {Tabs} from 'antd'
import Guide from './guide'
import Package from './package'
// import Coupon from './coupon'
import Presentation from './presentation'

const TabPane = Tabs.TabPane

class Account extends Component{
  render(){
    const {account} = this.props
    return(
      <Tabs defaultActiveKey="1" style={{marginTop:20}}>
        <TabPane tab="服务指南" key="1">
          <Guide clientId={account.clientInfo.clientId} consume={account.consume} record={account.record} />
        </TabPane>
        <TabPane tab={`套餐项目（${account.package.length}）`} key="2">
          <Package data={account.package}/>
        </TabPane>
        {/*<TabPane tab={`优惠券（${account.coupon.length}）`} key="3">*/}
          {/*<Coupon data={account.coupon}/>*/}
        {/*</TabPane>*/}
        <TabPane tab={`赠送（${account.presentation.length}）`} key="3">
          <Presentation data={account.presentation}/>
        </TabPane>
      </Tabs>
    )
  }
}

export default Account
