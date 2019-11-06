import React, { Component } from 'react'
import TotalNumber from './total-number'
import request from 'utils/request';
import DataTable from './data-table';

const styles = require('./total.less')

interface Props {
  year: number
}

const totalShows = [
  {
    label: '总营业额 （元）',
    value: 0,
    helpText: '营业额，门店总实收金额。'
  },
  {
    label: '总成本 （元）',
    value: 0,
    helpText: <div>
      总成本，包含项目成本和产品成本。<br />
      项目成本，在新建/编辑项目时设置的成本进行计算；<br />
      产品成本，按照多次进货的平均成本进行计算。<br />
    </div>
  },
  {
    label: '总毛利 （元）',
    value: 0,
    helpText: <div>
      总毛利，所有订单的毛利汇总。<br />
      毛利=消耗-成本
    </div>
  },
  {
    label: '进货支出（元）',
    value: 0,
    helpText: <div>
      进货支出<br />
      采购产品所花费的支出金额。
    </div>
  },
  {
    label: '现金结余 （元）',
    value: 0,
    helpText: '现金结余=营业额-进货支出'
  }
]

export default class Total extends Component<Props> {
  state = { totalShows, loading: false, data: [] }
  UNSAFE_componentWillReceiveProps(nextProp: Props) {
    if (nextProp.year !== this.props.year) {
      console.log('开始更新汇总数据！！！！')
      this.getTotalData(nextProp.year)
    }
  }
  componentDidMount() {
    this.getTotalData(this.props.year)
  }
  getFloat = (string) => parseFloat(parseFloat(string).toFixed(1))
  getTotalData = async (year: number) => {
    this.setState({ loading: true })
    const res = await request({ url: 'wide-business/marketing/overview', data: { year } })
    this.setState({ loading: false })
    if (res.code === '0') {
      totalShows[0].value = this.getFloat(res.data.output)
      totalShows[1].value = this.getFloat(res.data.cost)
      totalShows[2].value = this.getFloat(res.data.profit)
      totalShows[3].value = this.getFloat(res.data.purchase)
      totalShows[4].value = this.getFloat(res.data.balance)
      this.setState({ totalShows, data: res.data.list })
    }
  }
  render() {
    const totalNumbers = this.state.totalShows.map(_ => <div className="item"><TotalNumber key={_.label} {..._} loading={this.state.loading}></TotalNumber></div>)
    return (
      <div className={styles.total}>
        <div className="flex" style={{ marginBottom: 32 }}>
          {totalNumbers}
        </div>
        <DataTable data={this.state.data}></DataTable>
      </div>
    )
  }
}
