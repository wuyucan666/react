
import React, { Component } from 'react'
import { Select } from 'antd'
import services from "../../../services"
// import debounce from 'lodash/debounce'
const { Option } = Select
class Test extends Component {
  constructor(props){
    super(props)
    this.state = {
      arr: []
    }
    // this.handleSearch = debounce(this.handleSearch,500)
  }

  componentWillMount(){
    this.getData()
  }

  getData = (val) => {
    let obj = val ?
    {
      keys: {name: 'erp/supplier/selector'},
      data: {
         q: { where: { 'name[~]': val } }
      }
    }
    :
    {
      keys: {name: 'erp/supplier/selector'}
    }
    services.LIST(obj).then(res => {
      if(res.success){
        const arr = res.list.map(item => ({ name: item.name, value: item.id }))
        this.setState({
          arr
        })
      }
    })
  }

  handleSearch = (val) => {
      this.getData(val)
  }

  render(){
    const { arr } = this.state
    const { value } = this.props
    // console.log(arr,'8888888888888888888888888')
    // console.log(value,'99999999999999999999999')
    return (
      <Select
        showSearch
        placeholder='全部供应商'
        defaultActiveFirstOption={false}
        showArrow={true}
        filterOption={false}
        value={value}
        getPopupContainer={trigger => trigger.parentNode}
        style={{ width: 200,position:'absolute',right:'0px',top:'0px' }}
        onSearch={this.handleSearch}
        onChange={(v)=>this.props.handleChange(v)}
        onFocus={this.getData}
      >
      {arr.map(_ => <Option key={_.value} value={_.value}>{_.name}</Option>)}
    </Select>
     )
  }
}

export default Test
