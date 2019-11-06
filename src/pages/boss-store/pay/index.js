import { Component } from 'react'
import CommonTable from '../../../components/CommonTable/index'
import { connect } from 'dva'
import Add from './add'

class storepay extends Component {
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
      this.setState({
        showAdd: true,
        type: 'add',
      })
    }
    if(e === 11) {
      dispatch({type:'storepay/edit',payload: v})
      this.setState({
        showAdd: true,
        type: 'edit',
      })
    }
  }
  render() {
    const { dispatch, editItem } = this.props
    return (
      this.state.showAdd ?
      <Add
      hideModal={this.hideModal.bind(this)}
      dispatch={dispatch}
      type={this.state.type}
      editItem={editItem}
      >
      </Add> :
      <CommonTable name="store/payment" onTableChange={this.onTableChange.bind(this)}></CommonTable>
    )
  }
}
function mapStateToProps(state) {
  const { editItem } = state.storepay
  return { editItem }
}
export default connect(mapStateToProps)(storepay)
