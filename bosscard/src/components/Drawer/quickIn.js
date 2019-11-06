import { Component } from 'react'
import { Modal, Form, Select, InputNumber, Input, message, Button  } from "antd"
import service from 'services'
import validate from "../../utils/validate"
import style from './style.less'


const FormItem = Form.Item
const Option = Select.Option

class QuickIn extends Component {
  
  constructor(props) {
    super(props)
    this.state = {
      supplier: [],
      warehouseList: [],
      defaultId: 0,
    }
  }

  componentWillMount() {
    // 供应商
    service.LIST({keys:{name:'erp/supplier/selector'}}).then(res => {
      if(res.code === '0') {
        this.setState({
          supplier:res.list,
        })
      }
    })
    //仓库
    service.list({keys: {name: 'store/warehouse'}, data:{q:{page:-1}}}).then(res =>{
      if(res.code === '0') {
        const defaultWarehouse = res.list.filter(item => item.isDefaultWarehouse === 1)[0]
        this.setState({
          warehouseList:res.list,
          defaultId: defaultWarehouse ? defaultWarehouse.warehouseId: '',
        })
      }
    })
  }
  
  onCancel = () => {
    this.props.form.resetFields()
    this.props.onClose()
  }
  
  onOk = (status) => {
    const { form, quickSuccess, product } = this.props
    form.validateFields((err, values) => {
      if(err) {
        return
      }else {
        let data = {
          supplier: values.supplier,
          discount: 0,
          payment: status === 3 ? 0 : values.price * values.number,
          status: status,
          products: [
            {id: product.id, warehouse_id: values.warehouse_id, price: values.price, number: values.number},
          ],
        }
        service.LIST({
          keys: {name: 'erp/stock/purchase/storage/input'},
          data: data,
          method: 'post',
        }).then(res => {
          if(res.success) {
            this.props.form.resetFields()
            message.success('添加急件成功')
            quickSuccess({...product, stock: values.number*1 + product.stock*1})
          }
        })
      }
    })
  }

  render() {

    const { getFieldDecorator } = this.props.form
    const { product } = this.props
    const { supplier, warehouseList, defaultId } = this.state
    // console.log('product', product)
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    }

    return (
      <Modal
        title={'添加急件'}
        visible={this.props.visible}
        // onOk={this.onOk}
        onCancel={this.onCancel}
        width="570px"
        height="600px"
        maskClosable={false}
        className="out-modal"
        footer={null}
      >
        <div className="overflow-box">
          <Form >
            <FormItem
              label="产品名称"
              style={{height: 60}}
              {...formItemLayout}
            >
              <Input size='large' placeholder="产品名称" value={product.name + `(${product.commodityCode})`} disabled></Input>
            </FormItem>
            <FormItem
              label="供应商"
              style={{height: 60}}
              {...formItemLayout}
            >
              {getFieldDecorator('supplier',{  
                rules: [{
                  required: true, message: '请选择供应商',
                }],
              })(
                <Select placeholder="供应商" size='large'>
                  {
                    supplier.map(item => (
                      <Option key={item.id} value={item.id}>{item.name}</Option>
                    ))
                  }
                </Select>
              )}
            </FormItem>
            <FormItem
              label="入库数量"
              style={{height: 60}}
              {...formItemLayout}
            >
              {getFieldDecorator(
                "number",
                validate("入库数量", { required: true, type: "select" })
              )(
                <InputNumber size="large" style={{width: '100%'}} placeholder="请输入数量"></InputNumber>
              )}
            </FormItem>
            <FormItem
              label="采购单价"
              style={{height: 60, position: 'relative'}}
              {...formItemLayout}
            >
              {getFieldDecorator('price', {
                rules: [{
                  required: true, message: '请输入金额',
                }],
              })(
                <InputNumber 
                size='large' 
                min={0}
                style={{width: '100%'}} 
                placeholder="请输入金额" 
                ></InputNumber>
              )}
              <span className={style.dark}>元</span>
            </FormItem>
            <FormItem
              label="仓库"
              style={{height: 60, position: 'relative'}}
              {...formItemLayout}
            >
              {getFieldDecorator('warehouse_id', {
                rules: [{
                  required: true, message: `请选择仓库`,
                }],
                initialValue: defaultId,
              })(
                <Select placeholder="选择仓库"  size='large'>
                    {
                      warehouseList.map(item => (
                        <Option key={item.warehouseId} value={item.warehouseId}>{item.warehouseName}</Option>
                      ))
                    }
                  </Select>
              )}
            </FormItem>
          </Form>
          <div style={{textAlign: 'right', paddingBottom: 30}}>
            <Button size='large' style={{marginRight: 20}} onClick={this.onCancel}>取消</Button>
            <Button size='large' style={{marginRight: 20}} onClick={() => this.onOk(3)}>挂账入库</Button>
            <Button size='large' type='primary' onClick={() => this.onOk(2)}>正常入库</Button>
          </div>
        </div>
      </Modal>
    )
  }
}

export default Form.create()(QuickIn)