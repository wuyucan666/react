/**
 * Created by kikazheng on 2019/4/24
 */
import React,{Component} from 'react'
import { connect } from 'dva'
import {} from 'antd'

import CommonTable from "../../../components/CommonTable/index"
import Add from './components/Add'
import service from '../../../services'

class Index extends Component{
  state = {
    editItem: {},
    showAdd: false,
  }
  onTableChange = (key ,data) => {
    if(key === 217){
      this.setState({
        showAdd: true,
        editItem: {},
      })
    }else if(key === 11){
      service.LIST({keys: {name: 'admin/manage/role'}, data: {id: data.id}}).then(res => {
        if(res.success){
          this.setState({
            showAdd: true,
            editItem: {...res.data},
          })
        }
      })
    }
  }
  onOk = () => {
    this.props.dispatch({
      type: "table/getData",
      payload:"admin/manage/role",
    })
    this.setState({showAdd: false})
  }
  onCancel = () => {
    this.setState({showAdd: false})
  }
  render(){
    const {editItem, showAdd} = this.state
    return(
      <div>
        <div style={{ display: showAdd ? '' : 'none' }}>
          <Add
            editItem={editItem}
            onOk={this.onOk}
            onCancel={this.onCancel}
          />
        </div>
        <div style={{ display: showAdd ? 'none' : '' }}>
          <CommonTable name="admin/manage/role" onTableChange={this.onTableChange} />
        </div>
      </div>
    )
  }
}

export default connect()(Index)
