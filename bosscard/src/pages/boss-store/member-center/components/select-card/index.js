import { Component } from "react"
import { Popover, Spin } from "antd"
import services from "services"
import style from "./index.less"
import moment from "moment"
import ExtendDetail from "./extend_detail"
import { connect } from "dva"
import request from '@/utils/request'
const empty = require("../../img/no_card.jpg")

/**
 * 选择充值卡的组件
 */
export default connect()(
  class SelectUpCard extends Component {
    constructor(props) {
      super(props)
      this.state = {
        cards: [], // 所有的卡项
        selected: props.selected, // 选择的卡项
        poverWidth: 0, // 卡项的宽度
        loading: false,
      }
    }

    componentDidMount() {
      this.getData()
    }

    getData() {
      if (this.props.isExtend) {
        if (this.props.selectClient) {
          this.setState({ loading: true })
          services
            .LIST({
              keys: { name: "store/client/upcard" },
              data: {
                clientId: this.props.selectClient,
                q: {
                  where: {
                    status: 1,
                    cardType: 1,
                    "deadlineTime[>]|deadlineTime": [moment().unix(), -1],
                  },
                },
              },
            })
            .then((res) => {
              this.setState({ cards: res.list, loading: false })
            })
            .catch(() => this.setState({ loading: false }))
        }
      } else {
        this.setState({ loading: true })
        services
          .list({ keys: { name: "store/species" } })
          .then((res) =>
            this.setState({
              cards: res.list.filter((_) => _.state === 1),
              loading: false,
            })
          )
          .catch(() => this.setState({ loading: false }))
      }
    }

    /**
     * 获取弹窗的宽度
     */
    getPopoverWidth() {
      this.setState({ poverWidth: 300 })
      // this.setState({ poverWidth: this.refs.card.offsetWidth - 14 })
    }

    /**
     * 设置赠送项目/产品
     */
    setGiveInfo = (giveInfo) => {
      let total = {
        key: -1,
        pName: "总计",
        discount: "",
        unitPrice: "",
        numTem: 0,
        balidityPeriod: 0,
      }
      giveInfo = giveInfo.map((item, i) => {
        total.numTem = total.numTem + Number(item.numTem)
        total.balidityPeriod =
          total.balidityPeriod + Number(item.money * item.numTem)
        return {
          ...item,
          key: i + 1,
          pId: item.goodId,
          discount: 10,
          productId: item.speciesType === 6 ? item.goodId : '',
          projectId: item.speciesType === 5 ? item.goodId : '',
          pName: item.name,
          type: item.speciesType === 5 ? 1 : 2,
          typeTem: item.speciesType === 5 ? 1 : 2,
          unitPrice: item.money,
          balidityPeriod: item.money * item.numTem,
          deadlineTime: item.deadlineMonth * 1 === -1 ? moment() : moment().add(item.deadlineMonth, 'month'),
          deadlineStatus: item.deadlineMonth * 1 === -1 ? 0 : 1,
        }
      })
      total.balidityPeriod = total.balidityPeriod.toFixed(2)
      giveInfo = [...giveInfo, total]
      console.log('giveInfo', giveInfo)
      this.props.dispatch({
        type: "applyCard/setGives",
        payload: giveInfo,
      })
    }


    /**
     * 选择当前的项目
     */
    setActive(item) {
      if (this.props.isExtend) {
        this.setState({
          selected: item,
        })
        this.props.onChange && this.props.onChange(item)
      } else {
        if (item.detail && item.detail.giveInfo.length > 0) { //当前充值卡绑定了赠送项目
          console.log('-----------------当前充值卡绑定了赠送项目')
          this.setGiveInfo(item.detail.giveInfo)
        }
        this.props.dispatch({
          type: "applyCard/setCardId",
          payload: {
            id: item.speciesId,
            type: 2,
          },
        })
      }
    }

    getCardDetail = async (card) => {
      if (this.props.isExtend) {
        return request({
          url: 'store/clientcard/species/details/' + card.id,
        })
      } else {
        return services.detail({
          keys: { name: "store/species" },
          data: { speciesId: card.speciesId },
        })
      }
    }

    render() {

      const getUnit = (type) => type === 1 ? '折' : '元'

      return (
        <div>
          {!this.state.selected && (this.state.cards.length === 0) && <div style={{ textAlign: 'center' }}>
            <img src={empty} alt="" style={{ margin: '0 auto' }} />
            <p style={{ fontSize: '14px', color: '#333', textAlign: 'center' }}>暂无相关卡项</p>
          </div>}
          <Spin spinning={this.state.loading}>
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
                        const { code, list, data } = await this.getCardDetail(_)
                        if (code === "0") {
                          newCards.splice(index, 1, {
                            ..._,
                            detail: list || data,
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
                        className={style.pover}
                        style={{ width: this.state.poverWidth }}
                      >
                        <Spin spinning={_.loading}>
                          {_.detail && (
                            <div>
                              {!!_.detail.project.length && <h3>项目折扣</h3>}
                              {_.detail.project.map((_) => (
                                <div
                                  className="flex center"
                                  style={{ width: this.state.poverWidth - 20 }}
                                  key={_.goodId}
                                >
                                  <div className="item">{_.name}</div>
                                  <div className="num">{_.discount}{getUnit(_.discountType)}</div>
                                </div>
                              ))}
                              {!!_.detail.product.length && <h3>产品折扣</h3>}
                              {_.detail.product.map((_) => (
                                <div
                                  className="flex center"
                                  style={{ width: this.state.poverWidth - 20 }}
                                  key={_.goodId}
                                >
                                  <div className="item">{_.name}</div>
                                  <div className="num" style={{ marginLeft: '10px' }}>{_.commodityCode}</div>
                                  <div className="num">{_.discount}{getUnit(_.discountType)}</div>
                                </div>
                              ))}
                              {!!_.detail.specialProject.length && (
                                <h3>特殊项目折扣</h3>
                              )}
                              {_.detail.specialProject.map((_) => (
                                <div
                                  className="flex center"
                                  style={{ width: this.state.poverWidth - 20 }}
                                  key={_.goodId}
                                >
                                  <div className="item">{_.name}</div>
                                  <div className="num">{_.discount}{getUnit(_.discountType)}</div>
                                </div>
                              ))}
                              {!!_.detail.specialProduct.length && (
                                <h3>特殊产品折扣</h3>
                              )}
                              {_.detail.specialProduct.map((_) => (
                                <div
                                  className="flex center"
                                  style={{ width: this.state.poverWidth - 20 }}
                                  key={_.goodId}
                                >
                                  <div className="item">{_.name}</div>
                                  <div className="num" style={{ marginLeft: '10px' }}>{_.commodityCode}</div>
                                  <div className="num">{_.discount}{getUnit(_.discountType)}</div>
                                </div>
                              ))}
                            </div>
                          )}
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
                      <div className="title">{_.cardName}</div>
                      <div className="date">
                        有效期：
                        {(_.deadline === -1 || _.neverValid === 1)
                          ? "无限期"
                          : moment(_.deadline * 1000).format("YYYY-MM-DD")}
                      </div>
                      {!this.props.isExtend ? (
                        <div className="price">
                          充值￥{_.rechargeMoney} 赠送￥{_.giveMoney}
                        </div>
                      ) : (
                          <div className="price">余额￥{_.balance}</div>
                        )}
                    </div>
                  </Popover>
                ))}
              {!!this.state.selected &&
                (this.props.isExtend && (
                  <ExtendDetail
                    id={this.state.selected.speciesId}
                    extendId={this.state.selected.id}
                    onCancel={() => {
                      this.setState({
                        selected: 0,
                      })
                      this.props.onChange(0)
                    }}
                  />
                ))}
            </div>
          </Spin>
        </div>
      )
    }
  }
)
