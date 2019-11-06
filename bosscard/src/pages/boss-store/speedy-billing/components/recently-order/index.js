import React,{ Component } from 'react'
import { Modal, Button, Table, InputNumber, message, Spin, Empty } from 'antd'
import styles from './style.less'
import moment from 'moment'
import services from '../../../../../services'
import router from 'umi/router'
import Review from '../modal-return'
import Surplus from './components/Surplus'
import empty  from '../images/no_information.jpg'

const { Column } = Table

class Rencently extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      tableData: [],
      data: [],
      loading: false,
      showReview: false,
      maintainServiceId: 0,
      curItem: {
        returnVisit: {
          normal: {

          },
          abnormal: {
            sentTime: moment().unix() + (86400 * 7),
          },
        },
      },
      showSurplus: false,
      surplusData: [],
    }
  }
  UNSAFE_componentWillReceiveProps(nextProps){
    if(nextProps.data){
      this.setState({data: nextProps.data})
    }
  }
  componentDidMount(){
    const {data} = this.props
    if(!data){
      this.getRecently()
    }else {
      this.setState({data})
    }
  }
  getRecently = () => {
    this.setState({loading: true})
    services.LIST({
      keys: { name: "maintain/recently" },
      data: { q: { page: 1, limit: 3, where: {type: 4} } },
    }).then(res => {
      this.setState({loading: false})
      if(res.success){
        this.setState({
          data: res.list,
        })
        if(res.list.length){
          this.props.setOrder && this.props.setOrder()
        }
      }
    }).catch(() => {
      this.setState({loading: false})
    })
  }
  changeNum = (productId,value) => {
    const {tableData} = this.state
    const index = tableData.findIndex(item => item.productId === productId)
    tableData[index].lockerNum = value
    this.setState({tableData})
  }
  showModal = (data) => {
    const { services, orderId,  clientId} = data
    this.setState({
      visible: true,
      tableData: services.filter(item => item.type === 2).map(item => ({...item,lockerNum: 1,orderId:Number(orderId),clientId})),
    })
  }
  hideModal = () => {
    this.setState({
      visible: false,
    })
  }
  handleOk = () => {
    const { tableData } = this.state
    const data = tableData.map(item => ({
      orderId: item.orderId,
      clientId: item.clientId,
      productId: item.productId,
      lockerNum: item.lockerNum,
    }))
    services.INSERT({keys:{name: 'erp/inventoryLocker'}, data:{data}}).then(res => {
      if(res.success){
        message.success('寄存成功')
        this.hideModal()
        this.getRecently()
      }
    })
  }
  goDetail = () => {
    router.push('/boss-store/deposit-details')
  }
  showReview = (type, id, staffId, staffName, maintainServiceId) => {
    if(type === 1){ // 项目
      services.LIST({
        keys: {name: `returnVisit/maintain/${id}`},
        data: {maintainServiceId},
      }).then(res => {
        if(Array.isArray(res.data)){ //未设置
          this.setState({
            maintainServiceId,
            curItem: {
              returnVisit: {
                normal: {

                },
                abnormal: {
                  sentTime: moment().unix() + (86400 * 7),
                  staffId,
                  staffName,
                },
              },
            },
            showReview: true,
          })
        }else {
          this.setState({
            maintainServiceId,
            curItem: {
              returnVisit: {
                normal: {
                  ...res.data,
                },
                abnormal: {
                  sentTime: moment().unix() + (86400 * 7),
                  staffId,
                  staffName,
                },
              },
            },
            showReview: true,
          })
        }
      })
    }else {
      this.setState({
        maintainServiceId,
        curItem: {
          returnVisit: {
            normal: {

            },
            abnormal: {
              sentTime: moment().unix() + (86400 * 7),
              staffId,
              staffName,
            },
          },
        },
        showReview: true,
      })
    }
  }
  hideReview = () => {
    this.setState({
      showReview: false,
    })
  }
  reviewOk = (values) => {
    const { maintainServiceId} = this.state
    const data = {
      maintainServiceId,
      abnormal: {
        ...values,
        sentTime: moment(values.sentTime).unix(),
      },
    }
    services.INSERT({
      keys: {name: `returnVisit/maintain`},
      data,
    }).then((res) => {
      if(res.code === '0'){
        message.success('设置成功')
        this.hideReview()
        this.getRecently()
      }
    })
  }
  toSurplus = (data) => {
    let productList = data.services.filter(item => item.type === 2)
    let surplusData = []
    // 去重
    productList.forEach(item => {
      let idx = surplusData.find(_ => _.productId === item.productId)
      if(!idx || idx === -1) {
        surplusData.push(item)
      }
    })
    this.setState({
      showSurplus: true,
      orderId: data.orderId,
      surplusData: surplusData,
    })
  }
  hideSurplus = () => {
    this.setState({
      showSurplus: false,
    })
  }
  onOk = (data) => {
    const { orderId } = this.state
    services.INSERT({
      keys: { name: 'erp/stock/after/order/input' },
      data: { ...data, orderId },
    }).then(res => {
      if(res.success) {
        message.success('结余入库成功!')
        this.setState({showSurplus: false})
      }
    })
  }
  render() {
    const { showBtn, print } = this.props
    const { visible, tableData, data, loading, showReview, curItem, showSurplus, surplusData } = this.state
    return(
      <Spin spinning={loading}>
        {
          (!data.length) ? (
            <div style={{textAlign: 'center'}}><img src={empty} alt="" style={{margin:'0 auto'}}/><br />无最近开单</div>
          ):(
            <div>
              <div className={styles.tableBody}>
                {
                  data.map(item => (
                    <div className={styles.project} key={item.id}>
                      <div className={styles.projectHead}>
                        <div>
                          <span className={item.orderType === 4 ? `${styles.classify} ${styles.speedy}` : `${styles.classify} ${styles.normal}`}>
                            {item.orderType === 4 ? '快捷' : '维修'}
                          </span>
                          <span className={styles.imgBox}>
                            <img src={item.icon.requestAddress} alt="车标"/>
                          </span>
                          <span className={styles.plate}>{item.plate}</span>
                          <span className={styles.infoItem}>{item.model}</span>
                          <span className={styles.infoItem}>{item.name ? item.name : '散客'}</span>
                          <span className={styles.infoItem}>{item.phone ? item.phone : ''}</span>
                        </div>
                        <div>
                          <span className={styles.no}>订单号：{item.orderId}</span>
                          <span>{moment(item.created  * 1000).format('YYYY-MM-DD HH:mm')}</span>
                        </div>
                      </div>
                      <div className={styles.projectInfo}>
                        <div className={styles.infoBox}>
                          {
                            item.services.map((item2,index) => (
                              <div className={styles.projectItem} key={index}>
                                <div className={styles.name}>
                                  <span style={{marginRight: 8}}>{item2.name}</span>
                                  {
                                    item2.carName && <span className={styles.carName}>{item2.carName}</span>
                                  }
                                </div>
                                <div className={styles.num}>×{item2.num}</div>
                                <div className={styles.price}>￥{item2.money}</div>
                                <div className={styles.sales}>{item2.salesman.map(item => (`${item.staff_name}${item.scale}%`)).join(' / ')}</div>

                                  <div className={styles.review}>
                                    {!item2.visit && showBtn && (
                                      <span  onClick={() => this.showReview(item2.type, item2.productId || item2.projectId, item.counselorId, item.counselorName, item2.maitnainServiceId,)}>添加回访</span>
                                    )}
                                  </div>

                              </div>
                            ))
                          }
                        </div>
                        <div  className={styles.infoBox}>
                          <div className={styles.total}>￥ {item.total}</div>
                          <div className={styles.payType}>
                            {item.payType.map(item => (`${item.name}￥${item.paymentMoney}`)).join(' / ')}
                          </div>
                        </div>
                        <div  className={styles.infoBox}>
                          {
                            showBtn && (
                              <div style={{display: 'flex',paddingRight:11,justifyContent:'center'}}>
                                 <span className={styles.action} onClick={() => print(item.orderType, item.orderId)}>
                                    打印
                                  </span>
                                {
                                  item.name && (item.services.filter(item2 => item2.type === 2).length > 0) && (
                                    <div>
                                      {
                                        (!item.deposit) ? (
                                          <span className={styles.action} onClick={() => this.showModal(item)}>
                                               寄存
                                             </span>
                                        ):(
                                          <span className={styles.action} onClick={this.goDetail}>
                                              查看寄存
                                             </span>
                                        )
                                      }
                                    </div>
                                  )
                                }
                                {
                                  item.services.filter(item2 => item2.type === 2).length > 0 && (
                                    <span className={styles.action} onClick={() => this.toSurplus(item)}>结余入库</span>
                                  )
                                }
                              </div>
                            )
                          }
                        </div>
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
          )
        }
        {
          showReview && (
            <Review
              visible={showReview}
              curItem={curItem}
              onOk={this.reviewOk}
              onCancel={this.hideReview}
            />
          )
        }
        <Modal
          title='商品寄存'
          width={900}
          visible={visible}
          onCancel={this.hideModal}
          footer={
            <Button  type="primary"  size='large' disabled={!tableData.length} onClick={this.handleOk}>
              确认寄存
            </Button>
          }
        >
          <Table
            rowKey={record => record.productId}
            dataSource={tableData}
            pagination={false}
          >
            <Column
              title="产品"
              dataIndex="name"
              key="name"
              align='left'
              width='40%'
            />
            <Column
              title="订单数量"
              dataIndex="num"
              key="num"
              align='left'
              width='30%'
            />
            <Column
              title="寄存数量"
              dataIndex="lockerNum"
              key="lockerNum"
              align='left'
              width='30%'
              render={(text, record)=>{
                return(
                  <InputNumber
                    style={{width: 108}}
                    value={record.lockerNum}
                    precision={0}
                    min={1}
                    max={record.num}
                    onChange={value => this.changeNum(record.productId, value)}
                  />
                )
              }}
            />
          </Table>
        </Modal>
        <Surplus
          visible={showSurplus}
          data={surplusData}
          onCancel={this.hideSurplus}
          onOk={this.onOk}
        />
      </Spin>
    )
  }
}

Rencently.defaultProps = {
  showBtn: true,
}

export default Rencently
