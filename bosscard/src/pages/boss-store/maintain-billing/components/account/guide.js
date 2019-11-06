/**
 * Created by kikazheng on 2018/12/5
 */
import React,{Component} from 'react'
import styles from "./style.less"
import xiaofei from '../images/xiaofei.png'
import cishu from '../images/cishu.png'
import moment from 'moment'
import Order from '../recently-order'
import router from 'umi/router'

class Guide extends Component{
  goList = () => {
    // 之前版本跳已完成
    router.push(`/boss-store/maintain-list/orderAll?clientId=${this.props.clientId}`)
  }
  render(){
    const { consume, record } = this.props
    return(
      <div>
        <div className={styles.guide}>
          <div>消费数据:</div>
          <div className={styles.data}>
            <div className={styles.item}>
              <img src={xiaofei} alt=""/>
              <div>
                <div>累计消费金额</div>
                <div>￥{consume.total}</div>
                <div>平均每次消费￥{consume.average}，未销账：<span>￥{consume.arrears}</span></div>
              </div>
            </div>
            <div className={styles.item}>
              <img src={cishu} alt=""/>
              <div>
                <div>累计进店次数</div>
                <div>{consume.shopTimes}</div>
                {
                  !!consume.latter &&
                  <div>最近一次{moment(consume.latter * 1000).format('YYYY-MM-DD')}，距今天<span>{moment(consume.latter * 1000).fromNow()}</span></div>
                }
              </div>
            </div>
          </div>
        </div>
        <div className={styles.guide}>
          <div className='flex between'>
            <span>消费记录:</span>
            {!!record.length &&  <a onClick={this.goList}>查看全部</a>}
          </div>
          <Order
            data={record}
            showBtn={false}
          />
        </div>
      </div>
    )
  }
}

export default Guide
