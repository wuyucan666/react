import React, { Component } from 'react'
import { message } from "antd"
import tableConfig from "./tableConfig"
import CommonTable from "../../../components/CommonTable/index" 
import services from "../../../services"
import { connect } from 'dva'
import Add from "./add"
import Gdel from "./del"

class Index extends Component {
  constructor(props){
    super(props)
    this.state={
      visible: false,
      dVisible: false,
      editItem: {},
      type: 'add',
    }
  }
  onTableChange=(e, v)=> {
    if(e === 217) {
      this.setState({visible: true, type: 'add', editItem: {}})
    } else if(e === 45 || e === 49) {
      this.onClone(e, v.id)
    } else if(e === 11) {
      this.setState({editItem: v, visible: true, type: 'edit'})
    } else if (e === 39) {
      this.setState({editItem: v, dVisible: true})
    }
  }
  // 关闭状态
  onClone=(e, id)=> {
    services.UPDATE({
      data: {status: e === 45 ? 0 : 1},
      keys: { name: "store/servicesSmsTemplate", id },
    }).then(res => {
      if(res.code === '0') {
        message.success('提交成功！')
        this.props.dispatch({
          type: "table/getData",
          payload: {new: 'store/servicesSmsTemplate'},
        })
      }
    })
  }
  // 删除
  onDel=()=> {
    const {dispatch} = this.props
    const {editItem} = this.state
    services.DELETE({
      keys: { name: "store/servicesSmsTemplate", id: editItem.id },
    }).then(res => {
      if(res.code === '0') {
        message.success('删除成功！')
        dispatch({
          type: "table/getData",
          payload: {new: 'store/servicesSmsTemplate'},
        })
      }
    })
  }
  hideAdd=()=> {
    this.setState({visible: false})
  }
  dhideAdd=(e)=> {
    this.setState({dVisible: false})
    if(e) {this.onDel()}
  }
  render() {
    const {visible, dVisible, editItem, type}=this.state
    const {dispatch} = this.props
    return (
      <div>
        {visible? <Add
          onCancel={this.hideAdd}
          visible={visible}
          editItem={editItem}
          type={type}
          dispatch={dispatch}
        /> : ''}
        <Gdel
        onCancel={this.dhideAdd}
        visible={dVisible}
        ></Gdel>
        <CommonTable
          name="store/servicesSmsTemplate"
          onTableChange={this.onTableChange.bind(this)}
          tableConfig={tableConfig}
          New
          ></CommonTable>
      </div>
    )
  }
}
export default connect()(Index)