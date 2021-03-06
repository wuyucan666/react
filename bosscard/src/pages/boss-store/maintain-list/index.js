import React, { Component } from "react"
import { connect } from "dva"
import { message, Tooltip } from "antd"
import styles from "./styles.less"
import moment from "moment"
import Mast from "./components/popmast.js"
import DetailList from "./detail/list.js"  // 维修单详情
import CommonTable from "components/CommonTable/index"
import { data } from "./detail/data"
import services from "services"
// import CommonMeun from "./components/commonMenu"
import Klist from "./detail/Klist" // 快捷单详情
import { __PROJECT_TYPE__, __PRODUCT_TYPE__ } from "utils/globalConfig"
import router from "umi/router";

class Index extends Component {
  constructor() {
    super()
    this.state = {
      mastType: null,
      mastShow: false,
      cancelId: null,
      detailShow: false,
      detailList: null,
      isK: null,
      selectList: data,
      loading: true,
      currentPage: 1,
      formObj: {},
    }
  }
  mastShow = (mastType, cancelId) => {
    this.setState({
      mastType,
      cancelId,
      mastShow: !this.state.mastShow,
    })
  }
  //挂起订单
  hangupOrder = (id) => {
    services
      .UPDATE({ keys: { name: "maintain/hangup", id }, data: { operate: 1 } })
      .then((res) => {
        if (res.success) {
          message.success("订单已挂起")
          this.getData()
        } else {
          message.info("网络出现错误")
        }
      })
  }
  //控制显示隐藏
  notShow = () => {
    this.setState({
      mastShow: false,
      detailShow: false,
    })
  }
  getData = (boolean) => {
    let o = {}
    const { dispatch } = this.props
    const { formObj } = this.state
    boolean ? null : (o = formObj)
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
          payload: { q: { where: { state: [1, 3] } } },
        })
      }
    )
  }
  componentDidMount() {
    const { goDetail } = this.props
    const { orderId, orderType } = goDetail
    if (orderId) {
      this.setState({
        detailShow: !this.state.detailShow,
        detailList: { ...goDetail },
        isK: orderType,
      })
    }
  }
  detailShow = (val) => {
    console.log(val)
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
          payload: { q: { where: { state: [1, 3], ...o }, page: currentPage } },
        })
      }
    )
  }
  //提交表单
  commitForm = (o) => {
    const { dispatch } = this.props
    dispatch({
      type: "maintianList/getData",
      payload: { q: { where: { state: [1, 3], ...o } } },
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
  //结算订单
  Topay = (orderId, orderType) => {
    const { dispatch } = this.props
    if (orderType === 4) {
      //快捷
      services
        .LIST({ keys: { name: `quick/order/${orderId}/edit` } })
        .then(async (res) => {
          if (res.success) {
            const { data } = res
            await dispatch({
              type: "speedyBilling/setAccount",
              payload: {
                clientInfo: data.clientInfo,
              },
            })
            await dispatch({
              type: "speedyBilling/setOrderInfo",
              payload: data.orderInfo,
            })
            await dispatch({
              type: "speedyBilling/changeStatus",
              payload: { key: "isPay", value: true },
            })
            await dispatch({
              type: "speedyBilling/changeStatus",
              payload: { key: "isFromOrder", value: true },
            })
            this.props.history.push("/boss-store/speedy-billing")
          } else {
            message.error("订单异常!")
          }
        })
    } else {
      services
        .LIST({ keys: { name: `maintain/order/${orderId}/edit` } })
        .then(async (res) => {
          if (res.success) {
            const { data } = res
            await dispatch({
              type: "maintainBilling/setAccount",
              payload: {
                clientInfo: data.clientInfo,
              },
            })
            await dispatch({
              type: "maintainBilling/setOrderInfo",
              payload: data.orderInfo,
            })
            await dispatch({
              type: "maintainBilling/changeStatus",
              payload: { key: "isPay", value: true },
            })
            await dispatch({
              type: "maintainBilling/changeStatus",
              payload: { key: "isFromOrder", value: true },
            })
            this.props.history.push("/boss-store/maintain-billing")
          } else {
            message.error("订单异常!")
          }
        })
    }
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
  render() {
    const {
      currentPage,
      mastType,
      cancelId,
      mastShow,
      detailShow,
      detailList,
      isK,
      loading,
    } = this.state
    console.log(currentPage)
    // const { dataList } = this.props
    const tableConfig = {
      hasCheck: false,
      id: "key",
      moreBtn: [],
      headers: [
        {
          name: "订单号",
          prop: "orderId",
          width: "8%",
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
          width: "8%",
          render: (record) => (
            <span>
              {" "}
              {record.created === 0
                ? ""
                : moment(record.created * 1000).format(
                  "HH:mm:ss"
                )}{" "}<br/>
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
          width: "20%",
          render: (record) => (
            <div>
              <p>
                {" "}
                {record.clientName} {record.phone===0 &&'散客' }{" "}
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
              {(record.project||[]).map((item, i) => {
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
              {(record.product||[]).map((item, i) => {
                return (
                  <p style={{ marginBottom: 0 }} key={i}>
                    {" "}
                    <Tooltip title={item.productName}>
                      {item.productName.slice(0, 7)}
                    </Tooltip>{" "}
                    {/* &times;{item.number}{" "} */}
                    {item.status === 1 ? (
                      <span className={styles.zl_circle}  style={{ display: record.orderType === 4 ? 'none' : 'inline-block'  }}    />
                    ) : (
                        <span
                          className={styles.zl_circle}
                          style={{ backgroundColor: "rgba(255,89,106,1 )" , display: record.orderType === 4 ? 'none' : 'inline-block'   }}
                        />
                      )}{" "}
                  </p>
                )
              })}
              {(record.additional||[]).map((item, i) => {
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
          width: "10%",
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
          width: "7.5%",
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
          name: "操作人",
          prop: "person",
          width: "7.5%",
          render: (record) => (
            <div>
              <p> 接车 ：{record.carPerson}</p>
              <p> 结算 ： {record.payPerson} </p>
            </div>
          ),
        },
        {
          name: "备注",
          prop: "remark",
          width: "20%",
          render: (record) => (
            <div>
              <Tooltip title={record.remark}>
                <span className={styles.zl_tableRemark}>
                  {record.remark.slice(0, 10)}
                </span>
              </Tooltip>
              <div className={styles.zl_iconBox} style={{ float: "right" }}>
                <Tooltip title="结算">
                  {((record.orderType === 3 && (record.state === 3 || record.state === 0)) || record.orderType === 4)  ? (
                    <i
                      style={{ marginLeft: "12px" }}
                      className="iconfont icon-jiesuan"
                      onClick={this.Topay.bind(
                        this,
                        record.orderId,
                        record.orderType
                      )}
                    />
                  ) : null}
                </Tooltip>
                <Tooltip title="编辑">
                  <i
                    style={{ marginLeft: "12px"}}
                    className="iconfont icon-bianji"
                    onClick={() =>
                      this.updateOrder(record.orderId, record.orderType)
                    }
                  />
                </Tooltip>
                <i
                  style={{ marginLeft: "12px" }}
                  className="iconfont icon-gengduo"
                >
                  <div
                    className={styles.zl_maintain_detail}
                    style={{
                      left:
                      ((record.orderType === 3 && (record.state === 3 || record.state === 0)) || record.orderType === 4)
                          ? "60px"
                          : "20px",
                    }}
                  >
                    <div className={styles.triangle_border_up} />
                    <ul>
                      {/* <li onClick={this.hangupOrder.bind(this, record.orderId)}>
                        <p>挂起</p>
                      </li> */}
                      <li onClick={this.detailShow.bind(this, record)}>
                        <p>订单详情</p>
                      </li>
                      <li onClick={this.mastShow.bind(this, 1, record.orderId)}>
                        <p>作废</p>
                      </li>
                      <li onClick={this.mastShow.bind(this, 2, record.orderId)}>
                        <p>修改历史</p>
                      </li>
                    </ul>
                  </div>
                </i>
              </div>
            </div>
          ),
        },
      ],
      screen: {
        col: 4,
        query: { state: [1, 3] },
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
            type: "date<>",
            prop: "created",
            label: "开单时间",
          },
          {
            type: "date<>",
            prop: "received",
            label: "进店时间",
          },
        ],
      },
    }
    return (
      <div className={styles.zl_tableBox}>
        {/* <span className={styles.yc_right_top} onClick={()=>{router.push('/boss-store/pending-order')}}>查看进行中的订单>></span> */}
        {/* <CommonForm  getData={ this.getData }    commitForm={ this.commitForm }   currentPage={ currentPage  } /> */}
        {
          loading &&
          <CommonTable
            name="maintain/order"
            refresh
            tableConfig={tableConfig}
            //   onDataChangeBefore={this.changeDate}
            New
          />
        }
        {!mastShow || (
          <Mast
            reasonState={true}
            mastType={mastType}
            cancelId={cancelId}
            notShow={this.notShow}
            getData={this.getData}
          />
        )}
        {!detailShow ||
          (isK === 4 ? (
            <Klist
              updateOrder={this.updateOrder}
              detailList={detailList}
              notShow={this.notShow}
            />
          ) : (
              <DetailList
                updateOrder={this.updateOrder}
                detailList={detailList}
                notShow={this.notShow}
              />
            ))}
        {/* <CommonFooter
                      selectList={ dataList }
                      changePage={ this.changePage }
                      currentPage={ currentPage }
                       /> */}
      </div>
    )
  }
}
function mapStateToProps(state) {
  const { selectList, dataList, goDetail } = state.maintianList
  return { selectList, dataList, goDetail }
}

export default connect(mapStateToProps)(Index)
