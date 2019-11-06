import React, { Component } from "react"
import { connect } from "dva"
import { message, notification } from "antd"
import styles from "./styles.less"
import moment from "moment"
import BS from './components/Bshow' // b单编辑组件
import CommonTable from "components/CommonTable/index"
import RepayModal from "./components/repayment/index"
import PrintStatement from '../mimeograph/receipts/billingPay'
import { data } from "./detail/data"
import tableConfig from './orderAllTableConfig'
import services from "services"
import Klist from "./detail/Klist" // 快捷单详情
import { __PROJECT_TYPE__, __PRODUCT_TYPE__ } from "utils/globalConfig"
import router from "umi/router"
import request from '../../../utils/request'

const matchContent = (type) => {
  let content = ''
  switch (type) {
    case 1:
      content = '已按【时间】和【业务类型】筛选订单。如需查看全部订单，点击【重置】按钮'
      break 
    case 2:
      content = '已按【时间】和【项目】筛选订单。如需查看全部订单，点击【重置】按钮'
      break
    case 3:
      content = '已按【时间】和【产品】筛选订单。如需查看全部订单，点击【重置】按钮'
      break
    default:
      break
  }
  return content
}

class Index extends Component {
  constructor() {
    super()
    this.state = {
      detailShow: false,
      detailList: null,
      isK: null,
      selectList: data,
      loading: false,
      currentPage: 1,
      formObj: {},
      payList: [], //结算方式
      data: null, //打印数据
      printShow: false, // 是否显示打印单
      orderType: null, //订单类型 4快捷 ，3 维修
      updateOrderBShow: false, // 是否显示B单编辑
      copyorderId: null, // 给编辑B单组件用的orderId
      copyorderType: null, // 给编辑B单组件用的orderType
      copyBid: null, // 给编辑B单组件用的Bid
      tableConfig,
      visible: false, // 是否显示还款弹窗
      repayOrderId: 0, //还款订单id
      repayClientId: 0, //还款客户id
    }
  }

  //控制显示隐藏
  notShow = (a) => {
    a==='loading'?this.setState({
      detailShow: false,
      loading: false,
    },()=>{
      this.setState({loading: true})
    }):this.setState({detailShow: false})
  }
  eventKeyUp=(e)=>{
    const { printShow } = this.state
    if(!printShow) return
    e.key === 'Escape' || e.key === 'Enter' ? this.setState({ printShow:false }) : null
  }
  componentWillUnmount(){
    notification.destroy()
    document.removeEventListener('keydown',this.eventKeyUp)
    tableConfig.screen.rules[2].defaultValue = undefined
    tableConfig.screen.query = {'state|deleted': [4,1]}
    tableConfig.screen.rules[8].defaultValue = undefined
  }
  componentWillReceiveProps(nextprops){
    const { dispatch } = this.props
     if(this.props.totalSize!==nextprops.totalSize){
      dispatch({
        type:'maintianList/customizeNumber',
        payload:{
          count:nextprops.totalSize,
          type:'getPersonListTotal',
          index:0,
        },
     })
     }
  }

