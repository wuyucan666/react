import { Component } from "react"
import CommonTable from "../../../components/CommonTable/index"
import { connect } from "dva"
import tableConfig from "./tableConfig"
import { DatePicker } from "antd"
import moment from "moment"
var date = new Date()
var year = date.getFullYear()
var month = date.getMonth() + 1
var hasTime = year + "-" + month
const { MonthPicker } = DatePicker
class summarycom extends Component {
  state = {}
  componentDidMount() {}
  // 查询
  onChange = (value, time) => {
    tableConfig.screen.query = {
      date: time !== "" ? time : undefined,
    }
  }
  render() {
    tableConfig.screen.rules[1].component = (
      <MonthPicker
        size="large"
        defaultValue={moment(hasTime, "YYYY-MM")}
        onChange={this.onChange.bind(this)}
        placeholder="选择月份"
      />
    )
    return (
      <div>
        <CommonTable
          name="erp/statistics/receive/collect"
          refresh
          New
          tableConfig={tableConfig}
        />
      </div>
    )
  }
}

function mapStateToProps() {
  return {}
}
export default connect(mapStateToProps)(summarycom)
