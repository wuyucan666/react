import { Modal, Button, Table, Tooltip } from 'antd'
import { connect } from "dva"
import styles from './style.less'

const confirm = ({ visible, onOk, onCancel, projectInfo, productInfo, orderInfo, workStaff, saleStaff, loading} ) => {
  const goodCol = [
    {
      title: '服务名称',
      dataIndex: 'name',
      width: '22%',
      align: 'left',
      render(text, record) {
        if(record.detailId) {
          text = text + `(${record.cardName})`
        }
        return (
          text.length > 20 ? (
            <Tooltip title={text}>{text.slice(0, 19)}...</Tooltip>
          ) : (
            text
          )
        )
      },
    },
    {
      title: '单价',
      dataIndex: 'price',
      width: '12%',
      align: 'left',
    },
    {
      title: '数量',
      dataIndex: 'num',
      width: '8%',
      align: 'left',
    },
    {
      title: '折扣',
      dataIndex: 'discount',
      width: '8%',
      align: 'left',
    },
    {
      title: '卡内抵扣',
      dataIndex: 'detailId',
      width: '12%',
      align: 'left',
      render(text, record) {
        return (
          record.detailId ? record.itemTotal : '--'
        )
      },
    },
    {
      title: '待支付',
      dataIndex: 'itemTotal',
      width: '12%',
      align: 'left',
      render(text, record) {
        return (
          record.detailId ? '0.00' : <span style={{color: '#FF6F28'}}>{record.itemTotal}</span> 
        )
      },
    },
    {
      title: '施工',
      dataIndex: 'constructors',
      width: '13%',
      align: 'left',
      render(text) {
        return (
          text && text.map((v,i) => {
            let temp = workStaff.filter(j => Number(j.id) === Number(v.id))
            return <div key={i}>{temp[0].name}</div>
          })
        )
      },
    },
    {
      title: '销售',
      dataIndex: 'salesman',
      width: '13%',
      align: 'left',
      render(text) {
        return (
          text && text.map((v,i) => {
            let temp = saleStaff.filter(j => Number(j.id) === Number(v.id))
            return <span key={i}>{temp[0].name}</span>
          })
        )
      },
    },
  ]
  return (
    <Modal
    title="确认商品"
    visible={visible}
    onOk={onOk}
    onCancel={onCancel}
    width="1000px"
    footer={<div>
      <div className={styles.tabbar + ' flex center'}>
        <div className={styles.left}>
          <span>订单金额: <b>￥{Number(orderInfo.orderAmount).toFixed(2)}</b></span>
          <span>卡内抵扣: <b>￥{Number(orderInfo.cardDeduction).toFixed(2)}</b></span>
          <span>优惠金额: <b>￥{Number(orderInfo.discountAmount.toFixed(2))}</b></span>
          <span className={styles.total}>待支付: <b>￥{Number(orderInfo.peddingPay).toFixed(2)}</b></span>
        </div>
        <div className={styles.right}>
          <Button size="large" onClick={onCancel}>取消</Button>
          <Button size="large" onClick={onOk} loading={loading}>确定</Button>
        </div>
      </div>
    </div>}
    >
    <Table
    dataSource={projectInfo.concat(productInfo)}
    columns={goodCol}
    pagination={{hideOnSinglePage: true}}
    />
    </Modal>
  )
}

export default connect(
  ({maintainBilling: { projectInfo, productInfo,totalCount, workStaff, saleStaff, orderInfo }}) => ({
    projectInfo,
    productInfo,
    totalCount,
    workStaff,
    saleStaff,
    orderInfo,
  })
)(confirm)
