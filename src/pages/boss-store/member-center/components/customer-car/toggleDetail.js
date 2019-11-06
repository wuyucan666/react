/**
 * Created by kikazheng on 2018/11/17
 */
import React,{Component} from 'react'
import styles from './style.less'

class toggleDetail extends Component{
  state = {
    open: false,
  }
  changeOpen = () => {
    this.setState({
      open:!this.state.open,
    })
  }
  render(){
    const {open} = this.state
    const {children} = this.props
    return(
      <div>
        {
          open &&
          children
        }
        {
          !this.state.open ?
            <div className={styles.open} onClick={this.changeOpen}>展开详细资料<i className="iconfont icon-zhankai"/></div>
            : <div className={styles.open} onClick={this.changeOpen}>收起详细资料<i className="iconfont icon-shouqi"/></div>
        }
      </div>
    )
  }
}

export default toggleDetail
