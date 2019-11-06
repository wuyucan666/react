import React,{Component} from 'react'
import { InputNumber, Button } from 'antd'
import service from 'services'
// const style = require('./style.less')
import style from './style.less'
import { message } from 'antd'

class CustomerIntegral extends Component {
  
  state = {
    list: [
      {name: '办充值卡', tip: '每消费1元，获得', ico: 'icon-chongzhiqia', value: 1, property: 'recharge'},
      {name: '办计次卡', tip: '每消费1元，获得', ico: 'icon-jiciqia', value: 1, property: 'metering'},
      {name: '项目', tip: '开单购买项目, 每消费1元，获得', ico: 'icon-xiangmu_liang', value: 1, property: 'project'},
      {name: '产品', tip: '开单购买产品, 每消费1元，获得', ico: 'icon-jiyou', value: 1, property: 'product'},
    ],
    isopend: true,
    isedit: false,
  }

  componentWillMount() {
    this.setDefault()
  }

  setDefault = () => {
    service.LIST({keys: {name: 'brand/customer/integral'}}).then(res => {
      this.setState({isopend: res.data.isopend})
      Object.keys(res.data).forEach(e => {
        let list = this.state.list.map(v => {
          if(v.property === e) {
            v.value = res.data[e]
          }
          return v
        })
        this.setState({list, isedit: false})
      })
    })
  }

  changeHandel = (value, index) => {
    let list = this.state.list
    list[index].value = value
    this.setState({list, isedit: true})
  }

  submit = () => {
    const { list } = this.state
    let obj = {}
    list.forEach(v => {
      obj[v.property] = v.value
    })
    obj.isopend = true
    service.INSERT({keys: {name: 'brand/customer/integral'}, data: obj}).then(res => {
      if(res.code === '0') {
        message.success("保存成功")
        this.setDefault()
      }
    })
  }

  render () {
    return (
      <div style={{padding: '32px'}}>
        <div className={style.content}>
          {
            this.state.list.map((v,i) => {
              return <div key={i} className={style.item}>
                <div className={style.top}><i className={`iconfont ${v.ico}`}></i><span>{v.name}</span></div>
                <div className={style.bot}>{v.tip}<InputNumber value={v.value} min={1} max={1000} onChange={(e) => this.changeHandel(e, i)} size="large" style={{margin: '0 8px'}}></InputNumber>积分</div>
              </div>
            })
          }
        </div>
        <div className={style.bottom}>
          <Button type="primary" onClick={this.submit}>{!this.state.isopend ? '开启顾客积分' : '保存' }</Button>
          {
            !this.state.isopend ? 
            <span className="animated fadeIn">注：开启后，按照此规则计算顾客积分。</span>
            :
            this.state.isedit &&
            <span className="animated fadeIn">注：您已修改积分规则，保存后将立即生效，请确保顾客知悉本次规则变更。</span>
          }
        </div>
      </div>
    )
  }
}

export default CustomerIntegral