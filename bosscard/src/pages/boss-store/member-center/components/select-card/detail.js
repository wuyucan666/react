import { Component } from "react"
import { Spin, Table, InputNumber, Select, Button, DatePicker, Modal } from "antd"
import { connect } from "dva"
import moment from "moment"
import services from "services"
import styles from "./index.less"
import { recharge } from "../../../../../services/store"

class Detail extends Component {
  constructor(props) {
    super(props)
    const hasDetail = Object.keys(props.selectedCard).length > 0
    this.state = {
      detail: hasDetail ? { ...props.selectedCard } : {},
      loading: !hasDetail,
      edit: false,
    }
    !hasDetail && this.getDetail(props.id)
  }
  /**
   * 获取充值卡的详情
   * @param {String|Number} id 选择的充值卡的详情
   */
  getDetail(id) {
    services
      .detail({
        keys: { name: "store/species" },
        data: { speciesId: id },
      })
      .then((res) => {
        const detail = this.getStaticDetail(res.list)
        this.setState({
          loading: false,
          detail,
        })
        this.props.dispatch({
          type: "applyCard/setCardDetail",
          payload: detail,
        })
      })
  }

  getStaticDetail(_detail) {
    const getUnit = (unitStatus) =>
      unitStatus === 1 ? "year" : unitStatus === 2 ? "month" : "day"
    return {
      ..._detail,
      deadlineStatus: _detail.neverValid ? 0 : 1,
      deadlineTime: moment().add(
        _detail.deadlineNum,
        getUnit(_detail.deadlineUnit)
      ),
    }
  }

  handleDatePickerChange(momentObj) {
    this.setState({
      detail: { ...this.state.detail, deadlineTime: momentObj },
    })
  }

  handleSelectChange(value) {
    this.setState({
      detail: { ...this.state.detail, deadlineStatus: value },
    })
  }

  handleReset() {
    if (this.state.detail.giveInfo.length) {
      return Modal.confirm({
        title: '重新选择',
        content: '卡内赠送的服务已添加到[赠送]，请查看',
        okText: '仍然重新选择',
        cancelText: '取消',
        onOk: () => {
          this.reset()
        },
      })
    }
    this.reset()
  }

  reset() {
    this.props.dispatch({
      type: "applyCard/setCardDetail",
      payload: {},
    })
    this.props.dispatch({
      type: "applyCard/setCardId",
      payload: 0,
    })
  }



  render() {
    const { Option } = Select
    const rechargeNum=this.state.detail.rechargeMoney*1
    const totalNum=this.state.detail.rechargeMoney*1+this.state.detail.giveMoney*1
    const scale=Number(this.state.detail.giveMoney)>0?parseInt((rechargeNum/totalNum)*100):100
    const columns = [
      {
        title: "名称",
        dataIndex: "cardName",
        key: 0,
      },
      {
        title: "充值金额",
        dataIndex: "rechargeMoney",
        key: 1,
        render: (value) =>
          this.state.edit ? (
            <InputNumber
              value={value}
              min={0}
              precision={2}
              onChange={(value) =>
                this.setState({
                  detail: {
                    ...this.state.detail,
                    rechargeMoney: value || 0,
                  },
                })
              }
            />
          ) : (
              value
            ),
      },
      {
        title: "赠送金额",
        dataIndex: "giveMoney",
        key: 2,
        render: (value) =>
          this.state.edit ? (
            <InputNumber
              value={value}
              min={0}
              precision={2}
              onChange={(value) =>
                this.setState({
                  detail: {
                    ...this.state.detail,
                    giveMoney: value || 0,
                  },
                })
              }
            />
          ) : (
              value
            ),
      },
      {
        title: "有效期",
        dataIndex: "deadlineTime",
        key: 3,
        render: (value, ret) =>
          this.state.edit ? (
            <div calss="date-select">
              <Select
                value={ret.deadlineStatus}
                onChange={this.handleSelectChange.bind(this)}
                style={{verticalAlign:'middle'}}
              >
                <Option value={1}>有限期</Option>
                <Option value={0}>无限期</Option>
              </Select>
              <DatePicker
                style={{ borderLeft:0,verticalAlign:'middle' }}
                disabled={!ret.deadlineStatus}
                value={value}
                onChange={this.handleDatePickerChange.bind(this)}
              />
            </div>
          ) : ret.deadlineStatus === 0 ? (
            "永久"
          ) : (
                moment(value).format("YYYY-MM-DD")
              ),
      },
    ]
    return (
      <Spin wrapperClassName={styles.detail} spinning={this.state.loading}>
        <div className="head flex center">
          <h3 className="item">选择充值卡</h3>
          <span onClick={this.handleReset.bind(this)}>
            <i className="iconfont icon-fanhui" />
            重新选择
          </span>
        </div>
        {!this.state.loading && (
          <div>
            <Table
              columns={columns}
              pagination={{ hideOnSinglePage: true }}
              dataSource={[{ ...this.state.detail, key: 1 }]}
            />
            <p className="content">注：实收金额比例为{scale}%，即该卡每使用1元，产生{scale/100}的消耗。</p>
            <h3>包含折扣</h3>
            <ul>
              <li>
                <span className="title">项目折扣：</span>
                <span className="content">
                  {this.state.detail.project.reduce(
                    (last, _) =>
                      (last ? last + "/" : "") +
                      _.name +
                      _.discount +
                      (_.discountType === 1 ? "折" : "元"),
                    ""
                  )}
                </span>
              </li>
              <li>
                <span className="title">产品折扣：</span>
                <span className="content">
                  {this.state.detail.product.reduce(
                    (last, _) =>
                      (last ? last + "/" : "") +
                      _.name +
                      _.discount +
                      (_.discountType === 1 ? "折" : "元") + ' ' + (_.commodityCode ? _.commodityCode : ''),
                    ""
                  )}
                </span>
              </li>
              <li>
                <span className="title">特殊项目折扣：</span>
                <span className="content">
                  {this.state.detail.specialProject.reduce(
                    (last, _) =>
                      (last ? last + "/" : "") +
                      _.name +
                      _.discount +
                      (_.discountType === 1 ? "折" : "元"),
                    ""
                  )}
                </span>
              </li>
              <li>
                <span className="title">特殊产品折扣：</span>
                <span className="content">
                  {this.state.detail.specialProduct.reduce(
                    (last, _) =>
                      (last ? last + "/" : "") +
                      _.name +
                      _.discount +
                      (_.discountType === 1 ? "折" : "元") + ' ' + (_.commodityCode ? _.commodityCode : ''),
                    ""
                  )}
                </span>
              </li>
            </ul>
            <div className="btn-group">
              {!this.state.edit && (
                <Button
                  size="large"
                  type="primary"
                  onClick={() => this.setState({ edit: true })}
                >
                  编辑
                </Button>
              )}
              {this.state.edit && (
                <div>
                  <Button
                    size="large"
                    type="primary"
                    onClick={() => {
                      this.setState({ edit: false })
                      this.props.dispatch({
                        type: "applyCard/setCardDetail",
                        payload: this.state.detail,
                      })
                    }}
                  >
                    完成
                  </Button>
                  <Button
                    size="large"
                    onClick={() =>
                      this.setState({
                        edit: false,
                        detail: { ...this.props.selectedCard },
                        canSetDate: this.props.selectedCard.neverValid,
                      })
                    }
                  >
                    取消
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </Spin>
    )
  }
}

export default connect(({ applyCard: { selectedCard } }) => ({
  selectedCard: selectedCard,
}))(Detail)
