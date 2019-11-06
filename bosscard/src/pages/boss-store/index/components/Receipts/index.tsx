import * as React from 'react'
import {Spin, Table} from "antd"
import * as moment from 'moment'

import service from 'services'
import Container from "../Container";
import ShapePieChart from '../ShapePieChart'


const { Column } = Table;

class Receipts extends React.Component{
  state = {
    loading: false,
    data: [],
    width: 200,
  }

  componentDidMount(){
    const where = {
      'completed[<>]': [moment().startOf('month').unix(), moment().endOf('month').unix()]
    }
    this.getData(where)
    window.addEventListener('resize', this.getSize)
  }

  componentWillUnmount(){
    window.removeEventListener('resize', this.getSize)
  }

  getSize = () => {
    const width = document.getElementById('chart3').clientWidth * 0.5
    this.setState({width})
  }

  getData = (where) => {
    this.setState({loading: true})
    service.LIST({keys: {name: 'wide-business/marketing/collect'}, data: {q: {where}}}).then(res => {
      this.setState({loading: false})
      if(res.success){
        this.setState({
          data: res.data.project.map((item, index) => ({
            name: item.project,
            value: Number(item.receipts),
            id: index,
            receipts: item.receipts,
            beReceipts: item.beReceipts,
          }))
        },this.getSize)
      }
    }).catch(() => {
      this.setState({loading: false})
    })
  }

  onSearchChange = (query) => {
    let where = {}
    if(query.type === 1){ // 本月
      where = {
        'completed[<>]': [moment().startOf('month').unix(), moment().endOf('month').unix()]
      }
    }else {// 本年
      where = {
        'completed[<>]': [moment().startOf('year').unix(), moment().endOf('year').unix()]
      }
    }
    this.getData(where)
  }
  render(){
    const {loading, data, width} = this.state
    return(
      <Spin spinning={loading}>
        <Container
          title='实收分类'
          bodyStyle={{padding: 0}}
          onSearchChange={this.onSearchChange}
          searchConfig={
            [
              {
                type: 'list',
                prop: 'type',
                list: [
                  {name: '本月', value: 1},
                  {name: '本年', value: 2},
                ],
                defaultValue: 1
              }
            ]
          }
        >
          <div className='flex' id='chart3'>
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
                  title="分类"
                  dataIndex="name"
                  key="name"
                  width='40%'
                />
                <Column
                  title="营业额"
                  dataIndex="receipts"
                  key="receipts"
                  width='30%'
                />
                <Column
                  title="金额占比"
                  dataIndex="beReceipts"
                  key="beReceipts"
                  width='30%'
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
