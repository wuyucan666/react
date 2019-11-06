import { Component } from 'react'
import { Radio, Modal, Row, message, Col, InputNumber, Button } from 'antd'
import { connect } from 'dva'
import CommonTable from 'components/CommonTable/index'

import config from './config'
import style from './style.less'
import services from 'services'

const RadioGroup = Radio.Group

class performRewards extends Component {

  state = {
    visible: false,
    name: 'store/commission/reward',
    setData: {
      staffId: [],
      type: 1,
      staffName: '',
      status: 1,
      data: [{min: '', max: '', commission: ''}],
      checkedList: [],
    },
  }

  onTableChange = (type, item) => {
    if(type === 11) {
      this.editItem(item)
    }
    if(type === 20) {
      this.delCur(item)
    }
  }

  addItem = () => {
    const { selectedRowKeys, data } = this.props.pageData
    if(selectedRowKeys.length > 0) {
      this.setState({
        checkedList: selectedRowKeys.map(v => {
          if(data.find(_ => _.key === v)) {
            v = data.find(_ => _.key === v)
          }
          return v
        }),
      })
      this.setState({visible: true})
    }else {
      message.error('请选择要批量设置的项！')
    }
  }

  editItem = (item) => {
    this.setState({
      setData: {
        data: item.list.length > 0 ? item.list : [{min: '', max: '', commission: ''}], 
        type: item.type !== 0 ? item.type : 1, 
        status: item.status, 
        staffName: item.staffName,
        id: item.id,
      },
      checkedList: [item],
      visible: true,
    })
  }

  delCur = (item) => {
    const { name } = this.state
    services.DELETE({
      keys: {name, id: item.rewardId},
    }).then(res => {
      if(res.success) {
        message.success('清除成功!')
        this.reset()
      }
    })
  }

  handleOk = () => {
    const {data } = this.state.setData
    let canSubmit = true
    data.forEach(v => {
      if(v.mix === '' || !v.max || !v.commission) {
        canSubmit = false
      }
    })
    if(!canSubmit) {
      message.error('请完善信息')
      return false
    }
    let ids = []
    this.state.checkedList.forEach(v => {
      ids.push(v.id)
    })
    services.INSERT({
      keys: {name: this.state.name},
      data: {...this.state.setData, data, staffId: ids},
    }).then(res => {
      if(res.success) {
        this.props.dispatch({
          type:'store/commission/reward',
          payload:{new:true},
        })
        message.success('设置成功!')
        this.reset()
      }
    })
  }

