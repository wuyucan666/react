import { Component } from 'react'
import CommonTable from 'components/CommonTable'
import Modal from './modal'

export default class StoreCategory extends Component {
  state = {
    createModal: false,
    type: 'add',
    btnLoading: false,
    formData: {},
  }

  render () {
    return (
      <div>
        <CommonTable name='brand/storetype' onTableChange={(e, data) => {
          if (e === 217) {
            // 新增
            this.setState({createModal: true, type: 'add', formData: {}})
          } else if (e === 11) {
            // 修改
            this.setState({createModal: true, type: 'edit', formData: data})
          }
        }}></CommonTable>
        <Modal formData={this.state.formData} btnLoading={this.state.btnLoading} setBtnLoading={payload => this.setState({btnLoading: payload})} type={this.state.type} show={this.state.createModal} success={() => {this.setState({createModal: false})}}></Modal>
      </div>
    )
  }
}
