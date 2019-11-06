import { Component } from "react"
import { Modal} from "antd"
import styles from "./index.less"
class CustomerInformation extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }
  handleOk = () => {
    const { onRechargeClone } = this.props
    onRechargeClone(true)
  }
  handleCancel = () => {
    const { onRechargeClone } = this.props
    onRechargeClone()
  }
  /**
   * 选择车辆
   */
  onClick = (index) => {
    const { setCarShow } = this.props
    setCarShow(index)
  }

  render() {
    const { visible, rechargeNew } = this.props
    return (
      <Modal
        title="提示"
        visible={visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        okText="添加"
        cancelText="不添加"
        width="740px"
      >
        <div className={styles.recharge_card}>
          <div className={styles.h}>该充值卡绑定以下赠送服务，是否添加到导入？（添加后可以修改）</div>
          <div className={styles.content}>
            {rechargeNew && rechargeNew.map((v, index) => <div key={index}>{v.name} * {v.numTem}</div>)}
          </div>
        </div>
      </Modal>
    )
  }
}

export default CustomerInformation
