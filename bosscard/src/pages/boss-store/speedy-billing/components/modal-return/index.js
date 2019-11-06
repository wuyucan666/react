import { Component } from 'react'
import { Modal, Form, DatePicker, Select } from 'antd'
import service from 'services'
import moment from 'moment'

const Option = Select.Option
class ReturnModal extends Component {

  state = {
    staffList: [],
    staffName: '',
  }

  onCancel = () => {
    this.props.form.resetFields()
    this.props.onCancel()
  }

  onOk = () => {
    const { form, onOk } = this.props
    form.validateFields((err, values) => {
      if(err) {
        return
      }else {
        onOk(values, this.props.curItem)
      }
    })
  }

  disabledDate(current) {
    // Can not select days before today and today
    return current && current < moment().startOf('day')
  }

  componentDidMount () {
    const { curItem: {returnVisit} } = this.props
    const { setFieldsValue } = this.props.form
    if(returnVisit.abnormal && JSON.stringify(returnVisit.abnormal) !== '{}') {
      setFieldsValue({
        staffId: returnVisit.abnormal.staffId,
        staffName: returnVisit.abnormal.staffName,
        sentTime: typeof(returnVisit.abnormal.sentTime) === 'number'
        ? moment(returnVisit.abnormal.sentTime * 1000)
        : returnVisit.abnormal.sentTime,
      })
    }
    service
    .LIST({
      keys: {name: 'store/staff/list'},
      data: { q: { page: 1, limit: -1}},
    })
    .then(res => {
      if(res.success) {
        this.setState({
          staffList: res.list.map((v) => ({
            ...v,
            id: v.staffId,
            name: v.staffName,
          })
        )})
        if(returnVisit.normal) {
          const staff = res.list.find(v => v.staffId === returnVisit.normal.staffId)
          if(staff) {
            this.setState({staffName: staff.staffName})
          }
        }
      }
    })

  }

  staffChange = (id) => {
    const {staffList} = this.state
    const {setFieldsValue} = this.props.form
    const staffName = staffList.filter(item => item.staffId === id)[0].staffName
    setFieldsValue({
      staffName,
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form
    const { staffList, staffName } = this.state
    const { curItem: {returnVisit} } = this.props
    getFieldDecorator('staffName', { initialValue: '' })
    return (
      <Modal
      title="添加回访"
      width={570}
      visible={this.props.visible}
      onCancel={this.onCancel}
      onOk={this.onOk}
      >
        <div>
          <div>
            {
              returnVisit.normal && JSON.stringify(returnVisit.normal) !== '{}' &&
              <div>
                <div style={{lineHeight: '24px', color: '#333'}}>
                  该项目已设置回访: 回访提醒时间为 <span style={{color: '#4AACF7'}}>{returnVisit.normal.sentTime}</span> 天后， 回访员工为 <span style={{color: '#4AACF7'}}>{staffName}</span>
                </div>
                <div style={{lineHeight: '40px', marginBottom: 20, color: '#333'}}>您还可以为改项目设置一次回访</div>
              </div>
            }
            <Form layout="vertical">
              <Form.Item label="下次回访时间">
                {getFieldDecorator('sentTime',{
                   rules: [{
                    required: true, message: '请选择回访时间!',
                  }],
                })(
                  <DatePicker size='large' style={{width: '100%'}} disabledDate={this.disabledDate}></DatePicker>
                )}
              </Form.Item>
              <Form.Item label="回访员工">
                {getFieldDecorator('staffId',{
                   rules: [{
                    required: true, message: '请选择回访员工!',
                  }],
                })(
                  <Select size='large' onChange={this.staffChange}>
                    {
                      staffList.map(v => {
                        return (
                          <Option key={v.id} value={v.id}>{v.name}</Option>
                        )
                      })
                    }
                  </Select>
                )}
              </Form.Item>
            </Form>
          </div>
        </div>
      </Modal>
    )
  }
}

export default  Form.create()(ReturnModal)
