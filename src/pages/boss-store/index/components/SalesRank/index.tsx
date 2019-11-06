import * as React from 'react'
import router from "umi/router"
import * as moment from 'moment'
import {Spin} from 'antd'

import Container from '../Container'
import service from 'services'
import Rank from "../prosRank"


const style = require('../../style.less')

class SalesRank extends React.Component{
  state = {
    loading: false,
    cardSalesVolume: [], // 会员卡
    project: [],
    product: [],
  }

  componentDidMount(){
    const where = {
      'completed[<>]': [moment().startOf('month').unix(), moment().endOf('month').unix()]
    }
    this.getData(where, 'cardSalesVolume')
    this.getData(where, 'project')
    this.getData(where, 'product')
  }

  rankClick = (type) => {
    switch (type) {
      case 0:
        router.push('/boss-store/card-statistics')
        break
      case 1:
        router.push('/boss-store/project-product-analysis?tab=project')
        break
      case 2:
        router.push('/boss-store/project-product-analysis?tab=product')
        break
      default:
        console.log(type)
    }
  }

  //排行数据
  getData = (where, driver) => {
    this.setState({loading: true})
    service.LIST({keys: {name: `wide-ranking/details?driver=${driver}`}, data: {q: {where, order: {orderCount: 2}}}}).then(res => {
      this.setState({loading: false})
      if(res.success){
        this.setState({[driver]: res.list})
      }
    }).catch(() => {
      this.setState({loading: false})
    })
  }

  onSearchChange = (query) => {
    console.log(query)
    let where = {}
    if(query.completed === 1){ // 本月
      where = {
        'completed[<>]': [moment().startOf('month').unix(), moment().endOf('month').unix()]
      }
    }else {// 本年
      where = {
        'completed[<>]': [moment().startOf('year').unix(), moment().endOf('year').unix()]
      }
    }
    this.getData(where, 'cardSalesVolume')
    this.getData(where, 'project')
    this.getData(where, 'product')
  }
  render(){
    const {cardSalesVolume, product, project, loading} = this.state
    return(
      <Spin spinning={loading}>
        <div className={style.container_item}>
          <Container
            title='销量排名'
            onSearchChange={this.onSearchChange}
            searchConfig={
              [
                {
                  type: 'list',
                  prop: 'completed',
                  list: [
                    {name: '本月', value: 1},
                    {name: '本年', value: 2},
                  ],
                  defaultValue: 1
                }
              ]
            }
          >
            <div className={style.zl_rankBox} >
              <div className={style.zl_rankBox_son} >
                <Rank  type={0} callBack={this.rankClick}  data={cardSalesVolume}   />
              </div>
              <div className={style.zl_rankBox_son} >
                <Rank  type={1} callBack={this.rankClick} data={project} />
              </div>
              <div className={style.zl_rankBox_son }>
                <Rank  type={2} callBack={this.rankClick}  data={product} />
              </div>
            </div>
          </Container>
        </div>
      </Spin>
    )
  }
}

export default SalesRank
