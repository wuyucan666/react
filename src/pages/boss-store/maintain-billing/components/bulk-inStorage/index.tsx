import { Component } from 'react'
import { Modal, Select, Button, Table, InputNumber, message, Input } from 'antd'
import service from 'services'

const style = require("./style.less")
const Option = Select.Option

interface pageProps {
  visible: boolean,
  onOk: any,
  onCancel: any,
  data: any,
}

class BulkInStorage extends Component<pageProps> {

  state = {
    supplier: [],
    warehouseList: [],
    defaultId: 0,
    bulkId: 0, //批量设置供应商
    showNew: false, //新增供应商
    supplierName: '',
    data: [],
    showQuickIn: false,
  }

  componentWillMount() {
    // 供应商
    this.getSupplier()
    //仓库
    service.list({keys: {name: 'store/warehouse'}, data:{q:{page:-1}}}).then(res =>{
      if(res.code === '0') {
        const defaultWarehouse = res.list.filter(item => item.isDefaultWarehouse === 1)[0]
        this.setState({
          warehouseList:res.list,
          defaultId: defaultWarehouse ? defaultWarehouse.warehouseId: '',
        }, () => {
          let { data } = this.props
          const { defaultId } = this.state
          data = data.map(v => {
            return {
              soleId: v.soleId,
              id: v.id,
              name: v.name,
              commodityCode: v.commodityCode,
              price: '',
              number: v.num - v.stock,
              atLeast: v.num - v.stock,
              supplier: '',
              warehouse_id: defaultId,
            }
          })
          this.setState({data})
        })
      }
    })
  }

  getSupplier = () => {
    service.LIST({keys:{name:'erp/supplier/selector'}}).then(res => {
      if(res.code === '0') {
        this.setState({
          supplier:res.list,
        })
      }
    })
  }
  onOk = (type) => {
    let { data } = this.state
    let canSubmit = true
    data.forEach(v => {
      if(v.price === ''|| !v.supplier) {
        canSubmit = false
      }
    })
    if(!canSubmit) {
      message.error('请完善信息再提交')
      return false
    }
    this.setState({data})
    service.LIST({
      method: 'post',
      keys: {name: 'erp/stock/batch/input'},
      data: {status: type, products: data},
    }).then(res => {
      console.log(res)
      if(res.code === '0') {
        message.success("批量入库成功!")
        this.setState({
          showQuickIn: true,
        })
      }
    })
  }

  picking = () => {
    const { onOk } = this.props
    const { data } = this.state
    this.setState({quickModal: false})
    onOk(data, true)
  }

  cancel = () => {
    const { onOk } = this.props
    const { data } = this.state
    this.setState({quickModal: false})
    onOk(data, false)
  }

  changeWord = (e) => {
    this.setState({supplierName: e.target.value})
    if(e.target.value !== " " && e.target.value) {
      service.LIST({
        keys: {name: 'data/validate'},
        data: {
          model: 'Supplier',
          key: 'supplierName',
          value: e.target.value,
          _var: 2,
        }
      }).then(res => {
        if(res.code === 10200) {
          message.error(res.content)
        }
      })
    }
  }

  newOne = () => {
    const { supplierName } = this.state
    let obj = {
      supplierName,
      settlementMethod: 2,
    }
    service.insert({data: obj, keys:{'name': 'store/supplier'}}).then(res => {
      if(res.code === '0') {
        message.success("新增供应商成功")
        this.getSupplier()
        this.setState({showNew: false, supplierName: ''})
      }
    })
  }

  bulkSet = (e) => {
    let { data } = this.state
    let newData = data.map(v => {
      return {
        ...v,
        supplier: e,
      }
    })
    console.log(newData,e)
    this.setState({data: newData})
  }

