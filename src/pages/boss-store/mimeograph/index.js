import React,{ Component } from 'react'
import { Tabs  } from 'antd'
import style from './style.less'
import Receipt from './components/receipt'
import PayBilling from './components/payBillingSetting'
// import P  from './receipts/billingPay'
// import M from './receipts/billingMateriel'
// import C from './receipts/billingConstruction'
const TabPane = Tabs.TabPane

class mimeograph extends Component{
    constructor(){
        super()
        this.state={
            a:1,
        }
    }
    render(){
        return <div className={ style.zl_mimeograph }  >
                  <Tabs defaultActiveKey="1" onChange={this.changTab}>
                        <TabPane tab="小票设置" key="1">
                           <Receipt  />
                        </TabPane>
                        <TabPane tab="结算单设置" key="2">
                             <PayBilling />
                        </TabPane>
                        {/* <TabPane tab="结算单测试" key="3"  >
                             <div className={ style.zl_textMast } >
                               
                                <P 
                                 scale={0.25}
                                 type={3}

                                />
                             </div>
                        </TabPane>
                        <TabPane tab="进退料单测试" key="4"  >
                             <div className={ style.zl_textMast } >
                               <M 
                                scale={ 0.5 }
                                type={0}
                               />
                             </div>
                        </TabPane>
                        <TabPane tab="施工单测试" key="5"  >
                             <div className={ style.zl_textMast } >
                               <C
                                scale={0.5}
                                />>
                             </div>
                        </TabPane> */}
                  </Tabs>
               </div>
    }
}
export default mimeograph