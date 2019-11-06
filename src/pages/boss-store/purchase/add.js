/**
 * Created by kikazheng on 2018/11/24
 */
import React, { Component } from 'react'
import router from "umi/router"
import MenuTable from 'components/MenuTable'
import { Button, Form, Select, Icon, Table, Input, InputNumber, message } from 'antd'
import styles from './style.less'
// import validate from "../../../utils/validate"
import services from 'services'
import Tabbar from 'components/Tabbar'
import SelectPrivider from './selectProvider'
import Tkbox from './Tkbox'

const FormItem = Form.Item
const Option = Select.Option
const { Column } = Table

class Add extends Component {
  state = {
    pay: 0,//应付
    charge: 0,//挂账
    discount: 0,//优惠
    payment: 0,//本次付款
    data: [],
    warehouseList: [],
    defaultId: '',
    loading: false,
    visible: false,
    isOpen: false,
    selectPro: { name: '' },
  }
  componentDidMount() {
    services.list({ keys: { name: 'store/warehouse' }, data: { q: { page: -1 } } }).then(res => {
      const defaultWarehouse = res.list.filter(item => item.isDefaultWarehouse === 1)[0]
      this.setState({
        warehouseList: res.list,
        defaultId: defaultWarehouse ? defaultWarehouse.warehouseId : '',
      })
    })
    const { editItem } = this.props
    if (editItem.id) {
      let pay = 0
      editItem.products.forEach(item => {
        pay += Number(item.total_price)
      })
      this.setState({
        pay,
        charge: editItem.surplus,
        discount: editItem.discount,
        payment: editItem.payment,
        data: editItem.products.map(item => ({
          ...item,
          avgPrice: item.price,
          total: item.total_price,
        })),
      })
    }
  }

  goMaintain = () => {
    const { dispatch, backRoute } = this.props
    setTimeout(() => {
      router.push({ pathname: backRoute })
    }, 300)
    dispatch({
      type: "app/changeStatus",
      payload: { key: "isAdding", value: false },
    })
    dispatch({
      type: "app/changeStatus",
      payload: { key: "isdone", value: true },
    })
  }

