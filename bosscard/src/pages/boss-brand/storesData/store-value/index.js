import { Component } from 'react'
import { Button, Tabs } from 'antd'
import moment from 'moment'
import { connect } from "dva"
import CommonTable from '../../../../components/CommonTable/index'
import tableConfig from './tableConfig.js'

const { TabPane } = Tabs
const { types, products } = tableConfig
class storeValue extends Component {

  state = {
    curType: 1,
    tab: 1,
    created: [moment(moment().format('YYYY-MM')).unix(), moment().month(moment().month()).endOf('month').unix()],
    data: [],
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
      type: "storesDataPerValue/getStoresList",
      payload: {},
    })
  }
  /**
   * 今天/本月/本年
   */
  changeButton = (curType) => {
    let m = moment().format('YYYY-MM')
    let y = moment().format('YYYY')
    let start, end
    this.setState({ timeArr: [] })
    switch (curType) {
      case 1:
        start = moment(m).unix()
        end = moment().month(moment().month()).endOf('month').unix()
        break
      case 2:
        start = moment(y).unix()
        end = moment().year(moment().year()).endOf('year').unix()
        break
      default:
        return
    }
    this.setState({ curType, created: [start, end] })
  }

  callback = (e) => {
    this.setState({ tab: e * 1, curType: 1 })
    types.screen.query['completed[<>]'] = undefined
    products.screen.query['completed[<>]'] = undefined
  }

  render() {
    const { storesList } = this.props
    const { curType, tab, created } = this.state
    const btns = (
      <div className='flex'>
        <Button
          size='large'
          type={curType === 1 ? "primary" : 'default'}
          style={{ width: 88, marginRight: '25px' }}
          onClick={() => this.changeButton(1)}
        >本月</Button>
        <Button
          size='large'
          type={curType === 2 ? 'primary' : 'default'}
          style={{ width: 88, marginRight: '25px' }}
          onClick={() => this.changeButton(2)}
        >本年</Button>
      </div>
    )

    types.screen.rules[0].list = storesList || ''
    products.screen.rules[0].list = storesList || ''
    types.screen.rules[1].component = btns
    products.screen.rules[1].component = btns
    if (tab === 1) {
      types.screen.query = { ...types.screen.query, 'completed[<>]': created }
    } else if (tab === 2) {
      products.screen.query = { ...products.screen.query, 'completed[<>]': created }
    }
    return (
      <div style={{ padding: 30 }}>
        <Tabs onChange={this.callback}>
          <TabPane tab="业务类型产值" key="1">
            {
              tab === 1 &&
              <div style={{ margin: '0 -30px' }}>
                <CommonTable New name="brand/wide/center/store/output/type" tableConfig={types} />
              </div>
            }
          </TabPane>
          <TabPane tab="员工产值" key="2">
            {
              tab === 2 &&
              <div style={{ margin: '0 -30px' }}>
                <CommonTable New name="brand/wide/center/store/output" tableConfig={products} />
              </div>
            }
          </TabPane>
        </Tabs>
      </div>
    )
  }
}

function mapStateToProps(state) {
  const { storesList } = state.storesDataPerValue
  return { storesList }
}
export default connect(mapStateToProps)(storeValue)