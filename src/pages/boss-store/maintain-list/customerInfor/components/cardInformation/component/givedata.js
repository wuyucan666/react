import { connect } from "dva"
import { Component } from "react"
import styles from "./styles.less"
import { Modal, Form, Table, Select, Row, Col, message, DatePicker } from "antd"
import moment from "moment"
import services from "services"
const Option = Select.Option
class delaybox extends Component {
  state = {
    dataSource: [],
    disable: false,
    deadlineUnit: 1,
    columns: [
      {
        title: "名称",
        dataIndex: "projectName",
        key: "projectName",
        width: "24%",
        align: "left",
      },
      {
        title: "充值金额",
        dataIndex: "Recharge",
        key: "Recharge",
        width: "13%",
        align: "left",
      },
      {
        title: "赠送金额",
        dataIndex: "gives",
        key: "gives",
        width: "13%",
        align: "left",
      },
      {
        title: "有效期",
        dataIndex: "validityList",
        key: "validityList",
        width: "24%",
        align: "left",
        render: (res, data) => {
          let dateArr = [
            { key:3, time:'三个月' },
            { key:6, time:'半年' },
            { key:12, time:'一年' },
            { key:24, time:'两年' },
          ]
          let date = <div className={styles.dateSelect}>
            {
              dateArr.map(_ => {
                return <span onClick={this.dateSelect.bind(this,_.key,data.id)}>{_.time}</span>
              })
            }
          </div>
          return (
            <Row>
              <Col span={10}>
                <Select
                  style={{ width: "100%" }}
                  value={data.type}
                  size="large"
                  onChange={value => this.daychange(data.id, "type", value)}
                >
                  <Option value={1}>到期日期</Option>
                  <Option value={-1}>永久</Option>
                </Select>
              </Col>
              {data.type !== -1 && (
                <Col span={14}>
                  <DatePicker
                    size="large"
                    style={{ width: "100%" }}
                    allowClear={false}
                    value={ data.number !== -1 ? moment(data.number * 1000) : undefined }
                    onChange={value =>
                      this.daychange(data.id, "number", moment(value).unix())
                    }
                    renderExtraFooter={() => date }
                    showToday={false}
                  />
                </Col>
              )}
            </Row>
          )
        },
      },
    ],
  }
  dateSelect = (key,cardRecordId) =>{
    var dt = new Date()
    dt.setMonth( dt.getMonth() + key )
    this.daychange( cardRecordId, "number", parseInt(dt/1000))
    let dom = window.document.body.querySelector('.ant-calendar-picker-container.ant-calendar-picker-container-placement-bottomLeft')
    dom.style.display = 'none'
  }
  daychange = (id, property, value) => {
    const { dataSource } = this.state
    const index = dataSource.findIndex(item => item.id === id)
    dataSource[index][property] = value
    this.setState({ dataSource })
  }
  componentDidMount() {}
  UNSAFE_componentWillReceiveProps(nextsprops) {
    const { newArray } = nextsprops
    this.setState({
      dataSource: newArray.map(item => {
        return {
          ...item,
          type: item.number === -1 ? -1 : 1,
        }
      }),
    })
  }
  handleOk = () => {
    const { showDiv, sendid, id, clientId } = this.props
    const { dataSource } = this.state
    let type = 1
    dataSource.forEach(v => {
      v.cardId = sendid
      if (v.type === -1) {
        v.number = -1
      }
    })
    services.updateCardInfo({ data: { info: dataSource, type } }).then(() => {
      this.props.dispatch({
        type: "maintianList/getcontentsList",
        payload: { id },
      })
      this.props.dispatch({
        type: "maintianList/getdataList",
        payload: { clientId },
      })
      showDiv(false)
    })
  }
  handleCancel = () => {
    const { showDiv } = this.props
    showDiv(false)
  }
  render() {
    const { visible } = this.props
    return (
      <div className={styles.indexsss}>
        <Modal
          title="延期"
          width="1200px"
          zIndex={500}
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <div className={styles.boxdiv}>
            <Table
              dataSource={this.state.dataSource}
              columns={this.state.columns}
              scroll={{ y: 500 }}
              pagination={false}
            />
          </div>
        </Modal>
      </div>
    )
  }
}
function mapStateToProps() {
  return {}
}
export default connect(mapStateToProps)(Form.create()(delaybox))
