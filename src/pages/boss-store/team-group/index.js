import { Component } from 'react'
import CommonTable from '../../../components/CommonTable/index'
import { connect } from 'dva'
import Tkbox from './Tkbox.js'

const tableConfig = {
  screen: {},
}

class teamGroup extends Component {
  state = {
    visible: false,
    type: '',
  }

  showModal = () => {
    this.setState({
        visible: true,
    })
  }

  hideModal = () => {
    this.setState({
      visible: false,
    })
  }

  onTableChange = (e, v) => {
    const { dispatch } = this.props
    if(e === 217){
      dispatch({type:'teamGroup/edit',payload: {}})
      this.showModal()
      this.setState({
        type: 'add',
      })
    }
    if(e === 11){
      dispatch({type:'teamGroup/edit',payload: v})
      this.showModal()
      this.setState({
        type: 'edit',
      })
    }
  }

  render() {
    const { dispatch, editItem } = this.props
    return (
      <div>
          <CommonTable name="store/staffgroup" tableConfig={tableConfig} onTableChange={this.onTableChange}></CommonTable>
          <Tkbox
            visible={this.state.visible}
            hideModal={this.hideModal.bind(this)}
            showModal={this.showModal}
            dispatch={dispatch}
            editItem={editItem}
            type={this.state.type}
          ></Tkbox>
      </div>
    )
  }
}

function mapStateToProps(state) {
  const { editItem } = state.teamGroup
  return { editItem }
}

export default connect(mapStateToProps)(teamGroup)
