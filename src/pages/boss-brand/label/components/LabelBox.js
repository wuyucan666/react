/**
 * Created by kikazheng on 2019/5/9
 */
import React, {Component} from 'react'

import LabelItem from './LabelItem'
import style from '../style.less'
import services from "../../../../services"
import {message, Spin} from "antd"

class LabelBox extends Component{
  state = {
    showAdd: false,
    loading: false,
  }
  edit = () => {
    this.setState({showAdd: true})
  }
  onOk = () => {
    this.setState({showAdd: false},() => {
      this.props.onOk()
    })
  }
  toggleAdd = () => {
    this.setState((prevState) => {
      return {
        showAdd: !prevState.showAdd,
      }
    })
  }
  disabled = () => {
    this.setState({loading: true})
    const {id, data, onOk} = this.props
    services.UPDATE({
      keys:{
        name: 'clientLabel/labelInfo',
        id: data.labelId,
      },
      data:{
        ...data,
        status: 0,
        clientLabelTypeId: id,
      },
    }).then(res => {
      this.setState({loading: false})
      if(res.success){
        onOk()
      }
    }).catch(() => {
      this.setState({loading: false})
      message.error('请求出错')

    })
  }
  render(){
    const {showAdd, loading} = this.state
    const {id, data} = this.props
    return(
      <Spin spinning={loading}>
        <div>
          {
            showAdd?(
              <LabelItem
                id={id}
                editItem={data}
                onOk={this.onOk}
                onCancel={this.toggleAdd}
              />
            ):(
              <div>
                {
                  data.labelId ? (
                    <div className={data.status ? style.label : `${style.label} ${style.disabled}`}>
                      {data.name}
                      <div className={style.ac}>
                        <span onClick={this.toggleAdd}>编辑</span>
                        <span/>
                        <span onClick={this.disabled}>禁用</span>
                      </div>
                    </div>
                  ):(
                    <div className={style.add} onClick={this.toggleAdd}>+</div>
                  )
                }
              </div>
            )
          }
        </div>
      </Spin>
    )
  }
}

export default LabelBox
