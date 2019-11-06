import { Component } from "react"
import { connect } from "dva"
import { Table } from "antd"
class SettlementTable extends Component {
  state = {
  }
  componentDidMount() {
  }
  render() {
    const { dataList, pay } = this.props
    return (
      <div className="settlementTypeTable">
        <Table
          columns={pay}
          dataSource={dataList}
          bordered
          size="middle"
          scroll={{ x: 1575, y: 568 }}
        />
      </div>
    )
  }
}

function mapStateToProps() {
  return {}
}
export default connect(mapStateToProps)(SettlementTable)
