import React, { Component } from "react"
import RankTable from "./rankTable"
import { ColumnProps } from "antd/lib/table"

const columns: ColumnProps<object>[] = [
  {
    title: "业务类型",
    width: "",
    dataIndex: "name",
  },
  {
    title: "工单数",
    width: "",
    dataIndex: "count",
    sorter: true,
  },
  {
    title: "项目产值",
    width: "",
    dataIndex: "projectReceipts",
    sorter: true,
  },
  {
    title: "配件产值",
    width: "",
    dataIndex: "productReceipts",
    sorter: true,
  },
  {
    title: "单车产值",
    width: "",
    dataIndex: "beCarReceipts",
    sorter: true,
  },
  {
    title: "总产值",
    width: "",
    dataIndex: "receipts",
    sorter: true,
  },
  {
    title: "总值占比",
    width: "",
    dataIndex: "beTotal",
    sorter: true,
    render(text) {
      return text + "%"
    },
  },
]

/**各类维修类型排名（90日数据） */
export default class MaintainTable extends Component {
  render() {
    return (
      <div>
        <RankTable
          api="brand/wide/index/maintain/type/sort"
          columns={columns}
          query={{group: {receipts: 2}}}
        />
      </div>
    )
  }
}
