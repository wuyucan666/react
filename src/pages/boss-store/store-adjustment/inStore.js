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

class  inStore extends Component{
     constructor(){
         super()
         this.state={
             selectList:[],
             totalCount:0,
             totalPrice:0,
             typeId:null,
             typeList:[],
             skin:false,
             warehouseList:[],
             noButtonClick:false, //用于控制按钮是否被点击
         }
     }
     //发起请求获取出入库分类
       UNSAFE_componentWillMount(){
        services.storeType({keys: {name: 'erp/stock/types'}, data:{ q:{ where:{ t:1  } }  }}).then(res =>{
             this.setState({
                 typeList:res.list,
             })
          })
        services.warehouseList( { keys: {name: 'store/warehouse/list'}  } ).then(res=>{
            var some=res.list.filter(item=>item.isDefaultWarehouse===1 ? true :false)
            var many=res.list.filter(item=>item.isDefaultWarehouse===0 ? true :false)
            console.log(some,many)
            this.setState({
                warehouseList:[...some,...many],
            })
        })
     }
     getData=(value)=>{
         const { warehouseList } = this.state
        this.setState({
            selectList:value.map(item=>{
                item.numbers=1
                item.remark='无'
                item.warehouseId= warehouseList[0].warehouseId || null
                return item
            }),
        },()=>{
          this.totalComputer()
        })
     }
     goBack=()=>{
        router.push('/boss-store/store-adjustment')
    }
     //刷新列表
     renovate=()=>{
         this.setState({
             skin:true,
             selectList:[],
         },()=>{
             window.timer=setTimeout(()=>{
                 this.totalComputer()
                 this.setState({
                     skin:false,
                 })
             },1000)
         })
     }
     componentDidMount(){
        // var ul=document.getElementsByClassName('ant-menu-horizontal')[1]
        // ul?ul.style.display='none':null
     }
     //清除定时器
     componentWillUnmount(){
         const { dispatch } = this.props
         dispatch({
            type:'storeAdjustment/urgent',
            payload:{status:false},
         })
         clearTimeout(window.timer)
        //  var ul=document.getElementsByClassName('ant-menu-horizontal')[1]
        //  if(ul){ul.style.display='block'}

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
     //改变商品单价
     changePrice=(id,val)=>{
        let  selectList=this.state.selectList.map(item=>{
            item.id === id ? item.price=val : null
            return item
            })
            this.setState({
                selectList,
            },()=>{
            this.totalComputer()
            })
     }
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
     //改变商品仓库
     changeWarehouseName=(id,val)=>{
        let  selectList=this.state.selectList.map(item=>{
            item.id === id ? item.warehouseId=val : null
            return item
        })
        this.setState({
            selectList,
        })
     }
     //计算总数量和总价格
     totalComputer=()=>{
         var totalCount=0,totalPrice=0
         this.state.selectList.forEach(item=>{
              totalCount+=item.numbers
              totalPrice+=((item.numbers)*(item.price))
         })

         this.setState({
              totalCount,
              totalPrice:totalPrice,
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
     //入库
     toInStore=()=>{

      const { dispatch ,urgent } =this.props
      console.log( urgent )
      let selectList =  this.state.selectList.filter(item=>{
             return   item.numbers===0 || item.price*1===0.0 || item.price*1===0 ?  false : true
         })
         console.log(selectList)
     if( this.state.typeId === null ) {
         message.info('请选择库存分类')
         return
        }

     if(selectList.length===0){
         message.info('入库商品数量价格均不能为零')
         return
     }
      let  addList =selectList.map(item=>{
             return   {
                        id:item.id,
                        warehouseId: item.warehouseId,
                        goodsNum:item.numbers,
                        goodsPrice:item.price,
                        totalPrice:((item.price*1)*(item.numbers)).toFixed(2),
                        remark:item.remark,
                      }
         })
     let serverObj={
            product:addList,
            remark:this.refs.remark.value,
            typeId:this.state.typeId,
         }
         this.setState({
             noButtonClick:true,
         },()=>{
            dispatch({
                type:'storeAdjustment/inStore',
                payload:{...serverObj},
            })
           setTimeout(()=>{
               this.setState({
                   dataList:[],
                   noButtonClick:false,
                },()=>{
                   message.success('入库成功', 3)
                    urgent ? router.push('/boss-store/maintain-list/hangUp') : router.push('/boss-store/store-adjustment')
                })
           },0)
         })

     }
     render(){
         const {  warehouseList,selectList,totalCount,totalPrice , noButtonClick } = this.state
         console.log(this.state.selectList)
         return (<div className="inStore" >
                        <Form layout='inline'>
                            <div className={styles.addBtn}>
                            <Button  onClick={ this.goBack   }  size='large'> <Icon type="left" /> 返回列表</Button>
                            {
                                <Select  onChange={ this.changeType }  placeholder="请选择入库分类" style={{ width: 200 }}  size='large'>

                                   <Option key="2" value="2"  >调拨入库</Option>
                                   <Option key="6" value="6"   >顾客退货</Option>
                                   <Option key="3" value="3" >盘盈入库</Option>

                                </Select>
                                }
                            <Icon type="sync" spin={ this.state.skin } style={{ fontSize: '16px', color: '#4aacf7',position:'absolute',right:26 }} onClick={ this.renovate }  />
                            </div>
                            <div className={styles.addTable}>
                            <Table
                                dataSource={ selectList }
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
                                width='9%'
                                />
                                <Column
                                title="编码"
                                dataIndex="code"
                                key="code"
                                align='left'
                                width='9%'
                                width='112px'
                                align='left'
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
                                width='17%'
                                render={(text,record) => (
                                    <Select  defaultValue={record.warehouseId}  onChange={ this.changeWarehouseName.bind(this,record.id)   }  placeholder="选择仓库" style={{ width: 230 }}  size='large'>
                                    {
                                        warehouseList.map(item => (
                                        <Option key={item.warehouseId}  value={item.warehouseId}>{item.warehouseName}</Option>
                                        ))
                                    }
                                    </Select>
                                )}
                                />

                                <Column
                                title="单价"
                                dataIndex="price"
                                key="price"
                                align='left'
                                width='9%'
                                render={(text,record) => (
                                <InputNumber   onChange= { this.changePrice.bind(this,record.id) }     min={0} precision={1} defaultValue={ record.price } size='large' style={{width:72}}/>
                                )}
                                />
                                <Column
                                title="数量"
                                dataIndex="numbers"
                                key="numbers"
                                align='left'
                                width='9%'
                                render={(text,record) => (
                                    <InputNumber     onChange={this.changeNumber.bind(this,record.id)} min={0} precision={0}  max={999999}  defaultValue={record.numbers} size='large' style={{width:62}}/>
                                )}
                                />
                                <Column
                                title="金额"
                                dataIndex="total"
                                key="total"
                                align='left'
                                width='9%'
                                render={(text,record)=>(
                                    <div> {  ((record.price )*( record.numbers )).toFixed(2) } </div>
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
                                        <Input defaultValue={record.remark} size='large' style={{width:230}}     onChange = { e => this.addRemark(record.id,'remark',e.target.value)  } />
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
                             <div> 商品数：<span> { totalCount } </span> 金额： <span>￥ {totalPrice }</span>  <Button  disabled={noButtonClick} loading={noButtonClick}  type="primary"  size='large'    style={ {width:'88px',textAlign:'center',marginRight:'20px' } }  onClick={ this.toInStore }  >入库</Button></div>
                        </div>
                    </div>
                     <AddProduct     selectList={ selectList }   addproduct={ this.getData }   api={ { getMenu:'storeAdjustment/get',getData:'storeAdjustment/getProductData' }  }  />
                 </div>)
     }
}
function mapStateToProps(state) {
    const {  productTypeList , dataList ,urgent } = state.storeAdjustment
    return { productTypeList , dataList ,urgent }
  }
export default connect(mapStateToProps)(inStore)
