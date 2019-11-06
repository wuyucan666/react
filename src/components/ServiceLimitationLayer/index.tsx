import React, { Component } from 'react'
import { Button } from 'antd'
import router from "umi/router"
import { connect } from "dva";
const img = require('./caozuoxianshi1.png')
const styles = require('./index.less')
interface Props {
  dispatch: (any) => void
}
/** 业务限制遮罩组件 */
export default connect()(class ServiceLimitationLayer extends Component<Props> {
  state = {
    showMask: false
  }
  componentDidMount() {
    /**
     * 查看权限
     * 如果是门店预留手机账号，不具有开单等业务的权限
     */
    const loginType: string = localStorage.getItem('loginType') // 为3是门店
    const staffId: string = localStorage.getItem('staffId') // 为0是门店预留手机号
    if (loginType === '3' && staffId === '0') {
      this.setState({ showMask: true })
    }
  }
  handlerToCreateStaff() {
    router.push('/boss-store/staff')
  }
  loginout() {
    this.props.dispatch({ type: "app/logout" })
  }
  render() {
    return (
      <div className={styles.wrap}>
        {this.state.showMask && <div className="mask flex center">
          <div className="content flex center column">
            <img src={img} />
            <div className="content-text1">很抱歉，管理员账号不能用于开单办卡!</div>
            {/* <div className="content-text2">请切换门店员工账号登陆操作！</div> */}
            <div>
              <Button size="large" type="primary" style={{ marginRight: 40, width: '150px', height:'40px'}} onClick={this.handlerToCreateStaff}>去新建员工</Button>
              <Button size="large" type="primary" style={{  width: '164px', height:'40px'}} onClick={this.loginout.bind(this)}>更换账号登陆</Button>
            </div>
          </div>
        </div>}
        {this.props.children}
      </div>
    )
  }
})
