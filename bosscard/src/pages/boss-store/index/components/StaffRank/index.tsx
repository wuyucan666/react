import * as React from 'react'
import * as moment from 'moment'
import {Spin, Table} from 'antd'
import router from 'umi/router'

import Container from '../Container'
import HorizontalBarChart from '../HorizontalBarChart'
import service from 'services'

const style = require('../../style.less')

const {Column} = Table


class StaffRank extends React.Component{
  state = {
    loading: false,
    staffPerformance: [],
    height: 500,
    date: [moment().startOf('month').unix(), moment().endOf('month').unix()]
  }

  componentDidMount(){
    const where = {
      'completed[<>]': [moment().startOf('month').unix(), moment().endOf('month').unix()]
    }
    this.getData(where)
    this.getSize()
    window.addEventListener('resize', this.getSize)
  }

  componentWillUnmount(){
    window.removeEventListener('resize', this.getSize)
  }

  getSize = () => {
    const height = document.getElementById('staff-table').clientHeight + 20
    this.setState({height})
  }


  //排行数据
  getData = (where) => {
    this.setState({loading: true})
    service.LIST({keys: {name: `wide-ranking/details?driver=staffPerformance`}, data: {q: {where}}}).then(res => {
      this.setState({loading: false})
      if(res.success){
        this.setState({
          staffPerformance: res.list.map(item => ({
            ...item,
            value: Number(item.total)
          }))
        },() => {
         this.getSize()
        })
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
    this.getData(where)
    this.setState({
      date:where['completed[<>]']
    })
  }

  goDetail = (staffId) => {
    // console.log(this.state.date,'-----')
    const { date } = this.state
    router.push({
      pathname: '/boss-store/performance-report',
      query: {staffId,date},
    });
  }
  render(){
    const {staffPerformance, loading, height} = this.state
    return(
      <Spin spinning={loading}>
        <div className={style.container_item}>
          <Container
            title='员工排名'
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
            <div className="flex">
              <div className="item" style={{width: '50%',height}}>
                <HorizontalBarChart
                  data={staffPerformance}
                />
              </div>
              <div className="item" style={{paddingLeft: 45}}>
                <div id='staff-table'>
                  <Table dataSource={staffPerformance} pagination={false} rowKey='id' >
                    <Column
                      title="排名"
                      dataIndex="index"
                      key="index"
                      width='8%'
                      render={(text,record,index) => ++index}
                    />
                    <Column
                      title="员工"
                      dataIndex="name"
                      key="name"
                      width='14%'
                    />
                     <Column
                      title="销售业绩"
                      dataIndex="sales"
                      key="sales"
                      width='15%'
                    />
                     <Column
                      title="施工业绩"
                      dataIndex="builder"
                      key="builder"
                      width='15%'
                    />
                    <Column
                      title="总业绩"
                      dataIndex="total"
                      key="total"
                      width='15%'
                    />
                    <Column
                      title="全店业绩占比"
                      dataIndex="proportion"
                      key="proportion"
                      width='17%'
                      render={text => Number(text) ? `${text}%` : 0}
                    />
                    <Column
                      title=" "
                      dataIndex="action"
                      key="action"
                      width='16%'
                      // @ts-ignore
                      render={(text, record) => <span style={{color: '#4AACF7', cursor: 'pointer'}} onClick={() => this.goDetail(record.id)}>详细 <i className='iconfont icon-quchakan' style={{marginLeft: '5px'}}/> </span>}/>
                  </Table>
                </div>
              </div>
            </div>
          </Container>
        </div>
      </Spin>
    )
  }
}

export default StaffRank
