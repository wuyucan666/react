import * as React from 'react'
import {Spin} from "antd";

import service from 'services'
import Container from "../Container"
import VerticalBarChart from '../VerticalBarChart'


const style = require('../../style.less')

class RevenueTrend extends React.Component{
  state = {
    loading: false,
    data: [],
    tootTipText: '营业额'
  }

  componentDidMount(){
    this.getData(2, 'performance')
  }

  getData = (status, property) => {
    this.setState({loading: true})
    service.LIST({keys: {name: 'store/index/trend'}, data: {status}}).then(res => {
      this.setState({loading: false})
      if(res.success){
        this.setState({
          data: res.data.map(item => ({
            ...item,
            xName: item.date,
            yValue: item[property]
          }))
        })
      }
    }).catch(() => {
      this.setState({loading: false})
    })
  }

  onSearchChange = (query) => {
    const {type, status} = query
    let property = ''
    let tootTipText = ''
    switch (type) {
      case 1:
        property = 'performance'
        tootTipText = '营业额'
        break
      case 2:
        property = 'carCount'
        tootTipText = '到店台次'
        break
      case 3:
        property = 'totalOutput'
        tootTipText = '产值'
        break
      case 4:
        property = 'consume'
        tootTipText = '消耗'
        break
      default:
        console.log(type)
    }
    this.setState({tootTipText})
    this.getData(status, property)
  }
  render(){
    const {loading, data, tootTipText} = this.state
    return(
      <Spin spinning={loading}>
        <div className={style.container_item}>
          <Container
            title='营收趋势'
            bodyStyle={{paddingTop: 15}}
            onSearchChange={this.onSearchChange}
            searchConfig={
              [
                {
                  type: 'list',
                  prop: 'type',
                  list: [
                    {name: '营业额', value: 1},
                    {name: '到店台次', value: 2},
                    {name: '产值', value: 3},
                    {name: '消耗', value: 4},
                  ],
                  defaultValue: 1
                },
                {
                  type: 'list',
                  prop: 'status',
                  list: [
                    {name: '近30天', value: 2},
                    {name: '近12月', value: 3},
                  ],
                  defaultValue: 2
                }
              ]
            }
          >
            <div id="chart1">
              <VerticalBarChart
                data={data}
                color='#4AACF7'
                tootTipText={tootTipText}
              />
            </div>
          </Container>
        </div>
      </Spin>
    )
  }
}

export default RevenueTrend
