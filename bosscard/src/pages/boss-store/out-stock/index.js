/**
 * Created by ainier on 2018/11/22
 */
import React,{Component} from 'react'
import { Modal, Table } from 'antd'
import { connect } from 'dva'

import CommonTable from 'components/CommonTable/index'
import tableConfig from './tableConfig'
import services from '../../../services'
import Add from './add'
import styles from './style.less'

const Detail = ({ visible, goodsList, handleCancel }) => {

  const columns = [{
    title: '序号',
    dataIndex: 'index',
    width: '7%',
    align: 'left',
    className: styles.firstCol,
  }, {
    title: '商品',
    dataIndex: 'productName',
    width: '20%',
    align: 'left',
  }, {
    title: '编码',
    dataIndex: 'commodityCode',
    width: '10%',
    align: 'left',
  }, {
    title: '单价',
    dataIndex: 'goodsPrice',
    width: '10%',
    align: 'left',
  }, {
    title: '数量',
    dataIndex: 'goodsNum',
    width: '10%',
    align: 'left',
  }, {
    title: '合计',
    dataIndex: 'totalPrice',
    width: '10%',
    align: 'left',
  }, {
    title: '仓库',
    dataIndex: 'warehouseName',
    width: '10%',
    align: 'left',
  },{
    title: '备注',
    dataIndex: 'remark',
    width: '15%',
    align: 'left',
  }]

  return (
    <Modal
      title="出库明细单"
      visible={visible}
      // onOk={this.handleOk}
      onCancel={handleCancel}
      bordered={true}
      footer={false}
      width="60%"
      className="out-modal"
    >
      <Table
      style={{marginBottom: '32px'}}
      columns={columns}
      pagination={{hideOnSinglePage: true}}
      dataSource={goodsList}
      >
      </Table>
    </Modal>
  )
}

class Purchase extends Component {

  state = {
    type: '',
    new: false,
    visible: false,
    goodsList: [],
    searchData: {},
  }

  componentDidMount () {
    services.LIST({keys: {name: 'store/staff/list'}, data: {q: {page: 1, limit:-1, where: {'business[~]': 6, isJob: 1}}}}).then(res => {
      if(res.success) {
        tableConfig.screen.rules[1].list = res.list.map(v => {
          return {
            name: v.staffName,
            value: v.staffId,
          }
        })
      }
    })
  }

  showModal = () => {
    this.setState({
      new: true,
    })
  }

  hideModal = () => {
    this.setState({
      new: false,
    })
  }

  handleCancel = () => {
    this.setState({
      visible: false,
    })
  }

  onTableChange = (e, v) => {
    const { dispatch } = this.props
    switch (e) {
      case 217:
        this.showModal()
        this.setState({
          type: 'add',
        })
        dispatch({
          type: 'app/setBreads',
          payload: { title: '新建出库' },
        })
        break
      case 14:
        services.DETAIL({keys: {name: 'erp/stock/inventory/storage/output', id: v.id}}).then(res => {
          if(res.success) {
            this.setState({
              goodsList: res.list.map((v,i) => {
                v.index = i*1 + 1
                v.key = i
                return v
              }),
            }, () => {
              this.setState({
                visible: true,
              })
            })
          }
        })
        this.setState({
          type: 'edit',
          id: v.id,
        })
        break
      default:
    }
  }

  render() {

    const AddProps = {
      hideModal: this.hideModal,
      type: this.state.type,
    }

    const detailProps = {
      visible: this.state.visible,
      goodsList: this.state.goodsList,
      handleCancel: this.handleCancel,
    } 

    return (
      this.state.new ? <Add {...AddProps}></Add> :
      <div>
        <CommonTable name='erp/stock/inventory/storage/output' onTableChange={this.onTableChange} tableConfig={tableConfig} New>
        </CommonTable>
        <Detail {...detailProps}></Detail>
      </div>
    )
  }
}

export default connect()(Purchase)
