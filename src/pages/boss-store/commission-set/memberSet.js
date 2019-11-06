import { Component } from 'react'
import MissionTable from './component/cardTable'

class sellSet extends Component {

  state = {

  }

  callback = () => {
    console.log('回调')
  }

  render() {

    const card = {
      edit: true,
      batch: true,
      name: 'store/commission/clientcard',
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