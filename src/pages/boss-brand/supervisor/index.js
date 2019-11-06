import { Component } from 'react'
import Add from './add.js'
import CommonTable from '../../../components/CommonTable/index'
import { connect } from 'dva'

class administor extends Component {

  state = {
    showAdd: false,
    type: '',
  }

  hideAdd () {
    this.setState({
      showAdd: false,
    })
  }

  onTableChange (e,v) {
    const { dispatch } = this.props
    if(e === 217) {
      dispatch({type:'brandSupervisor/edit',payload: {}})
      this.setState({
        showAdd: true,
        type: 'add',
      })
    }
    if(e === 11) {
      dispatch({type:'brandSupervisor/edit',payload: v})
      this.setState({
        showAdd: true,
        type: 'edit',
      })
    }
  }
  render() {
    const { dispatch, editItem, roleList, storeList } = this.props
    return (
      <div>
          {this.state.showAdd&&<Add
            hideAdd={this.hideAdd.bind(this)}
            dispatch={dispatch}
            type={this.state.type}
            editItem={editItem}
            roleList={roleList}
            storeList={storeList}
          >
          </Add>}
        <div style={{display:this.state.showAdd ?'none':''}}>
          <CommonTable name="brand/supervisor" onTableChange={this.onTableChange.bind(this)}></CommonTable>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  const { editItem, roleList, storeList } = state.brandSupervisor
  return { editItem, roleList, storeList }
}

export default connect(mapStateToProps)(administor)
