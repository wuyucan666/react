/**
 * Created by ainier on 2018/11/24
 */
import React,{Component} from 'react'
import { connect } from 'dva'

import CommonTable from 'components/CommonTable/index'
import tableConfig from './tableConfig'
import services from '../../../services'

class Purchase extends Component{

  state = {
    searchData: {},
    warehouseList: [],
    tableConfig,
    show: false,
  }

  componentDidMount () {
    services.list({keys: {name: 'store/warehouse'}}).then(res => {
      if(res.success) {
        tableConfig.screen.rules[2].list = res.list.map(v => {
          return {
            name: v.warehouseName,
            value: v.warehouseId,
          }
        })
        tableConfig.screen.rules[2].list.push({name: '全部', value: -1})
      }
    })
    if(this.props.location.query.productName){
      const productName = this.props.location.query.productName
      tableConfig.screen.rules[0].defaultValue = productName
      tableConfig.screen.rules[1].defaultValue = 17 // 选中外采类型
      this.setState({ tableConfig }, () => this.setState({ show: true }))
    } else {
      this.setState({ show: true })
    }
  }

  componentWillUnmount = () => {
    tableConfig.screen.rules[0].defaultValue = undefined
    tableConfig.screen.rules[1].defaultValue = undefined
  }

  onTableChange = () => {

  }

  onReSet = () => {
    tableConfig.screen.rules[0].defaultValue = undefined
    tableConfig.screen.rules[1].defaultValue = undefined
  }

  render() {
    return (
      <div>
        {this.state.show &&
        <CommonTable name='erp/stock/inventory/storage'
        onTableChange={this.onTableChange} tableConfig={this.state.tableConfig} New onReSet={this.onReSet}>
        </CommonTable>}
      </div>
    )
  }
}

export default connect()(Purchase)
