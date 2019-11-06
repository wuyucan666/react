import { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import CommonTable from '../../../components/CommonTable/index'
import Tkbox from './Tkbox.js'


class workType extends Component {
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
        dispatch({type:'brandWorkType/edit',payload: {}})
        this.showModal()
        this.setState({
          type: 'add',
        })
      }
      if(e === 11){
        dispatch({type:'brandWorkType/edit',payload: v})
        this.showModal()
        this.setState({
          type: 'edit',
        })
      }
    }
    componentDidMount() {
      this.props.dispatch({type: 'brandWorkType/getRole'})
    }
    render () {
      const { dispatch, editItem, roleList } = this.props
      return (
        <div>
          <div style={{display:this.state.visible?'none':''}}>
          <CommonTable name="brand/stafflevel" onTableChange={this.onTableChange}></CommonTable>
          </div>
          <Tkbox
            visible={this.state.visible}
            hideModal={this.hideModal.bind(this)}
            showModal={this.showModal}
            dispatch={dispatch}
            editItem={editItem}
            roleList={roleList}
            type={this.state.type}
          ></Tkbox>
        </div>
      )
    }
}

workType.propTypes = {
  dispatch: PropTypes.func,
}

function mapStateToProps(state) {
  const { editItem, roleList } = state.brandWorkType
  return { editItem, roleList }
}

export default connect(mapStateToProps)(workType)
