import { Component } from 'react'
import clonedeep from 'lodash.clonedeep'
import CommonTable from '../../../components/CommonTable/index'
import { Form, Modal, InputNumber ,message} from 'antd'
import { connect } from 'dva'
import services from "services"
import tableConfig from "./tableConfig"
class querycom extends Component {
  state = {
    visible: false,
    after: '',
    rowData:{}
  }
  componentDidMount() {
    this.props.dispatch({ type: 'queryData/getwarehouseList', payload: {} })
    this.props.dispatch({ type: 'queryData/getproductcategoryList', payload: {} })
  }

  onTableChange = (e, v) => {
    // console.log(e,v)
    if (e === 16 || e === 13) {
      const { dispatch } = this.props
      services.UPDATE({ keys: { name: 'erp/statistics/inventory', id: v.id } }).then(() => {
        dispatch({
          type: 'table/getData',
          payload: { new: 'erp/statistics/inventory' },
        })
      })
    }
    if(e=== 21) {
      this.setState({
        visible: true,
        rowData: v
      })
    }
  }
  handleOk = () => {
    const {after,rowData}=this.state
    const {dispatch}=this.props
    if (after && after !== ""||after===0) {
      if (!/^[0-9]+\.{0,1}[0-9]{0,1}$/.test(after)) {
        message.warn("只能输入一位小数的正数！")
      }else{
        services.costAdjustment({
          keys : {
            name: 'store/inventory/cost-detail',
            id: rowData.id,
          },
          data:{
            cost:after,
          },
        }).then(res=>{
          if(res.code==='0'){
            message.success('成本调整成功')
            this.setState({
              visible: false,
              after:'',
            })
            dispatch({
              type: 'table/getData',
              payload: {new:true},
            })
          }
        })
      }
    }else{
      message.warn('请输入调整后成本')
    }
  }
  hideModal = () => {
    this.setState({
      visible: false,
      after:''
    })
  }
  render() {
    tableConfig.screen.rules[1].list = this.props.warehouseList.map(item => ({ name: item.warehouseName, value: item.warehouseId }))
    tableConfig.screen.rules[2].list = this.props.productcategoryList.map(item => ({ name: item.categoryName, value: item.categoryId }))
    return (
      <div>
        <CommonTable name="erp/statistics/inventory" refresh New onTableChange={this.onTableChange} tableConfig={clonedeep(tableConfig)} ></CommonTable>
        <Modal
          width='375px'
          title="成本调整"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.hideModal}
        >
            <div>
              <div style={{paddingBottom:'40px'}}>{this.state.rowData.productName}</div>
              <div style={{paddingBottom:'40px'}}>当前平均成本:<span style={{color: '#FF6F28',marginLeft:'10px'}}>￥{this.state.rowData.sellingPrice}</span></div>
              <div>调整后成本：<InputNumber style={{marginRight:'10px'}} onChange={(v)=>this.setState({after:v})} value={this.state.after}></InputNumber>元</div>
            </div>
        </Modal>
      </div>
    )
  }
}
function mapStateToProps(state) {
  const { warehouseList, productcategoryList } = state.queryData
  return { warehouseList, productcategoryList }
}
export default connect(mapStateToProps)(Form.create()(querycom))
