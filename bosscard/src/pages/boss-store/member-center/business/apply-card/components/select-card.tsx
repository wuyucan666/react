import React, { Component } from "react"
import { Radio } from "antd"
import SelectNumberCard from "pages/boss-store/member-center/components/select-number-card"
import SelectUpCard from "pages/boss-store/member-center/components/select-card"
import { connect } from "dva"
import { State } from "../model"
import NumberCardDetail from "../../../components/select-number-card/detail"
import UpCardDetail from "../../../components/select-card/detail"
import CustomCard from "./custom-card";
const style = require("./select-card.less")

/**选择卡 */
export default connect(({ applyCard }) => applyCard)(
  class SelectCard extends Component<State & any> {
    state = {
      mode: 1,
    }

    componentDidMount() {
      this.props.selectedCardType === 3 && this.setState({ mode: 3 })
    }

    handleModeChange(event) {
      const type = Number(event.target.value)
      if (type === 3) {
        this.props.dispatch({
          type: 'applyCard/setCardId',
          payload: {
            id: 0,
            type: 3
          }
        })
      }
      this.setState({ mode: event.target.value })
    }

    render() {
      return (
        <div className={style["select-card"]}>
          {/* 选择卡之前的状态 */}
          {!this.props.selectedCardId && (
            <div style={{ paddingBottom: 32 }}>
              <Radio.Group
                size="large"
                className="radio-group"
                onChange={this.handleModeChange.bind(this)}
                value={this.state.mode}
              >
                <Radio.Button value={1}>充值卡</Radio.Button>
                <Radio.Button value={2}>计次卡</Radio.Button>
                <Radio.Button value={3}>自定义卡</Radio.Button>
              </Radio.Group>
              {this.state.mode === 3 && <CustomCard onNext={this.props.onNext} />}
              {this.state.mode === 2 && <SelectNumberCard />}
              {this.state.mode === 1 && <SelectUpCard />}
            </div>
          )}
          {/* 选择卡之后的状态 */}
          <div className="detail">
            {/* 计次卡详情 */}
            {!!this.props.selectedCardId &&
              this.props.selectedCardType === 1 && (
                <NumberCardDetail selectedCard={this.props.selectedCard} id={this.props.selectedCardId} />
              )}
            {/* 充值卡详情 */}
            {!!this.props.selectedCardId &&
              this.props.selectedCardType === 2 && (
                <UpCardDetail selectedCard={this.props.selectedCard} id={this.props.selectedCardId} />
              )}
          </div>
        </div>
      )
    }
  }
)
