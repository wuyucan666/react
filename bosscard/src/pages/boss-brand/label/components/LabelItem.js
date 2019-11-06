/**
 * Created by kikazheng on 2019/4/8
 */
import { Component } from "react"
import {Button, Form, Input, message} from 'antd'
import validate from '../../../../utils/validate'
import services from "../../../../services"

class LabelItem extends Component{
  state = {
    loading: false,
  }
  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if(!err){
        this.setState({loading: true})
        const {editItem, id} = this.props
        const {name} = values
        if(editItem.labelId){
          services.UPDATE({
            keys:{
              name: 'clientLabel/labelInfo',
              id: editItem.labelId,
            },
            data:{
              ...editItem,
              name,
              clientLabelTypeId: id,
            },
          }).then(res => {
            this.setState({loading: false})
            if(res.success){
              this.props.onOk()
            }
          }).catch(() => {
            message.error('请求出错')
            this.setState({loading: false})
          })
        }else {
          services.INSERT({
            keys:{name: 'clientLabel/labelInfo'},
            data:{
              name,
              status: 1,
              clientLabelTypeId: id,
            },
          }).then(res => {
            this.setState({loading: false})
            if(res.success){
              this.props.onOk()
            }
          }).catch((err) => {
            message.error('请求出错',err)
            this.setState({loading: false})
          })
        }
      }
    })
  }
  render(){
    const {loading} = this.state
    const {editItem = {}, onCancel} = this.props
    const { getFieldDecorator } = this.props.form
    return(
      <div>
        <Form layout='inline'>
          <Form.Item style={{marginRight: 8}}>
            {getFieldDecorator('name', {
              ...validate('标签名称',{
                required: true,
                max: 10,
                sole: true,
                key: 'clientLabelInfoName',
                model: 'ClientLabelInfo',
                id: editItem.labelId,
                _var: {_: 1},
              }),
              initialValue: editItem.name,
            })(
              <Input autoFocus style={{width: 120}} size='large' />
            )}
          </Form.Item>
          <Form.Item>
            <Button size='large' type='primary' loading={loading} onClick={this.handleSubmit}>确认</Button>
            <Button size='large' style={{marginLeft: 10}}  onClick={onCancel}>取消</Button>
          </Form.Item>
        </Form>
      </div>
    )
  }
}

export default Form.create()(LabelItem)
