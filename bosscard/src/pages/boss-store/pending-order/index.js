import React, { Component } from 'react'
import { connect } from 'dva'
import { Input, Icon, Row, Col, Button, Modal, message, Popover, Empty } from 'antd'
import moment from 'moment'
import styles from './styles.less'
import services from '../../../services'
import PrintStatement from '../mimeograph/receipts/billingPay'
import PrintCityOrder from '../mimeograph/receipts/billingCityOrder'
import PrintCarInspection from '../mimeograph/receipts/billingCarInspection'
import ServiceLimitationLayer from 'components/ServiceLimitationLayer'
import ku from './img/ku.png'
import wu from './img/wu.png'
import { __PROJECT_TYPE__, __PRODUCT_TYPE__ } from 'utils/globalConfig'
import collectData from 'utils/collectData'

class PendingOrder extends Component {
  constructor(props) {
    super(props)
    this.layout = React.createRef()
  }
  state = {
    showAdd: false,
    type: '',
    visible: false,
    orderId: 0,
    orderDetailList: {},
    page: 1,
    searchVal: '',
    bottomPrompt: false, // 到底了提示
    printShow: false,
    data: null, //打印数据
    orderType: null, //订单类型 4快捷 ，3 维修
    cityOrder: null, // 36打印数据
    showityOrder: false, // 36是否打印
    carInspection: null, // 车检打印数据
    showCarInspection: false, // 车检是否打印
  };
  componentDidMount() {
    this.getData()
    // 如果是反结页面跳过来的，触发修改订单事件
    const orderId = this.props.location.query.orderId
    const orderType = this.props.location.query.orderType
    if (orderId && orderType) {
      this.updateOrder(orderId, orderType)
    }
  }
  hideModal() {
    this.setState({
      showAdd: false,
    })
  }
  /**
   * 获取数据
   */
  getData = () => {
    const { dispatch, totalPage } = this.props
    dispatch({
      type: 'pendingOrder/getData',
      payload: { val: this.state.searchVal, page: this.state.page },
    }).then(() => {
      if (totalPage === this.state.page) {
        this.setState({ bottomPrompt: true }) // 到底了提示
        setTimeout(() => {
          this.setState({ bottomPrompt: false }) // 到底了提示
        }, 2000)
      }
    })
  };
  /**
   * 滚动加载
   */
  scrollFn = e => {
    const { totalPage } = this.props
    let l = this.layout.current.offsetHeight - 600
    if (e.target.scrollTop === l && this.state.page < totalPage) {
      let page = this.state.page
      page = page + 1
      this.setState({ page }, () => {
        this.getData()
      })
    }
  };
  /**
   * 搜索订单
   */
  changeSearch = e => {
    this.setState({ searchVal: e.target.value }, () => {
      this.getData()
    })
  };
  // 删除提交
  handleOk = () => {
    services
      .DELETE({ keys: { name: 'maintain/cancelOrder', id: this.state.orderId }, data: {} })
      .then(res => {
        if (res.code === '0') {
          message.success('订单已作废!')
          this.getData()
        } else {
          message.info('网络出现错误')
        }
      })
    this.setState({ visible: false })
  };
  handleCancel = () => {
    this.setState({ visible: false })
  };
  /**
   * 删除订单
   */
  del = orderId => {
    this.setState({ visible: true, orderId })
  };
  /**获取订单详情 */
  getOrderDetail = orderId => {
    services.DETAIL({ keys: { name: 'maintain/order', id: orderId } }).then(res => {
      this.setState({ orderDetailList: res.data })
    })
  };
  /**显示隐藏详情 */
  onVisibleChange = (v, visible) => {
    if (visible) {
      this.getOrderDetail(v.orderId)
    } else {
      this.setState({ orderDetailList: {} })
    }
  };
  //结算订单
  Topay = (orderId, orderType) => {
    collectData('order')
    const { dispatch, hasAccountPermission } = this.props
    if (!hasAccountPermission) {
      message.error('您没有结账权限，请联系管理人员设置权限!')
      return
    }
    if (orderType === 4) {
      //快捷
      services.LIST({ keys: { name: `quick/order/${orderId}/edit` } }).then(async res => {
        if (res.success) {
          const { data } = res
          await dispatch({
            type: 'speedyBilling/setAccount',
            payload: {
              clientInfo: data.clientInfo,
            },
          })
          await dispatch({
            type: 'speedyBilling/setOrderInfo',
            payload: data.orderInfo,
          })
          await dispatch({
            type: 'speedyBilling/changeStatus',
            payload: { key: 'isPay', value: true },
          })
          await dispatch({
            type: 'speedyBilling/changeStatus',
            payload: { key: 'isFromOrder', value: true },
          })
          this.props.history.push('/boss-store/speedy-billing')
        } else {
          message.error('订单异常!')
        }
      })
    } else {
      services.LIST({ keys: { name: `maintain/order/${orderId}/edit` } }).then(async res => {
        if (res.success) {
          const { data } = res
          await dispatch({
            type: 'maintainBilling/setAccount',
            payload: {
              clientInfo: data.clientInfo,
            },
          })
          await dispatch({
            type: 'maintainBilling/setOrderInfo',
            payload: data.orderInfo,
          })
          await dispatch({
            type: 'maintainBilling/changeStatus',
            payload: { key: 'isPay', value: true },
          })
          await dispatch({
            type: 'maintainBilling/changeStatus',
            payload: { key: 'isFromOrder', value: true },
          })
          this.props.history.push('/boss-store/maintain-billing')
        } else {
          message.error('订单异常!')
        }
      })
    }
  };
  // 修改订单
  updateOrder = (id, orderType) => {
    collectData('order')
    const { dispatch } = this.props
    if (orderType === 4) {
      //快捷
      services.LIST({ keys: { name: `quick/order/${id}/edit` } }).then(async res => {
        if (res.success) {
          const { data } = res
          await dispatch({
            type: 'speedyBilling/setOrderInfo',
            payload: data.orderInfo,
          })
          await dispatch({
            type: 'speedyBilling/setAccount',
            payload: {
              clientInfo: data.clientInfo,
            },
          })
          await dispatch({
            type: 'speedyBilling/setParkInfo',
            payload: {
              ...data.parkInfo,
              prevMileage: data.clientInfo.prevMileage,
              baguetteTime: data.parkInfo.baguetteTime
                ? moment(data.parkInfo.baguetteTime * 1000)
                : undefined,
            },
          })
          await dispatch({
            type: 'speedyBilling/setCheckCar',
            payload: {
              ...data.checkCar,
              fileList: data.checkCar.fileList
                ? data.checkCar.fileList.map(item => ({
                    uid: item.id,
                    imgId: item.id,
                    url: item.requestAddress,
                  }))
                : [],
            },
          })
          await dispatch({
            type: 'speedyBilling/setChecks',
            payload: data.checkCar.checks || [],
          })
          await dispatch({
            type: 'speedyBilling/setProjectInfo',
            payload: data.projectInfo.map(item => {
              if (item.cardType === 2 || item.cardType === 3) {
                //卡内
                return {
                  ...item,
                  soleId: item.rangeId,
                  detailId: item.rangeId, //卡内id
                  type: __PROJECT_TYPE__,
                }
              } else {
                return {
                  ...item,
                  soleId: item.id,
                  type: __PROJECT_TYPE__,
                }
              }
            }),
          })
          await dispatch({
            type: 'speedyBilling/setProductInfo',
            payload: data.productInfo.map(item => {
              if (item.cardType === 2 || item.cardType === 3) {
                //卡内
                return {
                  ...item,
                  soleId: item.rangeId,
                  detailId: item.rangeId, //卡内id
                  type: __PRODUCT_TYPE__,
                }
              } else {
                return {
                  ...item,
                  soleId: item.id,
                  type: __PRODUCT_TYPE__,
                }
              }
            }),
          })
          let total = {
            key: -1,
            pName: '总计',
            discount: '',
            unitPrice: '',
            numTem: 0,
            balidityPeriod: 0,
          }
          data.give = data.give.map((item, i) => {
            total.numTem = total.numTem + Number(item.numTem)
            total.balidityPeriod = total.balidityPeriod + Number(item.balidityPeriod)
            return {
              ...item,
              key: i + 1,
              projectName: item.pName,
              productName: item.pName,
              deadlineTime: moment(item.deadlineTime * 1000),
              deadlineStatus: item.deadlineTime * 1 === -1 ? 0 : 1,
            }
          })
          total.balidityPeriod = total.balidityPeriod.toFixed(2)
          const giveInfo = [...data.give, total]
          dispatch({
            type: 'speedyBilling/setGiveInfo',
            payload: giveInfo,
          })
          await dispatch({
            type: 'speedyBilling/changeStatus',
            payload: { key: 'isFromOrder', value: true },
          })
          this.props.history.push('/boss-store/speedy-billing')
        } else {
          message.error('订单错误')
        }
      })
    } else {
      services.LIST({ keys: { name: `maintain/order/${id}/edit` } }).then(async res => {
        if (res.success) {
          const { data } = res
          await dispatch({
            type: 'maintainBilling/setOrderInfo',
            payload: data.orderInfo,
          })
          await dispatch({
            type: 'maintainBilling/setAccount',
            payload: {
              clientInfo: data.clientInfo,
            },
          })
          await dispatch({
            type: 'maintainBilling/setParkInfo',
            payload: {
              ...data.parkInfo,
              prevMileage: data.clientInfo.prevMileage,
              baguetteTime: data.parkInfo.baguetteTime
                ? moment(data.parkInfo.baguetteTime * 1000)
                : undefined,
              carTime: data.parkInfo.carTime ? moment(data.parkInfo.carTime * 1000) : undefined,
              insurance: data.parkInfo.insurance
                ? moment(data.parkInfo.insurance * 1000)
                : undefined,
              carInsurance: data.parkInfo.carInsurance
                ? moment(data.parkInfo.carInsurance * 1000)
                : undefined,
            },
          })
          await dispatch({
            type: 'maintainBilling/setCheckCar',
            payload: {
              ...data.checkCar,
              fileList: data.checkCar.fileList
                ? data.checkCar.fileList.map(item => ({
                    uid: item.id,
                    imgId: item.id,
                    url: item.requestAddress,
                  }))
                : [],
            },
          })
          await dispatch({
            type: 'maintainBilling/setChecks',
            payload: data.checkCar.checks || [],
          })
          await dispatch({
            type: 'maintainBilling/setProjectInfo',
            payload: data.projectInfo.map(item => {
              if (item.cardType === 2 || item.cardType === 3) {
                //卡内
                console.log('1111111111111卡内', item)
                return {
                  ...item,
                  soleId: item.rangeId,
                  type: __PROJECT_TYPE__,
                  detailId: item.rangeId, //卡内id
                }
              } else {
                return {
                  ...item,
                  soleId: item.id,
                  type: __PROJECT_TYPE__,
                }
              }
            }),
          })
          await dispatch({
            type: 'maintainBilling/setProductInfo',
            payload: data.productInfo.map(item => {
              if (item.cardType === 2 || item.cardType === 3) {
                //卡内
                return {
                  ...item,
                  soleId: item.rangeId,
                  type: __PRODUCT_TYPE__,
                  detailId: item.rangeId, //卡内id
                }
              } else {
                return {
                  ...item,
                  soleId: item.id,
                  type: __PRODUCT_TYPE__,
                }
              }
            }),
          })
          let total = {
            key: -1,
            pName: '总计',
            discount: '',
            unitPrice: '',
            numTem: 0,
            balidityPeriod: 0,
          }
          data.give = data.give.map((item, i) => {
            total.numTem = total.numTem + Number(item.numTem)
            total.balidityPeriod = total.balidityPeriod + Number(item.balidityPeriod)
            return {
              ...item,
              key: i + 1,
              projectName: item.pName,
              productName: item.pName,
              deadlineTime: moment(item.deadlineTime * 1000),
              deadlineStatus: item.deadlineTime * 1 === -1 ? 0 : 1,
            }
          })
          total.balidityPeriod = total.balidityPeriod.toFixed(2)
          const giveInfo = [...data.give, total]
          dispatch({
            type: 'maintainBilling/setGiveInfo',
            payload: giveInfo,
          })
          await dispatch({
            type: 'maintainBilling/changeStatus',
            payload: { key: 'isFromOrder', value: true },
          })
          this.props.history.push('/boss-store/maintain-billing')
        }
      })
    }
  };
  //
  onPrint = (e, v) => {
    if (e === 1) {
      this.printPayOrder(v.orderId, v.orderType)
    } else if (e === 2) {
      this.printCarInspection(v.orderId, v.orderType)
    } else if (e === 3) {
      this.printCityOrder(v.orderId, v.orderType)
    }
  };

