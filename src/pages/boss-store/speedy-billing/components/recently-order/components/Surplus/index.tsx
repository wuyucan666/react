/**
 * Created by kikazheng on 2019/7/15
 */
import React, {Component} from 'react'
import {Modal, Form, Select} from 'antd'

// const style = require('./style.less')

const { Option } = Select;

interface listItem {
  [propertyName: string]: any
}

interface defaultProps {
  form: any,
  visible: boolean,
  data: Array<listItem>,
  onCancel: () => void,
  onOk: () => void
}

class Surplus extends Component<defaultProps> {
  state = {
    loading: false
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { onOk } = this.props
        onOk(values)
      }
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const {loading} = this.state
    const {visible, data, onCancel} = this.props
    const formItemLayout = {
      labelCol: {
        sm: { span: 4 },
      },
      wrapperCol: {
        sm: { span: 19 },
      },
    };
    return (
      <Modal
        title='结余入库'
        width={570}
        visible={visible}
        confirmLoading={loading}
        onCancel={onCancel}
        onOk={this.handleSubmit}
      >
        <Form {...formItemLayout} >
          <Form.Item label="入库产品">
            {getFieldDecorator('productId',{initialValue: data[0] ? data[0].productId : undefined})(
              <Select size='large'>
                {
                  data.map(item => (
                    <Option value={item.productId}>{item.name}</Option>
                  ))
                }
              </Select>
            )}
          </Form.Item>
          <Form.Item label="入库数量">
            <span>1</span>
          </Form.Item>
        </Form>
      </Modal>
    )
  }
}

export default Form.create()(Surplus)
