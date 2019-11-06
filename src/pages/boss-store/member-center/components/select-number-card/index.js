import { Component } from "react"
import { Popover, Spin } from "antd"
import { connect } from "dva"
import services from "services"
import style from "./index.less"
import moment from "moment"
const empty = require("../../img/no_card.jpg")

/** 获取单位 */
const getUnit = (unitStatus) =>
  unitStatus === 1 ? "year" : unitStatus === 2 ? "month" : "day"

/**
 * 选择充值卡的组件
 */
class SelectCard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      cards: [], // 所有的卡项
      poverWidth: 0, // 卡项的宽度
      selected: props.selected,
    }
  }

  UNSAFE_componentWillReceiveProps(props) {
    this.setState({
      selected: props.selected,
    })
  }

  componentDidMount() {
    this.getData()
  }

  getData() {
    services
      .list({ keys: { name: "store/records" } })
      .then((res) =>
        this.setState({ cards: res.list.filter((_) => _.statusTem === 1) })
      )
  }

  /**
   * 获取弹窗的宽度
   */
  getPopoverWidth() {
    this.setState({ poverWidth: 300 })
    // this.setState({ poverWidth: this.refs.card.offsetWidth - 14 })
  }

  /**
   * 选择当前的项目
   */
  setActive(item) {
    this.props.dispatch({
      type: "applyCard/setCardDetail",
      payload: {},
    })
    this.props.dispatch({
      type: "applyCard/setCardId",
      payload: {
        id: item.recordsId,
        type: 1,
      },
    })
  }

  render() {
    return (
      <div>
        {!this.state.selected && (this.state.cards.length === 0) && <div style={{textAlign:'center'}}>
          <img src={empty} alt="" style={{margin: '0 auto'}} />
          <p style={{fontSize: '14px', color: '#333', textAlign: 'center'}}>暂无相关卡项</p>
        </div>}
        <div className={!this.state.selected ? style.wrap : ""}>
          {!this.state.selected &&
            this.state.cards.map((_, index) => (
              <Popover
                key={index}
                placement="rightTop"
                onMouseEnter={this.getPopoverWidth.bind(this)}
                // 当卡片显示时，请求详细数据赋值到父级数据结构
                onVisibleChange={async (visible) => {
                  if (visible && !_.detail) {
                    let newCards = [...this.state.cards]
                    newCards.splice(index, 1, {
                      ..._,
                      loading: true,
                    })
                    this.setState({
                      cards: newCards,
                    })
                    const { code, list } = await services.detail({
                      keys: { name: "store/records" },
                      data: { recordsId: _.recordsId },
                    })
                    if (code === "0") {
                      newCards.splice(index, 1, {
                        ..._,
                        detail: list,
                        loading: false,
                      })
                      this.setState({
                        cards: newCards,
                      })
                    }
                  }
                }}
                content={
                  <div
                    className={style.pover + " flex center top"}
                    style={{ width: this.state.poverWidth }}
                  >
                    <Spin spinning={_.loading}>
                      {_.detail &&
                        _.detail.recordsInfo.map((_) => (
                          <div
                            className="flex center"
                            style={{ width: this.state.poverWidth - 20 }}
                            key={_.goodId}
                          >
                            <div className="item">{_.goodName}</div>
                            <div className="num">{_.commodityCode}</div>
                            <div className="num">
                              {_.goodNum === -1 ? "无限" : "*" + _.goodNum}
                            </div>
                          </div>
                        ))}
                    </Spin>
                  </div>
                }
                trigger="hover"
              >
                <div
                  ref="card"
                  className="card"
                  onClick={() => this.setActive(_)}
                >
                  <div className="title flex">
                    <span className="item">{_.cardName}</span>
                    {
                      _.cardType === 4 &&
                      <span>{_.packageCount*1}次</span>
                    }
                  </div>
                  <div className="date">
                    有效期：
                    {_.neverValid === 1
                      ? "无限"
                      : moment()
                          .add(_.deadlineNum, getUnit(_.deadlineUnit))
                          .format("YYYY-MM-DD日")}
                  </div>
                  <div className="price">￥{_.amount}</div>
                </div>
              </Popover>
            ))}
        </div>
      </div>
    )
  }
}

export default connect()(SelectCard)
