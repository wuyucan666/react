import { connect } from "dva"
import { Component } from "react"
import styles from './styles.less'
import { Modal, DatePicker, Select, Button, Form, Tooltip } from 'antd'
import services from 'services'
import moment from 'moment'
const Option = Select.Option
const { RangePicker } = DatePicker
const FormItem = Form.Item
class consumering extends Component {
  state = {
    newArray: [],
    selData: [],
    startTime: '',
    endTime: '',
    copyid: 0,
    selId: 0,
  }
  componentWillMount() {
    services.clientCardRecording({
      data: {
        q: {
          where: {
            clientCardId: this.props.clientCardId,
          },
        },
      },
    }).then(res => {
      res.list.forEach(item => {
        if (item.staffName) {
          item.staffName = JSON.parse(item.staffName).map(item => item.staff_name).join('/')
        } else {
          item.staffName = []
        }
      })
      this.setState({
        newArray: res.list,
        selData: this.props.contentArray,
        copyid: this.props.clientCardId,
      })
    })
  }
  UNSAFE_componentWillReceiveProps(nextsprops) {
    if(nextsprops.clientCardId === this.props.clientCardId) {
      return
    }
      services.clientCardRecording({
        data: {
          q: {
            where: { clientCardId: nextsprops.clientCardId },
          },
        },
      }).then(res => {
        if(res.code==='0'){
          res.list.forEach(item => {
            if (item.staffName) {
              item.staffName = JSON.parse(item.staffName).map(item => item.staff_name).join('/')
            } else {
              item.staffName = ''
            }
          })
          this.setState({
            newArray: res.list,
            selData: nextsprops.contentArray,
            copyid: nextsprops.clientCardId,
          })
        }
      })
  }
  onChangeTime = (date, dateString) => {
    this.setState({
      startTime: dateString[0],
      endTime: dateString[1],
    })
  }
  handleOk = () => {
    this.setState({
      startTime: '',
      endTime: '',
    })
    const { showDiv } = this.props
    showDiv(false)
  }
  handleCancel = () => {
    this.setState({
      startTime: '',
      endTime: '',
    })
    const { showDiv } = this.props
    showDiv(false)
  }
  handleChange = (value) => {
    this.setState({
      selId: value,
    })
  }
  checkdata = () => {
    if (this.state.selId === 0) {
      return
    }
    let newobj = {}

    if (this.state.startTime === '' || this.state.endTime === '') {
      newobj = { clientCardId: this.state.selId }
    } else if (this.state.endTime) {
      newobj = {
        clientCardId: this.state.selId,
        "created[<>]": [moment(this.state.startTime).unix(), moment(this.state.endTime).unix()],
      }
    }
    services.clientCardRecording({
      data: {
        q: {
          where: newobj,
        },
      },
    }).then(res => {
      res.list.forEach(item => {
        if (item.staffName) {
          item.staffName = JSON.parse(item.staffName).map(item => item.staff_name).join('/')
        } else {
          item.staffName = []
        }
      })

      this.setState({
        newArray: res.list,
      })
    })
  }
  resetdata = () => {
    const { resetFields } = this.props.form
    resetFields()
    this.setState({
      startTime: '',
      endTime: '',
      selId: 0,
    })
  }
  render() {
    const { visible , clientCardId  } = this.props
    // console.log(clientCardId,this.state.selData)
    const { getFieldDecorator } = this.props.form
    return (
      <div className={styles.indexsss}>
        <Modal
          title="卡项消费记录"
          width='1100px'
          zIndex={500}
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={null}
        >
          <div className={styles.boxdiv}>
            <div>
              <div>
                <Form layout="inline">
                  <FormItem label="卡名称" >
                    {getFieldDecorator('listType', {
                      initialValue:clientCardId,
                    })(
                      <Select placeholder="卡项" style={{ width: 180, marginLeft: '5px', marginRight: '24px' }} onChange={this.handleChange}>
                        {
                          this.state.selData && this.state.selData.map((v, index) => {
                            return <Option key={index} value={v.cardId}>{v.cardName}</Option>
                          })
                        }
                      </Select>
                    )}
                  </FormItem>
                  <FormItem label="结算时间" >
                    {getFieldDecorator('timeType', {
                    })(
                      <RangePicker style={{ width: 450, marginLeft: '5px', marginRight: '24px' }} onChange={this.onChangeTime} />
                    )}
                  </FormItem>
                  <FormItem>
                    <Button onClick={this.checkdata} style={{ marginRight: '24px' }} type="primary">查询</Button>
                    <Button onClick={this.resetdata}>重置</Button>
                  </FormItem>
                </Form>

              </div>
              <div>
                <div className={styles.tableTop}>
                  <span>卡名称</span>
                  <span>车牌</span>
                  <span>订单单号</span>
                  <span>结算时间</span>
                  <span>销售</span>
                  <span>消费信息</span>
                  <span>消耗</span>
                  <span>剩余</span>
                  <span>备注</span>
                </div>
                <div className={styles.allcontent}>
                  {
                    this.state.newArray.map((v, index) => {
                      return (<div key={index} className={styles.content}>
                        <span>{v.cardName}</span>
                        <span>{v.license}</span>
                        <span>{v.orderNo}</span>
                        <span>{v.created === 0 ? '-' : moment(v.created * 1000).format("YYYY-MM-DD")}</span>
                        <span>
                          {
                            v.staffName.length > 8 ? <Tooltip title={v.staffName}>{v.staffName.slice(0, 7)}...</Tooltip> : v.staffName
                          }
                        </span>
                        <span title={v.name}>{v.name.length > 8 ? v.name.slice(0, 7) + '...' : v.name}</span>
                        <span>{v.consumption}</span>
                        <span>{Number(v.surplus) === -1 ? '无限' : v.surplus}</span>
                        <span>
                          {
                            v.remark && v.remark.length > 8 ? <Tooltip title={v.remark}>{v.remark.slice(0, 7)}...</Tooltip> : v.remark
                          }
                        </span>
                      </div>)
                    })
                  }
                </div>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    )
  }
}
function mapStateToProps() {
  return {}
}
export default connect(mapStateToProps)(Form.create()(consumering))
