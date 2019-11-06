import React, {Component} from 'react'
import { connect } from "dva"
import CollectData from './components/CollectData'
import SalesRank from './components/SalesRank'
import RevenueTrend from './components/RevenueTrend'
import Receipts from './components/Receipts'
import CategoryRank from './components/CategoryRank'
import StaffRank from './components/StaffRank'
const img = require('./images/quanxian.jpg') 
import Daily from './daily'

const style = require( './style.less')


export default connect()(class Index extends Component<any>{
  state = {
    isShowDaily: false, // 今日报表
    hasPermission: true, //是否拥有查看权限
  }

  componentDidMount () {
    const hasPermission = localStorage.getItem('permissionRole').indexOf('9cf1ca00') > -1
    this.setState({
      hasPermission,
    })
  }

  showDaily = () => {
    this.setState({
      isShowDaily: true
    })
    this.props.dispatch({ type: 'app/resetBreads', payload: {breadsName:'营收简报'} })
  }

  hideDaily = () => {
    this.setState({
      isShowDaily: false
    })
    this.props.dispatch({ type: 'app/resetBreads', payload: {} })
  }

  componentWillUnmount(){
    this.props.dispatch({ type: 'app/resetBreads', payload: {} })
  }

  render(){
    const { isShowDaily, hasPermission } = this.state
    return(
      <div className={style.container}>
        {
          hasPermission ? 
          <div>
            {
              !isShowDaily&&
              <div>
                <CollectData showDaily={this.showDaily} />
                <RevenueTrend/>
                <div className={`${style.container_item} flex`}>
                  <div className="item">
                    <Receipts/>
                  </div>
                  <div className="item">
                    <CategoryRank/>
                  </div>
                </div>
                <StaffRank/>
                <SalesRank/>
              </div>
            }
            {isShowDaily&&<Daily hideDaily={this.hideDaily} />}
          </div>
          :
          <div className={style.empty}>
            <img src={img} alt=""></img>
            <span>您无权限查看此页面，请联系门店负责人。</span>
          </div>
        }
      </div>
    );
  }
})


