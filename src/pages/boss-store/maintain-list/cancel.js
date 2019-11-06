import React, { Component } from "react"
import { connect } from "dva"
import { Tooltip } from "antd"
import styles from "./styles.less"
import moment from "moment"
import CommonTable from "components/CommonTable/index"
// import CommonMeun from "./components/commonMenu"
import Mast from "./components/popmast.js"
import Klist from "./detail/Klist"
import DetailList from "./detail/list.js"

class Cancel extends Component {
  constructor() {
    super()
    this.state = {
      currentPage: 1,
      formObj: {},
      isK: null,
    }
  }
  mastShow = (mastType, cancelId) => {
    this.setState({
      mastType,
      cancelId,
      mastShow: !this.state.mastShow,
    })
  }
  notShow = () => {
    this.setState({
      mastShow: false,
      detailShow: false,
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
  changePage = (currentPage) => {
    this.setState({
      currentPage,
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
      },
      () => {
        dispatch({
          type: "maintianList/getData",
          payload: { q: { where: { deleted: 0 } } },
        })
      }
    )
  }
  commitForm = (o) => {
    const { dispatch } = this.props
    dispatch({
      type: "maintianList/getData",
      payload: { q: { where: { deleted: 0, ...o } } },
    })
    this.setState({
      currentPage: 1,
      formObj: o,
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
          payload: { q: { where: { deleted: 0, ...o }, page: currentPage } },
        })
      }
    )
  }
  render() {
    const {
      mastType,
      cancelId,
      mastShow,
      detailShow,
      detailList,
      isK,
    } = this.state
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
          name: "操作时间",
          prop: "worktime",
          width: "8%",
          render: (record) => (
            <span>
              {" "}
              {record.worktime === 0
                ? ""
                : moment(record.worktime * 1000).format(
                    "HH:mm:ss"
                  )}{" "}<br/>
                  {" "}
              {record.worktime === 0
                ? ""
                : moment(record.worktime * 1000).format(
                    "YYYY-MM-DD"
                  )}{" "}
            </span>
          ),
        },
        {
          name: "车牌/车型/联系方式",
          prop: "carNum",
          width: "12%",
          render: (record) => (
            <div>
              <p>
                {" "}
                {record.clientName} {record.phone===0&&'散客'}{" "}
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
                    {/* &times;{item.number}{" "} */}
                    {/* {!item.payment || "(" + item.payment + ")"}{" "} */}
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
                      <span className={styles.zl_circle}  style={{ display: record.orderType === 4 ? 'none' : 'inline-block'  }}       />
                    ) : (
                      <span
                        className={styles.zl_circle}
                        style={{ backgroundColor: "rgba(255,89,106,1 )" ,display: record.orderType === 4 ? 'none' : 'inline-block'   }}
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
          width: "7.5%",
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
          width: "5%",
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
          name: "支付方式",
          prop: "payType",
          width: "8%",
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
                <Tooltip title="详情">
                  <i
                    onClick={this.detailShow.bind(this, record)}
                    style={{ marginLeft: "12px" }}
                    className="iconfont icon-xiangqing"
                  />
                </Tooltip>
                <Tooltip title="修改历史">
                  <i
                    onClick={this.mastShow.bind(this, 2, record.orderId)}
                    style={{ marginLeft: "12px" }}
                    className="iconfont icon-xiugailishi"
                  />
                </Tooltip>
              </div>
            </div>
          ),
        },
      ],
      screen: {
        query: { deleted: 0 },
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
       
        <CommonTable
          name="maintain/order"
          refresh
          tableConfig={tableConfig}
          //   onDataChangeBefore={this.changeDate}
          New
        />
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
            <Klist
              detailList={detailList}
              notShow={this.notShow}
              isCancel={true}
            />
          ) : (
            <DetailList
              updateOrder={this.updateOrder}
              detailList={detailList}
              notShow={this.notShow}
              isCancel={true}
            />
          ))}
      </div>
    )
  }
}
function mapStateToProps(state) {
  const { selectList, dataList } = state.maintianList
  return { selectList, dataList }
}

export default connect(mapStateToProps)(Cancel)
