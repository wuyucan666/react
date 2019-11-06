/**
 * Created by kikazheng on 2019/4/24
 */
import React,{Component} from 'react'
import {Form, Input, Button, message, Spin} from 'antd'

import CheckItem from './CheckItem'
import Tabbar from "components/Tabbar"

import service from '../../../../services'
import validate from "../../../../utils/validate"
import { connect } from 'dva'
import style from '../index.less'


class Add extends Component{
  state = {
    permission: [],
    wxPermission: [],
    loading: false,
  }

  componentDidMount(){
    this.getPermission(2, true)
  }

  getPermission = (type, init) => {
    this.setState({loading: true})
    service.LIST({keys: {name: 'permission/store-permission/list'}, data: {type}}).then(res => {
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
          role_type_id: 2,
          id: editItem.id,
        }
        this.setState({loading: true})
        if(editItem.id){
          service.INSERT({keys: {name: 'store/manage/role/update'}, data}).then(res => {
            this.setState({loading: false})
            if(res.success){
              // this.props.dispatch({

              // })
              message.success('修改成功')
              this.props.dispatch({
                type:'table/getData',
                payload:{new:false},
              })
              this.props.onOk()
            }
          }).catch(() => {
            this.setState({loading: false})
          })
        }else {
          service.INSERT({keys: {name: 'store/manage/role/insert'}, data}).then(res => {
            this.setState({loading: false})
            if(res.success){
              message.success('发布成功')
              this.props.dispatch({
                type:'table/getData',
                payload:{new:false},
              })
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
    const {loading, permission, wxPermission} = this.state
    const { getFieldDecorator } = this.props.form
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
                   _var: {"_":2,"role_type_id":2},
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
                 <Input  size='large'  style={{width: 350}} />
               )}
             </Form.Item>
           </Form>
         </div>
       </div>
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
       <Tabbar>
         <div className={style.btn}>
           <Button size='large' onClick={onCancel}>取消</Button>
           <Button type='primary' size='large' onClick={this.handleSubmit}>发布</Button>
         </div>
       </Tabbar>
     </Spin>
    )
  }
}

export default connect()(Form.create()(Add))
