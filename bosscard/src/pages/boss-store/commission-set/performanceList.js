import { Component } from 'react'
import router from 'umi/router'
import CommonTable from '../../../components/CommonTable/index'
import { Button, DatePicker } from 'antd'
import moment from 'moment'
import service from "services"

import config from './config/pTableConfig'

const { perforConfig } = config
const { RangePicker } = DatePicker

class sellList extends Component {

  state = {
    curType: 1,
    created: [
      (moment().month(moment().month() - 1).startOf('month').valueOf() / 1000).toFixed(0),
      (moment().month(moment().month() - 1).endOf('month').valueOf() / 1000).toFixed(0),
    ],
    value: [],
  }

  componentWillMount () {
    service
      .LIST({
        keys: { name: "store/staff/list" },
        data: {
          q: { page: 1, limit: -1, where: { "business[~]": 3, '|business[~]': 4, isJob: 1 } },
        },
      })
      .then(res => {
        let list = res.list.map(e => ({value: e.staffId, name: e.staffName}))
        if (res.success) {
          perforConfig.screen.rules.map(v => {
            if(v.prop === 'deductStaffId') {
              v.list = list
            }
            return v
          })
        }
      })
    const toSet = (
      <div>
        <Button
        type='primary'
        size='large'
        style={{width: '120px'}}
        onClick={() => router.push('/boss-store/commission-set/performanceSet')}
        >
          <i className='iconfont icon-shezhi1' style={{marginRight: '8px'}}></i>
          提成设置
        </Button>
      </div>
    )
    perforConfig.screen.moreContent = toSet
  }

  changeDate = (e) => {
    return e.map(v => ({...v, temp1: v.staffDeduct, temp2: v.staffDeduct, temp3: v.staffDeduct, temp4: v.staffDeduct}))
  }

  changeType = (e) => {
    this.setState({curType: e})
    let created = []
    if(e === 1) {
      created = [
        (moment().month(moment().month() - 1).startOf('month').valueOf() / 1000).toFixed(0),
        (moment().month(moment().month() - 1).endOf('month').valueOf() / 1000).toFixed(0),
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

  onTableChange = () => {
  }

  handlePanelChange = (value) => {
    let created = value.map(v => {
      return (v.startOf('month').valueOf() / 1000).toFixed(0)
    })
    this.setState({value, created})
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

  render() {
    perforConfig.screen.rules[0].component = (
      <div className='flex'>
      <Button
      size='large'
      type={this.state.curType === 1 ? 'primary' : 'default'}
      style={{flex: 1, marginRight: '25px'}}
      onClick={() => this.changeType(1)}
      >上月</Button>
      <Button
      size='large'
      type={this.state.curType === 2 ? 'primary' : 'default'}
      style={{flex: 1, marginRight: '25px'}}
      onClick={() => this.changeType(2)}
      >本年</Button>
      <Button
      size='large'
      type={this.state.curType === 3 ? 'primary' : 'default'}
      style={{flex: 1}}
      onClick={() => this.changeType(3)}
      >历史</Button>
    </div>
    )
    perforConfig.screen.rules[1].component = (
      <div>
        <RangePicker
        size='large'
        format="YYYY-MM"
        value={this.state.value}
        style={{width: '100%'}}
        mode={['month', 'month']}
        onPanelChange={this.handlePanelChange}
        ></RangePicker>
      </div>
    )
    perforConfig.screen.query = {
      'created[<>]': this.state.created,
    }
    return (
      <div>
        <CommonTable
        New
        name='wide-detail/reward/deduct/list'
        tableConfig={perforConfig}
        onReSet={this.onReSet}
        onTableChange={this.onTableChange.bind(this)}
        ></CommonTable>
      </div>
    )
  }
}

export default sellList
