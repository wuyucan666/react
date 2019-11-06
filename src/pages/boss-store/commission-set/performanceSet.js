import { Component } from 'react'
import MissionTable from './component/performanTable'
class sellSet extends Component {

  state = {

  }

  render() {
    const card = {
      add: 'work',
      del: true,
      name: 'store/commission/reward',
    }
    return (
      <div style={{padding: '30px'}}>
        <MissionTable
        {...card}
        ></MissionTable>
      </div>
    )
  }
}

export default sellSet
