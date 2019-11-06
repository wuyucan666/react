import React, { Component } from "react"
import RankTable from "./rankTable"
import { ColumnProps } from "antd/lib/table"

const columns: ColumnProps<object>[] = [
  {
    title: "门店",
    width: "",
    dataIndex: "storeName",
  },
  {
    title: "实收",
    width: "",
    dataIndex: "output",
    sorter: true,
  },
  // {
  //   title: "消耗",
  //   width: "",
  //   dataIndex: "projectReceipts",
  //   sorter: true,
  // },
  // {
  //   title: "业绩/消耗",
  //   width: "",
  //   dataIndex: "productReceipts",
  //   sorter: true,
  // },
  {
    title: "到店台次",
    width: "",
    dataIndex: "carCount",
    sorter: true,
  },
  {
    title: "会员转化率",
    width: "",
    dataIndex: "beFirstCardCount",
    sorter: true,
    render(text) {
      return parseFloat(text).toFixed(1) + "%"
    },
  },
  {
    title: "老客转化率",
    width: "",
    dataIndex: "beFirstShopCount",
    sorter: true,
    render(text) {
      return parseFloat(text).toFixed(1) + "%"
    },
  },
  {
    title: "欠款总额",
    width: "",
    dataIndex: "arrears",
    sorter: true,
  },
  {
    title: "充值卡余额",
    width: "",
    dataIndex: "speciesMoney",
    sorter: true,
  },
  {
    title: "计次卡余额",
    width: "",
    dataIndex: "recordsMoney",
    sorter: true,
  },
]

/**本月门店排名 */
export default class MonthStoreSort extends Component {
  render() {
    return (
      <div>
        <RankTable api="brand/wide/index/store/sort" columns={columns} />
      </div>
    )
  }
}
