import React, { Component } from "react"
import RankTable from "./rankTable"
import { ColumnProps } from "antd/lib/table"
import { Select } from "antd"

const { Option } = Select

const columns: ColumnProps<object>[] = [
  {
    title: "名称",
    width: "",
    dataIndex: "name",
  },
  {
    title: "所属分类",
    width: "",
    dataIndex: "categoryName",
  },
  {
    title: "销售数量",
    width: "",
    dataIndex: "number",
    sorter: true,
  },
  {
    title: "业绩金额",
    width: "",
    dataIndex: "receipts",
    sorter: true,
  },
  {
    title: "成本",
    width: "",
    dataIndex: "cost",
    sorter: true,
  },
  {
    title: "毛利",
    width: "",
    dataIndex: "profit",
    sorter: true,
  },
]
const col: ColumnProps<object>[] = [
  {
    title: "名称",
    width: "",
    dataIndex: "name",
  },
  {
    title: "编码",
    width: "",
    key: 'commodityCode',
    dataIndex: "commodityCode",
  },
  {
    title: "所属分类",
    width: "",
    dataIndex: "categoryName",
  },
  {
    title: "销售数量",
    width: "",
    dataIndex: "number",
    sorter: true,
  },
  {
    title: "业绩金额",
    width: "",
    dataIndex: "receipts",
    sorter: true,
  },
  {
    title: "成本",
    width: "",
    dataIndex: "cost",
    sorter: true,
  },
  {
    title: "毛利",
    width: "",
    dataIndex: "profit",
    sorter: true,
  },
]


/**各项目/产品排名（90日数据） */
export default class ItemsTable extends Component {
  state = {
    type: 1,
  }
  handleSelectChange(type) {
    this.setState({
      type,
    })
  }
  render() {
    return (
      <div>
        <div className="flex right" style={{ marginBottom: 30 }}>
          <Select
            style={{ width: 220 }}
            value={this.state.type}
            onChange={this.handleSelectChange.bind(this)}
          >
            <Option value={1}>项目</Option>
            <Option value={2}>产品</Option>
          </Select>
        </div>
        <RankTable
          query={{ goodsType: this.state.type }}
          api="brand/wide/index/goods/sort"
          columns={this.state.type === 2 ? col : columns}
        />
      </div>
    )
  }
}
