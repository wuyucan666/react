import { Component } from 'react'
import { message } from 'antd'
import { connect } from 'dva'

import tableConfig from './tableConfig'

import Add from './add'
import RandomCard from './components/random-card/index'
import CommonTable from 'components/CommonTable/index'
import services from '../../../services'

class meterCombo extends Component {

  state = {
    new: false,
    showRandom: false,
    type: '',
    id: '',
    status: '',
  }

  showModal = () => {
    this.setState({
      new: true,
    })
  }

  hideModal = () => {
    this.setState({
      new: false,
    })
  }

  hideRandom = () => {
    this.setState({ showRandom: false })
  }

  onTableChange(e, v) {
    const { dispatch } = this.props
    switch (e) {
      case 317:
        dispatch({ type: 'meterCombo/clearState' })
        this.setState({ showRandom: true })
        this.setState({
          type: 'add',
        })
        dispatch({
          type: 'app/setBreads',
          payload: { title: '新增随选卡套餐' },
        })
        break
      case 217:
        dispatch({ type: 'meterCombo/clearState' })
        this.showModal()
        this.setState({
          type: 'add',
        })
        dispatch({
          type: 'app/setBreads',
          payload: { title: '新增计次卡套餐' },
        })
        break
      case 11:
        this.setState({
          type: 'edit',
          id: v.recordsId,
        })
        dispatch({ type: 'meterCombo/edit', payload: v }).then(() => {
          if(v.cardType === 4) {
            this.setState({ showRandom: true })
          }else {
            this.showModal()
          }
        })
        break
      case 17:
      case 13:
        services.disable({ data: { recordsId: v.recordsId, statusTem: v.statusTem === 0 ? 1 : 0 }, keys: { 'name': 'store/records' } }).then(res => {
          if (res.success) {
            if (v.statusTem === 0) {
              message.success('启用成功!')
            } else {
              message.success('禁用成功!')
            }
            dispatch({
              type: 'table/getData',
              payload: 'store/records',
            })
          }
        })
        break
      default:
    }
  }

  render() {
    return (
      <div>
        {this.state.new&&<Add hideModal={this.hideModal} type={this.state.type} id={this.state.id} ></Add>}
        {
          this.state.showRandom && 
          <RandomCard  hideModal={this.hideRandom} type={this.state.type} id={this.state.id}></RandomCard>
        }
        <div style={{ display: (this.state.new || this.state.showRandom) ? 'none' : '' }}>
          <CommonTable name='store/records' onTableChange={this.onTableChange.bind(this)} tableConfig={tableConfig}>
          </CommonTable>
          </div>
      </div>
    )
  }
}

export default connect()(meterCombo)
