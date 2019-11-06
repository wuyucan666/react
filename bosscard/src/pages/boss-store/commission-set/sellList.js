import { Component } from 'react'
import CommonTable1 from '../../../components/CommonTable/index'
import CommonTable2 from '../../../components/CommonTable/index'
import moment from 'moment'
import service from "services"
import { Tabs } from 'antd'

import config from './config/sTableConfig'

const { projectConfig, productConfig } = config
const TabPane = Tabs.TabPane

class sellList extends Component {

  state = {
    curType: 1,
    curTab: 1,
    created: [
      (moment().month(moment().month()).startOf('month').valueOf() / 1000).toFixed(0),
      (moment().month(moment().month()).endOf('month').valueOf() / 1000).toFixed(0),
    ],
  }

  componentWillMount () {
    service
      .LIST({
        keys: { name: "store/staff/list" },
        data: {
          q: { page: 1, limit: -1, where: { "business[~]": 3, isJob: 1 } },
        },
      })
      .then(res => {
        let list = res.list.map(e => ({value: e.staffId, name: e.staffName}))
        if (res.success) {
          projectConfig.screen.rules.map(v => {
            if(v.prop === 'deductStaffId') {
              v.list = list
            }
            return v
          })
          productConfig.screen.rules.map(v => {
            if(v.prop === 'deductStaffId') {
              v.list = list
            }
            return v
          })
        }
      })
  }

  callback = (e) => {
    this.setState({curTab: e * 1, curType: 1})
  }

  changeDate = (e) => {
    return e.map((v,i) => ({...v, key: i}))
  }

  onReSet = () => {
    return {test: 11}
  }

  onTableChange = () => {
  }

  render() {
    return (
      <div style={{padding: '30px'}}>
         <Tabs defaultActiveKey="1" onChange={this.callback}>
          <TabPane tab="项目" key="1">
            {
              this.state.curTab === 1 &&
              <div style={{margin: '0 -30px'}}>
                <CommonTable1
                New
                name='wide-performance/sales/deduct/list'
                tableConfig={projectConfig}
                onDataChangeBefore={this.changeDate}
                onTableChange={this.onTableChange.bind(this)}
                ></CommonTable1>
              </div>
            }
          </TabPane>
          <TabPane tab="产品" key="2">
            {
              this.state.curTab === 2 &&
              <div style={{margin: '0 -30px'}}>
                <CommonTable2
                New
                name='wide-performance/sales/deduct/list'
                tableConfig={productConfig}
                onDataChangeBefore={this.changeDate}
                onTableChange={this.onTableChange.bind(this)}
                ></CommonTable2>
              </div>
            }
          </TabPane>
        </Tabs>
      </div>
    )
  }
}

export default sellList