/**
 * Created by kikazheng on 2018/11/29
 */
import React,{Component} from 'react'
import { Tabs} from 'antd'
import styles from './style.less'
import Car from './car'
import Check from './check'
import Receive from '../receive-car'

const TabPane = Tabs.TabPane

class Index extends Component{
  render(){
    const {dispatch,checkCar,checks,isCheck,parkInfo,onOk} = this.props
    return(
      <div className={styles.checkInfo}>
        <Tabs defaultActiveKey="1">
          <TabPane tab="接车信息" key="1">
            <Receive dispatch={dispatch} value={parkInfo} onOk={onOk}/>
          </TabPane>
          <TabPane tab="常规车检" key="2">
            <Car dispatch={dispatch} checkCar={checkCar} isCheck={isCheck}/>
          </TabPane>
          <TabPane tab="36项检查" key="3">
            <Check dispatch={dispatch} checks={checks} />
          </TabPane>
        </Tabs>
      </div>
    )
  }
}

export default Index
