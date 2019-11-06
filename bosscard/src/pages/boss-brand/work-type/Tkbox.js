import { Modal, Form, Input, Select, message, InputNumber } from 'antd'
import { Component } from 'react'
import services from '../../../services'
import validate from '../../../utils/validate'
const FormItem = Form.Item
const { TextArea } = Input
const Option = Select.Option

const Tkbox = Form.create({
  mapPropsToFields(props) { //编辑操作,表单默认
    const { type, editItem } = props
    if (type === 'edit') {
      let obj = {}
      Object.keys(editItem).map(v => {
        return obj[v] = Form.createFormField({
          value: editItem[v],
        })
      })
      return obj
    }
  },
})(
  class extends Component {
    state = {
      isChange: false,
    }

    handleSubmit() {
      const { validateFields, resetFields } = this.props.form
      const { hideModal, dispatch, type, editItem } = this.props
      validateFields((err, values) => {
        if (err) {
          return
        }
        Object.keys(values).map(key => {
          if (!values[key]) {
            values[key] = ''
            if(key === 'staffLevelSort') {
              values.staffLevelSort = 0
            }
          }
          return true
        })
        if (type === 'add') {
          services.insert({ data: values, keys: { 'name': 'brand/stafflevel' } }).then(res => {
            if (res.success) {
              hideModal()
              resetFields()
              message.success('添加成功！')
              dispatch({
                type: 'table/getData',
                payload: 'brand/stafflevel',
              })
            } else {
              message.error(res.content)
            }
          })
        } else {
          values.staffLevelId = editItem.staffLevelId
          services.update({ data: values, keys: { 'name': 'brand/stafflevel' } }).then(res => {
            if (res.success) {
              hideModal()
              resetFields()
              message.success('修改成功！')
              dispatch({
                type: 'table/getData',
                payload: 'brand/stafflevel',
              })
            }
            else {
              message.error(res.content)
            }
          })
        }
      })
    }

    onChange() {
      this.setState({
        isChange: true,
      })
    }

    render() {
      const { getFieldDecorator } = this.props.form
      const { visible, hideModal, type, roleList, editItem } = this.props
      const formItemLayout = {
        labelCol: {
          sm: { span: 5 },
        },
        wrapperCol: {
          sm: { span: 18 },
        },
      }
      return (
        <div>
          <Modal
            className="storecategory-footer-button"
            title={type === 'add' ? "新增工种" : '编辑工种'}
            visible={visible}
            onOk={this.handleSubmit.bind(this)}
            onCancel={hideModal}
            okText="发布"
            cancelText="取消"
          >
            <Form className="from-wrap-margin">
              <FormItem
                {...formItemLayout}
                label="名称"
              >
                {getFieldDecorator('staffLevelName', validate('名称', {
                  required: true,
                  max: 8,
                  type: 'string',
                  sole: true,
                  model: 'StaffLevel',
                  _var: {
                    _: parseInt(localStorage.getItem('loginType') - 1, 0),
                    form: parseInt(localStorage.getItem('loginType') - 1, 0),
                  },
                  id: editItem.staffLevelId,
                }))(
                  <Input placeholder="请输入名称" size="large" />
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="关联角色"
              >
                {getFieldDecorator('roleId', validate('角色', { required: true, type: 'select' }))(
                  <Select style={{ width: '100%' }} placeholder="请选择" size="large">
                    {
                      roleList.map(v => {
                        return <Option value={v.roleId} key={v.roleId}>{v.roleName}</Option>
                      })
                    }
                  </Select>
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="排序"
              >
                {getFieldDecorator('staffLevelSort')(
                  <InputNumber style={{ width: '100%' }} size="large" placeholder="输入排序" maxLength="6" />
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="备注"
                className="from-wrap-remark"
              >
                {getFieldDecorator('remark')(
                  <TextArea placeholder="备注" maxLength="200" rows={4}></TextArea>
                )}
              </FormItem>
            </Form>
          </Modal>
        </div>
      )
    }
  }
)

export default Tkbox
