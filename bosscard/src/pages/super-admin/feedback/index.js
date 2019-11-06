/**
 * Created by kikazheng on 2019/4/24
 */
import React,{Component} from 'react'
import { connect } from "dva"
import CommonTable from "../../../components/CommonTable/index"
import Dispose from './components/dispose'
import Delete from './components/delete'
import tableConfig from "./tableConfig"
import Details from './components/details'
// import service from '../../../services'

class Index extends Component{
  state = {
    delVisible: false,
    detailVisible: false,
    disposeVisible: false,
    remark: false,
    item: {},
  }
  onTableChange = (key ,data) => {
    this.setState({item: data})
    if(key === 1){
      this.setState({
        delVisible: true,
      })
    } else if(key === 14){
      this.setState({
        detailVisible: true,
      })
    } else if(key === 78){
      this.setState({
        disposeVisible: true,
        remark: false,
      })
    } else if(key === 89){
      this.setState({
        disposeVisible: true,
        remark: true,
      })
    }
  }
  // 刷新数据
  refresh=()=> {
    const {dispatch} = this.props
    dispatch({
      type: 'table/getData',
      payload: {new: "message/opinion/feedback"},
    })
  }
  onDetailClone=(e)=> {
    this.setState({detailVisible: false})
    if(e) {
      this.refresh()
    }
  }
  onDelClone=(e)=> {
    this.setState({delVisible: false})
    if(e) {
      this.refresh()
    }
  }
  onDisposeClone=(e)=> {
    this.setState({disposeVisible: false})
    if(e) {
      this.refresh()
    }
  }
  render(){
    const {delVisible, detailVisible, disposeVisible, item, remark} = this.state
    return(
      <div>
        <Dispose item={item} visible={disposeVisible} remark={remark} onClone={this.onDisposeClone}></Dispose>
        <Delete item={item} visible={delVisible} onClone={this.onDelClone}></Delete>
        <Details item={item} visible={detailVisible} onClone={this.onDetailClone}></Details>
        <CommonTable name="message/opinion/feedback" New onTableChange={this.onTableChange} tableConfig={tableConfig} />
      </div>
    )
  }
}

export default connect()(Index)
