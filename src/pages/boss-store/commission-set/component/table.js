import { Component } from 'react'
import { Button, Table, Select, InputNumber, message, Modal, Tooltip } from 'antd'
import {__PRODUCT_TYPE__, __PROJECT_TYPE__} from 'utils/globalConfig'
import PropTypes from "prop-types"
import Tabbar from 'components/Tabbar'
import Selector from 'components/SelectProject'
import Addition from './addition'

import services from 'services'
import moment from 'moment'

import style from './style.less'

const Option = Select.Option

const DeleteBtn = ({ editItem, item, change, delItem, add }) => {
  return (
    <div className='rowbtns' style={{position: 'absolute', right: '20px', top: '0px', float: 'left'}} >
      <div className='animated zoomIn faster' style={{borderRadius: '50%'}}>
        {
          !item.isEdit &&
          <div>
            <Tooltip title='编辑'  onClick={() => editItem(item)}>
              <i className="iconfont icon-bianji"></i>
            </Tooltip>
            {
              add &&
              <Tooltip title='删除' onClick={() => delItem(item)}>
                <i className="iconfont icon-shanchu"></i>
              </Tooltip>
            }
            {
              item.changeId !== 0 &&
              <Tooltip title={item.state === 0 ? '启用' : '停用'}  onClick={() => change(item)}>
              {
                item.state === 0 ?
                <i className="iconfont icon-qiyong"></i>
                :
                <i className="iconfont icon-tingyong"></i>
              }
              </Tooltip>
            }
          </div>
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
    showProduct: false,
    showProject: false,
    showAddition: false,
    setList: [{
      key: 1,
      applicaType: 1, 
      commissType: 0, 
      commissNum: 0, 
      applicaName: '正常',
    },
    {
      key: 2,
      applicaType: 2, 
      commissType: 0, 
      commissNum: 0, 
      applicaName: '毛利≤0',
    },
    {
      key: 3,
      applicaType: 3, 
      commissType: 0, 
      commissNum: 0, 
      applicaName: '赠送',
    }],
  }

  componentDidMount () {
    this.getList()
    const { onRef } = this.props
    if (onRef) {
      onRef(this)
    }
  }

  getList = () => {
    const { name, where } = this.props 
    services.LIST({
      keys: {name},
      data: {q: {where}},
    }).then(res => {
      this.setState({
        dataSource: res.list.map(v => {
          v.temp1 = []
          v.temp2 = []
          v.temp3 = []
          v.key = v.id
          return v
        }),
      })
    })
  }

  editAll = () => {
    this.setState({dataSource: this.state.dataSource.map(v => {
        const commissionInfo = [
          {
            applicaType: 1, 
            commissType: 0, 
            commissNum: 0, 
          },
          {
            applicaType: 2, 
            commissType: 0, 
            commissNum: 0, 
          },
          {
            applicaType: 3, 
            commissType: 0, 
            commissNum: 0, 
          },
        ]
        let itemInfo = []
        itemInfo = commissionInfo.map(_ => {
          let result = v.commissionInfo.filter(e => e.applicaType === _.applicaType)
          if(result.length > 0) {
            _ = result[0]
          }
          return _
        })
        itemInfo = itemInfo.concat([])
        return {...v, isEdit: true, commissionInfo: [...itemInfo]}
      }),
    })
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
    }1
  }

  onSelectAll = (checked, items) => {
    if(checked) {
      this.setState({checkedList: items})
    }else {
      this.setState({checkedList: []})
    }
  }

  reset = () => {
    this.setState({
      setList: [{
        key: 1,
        applicaType: 1, 
        commissType: 0, 
        commissNum: 0, 
        applicaName: '正常',
      },
      {
        key: 2,
        applicaType: 2, 
        commissType: 0, 
        commissNum: 0, 
        applicaName: '毛利≤0',
      },
      {
        key: 3,
        applicaType: 3, 
        commissType: 0, 
        commissNum: 0, 
        applicaName: '赠送',
      }],
    })
  }

  handleOk = () => {
    let result = this.state.setList.filter(v => v.commissType !== 0 && v.commissNum === 0)
    if(result.length > 0) {
      message.error('如设置提成类型,提成点不能为0')
      return false
    }
    this.setState({
      visible: false,
      dataSource: this.state.dataSource.map(v => {
        let res = this.state.checkedList.filter(e => e.id === v.id)
        if(res.length > 0) {
          v.commissionInfo = this.state.setList
          v.isEdit = true
        }
        return v
      }),
    })
    this.reset()
  }

  addItem = () => {
    console.log('add')
    const { add } = this.props
    if(add === 'project') {
      this.setState({ showProject: true})
    }else if (add === 'product') {
      this.setState({showProduct: true})
    }else {
      this.setState({showAddition: true})
    }
  }

  hideModal = () => {
    this.setState({
      showProject: false,
      showProduct: false,
      showAddition: false,
    })
  }

  onOk = (e) => {
    const { add } = this.props
    let addList = e.map(v => {
      return {
        id: add === 'project' || add === 'addition' ? v.projectId : v.productId,
        name:  add === 'project' || add === 'addition' ? v.projectName : v.productName,
        state: 1,
        updateTime: 0,
        isEdit: true,
        commissionInfo: [{
          applicaType: 1, 
          commissType: 0, 
          commissNum: 0, 
        },
        {
          applicaType: 2, 
          commissType: 0, 
          commissNum: 0, 
        },
        {
          applicaType: 3, 
          commissType: 0, 
          commissNum: 0, 
        }],
      }
    })
    let can = true
    addList.forEach(v => {
      if(this.state.dataSource.filter(_ => _.id === v.id).length > 0) {
        can = false
        message.error('添加的项目已存在')
        return false
      }
    })
    if(can) {
      this.setState({
        dataSource: this.state.dataSource.concat(addList),
      })
    }
  }

  delItems = () => {
    if(this.state.checkedList.length === 0 || this.state.dataSource.length === 0) {
      message.error('请选择要删除的项!')
      return false
    }
    const { name } = this.props
    let arr = this.state.checkedList.map(v => (v.changeId))
    services.DELETE({
      keys: {name, id: 1},
      data: {id: arr},
    }).then(res => {
      if(res.success) {
        message.success('删除成功!')
        this.setState({checkedList: []}) //清空选择类别
        this.getList()
      }
    })
  }

  queEdit = () => {
    this.setState({dataSource: this.state.dataSource.map(v => ({...v, isEdit: false}))})
  }


  render() {

    const editItem = (item) => {
      let cur = this.state.dataSource.filter(v => v.id === item.id)
      let commissionInfo = [
        {
          applicaType: 1, 
          commissType: 0, 
          commissNum: 0, 
        },
        {
          applicaType: 2, 
          commissType: 0, 
          commissNum: 0, 
        },
        {
          applicaType: 3, 
          commissType: 0, 
          commissNum: 0, 
        },
      ]
      commissionInfo = commissionInfo.map(v => {
        let result = cur[0].commissionInfo.filter(e => e.applicaType === v.applicaType)
        if(result.length > 0) {
          v = result[0]
        }
        return v
      })
      cur = cur.map(e => ({...e, isEdit: !e.isEdit, commissionInfo}))[0]
      this.setState({
        dataSource: this.state.dataSource.map(v => {
          if(v.id === cur.id) {
            v = cur
          }
          return v
        }),
      })
    }

    const change = (item) => {
      const { name } = this.props
      services.UPDATE({
        keys: {name: name, id: item.changeId},
        data: {state: item.state === 0 ? 1 : 0},
      }).then(res => {
        if(res.success) {
          message.success('操作成功')
          this.getList()
        }
      })
    }

    const save = () => {
      //结束编辑
      const { name, where } = this.props 
      let obj = this.state.dataSource.filter(_ => _.isEdit).map(v => {
        return {
          ...where,
          itemId: v.id,
          state: v.state,
          commissionInfo: v.commissionInfo.filter(v => v.commissType !== 0),
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
    }

    const delItem = (item) => {
      const {name} = this.props
      services.DELETE({
        keys: {name, id: item.changeId},
        data: {id: [item.changeId]},
      }).then(res => {
        if(res.success) {
          message.success('删除成功!')
          let arr = this.state.checkedList
          arr.splice(this.state.checkedList.findIndex(v => v.changeId === item.changeId),1)
          this.setState({
            checkedList: arr,
          })
          this.getList()
        }
      })
    }

    const changeHandle = (e, index, item) => {
      let cur = this.state.dataSource.filter(v => v.id === item.id)[0]
      cur.commissionInfo[index].commissType = e
      this.setState({
        dataSource: this.state.dataSource.map(v => {
          if(v.id === cur.id) {
            if(e === 0) {
              cur.commissionInfo[index].commissNum = 0
            }
            v = cur
          }
          return v
        }),
      })
    }

    const changeHandleNumber = (e, index, item) => {
      if(item.commissionInfo[index].commissType === 1) {
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
      let cur = this.state.dataSource.filter(v => v.id === item.id)[0]
      cur.commissionInfo[index].commissNum = e
      this.setState({
        dataSource: this.state.dataSource.map(v => {
          if(v.id === cur.id) {
            v = cur
          }
          return v
        }),
      })
    }
    
    const batchHandle = (e, item, key) => {
      item[key] = e
      this.setState({
        setList: this.state.setList.map(v => {
          if(v.applicaType === item.applicaType) {
            v = item 
          }
          return v
        }),
      })
    }

    const productProps = {
      type: __PRODUCT_TYPE__,
      visible: this.state.showProduct,
      selected: [],
      onCancel: this.hideModal,
      onOk: this.onOk,
    }

    const projectProps = {
      type: __PROJECT_TYPE__,
      visible: this.state.showProject,
      selected: [],
      onCancel: this.hideModal,
      onOk: this.onOk,
    }

    const additionProps = {
      visible: this.state.showAddition,
      selected: [],
      onCancel: this.hideModal,
      onOk: this.onOk,
    }


    const columns = [{
      title: this.props.rowTit ? this.props.rowTit : '分类名称',
      dataIndex: 'name',
      align: 'left',
      className: 'table-padding0',
      render(text) {
        return <div className={style.pad20}>{text}</div>
      },
    }, {
      title: '状态',
      dataIndex: 'state',
      align: 'left',
      className: 'table-padding0',
      render(text) {
        return <div className={style.pad20}>
          {
            text === 0 ? 
            <span className={style.worng}>停用</span>
            :
            <span className={style.right}>启用</span>
          }
        </div>
      },
    }, {
      title: '适用类型',
      dataIndex: 'temp1',
      align: 'left',
      className: 'table-padding0',
      render(text, record) {
        return (
          <div className={style.row}>
            {
              record.commissionInfo.length > 0 ?
              record.commissionInfo.map((v,i) => {
                return <div key={i}><div>{v.applicaType === 1 ? '正常' : v.applicaType === 2 ? '毛利≤0' : '赠送'}</div></div>
              })
              : <div style={{padding: '0 20px'}}>--</div>
            }
          </div>
        )
      },
    },{
      title: '提成类型',
      dataIndex: 'temp2',
      align: 'left',
      className: 'table-padding0',
      render(text, record) {
        return (
          <div className={style.row}>
            {
              record.commissionInfo.length > 0 ?
              record.commissionInfo.map((v,i) => {
                return (
                  <div key={i}>
                    {
                      record.isEdit ? 
                      <Select style={{width: '160px', color: v.commissType === 0 ? '#ccc' : '#333'}} value={v.commissType} placeholder='选择类型' size='large' onChange={(e) => changeHandle(e, i, record)}>
                        <Option value={1}>固定提成</Option>
                        <Option value={2}>销售比例提成</Option>
                        <Option value={3}>毛利比例提成</Option>
                        <Option value={0}>不提成</Option>
                      </Select>
                      :
                      <div>{v.commissType === 1 ? '固定提成' : v.commissType === 2 ? '销售比例提成' : v.commissType === 3 ? '毛利比例提成' : '不提成'}</div>
                    }
                  </div>
                )
              })
              : <div style={{padding: '0 20px'}}>--</div>
            }
          </div>
        )
      },
    }, {
      title: '提成',
      dataIndex: 'temp3',
      align: 'left',
      className: 'table-padding0',
      render(text, record) {
        return(
          <div className={style.row}>
            {
              record.commissionInfo.length > 0 ?
              record.commissionInfo.map((v,i) => {
                return (
                  <div key={i}>
                    {
                      record.isEdit ?
                      <div style={{position: 'relative'}}>
                        <InputNumber 
                        min={0} 
                        size="large" 
                        value={v.commissNum} 
                        style={{width: '160px'}} 
                        onChange={(e) => changeHandleNumber(e, i, record)}
                        max={v.commissType === 1 ? 10000 : 100} 
                        disabled={v.commissType ===  0}
                        ></InputNumber>
                        <span className='ainier-span'>
                          {v.commissType === 0 ? '-' : v.commissType === 1 ? '元' : '%'}
                        </span>
                      </div>
                      :
                      <div>{v.commissNum}{v.commissType === 0 ? '-' : v.commissType === 1 ? '元' : '%'}</div>
                    }
                  </div>
                )
              })
              : <div style={{padding: '0 20px'}}>--</div>
            }
          </div>
        )
      },
    }, {
      title: this.props.special ? this.props.special : '特殊提成项目数',
      dataIndex: 'specialNum',
      align: 'left',
      className: 'table-padding0',
      render(text) {
        return <div className={style.pad20}>{text}</div>
      },
    }, {
      title: '更新时间',
      dataIndex: 'updateTime',
      align: 'left',
      className: 'table-padding0',
      render(text, item) {
        return (
          <div style={{position: 'relative'}}>
            <span className={style.pad20}>{text === 0 ? '--' : moment(text*1000).format('YYYY-MM-DD')}</span>
            <DeleteBtn editItem={editItem} item={item} change={change} delItem={delItem} add={add}></DeleteBtn>
          </div>
        )
      },
    }]

    const columnsTk = [{
      title: '适用类型',
      dataIndex: 'applicaName',
      align: 'left',
    },{
      title: '提成类型',
      dataIndex: 'commissType',
      align: 'left',
      render(text, record) {
        return (
          <Select style={{width: '160px', color: text === 0 ? '#ccc' : '#333'}}  size='large' placeholder='选择类型' onChange={(e) => batchHandle(e, record, 'commissType')}>
            <Option value={1}>固定提成</Option>
            <Option value={2}>销售比例提成</Option>
            <Option value={3}>毛利比例提成</Option>
            <Option value={0}>不提成</Option>
          </Select>
        )
      },
    },{
      title: '提成',
      dataIndex: 'commissNum',
      align: 'left',
      render(text, record) {
        return (
          <div style={{position: 'relative'}}>
             <InputNumber 
             min={0} 
             value={text} 
             size="large" 
             style={{width: '160px'}} 
             onChange={(e) => batchHandle(e, record, 'commissNum')}
             max={record.commissType === 1 ? 10000 : 100} 
             disabled={record.commissType ===  0}
             ></InputNumber>
              <span className='ainier-span2'>
                {record.commissType === 0 ? '-' : record.commissType === 1 ? '元' : '%'}
              </span>
          </div>
        )
      },
    }]
    const { edit, batch, del, title, add} = this.props
    return (
      <div>
        <div className={style.head + ' flex'}>
          <div>{title}</div>
          <div className='item'>
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
              <Button size="large" type="primary" onClick={this.delItems}><i className='iconfont icon-shanchu'></i>删除</Button>
            }
          </div>
        </div>
        <div className='commission'>
          <Table
          bordered={true}
          pagination={false}
          dataSource={this.state.dataSource} 
          columns={ add ? columns.filter(v => v.dataIndex !== 'specialNum') : columns}
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
          width={795}
        >
         {
           this.state.visible &&
            <Table
              pagination={false}
              dataSource={this.state.setList}
              columns={columnsTk}
            >
            </Table>
         }
        </Modal>

        {
          add === 'project' ?
          <Selector
          {... projectProps}
          ></Selector>
          : (
            add === 'product' ? 
            <Selector
            {... productProps}
            ></Selector>
            :
            <Addition
            {...additionProps}
            ></Addition>
          )
        }
      </div>
    )
  }
}

table.propTypes = {
  title: PropTypes.string,
  edit: PropTypes.bool, //是否显示编辑按钮
  batch: PropTypes.bool, //是否显示批量设置按钮
  add: PropTypes.string, //添加的类型 项目/产品/附加项目
  del: PropTypes.bool, //是否显示删除按钮
}

export default table