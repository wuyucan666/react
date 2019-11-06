import { Select, Spin } from "antd"
import { Component } from "react"
import PropTypes from "prop-types"
import debounce from 'lodash/debounce'

import AddCar from '../../../../../components/AddCar'
import Order from './components/Order'
import services from "../../../../../services"
import collectData from 'utils/collectData'
import style from "./index.less"

const Option = Select.Option

class SearchMember extends Component {
  constructor(props) {
    super(props)
    this.onSearch = debounce(this.onSearch, 500)
  }
  state = {
    value: '',
    carId: '',
    clientInfo: {},
    result: [],
    page: 1,
    totalPage: 1,
    loading: false,
    showAdd: false,
    showOrder: false,
    orderList: [],
  }
  componentDidMount(){
    const {clientInfo,dispatch,isAdding,onRef} = this.props
    onRef(this)
    if(!isAdding) {
      this.setState({clientInfo,carId:clientInfo.carId})
      if(clientInfo.carId){
        dispatch({
          type:'maintainBilling/addGuide',
          payload: {clientId: clientInfo.clientId},
        })
        dispatch({
          type:'maintainBilling/addPackage',
          payload:{
            clientId:clientInfo.clientId,
            carId:clientInfo.carId,
          },
        })
      }
      if(clientInfo.clientId){
        this.getRecord(clientInfo.clientId)
      }
    }
  }

  updateClientInfo(client) {
    this.setState({clientInfo: {...client, ...client.car}})
  }

  // 消费记录
  getRecord = (clientId) => {
    services.LIST({keys: {name: 'maintain/recently'},data: {q: {page:1,limit: 2,where: {clientId}}}}).then(res => {
      if(res.success){
        const {dispatch} = this.props
        dispatch({
          type:'maintainBilling/setAccount',
          payload:{
            record: res.list,
          },
        })
      }
    })
  }
  onSearch = (value) => {
    this.setState({page: 1, result: []},()=>{
      this.getResult(value)
    })
  }
  /**
   * 搜索会员
   */
  getResult = (value, isScroll) => {
    this.setState({loading: true})
    services.LIST({
      keys : {
        name: 'store/client/quick-search',
      },
      data:{
        q: {page: this.state.page, where: {'clientName[~]|clientPhone[~]|licenseNo[~]': value}},
      },
    }).then(res => {
      if(res.success){
        this.setState((prevState => ({
          value,
          result: isScroll ? prevState.result.concat(res.list) : res.list,
          totalPage: res.totalPage,
          loading: false,
        })))
      }
    })
  }

  setMember =  (carId) => {
    const {result} = this.state
    let clientInfo = result.find((_) => _.carId === Number(carId))
    services.LIST({
      keys: {
        name: `store/client/preview/${clientInfo.clientId}`,
      },
      data: {
        carId,
      },
    }).then(async res => {
      console.log(res)
      clientInfo = {
        ...clientInfo,
        ...res.data,
        ...res.data.car,
      }

      await services.LIST({
        keys : {
          name: 'maintain/order',
        },
        data:{
          q: {limit: 1000,where: {state: [1,3], licenseNo: clientInfo.plate}},
        },
      }).then(res => {
        if(res.success && res.list.length){
          this.setState({
            showOrder: true,
            orderList: res.list,
          })
        }
      })
      await this.getRecord(clientInfo.clientId)
      this.setState({carId, clientInfo})
      this.props.onChange && this.props.onChange(clientInfo)
    })
  }

  reset = () => {
    this.setState({
      carId: '',
    })
    this.props.goBack()
  }

