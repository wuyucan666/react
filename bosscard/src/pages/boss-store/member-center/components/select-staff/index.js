import { Component } from "react"
import { Spin, InputNumber } from "antd"
import services from "services"
import styles from "./index.less"
import checkedImage from "../images/xuanzhong.png"
import menImage from "../images/men.png"

class SelectStaff extends Component {
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
      let list = [...this.state.list]
      list.splice(index, 1, {
        ...list[index],
        checked: !list[index].checked,
      })
      const length = list.filter((_) => _.checked).length
      /** 当有选择的员工时，自动分配提成 */
      if (length > 0) {
        let _index = 0
        list = list.map((_, index) => {
          if (_.checked) {
            _index = index
          }
          return {
            ..._,
            scale: _.checked ? (100 / length).toFixed(1) : null,
          }
        })
        /**当自动分配的值四舍五入之后，总和不等于100时，对最后一个重新分配 */
        const total = list.reduce(
          (value, item) => parseFloat(item.scale) * 10 + value,
          0
        )
        if (total !== 1000) {
          const lastScale = this.getLastStaffScale(length)
          list.splice(_index, 1, { ...list[_index], scale: lastScale })
        }
      }
      this.setState({
        list,
      })
      this.props.onChange(list)
    }
  }
  getLastStaffScale(length) {
    return (
      (1000 - (length - 1) * (parseFloat((100 / length).toFixed(1)) * 10)) / 10
    )
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
                  ? "pay-item flex center left active"
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
                {_.checked && (
                  <InputNumber
                    min={0}
                    max={100}
                    style={{ width: 96, marginLeft: 20 }}
                    value={_.scale}
                    formatter={this.handleFormatter}
                    parser={this.handleParser}
                    onChange={this.handleInputChange.bind(this, index)}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </Spin>
    )
  }
}

export default SelectStaff
