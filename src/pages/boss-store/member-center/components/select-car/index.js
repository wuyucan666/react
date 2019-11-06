import { Component } from "react"
import { Spin, Icon, message } from "antd"
import services from "services"
import styles from "./index.less"
import checkedImage from "../images/xuanzhong.png"
import AddCar from "../../../../../components/AddCar/index"

class SelectCar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: !!this.props.id,
      list: [], // 汽车的列表
      checkeds: props.selected,
      showAddCar: false,
      carInfo: [],
    }
    this.props.id && this.getCarList()
  }
  /**
   * 获取车辆列表
   */
  getCarList() {
    services
      .list({
        keys: { name: "store/clientcar" },
        data: { q: { where: { clientId: this.props.id } } },
      })
      .then(res => {
        const checkeds = this.props.selected.length ? this.props.selected : res.list
        this.setState({
          list: res.list,
          loading: false,
          checkeds,
        })
        this.props.onChange && this.props.onChange(checkeds)
      })
  }

  /**
   * 选择汽车
   * @param {Object} item 汽车
   */
  check(item) {
    let checkeds = [...this.state.checkeds]

    // 查询是否已选择
    // 如果已经存在就删掉
    const index = checkeds.findIndex(_ => _.clientCarId === item.clientCarId)
    if (index > -1) {
      checkeds.splice(index, 1)
    } else {
      checkeds.push(item)
    }

    // 赋值到state
    // 通知父级改变
    this.setState({ checkeds })
    this.props.onChange && this.props.onChange(checkeds)
  }
  // 新建车辆
  showAddCar = () => {
    this.setState({ showAddCar: true })
  }
  // 新建车辆ok
  onOk = (car) => {
    const { carInfo } = this.state
    let _index = carInfo.findIndex(_ => _.plateNumber === car.plateNumber)
    if(_index >= 0) {
      return message.info("车牌号不能相同！")
    }
    carInfo.push({
      ...car,
      licenseNo: car.plateProvince + car.plateLetter + car.plateNumber,
      iconImg: {
        requestAddress: car.carIconUrl,
        id: car.carIcon,
      },
    })
    this.setState({
      carInfo,
      showAddCar: false,
    })
    // 新建车辆成功刷新会员车辆列表
    services.list({
        keys: { name: "store/clientcar" },
        data: { q: { where: { clientId: this.props.id } } },
    }).then(res => {
      this.setState({
        list: res.list,
        loading: false,
        checkeds: res.list,
      })
      this.props.onChange && this.props.onChange(res.list)
    })
  }

  // 新建车辆cancel
  hideAdd = () => {
    this.setState({ showAddCar: false })
  }
  render() {
    const { showAddCar } = this.state
    const {member} = this.props

    return (
      <Spin wrapperClassName={styles.wrap} spinning={this.state.loading}>
        <div className="grid">
          {this.state.list.map((_, index) => (
            <div
              className={
                this.state.checkeds.find(
                  item => _.clientCarId === item.clientCarId
                )
                  ? "pay-item flex center left active"
                  : "pay-item flex center left"
              }
              onClick={() => this.check(_)}
              key={index}
            >
              <div className="checked-icon">
                <img src={checkedImage} alt="" />
              </div>
              <img
                className="main-img"
                src={_.icon[0] ? _.icon[0].requestAddress : ""}
                alt=""
              />
              <h2>{_.plateProvince + _.plateLetter + "·" + _.plateNumber}</h2>
            </div>
          ))}
          {(member && member.clientId) ? <div className="pay-item flex center left bind-car-new-car" onClick={this.showAddCar}>
            <div><Icon type="plus" /> 新建车辆</div>
          </div> : ''}
          <AddCar
          hideClient={true}
          type="add"
          visible={showAddCar}
          memberClientPhone={member ? (member.phoneTem || member.phone) : 0}
          editItem={{}}
          onCancel={this.hideAdd}
          onOk={this.onOk}
        />
        </div>
      </Spin>
    )
  }
}

export default SelectCar
