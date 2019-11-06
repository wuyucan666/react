/**
 * Created by kikazheng on 2019/4/24
 */
import React,{Component} from 'react'
import {Form, Input, Button, Checkbox, message} from 'antd'

import service from '../../../../services'
import validate from "../../../../utils/validate"
import style from '../index.less'

const {TextArea} = Input
const CheckboxGroup = Checkbox.Group

class Add extends Component{
  state = {
    permission: [],
    loading: false,
  }
  componentDidMount(){
    service.LIST({keys: {name: 'permission/super-permission/list'}}).then(res => {
      if(res.success){
        this.setState({permission: res.list.map(item => ({label: item.name, value: item.id}))})
      }
    })
  }
  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const {editItem} = this.props
        const data = {
          ...values,
          role_type_id: 3,
          id: editItem.id,
        }
        this.setState({loading: true})
        if(editItem.id){
          service.INSERT({keys: {name: 'admin/manage/role/update'}, data}).then(res => {
            this.setState({loading: false})
            if(res.success){
              this.props.form.resetFields()
              message.success('修改成功')
              this.props.onOk()
            }
          }).catch(() => {
            this.setState({loading: false})
          })
        }else {
          service.INSERT({keys: {name: 'admin/manage/role/insert'}, data}).then(res => {
            this.setState({loading: false})
            if(res.success){
              message.success('发布成功')
              this.props.form.resetFields()
              this.props.onOk()
            }
          }).catch(() => {
            this.setState({loading: false})
          })
        }
      }
    })
  }
  render(){
    const {editItem, onCancel} = this.props
    const {loading, permission} = this.state
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
    }
    return(
      <div className={style.addBox}>
        <div className={style.title}>{editItem.id ? '编辑角色' : '新建角色'}</div>
        <div className={style.form}>
          <Form layout='horizontal' colon={false} onSubmit={this.handleSubmit}>
            <Form.Item
              label="角色名称"
              {...formItemLayout}
            >
              {getFieldDecorator('name',{
                ...validate("角色名称", {
                  required: true,
                  max: 30,
                  key: 'name',
                  type: "string",
                  sole: true,
                  model: 'Roles',
                  _var: {"_":0,"role_type_id":3},
                  id: editItem.id,
                }),initialValue:editItem.name,
              })(
                <Input size='large' style={{width: 350}} placeholder='请输入角色名称' />
              )}
            </Form.Item>
            <Form.Item
              label="系统权限"
              {...formItemLayout}
              className='role_form_permission_style'
            >
              {getFieldDecorator('permission_ids',{
                initialValue: editItem.permission_ids,
                rules: [{required: true, message: '请选择系统权限'}],
              })(
                <CheckboxGroup className='role_checkboxgroup_style' options={permission}/>
              )}
            </Form.Item>
            <Form.Item
              label="备注"
              {...formItemLayout}
            >
              {getFieldDecorator('remark',{
                initialValue: editItem.remark,
                rules: [{max: 200, message: '最多输入200字'}],
              })(
                <TextArea placeholder='请输入备注信息' style={{width: 350}} autosize={{ minRows: 4}}/>
              )}
            </Form.Item>
            <Form.Item
              wrapperCol={{ span: 20, offset: 4}}
            >
              <Button type="primary" size='large' htmlType="submit" loading={loading}>发布</Button>
              <Button size='large' onClick={() => {
                onCancel()
                this.props.form.resetFields()
              }}>取消</Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    )
  }
}

export default Form.create()(Add)
