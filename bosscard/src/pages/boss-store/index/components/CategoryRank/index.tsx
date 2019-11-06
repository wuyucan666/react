import * as React from 'react'
import {Spin, Table} from "antd"
import * as moment from 'moment'

import service from 'services'
import Container from "../Container";
import ShapePieChart from '../ShapePieChart'


const {Column} = Table

const types = {
  maintainType: '业务类型',
  projectCategory: '项目分类',
  productCategory: '产品分类',
}

class Receipts extends React.Component{
  state = {
    loading: false,
    data: [],
    driver: 'maintainType',
    width: 200,
  }

  componentDidMount(){
    const where = {
      'completed[<>]': [moment().startOf('month').unix(), moment().endOf('month').unix()]
    }
    this.getData('maintainType', where)
    window.addEventListener('resize', this.getSize)
  }

  componentWillUnmount(){
    window.removeEventListener('resize', this.getSize)
  }

  getSize = () => {
    const width = document.getElementById('chart4').clientWidth * 0.5
    this.setState({width})
  }

  getData = (driver, where) => {
    this.setState({loading: true})
    service.LIST({keys: {name: `wide-ranking/details?driver=${driver}`}, data: {q: {where}}}).then(res => {
      this.setState({loading: false})
      if(res.success){
        this.setState({
          data: res.list.map(item => ({
            ...item,
            value: Number(item.total)
          })),
          driver
        }, this.getSize)
      }
    }).catch(() => {
      this.setState({loading: false})
    })
  }

  onSearchChange = (query) => {
    const {driver, completed} = query
    let where = {}
    if(completed === 1){ // 本月
      where = {
        'completed[<>]': [moment().startOf('month').unix(), moment().endOf('month').unix()]
      }
    }else {// 本年
      where = {
        'completed[<>]': [moment().startOf('year').unix(), moment().endOf('year').unix()]
      }
    }
    this.getData(driver, where)
  }
  render(){
    const {loading, data, driver, width} = this.state
    return(
      <Spin spinning={loading}>
        <Container
          title='分类排名'
          bodyStyle={{padding: 0}}
          onSearchChange={this.onSearchChange}
          searchConfig={
            [
              {
                type: 'list',
                prop: 'driver',
                list: [
                  {name: '业务类型', value: 'maintainType'},
                  {name: '项目分类', value: 'projectCategory'},
                  {name: '产品分类', value: 'productCategory'},
                ],
                defaultValue: 'maintainType'
              },
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
          <div className='flex' id='chart4'>
            <ShapePieChart
              data={data}
              canvasWidth={width}
              outerRadius={width*0.25}
              innerRadius={width*0.19}
              colors={['#1890ff','#f04864','#2fc25b','#facc14','#e6965c','#13c2c2','#8543e0','#092fbb','#bb5d09','#aa0e6a']}
            />
            <div className='item'>
              <Table
                dataSource={data}
                pagination={false}
                rowKey='id'
                scroll={{y:274}}
                style={{width: '100%',margin: '30px 0'}}
              >
                <Column
                  title="排名"
                  dataIndex="index"
                  key="index"
                  width='15%'
                  render={(text, record, index) => ++index}
                />
                <Column
                  title={types[driver]}
                  dataIndex="name"
                  key="name"
                  width='35%'
                />
                <Column
                  title="营业额"
                  dataIndex="value"
                  key="value"
                  width='25%'
                />
                <Column
                  title="全店占比"
                  dataIndex="proportion"
                  key="proportion"
                  width='25%'
                  render={text => Number(text) ? `${text}%` : 0}
                />
              </Table>
            </div>
          </div>
        </Container>
      </Spin>
    )
  }
}

export default Receipts