  render () {
    let { visible, onCancel } = this.props
    const { supplier, warehouseList, data, showNew, supplierName } = this.state
    const changeInput = (val, item, propty) => {
      let { data } = this.state
      data.map(v => {
        if(v.soleId === item.soleId) {
          v[propty] = val
        }
        return v
      })
      this.setState({data})
    }
    const columns:any = [
      {
        title: '产品名称',
        dataIndex: 'name',
        width: '260px',
        align: 'left',
      },
      {
        title: '编码',
        dataIndex: 'commodityCode',
        width: '156px',
        align: 'left',
      },
      {
        title: '单价',
        dataIndex: 'price',
        width: '150px',
        align: 'left',
        render(val, record) {
          return <InputNumber min={0} value={val} precision={2} onChange={(e) => changeInput(e, record, 'price')}></InputNumber>
        },
      },
      {
        title: '数量',
        dataIndex: 'number',
        width: '150px',
        align: 'left',
        render(val, record) {
          return <InputNumber min={record.atLeast} value={val} onChange={(e) => changeInput(e, record, 'number')}></InputNumber>
        },
      },
      {
        title: '供应商',
        dataIndex: 'supplier',
        width: '210px',
        align: 'left',
        render(val, record) {
          return (
            <Select placeholder="供应商" style={{width: '180px'}} value={val} onChange={(e) => changeInput(e, record, 'supplier')}>
              {
                supplier.map(item => (
                  <Option key={item.id} value={item.id}>{item.name}</Option>
                ))
              }
            </Select>
          )
        },
      },
      {
        title: '仓库',
        dataIndex: 'warehouse_id',
        width: '210px',
        align: 'left',
        render(val, record) {
          return (
            <Select placeholder="选择仓库" style={{width: '180px'}} value={val} onChange={(e) => changeInput(e, record, 'warehouse_id')}>
              {
                warehouseList.map(item => (
                  <Option key={item.warehouseId} value={item.warehouseId}>{item.warehouseName}</Option>
                ))
              }
            </Select>
          )
        },
      },
    ]
    return (
      <div>
        <Modal
        title='批量入库'
        visible={visible}
        footer={null}
        width={1200}
        onCancel={onCancel}
        >
          <div className={style.content}> 
            <div className={style.top + ' flex center'}>
              <div className='item'>
                <span>批量选择供应商</span>
                <Select placeholder="供应商" size='large' style={{width: '350px'}} onChange={this.bulkSet}>
                  {
                    supplier.map(item => (
                      <Option key={item.id} value={item.id}>{item.name}</Option>
                    ))
                  }
                </Select>
              </div>
              <div> 
                {
                  showNew ?
                  <div>
                    <Input placeholder='输入供应商名称' size='large' value={supplierName} style={{width: 200, marginRight: 10}} onChange={this.changeWord}></Input>
                    <Button size='large' type='primary' style={{marginRight: 10}} onClick={this.newOne}>确定</Button>
                    <Button size='large' onClick={() => this.setState({showNew: false, supplierName: ''})}>取消</Button>
                  </div>
                  :
                  <Button size='large' type='primary' style={{width: 120}} onClick={() => this.setState({showNew: true})}>新增供应商</Button>
                }
              </div>
            </div>
            <div>
              <Table
                columns={columns}
                scroll={{ y: 360 }}
                dataSource={data}
                pagination={false}
              >
              </Table>
            </div>
            <div style={{textAlign: 'right', margin: '40px 0 0 30px'}}>
              <Button size='large' style={{marginRight: 20, width: 120}} onClick={onCancel}>取消</Button>
              <Button size='large' style={{marginRight: 20, width: 120}} onClick={() => this.onOk(3)}>挂账入库</Button>
              <Button size='large' style={{width: 120}} type='primary' onClick={() => this.onOk(2)}>正常入库</Button>
            </div>
          </div>
        </Modal>

        <Modal
          title=" "
          width={570}
          visible={this.state.showQuickIn}
          maskClosable={false}
          footer={null}
          onCancel={this.cancel}
        >
          <div className={style.quickModal}>
            <div>
              <i className="iconfont icon-xuanzhong" />
            </div>
            <div>
              入库成功, 是否立即领料?
            </div>
            <div>
              <Button size="large" onClick={this.cancel}>
                以后
              </Button>
              <Button size="large" type="primary" onClick={this.picking}>
                立即领料
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    )
  }
}

export default BulkInStorage