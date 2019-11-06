import { Component } from 'react'
import CommonTable from '../../../components/CommonTable/index'
import moment from 'moment'
import service from "services"

import config from './config/countTableConfig'

const { countConfig } = config

class sellList extends Component {

  state = {
    curType: 1,
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
        countConfig.screen.rules.map(v => {
          if(v.prop === 'deductStaffId') {
            v.list = list
          }
          return v
        })
      }
    })
  }

  changeDate = (e) => {
    return e.map(v => ({...v, temp1: v.staffDeduct, temp2: v.staffDeduct, temp3: v.staffDeduct, temp4: v.staffDeduct}))
  }

  onTableChange = () => {
  }

  render() {
    return (
      <div>
        <CommonTable
        New
        name='wide-performance/records/deduct/list'
        tableConfig={countConfig}
        onTableChange={this.onTableChange.bind(this)}
        ></CommonTable>
      </div>
    )
  }
}

export default sellList