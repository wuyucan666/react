/**
 * Created by kikazheng on 2019/5/20
 */
import React, { Component } from 'react'
import {Tree} from 'antd'

import style from '../index.less'

const { TreeNode } = Tree

class Menus extends Component{
  renderTree = (data) => {
    return data.map(item => (
      <TreeNode title={item.categoryName} key={item.categoryId}>
        {
          item.children && this.renderTree(item.children)
        }
      </TreeNode>
    ))
  }
  render(){
    const {data, onSelect} = this.props
    return(
      <div>
        <div className={style.select}>选择分类</div>
        <Tree showLine  onSelect={(selectedKeys, e) => onSelect(selectedKeys[0], e)}>
          <TreeNode title='全部' key={0}/>
          {
            this.renderTree(data)
          }
        </Tree>
      </div>
    )
  }
}

export default Menus
