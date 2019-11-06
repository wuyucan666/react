import { Component } from "react"
import { connect } from "dva"
import { Table } from "antd"
class SettlementTable extends Component {
  state = {
    columns: [
      {
        title: "日期",
        dataIndex: "name",
        key: "name",
        width: 100,
      },
      {
        title: "实收类型",
        align: "center",
        children: [
          {
            title: "会员售卡",
            dataIndex: "age",
            key: "age",
            width: 160,
          },
          {
            title: "充值卡",
            dataIndex: "age1",
            key: "age1",
            width: 160,
          },
          {
            title: "挂账还款",
            dataIndex: "age2",
            key: "age2",
            width: 160,
          },
          {
            title: "项目/产品/附加项目",
            dataIndex: "age3",
            key: "age3",
            width: 160,
          },
        ],
      },
      {
        title: "收款方式",
        align: "center",
        children: [
          {
            title: "现金",
            dataIndex: "aget",
            key: "aget",
            width: 160,
          },
          {
            title: "银联",
            dataIndex: "age11",
            key: "age11",
            width: 160,
          },
          {
            title: "支付宝",
            dataIndex: "age21",
            key: "age21",
            width: 160,
          },
          {
            title: "美团",
            dataIndex: "age31",
            key: "age31",
            width: 160,
          },
        ],
      },
    ],
    data: [],
  }
  componentDidMount() {
    let data = []
    for (let i = 0; i < 50; i++) {
      data.push({
        key: i,
        name: "John Brown",
        age: i + 1,
        age1: "Lake Street 42",
        age2: "Lake Street 42",
        age3: "Lake Street 42",
        aget: i + 1,
        age11: "Lake Street 42",
        age21: "Lake Street 42",
        age31: "Lake Street 42",
      })
    }
    this.setState({
      data: data,
    })
  }
  render() {
    return (
      <div className="settlementTypeTable">
        <Table
          columns={this.state.columns}
          dataSource={this.state.data}
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
