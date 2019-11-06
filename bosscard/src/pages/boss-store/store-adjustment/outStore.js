import React,{ Component } from 'react'
// import CommonTable from '../../../components/CommonTable/index'
import {connect}   from 'dva'
import styles from './styles.less'
import AddProduct from '../../../components/MenuTable/addProduct'
import {Button,Form,Icon,Table,Input,InputNumber,Select,message} from 'antd'
import services from 'services'
import router from 'umi/router'
// const FormItem = Form.Item
const Option = Select.Option
const { Column } = Table

class  outStore extends Component{
     constructor(){
         super()
         this.state={
             selectList:[],
             totalCount:0,
             totalPrice:0,
             typeId:null,
             typeList:[],
             skin:false,
         }
     }
     //发起请求获取出入库分类
     UNSAFE_componentWillMount(){
        services.storeType({keys: {name: 'erp/stock/types'}, data:{ q:{ where:{ t:2  } }  }}).then(res =>{
             this.setState({
                 typeList:res.list,
             },()=>{
                 console.log(this.state.typeId)
             })
          })
     }
     goBack=()=>{
        router.push('/boss-store/store-adjustment')
     }
     getData=(value)=>{
        this.setState({
            selectList:value.map(item=>{
                item.numbers=1
                item.remark='无'
                return item
            }),
        },()=>{
            this.totalComputer()
        })
     }
     //刷新列表
     renovate=()=>{
         this.setState({
             skin:true,
             selectList:[],
         },()=>{
            window.timer =setTimeout(()=>{
                this.totalComputer()
                 this.setState({
                     skin:false,
                 })
             },1000)
         })
     }
     componentDidMount(){
        // var ul=document.getElementsByClassName('ant-menu-horizontal')[1]
        // ul? ul.style.display='none':null

     }
     //删除定时器
     componentWillUnmount(){
         clearTimeout(window.timer)
        //  var ul=document.getElementsByClassName('ant-menu-horizontal')[1]
        //  ul? ul.style.display='block':null
     }
     //删除单个商品
     delProduct=(id)=>{
       let selectList=this.state.selectList.filter(item=>{
          return  item.id===id ? false : true
       })
       this.setState({
           selectList,
       },()=>{
           this.totalComputer()
       })
     }
     //改变价格
     //改变数量
     changeNumber=(id,val)=>{
      let  selectList=this.state.selectList.map(item=>{
             item.id === id ? item.numbers=val : null
             return item
      })
      this.setState({
           selectList,
      },()=>{
        this.totalComputer()
      })

     }
     //计算总数量和总价格
     totalComputer=()=>{
         var totalCount=0,totalPrice=0
         this.state.selectList.forEach(item=>{
              totalCount+=item.numbers
              totalPrice+=(item.numbers)*(item.avgPrice)
         })
         this.setState({
              totalCount,
              totalPrice,
         })
     }
     //添加备注
     addRemark=(id,o,val)=>{
        console.log(val)
       let selectList =this.state.selectList.map(item=>{
            item.id===id ? item.remark=val : null
            return item
       })
       this.setState({
           selectList,
       })
     }
     //改变库存种类
     changeType=(val)=>{
         this.setState({
            typeId:val,
         })
     }
     //出库
     toOutStore=()=>{

      const { dispatch } =this.props
      let selectList =  this.state.selectList.filter(item=>{
             return   item.numbers===0 ?  false : true
         })
     if( this.state.typeId === null ) {
         message.info('请选择库存分类')
         return
        }

        if(selectList.length===0){
            message.info('出库商品数量不能为零')
            return
        }
      let  addList =selectList.map(item=>{
             return   {
                        id:item.productId,
                        warehouseId: item.warehouseId,
                        goodsNum:item.numbers,
                        goodsPrice:item.avgPrice,
                        totalPrice:(item.avgPrice*1)*(item.numbers),
                        remark:item.remark,
                      }
         })
     let serverObj={
            product:addList,
            remark:this.refs.remark.value,
            typeId:this.state.typeId,
         }
         dispatch({
             type:'storeAdjustment/outStore',
             payload:{...serverObj},
         })
         setTimeout(()=>{
            this.setState({
                dataList:[],
             },()=>{
                message.success('出库成功', 3)
                router.push('/boss-store/store-adjustment')
             })
        },0)
     }
     render(){

         return (<div className="inStore" >
                        <Form layout='inline'>
                            <div className={styles.addBtn}>
                            <Button  onClick={ this.goBack   }  size='large'> <Icon type="left" /> 返回列表</Button>
                            {
                                <Select  onChange={ this.changeType }  placeholder="请选择出库分类"  style={{ width: 200 }}  size='large'>
                                        <Option  key="1" value="11" >门店耗材</Option>
                                        <Option  key="2" value="10" >调拨出库</Option>
                                        <Option  key="3" value="13" >盘亏出库</Option>
                                        <Option  key="4" value="14" >报损出库</Option>
                                </Select>
                                }
                            <Icon type="sync" spin={ this.state.skin } style={{ fontSize: '16px', color: '#4aacf7',position:'absolute',right:26 }} onClick={ this.renovate }  />
                            </div>
                            <div className={styles.addTable}>
                            <Table
                                dataSource={ this.state.selectList }
                                pagination={false}
                                rowKey={record => record.id}
                            >
                                <Column
                                title="序号"
                                dataIndex="index"
                                key="index"
                                align='left'
                                width='5%'
                                render={(text,record,index) => index + 1}
                                />
                                <Column
                                title="商品名称"
                                dataIndex="name"
                                key="name"
                                width='112px'
                                align='left'
                                render={(text,record,index) => {
                                  return <div style={{margin:'0px',width:'112px', wordWrap:'break-word',wordBreak:'break-all'}}>
                                    {text}
                                  </div>
                                }}
                                />
                                <Column
                                title="规格"
                                dataIndex="spec"
                                key="spec"
                                align='left'
                                width='8%'
                                />
                                <Column
                                title="编码"
                                dataIndex="code"
                                key="code"
                                align='left'
                                width='112px'
                                render={(text,record,index) => {
                                  return <div style={{margin:'0px',width:'112px', wordWrap:'break-word',wordBreak:'break-all'}}>
                                    {text}
                                  </div>
                                }}
                                />
                                <Column
                                title="仓库"
                                dataIndex="warehouseName"
                                key="warehouseName"
                                align='left'
                                width='14%'
                                // render={(text,record) => (
                                //     <Select defaultValue={record.warehouse_id} placeholder="选择仓库" style={{ width: 230 }}  size='large'>
                                //     {
                                //         warehouseList.map(item => (
                                //         <Option key={item.warehouseId} value={item.warehouseId}>{item.warehouseName}</Option>
                                //         ))
                                //     }
                                //     </Select>
                                // )}
                                />
                                <Column
                                title="库存"
                                dataIndex="number"
                                key="number"
                                align='left'
                                width='8%'
                                />
                                <Column
                                title="平均成本"
                                dataIndex="avgPrice"
                                key="avgPrice"
                                align='left'
                                width='8%'
                                />
                                <Column
                                title="数量"
                                dataIndex="numbers"
                                key="numbers"
                                align='left'
                                width='8%'
                                render={(text,record) => (
                                    <InputNumber onChange={this.changeNumber.bind(this,record.id)} min={0}   precision={0}  max={record.number}  defaultValue={record.numbers} size='large' style={{width:62}}/>
                                )}
                                />
                                <Column
                                title="合计"
                                dataIndex="total"
                                key="total"
                                align='left'
                                width='8%'
                                render={(text,record)=>(
                                    <div> {  (record.avgPrice*1 )*( record.numbers ) } </div>
                                )}
                                />
                                <Column
                                title="备注"
                                dataIndex="remark"
                                key="remark"
                                align='left'
                                width='20%'
                                render={(text,record) =>(

                                    <div style={{position:'relative'}}>
                                        <Input defaultValue={record.remark} size='large' style={{width:230}} value={ text }   onChange = { e => this.addRemark(record.id,'remark',e.target.value) } />
                                    <div className='rowbtns' style={{position:'absolute',right:0,top:5}}>
                                        <div  onClick={ this.delProduct.bind(this,record.id) } id={styles.del} className='animated zoomIn faster' style={{margin: '-2px 0',borderRadius: '50%'}}>
                                        <i className="iconfont icon-shanchu"></i>
                                        </div>
                                    </div>
                                    </div>
                                   )
                            }
                                />
                            </Table>
                            </div>
                            <div   className={ styles.zl_adjustment_foot  } >
                                <p> 共<span> { this.state.selectList.length} </span>条记录</p>


                            </div>
                        </Form>
                     <div className={ styles.zl_Store } >
                        <label htmlFor="inStoreDes" >备注  <input type="text"  id="inStoreDes"  ref="remark"   /> </label>
                        <div >
                             <div> 商品数：<span> { this.state.totalCount } </span> 金额： <span>￥ { this.state.totalPrice }</span>  <Button  size='large'   style={ {width:'88px',textAlign:'center' } }   type="primary"  onClick={ this.toOutStore }  >出库</Button></div>
                        </div>
                    </div>
                     <AddProduct     selectList={ this.state.selectList }   addproduct={ this.getData }   api={ { getMenu:'storeAdjustment/get',getData:'storeAdjustment/getData' }  }  />
                 </div>)
     }
}
function mapStateToProps(state) {
    const {  productTypeList , dataList } = state.storeAdjustment
    return { productTypeList , dataList }
  }
export default connect(mapStateToProps)(outStore)
