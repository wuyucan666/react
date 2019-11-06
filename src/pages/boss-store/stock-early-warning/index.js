import { Component } from 'react'
import clonedeep from 'lodash.clonedeep'
import CommonTable from '../../../components/CommonTable/index'
import { Form } from 'antd'
import { connect } from 'dva'
import WarningDiv from "../warehouse-total/components/warningDiv/index"
import tableConfig from "./tableConfig"
class earlywarning extends Component {
  state = {
    visible: false,
    contents: {},
  }
  componentDidMount() {
    this.props.dispatch({ type: 'warningEarly/getproductcategoryList', payload: {} })
  }
  handleChange = (v) => {
    console.log(v, 9999999)
  }
  onTableChange = (e, v) => {
    if (e === 14) {
      this.setState({
        visible: true,
        contents: v,
      })
    }
  }
  returnBtn = () => {
    this.setState({
      visible: false,
    })
  }
  render() {
    tableConfig.screen.rules[1].list = this.props.productcategoryList.map(item => ({ name: item.categoryName, value: item.categoryId }))
    return (
      <div>
        <CommonTable name="erp/statistics/inventory/warning" refresh New onTableChange={this.onTableChange} tableConfig={clonedeep(tableConfig)}></CommonTable>
        <WarningDiv visible={this.state.visible} returnBtn={this.returnBtn.bind(this)} data={this.state.contents} />
      </div>
    )
  }
}
function mapStateToProps(state) {
  const { productcategoryList } = state.warningEarly
  return { productcategoryList }
}
export default connect(mapStateToProps)(Form.create()(earlywarning))
