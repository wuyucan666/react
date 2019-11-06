import React, { Component } from 'react'
import CommonTable from 'components/CommonTable/index'
import { connect } from 'dva'
import { Button,Modal,InputNumber,Select,message} from "antd"
import tableConfig from './tableConfig'
import services from "../../../services"
// import debounce from 'loadsh/debounce'
// const Search=Input.Search
const Option=Select.Option

class Index extends Component {
  constructor(props){
    super(props)
    this.state={
      visible:false,
      loading:false,
      result:[],
      costId:null,
      cost:{
        averageCost:'--',
      },
      after:'',
    }
    // this.onSearch=debounce(this.onSearch,500)
  }
  showModal(){
    this.setState({
      visible:true,
      cost:{
        averageCost:'--',
      },
      after:'',
    })
  }
  hideModal(){
    this.setState({
      visible:false,
      cost:{
        averageCost:'--',
      },
      after:'',
    })
  }
  adjustSubmit(){
    const {cost,after}=this.state
    const {dispatch}=this.props
    if(cost.inventoryId){
      if (after && after !== ""||after===0) {
        if (!/^[0-9]+\.{0,1}[0-9]{0,1}$/.test(after)) {
          message.warn("只能输入一位小数的正数！")
        }else{
          services.costAdjustment({
            keys : {
              name: 'store/inventory/cost-detail',
              id:cost.inventoryId,
            },
            data:{
              cost:after,
            },
          }).then((res)=>{
            if(res.code==='0'){
              message.success('成本调整成功')
              this.setState({
                cost:{
                  averageCost:'--',
                },
                after:'',
                visible:false,
              })
              dispatch({
                type: 'table/getData',
                payload: {new:true},
              })
            }
          })
        }
      }else{
        message.warn('请输入调整后成本')
      }
    }else{
      message.warn('请选择产品')
    }
  }
  popupScroll = (e) => {
    // e.persist()
    let target = e.target
    if (target.scrollTop + target.offsetHeight === target.scrollHeight) {
      const {page, totalPage, value} = this.state
      if(page < totalPage){
        this.setState({
          page: page + 1,
        },()=>{
          this.getResult(value, true)
        })
      }
    }
  }
  onSearch = (value) => {
    this.setState({page: 1, result: []},()=>{
      this.getResult(value)
    })
  }
  /**
   * 搜索会员
   */
  getResult = (value, isScroll) => {
    let where={}
    if(value){
      where={productName:value}
    }
    this.setState({loading: true})
    services.LIST({
      keys : {
        name: 'product/selector/warehouse',
      },
      data:{
        q: {where},
      },
    }).then(res => {
      console.log('hhhhhhh',res)
      this.setState({
        result:res.list,
        loading:false,
      })
      // this.setState((prevState => ({
      //   value,
      //   result: isScroll ? prevState.result.concat(res.list) : res.list,
      //   totalPage: res.totalPage,
      //   loading: false,
      // })))
    })
  }
  getOrder(value){
    // console.log('type',typeof(this.state.type))
    // if(this.state.type===6){
    //   services.LIST({keys:{name:'product/selector/warehouse'},data:{q:{where:{}}}}).then(res=>{
        // this.setState((prevState => ({
        //   order: isScroll ? prevState.order.concat(res.list) : res.list,
        // })))
        // console.log('sdfCHSA',res)
        // this.setState({
        //   order:res.list,
        // })
      // })
    // }
    // this.setState({
    //   orderValue:value,
    // })
  }
  setMember = (costId) => {
    const {result} = this.state
    const cost = result.find((_) => _.inventoryId === Number(costId))
    this.setState({cost})
  }
  render() {
    const {visible,loading,result,cost,after}=this.state
    console.log('ave',cost)
    tableConfig.screen.moreContent = (
      <div style={{ display: "flex" }}>
        <Button
          style={{ width: "120px", margin: "0 24px 0 20px", height: '40px' }}
          type="primary"
          onClick={this.showModal.bind(this)}
        >
          新建调整
        </Button>
      </div>
    )
    return (
      <div>
        <CommonTable
          name='store/inventory/cost-detail'
          tableConfig={tableConfig}
          // onTableChange={this.onTableChange}
          New
        >
        </CommonTable>
        {visible&&<Modal
        width='375px'
        title="调整成本"
        visible={visible}
        onOk={this.adjustSubmit.bind(this)}
        onCancel={this.hideModal.bind(this)}
        okText="发布"
        cancelText="取消"
        maskClosable={false}
        >
        <div>
         <div style={{paddingBottom:'40px'}}>
         <Select
         size="large"
         className="item"
         showSearch
         loading={loading}
         defaultActiveFirstOption={false}
         showArrow={false}
         allowClear
         filterOption={false}
         getPopupContainer={trigger => trigger.parentNode}
         onSearch={this.onSearch.bind(this)}
         onChange={this.setMember.bind(this)}
         onFocus={this.onSearch.bind(this)}
        //  onPopupScroll={this.popupScroll}
         style={{fontSize:'14px',display:'block'}}
         placeholder='请输入产品名称'>
         {result.map((_,index) => (
                      <Option key={index}  value={_.inventoryId}><a>{_.productName}</a> － {_.specification} － {_.warehouseName}</Option>
                    ))}
         </Select></div>
         <div style={{paddingBottom:'40px'}}>当前平均成本:{ cost?cost.averageCost:'--'}</div>
         <div>调整后成本：<InputNumber style={{marginRight:'10px'}} onChange={(v)=>this.setState({after:v})} value={after}></InputNumber>元</div>
        </div>
        </Modal>}
      </div>
    )
  }
}
export default connect()(Index)
