import React,{ Component } from 'react'
import { Table , DatePicker , Spin , Form  , Button , Select } from 'antd'
import style from './style.less'
import services from "services"
import moment from "moment"


const FormItem = Form.Item
const MonthPicker = DatePicker.MonthPicker
const Option = Select.Option 


 class index extends Component{
    constructor(){
        super()
        this.state={
           paymentList:[],
           loading:true,
           storeList:[],
           dataList:[],
           timestamp:null,
           storeId:null,
        }
    }

    UNSAFE_componentWillMount(){
      let now = new Date()
      let timestamp = Date.parse(moment(now))/1000
      //获取门店列表
      services
        .LIST({
          keys: { name: "common/store/list" },
          data: {
            q: { page: 1, limit: -1, where: {} },
          },
        }).then(res=>{
          if(res.code==='0'){
              if(res.list.length===0){
                 this.setState({
                   loading:true,
                   timestamp,
                 })
              }else{
                this.setState({
                    timestamp,
                    storeId:res.list[0].id,
                    storeList:res.list,
                },()=>{
                  const { storeId , timestamp  } = this.state
                  this.getData({ timestamp ,storeId  })
                })   
              }
            }
        })
    }
    getData=(o)=>{
       this.setState({
           loading:true,
       },()=>{
        services.brandSalaryReport({ data:{ ...o } }).then( async res=>{
            if(res.code==='0'){
                const { totalSize , curPage , data } = res
                const { overview ,payment } = data
                //支付方式遍历
                let paymentList = payment.map(item=>{
                    return {
                        ...item,
                        symbol:'pay'+item.id,
                    }
                })
                //数据源遍历 
                let dataList = overview.sort((b,a)=>Date.parse(a.date)-Date.parse(b.date)).map(item=>{
                    return {
                        date:item.date,
                        ...this.getPaymentList(item.aggregation,paymentList),
                    }
                })
                function computerMoney (overview,id){
                    let money = 0
                    overview.forEach(v=>{   
                        v.aggregation.forEach(j=>{
                          if(j.id===id){
                              money  = j.money*1 + money
                          }
                        })
                    })
                    return money
                }
                let newList=paymentList.map(item=>{
                   return{
                     id:item.id,
                     money:computerMoney(overview,item.id),
                   }
                })
                let obj = {
                  date:'合计',
                  ...this.getPaymentList(newList,paymentList),
                }
                dataList = dataList.filter( item=> Date.parse( new Date(item.date) ) < Date.parse( new Date() )  )
                if(dataList.length!==0){
                    dataList.push(obj)
                }
                this.setState({
                    paymentList,
                    dataList,
                    totalSize,
                    curPage,
                    loading:false,
                },()=>{     
                })
            }
        })
     
       })   
    }
    getPaymentList=(list,paymentList)=>{
       let obj = {}
       let money = 0
       let fristObj={}
       paymentList.forEach(item=>{
           fristObj[item.symbol] = 0
       })
       list.forEach(v=>{
           paymentList.forEach(item=>{
            if(v.id === item.id ){
               obj[item.symbol] = v.money.toFixed(2)
               money = (v.money*1 + money)
            }
           })
       })
       let addtion = 0 
       if(obj['pay-1']) addtion  = obj['pay-1']*1 + addtion 
       if(obj['pay3']) addtion  = obj['pay3']*1 + addtion 
       obj.total = (money-addtion).toFixed(2)
       return {
           ...fristObj,
           ...obj,
       }
    }
    handleSubmit=(e)=>{
      e.preventDefault()
      this.props.form.validateFields((err,value)=>{
         if(!err){
          let o = {}
          o.timestamp = Date.parse(moment(value.timestamp))/1000
          o.storeId = value.storeId
          this.getData(o)
         }
        
      })
    }
    ranch=()=>{
      this.setState({
        loading:true,
      },()=>{
        this.props.form.resetFields()
        this.setState({
          loading:false,
        },()=>{
           const { timestamp , storeId } = this.state
           this.getData({ timestamp , storeId  })
        })
      })
    }
    render(){
        const { loading , paymentList ,dataList  ,timestamp , storeList ,storeId } = this.state
        const { getFieldDecorator } = this.props.form
        let o ={
            x: paymentList.length >= 5 ?  (paymentList.length+1)*230 + 113 + 'px' : false ,
        }
        let t  
       
        paymentList.length >= 7 ? t={ width:200 } : t={}
        const columns = [{
            title: '日期',
            dataIndex: 'date',
            width:140,
            key: 'operation1',
            fixed: 'left',
          },
           ...paymentList.filter(i=>i.id*1!==3 && i.id*1!==-1).map(item=>{
               return {
                  title:item.name,
                  dataIndex:item.symbol,
                  ...t,
                  key:item.symbol,
               }
           }),
           {
             title:'今日还款',
             dataIndex:'pay-1',
             key:'pay-1',
             width:200,
             fixed:'right',
           },
           {
            title:'新增欠款',
            dataIndex:'pay3',
            key:'pay3',
            width:200,
            fixed:'right',
          },
          {
            title: '实收总额',
            dataIndex: 'total',
            width:200,
            key: 'operation',
            fixed: 'right',
          }]
        if(dataList.length===0){
           columns.splice(1,0,{      
             title:'暂无数据',
             dataIndex:'none',
           })    
        }  
        return <div className={ style.zl_box }   > 
                  <Form onSubmit={this.handleSubmit}  layout="inline" >
                    <FormItem   style={{ marginBottom:'30px' , marginTop:'30px' }}  >
                      {getFieldDecorator('timestamp', {
                           initialValue:moment( timestamp * 1000  ),
                              })(
                        <MonthPicker   size='large'  style={{width: "290px"  }}   placeholder='选择日期'   />
                      )}
                    </FormItem>
                    <FormItem  style={{ marginBottom:'30px' , marginTop:'30px' }}  label='选择门店'   >
                      {getFieldDecorator('storeId', {
                            initialValue:storeId,
                              })(
                        <Select    size='large'  style={{width: "290px"  }}  placeholder='无门店可选'  >
                           {
                             storeList.map(item=>
                             <Option key={item.id} value={item.id} >{item.storeName}</Option>)
                           }
                        </Select>
                      )}
                    </FormItem>
                    <FormItem style={{ marginBottom:'30px' , marginTop:'30px' }}    >
                      <Button  style={ { height:'40px' , width:'88px' } }  type="primary" htmlType="submit"   >
                          查询
                      </Button>
                    </FormItem>
                    <FormItem style={{ marginBottom:'30px' , marginTop:'30px' }}    >
                      <Button  style={ { height:'40px' , width:'88px' } }  onClick={ this.ranch }  >
                          重置
                      </Button>
                    </FormItem>
                  </Form>
                 <div  >
                  <Spin  spinning={ loading }  >
                    <Table
                        columns={columns}
                        dataSource={dataList}
                        scroll={{ ...o }}
                        pagination={false}
                    />
                  </Spin>
                 </div>
               </div>
    }
}
export default Form.create()(index)