  // 打印常规车检单
  printCarInspection = (id, orderType) => {
    services.DETAIL({ keys: { name: 'printing/operation/routine-inspection', id } }).then(res => {
      res.success
        ? this.setState({
            carInspection: {
              ...res.data,
              storeName: JSON.parse(window.localStorage.getItem('loginInfo')).storeName,
            },
            orderType: orderType,
            showCarInspection: !this.state.showCarInspection,
          })
        : message.info('网络出现错误')
    })
  };

  // 打印36
  printCityOrder = (id, orderType) => {
    services.DETAIL({ keys: { name: 'printing/operation/security-check', id } }).then(res => {
      res.success
        ? this.setState({
            cityOrder: {
              ...res.data,
              storeName: JSON.parse(window.localStorage.getItem('loginInfo')).storeName,
            },
            orderType: orderType,
            showityOrder: !this.state.showityOrder,
          })
        : message.info('网络出现错误')
    })
  };

  // 打印快捷结算单
  printPayOrder = (id, orderType) => {
    const { printShow } = this.state
    if (orderType * 1 === 4) {
      services
        .printingOperationQuick({ keys: { name: 'printing/operation/order/quick/', id } })
        .then(res => {
          res.success
            ? this.setState({
                data: res.list,
                orderType: orderType,
                printShow: !printShow,
              })
            : message.info('网络出现错误')
        })
    } else {
      services
        .printingOperationMaintain({ keys: { name: 'printing/operation/order/statements/', id } })
        .then(res => {
          res.success
            ? this.setState({
                data: res.list,
                orderType: orderType,
                printShow: !printShow,
              })
            : message.info('网络出现错误')
        })
    }
  };

