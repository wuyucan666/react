/**
 * Created by kikazheng on 2019/7/1
 */
import React, { Component } from 'react'
import {Button, Dropdown, Menu, Spin, Icon, message} from 'antd'

import service from 'services'
import Edit from './component/EditTag'

import style from './style.less'

class Index extends Component{
  state = {
    list: [],
    loading: true,
    visible: false,
    editItem: {},
  }

  componentDidMount(){
    this.getList()
  }

  getList = () => {
    service.LIST({keys: {name: 'admin/store/tag'}}).then(res => {
      this.setState({loading: false})
      if(res.success){
        this.setState({list: res.list})
      }
    }).catch(() => {
      this.setState({loading: false})
    })
  }

  showEdit = (editItem) => {
    this.setState({
      visible: true,
      editItem,
    })
  }

  hideEdit = () => {
    this.setState({
      visible: false,
    })
  }

  okEdit  = () => {
    this.setState({
      visible: false,
      editItem: {},
    })
    this.getList()
  }

  delTag = (id) => {
    this.setState({loading: true})
    service.DELETE({keys: {name: 'admin/store/tag', id}}).then(res => {
      this.setState({loading: false})
      if(res.success){
        message.success('删除成功')
        this.getList()
      }
    }).catch(() => {
      this.setState({loading: false})
    })
  }
  render(){
    const {loading, list, visible, editItem} = this.state
    return(
      <Spin spinning={loading}>
        <div className={style.container}>
          <div><Button type='primary' size='large' onClick={() => this.showEdit({})}>新建标签</Button></div>
          <div className={style.list}>
            {
              list.map(item => (
                <Dropdown
                  overlay={(
                    <Menu>
                      <Menu.Item>
                        <span onClick={() => this.showEdit(item)}>编辑</span>
                      </Menu.Item>
                      <Menu.Item>
                        <span onClick={() => this.delTag(item.id)}>删除</span>
                      </Menu.Item>
                    </Menu>
                  )}
                  placement='bottomRight'
                  overlayClassName='tag-drop'
                  key={item.id}
                >
                  <span className={style.tag}>{item.name}<Icon type="down" style={{marginLeft: 5}} /></span>
                </Dropdown>
              ))
            }
          </div>
          <Edit
            visible={visible}
            editItem={editItem}
            onOk={this.okEdit}
            onCancel={this.hideEdit}
          />
        </div>
      </Spin>
    )
  }
}

export default Index