  componentDidMount() {
    const clientCarId = this.props.location.query.clientCarId
    if(clientCarId){
      tableConfig.screen.query.clientCarId = clientCarId
    }
    const { fromIndex, created, type, id, propertyName, completed } = this.props.location.query
    if(fromIndex) {
      tableConfig.screen.query = {
        'completed[<>]': created,
      }
    }
    if(type) {
      notification.open({
        message: '订单已筛选',
        duration: null,
        style: {marginTop: 50},
        description: matchContent(type*1),
        className: styles.notifi,
      })
      tableConfig.screen.query = {
        ...tableConfig.screen.query,
        [propertyName]: id,
        'completed[<>]': completed,
      }
    }
    if (this.props.location.query.date) {
      const date = this.props.location.query.date
      const isTotal = this.props.location.query.isTotal
      const id = this.props.location.query.id
      tableConfig.screen.rules[8].defaultValue =  isTotal ? [moment(date).startOf('month'), moment(date).endOf("month")] : [moment(date).startOf('day'), moment(date).endOf("day")]
      id === 'receipts' ? tableConfig.screen.query = {'actuallyPaid[>]':0} : tableConfig.screen.rules[2].defaultValue = id
      this.setState({ tableConfig,loading:false }, () => this.setState({ loading: true }))
    } else {
      this.setState({ loading: false },()=>{
        this.setState({loading:true})
      })
    }
    const { goDetail } = this.props
    console.log('goDetail',goDetail)
    const { orderId, orderType } = goDetail
    document.addEventListener('keydown',this.eventKeyUp)
    if (orderId) {
      this.setState({
        detailShow: !this.state.detailShow,
        detailList: { ...goDetail },
        isK: orderType,
      })
    }
    // 获取头部筛选支付方式数据
    services
      .LIST({
        keys: { name: "store/clientcard/paytype" },
        data: { q: { where: { type: "1" } } },
      })
      .then((res) => {
        if (res.success) {
          let payList = res.data.map((v) => {
            return {
              name: v.name,
              value: v.value,
            }
          })
          payList.unshift({ name: "全部", value: -999 })
          this.setState({
            payList,
          })
        }
      })
    // 施工人员
    this.getStaffs()
  }
  getStaffs = async () => {
    const res = await request({ url: 'store/staff/list' })
    if (res.code === '0') {
      const newTableConfig = {...tableConfig}
      newTableConfig.screen.rules[7].list = res.list.map((_) => ({
        name: _.staffName,
        value: _.staffId,
      }))
      this.setState({ tableConfig: newTableConfig })
    }
  }
  detailShow = (val) => {
    this.setState({
      detailShow: !this.state.detailShow,
      detailList: val,
      isK: val.orderType,
    })
  }
  //改变分页
  changePage = (currentPage, o = this.state.formObj) => {
    const { dispatch } = this.props
    this.setState(
      {
        currentPage,
      },
      () => {
        dispatch({
          type: "maintianList/getData",
          payload: { q: { where: { 'state|deleted': [4,1], ...o }, page: currentPage } },
        })
      }
    )
  }
  //提交表单
  commitForm = (o) => {
    const { dispatch } = this.props
    dispatch({
      type: "maintianList/getData",
      payload: { q: { where: { 'state|deleted': [4,1], ...o } } },
    })
    this.setState({
      currentPage: 1,
      formObj: o,
    })
  }
  goDetail = (orderId, orderType) => {
    const { dispatch, history, match } = this.props
    dispatch({
      type: "maintianList/goDetail",
      payload: { orderId, orderType, path: match.path, goClient: true,isHideDetailBtns: true, },
    })
    history.push("/boss-store/maintain-list/orderAll")
  }

