import { Component } from "react"
import { Modal, Row, Col } from "antd"
import styles from "./index.less"
class CustomerInformation extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }
  handleOk = () => {
    const { getCar } = this.props
    getCar()
    this.handleCancel()
  }
  handleCancel = () => {
    const { goCancel } = this.props
    goCancel(false)
  }
  /**
   * 选择车辆
   */
  onClick = (index) => {
    const { setCarShow } = this.props
    setCarShow(index)
  }

  render() {
    const { visible, customerCars } = this.props
    return (
      <Modal
        title="绑定车辆"
        visible={visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        width="900px"
      >
        <div className={styles.carItemw}>
          <Row gutter={15}>
            {customerCars.map((v, index) => {
              return (
                <Col className="gutter-row" span={8} key={index}>
                  <div className={styles.carItem} onClick={this.onClick.bind(this, index)} style={{ border: v.show ? '1px solid #4AACF7FF' : '1px solid #F2F2F2FF' }}>
                    <div className={styles.img}>
                      <img alt="图片" src={v.iconImg.requestAddress} />
                    </div>
                    <div className={styles.name}>
                      <p>{v.licenseNo}</p>
                      <span>{v.carBrandName + v.seriesName}</span>
                    </div>
                  </div>
                </Col>
              )
            })}
          </Row>
        </div>
      </Modal>
    )
  }
}

export default CustomerInformation
