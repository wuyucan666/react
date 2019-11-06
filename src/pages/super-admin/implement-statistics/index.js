/**
 * Created by kikazheng on 2019/7/1
 */
import React, { Component } from 'react'
import clonedeep from 'lodash.clonedeep'
import { Button } from 'antd'
import { connect } from 'dva'

import CommonTable from 'components/CommonTable'
import StatusRules from '../implement-monitoring/components/StatusRules'

import config from './tableConfig'
import service from "services"
import host from '../../../../host'

import style from './style.less'


class Index extends Component{
  state = {
    tableConfig: clonedeep(config),
  }

  componentDidMount() {
    const { tableConfig } = this.state
    tableConfig.screen.moreContent = (
      <div className={style.head_btn}>
        <StatusRules />
        <Button size='large' type='primary' onClick={this.implementExport}>导出数据</Button>
      </div>
    )
    this.setState({tableConfig})
    this.getStaff()
    this.getBrand()
  }

  getStaff = () => {
    service.LIST({keys: {name: 'admin/list'}, data: {q: {page: -1, limit: -1}}}).then(res => {
      if(res.success){
        const {tableConfig} = this.state
        const staff = res.list.map(item => ({name: item.userName, value: item.adminId}))
        const list = tableConfig.screen.rules[0].list
        tableConfig.screen.rules[0].list = [...list, ...staff]
        this.setState({tableConfig: clonedeep(tableConfig)})
      }
    })
  }

  getBrand = () => {
    service.LIST({keys: {name: 'admin/implement/brand/selector'}}).then(async res => {
      if(res.success){
        const {tableConfig} = this.state
        const brand =  res.list.map(item => ({name: item.name, value: item.id}))
        const list = tableConfig.screen.rules[1].list
        tableConfig.screen.rules[1].list = [...list, ...brand]
        this.setState({tableConfig: clonedeep(tableConfig)})
      }
    })
  }

  implementExport = () => {
    window.open((host || process.env.API_DOMAIM) + '/admin/implement/stats/download?q=' + JSON.stringify(this.props.query) + '&token=' + sessionStorage.getItem('tk') )
  }
  render(){
    return(
      <CommonTable
        name='admin/implement/stats'
        tableConfig={this.state.tableConfig}
      />
    )
  }
}

const mapStateToProps = (state) => {
  return {
    query: {where: {...state.table.pageData['admin/implement/stats'].where}},
  }
}

export default connect(mapStateToProps)(Index)
