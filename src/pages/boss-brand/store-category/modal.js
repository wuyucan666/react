import { Form, Modal, Input, message } from 'antd'
import validate from 'utils/validate'
import services from 'services'
import { connect } from 'dva'

const modal = ({ show, form, type = 'add', success, dispatch, btnLoading, setBtnLoading, formData }) => {

  const { Item } = Form

  const { getFieldDecorator, getFieldsError, validateFields, getFieldsValue, resetFields } = form

  const formItemLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 18 },
  }

  /**
   * 新增
   * @return {Promise} [description]
   */
  const add = async () => {
    setBtnLoading(true)

    const { code, content } = await services.insert({ keys: { name: 'brand/storetype' }, data: { ...formData, ...getFieldsValue() } })

    if (code === '0') {
      message.success('新建成功')
      dispatch({ type: 'table/getData' })
      success()
    } else {
      message.error(content)
    }

    resetFields()

    setBtnLoading(false)
  }

  /**
   * 修改
   * @return {Promise} [description]
   */
  const edit = async () => {
    setBtnLoading(true)

    const { code, content } = await services.update({ keys: { name: 'brand/storetype' }, data: { ...formData, ...getFieldsValue() } })

    if (code === '0') {
      message.success('修改成功')
      dispatch({ type: 'table/getData' })
      success()
    } else {
      message.error(content)
    }

    resetFields()

    setBtnLoading(false)
  }

  return (
    <Modal
      className="storecategory-footer-button"
      title={type === 'add' ? '新建门店分类' : '编辑门店分类'}
      okText="发布"
      confirmLoading={btnLoading}
      onOk={() => {
        validateFields()
        const errs = getFieldsError()
        if (!Object.keys(errs).some(_ => errs[_])) {
          if (type === 'add') {
            add()
          } else {
            edit()
          }
        }
      }}
      onCancel={() => {
        success()
      }}
      cancelText="取消" visible={show}>
      <Form className="from-wrap-margin">
        <Item {...formItemLayout} label='分类名称'>
          {
            getFieldDecorator('storeTitle', {
              ...validate('分类名称', {
                required: true,
                max: 10,
                type: 'string',
                sole: true,
                key: 'title',
                model: 'StoreType',
                id: formData.storeTypeId,
                _var: 1,
              }), initialValue: formData['storeTitle'],
            })(
              <Input placeholder="请输入分类名称" size="large" />
            )
          }
        </Item>
        <Item {...formItemLayout} label='备注' className="from-wrap-remark">
          {
            getFieldDecorator('remark', { ...validate('备注', { required: false, max: 200, min: 0 }), initialValue: formData['remark'] })(
              <Input.TextArea placeholder="备注" />
            )
          }
        </Item>
      </Form>
    </Modal>
  )
}

export default connect()(Form.create()(modal))
