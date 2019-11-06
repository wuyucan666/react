import { Modal, Table, Form, Select, Row, Col} from "antd"
import { connect } from "dva"
const FormItem = Form.Item
const Option = Select.Option

const Tk = ({type, visible, onOk, onCancel, form, dataSource, storageStaff, getStaff, returnStaff}) => {
  const operateStaff = type === 1 ? getStaff : returnStaff
  const columns = [
   {
    title: '产品名称',
    dataIndex: 'name',
    align: 'left',
  },{
    title: '编号',
    dataIndex: 'commodityCode',
    align: 'left',
  },{
    title: '数量',
    dataIndex: 'num',
    align: 'left',
  }]

  const { getFieldDecorator } = form

  return (
    <Modal
      title={type === 1 ? '领料' : '退料'}
      visible={visible}
      onOk={onOk}
      onCancel={onCancel}
      width="60%"
      className="out-modal"
    >
      <Table
      dataSource={dataSource}
      columns={columns}
      pagination={{hideOnSinglePage: true}}
      >
      </Table>
      <Form style={{marginTop: '40px'}} >
        <Row>
          <Col span={10}>
            <FormItem
              label="仓库人员"
            >
              {getFieldDecorator('storekeeperId', {
                rules: [{
                  required: true, message: '请选择一位人员!',
                }],
              })(
                <Select
                size="large"
                style={{ width: '90%' }}
              >
              {
                storageStaff.map(v => {
                  return <Option key={v.id}>{v.name}</Option>
                })
              }
              </Select>
              )}
            </FormItem>
          </Col>
          <Col span={10}>
            <FormItem
              label={(type === 1 ? '领料' : '退料') + '人员'}
            >
              {getFieldDecorator('operatorId', {
                rules: [{
                  required: true, message: `请选择一位人员!`,
                }],
              })(
                <Select
                size="large"
                style={{ width: '90%' }}
              >
                {
                  operateStaff.map(v => {
                    return <Option key={v.id}>{v.name}</Option>
                  })
                }
              </Select>
              )}
            </FormItem>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default connect(
  ({maintainBilling: { storageStaff, getStaff, returnStaff }}) => ({
    storageStaff,
    getStaff,
    returnStaff,
  })
)(Tk)