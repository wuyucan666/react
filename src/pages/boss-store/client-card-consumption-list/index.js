/**
 * @file 会员卡消耗列表
 */

import React, { PureComponent } from "react"
import { Tabs } from "antd"
import UpCardConsumptionList from "./components/upCard"
import NumberCardConsumptionList from "./components/numberCard"

const TabPane = Tabs.TabPane

export default class ClientCardConsumptionList extends PureComponent {
  state = { activeKey: "1" }
  handleChangeActiveKey(key) {
    this.setState({
      activeKey: key,
    })
  }
  render() {
    return (
      <div style={{ padding: 32 }}>
        <Tabs
          activeKey={this.state.activeKey}
          onChange={this.handleChangeActiveKey.bind(this)}
        >
          <TabPane tab="充值卡" key="1">
            <div style={{ margin: "-18px -32px 0" }}>
              {this.state.activeKey === "1" && <UpCardConsumptionList />}
            </div>
          </TabPane>
          <TabPane tab="计次卡" key="2">
            <div style={{ margin: "-18px -32px 0" }}>
              {this.state.activeKey === "2" && <NumberCardConsumptionList />}
            </div>
          </TabPane>
        </Tabs>
      </div>
    )
  }
}
