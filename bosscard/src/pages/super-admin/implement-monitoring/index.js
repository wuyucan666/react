/**
 * Created by kikazheng on 2019/7/1
 */
import React, { Component } from 'react'
import clonedeep from 'lodash.clonedeep'
import { connect } from 'dva'

import CommonTable from 'components/CommonTable'
import config from './tableConfig'
import service from '../../../services'
import Assign from './components/Assign'
import SMS from './components/SMS'
import Follow from './components/Follow'
import StatusRules from './components/StatusRules'

class Index extends Component {
  state = {
    staff: [],
    tag: [],
    editItem: {},
    showSms: false,
    showAssign: false,
    showFollow: false,
    tableConfig: clonedeep(config),
    init: true,
  }

  async componentDidMount() {
    const { tableConfig } = this.state
    tableConfig.screen.moreContent = (<div style={{marginTop: 10}}><StatusRules /></div> )
    this.setState({tableConfig})
    await this.getBrand()
    await this.getStaff()
    await this.getTag()
  }

  getStaff = () => {
    service.LIST({ keys: { name: 'admin/list' }, data: { q: { page: -1, limit: -1 } } }).then(res => {
      if (res.success) {
        const { tableConfig } = this.state
        const list = res.list.map(item => ({ name: item.userName, value: item.adminId }))
        tableConfig.screen.rules[5].list = list
        this.setState({
          staff: res.list,
          tableConfig: clonedeep(tableConfig),
        })
      }
    })
  }

  getBrand = () => {
    service.LIST({ keys: { name: 'admin/implement/brand/selector' } }).then(async res => {
      if (res.success) {
        const { tableConfig } = this.state
        const brand = res.list.map(item => ({ name: item.name, value: item.id }))
        const brandId = brand[0] ? brand[0].value : undefined
        // tableConfig.screen.query = {brandId}
        tableConfig.screen.rules[1].list = brand
        tableConfig.screen.rules[1].value = brandId
        tableConfig.screen.rules[1].onChange = async (id, setFieldsValue) => {
          setFieldsValue({
            storeId: -999,
            areaId: -999,
          })
          await this.getStore(id)
          await this.getArea(id)
        }
        this.setState({ init: false, tableConfig: clonedeep(tableConfig) })
        if (brandId) {
          await this.getStore(brandId)
          await this.getArea(brandId)
        }
      }
    })
  }

  getStore = (brandId) => {
    service.LIST({ keys: { name: 'admin/implement/store/selector' }, data: { brandId } }).then(res => {
      if (res.success) {
        const { tableConfig } = this.state
        const store = res.list.map(item => ({ name: item.name, value: item.id }))
        if (store.length) {
          tableConfig.screen.rules[2].list = [
            { name: '全部门店', value: -999 },
            ...store,
          ]
          tableConfig.screen.rules[2].value = -999
        } else {
          tableConfig.screen.rules[2].list = []
          tableConfig.screen.rules[2].value = undefined
        }
        this.setState({ tableConfig: clonedeep(tableConfig) })
      }
    })
  }

  getArea = (brandId) => {
    service.LIST({ keys: { name: 'admin/implement/store/area/selector' }, data: { brandId } }).then(res => {
      if (res.success) {
        const { tableConfig } = this.state
        const area = res.list.map(item => ({ name: item.name, value: item.id }))
        if (area.length) {
          tableConfig.screen.rules[6].list = [
            { name: '全部区域', value: -999 },
            ...area,
          ]
          tableConfig.screen.rules[6].value = -999
        } else {
          tableConfig.screen.rules[6].list = []
          tableConfig.screen.rules[6].value = undefined
        }
        this.setState({ tableConfig: clonedeep(tableConfig) })
      }
    })
  }

  getTag = () => {
    service.LIST({ keys: { name: 'admin/store/tag' } }).then(res => {
      if (res.success) {
        const { tableConfig } = this.state
        tableConfig.screen.rules[8].list = res.list.map(item => ({ name: item.name, value: item.id }))
        this.setState({
          tag: res.list,
          tableConfig: clonedeep(tableConfig),
        })
      }
    })
  }

  onTableChange = (type, record) => {
    switch (type) {
      case 21:
        this.setState({
          showSms: true,
          editItem: record,
        })
        break
      case 22:
        this.setState({
          showAssign: true,
          editItem: record,
        })
        break
      case 23:
        this.setState({
          showFollow: true,
          editItem: record,
        })
        break
      default:
        console.log(type)
    }
  }

  assignOk = () => {
    this.setState({ showAssign: false })
    this.props.dispatch({
      type: 'table/getData',
      payload: { new: false },
    })
  }

  cancelAssign = () => {
    this.setState({ showAssign: false })
  }

  smsOk = () => {
    this.setState({ showSms: false })
    this.props.dispatch({
      type: 'table/getData',
      payload: { new: false },
    })
  }

  cancelSms = () => {
    this.setState({ showSms: false })
  }

  followOk = () => {
    this.setState({ showFollow: false })
    this.props.dispatch({
      type: 'table/getData',
      payload: { new: false },
    })
  }

  cancelFollow = () => {
    this.setState({ showFollow: false })
  }

  render() {
    const { staff, showSms, showAssign, editItem, showFollow, tableConfig, tag, init } = this.state
    return (
      <div>
        {
          !init && (
            <CommonTable
              name='admin/implement'
              tableConfig={tableConfig}
              onTableChange={this.onTableChange}
              onReSet={this.getBrand}
            />
          )
        }
        {
          showAssign && (
            <Assign
              list={staff}
              editItem={editItem}
              onOk={this.assignOk}
              onCancel={this.cancelAssign}
            />
          )
        }
        {
          showSms && (
            <SMS
              editItem={editItem}
              onOk={this.smsOk}
              onCancel={this.cancelSms}
            />
          )
        }
        {
          showFollow && (
            <Follow
              editItem={editItem}
              tagList={tag}
              onOk={this.followOk}
              onCancel={this.cancelFollow}
            />
          )
        }
      </div>
    )
  }
}

export default connect()(Index)
