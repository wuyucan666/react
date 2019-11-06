import { Component } from "react"
import { Select } from "antd"
import CommonTable from "../../../components/CommonTable/index"
import { connect } from "dva"
import tableConfig from "./tableConfig"
const Option = Select.Option
class stockTakingDetail extends Component {
  state = {
    show: false,
    visible: false,
    type: "",
    checked: true,
    dateFormat: "YYYY-MM-DD",
    created: "",
    staffId: "",
    categoryId: "",
    productId: "",
  }

  showModal = () => {
    this.setState({
      visible: true,
    })
  }

  // 操作table
  onTableChange = (e, v) => {
    const { dispatch } = this.props
    if (e === 217) {
      this.showModal()
      this.setState({
        type: "add",
      })
    }
    if (e === 11) {
      dispatch({ type: "stockTakingDetail/edit", payload: v })
      this.setState({
        type: "edit",
      })
      this.showModal()
    }
  }
  // 获取数据
  componentDidMount() {
    this.props.dispatch({ type: "stockTakingDetail/getRole", payload: {} })
  }
  // 查询
  onChange = (value) => {
    if (value === 1) {
      tableConfig.screen.query = {
        "num[!]|changeNum[!]": 0,
      }
    } else if (value === 2) {
      tableConfig.screen.query = {
        num: 0,
        changeNum: 0,
      }
    } else {
      tableConfig.screen.query = {}
    }
  }
  // defaultValue={''}tableConfig.screen.rules[3].query = { st: value }
  render() {
    const { staffList, category } = this.props
    tableConfig.screen.rules[1].list = [...staffList]
    tableConfig.screen.rules[1].list.unshift({
      name: "管理员",
      value: 0,
    })
    tableConfig.screen.rules.splice(2, 1, {
      ...tableConfig.screen.rules[2],
      list: [...category],
    })
    tableConfig.screen.rules[3].component = (
      <view>
        <text style={{ marginRight: "12px" }}>全部商品</text>
        <Select
          style={{ width: 200, marginRight: 25 }}
          placeholder="默认"
          size="large"
          onChange={this.onChange}
          allowClear={true}
        >
          <Option value={0}>全部</Option>
          <Option value={1}>库存异常商品</Option>
          <Option value={2}>库存正常商品</Option>
        </Select>
      </view>
    )

    let tableConfigs = { ...tableConfig }
    return (
      <CommonTable
        New
        name="store/stocktakingInfo"
        onTableChange={this.onTableChange}
        search="name"
        tableConfig={tableConfigs}
      />
    )
  }
}

function mapStateToProps(state) {
  const { editItem, staffList, category } = state.stockTakingDetail
  return { editItem, staffList, category }
}

export default connect(mapStateToProps)(stockTakingDetail)
