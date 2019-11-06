import { Component } from "react"
import { Icon, message } from "antd"
import AddCar from "../../../../../components/AddCar/index"
import styles from "./style.less"
class CustomerCar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showAddCar: false,
      carInfo: props.editItem || [],
    }
  }
  // 新建车辆
  showAddCar = () => {
    this.setState({ showAddCar: true })
  }

  // 新建车辆ok
  onOk = (car) => {
    console.log('99999999999999999', car)
    const { carInfo } = this.state
    const plate = car.plateProvince + car.plateLetter + car.plateNumber
    let _index = carInfo.findIndex(_ => _.plate === plate)
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
      plate: car.plateProvince + car.plateLetter + car.plateNumber,
    })
    this.setState({
      carInfo,
      showAddCar: false,
    })
    // v.iconImg.requestAddress
    const { dispatch } = this.props
    dispatch({
      type: "customersImport/goCustomerCar",
      payload: carInfo.filter((_) => _),
    })
  }

  // 新建车辆cancel
  hideAdd = () => {
    this.setState({ showAddCar: false })
  }
  // 删除
  delCar = (index) => {
    let carInfo = this.state.carInfo
    carInfo.splice(index, 1)
    this.setState({
      carInfo,
      showAddCar: false,
    })
    // v.iconImg.requestAddress
    const { dispatch, selectCard, rechargeCard } = this.props
    if (rechargeCard && rechargeCard.length > 0) {
      let arr = rechargeCard.map((_) => ({
        ..._,
        car: carInfo.filter((_) => _),
      }))
      dispatch({
        type: "customersImport/goRechargeCard",
        payload: arr,
      })
    }
    if (selectCard && selectCard.length > 0) {
      let arr = selectCard.map((_) => ({ ..._, car: carInfo.filter((_) => _) }))
      dispatch({
        type: "customersImport/goSelectCardCard",
        payload: arr,
      })
    }
    dispatch({
      type: "customersImport/goCustomerCar",
      payload: carInfo.filter((_) => _),
    })
  }

  render() {
    const { showAddCar, carInfo } = this.state
    return (
      <div className={styles["customer-car-wrap"]}>
        {carInfo &&
          carInfo.map((item, index) => {
            return (
              <div className={styles["customer-car"]} key={index}>
                <div
                  className={styles.put}
                  onClick={this.delCar.bind(this, index)}
                >
                  删 除
                </div>
                <div className={styles.l}>
                  <img src={item.carIconUrl} alt="" />
                </div>
                <div className={styles.r}>
                  <div>
                    <div>{item.licenseNo}</div>
                    <p>{item.carBrandName + item.seriesName}</p>
                  </div>
                </div>
              </div>
            )
          })}
        <div className={styles["customer-car-add"]} onClick={this.showAddCar}>
          <Icon type="plus" /> 新建车辆
        </div>
        <AddCar
          hideClient={true}
          noGetData={true}
          type="add"
          visible={showAddCar}
          editItem={{}}
          onCancel={this.hideAdd}
          onOk={this.onOk}
        />
      </div>
    )
  }
}

export default CustomerCar
