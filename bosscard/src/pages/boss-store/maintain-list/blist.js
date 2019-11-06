import React, { Component } from "react"
import { connect } from "dva"
import { Tooltip } from "antd"
import styles from "./styles.less"
import moment from "moment"
import BS from './components/Bshow'
// import CommonMeun from "./components/commonMenu"
import CommonTable from "components/CommonTable/index"
import Blist from "./detail/Blist.js"
import { __PROJECT_TYPE__, __PRODUCT_TYPE__ } from "utils/globalConfig"
// import   { data }  from './detail/data'
import services from "services"
// import empty from './images/none.png'

class blist extends Component {
  constructor() {
    super()
    this.state = {
      currentPage: 1,
      formObj: {},
      detailShow: false,
      dataList: [],
      totalSize: null,
      orderId: null,
      orderType:null,
      updateOrderBShow:false,
    }
  }
  notShow = (bool) => {
    const {  updateOrderBShow  } = this.state
    this.setState({
      detailShow: false,
      updateOrderBShow: bool ? bool : updateOrderBShow,
    },()=>{
    })
  }
  detailShow = (orderId,orderType,Bid) => {
    this.setState({
      detailShow: !this.state.detailShow,
      orderId,
      orderType,
      id:Bid,
    })
  }
  getData = (boolean) => {
    console.log(boolean)
    let o = {}
    const { formObj } = this.state
    boolean ? null : (o = formObj)
    this.setState(
      {
        currentPage: 1,
        formObj: o,
      },
      () => {
        services
          .Blist({
            keys: { name: "store/vice/order" },
            data: { page: this.state.currentPage, q: { where: { ...o } } },
          })
          .then((res) => {
            this.setState({
              dataList: res.list,
              totalSize: res.totalSize,
            })
          })
      }
    )
  }
  //改变分页
  changePage = (currentPage) => {
    this.setState(
      {
        currentPage,
      },
      () => {
        services
          .Blist({
            keys: { name: "store/vice/order" },
            data: {
              page: currentPage,
              q: { where: { ...this.state.formObj } },
            },
          })
          .then((res) => {
            this.setState({
              dataList: res.list,
              totalSize: res.totalSize,
            })
          })
      }
    )
  }
  // 修改订单 - b单
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
            // await dispatch({
            //   type: "maintainBilling/changeStatus",
            //   payload: { key: "isFromOrder", value: true },
            // })
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
            // await dispatch({
            //   type: "speedyBilling/changeStatus",
            //   payload: { key: "isFromOrder", value: true },
            // })
            this.props.history.push("/boss-store/speedy-billing")
          }
        }
      })
  }
  updateOrderB=(id,orderType,Bid)=>{
      const { updateOrderBShow } = this.state
      this.setState({
        updateOrderBShow:!updateOrderBShow,
        orderId:id,
        orderType,
        id:Bid,
      })
  }
  UNSAFE_componentWillMount(){
    const { location } = this.props
    if(location.query.Bid){
      const { updateOrderBShow } = this.state
      const { orderId , orderType , Bid  } = location.query
      this.setState({
        updateOrderBShow:!updateOrderBShow,
        orderId,
        orderType,
        id:Bid,
      })
    }
  }
  componentWillReceiveProps(nextprops){

    const { dispatch } = this.props
     if(this.props.totalSize!==nextprops.totalSize){
      dispatch({
        type:'maintianList/customizeNumber',
        payload:{
          count:nextprops.totalSize,
          type:'getPersonListTotal',
          index:1,
        },
     })
     }
  }
  render() {
    const { orderId , updateOrderBShow , orderType ,id } = this.state
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
              {record.type === 3 ? (
                <p style={{marginBottom:'0px'}}>
                  {" "}
                  <span className={styles.zl_wxList}>维修</span>{" "}
                  {record.id ? (
                    <span className={styles.zl_Blist}>B</span>
                  ) : null}{" "}
                </p>
              ) : null}
              {record.type === 4 ? (
                <p style={{marginBottom:'0px'}}>
                  {" "}
                  <span className={styles.zl_KjList}>快捷</span>{" "}
                  {record.id ? (
                    <span className={styles.zl_Blist}>B</span>
                  ) : null}{" "}
                </p>
              ) : null}
              <p style={{marginBottom:'0px'}}> {record.orderId}</p>
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
                : <div style={{marginBottom:'0px'}}>{moment(record.created * 1000).format(
                  "YYYY-MM-DD"
                  )}</div>}{" "}
              {record.created === 0
                ? ""
                : <div style={{marginBottom:'0px'}}>{moment(record.created * 1000).format(
                  "HH:mm"
                  )}</div>}{" "}
            </span>
          ),
        },
        {
          name: "车牌",
          prop: "carNum",
          width: "12%",
          render: (record) => (
            <div>
              {/* <p>
                {record.carNum}&nbsp;&nbsp;{record.carType}
              </p>
              <p>
                {" "}
                {record.clientName} {record.phone===0 &&'散客' } {record.phone&&(`(${record.phone})`)} {" "}
              </p> */}
              <p style={{marginBottom:'0px'}}>{record.carNum}</p>
              <p style={{marginBottom:'0px'}}>{record.carType}</p>
            </div>
          ),
        },
        {
          name: "服务信息",
          prop: "project",
          width: "13%",
          render: (record) => (
            <div
              className={styles.zl_projectProduct}
              style={{ overflow: "hidden" }}
            >
              {record.project &&
                record.project.map((item, i) => {
                  return (
                    <p style={{marginBottom:'0px'}} key={i}>
                      {" "}
                      <Tooltip title={item.name}>
                        {" "}
                        {item.name?item.name.slice(0, 7):''}{" "}
                      </Tooltip>{" "}
                      {/* &times;{item.number}{" "} */}
                      {!item.payment || "(" + item.payment + ")"}
                    </p>
                  )
                })}
              {record.product &&
                record.product.map((item, i) => {
                  return (
                    <p style={{marginBottom:'0px'}} key={i}>
                      {" "}
                      <Tooltip title={`${item.name}-${item.commodityCode}`}>
                        {" "}
                        {item.name?item.name.slice(0, 7):''}&nbsp;{item.commodityCode}
                      </Tooltip>{" "}
                      {/* &times;{item.number}{" "} */}
                      {/* {item.status === 1 ? (
                        <span className={styles.zl_circle}   style={{ display: record.type === 4 ? 'none' : 'inline-block'  }}     />
                      ) : (
                          <span
                            className={styles.zl_circle}
                            style={{ backgroundColor: "rgba(255,89,106,1 )"  , display: record.type === 4 ? 'none' : 'inline-block'   }}
                          />
                        )}{" "} */}
                    </p>
                  )
                })}
            </div>
          ),
        },
        // {
        //   name: "出库状态",
        //   prop: "state",
        //   width: "7%",
        //   render: (record) => (
        //     <p>
        //     {record.state === 3 && record.orderType ===3 ? <span>已出库</span> : null}
        //     {record.state === 2 && record.orderType ===3 ? (
        //       <span style={{ color: "#ff596a" }}>部分出库</span>
        //     ) : null}
        //     {record.state === 1  && record.orderType ===3 ? (
        //       <span style={{ color: "#ff596a" }}>未出库</span>
        //     ) : null}
        //     {record.state === 0  || record.orderType === 4 ? <span>--</span> : null}
        //   </p>
        //   ),
        // },
        // {
        //   name: '编码',
        //   prop: 'commodityCode',
        //   render:(record)=>(
        //     <div>
        //       {record.product && record.product.map((v, index) => <div key={index}>{v.commodityCode}</div>)}
        //     </div>
        //   ),
        //   width: '10%',
        // },
        {
          name: "金额",
          prop: "price",
          width: "9%",
          render: (record) => (
            <div>
              <p style={{marginBottom:'0px'}}>{record.price}</p>
              <p style={{marginBottom:'0px'}}>
                {record.productPrice * 1 === 0
                  ? ""
                  : `(产品金额：${record.productPrice})  `}
              </p>
            </div>
          ),
        },
        {
          name: "完成时间",
          prop: "completed",
          width: "8%",
          render: (record) => (
            <span>
              {" "}
              {record.completed * 1 === 0
                ? ""
                : <div style={{marginBottom:'0px'}}>{moment(record.completed * 1000).format(
                  "YYYY-MM-DD"
                  )}</div>}{" "}
              {record.completed * 1 === 0
                ? ""
                : <div style={{marginBottom:'0px'}}>{moment(record.completed * 1000).format(
                  "HH:mm"
                  )}</div>}{" "}
            </span>
          ),
        },
        // {
        //   name: "结算/销账时间",
        //   prop: "paytime",
        //   width: "8%",
        //   render: (record) => (
        //     <span>
        //       {" "}
        //       {record.paytime * 1 === 0
        //         ? ""
        //         : <div style={{marginBottom:'0px'}}>{moment(record.paytime * 1000).format(
        //           "YYYY-MM-DD"
        //           )}</div>}{" "}
        //       {record.paytime * 1 === 0
        //         ? ""
        //         : <div style={{marginBottom:'0px'}}>{moment(record.paytime * 1000).format(
        //           "HH:mm"
        //           )}</div>}{" "}
        //     </span>
        //   ),
        // },
        {
          name: "操作人",
          prop: "person",
          width: "8%",
          render: (record) => (
            <div>
              <p style={{marginBottom:'0px'}}> 接车 ：{record.carPerson}</p>
              <p style={{marginBottom:'0px'}}> 结算 ： {record.payPerson} </p>
            </div>
          ),
        },
        {
          name: "支付方式",
          prop: "payType",
          width: "8%",
        },
        {
          name: "操作",
          prop: "edit",
          width: "20%",
          render: (record) => (
              <div className={styles.wyc_list_btn}>
                <span className={styles.wyc_print_btn} onClick={this.updateOrderB.bind(this,record.orderId,record.type,record.id)}>编辑</span>
                <span className={styles.wyc_print_btn} style={{marginLeft:'10px'}} onClick={this.detailShow.bind(this, record.orderId , record.type , record.id  )}>详情</span>
              </div>
          ),
        },
      ],
      screen: {
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
            prop: "vehicleType",
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
            prop: "completed",
            label: "结算时间",
          },
        ],
      },
    }

    return (
      <div className={styles.zl_tableBox}>
        <span className={styles.yc_right_top} onClick={()=>{this.props.history.push('/boss-store/pending-order')}}>查看进行中的订单</span>
        <CommonTable
          name="store/vice/order"
          refresh
          tableConfig={tableConfig}
          //   onDataChangeBefore={this.changeDate}
          New
        />
        {!this.state.detailShow || (
          <Blist
            orderId={orderId}
            notShow={this.notShow}
            updateOrder={this.updateOrder}
          />
        )}
        {
          updateOrderBShow &&  <BS  Bid={id}  orderType ={ orderType }   orderId={orderId}  updateOrderB={this.updateOrderB}  />
        }
        {/* { dataList.length===0 ?
                    <div className={ styles.zl_noData } >
                       <div>
                           <img alt="图片加载失败" src={empty} />
                           <p>抱歉，暂无相关数据</p>
                       </div>
                    </div>
                    :
                     <div className={ styles.zl_formFoot } >
                      <p  style={{ float:'left',marginTop:'24px' }}  >本页显示<span>{dataList.length}</span>条记录，共<span>{ totalSize }</span>条记录</p>
                      <Pagination  style={{ float :'right',marginTop:'24px',marginRight:'92px' }}  pageSize={15}  showQuickJumper defaultCurrent={1}  current={currentPage}  total={ totalSize } onChange={this.changePage} />
                     </div>  } */}
      </div>
    )
  }
}
function mapStateToProps(state) {
  const { totalSize } = state.table
  return { totalSize }
}
export default connect(mapStateToProps)(blist)
