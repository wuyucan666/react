import React, { Component } from 'react'
import { Table, message, Spin, Tooltip } from 'antd'
import router from 'umi/router'
import styles from '../styles.less'
import services from "services"
const { Column } = Table

class table extends Component {
  constructor(props) {
    super(props)
    this.state = {
      payDetailShow: '-1', // 控制-单个卡类型支付问号hover显示隐藏
      payDetailShowPlus: -1, // 控制-包括卡类型的混合支付问号hover显示隐藏
      historyList: [{ index: '-1', data: {} }],
      loading: false,
      renderContent:null,
    }

  }
  renderPerson(list, type, i) {
    if (list.length === 0) return
    if (!list) return
    if (type === 'construction') {
      return <div>
        {list[i].construction && list[i].construction.map(((item, idx) => {
          return <p style={{ fontWeight: 'normal', fontSize: '12px', border: '0 none', marginBottom: '0' }} key={idx} >{item.name||item.staff_name}{`(${item.scale}%)`}</p>
        }))}
      </div>
    } else if (type === 'salePerson') {
      return <div>
        {list[i].salePerson && list[i].salePerson.map(((item, idx) => {
          return <p style={{ fontWeight: 'normal', fontSize: '12px', border: '0 none', marginBottom: '0' }} key={idx} >{item.name||item.staff_name}{`(${item.scale}%)`}</p>
        }))}
      </div>
    }

  }
  onMouseEnter(index, idx) {
    // console.log(index,idx,'----')
    const ids = String(index) + String(idx)
    console.log(ids, 'sssss')
    this.setState({
      payDetailShow: ids,
      loading: true,
    })
    setTimeout(() => {
      this.setState({
        loading: false,
      })
    }, 300)
  }
  onMouseLeave() {
    this.setState({
      payDetailShow: '-1',
      loading: false,
    })
  }
  renderPayDetail = (clientCardId, index, payment_type, rowTtem) => {
    const { historyList } = this.state
    if (historyList.findIndex(item => item.index === index) === -1) {
      // 避免重复请求接口
      let queryObj = {}
      queryObj.orderId = this.props.selectList.order.id
      queryObj.clientCardId = clientCardId
      queryObj.type = payment_type === 2 ? 2 : 1  // payment_type ：2 计次卡 ， 3：充值卡（赠送卡）
      queryObj.projectId = rowTtem.type * 1 === 1 ? rowTtem.id : 0 // rowTtem.type 为 1-项目， 2-产品
      queryObj.productId = rowTtem.type * 1 === 2 ? rowTtem.id : 0
      console.log(queryObj)
      services.clientCardInfo({
        keys: { name: "store/clientCardInfo" },
        data: queryObj,
      }).then(res => {
        if (res.success) {
          this.setState({
            historyList: [{ index: index, data: res.list }],
            loading: false,
          })
        } else {
          message.info('网络出现错误')
          this.setState({
            loading: false,
          })
        }
      })
    }
    //  console.log(historyList)
    //计次卡
    if (payment_type === 2) {
      return (
        historyList && historyList.map(item => {
          return <div className={styles.wyc_min_tc} onMouseLeave={this.onMouseLeave.bind(this)}   >
            <div>
              <Spin spinning={this.state.loading} >
                <div className={styles.wyc_title_max}>{item.data.cardName}</div>
                <div className={styles.wyc_title_mid}>{item.data.name}</div>
                <div className={styles.wyc_title_min}><span>剩余次数:</span><span>{item.data.oldNum === -1 ? "无限" : item.data.oldNum}-{item.data.useNum}={item.data.newNum === -1 ? "无限" : item.data.newNum}</span></div>
              </Spin>
            </div>
          </div>
        })
      )
    }
    //  //充值卡
    if (payment_type === 3) {
      return (
        historyList && historyList.map(item => {
          return <div className={styles.wyc_min_tc} onMouseLeave={this.onMouseLeave.bind(this)}   >
            <Spin spinning={this.state.loading} >
              <div>
                <div className={styles.wyc_title_max}>{item.data.cardName}</div>
                {/* <div className={styles.wyc_title_mid}>{item.data.name}</div>
                <div className={styles.wyc_title_min}><span>特殊折扣:</span><span>{item.data.discount}</span></div>
                <div className={styles.wyc_title_min}><span>消耗余额:</span><span>￥{item.data.amount}</span></div>
                <div className={styles.wyc_title_min}><span>抵扣金额:</span><span>￥{item.data.deduction}</span></div>
                <div className={styles.wyc_title_min}><span>卡余额:</span><span>￥{item.data.rechargeMoney}</span></div> */}
                <div className={styles.wyc_consume}>每使用1元,产生{item.data.consume}消耗</div>
                <div className={styles.wyc_useBalance}><span>使用余额:</span><span>￥{item.data.useBalance}</span></div>
              </div>
            </Spin>
          </div>
        })
      )
    }
  }
  // 混合支付外层的hover事件
  onMouseEnterPlus = (index,paymentLogs,record) => {
    this.setState({
      payDetailShowPlus: index,
    }, ()=>{
      this.renderPayDetailPlus(paymentLogs, record)
    })
  }
  // 混合支付外层的hover事件
  onMouseLeavePlus = () => {
    this.setState({
      payDetailShowPlus: -1,
    })
  }
  // 包括卡类型的混合支付渲染内容
  renderPayDetailPlus = async (paymentLogs, rowTtem) => {
    // console.log('结算方式', paymentLogs)
    let hasCardArray = []
    let nohasCardArray = []
    paymentLogs.forEach(_ => {
      if (_.payment_type === 2 || _.payment_type === 3) {//充值卡或者计次卡的时候
        hasCardArray.push(_)
      } else {
        nohasCardArray.push(_)
      }
    })
    // console.log(hasCardArray, nohasCardArray, '两个数组')
    let rdArray = await Promise.all(hasCardArray.map(async v => {
      let parameter = {}
      parameter.orderId = this.props.selectList.order.id
      parameter.clientCardId = v.client_card_id
      parameter.type = v.payment_type === 2 ? 2 : 1  // payment_type ：2 计次卡 ， 3：充值卡（赠送卡）
      parameter.projectId = rowTtem.type * 1 === 1 ? rowTtem.id : 0 // rowTtem.type 为 1-项目， 2-产品
      parameter.productId = rowTtem.type * 1 === 2 ? rowTtem.id : 0
      return await this.getClientCardInfo(parameter)
    }))

    // console.log(rdArray,'------')
    const renderContent = <div className={styles.wyc_min_tc}  onMouseLeave={this.onMouseLeavePlus.bind(this)}   >
        <div>
        {
          rdArray&&rdArray.map(v=>{
            return (
              <div>
                  <div className={styles.wyc_title_max} >{v.cardName}</div>
                  {(v.useNum||v.useNum===0)&&(<div className={styles.wyc_title_mid}>{v.name}</div>)}
                  {(v.useNum||v.useNum===0)&&(<div className={styles.wyc_title_min}><span>剩余次数:</span><span>{v.oldNum*1 === -1 ? "无限" : v.oldNum}-{v.useNum}={v.newNum*1 === -1 ? "无限" : v.newNum}</span></div>)}
                  {(v.consume||v.consume===0)&&(<div className={styles.wyc_consume}>每使用1元,产生{v.consume}消耗</div>)}
                  {(v.useBalance||v.useBalance===0)&&(<div className={styles.wyc_useBalance} style={{marginBottom:'5px'}}><span>使用余额:</span><span>￥{v.useBalance}</span></div>)}
              </div>
            )
          })
        }
        {
          nohasCardArray&&nohasCardArray.map(v=>{
            return (
              <div>
                  <div className={styles.wyc_title_max}>{v.payment_name}</div>
                  <div className={styles.wyc_mix_paymoney}>￥{v.payment_money}</div>
              </div>
            )
          })
        }
        </div>
    </div>
    this.setState({
      renderContent,
    })
  }

