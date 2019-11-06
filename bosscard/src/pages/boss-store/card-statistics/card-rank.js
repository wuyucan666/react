import React, { Component } from "react"
import { connect } from "dva"
import CommonTable from "../../../components/CommonTable/index"
import { } from "antd"
import tableConfig from "./tableConfig"
import styles from "./styles.less"
class CardRank extends Component {
  constructor() {
    super()
    this.state = { }
  }
  
  render() {
    return (
      <div className={styles.pigeon_card_rank}>
        <CommonTable
          name="wide-ranking/details?driver=cardRevenue"
          New
          tableConfig={tableConfig}
        />
      </div>
    )
  }
}
function mapStateToProps(state) {
  const { cardSList } = state.cardStatistics
  return { cardSList }
}
export default connect(mapStateToProps)(CardRank)
