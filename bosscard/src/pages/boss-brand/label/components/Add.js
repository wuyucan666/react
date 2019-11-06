/**
 * Created by kikazheng on 2019/4/4
 */
import { Component } from "react"
import {Button, Modal, Form, Input, message} from 'antd'
import service from '../../../../services'
import validate from '../../../../utils/validate'
import style from  '../style.less'

class Add extends Component{
  state = {
    loading: false,
  }
  handleOk = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({loading: true})
        const {editItem} = this.props
        if(!editItem.id){
          service.INSERT({keys:{name: 'clientLabel/labelType'}, data:{name: values.name}}).then(res => {
            this.setState({loading: false})
            if(res.success){
              message.success('发布成功')
              this.props.form.resetFields()
              this.props.toggle()
              this.props.onOk()
            }
          }).catch(() => {
            this.setState({loading: false})
            message.error('请求出错')
          })
        }else {
          service.UPDATE({keys:{name: 'clientLabel/labelType', id: editItem.id}, data:{name: values.name}}).then(res => {
            this.setState({loading: false})
            if(res.success){
              message.success('修改成功')
              this.props.form.resetFields()
              this.props.toggle()
              this.props.onOk()
            }
          }).catch(() => {
            this.setState({loading: false})
            message.error('请求出错')
          })
        }
      }
    })
  }
  handleCancel = () => {
    this.props.form.resetFields()
    this.props.toggle()
  }
  render(){
    const {visible, editItem} = this.props
    const {loading} = this.state
    const { getFieldDecorator } = this.props.form
    return(
      <Modal
        title={editItem.id ? '修改标签分类' : '新增标签分类'}
        visible={visible}
        destroyOnClose
        footer={null}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
      >
        <Form layout='inline'>
          <Form.Item label="分类名称">
            {getFieldDecorator('name', {
              ...validate('分类名称',{
                required: true,
                max: 10,
                sole: true,
                key: 'clientLabelTypeName',
                model: 'ClientLabelType',
                id: editItem.id,
                _var: {_: 1},
              }),
              initialValue: editItem.classify,
            })(
              <Input autoFocus style={{width: 350}} size='large' />
            )}
          </Form.Item>
        </Form>
        <div className={style.modalBtn}>
          <Button type='primary' size='large' loading={loading} onClick={this.handleOk}>发布</Button>
          <Button size='large' onClick={this.handleCancel}>取消</Button>
        </div>
      </Modal>
    )
  }
}

export default Form.create()(Add)
