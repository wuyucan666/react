import React,{ Component } from "react"
import B from './routineCheck.js'
import A from './kindCheck.js'
import { Modal , Tabs  } from 'antd'
const TabPane = Tabs.TabPane
class  CheckCar extends Component{
    constructor(){
        super()
        this.state={

        }
    }
    handleCancel=()=>{
        const { changeMast } = this.props
        changeMast(false,null)
    }
    render(){
        const { visible , orderId} = this.props
        return <div>
                    <Modal
                    title="车检报告"
                    width='1200px'
                    visible={visible}
                    onCancel={this.handleCancel}
                    footer={null}
                    zIndex='20000'
                    >
                        <Tabs defaultActiveKey="1">
                            <TabPane tab="常规验车" key="1">
                                <B  
                                  orderId={ orderId }
                                 />
                            </TabPane>
                            <TabPane tab="36项安全检查" key="2">

                                <A
                                   orderId={ orderId }
                                  />
                            </TabPane>
                        </Tabs>
                    </Modal>
               </div>
    }
}
export default CheckCar