  popupScroll = (e) => {
    e.persist()
    let target = e.target
    if (target.scrollTop + target.offsetHeight === target.scrollHeight) {
      const {page, totalPage, value} = this.state
      if(page < totalPage){
        this.setState({
          page: page + 1,
        },()=>{
          this.getResult(value, true)
        })
      }
    }
  }
  showAdd = () => {
    collectData('order')
    this.setState({showAdd: true})
  }
  hideAdd = () => {
    this.setState({showAdd: false})
  }
  carOk = async ({plateNumber, plateProvince, plateLetter, clientCarId}) => {
    this.setState({showAdd: false})
    const plate = plateProvince + plateLetter + '·' + plateNumber
    services.LIST({
      keys : {
        name: 'store/clients',
      },
      data:{
        name:plate,
        q: {page: 1},
      },
    }).then(res => {
      if(res.success){
        this.setState({
          value: plate,
          result: res.list,
          totalPage: res.totalPage,
          loading: false,
        },() => {
          this.setMember(clientCarId)
        })
      }
    })
  }
  clickAccount = () => {
    const {isPay, toggleTab} = this.props
    if(!isPay){
      toggleTab(5)
    }
  }
  orderOk = () => {
    this.setState(prevState => {
      return {
        showOrder: !prevState.showOrder,
      }
    })
  }
  render() {
    const {type,isPay,dispatch} = this.props
    const {carId, result, clientInfo, value, loading, showAdd, showOrder, orderList} = this.state
    return (
      <div className={style.searchMember}>
        <div className="flex center" style={{marginBottom:32}}>
          <h3 className="item" style={{textAlign: isPay ? 'center' : 'left'}}>{isPay ? '结算' : '车辆信息'}</h3>
          {
            (type === 0 && !!carId && !isPay) && (
            <div
              className="pointer animated fadeInRight faster"
              onClick={this.reset}
            >
              <i className="iconfont icon-fanhui" />
              修改
            </div>
            )
          }
          {
            (!carId && !isPay) && (
              <span className={style.add} onClick={this.showAdd}>新建车辆</span>
            )
          }
        </div>

        {!!carId && (
          <div className={style.client} onClick={this.clickAccount}>
            <div className='head'>
              <div>
                <img src={clientInfo.icon.requestAddress} alt=' '/>
              </div>
              <div>{clientInfo.plate}</div>
              <div>{clientInfo.model}</div>
            </div>
            <div className='info'>
              <div className='flex between' >
                <div>
                  <span>{clientInfo.clientName? clientInfo.clientName: '散客' }</span>
                  <span className={clientInfo.sex === 1 ? 'iconfont icon-xingbienan' : 'iconfont icon-xingbienv'}/>
                  <span className='tag'>{clientInfo.clientType === 1 ? '个人' : '单位'}</span>
                </div>
                <div>
                  {clientInfo.phone ? clientInfo.phone : ''}
                </div>
              </div>
              <div className='flex'>
                <div className='item'>
                  <span>{clientInfo.balance}</span>
                  <span>账户余额</span>
                </div>
                <div className='item'>
                  <span>{clientInfo.cardNumber}</span>
                  <span>计次卡</span>
                </div>
                <div className='item'>
                  <span>{clientInfo.integral}</span>
                  <span>积分</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {!carId && (
          <div className="search flex">
            <Select
              size="large"
              className="item"
              showSearch
              placeholder="手机号/车牌号/姓名"
              defaultActiveFirstOption={false}
              showArrow={false}
              filterOption={false}
              value={value || undefined}
              loading={loading}
              getPopupContainer={trigger => trigger.parentNode}
              notFoundContent={loading ? <Spin size='small' /> : null}
              onSearch={this.onSearch}
              onChange={this.setMember}
              onPopupScroll={this.popupScroll}
            >
              {result.map((_) => {
                if(_.name){
                  return(
                    <Option key={_.carId} value={_.carId}><a >{_.plate}</a> － {_.name} － {_.phone}</Option>
                  )
                }else {
                  return(
                    <Option key={_.carId} value={_.carId}><a >{_.plate}</a> －  散客</Option>
                  )
                }
              })}
            </Select>
          </div>
        )}
        <AddCar
          type='add'
          visible={showAdd}
          onCancel={this.hideAdd}
          onOk={this.carOk}
        />
        <Order
          dispatch={dispatch}
          visible={showOrder}
          data={orderList}
          plate={clientInfo.plate}
          onOk={this.orderOk}
        />
      </div>
    )
  }
}

SearchMember.propTypes = {
  onChange: PropTypes.func,
}

export default SearchMember