  getClientCardInfo = async (parameter ) => {
    let result = await services.clientCardInfo({
      keys: { name: "store/clientCardInfo" },
      data: parameter,
    })
    return result.list
  }

  rendertotal = (arr) => {
    let count = 0 // 数量
    let totalprice = 0 // 总价
    let actuallyPaid = 0 // 实收
    let consume = 0 // 消耗
    let production = 0 // 产值
    arr.forEach(v => {
      count += v.count * 1
      totalprice += v.price * 1
      actuallyPaid += v.actuallyPaid * 1
      consume += v.consume * 1
      production += v.production * 1
    })
    return (
      <div className={styles.wyc_totaldiv}>
        <span style={{ width: '6%', padding: '0 8px' }}>总计</span>
        <span style={{ width: '18%', padding: '0 8px' }}></span>
        <span style={{ width: '6%', padding: '0 8px' }}>{count || 0}</span>
        <span style={{ width: '7%', padding: '0 8px' }}></span>
        <span style={{ width: '6%', padding: '0 8px' }}></span>
        <span style={{ width: '7%', padding: '0 8px' }}>{(totalprice || 0).toFixed(2)}</span>
        <span style={{ width: '9%', padding: '0 8px' }}></span>
        <span style={{ width: '7%', paddingLeft: '25px' }}>{(actuallyPaid || 0).toFixed(2)}</span>
        <span style={{ width: '7%', paddingLeft: '40px' }}>{(consume || 0).toFixed(2)}</span>
        <span style={{ width: '7%', paddingLeft: '40px' }}>{(production || 0).toFixed(2)}</span>
        <span style={{ width: '10%', padding: '0 8px' }}></span>
        <span style={{ width: '10%', padding: '0 8px' }}></span>
      </div>
    )
  }
  // 跳转
  toStockDetail(productName) {
    const query = { productName }
    router.push({ pathname: "/boss-store/stock-detail", query })
  }
  render() {
    const { selectList } = this.props

    const { payDetailShow, payDetailShowPlus , renderContent } = this.state
    console.log(selectList.services)

    return (<div className={styles.zl_listFour} >
      <p> <i className={styles.zl_blueD} ></i>服务信息  </p>
      <Table
        dataSource={selectList.services}
        pagination={false}
        rowKey={record => record.id || 1}
      >
        <Column
          title="类型"
          dataIndex="index"
          key="index"
          align='left'
          width='6%'
          render={(text, record, index) => record.type * 1 === 1 ? <span>项目</span> : <span>产品</span>}
        />
        <Column
          title="服务"
          dataIndex="projectName"
          key="projectName"
          align='left'
          width='18%'
          render={(text, record, index) => (
            record.type * 1 === 1 ?
              <span>{record.projectName} <br />
                {record.isOutside * 1 === 1 && <span onClick={this.toStockDetail.bind(this, record.projectName)}><span className={styles.wyc_outside}>外采</span><span className={styles.wyc_outside_txt}>{record.lastSupplier}</span></span>}
              </span>
              :
              <span>
                {record.productName}&nbsp;{record.commodityCode}<br />
                {record.isOutside * 1 === 1 && <span onClick={this.toStockDetail.bind(this, record.productName)}><span className={styles.wyc_outside}>外采</span><span className={styles.wyc_outside_txt}>{record.lastSupplier}</span></span>}
              </span>
          )}
        />
        <Column
          title="数量"
          dataIndex="count"
          key="count"
          align='left'
          width='6%'
        />
        <Column
          title="单价"
          dataIndex="everyPrice"
          key="everyPrice"
          align='left'
          width='7%'
        />
        <Column
          title="折扣"
          dataIndex="discount"
          key="discount"
          align='left'
          width='6%'
          render={(text, record) => (
            <div>
              {record.discount * 1 === 10.00 ? 10 : record.discount}
            </div>
          )}
        />
        <Column
          title="总价"
          dataIndex="price"
          key="price"
          align='left'
          width='7%'
        />
        <Column
          title="结算方式"
          dataIndex="paymentLogs"
          key="paymentLogs"
          align='left'
          width='10%'
          render={  (text, record, index) => {

            if (record.paymentLogs.length > 1) {//此时为混合支付方式渲染
              const cardType = record.paymentLogs.some(_ => _.payment_type === 2 || _.payment_type === 3)
              if (cardType) {
                //混合支付-包括卡类型支付
                return (
                  <div onMouseLeave={this.onMouseLeavePlus.bind(this)}>
                    <span>混合支付</span><span className={styles.wyc_qipao} onMouseEnter={this.onMouseEnterPlus.bind(this, index,record.paymentLogs,record)} >?</span>
                    <span style={{ position: 'relative' }}>{payDetailShowPlus === index && renderContent }</span>
                  </div>
                )
              } else {
                //混合支付-不包括卡类型支付
                return <span>混合支付</span>
              }
            } else {// 此时为单个支付方式渲染
              return record.paymentLogs.map((item, idx) => {
                return (
                  <div onMouseLeave={this.onMouseLeave.bind(this)}   >
                    {item.payment_name.length > 10 ?
                      (<Tooltip title={item.payment_name}>
                        <span className={styles.wyc_paymethod} >
                          {item.payment_name.slice(0, 10)}...
                                                          </span>
                      </Tooltip>)
                      :
                      <span className={styles.wyc_paymethod} >
                        {item.payment_name}
                      </span>
                    }
                    {(item.payment_type === 2 || item.payment_type === 3) && <span className={styles.wyc_qipao} onMouseEnter={this.onMouseEnter.bind(this, index, idx)} >?</span>}
                    <span style={{ position: 'relative' }}>{payDetailShow === String(index) + String(idx) && this.renderPayDetail(item.client_card_id, String(index) + String(idx), item.payment_type, record)}</span>
                  </div>
                )
              })
            }

          }
          }
        />
        <Column
          title="实收"
          dataIndex="actuallyPaid"
          key="actuallyPaid"
          align='left'
          width='8%'
        />
        <Column
          title="消耗"
          dataIndex="consume"
          key="consume"
          align='left'
          width='7%'
        />
        <Column
          title="产值"
          dataIndex="production"
          key="production"
          align='left'
          width='7%'
        />
        <Column
          title="施工人员"
          dataIndex="construction"
          key="construction"
          align='left'
          width='10%'
          render={(text, record, index) => (
            <div>
              {this.renderPerson(selectList.services, 'construction', index)}
            </div>
          )}

        />
        <Column
          title="销售人员"
          dataIndex="salePerson"
          key="salePerson"
          align='left'
          width='10%'
          render={(text, record, index) => (
            <div>
              {this.renderPerson(selectList.services, 'salePerson', index)}
            </div>
          )}
        />
      </Table>
      {this.rendertotal(selectList.services || [])}
      {/* 产品表格 */}
      {/* <Table
                            dataSource={ selectList.product }
                            pagination={false}
                            rowKey={record => record.id || 2 }
                            style={{ paddingLeft:'20px',paddingRight:'20px' }}
                          >
                                <Column
                                    title="序号"
                                    dataIndex="index"
                                    key="index"
                                    align='left'
                                    width='6%'
                                    render={(text,record,index) => index + 1}
                                    />
                                <Column
                                    title="产品名称"
                                    dataIndex="productName"
                                    key="productName"
                                    align='left'
                                    width='14%'
                                    />
                                <Column
                                    title="编号"
                                    dataIndex="orderId"
                                    key="orderId"
                                    align='left'
                                    width='10%'
                                    />
                                <Column
                                    title="编码"
                                    dataIndex="commodityCode"
                                    key="commodityCode"
                                    align='left'
                                    width='10%'
                                    />
                                 <Column
                                    title="施工"
                                    dataIndex="construction"
                                    key="construction"
                                    align='left'
                                    width='10%'
                                    render={ (text,record,index)=>(
                                        <div>
                                        { this.renderPerson(selectList.product,'construction',index) }
                                        </div>
                                    ) }
                                    />
                                 <Column
                                    title="销售"
                                    dataIndex="salePerson"
                                    key="salePerson"
                                    align='left'
                                    width='10%'
                                    render={ (text,record,index)=>(
                                        <div>
                                        { this.renderPerson(selectList.product,'salePerson',index) }
                                        </div>
                                    ) }
                                    />
                                <Column
                                    title="单价"
                                    dataIndex="everyPrice"
                                    key="everyPrice"
                                    align='left'
                                    width='10%'
                                    />
                                <Column
                                    title="数量"
                                    dataIndex="count"
                                    key="count"
                                    align='left'
                                    width='10%'
                                    />
                                 <Column
                                    title="单位"
                                    dataIndex="unit"
                                    key="unit"
                                    align='left'
                                    width='10%'
                                    />
                                 <Column
                                    title="折扣"
                                    dataIndex="discount"
                                    key="discount"
                                    align='left'
                                    width='10%'
                                    render={ (text,record)=>(
                                        <div>
                                           { record.discount*1===10.00 ? 10 : record.discount }
                                        </div>
                                    ) }
                                    />
                                 <Column
                                    title="金额"
                                    dataIndex="price"
                                    key="price"
                                    align='left'
                                    width='10%'
                                    />
                         </Table> */}
    </div>)
  }

}
export default table