  render() {
    const { orderData } = this.props
    const {
      orderDetailList,
      bottomPrompt,
      printShow,
      orderType,
      data,
      cityOrder,
      showityOrder,
      showCarInspection,
      carInspection,
    } = this.state
    const content = (
      <div className={styles.detailP}>
        <div>
          <h3>项目</h3>
          {orderDetailList.project &&
            orderDetailList.project.map((v, index) => (
              <p key={index}>
                {v.projectName} <span>{v.discount} 折</span>
              </p>
            ))}
        </div>
        <div>
          <h3>产品</h3>
          {orderDetailList.product &&
            orderDetailList.product.map((v, index) => (
              <p key={index}>
                {v.productName} <span>{v.discount} 折</span>{' '}
                <span style={{ marginRight: '10px' }}>{v.orderId}</span>
              </p>
            ))}
        </div>
        {/* <div>
          <h3>项目（附加）</h3>
          {orderDetailList.attachProject && orderDetailList.attachProject.map((v, index) => <p key={index}>{v.projectName} <span>{v.discount} 折</span></p>)}
        </div> */}
      </div>
    )
    return (
      <div className={styles['pending-order-wrap']}>
        <ServiceLimitationLayer>
          <div className={styles['pending-order-seach']}>
            <Input
              size="large"
              placeholder="车牌号/车型/会员名/手机号"
              className="pendingSearch"
              onChange={this.changeSearch}
              prefix={<i className="iconfont icon-chazhao" />}
            />
          </div>
          <div className={styles['pending-order']} onScroll={this.scrollFn}>
            <div ref={this.layout} className={styles['pending-order-scroll']}>
              <Row gutter={35}>
                {orderData &&
                  orderData.map((v, index) => {
                    return (
                      <Col className="gutter-row" span={6} key={index}>
                        <div className={styles['pending-order-box']}>
                          <div className={styles.leftUp}>
                            {v.orderType === 3 ? <img alt="" src={wu}></img> : ''}
                            {v.orderType === 4 ? <img alt="" src={ku}></img> : ''}
                          </div>
                          {v.updated ? <h3>{v.updated}</h3> : ''}
                          {v.updated ? '' : <h3>{v.created}</h3>}
                          <Icon
                            type="close"
                            className={styles.clone}
                            onClick={this.del.bind(this, v.orderId)}
                          />
                          <Popover
                            content={content}
                            title="包含服务"
                            onVisibleChange={this.onVisibleChange.bind(this, v)}
                            placement="rightTop"
                          >
                            <div>
                              <div className={styles.pw}>
                                {v.state === 1 && v.orderType !== 4 ? (
                                  <span style={{ color: '#F65328FF' }}>未出库</span>
                                ) : (
                                  ''
                                )}
                                {v.state === 2 && v.orderType !== 4 ? (
                                  <span style={{ color: '#F65328FF' }}>部分出库</span>
                                ) : (
                                  ''
                                )}
                                {v.state === 3 && v.orderType !== 4 ? (
                                  <span style={{ color: '#43AE62FF' }}>已出库</span>
                                ) : (
                                  ''
                                )}
                              </div>
                              <div className={styles['box-cont']}>
                                <div className={styles['cont']}>
                                  <div className={styles.img}>
                                    {v.carIcon ? (
                                      <img alt="" src={v.carIcon.requestAddress}></img>
                                    ) : (
                                      ''
                                    )}
                                  </div>
                                  <div className={styles.name}>
                                    <p>
                                      {v.carNum} <span>({v.carType})</span>
                                    </p>
                                    <span>
                                      {!v.clientName || v.clientName === '0'
                                        ? '散客'
                                        : v.clientName}{' '}
                                      {v.phone ? v.phone : ''}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Popover>
                          <div className={styles.buttonbox}>
                            <Popover
                              placement="bottom"
                              content={
                                <div className={styles.print_cont}>
                                  <div key={1} onClick={this.onPrint.bind(this, 1, v)}>
                                    订单
                                  </div>
                                  <div key={2} onClick={this.onPrint.bind(this, 2, v)}>
                                    常规车检报告
                                  </div>
                                  <div key={3} onClick={this.onPrint.bind(this, 3, v)}>
                                    36项检查报告
                                  </div>
                                </div>
                              }
                              trigger="click"
                            >
                              <Button size="large" className={styles.btn_print}>
                                打印 <Icon type="down" />
                              </Button>
                            </Popover>
                            <Button
                              size="large"
                              className={styles.btns}
                              onClick={this.updateOrder.bind(this, v.orderId, v.orderType)}
                            >
                              修改订单
                            </Button>
                            {((v.state !== 1 && v.state !== 2) || v.orderType === 4) &&
                            v.staffState ? (
                              <Button
                                size="large"
                                className={styles.btns}
                                type="primary"
                                onClick={this.Topay.bind(this, v.orderId, v.orderType)}
                              >
                                结账
                              </Button>
                            ) : (
                              ''
                            )}
                          </div>
                        </div>
                      </Col>
                    )
                  })}
              </Row>
              {orderData.length === 0 ? <Empty style={{ marginTop: '200px' }} /> : ''}
              {bottomPrompt ? (
                <div className={styles.bottomPrompt}>
                  {orderData.length === 0 ? '' : '到底了！'}
                </div>
              ) : (
                ''
              )}
            </div>
          </div>
          <Modal
            className="pending-order-modal"
            title="确定删除"
            width="570px"
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
          >
            <div
              style={{
                textAlign: 'center',
                padding: '20px 0',
                color: '#666666FF',
                fontSize: '18px',
              }}
            >
              确定删除该订单？
            </div>
          </Modal>

          {//打印单
          !printShow || (
            <div className={styles.zl_MastL}>
              {orderType === 4 ? (
                <PrintStatement reload={true} scale={0.5} type={1} data={data} />
              ) : (
                <PrintStatement reload={true} scale={0.5} type={0} data={data} />
              )}
            </div>
          )}
          {//打印36
          !showityOrder || (
            <div className={styles.zl_MastL}>
              {orderType === 4 ? (
                <PrintCityOrder reload={true} scale={0.5} type={1} data={cityOrder} />
              ) : (
                <PrintCityOrder reload={true} scale={0.5} type={0} data={cityOrder} />
              )}
            </div>
          )}
          {//打印车检
          !showCarInspection || (
            <div className={styles.zl_MastL}>
              {orderType === 4 ? (
                <PrintCarInspection reload={true} scale={0.5} type={1} data={carInspection} />
              ) : (
                <PrintCarInspection reload={true} scale={0.5} type={0} data={carInspection} />
              )}
            </div>
          )}
        </ServiceLimitationLayer>
      </div>
    )
  }
}
function mapStateToProps(state) {
  const { orderData, totalPage } = state.pendingOrder
  const { hasAccountPermission } = state.app
  return { orderData, totalPage, hasAccountPermission }
}
export default connect(mapStateToProps)(PendingOrder)
