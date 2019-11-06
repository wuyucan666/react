import { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import CommonTable from '../../../components/CommonTable/index'
import Tkbox from './Tkbox.js'

// import moment from 'Moment'

const tableConfig = {
  screen: {},
}

class workType extends Component {
    state = {
      visible: false,
      type: '',
      name: 'store/stafflevel',
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
        dispatch({type:'workType/edit',payload: {}})
        this.showModal()
        this.setState({
          type: 'add',
        })
      }
      if(e === 11){
        dispatch({type:'workType/edit',payload: v})
        this.showModal()
        this.setState({
          type: 'edit',
        })
      }
    }
    componentDidMount() {
      this.props.dispatch({type: 'workType/getRole'})
    }
    render () {
      const { editItem, roleList } = this.props
      return (
        <div>
          <div style={{display:this.state.visible?'none':''}}><CommonTable name={this.state.name}  tableConfig={tableConfig} onTableChange={this.onTableChange}></CommonTable></div>
          <Tkbox
            visible={this.state.visible}
            hideModal={this.hideModal.bind(this)}
            showModal={this.showModal}
            editItem={editItem}
            roleList={roleList}
            type={this.state.type}
            name={this.state.name}
          ></Tkbox>
        </div>
      )
    }
}

workType.propTypes = {
  dispatch: PropTypes.func,
}

function mapStateToProps(state) {
  const { editItem, roleList } = state.workType
  return { editItem, roleList }
}

export default connect(mapStateToProps)(workType)
