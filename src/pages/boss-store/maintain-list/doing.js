import React, { Component } from "react"
import { connect } from "dva"
import { message, Tooltip } from "antd"
import styles from "./styles.less"
import moment from "moment"
import CommonTable from "components/CommonTable/index"
// import CommonMeun from "./components/commonMenu"
import Mast from "./components/popmast.js"
import Klist from "./detail/Klist"
import DetailList from "./detail/list.js"
import Blist from "./detail/Blist"
import BS from './components/Bshow'
import services from "services"
import { __PROJECT_TYPE__, __PRODUCT_TYPE__ } from "utils/globalConfig"
import router from 'umi/router'

class Doing extends Component {
  constructor() {
    super()
    this.state = {
      currentPage: 1,
      formObj: {},
      isK: null,
      isB: false,
      payList: [],
      orderId: null,
      loading: true,
      updateOrderBShow: false, // 是否显示B单编辑
      copyorderId: null, // 给编辑B单组件用的orderId
      copyorderType: null, // 给编辑B单组件用的orderType
      copyBid: null, // 给编辑B单组件用的Bid
    }
  }
  mastShow = (mastType, cancelId) => {
    this.setState({
      mastType,
      cancelId,
      mastShow: !this.state.mastShow,
    })
  }
  notShow = (boolean) => {
    this.setState({
      mastShow: false,
      detailShow: false,
      isB: false,
    },()=>{
      if(boolean){
        const { orderId , orderType ,Bid } = this.state
        router.push({
          pathname: '/boss-store/maintain-list/blist',
          query: {
            orderId,
            orderType,Bid,
          },
        })
      }
    })
  }
  detailShow = (val) => {
    console.log(val)
    this.setState({
      detailShow: !this.state.detailShow,
      detailList: val,
      isK: val.orderType,
    })
  }
  getDefaultData = (val) => {
    const { dispatch } = this.props
    let o = {}
    let v = val.split("=")
    o[v[0]] = v[1] * 1
    console.log(o,91212)
    dispatch({
      type: "maintianList/getData",
      payload: { q: { where: { state: 4, arrears: 0, ...o } } },
    })
  }
  componentWillUnmount(){
    const { location  ,dispatch } = this.props
    if(location.query.clientId){
       dispatch({
        type:'maintianList/customizeNumber',
        payload:{},
       })
    }
  }
  UNSAFE_componentWillMount() {
    const { location } = this.props
    location.search
      ? this.getDefaultData(location.search.slice(1))
      : this.getData()
    if(location.query.clientId){
      const { dispatch } = this.props
      services.maintainList({  data:{  q: { where: { state: 4, arrears: 0, ...location.query }  }}  }).then(res=>{
         if(res.code==='0'){
            const { totalSize } = res
            dispatch({
               type:'maintianList/customizeNumber',
               payload:{
                 count:totalSize,
                 type:'getPersonListTotal',
                 index:2,
               },
            })
         }
      })
    }
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
          payList.unshift({ name: "全部", value: -1 })
          this.setState({
            payList,
          })
        }
      })
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
        })
        dispatch({
          type: "maintianList/getData",
          payload: { q: { where: { state: 4, arrears: 0 } } },
        })
      }
    )
  }
  //查看B单详情
  BlistShow = (orderId,orderType,Bid) => {
    this.setState({
      orderId,
      isB: true,
      orderType,
      Bid,
    })
  }
  //生成B单
 productBlist = (orderId) => {
   var ID = orderId
  services
      .produceBlist({ keys: { name: "store/vice/order" }, data: { orderId } })
      .then((res) => {
        this.getData()
        // message.success("成功生成B单")

        //成功生成B单，跳转到B单编辑页面
        services.Blist({keys: { name: 'store/vice/order' }, data: { q: { where: {} } } }).then((res)=>{
          console.log(res,ID,'B单列表数据')
          const obj = res.list.find(v=>v.orderId===ID) || {}
          const orderId = obj.orderId
          const orderType = obj.type
          const Bid = obj.id
          this.updateOrderB(orderId,orderType,Bid)
        })

      })
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
  // 修改订单 已完成列表只有b单修改
  updateOrder = (id, orderType) => {
    services
      .LIST({ keys: { name: `store/vice/order/${id}/edit` } })
      .then(async (res) => {
        if (res.success) {
          const { dispatch } = this.props
          const { data } = res
          if (orderType === 3) {
            // 维修
            await dispatch({
              type: "maintainBilling/setOrderInfo",
              payload: {
                ...data.orderInfo,
                operate: 3,
              },
            })
            await dispatch({
              type: "maintainBilling/setAccount",
              payload: {
                clientInfo: data.clientInfo,
              },
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
                    type: __PROJECT_TYPE__ ,
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
            await dispatch({
              type: "maintainBilling/changeStatus",
              payload: { key: "isFromOrder", value: true },
            })
            this.props.history.push("/boss-store/maintain-billing")
          } else {
            // 快捷
            await dispatch({
              type: "speedyBilling/setOrderInfo",
              payload: {
                ...data.orderInfo,
                operate: 3,
              },
            })
            await dispatch({
              type: "speedyBilling/setAccount",
              payload: {
                clientInfo: data.clientInfo,
              },
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
            await dispatch({
              type: "speedyBilling/changeStatus",
              payload: { key: "isFromOrder", value: true },
            })
            this.props.history.push("/boss-store/speedy-billing")
          }
        }
      })
  }
  render() {
    const { location } = this.props
    console.log(location.query)
    let o = location.query
    const {
      mastType,
      cancelId,
      mastShow,
      detailShow,
      detailList,
      isK,
      isB,
      orderId,
      payList,
      loading,
      updateOrderBShow, // 是否显示编辑B单组件
      copyorderId, // 给编辑B单组件用的orderId
      copyorderType, // 给编辑B单组件用的orderType
      copyBid // 给编辑B单组件用的Bid
    } = this.state
    const tableConfig = {
      hasCheck: false,
      id: "key",
      moreBtn: [],
      headers: [
        {
          name: "订单号",
          prop: "orderId",
          width: "7%",
          render: (record) => (
            <div>
              {record.orderType === 3 ? (
                <p>
                  {" "}
                  <span className={styles.zl_wxList}>维修</span>{" "}
                  {record.isB === 1 ? (
                    <span className={styles.zl_Blist}>B</span>
                  ) : null}{" "}
                </p>
              ) : null}
              {record.orderType === 4 ? (
                <p>
                  {" "}
                  <span className={styles.zl_KjList}>快捷</span>{" "}
                  {record.isB === 1 ? (
                    <span className={styles.zl_Blist}>B</span>
                  ) : null}{" "}
                </p>
              ) : null}
              <p> {record.orderId}</p>
            </div>
          ),
        },
        {
          name: "下单日期",
          prop: "created",
          width: "7%",
          render: (record) => (
            <span>
              {" "}
              {record.created === 0
                ? ""
                : moment(record.created * 1000).format(
                    "HH:mm:ss"
                  )}{" "}<br/>
                   {" "}
              {record.created === 0
                ? ""
                : moment(record.created * 1000).format(
                    "YYYY-MM-DD"
                  )}{" "}
            </span>
          ),
        },
        {
          name: "车牌/车型/联系方式",
          prop: "carNum",
          width: "11%",
          render: (record) => (
            <div>
              <p>
                {" "}
                {record.clientName}{record.phone===0 && '散客'}{" "}
              </p>
              <p>
                {record.carNum}&nbsp;&nbsp;{record.carType}
              </p>
            </div>
          ),
        },
        {
          name: "项目信息/产品信息",
          prop: "project",
          width: "15%",
          render: (record) => (
            <div
              className={styles.zl_projectProduct}
              style={{ overflow: "hidden" }}
            >
              {record.project.map((item, i) => {
                return (
                  <p style={{ marginBottom: 0 }} key={i}>
                    {" "}
                    <Tooltip title={item.projectName}>
                      {" "}
                      {item.projectName.slice(0, 7)}{" "}
                    </Tooltip>{" "}
                    {/* &times;{item.number}{" "}
                    {!item.payment || "(" + item.payment + ")"}{" "} */}
                  </p>
                )
              })}
              {record.product.map((item, i) => {
                return (
                  <p style={{ marginBottom: 0 }} key={i}>
                    {" "}
                    <Tooltip title={item.productName}>
                     {item.productName.slice(0, 7)}
                    </Tooltip>{" "}
                    {/* &times;{item.number}{" "} */}
                    {item.status === 1 ? (
                      <span className={styles.zl_circle}  style={{ display: record.orderType === 4 ? 'none' : 'inline-block'  }}  />
                    ) : (
                      <span
                        className={styles.zl_circle}
                        style={{ backgroundColor: "rgba(255,89,106,1 )" , display: record.orderType === 4 ? 'none' : 'inline-block'   }}
                      />
                    )}{" "}
                  </p>
                )
              })}
              {record.additional.map((item, i) => {
                return (
                  <p style={{ marginBottom: 0 }} key={i}>
                    <Tooltip title={item.projectName}>
                      {" "}
                      {item.projectName.slice(0, 7)}{" "}
                    </Tooltip>{" "}
                    {/* &times;{item.number}{" "} */}
                  </p>
                )
              })}
            </div>
          ),
        },
        {
          name: "出库状态",
          prop: "state",
          width: "5%",
          render: (record) => (
            <p>
              {record.state === 3 && record.orderType ===3 ? <span>已出库</span> : null}
              {record.state === 2 && record.orderType ===3 ? (
                <span style={{ color: "#ff596a" }}>部分出库</span>
              ) : null}
              {record.state === 1  && record.orderType ===3 ? (
                <span style={{ color: "#ff596a" }}>未出库</span>
              ) : null}
              {record.state === 0  || record.orderType === 4 ? <span>--</span> : null}
            </p>
          ),
        },
        {
          name: '编码',
          prop: 'commodityCode',
          render:(record)=>(
            <div>
              {record.product && record.product.map((v, index) => <div key={index}>{v.commodityCode}</div>)}
            </div>
          ),
          width: '10%',
        },
        {
          name: "金额",
          prop: "price",
          width: "9%",
          render: (record) => (
            <div>
              <p>{record.price * 1 === 0 ? "--" : record.price}</p>
              <p>
                {" "}
                {record.productPrice * 1 === 0
                  ? ""
                  : `（产品金额：${record.productPrice}）  `}{" "}
              </p>
            </div>
          ),
        },
        {
          name: "完成时间",
          prop: "paytime",
          width: "7%",
          render: (record) => {
            return (
              <span>
                {" "}
                {record.paytime === 0
                  ? ""
                  : moment(record.paytime * 1000).format(
                      "HH:mm:ss"
                    )}{" "}<br/>
                    {" "}
                {record.paytime === 0
                  ? ""
                  : moment(record.paytime * 1000).format(
                      "YYYY-MM-DD"
                    )}{" "}
              </span>
            )
          },
        },
        {
          name: "结算/销账时间",
          prop: "completed",
          width: "7%",
          render: (record) => {
            return (
              <span>
                {" "}
                {record.completed === 0
                  ? ""
                  : moment(record.completed * 1000).format(
                      "HH:mm:ss"
                    )}{" "}<br/>
                    {" "}
                {record.completed === 0
                  ? ""
                  : moment(record.completed * 1000).format(
                      "YYYY-MM-DD"
                    )}{" "}
              </span>
            )
          },
        },
        {
          name: "操作人",
          prop: "person",
          width: "7%",
          render: (record) => (
            <div>
              <p> 接车 ：{record.carPerson}</p>
              <p> 结算 ： {record.payPerson} </p>
            </div>
          ),
        },
        {
          name: "支付方式",
          prop: "payType",
          width: "6%",
        },
        {
          name: "备注",
          prop: "remark",
          render: (record) => (
            <div>
              <Tooltip title={record.remark}>
                <span className={styles.zl_tableRemark}>
                  {record.remark.slice(0, 10)}
                </span>
              </Tooltip>
              <div className={styles.zl_iconBox} style={{ float: "right" }}>
                {/* <Tooltip title='现金'>
                                                  <i   style={ { marginLeft:"12px"} }  className="iconfont icon-xianjin" ></i>
                                              </Tooltip> */}
                <Tooltip title="详情">
                  <i
                    onClick={this.detailShow.bind(this, record)}
                    style={{ marginLeft: "12px" }}
                    className="iconfont icon-xiangqing"
                  />
                </Tooltip>
                <i
                  style={{ marginLeft: "12px" }}
                  className="iconfont icon-gengduo"
                >
                  <div
                    className={styles.zl_maintain_detail}
                    style={{ left: "18px" }}
                  >
                    <div className={styles.triangle_border_up} />
                    <ul>
                      {/* <li><p>提醒设置</p></li> */}
                      <li
                        onClick={this.productBlist.bind(this, record.orderId)}
                      >
                        <p>生成B单</p>
                      </li>
                      <li onClick={this.mastShow.bind(this, 1, record.orderId)}>
                        <p>作废</p>
                      </li>
                      <li onClick={this.mastShow.bind(this, 2, record.orderId)}>
                        <p>修改历史</p>
                      </li>
                      {record.isB === 1 ? (
                        <li onClick={this.BlistShow.bind(this, record.orderId,record.orderType,record.viceOrderId)}>
                          {" "}
                          <p>B单详情</p>{" "}
                        </li>
                      ) : null}
                    </ul>
                  </div>
                </i>
              </div>
            </div>
          ),
        },
      ],
      screen: {
        query: { state: 4, arrears: 0 , ...o },
        rules: [
          {
            type: "text",
            prop: "clientName,clientPhone,licenseNo",
            placeholder: "会员名称/联系电话/车牌号",
          },
          {
            type: "text-cell",
            prop: "frameNumber",
            label: "车架号",
          },
          {
            type: "text-cell",
            prop: "orderNo",
            label: "订单号",
          },
          {
            type: "text-cell",
            prop: "counselorName",
            label: "接车员",
          },
          {
            type: "text-cell",
            prop: "vehicleType[~]",
            label: "车型",
          },
          // {
          //   type: "text-cell",
          //   prop: "counselorName",
          //   label: "产品/项目",
          // },
          {
            type: "list",
            label: "支付方式",
            placeholder: "全部",
            prop: "paymentMode",
            list: [...payList],
          },
          {
            type: "date<>",
            prop: "created",
            label: "开单时间",
          },
          {
            type: "date<>",
            prop: "received",
            label: "进店时间",
          },
          {
            type: "date<>",
            prop: "completed",
            label: "结算时间",
          },
          {
            type: "date<>",
            prop: "repayment",
            label: "销账时间",
          },
        ],
      },
    }

    return (
      <div className={styles.zl_tableBox}>
        {loading && (
          <CommonTable
            name="maintain/order"
            refresh
            tableConfig={tableConfig}
            //   onDataChangeBefore={this.changeDate}
            New
          />
        )}
        {!mastShow || (
          <Mast
            mastType={mastType}
            cancelId={cancelId}
            notShow={this.notShow}
            getData={this.getData}
          />
        )}
        {!detailShow ||
          (isK === 4 ? (
            <Klist detailList={detailList} notShow={this.notShow} />
          ) : (
            <DetailList detailList={detailList} notShow={this.notShow} />
          ))}
        {!isB || (
          <Blist
            orderId={orderId}
            notShow={this.notShow}
            updateOrder={this.updateOrder}
          />
        )}
        {/* 编辑B单组件 */}
        {
          updateOrderBShow &&  <BS  Bid={copyBid}  orderType ={ copyorderType }   orderId={copyorderId}  updateOrderB={this.updateOrderB}  />
        }
      </div>
    )
  }
}
function mapStateToProps(state) {
  const { selectList, dataList } = state.maintianList
  return { selectList, dataList }
}

export default connect(mapStateToProps)(Doing)
