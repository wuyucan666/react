import React, { Component } from "react"
import Detail from "./detail"
import services from "services"

interface Res {
  data: Data
  code: string
}
interface Data {
  income: Income
  consume: Consume
  balance: Balance
}
interface Income {
  speciesOutput: string
  recordsOutput: string
  renewalCardCount: string
}
interface Consume {
  speciesConsume: string
  recordsConsume: string
  recordsCount: string
  recordsGiveCount: string
}
interface Balance {
  speciesBalance: string
  recordsBalance: string
  recordsCount: string
  recordsGiveCount: string
}

export default class MainDetail extends Component {
  state = {
    /** 办卡/续费收入 */
    income: [
      { label: "充值办卡", value: "" },
      { label: "计次卡办卡", value: "" },
      { label: "充值卡续费", value: "" },
    ],
    /** 会员卡消耗 */
    consume: [
      { label: "充值卡扣", value: "" },
      { label: "计次卡扣次数", value: "" },
      { label: "计次卡扣金额", value: "" },
      { label: "赠送卡扣次数", value: "" },
    ],
    /** 当前会员卡余额 */
    balance: [
      { label: "充值卡余额", value: "" },
      { label: "计次卡余额", value: "" },
      { label: "计次卡剩余次数", value: "" },
      { label: "赠送卡剩余次数", value: "" },
    ],
    loading: false,
  }
  componentDidMount() {
    this.getData()
  }
  getData() {
    this.setState({ loading: true })
    services
      .LIST({
        keys: { name: "brand/wide/index/yesterday/detail" },
        data: {},
      })
      .then((res: Res) => {
        this.setState({ loading: false })
        if (res.code === "0") {
          let income = [...this.state.income]
          income[0].value = res.data.income.speciesOutput
          income[1].value = res.data.income.recordsOutput
          income[2].value = res.data.income.renewalCardCount
          let consume = [...this.state.consume]
          consume[0].value = res.data.consume.speciesConsume
          consume[1].value = res.data.consume.recordsCount
          consume[2].value = res.data.consume.recordsConsume
          consume[3].value = res.data.consume.recordsGiveCount
          let balance = [...this.state.balance]
          balance[0].value = res.data.balance.speciesBalance
          balance[1].value = res.data.balance.recordsBalance
          balance[2].value = res.data.balance.recordsCount
          balance[3].value = res.data.balance.recordsGiveCount
          this.setState({
            income,
            consume,
            balance,
          })
        }
      })
  }
  render() {
    return (
      <div className="main-detail">
        <Detail
          title="办卡/续费收入"
          content={this.state.income}
          loading={this.state.loading}
        />
        <Detail
          title="会员卡消耗"
          content={this.state.consume}
          loading={this.state.loading}
        />
        <Detail
          title="当前会员卡余额"
          content={this.state.balance}
          loading={this.state.loading}
        />
      </div>
    )
  }
}
