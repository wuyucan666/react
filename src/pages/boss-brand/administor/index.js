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
      dispatch({type:'brandAdministor/edit',payload: {}})
      this.setState({
        showAdd: true,
        type: 'add',
      })
    }
    if(e === 11) {
      dispatch({type:'brandAdministor/edit',payload: v})
      this.setState({
        showAdd: true,
        type: 'edit',
      })
    }
  }

  componentDidMount () {
    this.props.dispatch({type: 'brandAdministor/getRole',payload:{}})
  }

  render() {
    const { dispatch, editItem, roleList } = this.props
    return (
      <div>
        <div style={{ display: this.state.showAdd ? '' : 'none' }}>
          <Add
            hideAdd={this.hideAdd.bind(this)}
            dispatch={dispatch}
            type={this.state.type}
            editItem={editItem}
            roleList={roleList}
          >
          </Add>
        </div>
        <div style={{ display: this.state.showAdd ? 'none' : '' }}>
          <CommonTable name="brand/brandadmin" onTableChange={this.onTableChange.bind(this)}></CommonTable>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  const { editItem, roleList } = state.brandAdministor
  return { editItem, roleList }
}

export default connect(mapStateToProps)(administor)
