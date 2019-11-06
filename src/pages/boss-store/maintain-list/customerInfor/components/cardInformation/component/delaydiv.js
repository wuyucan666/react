import { connect } from "dva"
import { Component } from "react"
import styles from "./styles.less"
import { Modal, Form, Table, Select, Row, Col, DatePicker } from "antd"
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
        title: "数量",
        dataIndex: "totalNum",
        key: "totalNum",
        width: "13%",
        align: "left",
        render: res => {
          if (res === -1) {
            return "无限"
          } else {
            return res
          }
        },
      },
      {
        title: "消费",
        dataIndex: "useNum",
        key: "useNum",
        width: "13%",
        align: "left",
      },
      {
        title: "剩余",
        dataIndex: "remainNum",
        key: "remainNum",
        width: "13%",
        align: "left",
        render: res => {
          if (res === -1) {
            return "无限"
          } else {
            return res
          }
        },
      },
      {
        title: "有效期",
        dataIndex: "deadlineTime",
        key: "deadlineTime",
        width: "24%",
        align: "left",
        render: (res, v) => {
          let dateArr = [
            { key:3, time:'三个月' },
            { key:6, time:'半年' },
            { key:12, time:'一年' },
            { key:24, time:'两年' },
          ]
          let date = <div className={styles.dateSelect}>
            {
              dateArr.map(_ => {
                return <span onClick={this.dateSelect.bind(this,_.key,v.cardRecordId)}>{_.time}</span>
              })
            }
          </div>
          return (
            <Row>
              <Col span={10}>
                <Select
                  style={{ width: "100%" }}
                  value={v.deadlineTime !== -1 ? "到期日期" : "永久"}
                  size="large"
                  onChange={value => this.dayselect( v.cardRecordId, "deadlineTime", value)}
                >
                  <Option value={1}>到期日期</Option>
                  <Option value={-1}>永久</Option>
                </Select>
              </Col>
              {v.deadlineTime !== -1 && (
                <Col span={14}>
                  <DatePicker
                    size="large"
                    style={{ width: "100%" }}
                    allowClear={false}
                    value={ v.deadlineTime !== -1 ? moment(v.deadlineTime * 1000) : undefined }
                    onChange={value => this.daychange( v.cardRecordId, "deadlineTime", moment(value).unix())}
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
    this.daychange( cardRecordId, "deadlineTime", parseInt(dt/1000))
    let dom = window.document.body.querySelector('.ant-calendar-picker-container.ant-calendar-picker-container-placement-bottomLeft')
    dom.style.display = 'none'
  }
  dayselect = (id, property, value) => {
    const { dataSource } = this.state
    let time = new Date().getTime()
    const index = dataSource.findIndex(item => item.cardRecordId === id)
    if (value === 1) {
      dataSource[index][property] = time/1000
    } else if (value === -1) {
      dataSource[index][property] = -1
    }
    this.setState({ dataSource })
  }
  daychange = (id, property, value) => {
    const { dataSource } = this.state
    const index = dataSource.findIndex(item => item.cardRecordId === id)
    dataSource[index][property] = value
    this.setState({ dataSource })
  }
  UNSAFE_componentWillReceiveProps(nextsprops) {
    const { newArray } = nextsprops
    this.setState({
      dataSource: newArray.map(item => {
        return { ...item }
      }),
    })
  }
  handleOk = () => {
    const { showDiv, sendid, id, clientId } = this.props
    let type = 2
    const { dataSource } = this.state
    dataSource.forEach(v => {
    	v.cardId = sendid
    	v.infoId = v.cardRecordId
      v.number = v.deadlineTime
    })
    services.updateCardInfo({ data: { info: dataSource, type }}).then(()=>{
      this.props.dispatch({type:'maintianList/getcontentsList',payload: {id}})
      this.props.dispatch({ type: 'maintianList/getdataList', payload: { clientId } })
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
