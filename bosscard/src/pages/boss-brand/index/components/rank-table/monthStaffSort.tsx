import React, { Component } from "react"
import RankTable from "./rankTable"
import { ColumnProps } from "antd/lib/table"

const columns: ColumnProps<object>[] = [
  {
    title: "员工",
    width: "",
    dataIndex: "staffName",
  },
  // {
  //   title: "工种",
  //   width: "",
  //   dataIndex: "output",
  // },
  // {
  //   title: "所属门店",
  //   width: "",
  //   dataIndex: "carCount",
  // },
  {
    title: "工单数",
    width: "",
    dataIndex: "orderCount",
    sorter: true,
  },
  {
    title: "项目产值",
    width: "",
    dataIndex: "projectOutput",
    sorter: true,
  },
  {
    title: "配件产值",
    width: "",
    dataIndex: "productOutput",
    sorter: true,
  },
  // {
  //   title: "单车产值",
  //   width: "",
  //   dataIndex: "beFirstCardCount",
  //   sorter: true,
  // },
  {
    title: "总产值",
    width: "",
    dataIndex: "output",
    sorter: true,
  },
]

/**本月员工排名 */
export default class MonthStaffSort extends Component {
  render() {
    return (
      <div>
        <RankTable api="brand/wide/index/staff/sort" columns={columns} />
      </div>
    )
  }
}
