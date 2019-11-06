import { Component } from 'react'
import { Button, Table, Radio, message, Modal, Tooltip, Row, Col, InputNumber} from 'antd'
import PropTypes from "prop-types"

import services from 'services'
import moment from 'moment'

import style from './style.less'
const RadioGroup = Radio.Group

const DeleteBtn = ({ delCur, editItem, item }) => {
  return (
    <div className='rowbtns' style={{position: 'absolute', right: '20px', top: '0px', float: 'left'}} >
      <div className='animated zoomIn faster' style={{borderRadius: '50%'}} >
        <Tooltip placement="top" title="编辑">
          <i className="iconfont icon-bianji" onClick={() => editItem({...item})}></i>
        </Tooltip>
        {
          item.type !== 0 &&
          <Tooltip placement="top" title="清除奖励规则">
            <i className="iconfont icon-qingkong" onClick={() => delCur(item)}></i>
          </Tooltip>
        }
      </div>
    </div>
  )
}

class table extends Component {

  state = {
    dataSource: [],
    checkedList: [],
    visible: false,
    typeList: [],
    setData: {
      staffId: [],
      type: 1,
      staffName: '',
      status: 1,
      data: [{min: '', max: '', commission: ''}],
    },
  }

  componentDidMount () {
    this.getList()
  }

  getList = () => {
    const { name } = this.props
    services.LIST({
      keys: {name},
      data: {},
    }).then(res => {
      this.setState({
        dataSource: res.list.map((v,i) => ({...v, index: i*1 + 1, temp1: [], key: v.id})),
      })
    })
  }


  onSelect = (item, checked) => {
    if(checked) {
      let checkeds = [...this.state.checkedList].map(_ => ({..._}))
      checkeds.push(item)
      this.setState({checkedList: checkeds})
    }else {
      const checkeds = [...this.state.checkedList].map(_ => ({..._}))
      checkeds.splice(checkeds.findIndex(_ => _.id === item.id), 1)
      this.setState({checkedList: checkeds})
    }
  }

  onSelectAll = (checked, items) => {
    if(checked) {
      this.setState({checkedList: items})
    }else {
      this.setState({checkedList: []})
    }
  }

  addItem = () => {
    const { checkedList } = this.state
    if(checkedList.length > 0) {
      this.setState({visible: true})
    }else {
      message.error('请选择要批量设置的项！')
    }
  }

  delItem = () => {
    if(this.state.checkedList.length === 0 || this.state.dataSource.length === 0) {
      message.error('请选择要清除的项!')
      return false
    }
    const { name } = this.props
    let arr = this.state.checkedList.map(v => (v.id))
    services.DELETE({
      keys: {name, id: 1},
      data: {ids: arr},
    }).then(res => {
      if(res.success) {
        message.success('清除成功!')
        this.setState({checkedList: []})
        this.getList()
      }
    })
  }

