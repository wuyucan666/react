import { Component } from "react"
import { Modal, Input, Select, Icon } from "antd"
import style from './index.less'
import services from "../../../../../services"

const Option = Select.Option
class AddOldPlan extends Component {
  state = {
    value: '',
    result: [],
    num: '',
    carId: '',
    clientInfo: {},
    page: 1,
    totalPage: 1,
    loading: false,
  }
  componentDidMount() {
  }
  handleCancel = () => {
    const { gooldClose } = this.props
    gooldClose()
  }
  // 只能输入两位小数
  priceNumber = (e) => {
    let str = e.target.value
    let rel = /^[0-9]+\.{0,1}[0-9]{0,2}$/
    if (!rel.test(str) || (str.substr(0, 1) === '0' && str.substr(1, 1) === '0')) {
      str = ''
    }
    this.setState({ num: str })
  }
  /**
   * 搜索
   */
  getResult = (value, isScroll) => {
    if (!value && value !== 0) {
      return false
    }
    this.setState({ loading: true })
    services.LIST({
      keys: {
        name: 'store/clients',
      },
      data: {
        name: value,
        q: { page: this.state.page },
      },
    }).then(res => {
      this.setState((prevState => ({
        value,
        result: isScroll ? prevState.result.concat(res.list) : res.list,
        totalPage: res.totalPage,
        loading: false,
      })))
    })
  }
  onSearch = (value) => {
    this.setState({ page: 1, result: [] }, () => {
      this.getResult(value)
    })
  }
  setMember = (carId) => {
    const { result } = this.state
    const clientInfo = result.find((_) => _.carId === Number(carId))
    this.setState({ carId, clientInfo, value: carId })
    this.props.onChange && this.props.onChange(clientInfo)
  }
  popupScroll = (e) => {
    e.persist()
    let target = e.target
    if (target.scrollTop + target.offsetHeight === target.scrollHeight) {
      const { page, totalPage, value } = this.state
      if (page < totalPage) {
        this.setState({
          page: page + 1,
        }, () => {
          this.getResult(value, true)
        })
      }
    }
  }
  render() {
    const { visible } = this.props
    const { result, value, num } = this.state
    return (
      <div className={style.oldaddplan}>
        <Modal
          className="oldaddplan-footer-button"
          title="添加老客户业绩"
          visible={visible}
          width="570px"
          onOk={this.handleCancel}
          onCancel={this.handleCancel}
        >
          <div>
            <div className="oldaddplan-footer-search search flex">
              <Select
                size="large"
                className="item"
                showSearch
                placeholder="手机号/车牌号/姓名"
                defaultActiveFirstOption={false}
                showArrow={false}
                filterOption={false}
                value={value || undefined}
                getPopupContainer={trigger => trigger.parentNode}
                onSearch={this.onSearch}
                onChange={this.setMember}
                onPopupScroll={this.popupScroll}
              >
                {result.map((_) => (
                  <Option key={_.carId} value={_.carId}><a >{_.plate}</a> － {_.name} － {_.phone}</Option>
                ))}
              </Select>
              <Icon type="search" className="oldPlanIcon" />
            </div>
            <div className={style.oldPlanData}>
              <div className={style.name}>目标业绩</div>
              <div className={style.oldresults}><Input size="large" value={num} onChange={this.priceNumber} addonAfter="元" /></div>
            </div>
          </div>
        </Modal>
      </div >
    )
  }
}

export default AddOldPlan
