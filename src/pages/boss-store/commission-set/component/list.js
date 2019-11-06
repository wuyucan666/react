import {Component} from 'react'
import {Table, Tooltip} from 'antd'

/**
 * 右侧列表
 */
export default class List extends Component {
  constructor (props) {
    super(props)
    this.state = {selected: []}
  }

  onSelect (item, checked) {
    const checkeds = [...this.props.selected].map(_ => ({..._}))
    if (!checked) {
      checkeds.splice(checkeds.findIndex(_ => _[this.props.idType] === item[this.props.idType]), 1)
    } else {
      return this.props.onChange([...checkeds, item])
    }
    this.props.onChange(checkeds)
  }

  onSelectAll (checked, items, dels) {
    const checkeds = [...this.props.selected].map(_ => ({..._}))
    if (!checked) {
      dels.forEach(item => {
        const index = checkeds.findIndex(_ => _[this.props.idType] === item[this.props.idType])
        if (index >= 0) {
          checkeds.splice(checkeds.findIndex(_ => _[this.props.idType] === item[this.props.idType]), 1)
        }
      })
    } else {
      return this.props.onChange([...checkeds, ...items])
    }
    this.props.onChange(checkeds)
  }
  
  render (){
    const {list, selected, type} = this.props

    return <div>
    <Table 
    pagination={false} 
    scroll={{ y: 358 }} 
    size='middle' 
    dataSource={list.map(_ => ({..._, key: _[this.props.idType]}))} 
    rowSelection={{
      selectedRowKeys: selected.map(_ => _[this.props.idType]), 
      onSelect: this.onSelect.bind(this), 
      onSelectAll: this.onSelectAll.bind(this)}} 
      columns={
      [
        {
          dataIndex: this.props.nameType,
          key: '1',
          width: 170,
          align: 'left',
          title: type === 1 ? '产品名称' : '项目名称',
          render (text) {
            return   text.length > 10 ? (
              <Tooltip title={text}>{text.slice(0, 9)}...</Tooltip>
            ) : (
              text
            )
          },
        },
        {
          dataIndex: 'priceTem',
          key: '2',
          width: 150,
          align: 'left',
          title: '单价',
          render (text) {
            return text
          },
        },
      ]
    }
    ></Table>
  </div>
  }
  
}
