/**
 * Created by kikazheng on 2019/6/28
 */
import React, {Component} from 'react'
import {Popover, Spin} from 'antd'

import service from 'services'

import style from './style.less'

class Tip extends Component{

  state = {
    loading: false,
    list: [], //卡内
    give: [], //赠送
  }

  onMouseEnter = () => {
    /**type 1为充值卡 2为计次卡 */
    const { name, query, type } = this.props 
    this.setState({loading: true})
    service.INSERT({keys: {name: name}, data: {...query}}).then(res => {
      this.setState({loading: false})
      if(res.success){
        if(type === 1) {
          const { product, project, specialProduct, specialProject, giveInfo } = res.list
          const list = [...product, ...project, ...specialProduct, ...specialProject]
          const give = giveInfo
          this.setState({
            list,
            give,
          })
        }else {
          const { recordsInfo } = res.list
          const list = recordsInfo.map(v => {
            return {
              ...v,
              name: v.goodName,
            }
          })
          console.log('list',list)
          this.setState({list})
        }  
      }
    }).catch(() => {
      this.setState({loading: false})
    })
  }

  render(){
    const { children, type } = this.props
    const { loading, list, give } = this.state

    const content = (
      <div>
        {
          list.length > 0 &&
          <div className={style.listItem}>
            <div className={style.listTitle}>{type === 1 ? '卡折扣优惠' : '套餐内容'}</div>
            <div className={style.listContent}>
              {
                list.map(v => {
                  return (
                    <div>
                      <span>{v.name}</span>
                      {
                        type === 1 ?
                        <span>{v.discountType === 2 && '会员价'}{v.discount}{v.discountType === 1 ? '折' : '元'}</span>
                        :
                        <span>{v.goodNum === -1 ? '无限' : v.goodNum}次</span>
                      }
                    </div>
                  )
                })
              }
            </div>
          </div>
        }
        {
          type === 1 && give.length > 0 &&
          <div className={style.listItem}>
            <div className={style.listTitle}>赠送</div>
            <div className={style.listContent}>
              {
                give.map(v => {
                  return (
                    <div>
                      <span>{v.name}</span>
                      <span>{v.numTem === -1 ? '无限': v.numTem}次</span>
                    </div>
                  )
                })
              }
            </div>
          </div>
        }
        {
          (!list.length && !give.length) &&
          <div style={{color: '#999999'}}><i className="iconfont icon-zhuyi" style={{marginRight: 6}}></i>此卡不包含折扣优惠和赠送信息</div>
        }
      </div>
    )

    return(
      <Popover
        placement="rightTop"
        content={loading ? <Spin/> :content}
        trigger="hover"
        onMouseEnter={this.onMouseEnter}
      >
        <span className={style.content}>{children}</span>
      </Popover>
    )
  }
}

export default Tip
