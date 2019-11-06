/**
 * Created by kikazheng on 2019/4/25
 */
import React,{Component} from 'react'
import {Checkbox} from 'antd'

import style from '../index.less'

const CheckboxGroup = Checkbox.Group


class CheckItem extends Component{
  state = {
    indeterminate: true,
    checkAll: false,
    sensitivePermission: [27,46,48,51,53,65,75,86,84,85,87,148,149,'45287e22','c7ef7040','8e03bbed','550a5e38','78ecbad7','5205dfad','98493f92','0d711ca0','18470dd4','5e4d5fde','d079520e'],
  };
  componentDidMount(){
    const {data} = this.props
    let length = 0
    let checkLength = 0
    data.groups.forEach(item => {
      length += item.groups.length
      if(item.value){
        checkLength += item.value.length
      }
    })
    this.setState({
      indeterminate: !!checkLength && (checkLength < length),
      checkAll: checkLength === length,
    })
  }
  onChange = (checkedList, index) => {
    const {data} = this.props
    let length = 0
    let checkLength = 0
    data.groups[index].value = checkedList
    data.groups.forEach(item => {
      length += item.groups.length
      if(item.value){
        checkLength += item.value.length
      }
    })
    this.setState({
      indeterminate: !!checkLength && (checkLength < length),
      checkAll: checkLength === length,
    })
    this.props.onChange(data.id, data)
  }

  onCheckAllChange = (e) => {
    // const checkedList = []
    const {data} = this.props
    if(e.target.checked){
      data.groups.forEach(item => {
        item.value = []
        item.groups.forEach(item2 => {
          item.value.push(item2.id)
        })
      })
    }else {
      data.groups.forEach(item => {
        item.value = []
      })
    }
    this.setState({
      indeterminate: false,
      checkAll: e.target.checked,
    })
    this.props.onChange(data.id, data)
  }
  render(){
    const {data} = this.props
    const {sensitivePermission} = this.state
    return(
      <div className={style.checkItem}>
        <div className={style.checkTitle}>
          <Checkbox
            indeterminate={this.state.indeterminate}
            onChange={this.onCheckAllChange}
            checked={this.state.checkAll}
          >
            {data.name}
          </Checkbox>
        </div>
        <div className={style.checkContent}>
          {
            data.groups.map((item, index) => (
              <div className={style.contentItem} key={index}>
                <div className={style.category}>{item.name}</div>
                <div className={style.checkList}>
                  <CheckboxGroup options={item.groups.map(item2 => ({label: <span style={{color: (sensitivePermission.indexOf(item2.code || item2.id) > -1) ? '#FF4646' : '#999'}}>{item2.name}</span>, value: item2.id}))} value={item.value || []}  onChange={(checkList) => this.onChange(checkList, index)} />
                </div>
              </div>
            ))
          }
        </div>
      </div>
    )
  }
}

export default CheckItem
