/**
 * Created by kikazheng on 2019/4/24
 */
import React,{Component} from 'react'

import CommonTable from "../../../components/CommonTable/index"
import Add from './components/Add'
import tableConfig from './tableConfig'

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
      service.LIST({keys: {name: 'store/manage/role'}, data: {id: data.id}}).then(res => {
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
    this.setState({showAdd: false})
  }
  onCancel = () => {
    this.setState({showAdd: false})
  }
  render(){
    const {editItem, showAdd} = this.state
    console.log('时间', new Date())
    return(
      <div>
        {
          showAdd&&(
            <Add
              editItem={editItem}
              onOk={this.onOk}
              onCancel={this.onCancel}
            />
          )
        }
        <div  className={style.container} style={{display:showAdd?'none':''}}>
          <CommonTable  name="store/manage/role" tableConfig={tableConfig} onTableChange={this.onTableChange}/>
        </div>
      </div>
    )
  }
}

export default Index