  addLine = () => {
    let data = this.state.setData.data
    let last = data[data.length - 1]
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

  changeOther = (e, key) => {
    let result = {...this.state.setData, [key]: e}
    this.setState({
      setData: result,
    })
  }

  handleOk = () => {
    const {data } = this.state.setData
    const { name } = this.props
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
      keys: {name: name},
      data: {...this.state.setData, data, staffId: ids},
    }).then(res => {
      if(res.success) {
        message.success('设置成功!')
        this.getList()
        this.reset()
      }
    })
  }

  reset = () => {
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
    this.getList()
  }

  render() {

    const editItem = (item) => {
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

    const delCur = (item) => {
      let that = this
      const { name } = that.props
      Modal.confirm({
        title: '您确定要清除吗?',
        content: '',
        okText: '确认',
        cancelText: '取消',
        icon:<div style={{width:'37px',height:'37px',background:'#FF303D',borderRadius:'50%',textAlign:'center',lineHeight:'37px',marginLeft:'177px',marginBottom:'10px'}}><i className='iconfont icon-shanchu' style={{color:'#fff'}}/></div>,
        closable: true,
        centered: true,
        maskClosable: true,
        maskStyle:{
          background:'rgba(0,0,0,0.65)',
        },
        className:'madalDiv',
        onOk () {
          services.DELETE({
            keys: {name, id: item.rewardId},
          }).then(res => {
            if(res.success) {
              message.success('清除成功!')
              that.getList()
            }
          })
        },
      })
    }

    const columns = [{
      title: '序号',
      dataIndex: 'index',
      align: 'left',
      width: '6%',
    },
    {
      title: '员工',
      dataIndex: 'staffName',
      align: 'left',
      width: '10%',
      render(text) {
        return   text.length > 10 ? (
          <Tooltip title={text}>{text.slice(0, 9)}...</Tooltip>
        ) : (
          text
        )
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      align: 'left',
      width: '10%',
      render(text) {
        return <div> {
          text === 0 ?
          <span className={style.worng}>停用</span>
          :
          <span className={style.right}>启用</span>
        }</div>
      },
    },{
      title: '提成类型',
      dataIndex: 'type',
      align: 'left',
      width: '10%',
      render(text, record) {
        return (
          <div>
            {
              record.type === 0 ?
              <div style={{color: '#FF4646'}}>未设置</div>
              :
              (text === 1 ? '固定提成' : '销售比例提成')
            }
          </div>
        )
      },
    },
    {
      title: '业绩范围',
      dataIndex: 'list',
      align: 'left',
      width: '17%',
      className: 'table-padding0',
      render(text, record) {
        return (
          <div>
            {
              record.type === 0 ?
              <div style={{color: '#FF4646', paddingLeft: 16}}>未设置</div>
              :
              text.map((v,i) => {
                return <div className={style.rowItem} key={i}>{v.min}≤个人业绩≤{v.max}</div>
              })
            }
          </div>
        )
      },
    },
    {
      title: '提成',
      dataIndex: 'temp1',
      align: 'left',
      width: '17%',
      className: 'table-padding0',
      render(text, record) {
        return(
          <div>
            {
              record.type === 0 ?
              <div style={{color: '#FF4646', paddingLeft: 16}}>未设置</div>
              :
              record.list.map((v,i) => {
                return (
                  <div className={style.rowItem} key={i}>{v.commission}{record.type === 1 ? '元' : '%'}</div>
                )
              })
            }
          </div>
        )
      },
    }, {
      title: '更新时间',
      dataIndex: 'updated',
      align: 'left',
      width: '25%',
      render(text, item) {
        return (
        <div style={{position: 'relative'}}>
          {
            item.type === 0 ?
            <span>--</span> :
            <span className={style.pad20}>{moment(text*1000).format('YYYY-MM-DD')}</span>
          }
          <DeleteBtn item={item} editItem={editItem} delCur={delCur}></DeleteBtn>
        </div>
        )
      },
    }]

    const { add } = this.props

    return (
      <div>
        <div className={style.head + ' flex'}>
          <div style={{fontSize: '14px', color: '#666666', fontWeight: 'normal'}}>特别说明：业绩奖励提成系统根据自然月计算</div>
          <div className='item'>
            {
              add &&
              <Button size="large" type="primary" onClick={this.addItem}>批量设置</Button>
            }
            {/* {
              del &&
              <Button size="large" type="primary" onClick={this.delItem}><i className='iconfont icon-shanchu'></i>删除</Button>
            } */}
          </div>
        </div>
        <div className='commission'>
          <Table
          pagination={false}
          bordered={true}
          dataSource={this.state.dataSource}
          columns={columns}
          rowSelection={{
            onSelect: this.onSelect,
            onSelectAll: this.onSelectAll,
            selectedRowKeys: this.state.checkedList.map(v => v.id),
          }}
          ></Table>
        </div>
        <Modal
          title="奖励提成设置"
          visible={this.state.visible}
          onOk={this.handleOk}
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
                this.state.checkedList.map(v => {
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
                  <InputNumber style={{width: '112px'}} size='large' precision={1} min={0} value={v.min} disabled={i !== this.state.setData.data.length -1} onChange={(e) => this.changeNum(e, i, 'min')}></InputNumber>
                  <span>≤ 个人业绩 ＜</span>
                  <InputNumber style={{width: '112px'}} size='large' precision={1} disabled={i !== this.state.setData.data.length -1} value={v.max} onBlur={this.inputBlur}  onChange={(e) => this.changeNum(e, i, 'max')}></InputNumber>
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

table.propTypes = {
  title: PropTypes.string,
  edit: PropTypes.bool, //是否显示编辑按钮
  batch: PropTypes.bool, //是否显示批量设置按钮
  add: PropTypes.string, //添加的类型 项目/产品/附加项目
  delete: PropTypes.bool, //是否显示删除按钮
}

export default table
