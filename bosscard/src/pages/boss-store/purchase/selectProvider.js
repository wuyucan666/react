import React,{Component} from 'react'
import {Table,Modal } from 'antd'
import style from  './style.less'

 class SelectProvider extends Component {
  constructor(props){
    super(props)
    this.state={
      selectPro:{},
      selectVisible:true,
      selected:[],
      activeIndex:null,
    }
  }
  hideSelectMoadal(){
    this.setState({
      selectVisible:false,
    })
    this.props.onCancel()
   }
   selectPrivider(){
     const {selectPro}=this.state
     this.props.onOk(selectPro)
      this.hideSelectMoadal()
   }
   handleClick(index){
     const {activeIndex}=this.state
     if(activeIndex===index){
      this.setState({
        activeIndex:null,
        selectPro:'',
        selected:[],
      })
     }else{
      this.setState({
        activeIndex:index,
        selectPro:this.props.data[index],
        selected:[this.props.data[index]],
      })
     }
   }
  render() {
    const {data}=this.props
    const {selected,activeIndex}=this.state
    const columns = [
      {
        title: '供应商名称',
        dataIndex: 'name',
      },
    ]
    // rowSelection object indicates the need for row selection
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({
          selectPro:selectedRows[0],
          selected:selectedRows,
          activeIndex:data.length===(selectedRowKeys.length-1)&&data.length!==1?'':selectedRowKeys[selectedRowKeys.length-1],
        })
      },
      type:'checkbox',
      hideDefaultSelections:true,
      selectedRowKeys:activeIndex>=0?[activeIndex]:[],
    }
    return (
        <Modal
        maskClosable={false}
        title='选择供应商'
        visible={this.state.selectVisible}
        cancelText='关闭'
        onOk={this.selectPrivider.bind(this)}
        onCancel={this.hideSelectMoadal.bind(this)}
        okButtonProps={{disabled:selected.length?false:true}}
        >
        <div className={style.select_provider}>
        <Table onRow={(record,index)=>{return {
      onClick:this.handleClick.bind(this,index), // 点击行
    }}} size='middle' scroll={{y:280}} bordered pagination={false} rowSelection={rowSelection} columns={columns} dataSource={data} />
        </div>
        </Modal>
    )
  }
}
export default SelectProvider
