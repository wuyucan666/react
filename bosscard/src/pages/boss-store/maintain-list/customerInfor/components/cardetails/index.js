import { connect } from "dva"
import { Component } from "react"
import {Spin, Empty, Select, message} from 'antd'
import moment from 'moment'
import debounce from 'lodash/debounce'
import router from 'umi/router'

import Car from '../../../../../../components/AddCar'
import UnbindCar from '../../../../client-manage/components/UnbindCar'
import Card from '../../../../client-manage/components/Card'

import service from "../../../../../../services"
import  styles  from './styles.less'

const Option = Select.Option

class CarDetails extends Component {
  constructor(props) {
    super(props)
    this.searchCar = debounce(this.searchCar, 500)
  }
  state = {
    clientData: {},
    data: [],
    loading: false,
    carType: 'add',
    carData: {},
    showCar: false,
    showBind: false,
    goBind: false,
    fetching: false,
    car: [],
    clientCarId: 0,
    showCard: false, // 关联卡项modal
    cardList: [], // 关联卡项
    selectedRowKeys: [],
    carId: 0,
  }
  componentDidMount(){
    this.getData()
  }
  getData = () => {
    this.setState({loading: true})
    service.detail({keys: {name: 'store/client'}, data: {clientId: this.props.clientId}}).then(res => {
      this.setState({loading: false})
      if(res.success){
        const clientData = res.list
        clientData.birthday = clientData.birthday ? moment(clientData.birthday * 1000).format('YYYY-MM-DD') : undefined
        clientData.licenseImg = clientData.licenseImg.map((item) => item.id)
        clientData.clientImg = clientData.clientImg.map((item) => item.id)
        const data = res.list.list.map(item => ({
          ...item,
          carIcon: Array.isArray(item.icon) ?  item.icon[0] ? item.icon[0].id : '' : '',
          firshShop: item.firshShop ? moment(item.firshShop * 1000) : undefined,
          nextMaintainTime: item.nextMaintainTime ? moment(item.nextMaintainTime * 1000) : undefined,
          shopCarTime: item.shopCarTime ? moment(item.shopCarTime * 1000) : undefined,
          bizSafeStopTime: item.bizSafeStopTime ? moment(item.bizSafeStopTime * 1000) : undefined,
          trafficSafeStopTime: item.trafficSafeStopTime ? moment(item.trafficSafeStopTime * 1000) : undefined,
          carSafeStopTime: item.carSafeStopTime ? moment(item.carSafeStopTime * 1000) : undefined,
          licenseImg: Array.isArray(item.licenseImg) ? item.licenseImg.map((item) => ({
            url: item.requestAddress,
            uid: item.id,
            imgId: item.id,
          })) : [],
          imgSrc: Array.isArray(item.imgSrc) ? item.imgSrc.map((item) => ({
            url: item.requestAddress,
            uid: item.id,
            imgId: item.id,
          })): [],
        }))
        this.setState({
          clientData,
          data,
        })
      }
    }).catch(() => {
      this.setState({loading: false})
    })
  }
  showCar = (carType = 'add', carData = {}) => {
    this.setState({
      carType,
      carData,
      showCar: true,
    })
  }
  hideCar = () => {
    this.setState({showCar: false})
  }
  carOk = () => {
    this.hideCar()
    this.getData()
  }
  showBind = (clientCarId) => {
    this.setState({showBind: true, clientCarId})
  }
  hideBind = () => {
    this.setState({showBind: false})
  }
  unBind = (callBack) => {
    const {clientCarId} = this.state
    service.INSERT({keys: { name: 'store/client/car/unbind' },data: { clientCarId }}).then(res => {
      callBack()
      if (res.success) {
        message.success('解绑成功')
        this.setState({
          showBind: false,
        })
        this.getData()
      }
    }).catch(() => {
      callBack()
    })
  }
  goBind = () => {
    this.setState({goBind: true})
  }
  // 车辆搜索
  searchCar = (val) => {
    this.setState({fetching: true})
    service.LIST({keys: {name: 'store/car'}, data: {q: {where: {'licenseNo[~]': val}}}}).then(res => {
      this.setState({fetching: false})
      if(res.success){
        this.setState({car: res.list})
      }
    }).catch(() => {
      this.setState({fetching: false})
    })
  }