  changeData = (selectData) => {
    const { data, defaultId } = this.state
    const newData = selectData.map(item => ({
      ...item,
      number: 1,
      total: item.avgPrice,
      warehouse_id: defaultId ? defaultId : undefined,
    }))

    newData.forEach((item, index) => {
      data.forEach((item2, index2) => {
        if (item.id === item2.id) {
          newData[index] = data[index2]
        }
      })
    })
    this.changeMoney(newData)
  }
  handleChange = (index, property, value) => {
    const { data } = this.state
    data[index][property] = value
    data[index].total = (data[index]['number'] * data[index]['avgPrice']).toFixed(1)
    this.changeMoney(data)
  }
  handleDel = (index) => {
    const { data } = this.state
    const { editItem } = this.props
    if (!editItem.id) {//添加时的删除
      data.splice(index, 1)
      this.changeMoney(data)
    } else {//修改时的删除
      services.DELETE({ keys: { name: 'erp/stock/purchase/product', id: data[index].detail_id } }).then(res => {
        if (res.success) {
          message.success('删除成功')
          data.splice(index, 1)
          this.changeMoney(data)
        }
      })
    }

  }
  changeMoney = (data) => {
    let pay = 0
    data.forEach(item => {
      pay += Number(item.total)
    })
    const { discount, payment } = this.state
    const charge = (pay - Number(discount) - Number(payment)) <= 0 ? 0 : (pay - Number(discount) - Number(payment))
    this.setState({
      data,
      charge: charge.toFixed(1),
      pay: pay.toFixed(1),
    })
  }
  changePay = (property, val) => {
    this.setState({ [property]: val ? val : 0 }, () => {
      const { discount, payment, pay } = this.state
      const charge = (pay - discount - payment) <= 0 ? 0 : (pay - discount - payment).toFixed(1)
      this.setState({ charge })
    })
  }
  //改变状态
  componentWillUnmount() {
    const { dispatch } = this.props
    dispatch({
      type: 'storeAdjustment/urgent',
      payload: { status: false },
    })
  }
  handleSubmit = (status) => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log(values, status)
        const { supplier } = values
        const { data, discount, payment, pay } = this.state
        const { isAdding, urgent } = this.props
        if (!supplier) {
          message.error('请选择供应商')
          return false
        }
        if (!data.length) {
          message.error('请添加产品')
          return false
        }
        // let priceError = false
        let error = false
        data.forEach(item => {
          if (!item.warehouse_id) {
            error = true
            return false
          }
          // if(!item.avgPrice){
          //   priceError = true
          //   return false
          // }
        })
        if (error) {
          message.error('请选择仓库')
          return false
        }
        // if(priceError){
        //   message.error('请输入正确的采购单价')
        //   return false
        // }
        if ((Number(payment) + Number(discount)) > Number(pay)) {
          message.error('付款金额有误')
          return false
        }
        this.setState({ loading: status })
        const { editItem } = this.props
        if (editItem.id) {//修改
          services.UPDATE({
            keys: { name: 'erp/stock/purchase', id: editItem.id },
            data: {
              supplier: values.supplier,
              discount,
              payment,
              status,
              remark: values.remark || '',
              products: data.map(item => ({
                id: item.id,
                detail_id: item.detail_id,
                warehouse_id: item.warehouse_id || '',
                price: item.avgPrice,
                number: item.number,
                remark: item.remark || '',
              })),
            },
          }).then(res => {
            this.setState({ loading: false })
            if (res.success) {
              message.success('修改成功')
              this.props.dispatch({
                type: 'table/getData',
                payload: { new: true },
              })
              this.props.goBack()
            }
          })
        } else { //添加
          services.INSERT({
            keys: { name: 'erp/stock/purchase' },
            data: {
              supplier: values.supplier,
              discount,
              payment,
              status,
              remark: values.remark || '',
              products: data.map(item => ({
                id: item.id,
                warehouse_id: item.warehouse_id || '',
                price: item.avgPrice,
                number: item.number,
                remark: item.remark || '',
              })),
            },
          }).then(res => {
            this.setState({ loading: false })
            if (res.success) {
              urgent ? router.push('/boss-store/maintain-list/hangUp') : null
              if (isAdding) {
                //添加急件
                this.props.dispatch({
                  type: 'table/getData',
                  payload: { new: true },
                })
                message.success('添加成功')
                this.goMaintain()
              } else {
                this.props.dispatch({
                  type: 'table/getData',
                  payload: { new: true },
                })
                message.success('添加成功')
                this.props.goBack()
              }
            }
          })
        }
      }
    })
  }
  showModal() {
    this.setState({
      visible: true,
    })
  }
  hideModal(e) {
    this.setState({
      visible: false,
    })
    if(e) {
      // 刷新供应商列表
      const {provider} = this.props
      provider()
    }
  }
  settlementMethod(v) {
    console.log('v', v)
  }
  selectPrivider(value) {
    if (value.id) {
      this.setState({
        selectPro: value,
        isOpen: true,
      })
      this.props.form.setFieldsValue({ supplier: value.id })

    }
  }
  controlIsOpen = () => {
    this.setState({
      isOpen: !this.state.isOpen,
    })
  }
  selectHide() {
    // this.setState({
    //   addShow:false,
    // })
  }
  refreshProvider() {
    console.log("add")
    this.props.provider()
  }
  render() {
    const { data, warehouseList, pay, charge, loading, isOpen } = this.state
    const { getFieldDecorator } = this.props.form
    const { dispatch, supplier, goBack, editItem, isAdding } = this.props
    return (
      <div>
        <SelectPrivider onCancel={this.selectHide.bind(this)} data={supplier} onOk={this.selectPrivider.bind(this)}></SelectPrivider>
        {/* <AddPrivider provider={this.refreshProvider.bind(this)} visible={this.state.visible} show={this.showModal.bind(this)} hide={this.hideModal.bind(this)}></AddPrivider> */}
        <Form layout='inline' hideRequiredMark>
          <div className={styles.addBtn}>
            <Button size='large' onClick={() => {
              if (isAdding) {
                this.goMaintain()
              } else {
                goBack()
              }
            }
            }> <Icon type="left" style={{ marginLeft: 0, color: '#ccc' }} /> 返回</Button>
            <FormItem label='请选择供应商' colon={false}>
              {getFieldDecorator('supplier', { initialValue: this.state.selectPro.name })(
                <Select placeholder="供应商" style={{ width: 200 }} size='large' getPopupContainer={trigger => trigger.parentNode}>
                  {
                    supplier.map(item => (
                      <Option key={item.id} value={item.id}>{item.name}</Option>
                    ))
                  }
                </Select>
              )}
            </FormItem>
            <Button size='large' type='primary' onClick={this.showModal.bind(this)}>新增供应商</Button>
          </div>
          <div className={styles.addTable}>
            <Table
              dataSource={data}
              pagination={false}
              rowKey={record => record.id}
            >
              <Column
                title="序号"
                dataIndex="index"
                key="index"
                align='left'
                width='5%'
                render={(text, record, index) => index + 1}
              />
              <Column
                title="产品名称"
                dataIndex="name"
                key="name"
                width='112px'
                align='left'
                render={(text) => <div style={{ margin: '0px', width: '112px', wordWrap: 'break-word', wordBreak: 'break-all' }}>{text}</div>}
              />
              <Column
                title="规格"
                dataIndex="spec"
                key="spec"
                align='left'
                width='8%'
              />
              <Column
                title="编码"
                dataIndex="code"
                key="code"
                align='left'
                width='112px'
                render={(text) => <div style={{ margin: '0px', width: '112px', wordWrap: 'break-word', wordBreak: 'break-all' }}>{text}</div>}
              />
              <Column
                title="仓库"
                dataIndex="warehouse_id"
                key="warehouse_id"
                align='left'
                width='18%'
                render={(text, record, index) => (
                  <Select onChange={val => this.handleChange(index, 'warehouse_id', val)} defaultValue={record.warehouse_id} placeholder="选择仓库" style={{ width: '100%', maxWidth: 230 }} >
                    {
                      warehouseList.map(item => (
                        <Option key={item.warehouseId} value={item.warehouseId}>{item.warehouseName}</Option>
                      ))
                    }
                  </Select>
                )}
              />
              <Column
                title="采购单价"
                dataIndex="avgPrice"
                key="avgPrice"
                align='left'
                width='8%'
                render={(text, record, index) => (
                  <InputNumber onChange={val => this.handleChange(index, 'avgPrice', val)} min={0} precision={1} defaultValue={Number(record.avgPrice)} style={{ width: '100%', maxWidth: 72 }} />
                )}
              />
              <Column
                title="数量"
                dataIndex="number"
                key="number"
                align='left'
                width='8%'
                render={(text, record, index) => (
                  <InputNumber onChange={val => this.handleChange(index, 'number', val)} min={1} precision={0} defaultValue={Number(record.number)} style={{ width: '100%', maxWidth: 62 }} />
                )}
              />
              <Column
                title="金额"
                dataIndex="total"
                key="total"
                align='left'
                width='8%'
              />
              <Column
                title="备注"
                dataIndex="remark"
                key="remark"
                align='left'
                width='21%'
                render={(text, record, index) => (
                  <div style={{ position: 'relative' }}>
                    <Input onChange={e => this.handleChange(index, 'remark', e.target.value)} defaultValue={record.remark} style={{ width: '80%', maxWidth: 230 }} />
                    <div className='rowbtns' style={{ position: 'absolute', right: 0, top: 5 }}>
                      <div onClick={() => this.handleDel(index)} id={styles.del} className='animated zoomIn faster' style={{ margin: '-2px 0', borderRadius: '50%' }}>
                        <i className="iconfont icon-shanchu" />
                      </div>
                    </div>
                  </div>

                )}
              />
            </Table>
          </div>
          <Tabbar >
            <div className={styles.fixBtn}>
              <div className="flex">
                <div className={styles.flexLeft}>
                  <FormItem className={styles.flexFormItem} label='应付：' colon={false} >
                    <span>￥{pay}</span>
                  </FormItem>
                  <FormItem className={styles.flexFormItem} label='优惠金额：￥' colon={false} >
                    {getFieldDecorator('discount', { initialValue: Number(editItem.discount) || 0 })(
                      <InputNumber onChange={(val) => this.changePay('discount', val)} min={0} max={Number(pay)} precision={1} size='large' style={{ width: 88 }} />
                    )}
                  </FormItem>
                  <FormItem className={styles.flexFormItem} label='本次付款：￥' colon={false} >
                    {getFieldDecorator('payment', { initialValue: Number(editItem.payment) || 0 })(
                      <InputNumber onChange={(val) => this.changePay('payment', val)} min={0} max={Number(pay)} precision={1} size='large' style={{ width: 88 }} />
                    )}
                  </FormItem>
                  <FormItem className={styles.flexFormItem} label='挂账：' colon={false}>
                    <span>￥{charge}</span>
                  </FormItem>
                  <FormItem className={`${styles.flexFormItem} flexRemark`} label='备注：' colon={false} >
                    {getFieldDecorator('remark', { initialValue: editItem.remark || '' })(
                      <Input size='large' style={{ width: '90%', maxWidth: 420 }} />
                    )}
                  </FormItem>
                </div>
                <div>
                  {
                    !isAdding && <Button size='large' loading={loading === 3} onClick={() => this.handleSubmit(3)}>挂单</Button>
                  }
                  {
                    !isAdding && <Button size='large' loading={loading === 0} onClick={() => this.handleSubmit(0)} type='primary' >提交采购</Button>
                  }
                  <Button size='large' loading={loading === 2} onClick={() => this.handleSubmit(2)} type='primary'>直接入库</Button>
                </div>
              </div>
            </div>
          </Tabbar>
        </Form>
        <MenuTable
          selectList={this.state.data}
          addproduct={this.changeData}
          api={{ getMenu: 'storeAdjustment/get', getData: 'storeAdjustment/getProductData' }}
          isOpen={isOpen}
          controlIsOpen={this.controlIsOpen}
          controlRequired={true} // 控制新建产品弹窗里面的（销售价格-销售提成-施工提成）三个字段为非必填项
        />
        <Tkbox
          visible={this.state.visible}
          hideModal={this.hideModal.bind(this)}
          dispatch={dispatch}
          type='add'
        ></Tkbox>
      </div>
    )
  }
}

export default Form.create()(Add)
