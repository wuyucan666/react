import { Component } from "react"
import { Spin } from "antd"
import services from "services"
import styles from "./index.less"
import checkedImage from "../images/xuanzhong.png"
import menImage from "../images/men.png"

class SelectPay extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: !this.props.selected.length,
      list: [...this.props.selected], // 员工的列表
    }
    this.getPayList()
  }
  /**
   * 获取员工列表
   */
  getPayList() {
    if (!this.props.selected.length) {
      services.list({ keys: { name: "store/staff" } }).then((res) => {
        this.setState({
          list: res.list.filter((_) => _.isJob === 1), // 员工在职
          loading: false,
        })
      })
    }
  }

  /**
   * 选择员工
   * @param {Number} item  索引值
   */
  check(index, e) {
    if (e.target.nodeName !== "INPUT") {
      /** 赠送卡为单选，此处为兼容其他业务组件 */
      let list = [...this.state.list.map((_) => ({ ..._, checked: false }))]
      list.splice(index, 1, {
        ...list[index],
        checked: !list[index].checked,
      })
      this.setState({
        list,
      })
      this.props.onChange(list)
    }
  }
  handleFormatter(value) {
    return value + "%"
  }
  handleParser(value) {
    return value.replace("%", "")
  }
  handleInputChange(index, value) {
    let list = [...this.state.list]
    list.splice(index, 1, {
      ...list[index],
      scale: value,
    })
    this.setState({
      list,
    })
    this.props.onChange(list)
  }
  render() {
    return (
      <Spin wrapperClassName={styles.wrap} spinning={this.state.loading}>
        <div className="grid">
          {this.state.list.map((_, index) => (
            <div
              className={
                _.checked
                  ? "pay-item flex center left active give"
                  : "pay-item flex center left"
              }
              onClick={this.check.bind(this, index)}
              key={index}
            >
              {_.checked && (
                <div className="checked-icon">
                  <img src={checkedImage} alt="" />
                </div>
              )}
              <img className="main-img" src={menImage} alt="员工头像" />
              <div>
                <h2>{_.staffName}</h2>
              </div>
            </div>
          ))}
        </div>
      </Spin>
    )
  }
}

export default SelectPay
