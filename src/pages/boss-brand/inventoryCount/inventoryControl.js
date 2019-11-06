import { Component } from 'react'
import style from './style.less'
import { Select  , Form  , DatePicker , Checkbox   } from 'antd'
import service from 'services'
import {   MockDataFour }  from './mockDate'
import G2 from "@antv/g2"
import moment from "moment"
const { MonthPicker } = DatePicker
const Option = Select.Option
const tableHeader = [ '排名' , '商品' , '型号' , '编码' ]
const FormItem = Form.Item
//绘制柱状统计图
const draw = function({ container , data , height },type){
  var chart = new G2.Chart({
      container,
      forceFit: true,
      height,
  })
  chart.source(data)
  chart.scale('sales', {
    tickInterval: 20,
  })
  let name = type===1 ? '库存量' : '库存金额'
  let  intival={
    itemTpl: '<li data-index={index}>'
    + '<span style="background-color:{color};width:8px;height:8px;border-radius:50%;display:inline-block;margin-right:8px;"></span>'
    + name+'：<span class="g2-tooltip-value" style="color:#4aacf7" >{value}</span>'
    + '</li>',
  }
  chart.tooltip({
    showTitle: false,
    ...intival,
  })
  chart.interval().position('name*value')
  chart.render()
}


 class inventoryControl extends Component{
    constructor(prop){
        super(prop)
        this.state={
           array:[],
           loading:false,
           fristDay:null,
           disabled:false,
           fristShow:{
             storeId:null,
             storeName:null,
           },
           amountData:{
             list:[],
             total:0,
           },
           bestSellSort:[],
           stagnantSellSort:[],
           numberData:{
             total:0 ,
             list:[],
           },
           into:{
            list:[],
            totalNum:0,
            totalPrice:'0.00',
           },
           out:{
            list:[],
            totalNum:0,
            totalPrice:'0.00',
           },
        }
        this.totalCount = null
        this.totalPrice = null
        this.storeId = null  //挂载门店ID
        this.dataPicker = [] //挂载月份时间戳
    }
    UNSAFE_componentWillMount(){

        service
        .LIST({
          keys: { name: "common/store/list" },
          data: {
            q: { page: 1, limit: -1, where: {} },
          },
        })
        .then(res => {
          let array=[]
          res.list.forEach(e=>{
             array.push({value: e.id, name: e.storeName})
          })
          this.setState({
            array,
            fristShow:{
              storeId :  array.length === 0 ?  null : array[0].value,
              storeName : array.length === 0 ? null : array[0].name,
            },
          },()=>{
             const { fristShow } = this.state
             if(fristShow.storeId){
               this.getData(fristShow.storeId)
               // 获取当月时间戳
               let fristDay = Date.parse(moment(new Date()).format('YYYY-MM-01 00:00:00 '))
               console.log(fristDay,'zhaolin')
               this.setState({
                 fristDay,
               })
               let now = Date.parse(new Date())
               this.storeId = fristShow.storeId
               this.dataPicker = [ fristDay/1000 , now /1000 ]
               this.getDataList( fristShow.storeId , [ fristDay/1000 , now /1000 ] )
             }
          })
        })
    }

    handerControlColor=(i,length)=>{
        if(i<3) return <span className={style.symbolCircle}  style={{ color:'#fff' , background:'#4AACF7' }}  >{i+1}</span>
        else if(i>=length-3 && length>=6 ) return <span className={style.symbolCircle}  style={{ color:'#666' , background:'#F2F2F2' }}  >{i+1}</span>
        else return i+1
    }
    changeStatus=(val)=>{
      console.log(val)
      this.totalCount.innerHTML=''
      draw({
        height:362,
        data:MockDataFour,
        container:'totalCount',
      })
    }
    getDataList=( storeId , dataPicker )=>{
      service
      .inventoryStore({
        keys: { name: "brand/wide/inventory/overview/inventory" },
        data: {
          storeId,
          q:{
            where:{
              "created[<>]":dataPicker,
              status:'0'
            },
          },
        },
      })
      .then(res=>{
        if(res.code==='0'){
           const { into , out } = res.list
           this.setState({
             into,
             out,
           })
        }
      })
    }
    getData=(storeId )=>{
      service
      .inventoryView({
        keys: { name: "brand/wide/inventory/overview/index" },
        data: {
          storeId,
        },
      })
      .then(res=>{
         if(res.code === '0'){
           const {
              amountData ,
              bestSellSort ,
              numberData ,
              stagnantSellSort ,
            } = res.list
           this.setState({
              amountData ,
              bestSellSort ,
              numberData ,
              stagnantSellSort ,
              loading:false,
              disabled:false,
              })
           if(this.totalCount){
             this.totalCount.innerHTML=''
             this.totalPrice.innerHTML=''
           }
            draw({
              height:362,
              data:numberData.list
              .map(i=>{
                 return {
                   name: i.categoryName ,
                   value: i.total * 1 ,
                 }
              }),
              container:'totalCount',
            },1)
            draw({
              height:362,
              data:amountData.list
              .map(i=>{
                return {
                  name: i.categoryName ,
                  value: i.total * 1  ,
                }
              }),
              container:'totalPrice',
            })
         }
      })
    }
    changeTime=(val)=>{
      const { storeId } = this
      if(storeId){
        let fristDay = Date.parse( moment(val).format('YYYY-MM-01 00:00:00 ')  )
        let lastDay = fristDay +   moment(val).daysInMonth() * 24 * 3600 * 1000
        this.DatePicker = [ fristDay / 1000 , lastDay /1000 ]
        this.getDataList( storeId , [ fristDay / 1000 , lastDay /1000 ]  )
      }
    }
    select=(val)=>{
      const { DatePicker } = this
      this.storeId = val
      this.getDataList( val , DatePicker )
      this.getData(val)
    }
    controlTime=(val)=>{
       const now = Date.parse( new Date() )
       if(Date.parse(moment(val).format('YYYY-MM-01'))>now){
         return true
       }
       return false
    }
    reset=()=>{
      this.props.form.resetFields()
      const { fristShow } = this.state
      if(fristShow.storeId){
        this.setState({
           disabled:true,
           loading:true,
        },()=>{
          this.getData(fristShow.storeId)
          let fristDay = Date.parse(moment(new Date()).format('YYYY-MM'))
          let now = Date.parse(new Date())
          this.storeId = fristShow.storeId
          this.dataPicker = [ fristDay/1000 , now /1000 ]
          this.getDataList( fristShow.storeId , [ fristDay/1000 , now /1000 ] )
        })
      }
    }
    render(){
       const {
          array ,
          fristShow ,
          amountData ,
          bestSellSort ,
          numberData ,
          stagnantSellSort ,
          into,
          out,
          fristDay,

        } = this.state
     const { getFieldDecorator } = this.props.form
     const fristDate = moment(fristDay).format('YYYY-MM')
     return <div style={{ background:'#F2F6FA' }} >
             <Form layout = 'inline' >
             <div className={ style.zl_section_one  }  >
              <FormItem    >
               {getFieldDecorator('storeId', {
                })(
                  <Select  placeholder={ fristShow.storeName ?  fristShow.storeName : '暂无门店可选'  }   size='large' style={{ width: 200 }} onChange={this.select}>
                  {array.map((item,idx)=>{
                    return (
                      <Option   key={idx} value={item.value}>{item.name}</Option>
                    )
                  })}
                 </Select>
                 )}
              </FormItem>
             {/* <Button  loading={ loading } disabled={ disabled }   onClick = { this.reset }  type='primary' size='large' style={ { marginLeft:'24px', width:'88px' , height:'40px' } } >重置</Button> */}
             </div>
             <div className={style.zl_section_two} >
               <p>库存总额（元）</p>
               <p>{amountData.total}</p>
               <div style={ { height: '362px' } }  id = 'totalPrice'  ref={(totalPrice)=>this.totalPrice=totalPrice} ></div>
             </div>
             <div className={style.zl_section_two} >
               <p>库存总量（元）</p>
               <p>{numberData.total}</p>
               <div style={ { height: '362px' } } id = 'totalCount'   ref={(totalCount)=>this.totalCount=totalCount} ></div>
             </div>
             <div className={ style.zl_section_three } >
               <div className={ style.zl_section_threeTiem } style={{ marginRight:'42px'  }}  >
                 <p>畅销品排行</p>
                 <div className={ style.zl_divTable } >
                   <div className={style.zl_tableHeader} >
                    { tableHeader.map(i=><div key={i} >{i}</div>)  }
                   </div>
                   <div className={style.zl_tableContent} >
                     {
                       bestSellSort.map((item,i)=>
                       <ul key={i} >
                         <li>{ this.handerControlColor(i,bestSellSort.length) }</li>
                         <li>{item.productName}</li>
                         <li>{item.specification	}</li>
                         <li>{item.commodityCode}</li>
                       </ul>)
                     }
                   </div>
                 </div>
               </div>
               <div className={ style.zl_section_threeTiem } >
                 <p>滞销品排行</p>
                 <div className={ style.zl_divTable } >
                   <div className={style.zl_tableHeader} >
                        { tableHeader.map(i=><div key={i} >{i}</div>)  }
                   </div>
                   <div className={style.zl_tableContent} >
                     {
                       stagnantSellSort.map((item,i)=>
                       <ul key={i} >
                         <li>{ this.handerControlColor(i,stagnantSellSort.length) }</li>
                         <li>{item.productName}</li>
                         <li>{item.specification}</li>
                         <li>{item.commodityCode}</li>
                       </ul>)
                     }
                   </div>
                 </div>
               </div>
             </div>
             <div className={ style.zl_section_four } >
               <div className={style.zl_sf_one} >
               <FormItem   label='日期' >
               {getFieldDecorator('createf', {
                })(
                 <MonthPicker    size='large'  disabledDate={this.controlTime}   style={{ width:'220px',height:'40px' ,marginRight:'32px' , marginLeft:'5px'  }}  placeholder={fristDate}  onChange={this.changeTime} />
                )}
               </FormItem>
                 <Checkbox style={{ marginTop:'10px' }} >包含当期停用商品</Checkbox>
               </div>
               <div className={style.zl_sf_Cc} >
                 <div className={style.zl_sf_C} style={{ marginRight:"44px" }}  >
                  <div className={style.zl_sf_CH} >
                    <div>
                      <p>入库金额（元）</p>
                      <p>{ into.totalPrice }</p>
                    </div>
                    <div>
                      <p>入库数量</p>
                      <p>{ into.totalNum }</p>
                    </div>
                  </div>
                  <div className={ style.zl_sf_CT } >
                    <div className={ style.zl_sf_CTH } >
                     <div>入库项目</div>
                     <div>数量</div>
                     <div>金额</div>
                    </div>
                    <div className={ style.zl_sf_CTC } >
                    {
                      into.list.map((item,i)=>
                      <ul key={i} >
                        <li>{item.typeName}</li>
                        <li>{item.num}</li>
                        <li>{item.price}</li>
                      </ul>)
                    }
                     </div>
                  </div>
                 </div>
                 <div className={style.zl_sf_C}  >
                 <div className={style.zl_sf_CH} >
                    <div>
                      <p>出库金额</p>
                      <p>{ out.totalPrice }</p>
                    </div>
                    <div>
                      <p>出库数量</p>
                      <p>{ out.totalNum }</p>
                    </div>
                  </div>
                  <div className={ style.zl_sf_CT } >
                    <div className={ style.zl_sf_CTH } >
                     <div>出库项目</div>
                     <div>数量</div>
                     <div>金额</div>
                    </div>
                    <div className={ style.zl_sf_CTC } >
                    {
                      out.list.map((item,i)=>
                      <ul key={i} >
                        <li>{item.typeName}</li>
                        <li>{item.num}</li>
                        <li>{item.price}</li>
                      </ul>)
                    }
                     </div>
                  </div>
                 </div>
               </div>
             </div>
             </Form>
        </div>
    }
}
export default Form.create()(inventoryControl)
