import { Component } from "react"
import { Modal } from "antd"
import style from './index.less'

class AddOldPlan extends Component {
  state = {
  }
  componentDidMount() {
  }
  handleCancel = () => {
    const { golockClose } = this.props
    golockClose()
  }
  handleClone = () => {
    const { handleClone } = this.props
    handleClone()
  }
  render() {
    const { lockState } = this.props
    return (
      <div className={style.lockBox}>
        <Modal
          title="  "
          visible={lockState}
          width="570px"
          onOk={this.handleCancel}
          onCancel={this.handleClone}
        >
          <div className={style.lockstyle}>
            <span className={`${style.icon} iconfont icon-tishi`}></span>
            <span>锁定后将不能再编辑，是否继续？</span>
          </div>
        </Modal>
      </div >
    )
  }
}

export default AddOldPlan
