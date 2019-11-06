import { Component } from 'react'
import { Tabs } from 'antd'
import MissionTable1 from './component/table'
import MissionTable2 from './component/table'
// import MissionTable3 from './component/table'

const TabPane = Tabs.TabPane

class sellSet extends Component {

  state = {

  }

  callback = () => {
    this.project && this.project.queEdit()
    this.product && this.product.queEdit()
  }

  onRef = (ref) => {
    this.project = ref
  }

  onRef2 = (ref) => {
    this.product = ref
  }


  render() {
    const project = {
      edit:  true,
      batch: true,
      title: '项目分类提成',
      name: 'store/commission/sale',
      onRef: this.onRef,
      where: {typeTem: 1, itemType: 1, special: 2},
    }
    const product = {
      edit:  true,
      batch: true,
      title: '产品分类提成',
      name: 'store/commission/sale',
      onRef: this.onRef2,
      where: {typeTem: 1, itemType: 2, special: 2},
      special: '特殊提成产品数',
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
        </Tabs>
      </div>
    )
  }
}

export default sellSet