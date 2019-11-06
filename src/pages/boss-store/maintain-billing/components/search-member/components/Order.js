/**
 * Created by kikazheng on 2019/5/22
 */
import React,{Component} from 'react'
import {Table, Modal, Button, message} from 'antd'
import { connect } from 'dva'
import moment from 'moment'
import router from 'umi/router'

import { __PROJECT_TYPE__, __PRODUCT_TYPE__ } from "utils/globalConfig"
import styles from '../index.less'
import services from "../../../../../../services"

const { Column } = Table

class Order extends Component{
  //结算订单
  toPay = (orderId, orderType) => {
    const { dispatch, hasAccountPermission } = this.props
    if(!hasAccountPermission) {
      message.error('您没有结账权限，请联系管理人员设置权限!')
      return
    }
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
            router.push("/boss-store/speedy-billing")
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
            this.props.onOk()
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
                    type: __PROJECT_TYPE__,
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
            router.push("/boss-store/speedy-billing")
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
            await dispatch({
              type: "maintainBilling/changeStatus",
              payload: { key: "isFromOrder", value: true },
            })
            this.props.onOk()
          }
        })
    }
  }
  render(){
    const {visible, data, plate, onOk} = this.props
    return(
      <Modal
        visible={visible}
        closable={false}
        footer={null}
        maskClosable={false}
        width={740}
      >
        <div className={styles.tip}><i className='iconfont icon-tishi'/></div>
        <div className={styles.desc}><span>{plate}</span>已经存在{data.length}个进行中的订单，请确定已经重复的订单，避免重复提交</div>
        <Table
          dataSource={data}
          rowKey={record => record.id}
          pagination={false}
          scroll={{y: 410}}
        >
          <Column
            title="创建时间"
            dataIndex="created"
            key="created"
            width='25%'
            render={text => moment(text * 1000).format('YYYY-MM-DD HH:mm')}
          />
          <Column
            title="类型"
            dataIndex="orderType"
            key="orderType"
            width='10%'
            render={text => text*1 ===3 ? <span className={styles.zl_wxList}>维修</span> : (text*1 === 4 ? <span className={styles.zl_KjList}>快捷</span> : '')}
          />
          <Column
            title="包含服务"
            dataIndex="good"
            key="good"
            width='40%'
            className={styles.wyc_good}
            render={(text, record) => (
              <div>
                {
                  record.project.concat(record.product).map(item => item.projectName || item.productName).join('/')
                }
              </div>
            )}
          />
          <Column
            title="操作"
            dataIndex="action"
            key="action"
            width='30%'
            render={(text, record) => (
              <div className={styles.action}>
                <span onClick={this.updateOrder.bind(this, record.orderId, record.orderType)}>修改订单</span>
                {(record.state !== 1 && record.state !== 2 && record.staffState) && (
                  <span onClick={this.toPay.bind(this, record.orderId, record.orderType)}>去结账</span>
                )}
              </div>
            )}
          />
        </Table>
        <div className={styles.btn}>
          <Button size='large' onClick={onOk}>忽略，继续开单</Button>
        </div>
      </Modal>
    )
  }
}

export default connect( ({ app }) => app )(Order)
