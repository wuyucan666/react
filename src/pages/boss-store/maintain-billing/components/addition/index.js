import { Component } from "react"
import { connect } from "dva"
import { Button, message } from "antd"

import empty from "../images/none.png"
import AdditionProject from "./components/addition"
import List from "./list"
import styles from "./style.less"
class addition extends Component {
  state = {
    visible: false,
  }

  hideModal = () => {
    this.setState({ visible: false })
  }

  changeHandel = () => {
    this.props.changeInfo(this.props.list)
  }

  onChange = (value, item, key) => {
    if(value === undefined) {
      message.error("操作不合理")
      value = 1
    }
    this.props.list.map(v => {
      if (v.projectId === item.projectId) {
        v[key] = value
        if (key !== "itemTotal") {
          v.itemTotal = (((v.priceTem * v.discount) / 10) * v.num).toFixed(2)
        } else {
          v.discount = ((v.itemTotal * 10) / (v.priceTem * v.num)).toFixed(1)
        }
        if (v.discount > 10) {
          v.discount = (10).toFixed(1)
          v.itemTotal = (((v.priceTem * v.discount) / 10) * v.num).toFixed(2)
          message.error("注意当前折扣已超过10!")
        }
      }
      return v
    })
    this.changeHandel()
  }

  deleteHandel = item => {
    let arr = this.props.list.filter(v => v.projectId !== item.projectId)
    this.projectRef.delSelectItem(item)
    this.props.changeInfo(arr)
  }

  onOk = e => {
    e = e.map(v => {
      let idx = this.props.list.findIndex(j => j.projectId === v.projectId)
      if (idx !== -1) {
        v = this.props.list[idx]
      } else {
        v.num = 1
        v.discount = (10).toFixed(1)
        v.itemTotal = (1 * v.priceTem).toFixed(2)
        v.checked = false
        v.remark = ""
      }
      return v
    })
    this.props.changeInfo(e)
  }

  showModal = () => {
    this.setState({ visible: true })
  }

  onRef = ref => {
    this.projectRef = ref
  }

  resetSelected = arr => {
    this.projectRef.resetSelected(arr)
  }

  componentDidMount() {
    const { onRef } = this.props
    this.props.dispatch({ type: "maintainBilling/getMaintain" })
    if (onRef) {
      onRef(this)
    }
  }

  render() {
    const { list, workStaff, saleStaff, maintaintype } = this.props
    const additionProps = {
      visible: this.state.visible,
      selected: this.props.list,
      onCancel: this.hideModal,
      onOk: this.onOk,
      onRef: this.onRef,
    }

    return (
      <div>
        <AdditionProject {...additionProps} maintaintype={maintaintype} />
        {list.length > 0 ? (
          <div>
            <List
              goodsList={this.props.list || []}
              onChange={this.onChange}
              deleteHandel={this.deleteHandel}
              workStaff={workStaff}
              saleStaff={saleStaff}
            />
            <Button
              className={styles.but}
              type="dashed"
              size="large"
              onClick={this.showModal}
            >
              添加项目
            </Button>
          </div>
        ) : (
          <div className="ainier_empty animated bounceIn">
            <img src={empty} alt="" />
            <p style={{ fontSize: "14px", color: "#333" }}>
              您暂未添加任何附加费用项目
            </p>
            <Button type="primary" size="large" onClick={this.showModal}>
              添加项目
            </Button>
          </div>
        )}
      </div>
    )
  }
}

export default connect(
  ({ maintainBilling: { workStaff, saleStaff, maintaintype } }) => ({
    workStaff,
    saleStaff,
    maintaintype,
  })
)(addition)
