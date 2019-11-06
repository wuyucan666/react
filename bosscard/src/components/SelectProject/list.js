import { Component } from 'react'
import { Table, Tooltip, message } from 'antd'

/**
 * 右侧列表
 */
export default class List extends Component {
  constructor(props) {
    super(props)
    this.state = { selected: [] }
    this.onScrollEvent = this.onScrollEvent.bind(this)
  }

  onSelect(item, checked) {
    const { New } = this.props
    if (New) {
      if (item.stock === 0 && item.productId) {
        message.error('库存为0的产品不可选择')
        return false
      }
    }
    const checkeds = [...this.props.selected].map(_ => ({ ..._ }))
    if (!checked) {
      checkeds.splice(checkeds.findIndex(_ => _[this.props.idType] === item[this.props.idType]), 1)
    } else {
      return this.props.onChange([...checkeds, item])
    }
    this.props.onChange(checkeds)
  }

  rowClick = (item) => {
    if (item.isSystem === 1) {
      return 
    }
    let checkeds = [...this.props.selected].map(_ => ({ ..._ }))
    console.log('点击行', item, checkeds)
    let idx = checkeds.findIndex(v => v[this.props.idType] === item[this.props.idType])
    if (idx > -1) {
      checkeds.splice(idx, 1)
    } else {
      checkeds.push(item)
    }
    this.props.onChange(checkeds)
  }

  onSelectAll(checked, items, dels) {
    const { New } = this.props
    if (New) {
      let canSelect = true
      items.forEach(item => {
        if (item.stock === 0 && item.productId) {
          canSelect = false
        }
      })
      if (!canSelect) {
        message.error('库存为0的产品不可选择')
        return false
      }
    }
    const checkeds = [...this.props.selected].map(_ => ({ ..._ }))
    if (!checked) {
      dels.forEach(item => {
        const index = checkeds.findIndex(_ => _[this.props.idType] === item[this.props.idType])
        if (index >= 0) {
          checkeds.splice(checkeds.findIndex(_ => _[this.props.idType] === item[this.props.idType]), 1)
        }
      })
    } else {
      items.forEach(e => {
        const index = checkeds.findIndex(_ => _[this.props.idType] === e[this.props.idType])
        if (index !== -1) {
          checkeds.splice(index, 1)
        }
      })
      return this.props.onChange([...checkeds, ...items])
    }
    this.props.onChange(checkeds)
  }

  onScrollEvent() {
    var tableBody = this.contentNode.querySelector('.ant-table-body')
    // console.log('tableBody',tableBody.scrollTop,tableBody.scrollHeight-tableBody.clientHeight)
    if (tableBody.scrollTop + tableBody.clientHeight >= tableBody.scrollHeight) {
      // console.log('is bottom:')
      this.props.onIsToBottom()
    }
  }

  render() {
    const { list, selected, type, New } = this.props
    const tableStyle = {
      width: 618,
    }
    const columns = [
      {
        dataIndex: this.props.nameType,
        key: '1',
        width: 236,
        title: type === 1 ? '项目名称' : '产品名称',
        align: 'left',
        render(text) {
          return text.length > 10 ? (
            <Tooltip title={text}>{text.slice(0, 9)}...</Tooltip>
          ) : (
              <div style={{ width: '200px' }}>{text}</div>
            )
        },
      },
      {
        dataIndex: 'commodityCode',
        key: '2',
        width: 166,
        align: 'left',
        title: type === 1 ? '项目编码' : '产品编码',
        render(text) {
          return <div style={{ width: '150px' }}>{text}</div>
        },
      },
      {
        dataIndex: 'unitName',
        key: '3',
        width: 72,
        align: 'left',
        title: '单位',
      },
      {
        dataIndex: type === 1 ? 'priceTem' : 'sellingPriceTem',
        key: '4',
        width: 96,
        align: 'left',
        title: '售价',
      },
      {
        dataIndex: 'stock',
        key: '5',
        align: 'left',
        width: 100,
        title: '库存',
      },
    ]

    return <div ref={node => this.contentNode = node} onScrollCapture={() => this.onScrollEvent()}>
      <Table
        pagination={false} scroll={{ y: 352 }}
        style={tableStyle} size='middle' dataSource={list.map(_ => ({ ..._, key: _[this.props.idType] }))}
        rowSelection={{
          selectedRowKeys: selected.map(_ => _[this.props.idType]),
          onSelect: this.onSelect.bind(this),
          onSelectAll: this.onSelectAll.bind(this),
          getCheckboxProps: record => ({
            disabled: record.isSystem === 1,
          }),
        }}
        onRow={record => {
          return {
            onClick: () => { this.rowClick(record) },
          }
        }}
        columns={type === 2 ?
          (New ? columns.filter(v => v.key !== '3') : columns.filter(v => v.key !== '5'))
          : columns.filter(v => v.key !== '3' && v.key !== '5' && v.key !== '2')}
      ></Table>
    </div>
  }

}