  // 车辆搜索切换
  searchChange = (id) => {
    this.setState({goBind: false})
    const {car, clientData} = this.state
    const carData = car.filter(item => item.id === id)[0]
    const data = {
      plate: carData.licenseNo,
      phone: clientData.phoneTem,
      name: clientData.clientName,
      seriesId: carData.seriesId,
      carBrandId: carData.carBrandId,
    }
    service.INSERT({keys: {name: 'store/client/car/bind'}, data: {...data}}).then(res => {
      if(res.success){
        this.getData()
      }
    })
  }
  // 关联卡项modal
  showCardModal = (carId) => {
    const {clientId} = this.props
    service.LIST({ keys: { name: 'store/clientcard/limit' }, data: { carId, clientId } }).then(res => {
      if (res.success) {
        this.setState({
          cardList: [...res.list],
          showCard: true,
          carId,
          selectedRowKeys: res.list.filter(item => item.check).map(item => item.id),
        })
      }
    })
  }

  hideCardModal = () => {
    this.setState({
      showCard: false,
    })
  }

  rowChange = (selectedRowKeys) => {
    this.setState({
      selectedRowKeys,
    })
  }

  delSelectedRowKeys = (id) => {
    const { selectedRowKeys } = this.state
    const index = selectedRowKeys.findIndex(item => item === id)
    selectedRowKeys.splice(index, 1)
    this.setState({
      selectedRowKeys,
    })
  }

  goRecord = (clientCarId) => {
    const { clientId  } = this.props
    //之前版本跳已挂账
    router.push(`/boss-store/maintain-list/orderAll?clientId=${clientId}&clientCarId=${clientCarId}`)
  }

  render() {
    const {loading, data, carType, carData, showCar, goBind, fetching, car, carId, selectedRowKeys, showCard, cardList, showBind, clientData} = this.state
    return (
      <Spin spinning={loading}>
        {
          (!!data.length) ? (
            <div className={styles.carContainer}>
              {
                data.map(item => (
                  <div className={styles.carBox} key={item.clientCarId}>
                    <div className={styles.car}>
                      <div className={styles.icon}><img src={Array.isArray(item.icon) ? item.icon[0] ? item.icon[0].requestAddress : '' : ''} alt=""/></div>
                      <div className={styles.carInfo}>
                        <div>{item.licenseNo}</div>
                        <div>{item.carBrandName + item.seriesName}</div>
                      </div>
                      <div className={styles.action}>
                        <span onClick={() => this.goRecord(item.clientCarId)}>消费记录</span>
                        <span onClick={() => this.showCardModal(item.clientCarId)}>关联卡项</span>
                        <span onClick={() => this.showCar('update', item)}>编辑</span>
                        {
                          data.length > 1 &&  <span onClick={() => this.showBind(item.clientCarId)}>解绑</span>
                        }
                      </div>
                    </div>
                  </div>
                ))
              }
              <div className={styles.carBox} onClick={() => this.showCar('add', {phoneTem: clientData.phoneTem, clientName: clientData.clientName})}>
                <div className={styles.btn}>
                  <i className='iconfont icon-tianjia'/>
                  <span>新建车辆</span>
                </div>
              </div>
              {
                goBind ?(
                  <div className={styles.carBox}>
                    <div className={styles.btn}>
                      <Select
                        style={{width: 230}}
                        autoFocus={true}
                        showArrow={false}
                        showSearch
                        size='large'
                        placeholder='输入车牌号搜索'
                        filterOption={false}
                        notFoundContent={fetching ? <Spin size="small" /> : null}
                        onSearch={this.searchCar}
                        onChange={this.searchChange}
                        onBlur={()=>this.setState({goBind: false})}
                      >
                        {
                          car.map((item) => (
                            <Option value={item.id} key={item.id}>{item.licenseNo}</Option>
                          ))
                        }
                      </Select>
                    </div>
                  </div>
                ):(
                  <div className={styles.carBox} onClick={this.goBind}>
                    <div className={styles.btn}>
                      <div>
                        <i className='iconfont icon-bangding'/>
                        <span>绑定车辆</span>
                      </div>
                    </div>
                  </div>
                )
              }
            </div>
          ):(
            <Empty style={{marginTop: 50}}/>
          )
        }
        <Car
          type={carType}
          visible={showCar}
          editItem={carData}
          onCancel={this.hideCar}
          onOk={this.carOk}
        />
        <UnbindCar
          visible={showBind}
          onCancel={this.hideBind}
          onOk={this.unBind}
        />
        <Card
          visible={showCard}
          selectedRowKeys={selectedRowKeys}
          cardList={cardList}
          carId={carId}
          clientId={this.props.clientId}
          rowChange={this.rowChange}
          delSelectedRowKeys={this.delSelectedRowKeys}
          onCancel={this.hideCardModal}
          onOk={this.hideCardModal}
        />
      </Spin>
    )
  }
}
function mapStateToProps() {
  return {}
}
export default connect(mapStateToProps)(CarDetails)
