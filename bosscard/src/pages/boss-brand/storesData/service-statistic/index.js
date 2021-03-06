import { Component } from 'react'
import { Button, Tabs, DatePicker } from 'antd'
import moment from 'moment'
import { connect } from "dva"
import CommonTable from '../../../../components/CommonTable/index'
import tableConfig from './tableConfig.js'

const { TabPane } = Tabs
const { projectCfg, productCfg } = tableConfig
const { RangePicker } = DatePicker
class serviceClass extends Component {

  state = {
    curType: 1,
    curTab: 1,
    value: [],
    created: [
      (moment().month(moment().month()).startOf('month').valueOf() / 1000).toFixed(0),
      (moment().month(moment().month()).endOf('month').valueOf() / 1000).toFixed(0),
    ],
  }
  componentDidMount() {
    this.getStoresList()
  }
  /**
     * 获取门店列表
     */
  getStoresList = () => {
    const { dispatch } = this.props
    dispatch({
      type: "storesDataStatistic/getStoresList",
      payload: {},
    })
  }

  changeDate = (e) => {
    //整合数据
    let list = e.map(v => {
      if (v.data.findIndex(_ => _.isLast) === -1) {
        v.data.push({
          name: '合计',
          isLast: true,
          ...v.total,
        })
      }
      return v
    })
    return list
  }

  onReSet = () => {
    console.log(33333)
    return {}
  }

  handelBtn = (e) => {
    this.setState({ curType: e, value: [] })
    let created = []
    if (e === 1) {
      created = [
        (moment().month(moment().month()).startOf('month').valueOf() / 1000).toFixed(0),
        (moment().month(moment().month()).endOf('month').valueOf() / 1000).toFixed(0),
      ]
    } else if (e === 2) {
      created = [
        (moment().year(moment().year()).startOf('year').valueOf() / 1000).toFixed(0),
        (moment().year(moment().year()).endOf('year').valueOf() / 1000).toFixed(0),
      ]
    } else {
      created = undefined
    }
    this.setState({ created })
  }

  callback = (e) => {
    this.setState({ curTab: e * 1, curType: 1, value: [] })
    projectCfg.screen.query['completed[<>]'] = undefined
    productCfg.screen.query['completed[<>]'] = undefined
  }

  handlePanelChange = (value) => {
    let created = value.map(v => {
      return (v.valueOf() / 1000).toFixed(0)
    })
    this.setState({ value, created })
  }

  onReSet = () => {
    this.setState({
      created: [
        (moment().month(moment().month() - 1).startOf('month').valueOf() / 1000).toFixed(0),
        (moment().month(moment().month() - 1).endOf('month').valueOf() / 1000).toFixed(0),
      ],
      value: [],
      curType: 1,
    })
    return {}
  }

  onTableChange = () => {
  }

  render() {
    console.log(888, this.state.created)
    const { storesList } = this.props
    const btns = (
      <div className='flex'>
        <Button
          size='large'
          type={this.state.curType === 1 ? "primary" : 'default'}
          style={{ width: 88, marginRight: '25px' }}
          onClick={() => this.handelBtn(1)}
        >本月</Button>
        <Button
          size='large'
          type={this.state.curType === 2 ? 'primary' : 'default'}
          style={{ width: 88, marginRight: '25px' }}
          onClick={() => this.handelBtn(2)}
        >本年</Button>
      </div>
    )
    projectCfg.screen.rules[0].list = storesList || ''
    projectCfg.screen.rules[0].value = storesList[0] ? storesList[0].value : undefined
    productCfg.screen.rules[0].list = storesList || ''
    productCfg.screen.rules[0].value = storesList[0] ? storesList[0].value : undefined
    projectCfg.screen.rules[1].component = btns
    productCfg.screen.rules[1].component = btns
    projectCfg.screen.rules[2].component = (
      <div>
        <RangePicker
          size='large'
          format="YYYY-MM-DD"
          value={this.state.value}
          style={{ width: '100%' }}
          onChange={this.handlePanelChange}
        ></RangePicker>
      </div>
    )
    if (this.state.curTab === 1) {
      projectCfg.screen.query = { ...projectCfg.screen.query, 'completed[<>]': this.state.created, store_id: storesList[0] ? storesList[0].value : undefined }
    } else if (this.state.curTab === 2) {
      productCfg.screen.query = { ...productCfg.screen.query, 'completed[<>]': this.state.created, store_id: storesList[0] ? storesList[0].value : undefined}
    }
    return (
      <div style={{ padding: 30 }}>
        <Tabs onChange={this.callback}>
          <TabPane tab="项目数据" key="1">
            {
              this.state.curTab === 1 &&
              <div style={{ margin: '0 -30px' }}>
                <CommonTable
                  New
                  name="brand/wide/center/store/category"
                  tableConfig={projectCfg}
                  onReSet={this.onReSet}
                  onDataChangeBefore={this.changeDate}
                  onTableChange={this.onTableChange.bind(this)}
                />
              </div>
            }
          </TabPane>
          <TabPane tab="产品数据" key="2">
            {
              this.state.curTab === 2 &&
              <div style={{ margin: '0 -30px' }}>
                <CommonTable
                  New
                  name="brand/wide/center/store/category"
                  tableConfig={productCfg}
                  onReSet={this.onReSet}
                  onDataChangeBefore={this.changeDate}
                  onTableChange={this.onTableChange.bind(this)}
                />
              </div>
            }
          </TabPane>
        </Tabs>
      </div>
    )
  }
}
function mapStateToProps(state) {
  const { storesList } = state.storesDataStatistic
  return { storesList }
}
export default connect(mapStateToProps)(serviceClass)
