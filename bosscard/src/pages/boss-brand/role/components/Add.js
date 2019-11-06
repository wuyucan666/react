/**
 * Created by kikazheng on 2019/4/24
 */
import React,{Component} from 'react'
import {Form, Input, Button, message, Select, Spin} from 'antd'

import CheckItem from './CheckItem'
import Tabbar from "components/Tabbar"

import service from '../../../../services'
import validate from "../../../../utils/validate"
import style from '../index.less'

const {Option} = Select

class Add extends Component{
  state = {
    permission: [],
    wxPermission: [],
    roles: [],
    loading: false,
  }

  componentDidMount(){
    const {role_type_id} = this.props.editItem
    service.LIST({keys: {name: 'permission/role-types/list'}}).then(res => {
      if(res.success){
        this.setState({roles: res.list})
      }
    })
    this.getPermission(role_type_id || 1, true)
  }

  getPermission = (type, init) => {
    this.setState({loading: true})
    service.LIST({keys: {name: 'permission/brand-permission/list'}, data: {type}}).then(res => {
      this.setState({loading: false})
      if(res.success){
        const {permission_ids} = this.props.editItem
        let permission = []
        let wxPermission = []
        res.list.forEach(item => {
          if(item.scope === 'web'){
            permission = item.groups
          }else {
            wxPermission = item.groups
          }
        })
        permission.forEach(item => {
          if(init && permission_ids){
            item.groups.forEach(item2 => {
              item2.value = []
              item2.groups.forEach(item3 => {
                if(permission_ids.indexOf(item3.id) > -1){
                  item2.value.push(item3.id)
                }
              })
            })
          }
        })
        if(wxPermission.length){
          wxPermission.forEach(item => {
            if(init && permission_ids){
              item.groups.forEach(item2 => {
                item2.value = []
                item2.groups.forEach(item3 => {
                  if(permission_ids.indexOf(item3.id) > -1){
                    item2.value.push(item3.id)
                  }
                })
              })
            }
          })
        }
        this.setState({
          permission,
          wxPermission,
        })
      }
    }).catch(() => {
      this.setState({loading: false})
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const {editItem} = this.props
        const {permission, wxPermission} = this.state
        let permission_ids = []
        permission.forEach(item => {
          item.groups.forEach(item2 => {
            permission_ids = permission_ids.concat(item2.value || [])
          })
        })
        wxPermission.forEach(item => {
          item.groups.forEach(item2 => {
            permission_ids = permission_ids.concat(item2.value || [])
          })
        })
        const data = {
          ...values,
          permission_ids,
          id: editItem.id,
        }
        this.setState({loading: true})
        if(editItem.id){
          service.INSERT({keys: {name: 'brand/manage/role/update'}, data}).then(res => {
            this.setState({loading: false})
            if(res.success){
              message.success('修改成功')
              this.props.onOk()
            }
          }).catch(() => {
            this.setState({loading: false})
          })
        }else {
          service.INSERT({keys: {name: 'brand/manage/role/insert'}, data}).then(res => {
            this.setState({loading: false})
            if(res.success){
              message.success('发布成功')
              this.props.onOk()
            }
          }).catch(() => {
            this.setState({loading: false})
          })
        }
      }
    })
  }

  handlePcChange = (id, data) => {
    const {permission} = this.state
    const index = permission.findIndex(item => item.id === id)
    permission[index] = data
    this.setState({permission})
  }
  handleWxChange = (id, data) => {
    const {wxPermission} = this.state
    const index = wxPermission.findIndex(item => item.id === id)
    wxPermission[index] = data
    this.setState({wxPermission})

  }
  render(){
    const {editItem, onCancel} = this.props
    const {loading, permission, wxPermission, roles} = this.state
    const { getFieldDecorator, getFieldValue } = this.props.form
    const type = getFieldValue('role_type_id') === 1
    const formItemLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 21 },
    }
    console.log('权限',permission, wxPermission)
    return(
     <Spin spinning={loading}>
       <div className={style.addBox}>
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
                   _var: {"_":1,"role_type_id":1},
                   id: editItem.id,
                 }),initialValue:editItem.name,
               })(
                 <Input size='large' style={{width: 350}} placeholder='请输入角色名称' />
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
                 <Input  size='large' style={{width: 350}} />
               )}
             </Form.Item>
             <Form.Item
               label="角色类型"
               {...formItemLayout}
             >
               {getFieldDecorator('role_type_id',{
                 initialValue: editItem.role_type_id || 1,
                 rules: [{required: true, message: '请选择角色类型'}],
               })(
                 <Select size='large' style={{width: 350}} onChange={e => this.getPermission(e, !!editItem.id)}>
                   {
                     roles.map(item => (
                       <Option value={item.id} key={item.id}>{item.name}</Option>
                     ))
                   }
                 </Select>
               )}
             </Form.Item>
           </Form>
         </div>
       </div>
       {
         type ? (
           <div className={style.addBox}>
             {
               permission.map(item => (
                 <CheckItem
                   key={item.id}
                   data={item}
                   onChange={this.handlePcChange}
                 />
               ))
             }
           </div>
         ):(
          <div>
            <div className={style.wxBox}>
              <div className={style.title}>电脑端</div>
              <div className={style.content}>
                {
                  permission.map(item => (
                    <CheckItem
                      key={item.id}
                      data={item}
                      onChange={this.handlePcChange}
                    />
                  ))
                }
              </div>
            </div>
            <div className={style.wxBox}>
              <div className={style.title}>小程序</div>
              <div className={style.content}>
                {
                  wxPermission.map(item => (
                    <CheckItem
                      key={item.id}
                      data={item}
                      onChange={this.handleWxChange}
                    />
                  ))
                }
              </div>
            </div>
          </div>
         )
       }
       <Tabbar>
         <div className={style.btn}>
           <Button type='primary' size='large' onClick={this.handleSubmit}>发布</Button>
           <Button size='large' onClick={onCancel}>取消</Button>
         </div>
       </Tabbar>
     </Spin>
    )
  }
}

export default Form.create()(Add)
