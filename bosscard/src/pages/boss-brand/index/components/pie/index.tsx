import React, { Component } from "react"
import { DatePicker, Spin } from "antd"
import { Legend, Chart, Geom, Tooltip, Coord } from "bizcharts"
import services from "services"
import * as moment from "moment"

const defaultDate = moment()

const { MonthPicker } = DatePicker

interface Data {
  species?: Species
  records?: Records
  maintain?: Maintain
  arrears?: Arrears
  total?: Total
}
interface Species {
  name: string
  receipts: string
  beReceipts: string
}
interface Records {
  name: string
  receipts: string
  beReceipts: string
}
interface Maintain {
  name: string
  receipts: string
  beReceipts: string
}
interface Arrears {
  name: string
  receipts: string
  beReceipts: string
}
interface Total {
  name: string
  receipts: string
  beReceipts: string
}

export default class Pie extends Component {
  state = {
    date: defaultDate,
    loading: true,
    data: {},
    pieData: [],
  }
  componentDidMount() {
    this.getData()
  }
  getData() {
    this.setState({ loading: true })
    services
      .LIST({
        keys: { name: "brand/wide/index/revenue" },
        data: { date: this.state.date.format("YYYY-MM") },
      })
      .then((res) => {
        this.setState({
          loading: false,
          data: res.list,
          pieData: this.getPieData(res.data),
        })
      })
  }
  getPieData(stateData: Data) {
    return [
      {
        name: stateData.arrears.name,
        value: Number(stateData.arrears.receipts),
      },
      {
        name: stateData.maintain.name,
        value: Number(stateData.maintain.receipts),
      },
      {
        name: "计次卡",
        value: Number(stateData.records.receipts),
      },
      {
        name: "充值卡",
        value: Number(stateData.species.receipts),
      },
    ]
  }
  handleChange(value) {
    if (value) {
      this.setState(
        {
          date: value,
        },
        () => {
          this.getData()
        }
      )
    }
  }
  render() {
    return (
      <div style={{ height: 384 }}>
        <Spin spinning={this.state.loading}>
          <div className="flex right">
            <MonthPicker
              style={{ width: 138 }}
              value={this.state.date}
              mode="month"
              format="YYYY-MM"
              allowClear={false}
              onChange={this.handleChange.bind(this)}
            />
          </div>
          <Chart
            height={376}
            data={this.state.pieData}
            forceFit
            padding={{ top: 15, bottom: 56, right: 0, left: 0 }}
          >
            <Coord type="theta" innerRadius={0.75} />
            <Tooltip showTitle={false} />
            <Legend position="bottom" />
            <Geom
              type="intervalStack"
              position="value"
              color="name"
              shape="sliceShape"
              style={{
                lineWidth: 4,
                stroke: "#fff",
              }}
            />
          </Chart>
        </Spin>
      </div>
    )
  }
}
