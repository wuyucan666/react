import { Component } from 'react'
import { Form } from 'antd'
import Treasury from "../warehouse-total/components/treasury/index"
import { connect } from 'dva'
import services from 'services'
import CommonTable from 'components/CommonTable/index'
import tableConfig from './tableConfig'

class earlywarning extends Component {
  state = {
    visible: false,
    contents: {},
    dataSource: [],

  }
  componentDidMount() {
    services.LIST({ keys: { name: 'erp/inventoryLocker' } }).then(res => {
      this.setState({
        dataSource: res.list,
      })
    })
  }
  returnBtn = () => {
    const { dispatch } = this.props
    dispatch({
      type: "table/getData",
      payload: { new: 'erp/inventoryLocker' },
    })
    this.setState({
      visible: false,
    })
  }
  onTableChange = (e, v) => {
    if (e === 11) {
      this.setState({
        visible: true,
        contents: v,
      })
    }
  }
  render() {
    return (
      <div>
        <CommonTable
          name='erp/inventoryLocker'
          refresh
          tableConfig={tableConfig}
          onTableChange={this.onTableChange}
          New
        >
        </CommonTable>

        <Treasury visible={this.state.visible} contents={this.state.contents} returnBtn={this.returnBtn.bind(this)} />
      </div>
    )
  }
}
function mapStateToProps() {
  return {}
}
export default connect(mapStateToProps)(Form.create()(earlywarning))
