import { connect } from "dva"
import { Component } from "react"
import  styles  from './styles.less'
import {Button, Tabs} from 'antd'
import  Essential  from './components/Essential-infor/index.js'
import  Cardetails  from './components/cardetails/index.js'
import  CardInformation  from './components/cardInformation/index.js'
import  Coninfor  from './components/coninfor/index.js'
import  Settleccounts  from './components/settleccounts/index.js'
// import Detail from '../detail/list'
// import SpeedyDetail from '../detail/Klist'
import ComDetail from '../detail/Klist'
import React from "react"

const TabPane = Tabs.TabPane

class customerLists extends Component {
  	state = {
      activeKey: '1',
      showDetail: false,
      showSpeedyDetail: false,
      detail: {},
  	}
    onChange = (activeKey) => {
  	  this.setState({activeKey})
    }
  	goBack =() => {
	  	this.setState({
        showDetail: false,
        showSpeedyDetail: false,
      })
  	}
  	// 获取详情
  	getsongdata = (id, type) => {
  	  if(type === 3){
        this.setState({
          detail: {
            orderId: id,
            orderType: type,
          },
          showDetail: true,
        })
      }else {
        this.setState({
          detail: {
            orderId: id,
            orderType: type,
          },
          showSpeedyDetail: true,
        })
      }

  	}
  	render() {
      const { clientId, updateOrder, goBack , goClient , siderFold, isRequsetList  } = this.props
      console.log('客户详情首页面isRequsetList',isRequsetList)
  		const { showDetail, showSpeedyDetail, detail, activeKey} = this.state
      if(showDetail){
        return (
          // <Detail
          //   updateOrder={updateOrder}
          //   detailList={ detail }
          //   notShow={ this.goBack }
          // />
          <ComDetail
            updateOrder={updateOrder}
            detailList={ detail }
            notShow={ this.goBack }
          />
        )
      }else if(showSpeedyDetail){
        return (
          // <SpeedyDetail
          //   updateOrder={updateOrder}
          //   detailList={ detail }
          //   notShow={ this.goBack }
          // />
          <ComDetail
            updateOrder={updateOrder}
            detailList={ detail }
            notShow={ this.goBack }
          />
        )
      }else {
        return (
          <div className={styles.customBack}  style={{ left: siderFold ? '80px' : '200px'  }}   >
            <div style={{height: '100%', overflowY: 'scroll'}}>
              <div className={ styles.listOne } style={{ height:'60px' }} >
                <span>客户资料</span>
                {/* <span><i  className="iconfont icon-bangzhu" ></i>帮助中心 </span> */}
              </div>
              {/* <div className={styles.yc_backdiv}><div className={styles.yc_back}><Button  className={styles.yc_backbtn} onClick={()=>goBack(goClient)} >  ＜ 返回上一级 </Button></div></div> */}
              <div className={styles.tabpagediv}>
                <div className={styles.yc_backdiv}>
                  <div className={styles.yc_back}><Button  className={styles.yc_backbtn} onClick={()=>goBack(goClient)} >  <i className='iconfont icon-fanhui1'></i>返回上一级 </Button></div>
                    <Tabs activeKey={activeKey} onChange={this.onChange}>
                      <TabPane tab="基本信息" key="1">
                        {activeKey === '1' &&  <Essential clientId={clientId} isRequsetList={isRequsetList}/>}
                      </TabPane>
                      <TabPane tab="车辆信息" key="2">
                        {activeKey === '2' &&  <Cardetails clientId={clientId}/>}
                      </TabPane>
                      <TabPane tab="卡项信息" key="3">
                        {activeKey === '3' &&  <CardInformation clientId={clientId} />}
                      </TabPane>
                      <TabPane tab="消费信息" key="4">
                        {activeKey === '4' &&  <Coninfor  getsongdata={this.getsongdata} clientId={clientId} />}
                      </TabPane>
                      <TabPane tab="挂账" key="5">
                        {activeKey === '5' &&  <Settleccounts getsongdata={this.getsongdata} clientId={clientId}/>}
                      </TabPane>
                    </Tabs>
                  </div>
                </div>
            </div>
          </div>
        )
      }
  	}
}
function mapStateToProps(state) {
  const {  siderFold } = state.app
  return { siderFold }
}
export default connect(mapStateToProps)(customerLists)