  reset = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'table/getData',
      payload: {new: true},
    })
    this.setState({
      visible: false,
      checkedList: [],
      setData: {
        type: 1,
        status: 1,
        staffName: '',
        data: [{min: '', max: '', commission: ''}],
      },
    })
  }

  addLine = () => {
    let data = this.state.setData.data
    let last = data[data.length - 1]
    let canAdd = true
    if(last) {
      Object.keys(last).forEach(v => {
        if(last[v] === '' || last[v] === null) {
          canAdd = false
        }
      })
    }
    if(!canAdd) {
      message.error('请完善信息')
      return false
    }
    data.push({min: last.max, max: '', commission: ''})
    let result = {...this.state.setData, data}
    this.setState({
      setData: result,
    })
  }

  delLine = () => {
    let data = this.state.setData.data
    data.pop()
    let result = {...this.state.setData, data}
    this.setState({
      setData: result,
    })
  }

  changeOther = (e, key) => {
    let result = {...this.state.setData, [key]: e}
    this.setState({
      setData: result,
    })
  }

  changeNum = (e, index, key) => {
    let data = this.state.setData.data
    data[index][key] = e
    let result = {...this.state.setData, data}
    this.setState({
      setData: result,
    })
  }

  inputBlur = () => {
    let data = this.state.setData.data
    data.map(e => {
      if(e.min >= e.max) {
        e.max = ''
        message.warning(`输入的值不能小于${e.min}`)
      }
      return e
    })
    this.setState({setData: {...this.state.setData, data}})
  }

  changeDate = (e) => {
    return e.map(v => ({...v, temp1: v.list}))
  }

  render() {
    console.log(6666, this.state.checkedList)
    return (
      <div>
        <div className={style.head + ' flex'}>
          <div style={{fontSize: '14px', color: '#666666', fontWeight: 'normal'}}>特别说明：业绩奖励提成系统根据自然月计算</div>
          <div className='item'>
            <Button size="large" type="primary" onClick={this.addItem}>批量设置</Button>
          </div>
        </div>
        <CommonTable
        New
        name="store/commission/reward"
        tableConfig={config}
        onDataChangeBefore={this.changeDate}
        onTableChange={this.onTableChange}
        ></CommonTable>
        {/* 设置弹框 */}
        <Modal
          title="奖励提成设置"
          visible={this.state.visible}
          onOk={this.handleOk}
          maskClosable={false}
          onCancel={() => {
            this.setState({visible: false})
            this.reset()
          }}
          width={790}
        >
          <div className='ainier-row'>
          <Row>
            <Col span={1}>员工</Col>
            <Col span={21}>
              {
                this.state.checkedList && this.state.checkedList.map(v => {
                  return(
                    <span style={{color: '#333333', fontWeight: 'bold', marginLeft: 10}}>{v.staffName}</span>
                  )
                })
              }
            </Col>
          </Row>
          <Row style={{marginTop: '30px'}}>
            <Col span={2}>提成类型</Col>
            <Col span={22}>
              <RadioGroup 
              value={this.state.setData.type}
              onChange={(e) => this.changeOther(e.target.value, 'type')}
              >
                <Radio value={1}>固定提成</Radio>
                <Radio value={3}>销售额比例提成</Radio>
              </RadioGroup>
            </Col>
          </Row>
          <Row>
            {
              this.state.setData.data.map((v,i) => {
                return (
                <div className='animated fadeIn'>
                  {/* precision={0}*/}
                  <InputNumber style={{width: '112px'}} size='large' min={0} value={v.min} disabled={i !== this.state.setData.data.length -1 || i > 0} onChange={(e) => this.changeNum(e, i, 'min')}></InputNumber>
                  <span>≤ 个人业绩 ＜</span>
                  <InputNumber style={{width: '112px'}} size='large' disabled={i !== this.state.setData.data.length -1} value={v.max} onBlur={this.inputBlur}  onChange={(e) => this.changeNum(e, i, 'max')}></InputNumber>
                  <span>提成</span>
                  <InputNumber style={{width: '152px'}} size='large' min={0} disabled={i !== this.state.setData.data.length -1} max={this.state.setData.type === 1 ? 10000: 100} value={v.commission} onChange={(e) => this.changeNum(e, i, 'commission')}></InputNumber>
                  <b>{this.state.setData.type === 1 ? '元' : '%'}</b>
                  {
                    this.state.setData.data.length === i*1 + 1 &&
                    <i className='iconfont icon-zengjia' onClick={this.addLine}></i>
                  }
                  {
                    (this.state.setData.data.length === i*1 + 1 && i !== 0) &&
                    <i className='iconfont icon-shanchu' onClick={this.delLine}></i>
                  }
                </div>
                )
              })
            }
          </Row>
          <Row>
            <Col span={2}>开启状态</Col>
            <Col span={22}>
            <RadioGroup
            value={this.state.setData.status}
            onChange={(e) => this.changeOther(e.target.value, 'status')}
            >
              <Radio value={1}>启用</Radio>
              <Radio value={0} style={{marginLeft: '40px'}}>停用</Radio>
            </RadioGroup>
            </Col>
          </Row>
          </div>
        </Modal>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return { pageData: state.table}
}

export default connect(mapStateToProps)(performRewards)