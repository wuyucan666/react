import { Component } from 'react'
import CommonTable from '../../../components/CommonTable/index'
import { message } from 'antd'
import tableConfig from './tableConfig'
import { connect } from 'dva'

import services from '../../../services'
import Add from './add'


class cards extends Component {

  state = {
    showAdd: false,
    type: '',
    id: '',
    status: '',
  }

  showModal = () => {
    this.setState({
      showAdd: true,
    })
  }

  hideModal = () => {
    this.setState({
      showAdd: false,
    })
  }

  onTableChange(e,v) {
    const { dispatch } = this.props
    switch (e) {
      case 217:
        dispatch({type: 'cards/clearState'})
        this.showModal()
        this.setState({
          type: 'add',
        })
        dispatch({
          type: 'app/setBreads',
          payload: { title : '新增会员卡种' },
        })
        break
      case 11:
        dispatch({type: 'cards/edit' ,payload: v})
        this.showModal()
        this.setState({
          type: 'edit',
          id: v.speciesId,
        })
        break
      case 17:
      case 13:
        services.disable({data: {speciesId: v.speciesId, state: v.state === 0 ? 1 : 0}, keys: {'name': 'store/species'}}).then(res => {
          if(res.success) {
            if(v.state === 0) {
              message.success('启用成功!')
            }else {
              message.success('禁用成功!')
            }
            dispatch({
              type: 'table/getData',
              payload: 'store/species',
            })
          }
        })
        break
      case 22:
      console.log('copy')
        services.cardSpeciesCopy({ data: {id: v.speciesId}}).then(res => {
          console.log(res)
          dispatch({
            type: 'table/getData',
            payload: 'store/species',
          })
        })
      default:
    }
  }

  changeStatus = (e) => {
    this.setState({
      status: e,
    })
  }

  render() {
    const { editItem } = this.props
    return(
      <div>
        {this.state.showAdd &&<Add hidAdd={this.hideModal} type={this.state.type} editItem={editItem} id={this.state.id}></Add>}
        <div style={{display:(this.state.showAdd) ? 'none':''}}> 
          <CommonTable name='store/species' tableConfig={tableConfig} onTableChange={this.onTableChange.bind(this)} >
          </CommonTable>
        </div>
      </div>
    )
  }
}
function mapStateToProps(state) {
  const { editItem } = state.cards
  return { editItem }
}
export default connect(mapStateToProps)(cards)
