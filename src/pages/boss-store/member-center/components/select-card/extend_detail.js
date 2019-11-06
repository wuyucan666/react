import { Component } from "react"
import { Spin, Table, DatePicker, Select, Button, InputNumber } from "antd"
import { connect } from "dva"
import moment from "moment"
import services from "services"
import styles from "./index.less"

class Detail extends Component {
  constructor(props) {
    super(props)
    const hasDetail = Object.keys(props.selectCardDetail).length > 0
    this.state = {
      detail: hasDetail ? { ...props.selectCardDetail } : {},
      loading: !hasDetail,
      edit: true,
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
        const detail = this.getNewDetail(res.list)
        this.setState({
          loading: false,
          detail: detail,
        })
        this.props.dispatch({
          type: "extendcard/setCardDetail",
          payload: detail,
        })
      })
  }
  getNewDetail(detail) {
    return {
      ...detail,
      extendId: this.props.extendId,
      rechargeMoney: 0,
      giveMoney: 0,
      deadlineStatus: 1,
      deadlineTime: moment().add(1, "year"),
    }
  }

  handleCancel() {
    this.props.dispatch({
      type: "extendcard/setCardDetail",
      payload: {},
    })
    this.props.onCancel()
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

  render() {
    const { Option } = Select
    const columns = [
      {
        title: "名称",
        dataIndex: "cardName",
        key: 0,
      },
      {
        title: "续卡金额",
        dataIndex: "rechargeMoney",
        key: 1,
        render: (value) =>
          this.state.edit ? (
            <InputNumber
              value={value}
              max={1000000}
              min={0}
              precision={1}
              onChange={(value) =>
                this.setState({
                  detail: {
                    ...this.state.detail,
                    rechargeMoney: value,
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
              max={10000}
              min={0}
              precision={1}
              onChange={(value) =>
                this.setState({
                  detail: {
                    ...this.state.detail,
                    giveMoney: value,
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
              >
                <Option value={1}>有限期</Option>
                <Option value={0}>无限期</Option>
              </Select>
              <DatePicker
                // style={{ width: 200 }}
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
          <h3 className="item">续卡详情</h3>
          <span onClick={this.handleCancel.bind(this)}>
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
                      (_.discountType === 1 ? "折" : "元"),
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
                      (_.discountType === 1 ? "折" : "元"),
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
                        type: "extendcard/setCardDetail",
                        payload: this.state.detail,
                      })
                    }}
                  >
                    完成
                  </Button>
                  <Button
                    size="large"
                    onClick={() => {
                      this.setState({
                        edit: false,
                        detail: { ...this.props.selectCardDetail },
                      })
                    }}
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

export default connect(({ extendcard: { selectCardDetail } }) => ({
  selectCardDetail: selectCardDetail,
}))(Detail)
