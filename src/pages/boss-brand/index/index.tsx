import React, { Component } from "react"
import MainData from "./components/main-data"
import MainBox from "./components/main-box"
import Trend from "./components/trend"
import Pie from "./components/pie"
import { connect } from "dva"
import MainDetail from "./components/main-detail"
import MaintainTable from "./components/rank-table/maintainTable"
import ItemTable from "./components/rank-table/itemsTable"
import MonthStoreSort from "./components/rank-table/monthStoreSort"
import MonthStaffSort from "./components/rank-table/monthStaffSort"

const styles = require("./index.less")

interface Defaultprop {
  dispatch:Function
}

 class BrandIndex extends Component<Defaultprop,{}> {
  UNSAFE_componentWillMount(){
      this.props.dispatch({ type:'app/getSystemMessage' })
  }
  render() {
    return (
      <div className={styles.warp}>
        <MainData />
        <div className="charts">
          <MainBox title="经营发展趋势">
            <Trend />
          </MainBox>
          <MainBox title="实收金额">
            <Pie />
          </MainBox>
        </div>
        <MainBox title="昨日收支明细">
          <MainDetail />
        </MainBox>
        <MainBox title="各类维修类型排名（90日数据）">
          <MaintainTable />
        </MainBox>
        <MainBox
          title="各项目/产品排名（90日数据）"
          link="/boss-brand/storesData/performance"
        >
          <ItemTable />
        </MainBox>
        <MainBox title="本月门店排名">
          <MonthStoreSort />
        </MainBox>
        <MainBox title="本月员工排名">
          <MonthStaffSort />
        </MainBox>
      </div>
    )
  }
}
export default connect()(BrandIndex)