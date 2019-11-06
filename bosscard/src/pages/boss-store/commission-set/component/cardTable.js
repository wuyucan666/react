import { Component } from 'react'
import { Button, Table, Select, InputNumber, message, Modal, Tooltip, Row, Col, Input } from 'antd'
import PropTypes from "prop-types"
import Tabbar from 'components/Tabbar'

import services from 'services'
import moment from 'moment'

import style from './style.less'

const Option = Select.Option

const DeleteBtn = ({ editItem, item }) => {
  return (
    <div className='rowbtns' style={{position: 'absolute', right: '20px', top: '0px', float: 'left'}} >
      <div className='animated zoomIn faster' style={{borderRadius: '50%'}}  onClick={() => editItem(item)}>
        {
          !item.isEdit &&
          <i className="iconfont icon-bianji"></i>
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
    setList: [],
    commomType: 0,
    commomNum: 0,
    name: '',
    type: '',
    current: 1,
    total: 0,
  }

  componentDidMount () {
    this.getList()
  }

  getList = (data) => {
    const { name } = this.props 
    services.LIST({
      keys: {name},
      data: data || {},
    }).then(res => {
      this.setState({
        dataSource: res.list.map((v,i) => ({...v, index: i*1 + 1, key: v.id})),
        total: res.totalSize,
        current: res.curPage,
      })
    })
  }

  editAll = () => {
    this.setState({dataSource: this.state.dataSource.map(v => ({...v, isEdit: true}))})
  }

  setSelect = () => {
    if(this.state.dataSource.filter(v => v.isEdit === true).length > 0) {
      message.error('请先保存再进行此操作!')
      return false
    }
    if(this.state.checkedList.length === 0) {
      message.error('请先勾选要批量设置的项')
      return false
    }
    this.setState({visible: true})
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

  handleOk = () => {
    if(this.state.commomType !== 0 && this.state.commomNum === 0) {
      message.error('如设置提成类型,提成点不能为0')
      return false
    }
    this.setState({
      visible: false,
      dataSource: this.state.dataSource.map(v => {
        let res = this.state.checkedList.filter(e => e.id === v.id)
        if(res.length > 0) {
          v.isEdit = true
          v.commissType = this.state.commomType
          v.commissNum = this.state.commomNum
        }
        return v
      }),
    })
    this.reset()
  }

  search = () => {
    const { name } = this.props 
    let where = {}
    if(this.state.name !== '') {
      where['cardName[~]'] = this.state.name
    }
    if(this.state.type !== '') {
      where.cardType = this.state.type
    }
    services.LIST({
      keys: {name},
      data: {q: {page: 1, limit: 10, where: where}},
    }).then(res => {
      this.setState({
        dataSource: res.list.map((v,i) => ({...v, index: i*1 + 1})),
        total: res.totalSize,
        current: res.curPage,
      })
    })
  }

  handlePageChange = (e) => {
    let where = {}
    if(this.state.name !== '') {
      where['cardName[~]'] = this.state.name
    }
    if(this.state.type !== '') {
      where.cardType = this.state.type
    }
    this.getList({
      q: {page: e.current, limit: '10', where: where},
    })
  }

  reflsh = () => {
    this.setState({name: '', type: ''})
    this.getList()
  }

  reset = () => {
    this.setState({
      commissType: 0,
      commissNum: 0,
    })
  }


  render() {

    const editItem = (item) => {
      this.setState({
        dataSource: this.state.dataSource.map(v => {
          if(v.id === item.id) {
            v.isEdit = !v.isEdit
          }
          return v
        }),
      })
    }

    const save = () => {
      //结束编辑
      const { name } = this.props
      let obj = this.state.dataSource.filter(v => v.isEdit).map(_ => {
        return {
          cardId: _.id,
          type: _.commissType,
          commission: _.commissNum,
          cardType: _.type,
        }
      })
      services.INSERT({
        keys: {name},
        data: {data: obj},
      }).then(res => {
        if(res.success) {
          message.success('保存成功!')
          this.getList()
          this.setState({checkedList: []})
        }
      })
      this.setState({
        dataSource: this.state.dataSource.map(v => ({...v, isEdit: false})),
      })
    }

    const changeHandle = (e, item) => {
      this.setState({dataSource: 
        this.state.dataSource.map(v => {
          if(v.id === item.id) {
            v.commissType = e
            if(e === 0) {
              v.commissNum = 0
            }
          }
          return v
        }),
     })
    }

    const changeHandleNumber = (e, item) => {
      if(item.commissType === 1) {
        if(e > 10000) {
          message.error('固定提成最大不能超过10000')
          return false
        }
      }else {
        if(e > 100) {
          message.error('比例提成最大不能超过100%')
          return false
        }
      }
      this.setState({
        dataSource: this.state.dataSource.map(v => {
          if(v.id === item.id) {
            v.commissNum = e
          }
          return v
        }),
      })
    }

    const columns = [{
      title: '序号',
      dataIndex: 'index',
      align: 'left',
      width: '6%',
    },
    {
      title: '卡名称',
      dataIndex: 'name',
      align: 'left',
      width: '14%',
      render(text) {
        return   text.length > 10 ? (
          <Tooltip title={text}>{text.slice(0, 9)}...</Tooltip>
        ) : (
          text
        )
      },
    }, {
      title: '卡类型',
      dataIndex: 'type',
      align: 'left',
      width: '9%',
      render(text) {
        return text === 1 ? '充值卡' : '计次卡'
      },
    },
    {
      title: '卡状态',
      dataIndex: 'status',
      align: 'left',
      width: '9%',
      render(text) {
        return <div>
         {
            text === 0 ? 
            <span className={style.worng}>停用</span>
            :
            <span className={style.right}>启用</span>
          }
        </div>
      },
    },{
      title: '提成类型',
      dataIndex: 'commissType',
      align: 'left',
      width: '17%',
      render(text, record) {
        return (
          <div>
            <div>
              {
                record.isEdit ? 
                <Select style={{width: '160px', color: text === 0 ? '#ccc' : '#333'}} value={text} placeholder='选择类型' size='large' onChange={(e) => changeHandle(e, record)}>
                  <Option value={1}>固定提成</Option>
                  <Option value={2}>比例提成</Option>
                  <Option value={0}>不提成</Option>
                </Select>
                :
                <div>{text === 1 ? '固定提成' : text === 2 ? '比例提成' : '-'}</div>
              }
            </div>
          </div>
        )
      },
    }, {
      title: '提成',
      dataIndex: 'commissNum',
      align: 'left',
      width: '17%',
      render(text, record) {
        return(
          <div>
            <div>
              {
                record.isEdit ?
                <div style={{position: 'relative'}}>
                  <InputNumber 
                  min={0} 
                  size="large" 
                  value={text} 
                  style={{width: '160px'}} 
                  onChange={(e) => changeHandleNumber(e, record)}
                  max={record.commissType === 1 ? 10000 : 100}
                  disabled={record.commissType === 0}
                  ></InputNumber>
                  <span className='ainier-span2'>
                    {record.commissType === 0 ? '-' : record.commissType === 1 ? '元' : '%'}
                  </span>
                </div>
                :
                <div>{record.commissType === 0 ? '-' : record.commissType === 1 ? text+'元' : text+'%'}</div>
              }
            </div>
          </div>
        )
      },
    }, {
      title: '更新时间',
      dataIndex: 'updateTime',
      align: 'left',
      width: '23%',
      render(text, item) {
        return (
          <div style={{position: 'relative'}}>
            <span className={style.pad20}>{text === 0 ? '--' : moment(text*1000).format('YYYY-MM-DD')}</span>
            <DeleteBtn editItem={editItem} item={item}></DeleteBtn>
          </div>
        )
      },
    }]

    const { edit, batch, del, add} = this.props
    return (
      <div>
        <div className={style.cardhead + ' flex'}>
          <div className='item'>
            <Row>
              <Col span={6}>
                <Input 
                size="large"
                placeholder='卡名称'
                style={{width: '80%'}} 
                value={this.state.name}
                prefix={<i style={{color: '#ccc', fontSize: '14px'}} className='iconfont icon-chazhao'></i>} 
                onChange={(e) => this.setState({name: e.target.value})}
                >
                </Input>
              </Col>
              <Col span={6}>
                <span style={{width: '30%', textAlign: 'right', marginRight: '12px', color: '#333'}}>卡类型</span>
                <Select size='large' style={{width: '70%'}} placeholder='全部类型' value={this.state.type} onChange={(e) => this.setState({type: e})}>
                  <Option value={1}>充值卡</Option>
                  <Option value={2}>计次卡</Option>
                </Select>
              </Col>
              <Col span={6}>
                <Button type='primary' size='large' style={{marginRight: '24px'}} onClick={this.search}>查询</Button>
                <Button size='large' onClick={this.reflsh}>重置</Button>
              </Col>
            </Row>
          </div>
          <div className={style.rightc}>
            {
              add &&
              <Button size="large" type="primary" onClick={this.addItem}><i className='iconfont icon-tianjia'></i>{add === 'product' ? '添加产品' :  '添加项目'}</Button>
            }
            {
              edit &&
              <Button size="large" type="primary" onClick={this.editAll}><i className='iconfont icon-bianji'></i> 编辑</Button>
            }
            {
              batch &&
              <Button size="large" type="primary" onClick={this.setSelect}><i className='iconfont icon-shezhi1'></i>批量设置</Button>
            }
            {
              del &&
              <Button size="large" type="primary" onClick={this.delItem}><i className='iconfont icon-shanchu'></i>删除</Button>
            }
          </div>
        </div>
        <div className='meterComboWrap'>
          <Table
          bordered={true}
          dataSource={this.state.dataSource} 
          columns={columns}
          onChange={this.handlePageChange}
          pagination={{
            pageSize: 10,
            current: this.state.current,
            total: this.state.total,
          }}
          rowSelection={{
            onSelect: this.onSelect,
            onSelectAll: this.onSelectAll,
            selectedRowKeys: this.state.checkedList.map(v => v.id),
          }}
          ></Table>
        </div>
        {
          this.state.dataSource.filter(v => v.isEdit).length > 0 &&
          <Tabbar>
            <div className={style.tabbar+ ' flex'}>
              <div className='item'></div>
              <Button size='large' type='primary' onClick={save} style={{width: '88px'}}>保存</Button>
            </div>
          </Tabbar>
        }
        <Modal
          title="批量设置"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={() => {
            this.setState({visible: false})
            this.reset()
          }}
          width={570}
        >
         {
           this.state.visible &&
           <div>
             <Row>
              <Col style={{textAlign: 'right', lineHeight: '40px', paddingRight: '14px'}} span={5}>提成类型</Col>
              <Col span={19}>
              <Select style={{width: '350px' }} placeholder='选择类型' size='large' onChange={(e) => this.setState({commomType: e})}>
                  <Option value={1}>固定提成</Option>
                  <Option value={2}>比例提成</Option>
                  <Option value={0}>不提成</Option>
                </Select>
              </Col>
             </Row>
             <Row style={{marginTop: '40px'}}>
              <Col style={{textAlign: 'right', lineHeight: '40px', paddingRight: '14px'}} span={5}>提成</Col>
              <Col span={19}>
                <div style={{position: 'relative'}}>
                  <InputNumber 
                  min={0} 
                  size="large"  
                  style={{width: '350px'}} 
                  onChange={(e) => this.setState({commomNum: e})}
                  max={this.state.commomType === 1 ? 10000 : 100}
                  disabled={this.state.commomType === 0}
                  ></InputNumber>
                  <span className={style.span}>
                    {this.state.commomType === 0 ? '-' : this.state.commomType === 1 ? '元' : '%'}
                  </span>
                </div>
              </Col>
             </Row>
           </div>
         }
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