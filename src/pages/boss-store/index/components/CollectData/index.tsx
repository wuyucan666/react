import * as React from 'react'
import {Spin, message} from 'antd'

import service from 'services'
import Container from '../Container'
import router from 'umi/router'

const style = require('../../style.less')

interface performance {
  [propertyName: string]: any
}

interface consume {
  [propertyName: string]: any
}

interface totalOutput {
  [propertyName: string]: any
}

interface shopNum {
  [propertyName: string]: any
}

interface toStoreNum {
  [propertyName: string]: number
}

interface Props {
  showDaily: Function
}

const initPerformance: performance = {}
const initConsume: consume = {}
const initTotalOutput: totalOutput = {}
const initShopNum: shopNum = {}
const initToStoreNum: toStoreNum = {}

class CollectData extends React.Component<Props>{
  state = {
    loading: true,
    consume: initConsume, // 消耗
    performance: initPerformance, // 营业额
    toStoreNum: initToStoreNum, // 到店台次
    totalOutput: initTotalOutput, // 产值
    shopNum: initShopNum, // 单车产值
  }

  componentDidMount(){
    service.LIST({keys: {name: 'store/index/collect'}}).then(res => {
      this.setState({loading: false})
      if(res.success){
        this.setState({...res.data})
      }
    }).catch(() => {
      this.setState({loading: false})
    })
  }

  goto = () => {
    const permissionRole = localStorage.getItem('permissionRole')
    if(permissionRole.indexOf('5e4d5fde') === -1) {
      message.warn('无查看权限, 请联系管理员')
      return
    }
    this.props.showDaily()
  }

  render(){
    const {consume, performance, shopNum, toStoreNum, totalOutput, loading} = this.state
    return(
      <Spin spinning={loading}>
        <div className={style.container_item}>
          <Container
            title='营业额'
            tip='门店实际的收入情况，即实收金额，即业绩'
            link='/boss-store/performance-report'
            linkText='业绩明细'
            bodyStyle={{paddingBottom: 18}}
          >
            <div className='flex'>
              <div className='item'>
                <div className={style.title}>今日营业额（元）</div>
                <div className={style.money}>
                  <div className={style.money_left}>{performance.day}</div>
                  <div className={style.taday_report}>
                    <div className={style.taday_report_flex} onClick={this.goto}><span className='iconfont icon-dingdan'></span><span>营收简报</span></div>
                  </div>
                </div>
              </div>
              <div className='item'>
                <div className={style.title}>本月营业额（元）</div>
                <div className={style.money}>{performance.month}</div>
              </div>
              <div className='item'>
                <div className={style.title}>上月营业额（元）</div>
                <div className={style.money}>{performance.last_month}</div>
              </div>
              <div className='item'>
                <div className={style.title}>今年营业额（元）</div>
                <div className={style.money}>{performance.year}</div>
              </div>
            </div>
          </Container>
        </div>
        <div className={`${style.container_item} flex`}>
          <div className={style.fix_box}>
            <Container
              title='到店台次'
              tip='到店车辆数，同一天多次到店按同一辆计算'
              bodyStyle={{paddingBottom: 22}}
            >
              <div className="flex between">
                <div>
                  <div className={style.title}>今日</div>
                  <div className={style.num}>{toStoreNum.day}</div>
                </div>
                <div className="item" style={{textAlign: 'right'}}>
                  <div className={style.title}>新车：</div>
                  <div className={style.title} style={{margin: '5px 0'}}>本月：</div>
                  <div className={style.title}>今年：</div>
                </div>
                <div style={{textAlign: 'right'}}>
                  <div>{toStoreNum.day_new_car}</div>
                  <div  style={{margin: '5px 0'}}>{toStoreNum.month}</div>
                  <div>{toStoreNum.year}</div>
                </div>
              </div>
            </Container>
          </div>
          <div  className={style.fix_box}>
            <Container
              title='产值'
              tip={(
                <div>
                  <p>衡量门店工作产出的价值之一。</p>
                  <p>按照【开单】项目或产品的原价汇总，含卡内和非卡内。办卡和赠送不计。</p>
                </div>
              )}
              bodyStyle={{paddingBottom: 22}}
            >
              <div className="flex center between">
                <div className={style.title}>今日</div>
                <div><span className={style.title}>本月：</span>{totalOutput.month}</div>
              </div>
              <div className="flex center between" style={{marginTop: 10}}>
                <div className={style.num}>{totalOutput.day}</div>
                <div><span className={style.title}>今年：</span>{totalOutput.year}</div>
              </div>
            </Container>
          </div>
          <div  className={style.fix_box}>
            <Container
              title='单车产值'
              tip='单台车贡献的产值。统计周期内，总产值/到店台次。'
              bodyStyle={{paddingBottom: 22}}
            >
              <div className="flex center between">
                <div className={style.title}>今日</div>
                <div><span className={style.title}>本月：</span>{shopNum.month}</div>
              </div>
              <div className="flex center between"  style={{marginTop: 10}}>
                <div className={style.num}>{shopNum.day}</div>
                <div><span className={style.title}>今年：</span>{shopNum.year}</div>
              </div>
            </Container>
          </div>
          <div  className={style.fix_box}>
            <Container
              title='消耗'
              tip={(
                <div>
                  <p>衡量门店工作产出的价值之一。</p>
                  <p>按照【开单】项目或产品的实际价值汇总，例如折扣或赠送，以折扣后金额或0计算。</p>
                </div>
              )}
              bodyStyle={{paddingBottom: 22}}
            >
              <div className="flex center between">
                <div className={style.title}>今日</div>
                <div><span className={style.title}>本月：</span>{consume.month}</div>
              </div>
              <div className="flex center between"  style={{marginTop: 10}}>
                <div className={style.num}>{consume.day}</div>
                <div><span className={style.title}>今年：</span>{consume.year}</div>
              </div>
            </Container>
          </div>
        </div>
      </Spin>
    )
  }
}

export default CollectData
