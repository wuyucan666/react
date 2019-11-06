/**
 * Created by kikazheng on 2019/7/1
 */
import React,{Component} from 'react'
import {Modal, InputNumber, Form, message} from 'antd'

import services from '../../../../../services'


class Index extends Component{
  state = {
    loading: false,
  }

  onOk = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({loading: true})
        const {storeId} = this.props.editItem
        const {count} = values
        services.PUT({keys: {link: 'admin/implement/sms'}, data: {storeId, count}}).then(res => {
          this.setState({loading: false})
          if(res.success){
            message.success('充值成功')
            this.props.onOk()
          }
        }).catch(() => {
          this.setState({loading: false})
        })
      }
    })
  }

  render(){
    const {onCancel, editItem} = this.props
    const {loading} = this.state
    const { getFieldDecorator, getFieldValue} = this.props.form
    const count = getFieldValue('count') || 1
    return(
      <Modal
        title='短信充值'
        visible={true}
        width={570}
        confirmLoading={loading}
        onOk={this.onOk}
        onCancel={onCancel}
      >
        <div className='flex between'>
          <div>
            <span style={{color: '#999'}}>品牌商：</span>
            <span>{editItem.brandName}</span>
          </div>
          <div>
            <span style={{color: '#999'}}>门店：</span>
            <span>{editItem.storeName}</span>
          </div>
          <div>
            <span style={{color: '#999'}}>剩余短信：</span>
            <span>{editItem.messageAccount}</span>
          </div>
        </div>
        <Form layout="inline" hideRequiredMark style={{margin: '29px 0'}}>
          <Form.Item label='充值数量'>
            {getFieldDecorator('count', {
              rules: [{ required: true, message: '请输入充值数量' }],
              initialValue: 1,
            })(
              <InputNumber
                size='large'
                style={{width: 200}}
                placeholder='请输入充值数量'
                min={1}
                precision={0}
              />
            )}
          </Form.Item>
        </Form>
        <div style={{color: '#333'}}>充值金额：￥{(count * 0.08).toFixed(2)} <span style={{color: '#999'}}>（收费标准：0.08元/条）</span></div>
      </Modal>
    )
  }
}

export default Form.create()(Index)