  // 修改订单
  updateOrder = (id, orderType) => {
    const { dispatch } = this.props
    if (orderType === 4) {
      //快捷
      services
        .LIST({ keys: { name: `quick/order/${id}/edit` } })
        .then(async (res) => {
          if (res.success) {
            const { data } = res
            await dispatch({
              type: "speedyBilling/setOrderInfo",
              payload: data.orderInfo,
            })
            await dispatch({
              type: "speedyBilling/setAccount",
              payload: {
                clientInfo: data.clientInfo,
              },
            })
            await dispatch({
              type: "speedyBilling/setParkInfo",
              payload: {
                ...data.parkInfo,
                prevMileage: data.clientInfo.prevMileage,
                baguetteTime: data.parkInfo.baguetteTime
                  ? moment(data.parkInfo.baguetteTime * 1000)
                  : undefined,
              },
            })
            await dispatch({
              type: "speedyBilling/setCheckCar",
              payload: {
                ...data.checkCar,
                fileList: data.checkCar.fileList
                  ? data.checkCar.fileList.map((item) => ({
                    uid: item.id,
                    imgId: item.id,
                    url: item.requestAddress,
                  }))
                  : [],
              },
            })
            await dispatch({
              type: "speedyBilling/setChecks",
              payload: data.checkCar.checks || [],
            })
            await dispatch({
              type: "speedyBilling/setProjectInfo",
              payload: data.projectInfo.map((item) => {
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
                    type: __PROJECT_TYPE__ ,
                  }
                }
              }),
            })
            await dispatch({
              type: "speedyBilling/setProductInfo",
              payload: data.productInfo.map((item) => {
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
              pName: "总计",
              discount: "",
              unitPrice: "",
              numTem: 0,
              balidityPeriod: 0,
            }
            data.give = data.give.map((item,i) => {
              total.numTem = total.numTem + Number(item.numTem)
              total.balidityPeriod =
                total.balidityPeriod + Number(item.balidityPeriod)
              return {
                ...item,
                key: i+1,
                projectName: item.pName,
                productName: item.pName,
                deadlineTime: moment(item.deadlineTime * 1000),
                deadlineStatus: item.deadlineTime*1 === -1 ? 0 : 1,
              }
            })
            total.balidityPeriod = total.balidityPeriod.toFixed(2)
            const giveInfo = [...data.give, total]
            dispatch({
              type: "speedyBilling/setGiveInfo",
              payload: giveInfo,
            })
            await dispatch({
              type: "speedyBilling/changeStatus",
              payload: { key: "isFromOrder", value: true },
            })
            this.props.history.push("/boss-store/speedy-billing")
          } else {
            message.error("订单错误")
          }
        })
    } else {
      services
        .LIST({ keys: { name: `maintain/order/${id}/edit` } })
        .then(async (res) => {
          if (res.success) {
            const { data } = res
            await dispatch({
              type: "maintainBilling/setOrderInfo",
              payload: data.orderInfo,
            })
            await dispatch({
              type: "maintainBilling/setAccount",
              payload: {
                clientInfo: data.clientInfo,
              },
            })
            await dispatch({
              type: "maintainBilling/setParkInfo",
              payload: {
                ...data.parkInfo,
                prevMileage: data.clientInfo.prevMileage,
                baguetteTime: data.parkInfo.baguetteTime
                  ? moment(data.parkInfo.baguetteTime * 1000)
                  : undefined,
                carTime: data.parkInfo.carTime
                  ? moment(data.parkInfo.carTime * 1000)
                  : undefined,
                insurance: data.parkInfo.insurance
                  ? moment(data.parkInfo.insurance * 1000)
                  : undefined,
                carInsurance: data.parkInfo.carInsurance
                  ? moment(data.parkInfo.carInsurance * 1000)
                  : undefined,
              },
            })
            await dispatch({
              type: "maintainBilling/setCheckCar",
              payload: {
                ...data.checkCar,
                fileList: data.checkCar.fileList
                  ? data.checkCar.fileList.map((item) => ({
                    uid: item.id,
                    imgId: item.id,
                    url: item.requestAddress,
                  }))
                  : [],
              },
            })
            await dispatch({
              type: "maintainBilling/setChecks",
              payload: data.checkCar.checks || [],
            })
            await dispatch({
              type: "maintainBilling/setProjectInfo",
              payload: data.projectInfo.map(item => {
                if (item.cardType === 2 || item.cardType === 3) {
                  //卡内
                  console.log("1111111111111卡内", item)
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
              type: "maintainBilling/setProductInfo",
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
              pName: "总计",
              discount: "",
              unitPrice: "",
              numTem: 0,
              balidityPeriod: 0,
            }
            data.give = data.give.map((item,i) => {
              total.numTem = total.numTem + Number(item.numTem)
              total.balidityPeriod =
                total.balidityPeriod + Number(item.balidityPeriod)
              return {
                ...item,
                key: i+1,
                projectName: item.pName,
                productName: item.pName,
                deadlineTime: moment(item.deadlineTime * 1000),
                deadlineStatus: item.deadlineTime*1 === -1 ? 0 : 1,
              }
            })
            total.balidityPeriod = total.balidityPeriod.toFixed(2)
            const giveInfo = [...data.give, total]
            dispatch({
              type: "maintainBilling/setGiveInfo",
              payload: giveInfo,
            })
            await dispatch({
              type: "maintainBilling/changeStatus",
              payload: { key: "isFromOrder", value: true },
            })
            this.props.history.push("/boss-store/maintain-billing")
          }
        })
    }
  }
  // 打印快捷结算单
  printPayOrder = (id,orderType) => {
    const { printShow  } = this.state
    if(orderType*1 === 4){
      services.printingOperationQuick({ keys:{ name:'printing/operation/order/quick/',id } })
      .then(res=>{
        res.success ? this.setState({
          data:res.list,
          orderType: orderType,
          printShow:!printShow
        }) :message.info('网络出现错误')
      })
    }else{
      services.printingOperationMaintain({ keys:{ name:'printing/operation/order/statements/',id } })
      .then(res=>{
        res.success ? this.setState({
          data:res.list,
          orderType:orderType,
          printShow:!printShow
      }) :message.info('网络出现错误')
      })
    }
  }
  getData = (boolean) => {

    let o = {}
    const { dispatch } = this.props
    const { formObj } = this.state
    boolean ? null : (o = formObj)
    // console.log(o)
    this.setState(
      {
        currentPage: 1,
        formObj: o,
        loading: false,
      },
      () => {
        this.setState({
          loading: true,
          detailShow: false, // 不显示详情
        })
        // boolean === 'buying' ?
        // // 已挂账
        // dispatch({
        //   type: "maintianList/getData",
        //   payload: { q: { where: { "arrears[!]": 0 } } },
        // })
        // :(
        //   boolean === 'doing' ?
        //     // 已完成
        //   dispatch({
        //     type: "maintianList/getData",
        //     payload: { q: { where: { state: 4, arrears: 0 } } },
        //   })
        //   : null
        // )
        dispatch({
          type: "maintianList/getData",
          payload: { q: { where: { 'state|deleted': [4,1] } } },
        })
      }
    )
  }
  //生成B单
  produceBlist = (orderId,orderType,type) => {
    console.log('生成b单',orderId,orderType,type)
    // 已挂账
    if(type === 1){
      services
      .produceBlist({ keys: { name: "store/vice/order" }, data: { orderId } })
      .then((res) => {
        if(res.success){
          this.getData()
          message.success("成功生成B单")
        }
      })
    }else if(type === 2){
      // 已完成
      services
      .produceBlist({ keys: { name: "store/vice/order" }, data: { orderId } })
      .then((res) => {
        if(res.success){
          this.getData()
          //成功生成B单，跳转到B单编辑页面
          // console.log(orderId,orderType,res.id,'444444444444')
          this.updateOrderB(orderId,orderType,res.id)
        }
      })
    }else if(type === undefined){
      // 其他页面跳到详情页面然后点击生成b单，此时订单状态未知，默认与已挂账状态一致
      services
      .produceBlist({ keys: { name: "store/vice/order" }, data: { orderId } })
      .then((res) => {
        if(res.success){
          this.getData()
          message.success("成功生成B单")
        }
      })
    }
  }
   // 编辑B单组件传递事件
   updateOrderB=(id,orderType,Bid)=>{
    const { updateOrderBShow } = this.state
    this.setState({
      updateOrderBShow:!updateOrderBShow,
      copyorderId: id,
      copyorderType: orderType,
      copyBid: Bid,
    })
  }
  select=(value)=>{
    const { dispatch } = this.props
    if(value*1===0){
      this.setState({
        loading:false,
      },()=>{
        this.setState({
          loading: true
        })
        services.maintainList({ keys: { name: "maintain/order" }, data: { q: { where:{'state': 4,'|deleted':1} } } }).then(res=>{
          console.log(res,'---')
        })
      })
    }else if(value*1===1){
      this.setState({
        loading:false,
      },()=>{
        this.setState({
          loading: true
        })
        dispatch({
          type: "maintianList/getData",
          payload: { q: { where: { state: 4, arrears: 0 } } },
        })
      })
    }else if(value*1===2){
      this.setState({
        loading:false,
      },()=>{
        this.setState({
          loading: true
        })
        dispatch({
          type: "maintianList/getData",
          payload: { q: { where: { "arrears[!]": 0 } } },
        })
      })
    }else if(value*1===3){
      this.setState({
        loading:false,
      },()=>{
        this.setState({
          loading: true
        })
        dispatch({
          type: "maintianList/getData",
          payload: { q: { where: { deleted: 0 } } },
        })
      })
    }
  }
  /**还款调用事件
   * @param {Number} repayOrderId 订单id
   * @param {Number} repayClientId 客户id
   */
  toRepay = (repayOrderId, repayClientId) => {
    console.log(repayOrderId, repayClientId)
    this.setState({
      repayOrderId,
      repayClientId,
      visible: true,
    })
  }

  onReSet = () => {
    tableConfig.screen.rules[2].defaultValue = undefined
    tableConfig.screen.rules[8].defaultValue = undefined
    tableConfig.screen.query = {'state|deleted': [4,1]}
    notification.destroy()
    return {
      'state|deleted': [4,1],
    }
  }

  render() {
    const {
      currentPage,
      detailShow,
      detailList,
      isK,
      loading,
      payList,
      data,
      orderType,
      printShow,
      updateOrderBShow, // 是否显示编辑B单组件
      copyorderId, // 给编辑B单组件用的orderId
      copyorderType, // 给编辑B单组件用的orderType
      copyBid, // 给编辑B单组件用的Bid
      tableConfig
    } = this.state
    // console.log('渲染次数')
    // const { dataList } = this.props

    tableConfig.screen.rules[2].list = [...payList]

    let len = tableConfig.headers.length

    tableConfig.headers[len-1].render = (
      (record) => (
        <div className={styles.wyc_list_btn}>
          <div className={styles.wyc_d_btn} onClick={this.detailShow.bind(this, record)}>订单详情</div>
          {
            //已作废的订单不显示打印入口
            record.type !==3 && <div className={styles.wyc_print_btn} onClick={this.printPayOrder.bind(this,record.orderId,record.orderType)}>打印</div>
          }
          {
            //已作废的和已挂账（欠款）订单不显示生成B单，已完成的订单生成b单后去b单编辑页面
            record.type ===2 && <div className={styles.wyc_B_btn} onClick={this.produceBlist.bind(this, record.orderId,record.orderType,record.type)}>生成B单</div>
          }
          {
            record.type ===1 && <div className={styles.wyc_pay_btn} onClick={() => this.toRepay(record.orderId, record.clientId)}>还款</div>
          }
        </div>
      )
    )
    return (
      <div className={styles.zl_tableBox}>
        <span className={styles.yc_right_top} onClick={()=>{router.push('/boss-store/pending-order')}}>查看进行中的订单</span>
        {
          loading &&
          <CommonTable
            name="maintain/order"
            refresh
            tableConfig={tableConfig}
            New
            onReSet={this.onReSet}
          />
        }
        {// 订单详情组件
          !detailShow ||
          (isK &&
            <Klist
              updateOrder={this.updateOrder}
              detailList={detailList}
              notShow={this.notShow}
              produceBlist={this.produceBlist} // 生成b单事件传递进去
            />
          )}
          {//打印单
            !printShow ||
            <div className={  styles.zl_MastL  } >
              { orderType === 4 ? <PrintStatement scale={0.5} type={1}  data={ data }  /> : <PrintStatement scale={0.5} type={0} data={data}  /> }
            </div>
          }
          {/* 编辑B单组件 */
            updateOrderBShow &&  <BS  Bid={copyBid}  orderType ={ copyorderType }   orderId={copyorderId}  updateOrderB={this.updateOrderB}  />
          }
          {//还款
            this.state.visible &&
            <RepayModal
            visible={this.state.visible}
            orderId={this.state.repayOrderId}
            clientId={this.state.repayClientId}
            onCancel={() => {
              const { dispatch } = this.props
              this.setState({visible: false})
              dispatch({type: 'table/getData', payload: {new: true}})
            }}
            ></RepayModal>
          }
      </div>
    )
  }
}
function mapStateToProps(state) {
  const { selectList, dataList, goDetail } = state.maintianList
  const { totalSize } = state.table
  return { selectList, dataList, goDetail ,  totalSize }
}

export default connect(mapStateToProps)(Index)
