/**
 * Created by kikazheng on 2019/5/20
 */
import React, { Component } from 'react'
import {Button, Spin, message} from 'antd'

import Menus from './components/Menus'
import Goods from './components/Goods'
import Tabbar from '../../../components/Tabbar'

import services from '../../../services'
import {arrayToTreeData} from '../../../utils'
import style from './index.less'

class Index extends Component{
  state = {
    loading: false,
    type: 1, // 1项目 2产品
    ids: [],
    goods: [],
    menus: [],
    categoryName: '全部',
  }

  componentDidMount(){
    this.getMenus()
    this.getGoods()
  }

  handleTab =  (type) => {
    this.setState({type, ids: []},async () => {
      await this.getMenus()
      await this.getGoods()
    })
  }

  getMenus = () => {
    const {type} = this.state
    this.setState({loading: true})
    services.list({keys: {name: type === 1 ? 'brand/projectcategory/data' :  'brand/productcategory/data'}, data: {limit: 1000}}).then(res => {
      this.setState({loading: false})
      if(res.success){
        const menus = arrayToTreeData(res.list.map((_) => ({
            ..._,
            title: _.categoryName,
            key: _.categoryId,
          })),
          "pId",
          'categoryId',
          0).children
        this.setState({menus})
      }
    }).catch(() => {
      this.setState({loading: false})
    })
  }

  getGoods = (categoryId, e) => {
    this.setState({loading: true})
    services.LIST({keys: {name: 'store/services/import'}, data: {type: this.state.type,q: {where: {categoryId: Number(categoryId) ? categoryId : undefined}}}}).then(res => {
      this.setState({loading: false})
      if(res.success){
        this.setState({
          goods: res.list,
          categoryName: e ? e.node.props.title : '全部',
        })
      }
    }).catch(() => {
      this.setState({loading: false})
    })
  }

  goodSelect = (id) => {
    const {ids} = this.state
    const index = ids.indexOf(id)
    if(index > -1){
      ids.splice(index, 1)
    }else {
      ids.push(id)
    }
    this.setState({ids})
  }

  handleSubmit = () => {
    const {ids, type} = this.state
    this.setState({loading: true})
    services.INSERT({keys: {name: 'store/services/import'}, data: {ids, type}}).then(res => {
      this.setState({loading: false})
      if(res.success){
        message.success('导入成功')
        this.setState({ids: []})
        this.getGoods()
      }
    }).catch(() => {
      this.setState({loading: false})
    })
  }
  render(){
    const {type, loading, ids, goods, categoryName, menus} = this.state
    return(
      <Spin spinning={loading}>
        <div className={style.container}>
          <div className={style.tab}>
            <span className={type === 1 ? style.active : ''} onClick={() => this.handleTab(1)}>导入项目</span>
            <span className={type === 2 ? style.active : ''} onClick={() => this.handleTab(2)}>导入产品</span>
          </div>
          <div className={style.content}>
            <div className={style.contentLeft}>
              <Menus
                data={menus}
                onSelect={this.getGoods}
              />
            </div>
            <div className={style.contentRight}>
              <Goods
                data={goods}
                categoryName={categoryName}
                ids={ids}
                goodSelect={this.goodSelect}
              />
            </div>
          </div>
        </div>
        <Tabbar>
          <div className={style.btn}>
            <span style={{color: '#333'}}>已选择：</span>
            <span>{ids.length}</span>
            <Button size='large' type='primary' disabled={!ids.length} onClick={this.handleSubmit}>导入</Button>
          </div>
        </Tabbar>
      </Spin>
    )
  }
}


export default Index
