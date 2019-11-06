import moment from "moment"
import styles  from './styles.less'
import { message, Tooltip, Popover } from "antd"
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
            <p style={{marginBottom:'0px'}}>
              {" "}
              <span className={styles.zl_wxList}>维修</span>{" "}
              {record.isB === 1 ? (
                <span className={styles.zl_Blist}>B</span>
              ) : null}{" "}
            </p>
          ) : null}
          {record.orderType === 4 ? (
            <p style={{marginBottom:'0px'}}>
              {" "}
              <span className={styles.zl_KjList}>快捷</span>{" "}
              {record.isB === 1 ? (
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
      width: "7%",
      render: (record) => (
        <div>
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
        </div>
      ),
    },
    {
      name: "结算时间",
      prop: "completed",
      width: "7%",
      render: (record) => (
        <span>
          {" "}
          {record.completed === 0
            ? ""
            : <div style={{marginBottom:'0px'}}>{moment(record.completed * 1000).format(
              "YYYY-MM-DD"
              )}</div>}{" "}
            {record.completed === 0
            ? ""
            : <div style={{marginBottom:'0px'}}>{moment(record.completed * 1000).format(
              "HH:mm"
              )}</div>}{" "}
        </span>
      ),
    },
    {
      name: "车牌",
      prop: "carNum",
      width: "9%",
      render: (record) => (
        <div>
          {/* <p style={{marginBottom:'10px'}}>
            {record.carNum}&nbsp;&nbsp;{record.carType}
          </p>
          <p style={{marginBottom:'0px'}}>
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
      width: "10%",
      render: (record) => (
        <div
          className={styles.zl_projectProduct}
          style={{ overflow: "hidden" }}
        >
          {(record.project||[]).map((item, i) => {
            return (
              <p style={{marginBottom:'0px'}} key={i}>
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
              <p style={{marginBottom:'0px'}} key={i}>
                {" "}
                <Tooltip title={`${item.productName}-${item.commodityCode}`}>
                  {item.productName.slice(0, 7)}&nbsp;{item.commodityCode}
                </Tooltip>{" "}
                {/* &times;{item.number}{" "} */}
                {/* {item.status === 1 ? (
                  <span className={styles.zl_circle}  style={{ display: record.orderType === 4 ? 'none' : 'inline-block'  }}    />
                ) : (
                    <span
                      className={styles.zl_circle}
                      style={{ backgroundColor: "rgba(255,89,106,1 )" , display: record.orderType === 4 ? 'none' : 'inline-block'   }}
                    />
                  )}{" "} */}
              </p>
            )
          })}
        </div>
      ),
    },
    {
      name: "施工人员",
      prop: "builder",
      width: "7%",
      render: (record) => (
        <div>
          {
            record.builder&&record.builder.map((v,i)=>{
              return <div key={i}  className={styles.wyc_builder}>
                {v}
              </div>
            })
          }
        </div>
      ),
    },
    {
      name: "订单金额",
      prop: "price",
      width: "6%",
      render: (record) => (
        <div>
          <p style={{marginBottom:'0px'}}>{record.price}</p>
          {/* <p style={{marginBottom:'0px'}}>
            {record.productPrice * 1 === 0
              ? ""
              : `(产品金额：${record.productPrice})`}
          </p> */}
        </div>
      ),
    },
    {
      name: "实收金额",
      prop: "actuallyPaid",
      width: "6%",
    },
    {
      name: "消耗",
      prop: "consume",
      width: "6%",
    },
    {
      name: <span>毛利<Popover content={'毛利 = 消耗 - 成本'}><i className='iconfont icon-wenhao' style={{marginLeft:'5px',cursor:'pointer'}}/></Popover></span>,
      prop: "profit",
      width: "6%",
    },
    {
      name: "结算方式",
      prop: "paymentRecord",
      width: "9%",
      render: (record) => (
        <div>
          {
            record.paymentRecord&&record.paymentRecord.map((v,i)=>{//计次卡的时候（2）：不显示金额
              return <div key={i}  className={styles.wyc_builder}>
                {v.paymentType*1===2 ? v.paymentName : v.paymentName + ' ' + v.paymentMoney}
              </div>
            })
          }
          {
            record.repaymentRecord.lenght!==0&&record.repaymentRecord.map((v,i)=>{
              return <div key={i}  className={styles.wyc_builder}>
              {v.paymentType*1===2 ? v.paymentName : v.paymentName + ' ' + v.paymentMoney}
            </div>
            })
          }
        </div>
      ),
    },
    {
      name: "状态",
      prop: "type",
      width: "7%",
      render: (record) => (
        record.type*1 === 1 ?
        <span style={{color:'#F65328'}}>挂账</span>
        : (record.type*1 === 2 ? <span>已完成</span> : <span style={{color:'#F65328'}}>已作废</span>)
      ),
    },

    // {
    //   name: "操作人",
    //   prop: "person",
    //   width: "7%",
    //   render: (record) => (
    //     <div>
    //       <p> 接车 ：{record.carPerson}</p>
    //       <p> 结算 ： {record.payPerson} </p>
    //     </div>
    //   ),
    // },
    {
      name: "操作",
      prop: "edit",
      width: "20%",
    },
  ],
  screen: {
    col: 4,
    query: {'state|deleted': [4,1]},
    rules: [
      {
        type: "text",
        placeholder: "会员名称/联系电话/车牌号",
        prop: "clientName,clientPhone,licenseNo",
      },
      {
        type: "list",
        label: "状态",
        placeholder: "全部",
        prop: "type",
        list:[
          {
            name:'全部',
            value:'',
          },
          {
            name:'挂账',
            value:1,
          },
          {
            name:'已完成',
            value:2,
          },
          {
            name:'已作废',
            value:3,
          },
        ],
      },
      {
        type: "list",
        label: "结算方式",
        placeholder: "全部",
        prop: "paymentMode",
        list: [],
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
        type: "list",
        prop: "builderId",
        label: "施工人员",
        list: [],
      },
      {
        type: "date<>",
        prop: "completed",
        label: "结算时间",
      },
    ],
  },
}

export default tableConfig
