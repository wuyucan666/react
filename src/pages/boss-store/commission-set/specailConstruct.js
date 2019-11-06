import { Component } from 'react'
import { Tabs } from 'antd'
import MissionTable1 from './component/table'
import MissionTable2 from './component/table'
import MissionTable3 from './component/table'

const TabPane = Tabs.TabPane

class sellSet extends Component {

  state = {

  }

  callback = () => {
    this.project && this.project.queEdit()
    this.product && this.product.queEdit()
    this.addition && this.addition.queEdit()
  }

  onRef = (ref) => {
    this.project = ref
  }

  onRef2 = (ref) => {
    this.product = ref
  }

  onRef3 = (ref) => {
    this.addition = ref
  }

  render() {
    const project = {
      add:  'project',
      batch: true,
      del: true,
      title: '特殊项目提成',
      name: 'store/commission/special/sale',
      onRef: this.onRef,
      where: {typeTem: 1, itemType: 1, special: 1},
      rowTit: '项目名称',
    }
    const product = {
      add:  'product',
      batch: true,
      del: true,
      title: '特殊产品提成',
      name: 'store/commission/special/sale',
      onRef: this.onRef2,
      where: {typeTem: 1, itemType: 2, special: 1},
      rowTit: '产品名称',
    }
    const addition = {
      add:  'addition',
      batch: true,
      del: true,
      title: '特殊附加项目提成',
      name: 'store/commission/special/sale',
      onRef: this.onRef3,
      where: {typeTem: 1, itemType: 3, special: 1},
      rowTit: '项目名称',
    }
    return (
      <div style={{padding: '30px'}}>
        <Tabs defaultActiveKey="1" onChange={this.callback}>
          <TabPane tab="项目提成" key="1">
            <MissionTable1 {...project}></MissionTable1>
          </TabPane>
          <TabPane tab="产品提成" key="2">
            <MissionTable2 {...product}></MissionTable2>
          </TabPane>
          <TabPane tab="附加项目" key="3">
            <MissionTable3 {...addition}></MissionTable3>
          </TabPane>
        </Tabs>
      </div>
    )
  }
}

export default sellSet