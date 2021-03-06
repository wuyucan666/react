import { Component } from 'react'
import CommonTable from '../../../components/CommonTable/index'
import { connect } from 'dva'
import Add from './add'

class channel extends Component {
  state = {
    showAdd: false,
    type: '',
  }
  hideModal () {
    this.setState({
      showAdd: false,
    })
  }
  onTableChange (e,v) {
    const { dispatch } = this.props
    if(e === 217) {
      dispatch({type:'channel/edit',payload: {}})
      this.setState({
        showAdd: true,
        type: 'add',
      })
    }
    if(e === 11) {
      dispatch({type:'channel/edit',payload: v})
      this.setState({
        showAdd: true,
        type: 'edit',
      })
    }
  }
  render() {
    const { dispatch, editItem } = this.props
    return (
      <div>
         {this.state.showAdd&& <Add
            hideModal={this.hideModal.bind(this)}
            dispatch={dispatch}
            type={this.state.type}
            editItem={editItem}
          >
          </Add>}
        <div style={{display:this.state.showAdd ?'none':''}}>
          <CommonTable name="brand/channel" onTableChange={this.onTableChange.bind(this)}></CommonTable>
        </div>
      </div>
    )
  }
}
function mapStateToProps(state) {
  const { editItem } = state.channel
  return { editItem }
}
export default connect(mapStateToProps)(channel)
