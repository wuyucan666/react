/**
 * Created by kikazheng on 2019/4/24
 */
import React,{Component} from 'react'
import { connect } from "dva"
import CommonTable from "../../../components/CommonTable/index"
import Add from './components/Add'

import service from '../../../services'
import style from './index.less'

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
      service.LIST({keys: {name: 'brand/manage/role'}, data: {id: data.id}}).then(res => {
        if(res.success){
          this.setState({
            editItem: {...res.data},
          },() => {
            this.setState({
              showAdd: true,
            })
          })
        }
      })
    }
  }
  onOk = () => {
    this.props.dispatch({
      type:'table/getData',
      payload:{new:false},
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
        {
          showAdd&&(
            <Add
              editItem={editItem}
              onOk={this.onOk.bind(this)}
              onCancel={this.onCancel.bind(this)}
            />
          )
        }
        <div  className={style.container} style={{display:showAdd?'none':''}}>
          <CommonTable  name="brand/manage/role"   onTableChange={this.onTableChange}/>
        </div>
      </div>
    )
  }
}

export default connect()(Index)
