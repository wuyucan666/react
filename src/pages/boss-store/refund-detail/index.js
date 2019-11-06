/**
 * Created by zhengkika on 2018/11/24
 */
import React,{Component} from 'react'
import CommonTable from 'components/CommonTable/index'
import services from 'services'
import { connect } from "dva"
import tableConfig from './tableConfig'

class Refund extends Component{
  state = {
  }
  componentDidMount(){
    services.LIST({keys:{name:'erp/supplier/selector'}}).then(res => {
      tableConfig.screen.rules[1].list = res.list.map(item => ({name:item.name,value:item.id}))
    })
  }
  render(){
    return (
      <CommonTable name='erp/rejectinfo' search='no,name' tableConfig={tableConfig} onTableChange={this.onTableChange} New>
      </CommonTable>
    )
  }
}

export default connect()(Refund)
