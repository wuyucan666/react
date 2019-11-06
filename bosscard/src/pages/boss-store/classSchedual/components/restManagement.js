import React, { Component } from 'react'
import style from '../style.less'
import { Button, InputNumber, message ,Tooltip  } from 'antd'
// import services from "services"
import man from './images/man.png'
// import woman from './images/woman.png'
import service from 'services'

// const staffList=[
//     {
//       staff_id:1,
//       staff_name:'林哥',
//       should_rest:3,
//       sex:1, // 1 男 2 女
//       staff_portrait:{},
//     },
// ]


export default class R extends Component {
  constructor(prop) {
    super(prop)
    this.state = {
      staffList: [],
    }
  }
  UNSAFE_componentWillMount() {
    const { yearMonth } = this.props
    //获取员工列表
    service.shouldRestList({ keys: { name: 'store/scheduling/shouldRest' }, data: { yearMonth } }).then(res => {
      if (res.code === '0') {
        this.setState({
          staffList: res.list,
        })
      } else {
        message.info('网络出现错误')
      }
    })
  }
  setRestManagement = () => {
    const { staffList } = this.state
    const { yearMonth, handleCancel } = this.props
    let newList = [...staffList]
      .map(item => {
        return {
          staffId: item.staff_id,
          shouldRest: item.should_rest,
        }
      })
    service.saveShouldRest({ keys: { name: 'store/scheduling/shouldRest' }, data: { yearMonth, data: newList } })
      .then(res => {
        if (res.code === '0') {
          message.success('保存成功')
          handleCancel()
        }
        else {
          // message.info('网络出现错误')
        }
      })
  }
  onChange = (item, e) => {
    if (e % 1 !== 0) {
      message.info('应休天数不能为小数')
      return
    }
    const { staffList } = this.state
    const newStaffList = [...staffList]
      .map(i => {
        if (item.staff_id === i.staff_id) {
          return {
            ...i,
            should_rest: e,
          }
        } else {
          return i
        }
      })
    this.setState({
      staffList: newStaffList,
    })
  }
  render() {
    const { staffList } = this.state
    return <div>
      <div className={style.zl_R_content} >
        {
          staffList.map((item, i) => (<div style={{ marginRight: (i + 1) % 4 === 0 ? 0 : '24px' }} className={style.zl_R_Item} key={i} >
            <img src={item.staff_portrait.requestAddress ? item.staff_portrait.requestAddress : man} alt='' />
            <Tooltip title={ item.staff_name }   ><span className={style.zl_staffnameSpan} >{item.staff_name.slice(0,4)}</span></Tooltip> 
            <InputNumber value={item.should_rest * 1} step={1} max={31} min={0} onChange={this.onChange.bind(this, item)} style={{ width: '64px', height: '32px', marginRight: '12px' }} />
            天
            </div>))
        }
      </div>
      <div className={style.zl_R_Button} >
        <Button onClick={() => this.props.handleCancel()} style={{ float: 'right', width: '88px', height: '40px', marginLeft: '24px',marginBottom:'32px' }} >取消</Button>
        <Button onClick={this.setRestManagement} type='primary' style={{ float: 'right', width: '88px', height: '40px',marginBottom:'32px' }} >确定</Button>
      </div>
    </div>
  }
}
