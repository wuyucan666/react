import { Component } from "react"
import { Icon, Button } from "antd"
import styles from './Layout.less'

class TipsHelp extends Component {
  state = {
    showpupo: false,
    showpupoProject: true,
  }
  componentDidMount() {
    const { route } = this.props
    let brandProductNotPrice = window.localStorage.brandProductNotPrice ? window.localStorage.brandProductNotPrice : 0
    let brandProjectNotPrice = window.localStorage.brandProjectNotPrice ? window.localStorage.brandProjectNotPrice : 0
    if (brandProductNotPrice !== '0' && brandProductNotPrice > 0 && route === '/boss-store/product') {
      this.setState({ showpupo: true })
    }
    if (brandProjectNotPrice !== '0' && brandProjectNotPrice > 0 && route === '/boss-store/project-store') {
      this.setState({ showpupo: true })
    }
    if (window.localStorage.showPopover && route === '/boss-store/product') {
      this.clickHide()
    }
    if (route === '/boss-store/project-store' && window.localStorage.showPopoverProject) {
      this.clickHide()
    }
  }
  /**
     * 关闭提示
     */
  clickHide = (e) => {
    const { route } = this.props
    this.setState({ showpupo: false })
    if (e === 1 && route === '/boss-store/product') {
      window.localStorage.showPopover = true
    }
    if (e === 1 && route === '/boss-store/project-store') {
      window.localStorage.showPopoverProject = true
    }
  }
  /**
  * 打开提示
  */
  clickShow = () => {
    const { route } = this.props
    this.setState({ showpupo: true })
    if (route === '/boss-store/product') {
      window.localStorage.removeItem('showPopover')
    } else if (route === '/boss-store/project-store') {
      window.localStorage.removeItem('showPopoverProject')
    }
  }
  render() {
    const { route } = this.props
    let brandProductNotPrice = window.localStorage.brandProductNotPrice ? window.localStorage.brandProductNotPrice : 0
    let brandProjectNotPrice = window.localStorage.brandProjectNotPrice ? window.localStorage.brandProjectNotPrice : 0
    return (
      <div className={styles.tipsHelpful}>
        <div className={styles.tipsBox}>
          <div onClick={this.clickShow}><Icon type="question-circle" /><span className={styles.span}>功能说明</span></div>
          {this.state.showpupo ?
            <div className={styles.pupo}>
              <div className={styles.triangleBorderUp}><em></em></div>
              <div className={styles.ti}><span className={`${styles.icon} iconfont icon-tishi`}></span>重要提醒</div>
              {route === '/boss-store/product' ? <div className={styles.co}>来源为品牌商的产品需要添加【销售价格】，未设置<span style={{ color: '#4AACF7FF', margin: '0 5px' }}>{brandProductNotPrice}</span>个</div> : ''}
              {route === '/boss-store/project-store' ? <div className={styles.co}>来源为品牌商的项目需要添加【销售价格】【成本】，未设置<span style={{ color: '#4AACF7FF', margin: '0 5px' }}>{brandProjectNotPrice}</span>个</div> : ''}
              <div className={styles.bt}><Button type="primary" style={{ marginRight: '24px' }} onClick={this.clickHide}>我知道了</Button><Button onClick={this.clickHide.bind(this, 1)}>不再提醒</Button></div>
            </div>
            : ''
          }
        </div>
        {/* <div className={styles.tipsBox}>
          <Icon type="info-circle" /><span className={styles.span}>帮助中心</span>
        </div> */}
      </div>
    )
  }
}

export default TipsHelp
