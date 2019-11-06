import { Component } from 'react'
import { Button, Icon, Table , InputNumber, Input, message } from 'antd'
import { connect } from 'dva'

import Tabbar from 'components/Tabbar'
import AddProduct from 'components/MenuTable/addProduct'
import services from '../../../services'

import styles from './style.less'


const DeleteBtn = ({ deleteItem, item }) => {
  return (
    <div className='rowbtns' style={{position: 'absolute', right: '20px', top: '0px', float: 'left'}}  onClick={() => deleteItem(item)}>
      <div className='animated zoomIn faster' style={{margin: '-2px 0',borderRadius: '50%'}}>
        <i className="iconfont icon-shanchu"></i>
      </div>
    </div>
  )
}

const Add = (
  class extends Component {
    state = {
      goodsList: [],
      showProduct: false,
      productList: [],
      totalMoney: 0.0,
      totalNum: 0,
      remark: '',
    }

    hideModal = () => {
      this.setState({
        showProduct: false,
      })
    }

    showModal = () => {
      this.setState({
        showProduct: true,
      })
    }

    deleteItem = (item) => {
      this.setState({
        goodsList: this.state.goodsList.filter(v => v.id !== item.id),
      }, () => {
        this.countAll()
      })
    }

    countAll = () => {
      let tempM = 0
      let tempN = 0
      if(this.state.goodsList.length > 0) {
        this.state.goodsList.forEach(v => {
          tempM += v.itemTotal * 1000
          tempN += v.outNum * 1
          this.setState({
            totalMoney: (tempM/1000).toFixed(1),
            totalNum: tempN,
          })
        })
      }else {
        this.setState({
          totalMoney: (tempM/1000).toFixed(1),
          totalNum: tempN,
        })
      }
    }

    onChange = (value, item, type) => {
      this.setState({
        goodsList: this.state.goodsList.map(v => {
          if(v.id === item.id) {
            if(type === 1) { //修改数量
              if(value > item.number) {
                message.error('出库数量不能大于当前库存!')
              }
              v.outNum = value
              v.itemTotal = (value * v.avgPrice).toFixed(1)
            }else { //修改备注
              v.remark = value.target.value
            }
          }
          return v
        }),
      }, ()=> {
        this.countAll()
      })

    }

    onOk = (e) => {
      e.map((v) => {
        v.avgPrice = v.avgPrice * 1
        if(!v.outNum) {
          v.outNum = 1
          v.itemTotal = v.avgPrice * 1
        }
        if(!v.remark) {
          v.remark = ''
        }
        return v
      })
      if(this.state.goodsList.length > 0) {
        e.map(v => {
          let idx = this.state.goodsList.findIndex(j => j.id === v.id)
          if(idx !== -1) {
            v = this.state.goodsList[idx]
          }
          return v
        })
        this.setState({
          goodsList: e.map((v,i) => {
            v.index = i*1 +1
            v.key = i
            return v
          }),
        },() => {
          this.countAll()
        })
      }else {
        this.setState({
          goodsList: e.map((v,i) => {
            v.index = i*1 + 1
            v.key = i
            return v
          }),
        },() => {
          this.countAll()
        })
      }
    }

    submit = () => {
      if(this.state.goodsList.length === 0) {
        message.error('请至少添加一件出库商品！')
        return false
      }
      let obj = {
        product: this.state.goodsList.map(v => {
          return {
            id: v.productId,
            warehouseId: v.warehouseId,
            goodsNum: v.outNum,
            goodsPrice: v.avgPrice,
            totalPrice: v.itemTotal,
            remark: v.remark,
          }
        }),
        remark: this.state.remark,
        typeId: 16,
      }
      services.INSERT({keys:{ name:'erp/stock/inventory/storage/output' }, data: obj}).then(res => {
        if(res.success) {
          message.success('提交出库成功！')
          const { hideModal } = this.props
          this.props.dispatch({
            type:'erp/stock/inventory/storage/output',
            payload:{new:true},
          })
          hideModal()
        }
      })
    }

    back = () => {
      const { hideModal, dispatch } = this.props
      dispatch({
        type: 'app/setBreads',
      })
      hideModal()
    }

    render() {
      const columns = [{
        title: '序号',
        dataIndex: 'index',
        width: '5%',
        align: 'left',
      }, {
        title: '商品名称',
        dataIndex: 'name',
        width: '262px',
        align: 'left',
        render: (text, item) => {
          return <div style={{width:'262px', wordWrap:'break-word',wordBreak:'break-all'}}>
            {text}
          </div>
        },
      }, {
        title: '规格',
        dataIndex: 'spec',
        width: '8%',
        align: 'left',
      }, {
        title: '编码',
        dataIndex: 'code',
        width: '190px',
        align: 'left',
        render: (text, item) => {
          return <div style={{width:'190px', wordWrap:'break-word',wordBreak:'break-all'}}>
            {text}
          </div>
        },
      }, {
        title: '仓库',
        dataIndex: 'warehouseName',
        width: '14%',
        align: 'left',
      }, {
        title: '库存',
        dataIndex: 'number',
        width: '7%',
        align: 'left',
      }, {
        title: '平均成本',
        dataIndex: 'avgPrice',
        width: '8%',
        align: 'left',
      }, {
        title: '数量',
        dataIndex: 'outNum',
        width: '8%',
        align: 'left',
        render: (text, item) => {
          return <InputNumber min={1} max={item.number * 1} defaultValue={text} precision={0} onChange={value => this.onChange(value, item, 1)} />
        },
      }, {
        title: '合计',
        dataIndex: 'itemTotal',
        width: '7%',
        align: 'left',
      }, {
        title: '备注',
        dataIndex: 'remark',
        width: '21%',
        align: 'left',
        render: (text, item) => {
          return <div style={{position: 'relative'}}>
            <Input placeholder="请输入备注" style={{width: '60%'}} defaultValue={text} onChange={value => this.onChange(value, item, 2)}/>
            <DeleteBtn deleteItem={this.deleteItem} item={item}></DeleteBtn>
          </div>
        },
      }]

      return (
        <div className={styles.outStock + ' meterComboWrap'}>
          <Button type="default" size="large" onClick={this.back}>
            <Icon type="left" style={{fontSize: 12, color: '#ccc', lineHeight: '40px'}} /><span >返回列表</span>
          </Button>
          <Table style={{marginTop: '30px'}}
          pagination={{hideOnSinglePage: true}}
          columns={columns}
          dataSource={this.state.goodsList}
          >
          </Table>
          <AddProduct   selectList={ this.state.goodsList }  addproduct={this.onOk} api={{getMenu:'storeAdjustment/get', getData:'storeAdjustment/getData'}}/>
          <Tabbar>
            <div className={styles.tabbar}>
              <div>
                <Input size="large" style={{width: '420px', marginLeft: '65px'}} placeholder="备注" onChange={e => this.setState({remark: e.target.value})} />
              </div>
              <span>金额： ￥{this.state.totalMoney}</span>
              <span>商品数： {this.state.totalNum}</span>
              <Button type="primary" style={{width: '88px'}} size="large" onClick={this.submit}>提交出库</Button>
            </div>
          </Tabbar>
        </div>
      )
    }
  }
)

export default connect()(Add)
