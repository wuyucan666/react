/**
 * Created by kikazheng on 2018/11/16
 */
import React, { Component } from 'react'
import CommonTable from "components/CommonTable"
import services from "../../../services"
import { connect } from "dva"
import Detail from './detail'
import Add from './add'
import styles from './style.less'
import tableConfig from './tableConfig'
import { Modal } from 'antd'
import Text from './test'

class Purchase extends Component {
  constructor(props){
    super(props)
    this.state = {
      showAdd: false,
      supplier: [],//供应商
      id: '',
      remark: '',
      status: '',
      supplierId: '',
      surplus: 0,//待付金额
      showDetail: false,
      editItem: {},
      value:undefined ,
      tableConfig,
      show:false,
    }
  }

  componentDidMount() {
    // 紧急入库
    // 添加急件
    this.getProvider()
    const { isAdding, lastActive, urgent } = this.props
    urgent === true ? this.setState({ showAdd: true }) : null
    if (isAdding && lastActive === 2) {
      this.setState({ showAdd: true })
    }
    this.setState({show: true})
  }
  //获取供应商列表
  getProvider() {
    console.log('ok')
    services.LIST({ keys: { name: 'erp/supplier/selector' } }).then(res => {
      if(res.success){
        this.setState({
          supplier: res.list,
        })
        // tableConfig.screen.rules[1].list = res.list.map(item => ({ name: item.name, value: item.id }))
      }
    })
  }
  onTableChange = (e, item) => {
    switch (e) {
      case 11:
        services.LIST({ keys: { name: `erp/stock/purchase/${item.id}/edit` } }).then(res => {
          if (res.success) {
            this.setState({
              editItem: res.data,
              showAdd: true,
            })
          }
        })
        break
      case 217:
        this.setState({ showAdd: true, editItem: {} })
        break
      case 14:
        this.setState({
          surplus: Number(item.surplus),
          id: item.id,
          remark: item.remark,
          supplierId: item.supplier,
          status: item.status,
          showDetail: true,
        })
        break
      case 15:
        let that = this
        Modal.confirm({
          title: '您确定要作废吗?',
          content: '',
          okText: '确认',
          cancelText: '取消',
          icon: <div style={{ width: '37px', height: '37px', background: '#FF303D', borderRadius: '50%', textAlign: 'center', lineHeight: '37px', marginLeft: '177px', marginBottom: '10px' }}><i className='iconfont icon-shanchu' style={{ color: '#fff' }} /></div>,
          closable: true,
          centered: true,
          maskClosable: true,
          maskStyle: {
            background: 'rgba(0,0,0,0.65)',
          },
          className: 'madalDiv',
          onOk() {
            services.DELETE({ keys: { name: `erp/stock/purchase/state`, id: item.id } }).then(res => {
              if (res.success) {
                that.props.dispatch({
                  type: 'table/getData',
                  payload: { new: true },
                })
              }
            })
          },
        })
        break
      default:
        console.log(e)
    }
  }
  onCancel = () => {
    this.setState({
      showDetail: false,
    })
  }
  goBack = () => {
    this.setState({
      showAdd: false,
    })
  }
  // 新建供应商成功后刷新供应商列表
  addSupplierhideModal = () => {
    services.LIST({ keys: { name: 'erp/supplier/selector' } }).then(res => {
      if(res.success){
        this.setState({
          supplier: res.list,
        })
        // tableConfig.screen.rules[1].list = res.list.map(item => ({ name: item.name, value: item.id }))
      }
    })
  }
  // 选中
  handleChange = (value) => {
    const newTableConfig = {...tableConfig}
    newTableConfig.screen.query = {'supplier':value}
    this.setState({
      tableConfig: newTableConfig,
      show: true,
      value
    })
  }

  // 表格重置
  onReSet = () => {
    const newTableConfig = {...tableConfig}
    newTableConfig.screen.query = {}
    this.setState({
      tableConfig: newTableConfig,
      show: true,
      value:undefined
    })
  }

  render() {
    const { supplier, showDetail, surplus, id, supplierId, showAdd, editItem, remark, status,tableConfig,value} = this.state
    tableConfig.screen.rules[1].component = (
      <div style={{position:'relative'}} className={styles.wyc_supplier}>
          <label style={{margin:'0 10px 0 10px',position:'absolute',left:'23px',top:'0px'}}>供应商</label>
          {<Text handleChange={this.handleChange} value={value} />}
      </div>
    )
    return (
      <div>
        {showAdd && <Add
          supplier={supplier}
          urgent={this.props.urgent}
          dispatch={this.props.dispatch}
          editItem={editItem}
          goBack={this.goBack}
          addSupplierhideModal={this.addSupplierhideModal}
          backRoute={this.props.backRoute}
          isAdding={this.props.isAdding}
          provider={this.getProvider.bind(this)}
        />}
        <div style={{ display: showAdd ? 'none' : '' }}>
          {this.state.show&&<CommonTable
            New
            name="erp/stock/purchase"
            search='no,operatorName'
            tableConfig={tableConfig}
            onTableChange={this.onTableChange}
            onReSet={this.onReSet}
          />}
          <Detail
            dispatch={this.props.dispatch}
            visible={showDetail}
            id={id}
            remark={remark}
            status={status}
            supplierId={supplierId}
            surplus={surplus}
            onCancel={this.onCancel}
          />
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  const {
    isAdding,
    lastActive,
    backRoute,
  } = state.app
  const {
    urgent,
  } = state.storeAdjustment
  return {
    isAdding,
    lastActive,
    backRoute,
    urgent,
  }
}

export default connect(mapStateToProps)(Purchase)
