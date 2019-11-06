import React, { Component } from "react"
import { Table } from "antd"
import { TableProps } from "antd/lib/table"
import services from "services"
const rankBg = require("./rank-bg.png")

interface Props extends TableProps<object> {
  /**接口地址 */
  api: string
  /**提交的查询数据 */
  query?: object
}

export default class RankTable extends Component<Props> {
  state = {
    // 表格数据
    data: [],
    // 查询条件
    where: {},
    loading: false,
    columns: [],
  }
  constructor(props) {
    super(props)
    this.state.columns = props.columns
    if (this.state.columns[0].dataIndex !== "sortNum") {
      this.state.columns.unshift({
        title: "排名",
        width: "",
        dataIndex: "sortNum",
        render(text) {
          if (text > 3) {
            return text
          } else {
            return (
              <span
                className="flex center top"
                style={{
                  background: `url(${rankBg}) 100% 100%`,
                  width: 26,
                  height: 32,
                  color: "#fff",
                  paddingTop: 2,
                }}
              >
                {text}
              </span>
            )
          }
        },
      })
    }
  }
  componentDidMount() {
    this.getData(this.props)
  }
  UNSAFE_componentWillReceiveProps(props) {
    this.getData(props)
  }
  /** 获取数据 */
  getData(props) {
    this.setState({ loading: true })
    services
      .LIST({
        keys: { name: this.props.api },
        data: { ...this.state.where, ...props.query, q: { limit: 10 } },
      })
      .then((res) => {
        if (res.code === "0") {
          this.setState({
            data: (res.list || res.data).map((_, index) => ({
              ..._,
              sortNum: index + 1,
              key: new Date().getTime() + index,
            })),
            loading: false,
          })
        }
      })
  }
  handleTableChange(pagination, filters, sorter, extra) {
    if (sorter.field) {
      this.setState(
        {
          where: {
            group: { [sorter.field]: sorter.order === "ascend" ? 1 : 2 },
          },
        },
        this.getData.bind(this, this.props)
      )
    } else {
      this.setState(
        {
          where: {},
        },
        this.getData.bind(this, this.props)
      )
    }
  }
  render() {
    const props = {
      ...this.props,
      dataSource: this.state.data,
      rowKey: "key",
      columns: this.props.columns,
    }
    return (
      <Table
        {...props}
        pagination={false}
        loading={this.state.loading}
        onChange={this.handleTableChange.bind(this)}
      />
    )
  }
}
