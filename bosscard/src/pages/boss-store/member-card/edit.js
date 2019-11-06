import { Component } from "react"
import { Form, Modal, Table, Select, Row, Col, DatePicker } from "antd"
import moment from "moment"
import services from "../../../services"
import styles from "./styles.less"
import checkedImage from "./images/xuanzhong.png"
const Option = Select.Option
const Edit = Form.create({
  mapPropsToFields(props) {
    //编辑操作,表单默认
    const { type, editItem } = props
    if (type === "edit") {
      let obj = {}
      Object.keys(editItem).map(v => {
        return (obj[v] = Form.createFormField({
          value: editItem[v],
        }))
      })
      return obj
    }
  },
})(
  class extends Component {
    state = {
      data: [],
      columns: [
        {
          title: "名称",
          width: "240px",
          dataIndex: "name",
          align: "left",
        },
        {
          title: "单价",
          dataIndex: "price",
          align: "left",
        },
        {
          title: "数量",
          dataIndex: "num",
          align: "center",
          render: v => {
            if (v === -1) {
              return "无限"
            } else {
              return v
            }
          },
        },
        {
          title: "金额",
          dataIndex: "amount",
          align: "left",
        },
        {
          title: "有效期",
          key: "time",
          align: "left",
          width: "290px",
          render: (text, record, index) => {
            return (
              <div className="memberCardChangeValue">
                <Select
                  value={text.selvalue1}
                  style={{ width: 84 }}
                  onChange={this.handleChange.bind(this, index)}
                >
                  <Option value={0}>永久</Option>
                  <Option value={1}>有效期</Option>
                </Select>
                {text.selvalue1 === 1 ? (
                  <DatePicker
                    allowClear={false}
                    value={
                      text.selvalue1 === 1
                        ? text.times
                          ? moment(text.times, "YYYY-MM-DD")
                          : undefined
                        : undefined
                    }
                    format={"YYYY-MM-DD"}
                    onChange={this.onChangeValue.bind(this, index)}
                  />
                ) : (
                  ""
                )}
              </div>
            )
          },
        },
      ],
      column: [
        {
          title: "名称",
          width: "240px",
          dataIndex: "name",
          align: "left",
        },
        {
          title: "充值金额",
          dataIndex: "rechargeMoney",
          align: "left",
        },
        {
          title: "赠送金额",
          dataIndex: "giveMoney",
          align: "left",
        },
        {
          title: "有效期",
          key: "time",
          align: "left",
          width: "290px",
          render: (text, record, index) => {
            return (
              <div className="memberCardChangeValue">
                <Select
                  value={text.selvalue1}
                  style={{ width: 84 }}
                  onChange={this.handleChange.bind(this, index)}
                >
                  <Option value={0}>永久</Option>
                  <Option value={1}>有效期</Option>
                </Select>
                {text.selvalue1 === 1 ? (
                  <DatePicker
                    allowClear={false}
                    value={
                      text.selvalue1 === 1
                        ? moment(text.times, "YYYY-MM-DD")
                        : undefined
                    }
                    format={"YYYY-MM-DD"}
                    onChange={this.onChangeValue.bind(this, index)}
                  />
                ) : (
                  ""
                )}
              </div>
            )
          },
        },
      ],
    };
    /**
     * 填写有效时间
     */
    onChangeValue = (key, v, e) => {
      const { details } = this.props
      let arr = details.card
      arr[key].times = e
      this.props.dispatch({
        type: "memberCards/operation",
        payload: { ...details, card: arr },
      })
    };
    /**
     * 选择时间
     */
    handleChange = (key, v) => {
      const { details } = this.props
      let arr = [...details.card]
      if (v === 0) {
        arr[key].times = ""
      } else {
        arr[key].times =
          arr[key].deadlineTime === -1
            ? moment().format("YYYY-MM-DD")
            : moment(arr[key].deadlineTime).format("YYYY-MM-DD")
      }
      arr[key].selvalue1 = v
      this.props.dispatch({
        type: "memberCards/operation",
        payload: { ...details, card: arr },
      })
    };
    /**
     * 选择车辆
     */
    chooetCar = index => {
      const { details } = this.props
      let arr = details.car
      arr[index].cardLimit = !arr[index].cardLimit
      this.props.dispatch({
        type: "memberCards/operation",
        payload: { ...details, car: arr },
      })
    };
    /**
     * 操作
     */
    handleSubmit() {
      const { hideModal, dispatch, details } = this.props
      let card = details.card.map(v => ({
        id: v.id,
        deadlineTime: v.selvalue1 === 1 ? moment(v.times).unix() : -1,
      }))
      let car = []
      for (let i in details.car) {
        if (details.car[i].cardLimit) {
          car.push(details.car[i].id)
        }
      }
      let values = { id: details.id, card: card, car: car }
      services
        .clientcardOperationsubmit({
          data: values,
          keys: {
            name: "store/clientcard/operation/",
            id: details.id,
          },
        })
        .then(res => {
          if (res.success) {
            hideModal()
            dispatch({
              type: "table/getData",
              payload: "store/clientcard",
            })
          }
        })
    }
    render() {
      const { visible, hideModal, details } = this.props
      return (
        <div>
          <Modal
            title="修改卡项信息"
            visible={visible}
            onOk={this.handleSubmit.bind(this)}
            onCancel={hideModal}
            okText="发布"
            cancelText="取消"
            width="1200px"
          >
            <div className={styles.title}>
              <span className={styles.title_line} />
              <span className={styles.title_txt}>有效期修改</span>
            </div>
            <div className={styles.scrollsedWrap}>
              <Table
                columns={
                  details.cardType === 1
                    ? this.state.column
                    : this.state.columns
                }
                dataSource={details.card}
                pagination={false}
              />
              <div className={styles.title} style={{ marginTop: "50px" }}>
                <span className={styles.title_line} />
                <span className={styles.title_txt}>绑定车辆</span>
              </div>
              <Row gutter={166}>
                {details.car
                  ? details.car.map((v, index) => {
                      return (
                        <Col className="gutter-row" span={8} key={index}>
                          <div
                            className={v.cardLimit ? styles.car_current : ""}
                          >
                            <div
                              className={styles.car_box}
                              onClick={this.chooetCar.bind(this, index)}
                            >
                              {v.cardLimit ? (
                                <div className={styles.car_box_check}>
                                  <img src={checkedImage} alt="" />
                                </div>
                              ) : (
                                ""
                              )}
                              <div className={styles.car_box_cont}>
                                <div className={styles.car_box_img}>
                                  {v.icon[0] ? (
                                    <img
                                      src={v.icon[0].requestAddress}
                                      alt=""
                                    />
                                  ) : (
                                    <span
                                      style={{
                                        color: "#ccc",
                                        fontSize: "12px",
                                        marginLeft: "10px",
                                      }}
                                    >
                                      暂无图片
                                    </span>
                                  )}
                                </div>
                                <div className={styles.car_box_cont_txt}>
                                  <div>{v.licenseNo}</div>
                                  <span>{v.carBrand}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Col>
                      )
                    })
                  : ""}
              </Row>
            </div>
          </Modal>
        </div>
      )
    }
  }
)
export default Edit
