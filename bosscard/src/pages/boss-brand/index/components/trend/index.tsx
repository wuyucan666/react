import React, { Component } from "react"
import { Select, Spin } from "antd"
import { Axis, Chart, Geom, Tooltip, Legend } from "bizcharts"
import services from "services"

const { Option } = Select

export default class Trend extends Component {
  state = {
    query: {
      days: "30",
      field: "output",
    },
    loading: true,
    data: [],
  }
  componentDidMount() {
    this.getData()
  }
  getData() {
    this.setState({ loading: true })
    services
      .LIST({
        keys: { name: "brand/wide/index/trend" },
        data: this.state.query,
      })
      .then((res) => {
        this.setState({ loading: false, data: res.list || res.data })
      })
  }
  handleChange(arg, value) {
    this.setState(
      {
        query: {
          ...this.state.query,
          [arg]: value,
        },
      },
      () => {
        this.getData()
      }
    )
  }
  render() {
    const data = this.state.data.map((_) => ({
      数额: parseFloat(_.num),
      date: _.date,
    }))

    const animation = {
      animation: "fadeIn", // 动画名称
      easing: "easeInQuart", // 动画缓动效果
      delay: 100, // 动画延迟执行时间
      duration: 1200, // 动画执行时间
    }
    return (
      <div style={{ height: 384 }}>
        <Spin spinning={this.state.loading}>
          <div>
            <Select
              style={{ width: 220 }}
              size="large"
              value={this.state.query.field}
              onChange={this.handleChange.bind(this, "field")}
            >
              <Option value="consume">消耗</Option>
              <Option value="output">实收</Option>
            </Select>
            <Select
              style={{ marginLeft: 24, width: 220 }}
              size="large"
              value={this.state.query.days}
              onChange={this.handleChange.bind(this, "days")}
            >
              <Option value="7">近7天</Option>
              <Option value="30">近30天</Option>
            </Select>
          </div>
          <Chart
            height={320}
            padding={"auto"}
            data={data}
            forceFit
            style={{ marginTop: 40 }}
          >
            <Axis
              name="date"
              label={{ textStyle: { fill: "#ccc" } }}
              tickLine={{ stroke: "#ccc" }}
              line={{ stroke: "#ccc" }}
            />
            <Axis
              name="value"
              label={{ textStyle: { fill: "#ccc" } }}
              tickLine={{ stroke: "#ccc" }}
              line={{ stroke: "#ccc" }}
            />
            <Tooltip
              crosshairs={{
                type: "y",
              }}
            />
            <Geom
              animate={animation}
              type="line"
              position="date*数额"
              size={2}
              color={"#00B3F9"}
            />
          </Chart>
        </Spin>
      </div>
    )
  }
}
