import { Component } from 'react'
import { connect } from 'dva'
import moment from 'moment'
import CommonTable from '../../../components/CommonTable/index'
import tableConfig from './tableConfig'
import AddCar from '../../../components/AddCar'

class carManage extends Component {
  state = {
    showAdd: false,
    editItem: {},
    type: 'add',
  }
  showAdd = () => {
    this.setState({
      type: 'add',
      showAdd: true,
      editItem: {},
    })
  }
  editCar = (data) => {
    const editItem = {
      ...data,
      carIcon: data.icon[0].id,
      firshShop: data.firshShop ? moment(data.firshShop * 1000) : undefined,
      nextMaintainTime: data.nextMaintainTime ? moment(data.nextMaintainTime * 1000) : undefined,
      shopCarTime: data.shopCarTime ? moment(data.shopCarTime * 1000) : undefined,
      bizSafeStopTime: data.bizSafeStopTime ? moment(data.bizSafeStopTime * 1000) : undefined,
      trafficSafeStopTime: data.trafficSafeStopTime ? moment(data.trafficSafeStopTime * 1000) : undefined,
      carSafeStopTime: data.carSafeStopTime ? moment(data.carSafeStopTime * 1000) : undefined,
      licenseImg: data.licenseImg.map((item) => ({
        url: item.requestAddress,
        uid: item.id,
        imgId: item.id,
      })),
      imgSrc: data.imgSrc.map((item) => ({
        url: item.requestAddress,
        uid: item.id,
        imgId: item.id,
      })),
    }
    this.setState({
      type: 'update',
      showAdd: true,
      editItem,
    })
  }
  hideAdd = () => {
    this.setState({
      showAdd: false,
    })
  }
  onOk = () => {
    this.hideAdd()
    this.props.dispatch({
      type: "table/getData",
      payload: {},
    })
  }
  onTableChange = (e, item) => {
    switch (e) {
      case 217:
        this.showAdd()
        break
      case 11:
        this.editCar(item)
        break
      default:
    }
  }
  render () {
    const { showAdd, type, editItem } = this.state
    return (
      <div>
        <CommonTable name="store/clientcar" tableConfig={tableConfig} onTableChange={this.onTableChange} refresh/>
        <AddCar
          type={type}
          visible={showAdd}
          editItem={editItem}
          onCancel={this.hideAdd}
          onOk={this.onOk}
        />
      </div>
    )
  }
}


export default connect()(carManage)
