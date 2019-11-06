import { Component } from 'react'
import { Button, Tabs } from 'antd'
import moment from 'moment'
import CommonTable from '../../../components/CommonTable/index'
import config from './config/expressCfg.js'

const { TabPane } = Tabs
const { projectCfg, productCfg } = config
class Expression extends Component {

  state = {
    curType: 1,
    curTab: 1,
    value: [],
    created: [
      (moment().month(moment().month()).startOf('month').valueOf() / 1000).toFixed(0),
      (moment().month(moment().month()).endOf('month').valueOf() / 1000).toFixed(0),
    ],
  }

  handelBtn = (e) => {
    this.setState({curType: e})
    let created = []
    if(e === 1) {
      created = [
        (moment().month(moment().month()).startOf('month').valueOf() / 1000).toFixed(0),
        (moment().month(moment().month()).endOf('month').valueOf() / 1000).toFixed(0),
      ]
    }else if(e === 2) {
      created = [
        (moment().year(moment().year()).startOf('year').valueOf() / 1000).toFixed(0),
        (moment().year(moment().year()).endOf('year').valueOf() / 1000).toFixed(0),
      ]
    }else {
      created = undefined
    }
    this.setState({created})
  }

  callback = (e) => {
    console.log(11111, e)
    this.setState({curTab: e * 1, curType: 1})
    projectCfg.screen.query['completed[<>]'] = undefined
    productCfg.screen.query['completed[<>]'] = undefined
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
    const btns = (
      <div className='flex'>
        <Button 
        size='large'
        type={this.state.curType === 1 ? "primary" : 'default'}
        style={{width: 88, marginRight: '25px'}}
        onClick={() => this.handelBtn(1)}
        >本月</Button>
        <Button 
        size='large' 
        type={this.state.curType === 2 ? 'primary' : 'default'}
        style={{width: 88, marginRight: '25px'}}
        onClick={() => this.handelBtn(2)}
        >本年</Button>
      </div>
    )
    projectCfg.screen.rules[0].component = btns
    productCfg.screen.rules[0].component = btns
    if(this.state.curTab === 1) {
      projectCfg.screen.query = {...projectCfg.screen.query, 'completed[<>]': this.state.created}
    }else if(this.state.curTab === 2) {
      productCfg.screen.query = {...productCfg.screen.query, 'completed[<>]': this.state.created}
    }
    return (
      <div style={{padding: 30}}>
        <Tabs onChange={this.callback}>
          <TabPane tab="项目" key="1">
          {
            this.state.curTab === 1 &&
            <div style={{margin: '0 -30px'}}>
              <CommonTable
                New
                name="brand/wide/center/collect/goods"
                tableConfig={projectCfg}
                onReSet={this.onReSet}
                onTableChange={this.onTableChange.bind(this)}
              />
            </div>
          }
          </TabPane>
          <TabPane tab="产品" key="2">
          {
            this.state.curTab === 2 &&
            <div style={{margin: '0 -30px'}}>
              <CommonTable
                New
                name="brand/wide/center/collect/goods"
                tableConfig={productCfg}
                onReSet={this.onReSet}
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

export default Expression