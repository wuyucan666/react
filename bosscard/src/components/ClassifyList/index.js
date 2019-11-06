import { Modal, Table }  from 'antd'
import { Component } from 'react'
import { connect } from 'dva'
import services from '../../services'

const ClassifyList = (
  class extends Component {

    state = {
      data:[],
      selectItem: [],
    }

    handleSubmit() {
      const { onOk, hideModal, defaultItem } = this.props
      let arr = [...this.state.selectItem]
      arr.map((v,j) => {
        let idx = defaultItem.findIndex(k => k.categoryId === v.categoryId)
        if(idx !== -1) {
          arr[j] = defaultItem[idx]
        }
        return v
      })
      onOk(arr)
      hideModal()
    }
    
    componentDidMount () {
      const { name, defaultItem } = this.props
      if(defaultItem) {
        this.setState({
          selectItem: defaultItem,
        })
      }
      services.list({data:{},keys:{'name': name }}).then(res => {
        const { list } = res
        list.map((e,i) => {
          return e.key = i+1
        }),
        this.setState({
          data: list,
        })
      })
    }

    render() {
      
      const { title, visible, hideModal, defaultItem } = this.props
     
      const columns = [{
        title: title,
        dataIndex: 'categoryName',
      }]

      const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
          console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
          this.setState({
            selectItem: selectedRows,
          })
        },
        getCheckboxProps: record => ({
          disabled: record.name === 'Disabled User', 
          name: record.name,
          defaultChecked: defaultItem && !!defaultItem.filter(_ => record.categoryId === _.categoryId).length,
        }),
      }
      
      return (
        <Modal
        title= { '选择' + title }
        visible={visible}
        onOk={this.handleSubmit.bind(this)}
        onCancel={hideModal}
        >
          <Table 
          style={{marginBottom: 20}}
          rowSelection={rowSelection} 
          columns={columns} 
          scroll={{ y: 400 }}
          dataSource={this.state.data} 
          bordered pagination={false}/>
        </Modal>
      )
    }
  }
) 

export default connect()(ClassifyList)