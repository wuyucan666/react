/**
 * Created by kikazheng on 2018/11/23
 */
import React, { Component } from 'react'
import { Modal, Table, Button, message, InputNumber, Form, Input } from 'antd'
import styles from './style.less'
import services from 'services'

const FormItem = Form.Item
const { Column } = Table

class Detail extends Component {
  state = {
    status: false, // 1退货 2标记 3部分入库 4全部入库
    showRefund: false,
    showInStock: false,
    loading: true,
    hasPurchase: true,//已入库
    data: [],
    selectData: [],
    stockData: [],
    selectedRowKeys: [],
  }
  componentDidUpdate(prevPops) {
    if ((prevPops.visible !== this.props.visible) && this.props.visible) {
      this.setState({ loading: true })
      services.LIST({ keys: { name: `erp/stock/purchase/${this.props.id}` } }).then(res => {
        let hasPurchase = true
        for (let i = 0; i < res.list.length; i++) {
          if ((res.list[i].in_number + res.list[i].return_number) < res.list[i].number) {
            hasPurchase = false
            break
          }
        }
        this.setState({
          data: res.list.map(item => ({ ...item, refund: 1, goodsNum: 1 })),
          loading: false,
          hasPurchase,
        })
      })
    }
  }
  //标记为已付
  signPaid = () => {
    const { id, onCancel, dispatch } = this.props
    this.setState({ status: 2 })
    services.UPDATE({ keys: { name: `erp/stock/purchase/payState`, id: id } }).then(res => {
      this.setState({ status: false })
      if (res.success) {
        message.success('标记成功')
        onCancel()
        dispatch({
          type: 'table/getData',
          payload: { new: true },
        })
      }
    })
  }
  // 退货modal
  refund = () => {
    this.props.onCancel()
    this.setState({
      showRefund: true,
    })
  }
  // 退货选中数据
  rowSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({
      selectedRowKeys,
      selectData: selectedRows.map(item => ({ productId: item.product, num: item.refund, price: item.price, warehouseId: item.warehouse })),
    })
  }
  // 退货数量变化
  inputChange = (index, id, value) => {
    const { data, selectData } = this.state
    // data[index].refund = value
    data.filter(item => item.product === id)[0].refund = value
    const selectIndex = selectData.findIndex(item => item.productId === id)
    console.log(index,id,value, selectData)
    if (selectIndex > -1) {
      selectData[selectIndex].num = value
      console.log(selectData, selectIndex, id)
    }

    this.setState({
      data,
      selectData,
    })
  }
  hasError = (fieldsValue) => {
    const { selectData } = this.state
    const { receivedMoney, waitMoney } = fieldsValue
    if (receivedMoney > 0 && waitMoney > 0) {
      return true
    } else {
      return !selectData.length
    }
  }
  //退货
  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({ status: 1 })
        console.log('Received values of form: ', values)
        const { selectData } = this.state
        const { id, supplierId, dispatch } = this.props
        services.INSERT({
          keys: { name: `erp/reject` }, data: {
            purchaseId: id,
            supplierId: supplierId,
            ...values,
            remark: values.remark ? values.remark : '',
            data: selectData,
          },
        }).then(res => {
          this.setState({ status: false })
          if (res.success) {
            message.success('退货成功')
            this.props.form.resetFields()
            this.setState({
              showRefund: false,
              selectedRowKeys: [],
              selectData: [],
            })
            dispatch({
              type: 'table/getData',
              payload: { new: true },
            })
          }
        })
      }
    })
  }
  //全部入库
  inAllStock = () => {
    this.setState({ status: 4 })
    const { data } = this.state
    const { remark, id, dispatch, onCancel } = this.props
    services.INSERT({
      keys: { name: `erp/stock/inventory/storage/input` },
      data: {
        status: 2,
        purchaseId: id,
        remark: remark || '',
        typeId: 17,
        product: data.map(item => ({
          id: item.product,
          warehouseId: item.warehouse,
          goodsNum: item.number,
          goodsPrice: item.price,
          totalPrice: item.total_price,
          remark: item.remark,
        })),
      },
    }).then(res => {
      this.setState({ status: false })
      if (res.success) {
        message.success('入库成功')
        onCancel()
        dispatch({
          type: 'table/getData',
          payload: { new: true },
        })
      }
    })
  }
  //部分入库
  inOtherStock = () => {
    this.setState({ status: 3 })
    const { stockData } = this.state
    const { remark, id, dispatch } = this.props
    services.INSERT({
      keys: { name: `erp/stock/inventory/storage/input` },
      data: {
        status: 1,
        purchaseId: id,
        remark: remark || '',
        typeId: 17,
        product: stockData,
      },
    }).then(res => {
      this.setState({ status: false })
      if (res.success) {
        message.success('入库成功')
        this.setState({
          showInStock: false,
          stockData: [],
          selectedRowKeys: [],
        })
        dispatch({
          type: 'table/getData',
          payload: { new: true },
        })
      }
    })
  }
  //部分入库modal
  showInStock = () => {
    this.props.onCancel()
    this.setState({ showInStock: true })
  }
  //部分入库选中数据
  stockRowChange = (selectedRowKeys, selectedRows) => {
    this.setState({
      selectedRowKeys,
      stockData: selectedRows.map(item => {
        const goodsNum = item.goodsNum || parseInt(Number(item.number) - Number(item.in_number), 0)
        return {
          id: item.product,
          goodsNum,
          goodsPrice: item.price,
          totalPrice: (Number(goodsNum) * Number(item.price)).toFixed(1),
          warehouseId: item.warehouse,
          remark: item.remark,
        }
      }),
    })
  }
  //部分入库选中数据数量变化
  stockInputChange = (index, id, value) => {
    const { data, stockData } = this.state
    // data[index].goodsNum = value
    data.filter(item => item.product === id)[0].goodsNum = value
    const selectIndex = stockData.findIndex(item => item.id === id)
    if (selectIndex > -1) {
      stockData[selectIndex].goodsNum = value
    }
    this.setState({
      data,
      stockData,
    })
  }
  render() {
    const { data, loading, hasPurchase, showRefund, showInStock, stockData, selectedRowKeys, status: loadingStatus } = this.state
    const { surplus, visible, onCancel, status } = this.props
    const { getFieldDecorator, getFieldsValue } = this.props.form
    const detailFooter = (
      <div className={styles.searchBox}>
        <div>
          <Button size='large' onClick={this.refund}>退货</Button>
          {
            surplus > 0 &&
            <span>
              <Button size='large' style={{ margin: '0 16px 0 24px' }} loading={loadingStatus === 2} onClick={this.signPaid}>标记为已付</Button>
              <span style={{ color: '#FF6F28' }}>待付：￥{surplus}</span>
            </span>
          }
        </div>
        {
          (!hasPurchase) &&
          <div>
            <Button size='large' onClick={this.showInStock}>部分入库</Button>
            <Button size='large' type='primary' loading={loadingStatus === 4} onClick={this.inAllStock} >全部入库</Button>
          </div>
        }
      </div>
    )
    const refundFooter = (
      <Button size='large' onClick={this.handleSubmit} loading={loadingStatus === 1} disabled={this.hasError(getFieldsValue())} type='primary'>提交退货</Button>
    )
    const stockFooter = (
      <div>
        <span>已选{stockData.length}种商品</span>
        <Button size='large' disabled={!stockData.length} loading={loadingStatus === 3} onClick={this.inOtherStock} type='primary'>入库</Button>
      </div>
    )
    return (
      <div>
        <Modal
          title="采购单明细"
          loading={loading}
          width={900}
          visible={visible}
          footer={status === 4 ? null : detailFooter}
          onCancel={onCancel}
        >
          <Table
            dataSource={data}
            pagination={false}
            rowKey={record => record.id}
            scroll={{ y: 364 }}
          >
            <Column
              title="序号"
              dataIndex="index"
              align='left'
              key="index"
              width='10%'
              render={(text, record, index) => {
                return index + 1
              }}
            />
            <Column
              title="商品"
              dataIndex="name"
              align='left'
              key="name"
              width='10%'
            />
            <Column
              title="编码"
              dataIndex="commodityCode"
              align='left'
              key="commodityCode"
              width='10%'
            />
            <Column
              title="单价"
              dataIndex="price"
              align='left'
              key="price"
              width='10%'
            />
            <Column
              title="数量"
              dataIndex="number"
              align='left'
              key="number"
              width='10%'
              render={(text, record) => {
                return record.number - record.return_number
              }}
            />
            <Column
              title="合计"
              dataIndex="total_price"
              align='left'
              key="total_price"
              width='10%'
            />
            <Column
              title="仓库"
              dataIndex="warehouse_name"
              align='left'
              key="warehouse_name"
              width='10%'
            />
            <Column
              title="已入库数量"
              dataIndex="in_number"
              align='left'
              key="in_number"
              width='15%'
            />
            <Column
              title="备注"
              dataIndex="remark"
              align='left'
              key="remark"
              width='25%'
            />
          </Table>
        </Modal>
        <Modal
          title="退货"
          width={900}
          visible={showRefund}
          footer={refundFooter}
          onCancel={() => {
            this.setState({
              showRefund: false,
              selectedRowKeys: [],
              selectData: [],
            })
          }}
        >
          <Table
            dataSource={
              data.filter(item => item.allow_return_number > 0)
            }
            rowSelection={{
              selectedRowKeys,
              onChange: this.rowSelectChange,
            }}
            pagination={false}
            rowKey={record => record.id}
            scroll={{ y: 364 }}
          >
            <Column
              title="序号"
              dataIndex="index"
              key="index"
              width={78}
              align='left'
              render={(text, record, index) => {
                return index + 1
              }}
            />
            <Column
              title="商品"
              dataIndex="name"
              key="name"
              align='left'
              width={186}
            />
            <Column
              title="采购价"
              dataIndex="price"
              key="price"
              align='left'
              width={92}
            />
            <Column
              title="可退货数量"
              dataIndex="return_number"
              key="return_number"
              align='left'
              width={92}
              render={(text,record) => record.allow_return_number}
            />
            <Column
              title="退货数量"
              dataIndex="refund"
              key="refund"
              width={110}
              align='left'
              render={(text,record,index) => {
                return <InputNumber style={{width:'80px!important'}} precision={0}  min={1} max={Number(record.allow_return_number)} value={Number(record.refund)} onChange={ e => this.inputChange(index,record.product,e)}/>
              }}
            />
          </Table>
          <Form onSubmit={this.handleSubmit} layout='inline' hideRequiredMark >
            <div style={{ margin: '16px 0' }}>
              <FormItem label='退货备注' >
                {getFieldDecorator('remark')(
                  <Input size='large' style={{ width: '755px' }} placeholder="请输入备注" />
                )}
              </FormItem>
            </div>
            <FormItem label='退货后，应收金额'>
              {getFieldDecorator('receivedMoney', { initialValue: 0, rules: [{ required: true, message: '请输入金额' }] })(
                <InputNumber min={0} precision={1} size='large' style={{ width: '160px' }} />
              )}
              <span className='numberAddon'>元</span>
            </FormItem>
            <FormItem label='待付金额'>
              {getFieldDecorator('waitMoney', { initialValue: 0, rules: [{ required: true, message: '请输入金额' }] })(
                <InputNumber min={0} precision={1} size='large' addonAfter='元' style={{ width: '160px' }} />
              )}
              <span className='numberAddon'>元</span>
            </FormItem>
          </Form>
        </Modal>
        <Modal
          title="部分入库"
          width={900}
          visible={showInStock}
          footer={stockFooter}
          onCancel={() => {
            this.setState({
              showInStock: false,
              selectedRowKeys: [],
              stockData: [],
            })
          }}
        >
          <Table
            dataSource={
              data.filter(item => parseInt(Number(item.number) - Number(item.in_number) - Number(item.return_number), 0) > 0)
            }
            rowSelection={{
              selectedRowKeys,
              onChange: this.stockRowChange,
            }}
            pagination={false}
            rowKey={record => record.id}
            scroll={{ y: 364 }}
          >
            <Column
              title="序号"
              dataIndex="index"
              key="index"
              width={78}
              align='left'
              render={(text, record, index) => {
                return index + 1
              }}
            />
            <Column
              title="商品"
              dataIndex="name"
              key="name"
              align='left'
              width={186}
            />
            <Column
              title="采购价"
              dataIndex="price"
              key="price"
              align='left'
              width={92}
            />
            <Column
              title="待入库数量"
              dataIndex="waitNumber"
              key="waitNumber"
              width={92}
              align='left'
              render={(text, record) => parseInt(Number(record.number) - Number(record.in_number) - Number(record.return_number), 0)}
            />
            <Column
              title="本次入库数量"
              dataIndex="goodsNum"
              key="goodsNum"
              width={110}
              align='left'
              render={(text, record, index) => {
                return <InputNumber style={{ width: '108px!important' }} precision={0} min={1} max={parseInt(Number(record.number) - Number(record.in_number) - Number(record.return_number), 0)} value={record.goodsNum} onChange={e => this.stockInputChange(index, record.product, e)} />
              }}
            />
          </Table>
        </Modal>
      </div>
    )
  }
}

export default Form.create()(Detail)
