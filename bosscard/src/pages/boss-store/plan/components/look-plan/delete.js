import { Component } from "react"
import { Modal } from "antd"
import style from './index.less'

class AddOldPlan extends Component {
  state = {
  }
  componentDidMount() {
  }
  onOk = () => {
    const { handleOk } = this.props
    handleOk()
  }
  onCancel = () => {
    const { handleCancel } = this.props
    handleCancel()
  }
  render() {
    const { visibleDelete } = this.props
    return (
      <div className={style.lockBox}>
        <Modal
          title=" "
          visible={visibleDelete}
          onOk={this.onOk}
          width="360px"
          onCancel={this.onCancel}
        >
          <p style={{ fontSize: '16px', color: '#000000FF', textAlign: 'center' }}>确定要删除该计划？</p>
        </Modal>
      </div >
    )
  }
}

export default AddOldPlan
