import React,{ Component } from 'react'
import services from "services"
import style from '../styles.less'
import {connect}   from 'dva'
import {  Button , Select  , InputNumber  , message  , Tooltip } from 'antd'
import moneyToCapital  from "../../../../utils/toChineseMoney"
import PrintStatement from '../../mimeograph/receipts/billingPay'
import moment from "moment"
import Mast from './mast'
const Option = Select.Option

var data={
    storeName:'',
    orderId:null, //单号
    cardId:null,//卡号
    remainder:null,//余额
    created:null,
    storePhone:null,//门店电话
    clientName:'',//顾客姓名
    phone:'',//顾客电话
    serviceAdvisor:'', //服务顾问
    remark:'',
    carNum:12341,
    carType:'',//车型
    payTime:0, //支付时间
    storeMileage:0,//进店里程
    oilMeter:0,//油表
    carCarriage:'',//车架号
    motorNum:'',//发动机号
    inFactoryTime:0,//进厂时间
    outFactoryTime:0,//出厂时间
    describe:'',//描述
    billingRemark:'',
    project:[],
    product:[
    ],
    storeSetting:{
        depositBank:'',//开户行
        bankCard:'',//银行卡号
        hotline:400641224 ,//服务热线
        SOShotline:1232434,//道路救援热线
        address:'',//地址
        remark:'',//门店备注
        dutyParagraph:0,//税号
    },
    computerPrice:{
        workPrice:0,//工时费
        projectPrice:0,//项目费
        partsPrice:0,//配件费
        attrachPrice:0,//附加费
        totalPrice:0,//合计
        preferentialPrice:0,//优惠金额
        amountReceived:0,//实收金额
        upperPrice:' ',
        payType:{
            name:'',
            options:[
            ],
        },
    },
}

const getTableComputerPrice=(type,scale,data,B,D,obj)=>{
    const T ={ marginRight:(108*scale)+'px',fontWeight:'bold' }
    switch(type){
        case 2 :
         return (<div style={ {  ...B,position:'relative' } } >
                    <p style={ D } > 项目费 ：<span style={ T } > { obj.projectPrice.toFixed(2) } </span> 产品费 ：<span style={ T } > { obj.productPrice.toFixed(2) } </span> {/*附加费 ：<span style={ T } > { data.attrachPrice } </span>*/}  </p>
                    {/* <p style={ D } > 支付方式 :{ data.payType.options.length===0||(data.payType.options.length === 1 ? data.payType.options[0].name :'混合支付' ) }  { data.payType.options.length===0|| data.payType.options.length===1  ||   <span>({data.payType.options.map((item,i)=><span key={i} >{item.name}:{item.value};</span>)})</span>  }  </p> */}
                    <p style={ { ...D,width:'70%',height:'50px',lineHeight:'50px' } }></p>
                    <div style={ { position:'absolute',top:0,right:0,marginRight:(38*scale)+'px'  } } >
                        <p style={ D } >实收金额 ：<span style={ { fontWeight:'bold',fontSize:(40*scale)+'px' } } > { obj.totalPrice.toFixed(2) } </span>  </p>
                        <p style={ D } >大写 ： { moneyToCapital(obj.totalPrice)  }</p>
                    </div>
                 </div>)
        case 3 :
        return  (<div style={ {  ...B,position:'relative' } } >
                    <p style={ D } > 项目费 ：<span style={ T } > { data.projectPrice } </span>  产品费：<span style={ T } > { data.partsPrice }</span>  </p>
                    {/* <p style={ D } > 支付方式 :{ data.payType.options.length===0||(data.payType.options.length === 1 ? data.payType.options[0].name :'混合支付' ) }  { data.payType.options.length===0|| data.payType.options.length===1  || <span>({data.payType.options.map((item,i)=><span key={i} >{item.name}:{item.value};</span>)})</span>  } </p> */}
                    <p style={ { ...D,width:'70%',height:'40px' } }></p>
                    <div style={ { position:'absolute',top:0,right:0,marginRight:(38*scale)+'px'  } } >
                        <p style={ D } >实收金额 ：<span style={ { fontWeight:'bold',fontSize:(40*scale)+'px' } } > { data.totalPrice } </span>  </p>
                        <p style={ D } >大写 ： { data.upperPrice  }</p>
                    </div>
                </div>)
        default:
        return
    }
}

//创建门店设置结构
const getTableProSetting=( type,scale,data,B,D)=>{
    const V = { display:'inline-block',width:'33%' }
    return (<div style={{  ...B , position:'relative' }} >
                <p style={ D } ><span style={ V } >开户行：{ data.depositBank }</span> <span style={ V } >服务热线 { data.hotline } </span> <span   style={{ ...V,  width:'33%', height:'80%' , position:'absolute' }} > 门店备注 ：{ data.remark } </span> </p>
                <p style={ D } ><span style={ V} >银行卡号：{ data.bankCard }</span> <span style={ V } >道路救援： { data.SOShotline }</span> </p>
                <p style={ D } > <span style={ V } > 税号：{ data.dutyParagraph } </span> <span style={ V } > 地址：{ data.address } </span>  </p>
            </div>)
}
const getTableFooter=(scale)=>{
    const S ={ borderBottom:'1px solid #000', display:'inline-block',width:(425*scale)+'px',height:'1px'  }
   return <div style={ { fontSize:'20px',fontWeight:'400', fontFamily:'MicrosoftYaHei', height:'68px',lineHeight:'68px',color:'#323333', display:'flex', justifyContent:'space-between' } } >
              <span>服务顾问 : <span style={ S }  /> </span>
              <span>收银员 ： <span  style={ S  } /> </span>
              <span>客户签字 ：<span  style={ S  } /> </span>
          </div>
}

class  updateBlist extends Component{
    constructor(){
        super()
        this.state={
           staffList : [],
           data,
           mastShow:false,
           showType:null,
           productInfo:[],
           projectInfo:[],
           orderInfo:null,
           productPrice: 0, // 产品费
           projectPrice: 0, // 项目费
           totalPrice: 0, // 实收金额
           printShow:false, // 是否显示打印组件
           printType: null, // 传给打印组件的订单类型
           printData: null, // 传给打印组件的数据
        }
    }
    handerRouter=()=>{

    }
    UNSAFE_componentWillMount(){
        const { orderId , orderType  , Bid  } = this.props
        console.log(orderId,orderType,Bid,'接收父组件传递的参数')
       // 获取员工列表
       services.LIST({ keys:{  name:'store/staff/list' } ,data:{ q:{"page":-1,"where":{"business[~]":1,"isJob":1}} }  }).then(res=>{
             if(res.code==='0'){
                const { list } = res
                this.setState({
                    staffList : list,
                },()=>{
                    console.log(this.state.staffList,'员工列表')
                })
             }
       })
        //B单打印 维修开单
        console.log(orderType)
        if(orderType===3){
        services.printingOperationB( { keys:{ name:'printing/operation/order/normal/billing/',id :orderId} })
        .then( res=>{
            console.log(res)
            res.code==='0' ? this.setState({
                data:res.list,
            }) :message.info('网络出现错误')
        })
        }
        //B单打印 快捷开单
        else if (orderType===4){
        services.printingOperationQuikeB( { keys:{ name:'printing/operation/order/quick/billing/',id:orderId } })
        .then( res=>{
            res.code==='0' ? this.setState({
                data:res.list,
            }) :message.info('网络出现错误')
        })
        }
        // 保存信息源
        services
        .LIST({ keys: { name: `store/vice/order/${Bid}/edit` } })
        .then(res=>{
            if(res.code==='0'){
                const { data  } = res
                const { orderInfo , productInfo , projectInfo  } = data
                let newProject = [...projectInfo]
                .map(item=>{
                    return {
                        remark:item.remark,
                        priceTem:item.price,
                        num:item.num,
                        salesman:item.salesman,
                        discount:item.discount, // 原价抵扣
                        itemTotal:(item.price*1)*(item.num*1), // 之前的每行金额字段
                        constructors:item.constructors,
                        projectName:item.name,
                        id:item.id,
                        projectId:item.id,
                        cardDeduction: item.cardDeduction, // 卡抵扣
                        actuallyPaid: item.actuallyPaid, // 实收
                        cardRemain: item.cardRemain, // 卡剩余
                        clientCardType: item.clientCardType, // 是否是卡内支付， 0 - 非卡支付
                    }
                })
                let newProduct = [...productInfo]
                .map(item=>{
                    return {
                        remark:item.remark,
                        priceTem:item.price,
                        num:item.num,
                        salesman:item.salesman,
                        discount:item.discount, // 原价抵扣
                        itemTotal:(item.price*1)*(item.num*1), // 之前的每行金额字段
                        constructors:item.constructors,
                        productName:item.name,
                        id:item.id,
                        productId:item.id,
                        cardDeduction: item.cardDeduction, // 卡抵扣
                        actuallyPaid: item.actuallyPaid, // 实收
                        cardRemain: item.cardRemain, // 卡剩余
                        clientCardType: item.clientCardType, // 是否是卡内支付， 0 - 非卡支付
                    }
                })
                this.setState({
                    orderInfo,
                    productInfo:newProduct,
                    projectInfo:newProject,
                },()=>{
                    console.log(this.state.projectInfo,'处理后的项目数据')
                })
            }
        })
    }
    // 选择销售人员事件
    handleSaleChange=(i,type,value)=>{console.log(i,type,value)
        const { productInfo , projectInfo  ,staffList } = this.state
        let  staffName = staffList.filter(i=>i.staffId === value)[0].staffName
        if(type==='product'){
            let newList = [...productInfo].map((item,idx)=>{
                if(idx===i){
                    return{
                        ...item,
                        salesman:[ { id:value,scale:100,name:staffName } ],
                    }
                }
                else{
                    return item
                }
            })
            this.setState({
               productInfo:newList,
            })
        }
        else if (type==='project'){
            let newList = [...projectInfo].map((item,idx)=>{
                if(idx===i){

                    return{
                        ...item,
                        salesman:[ { id:value,scale:100,name:staffName } ],
                    }
                }
                else{
                    return item
                }
            })
            this.setState({
               projectInfo:newList,
            },()=>{
                console.log(this.state.data,projectInfo)
            })
        }
    }
    // 选择施工人员事件
    handleConstructChange=(i,type,value)=>{
        const {  projectInfo , productInfo ,staffList } = this.state
        let  staffName = staffList.filter(i=>i.staffId === value)[0].staffName
        if(type==='product'){
            let newList = [...productInfo].map((item,idx)=>{
                if(idx===i){
                    return{
                        ...item,
                        constructors:[ { id:value,scale:100,name:staffName } ],
                    }
                }
                else{
                    return item
                }
            })
            this.setState({
               productInfo:newList,
            })
        }
        else if (type==='project'){
            let newList = [...projectInfo].map((item,idx)=>{
                if(idx===i){
                    return{
                        ...item,
                        constructors:[ { id:value,scale:100,name:staffName } ],
                    }
                }
                else{
                    return item
                }
            })
            this.setState({
              projectInfo:newList,
            },()=>{
                console.log(this.state.data)
            })
        }
    }
    // 改变单价事件
    handerPrice=(i,type,value)=>{
        console.log(value)
        if(value<0) return
        const { productInfo , projectInfo } = this.state
        if(type==='product'){
            let newList = [...productInfo].map((item,idx)=>{
                if(idx===i){
                    return{
                        ...item,
                        priceTem:value,
                        itemTotal:value*(item.num*1),
                        actuallyPaid: (value*(item.num*1)*item.discount* 0.1).toFixed(2), // 实收
                    }
                }
                else{
                    return item
                }
            })
            this.setState({
               productInfo:newList,
            })
        }
        else if (type==='project'){
            let newList = [...projectInfo].map((item,idx)=>{
                if(idx===i){
                    return{
                        ...item,
                        priceTem:value,
                        itemTotal:value*(item.num*1),
                        actuallyPaid: (value*(item.num*1)*item.discount* 0.1).toFixed(2), // 实收
                    }
                }
                else{
                    return item
                }
            })
            this.setState({
               projectInfo:newList,
            })
        }

    }
    // 减少数量事件
    computerMin=(i,type)=>{
        const { productInfo , projectInfo  } = this.state
        if(type==='product'){
            let newList = [...productInfo].map((item,idx)=>{
                if(idx===i){
                    if(item.num*1===1){
                        return item
                    }
                    return{
                        ...item,
                        num:item.num*1-1,
                        itemTotal:(item.num*1-1)*(item.priceTem),
                        actuallyPaid: ((item.num*1-1)*(item.priceTem)*(item.discount)* 0.1).toFixed(2), // 实收
                    }
                }
                else{
                    return item
                }
            })
            this.setState({
              productInfo:newList,
            })
        }
        else if (type==='project'){
            let newList = [...projectInfo].map((item,idx)=>{
                if(idx===i){
                    if(item.num*1===1){
                        return item
                    }
                    return{
                        ...item,
                        num:item.num*1-1,
                        itemTotal:(item.num*1-1)*(item.priceTem),
                        actuallyPaid: ((item.num*1-1)*(item.priceTem)*(item.discount)* 0.1).toFixed(2), // 实收
                    }
                }
                else{
                    return item
                }
            })
            this.setState({
              projectInfo:newList,
            })
        }
    }
    // 添加数量事件
    computerAdd=(i,type)=>{
        const { productInfo , projectInfo  } = this.state
        if(type==='product'){
            let newList = [...productInfo].map((item,idx)=>{
                if(idx===i){
                    return{
                        ...item,
                        num:item.num*1+1,
                        itemTotal:(item.num*1+1)*(item.priceTem),
                        actuallyPaid: ((item.num*1+1)*(item.priceTem)*(item.discount)* 0.1).toFixed(2), // 实收
                    }
                }
                else{
                    return item
                }
            })
            this.setState({
               productInfo:newList,
            })
        }
        else if (type==='project'){
            let newList = [...projectInfo].map((item,idx)=>{
                if(idx===i){
                    return{
                        ...item,
                        num:item.num*1+1,
                        itemTotal:(item.num*1+1)*(item.priceTem),
                        actuallyPaid: ((item.num*1+1)*(item.priceTem)*(item.discount)* 0.1).toFixed(2), // 实收
                    }
                }
                else{
                    return item
                }
            })
            this.setState({
              projectInfo:newList,
            })
        }
    }
    // 显示弹窗
    showMast=(type)=>{
        this.setState({
            showType:type,
            mastShow:true,
        })
    }
    // 关闭弹窗
    closeMast=()=>{
        this.setState({
            showType:null,
            mastShow:false,
        })
    }
    submit=(istoprint)=>{
        const {  productInfo , projectInfo ,orderInfo  } = this.state
        const { updateOrderB  }=this.props
        console.log(projectInfo,productInfo)
        let status = false , productTotal=0 , projectTotal =0
        productInfo.forEach((item=>{
             if(!item.constructors || !item.salesman ) status =true
             productTotal += item.actuallyPaid*1
        }))
        projectInfo.forEach((item=>{
            if(!item.constructors || !item.salesman ) status =true
            projectTotal += item.actuallyPaid*1
        }))
        if(status){
            message.info('施工人员和销售人员不能为空')
            return
        }
        console.log(orderInfo,'98989',productTotal,projectTotal)
        //数据整和
        let obj ={
            operate:3,
            orderInfo:{
                ...orderInfo,
                productTotal: productTotal || 0,
                projectTotal: projectTotal || 0,
                isCheck:true,
                from:1,
                amount: productTotal + projectTotal || 0,
            },
            productInfo,
            projectInfo,
        }
        services
        .UPDATE({
            keys: { name: "maintain/order", id: orderInfo?orderInfo.orderId:null},
            data: obj,
        })
        .then(res=>{
            if(res.code==='0'){
                if(istoprint===true){
                    var orderId = orderInfo ? orderInfo.orderId : null
                    var type = orderInfo ? orderInfo.type : null
                    this.showPrint(orderId,type)
                }else{
                  message.success('修改成功')
                  updateOrderB()
                }
            }
        })
    }
    // 打印
      showPrint=(id,type)=>{
        const { printShow } = this.state
        //B单打印 维修开单
      if(type===3){
        services.printingOperationB( { keys:{ name:'printing/operation/order/normal/billing/',id } })
        .then( res=>{
            console.log(res,'维修开单')
            res.code==='0' ? this.setState({
                printData:res.list,
                printShow:!printShow,
                printType: 2,
            }) :message.info('网络出现错误')
        })
      }
      //B单打印 快捷开单
      else if (type===4){
        services.printingOperationQuikeB( { keys:{ name:'printing/operation/order/quick/billing/',id } })
        .then( res=>{
            console.log(res,'快捷开单')
            res.code==='0' ? this.setState({
                printData: res.list,
                printShow:!printShow,
                printType: 3,
            }) :message.info('网络出现错误')
        })
      }
    }
    //对返回的参数进行处理
    handBack=(back)=>{
        const { productInfo ,projectInfo ,staffList } = this.state
        const { type  , value } = back
        console.log(value)
        if(type==='product'){
          let idList = productInfo.map(i=>i.productId)
          if(idList.indexOf(value.id)>=0){
              message.info('产品已存在，请改变数量')
              return
          }
        }else if(type==='project'){
          let idList = projectInfo.map(i=>i.projectId)
          if(idList.indexOf(value.id)>=0){
            message.info('项目已存在，请改变数量')
            return
        }
        }
        if(type==='product'){
            let newList = [...productInfo]
            newList.push({
                productName:value.name, //维修项目
                id:value.id,
                productId:value.id,
                constructors: staffList.length!==0 ?  [ { id:staffList[0].staffId,scale:100,name:staffList[0].staffName } ] :null , //施工
                priceTem:value.price*1, //单价
                num:1,//数量
                discount:10,//折扣
                itemTotal:value.price*1,
                salesman:staffList.length!==0 ?  [ { id:staffList[0].staffId,scale:100,name:staffList[0].staffName } ] :null,
                remark:'',
                new:true,
                cardDeduction: "——", // 卡抵扣
                actuallyPaid: value.price*1, // 实收
                cardRemain: "——", // 卡剩余
           })
            this.setState({
              productInfo:newList,
            },()=>{
                this.closeMast()
            })
        }
        else if(type==='project'){
            let newList = [...projectInfo]
                newList.push({
                projectName:value.name, //维修项目
                id:value.id,
                remark:'',
                projectId:value.id,
                constructors: staffList.length!==0 ?  [ { id:staffList[0].staffId,scale:100,name:staffList[0].staffName } ] :null ,
                priceTem:value.price*1, //单价
                num:1,//数量
                discount:10,//折扣
                itemTotal:value.price*1,
                packageBalance:0,//套餐剩余
                salesman:staffList.length!==0 ?  [ { id:staffList[0].staffId,scale:100,name:staffList[0].staffName } ] :null,
                new:true,
                cardDeduction: "——", // 卡抵扣
                actuallyPaid: value.price*1, // 实收
                cardRemain: "——", // 卡剩余
           })
            this.setState({
               projectInfo:newList,
             },()=>{
                 this.closeMast()
             })
        }
    }
    // 点击删除项目或产品事件
    delList=(i,type)=>{
        const { productInfo , projectInfo } = this.state
        if(type==='product'){
            let newList = [...productInfo]
            newList.splice(i,1)
            this.setState({
               productInfo:newList,
            })
        }else{
            let newList = [...projectInfo]
            newList.splice(i,1)
            this.setState({
               projectInfo:newList,
            })
        }
    }
    // 实时计算项目产品实收金额
    computerPrice = (a,b) => {
      let projectPrice = 0 // 项目费
      let productPrice = 0 // 产品费
      let totalPrice = 0  // 实收金额
      let proj = [...a]
      proj.forEach(v=>{
        projectPrice += v.actuallyPaid * 1
      })
      let prod = [...b]
      prod.forEach(v=>{
        productPrice += v.actuallyPaid * 1
      })
      totalPrice = projectPrice*1 + productPrice*1
      return {
        projectPrice, // 项目费
        productPrice, // 产品费
        totalPrice, // 实收金额
      }
    }
    render(){
        const {  siderFold  , updateOrderB  } = this.props
        const {
           staffList,
           data,
           mastShow,
           showType,
           projectInfo,
           productInfo,
           printShow, // 是否显示打印组件
           printType, // 传给打印组件订单类型
           printData // 传给打印组件的数据
        } = this.state
        console.log(data)
        console.log('项目',projectInfo)
        console.log('产品',productInfo)
        const obj = this.computerPrice(projectInfo,productInfo)
        console.log('---',obj)
        const scale = 0.5
        const O = {  borderLeft:'1px solid #000',borderRight:'1px solid #000',borderBottom:'1px solid #000' ,display:'flex' }
        const L = {  fontSize:(32*scale)+'px',lineHeight:(95*scale)+'px',listStyle:'none',color:'#000' }
        // const D={ width:(198.48*scale)+'px',boxSizing:'border-box',border:'1px solid #000' ,paddingLeft:(20*scale)+'px' ,color:'#000' }
        const B = { borderLeft:'1px solid #000',borderRight:'1px solid #000',borderBottom:'1px solid #000' }
        const D2 = { marginBottom:0 ,paddingLeft:(20*scale)+'px',paddingBottom:(20*scale)+'px' ,paddingTop:(20*scale)+'px', lineHeight:(60*scale)+'px',color:'#000',fontSize:(32*scale)+'px' }
        // const S={ width:(421.77*scale)+'px',boxSizing:'border-box' ,border:'1px solid #000',paddingLeft:(20*scale)+'px' ,color:'#000' }
        const T={ height:(100*scale)+'px',width:(2481*scale)+'px',fontSize:(32*scale)+'px',lineHeight:(100*scale)+'px'  ,color:'#000' }
        const D1={ width:(275.7*scale)+'px',boxSizing:'border-box',border:'1px solid #000' ,paddingLeft:(20*scale)+'px',color:'#000'  }
        const S1={ width:(551.3*scale)+'px',boxSizing:'border-box',border:'1px solid #000' ,paddingLeft:(20*scale)+'px',color:'#000'  }
        return    <div>
                    <div className={ style.zl_detailList }  style={{ zIndex:'8', left: siderFold ? '80px' : '200px'  }}  >
                                <div className={ style.zl_listOne } style={{ height:'60px' }} >
                                    <span> 编辑B单 </span>
                                    {/* <span><i  className="iconfont icon-bangzhu" ></i>帮助中心 </span> */}
                                </div>
                                <div className={style.yc_backdiv} style={{marginBottom:'98px'}}>
                                  <div className={style.yc_back} style={{padding:'32px',height:'100%'}}>
                                    <div style={{overflow:'hidden'}}>
                                      <Button  className={style.yc_backbtn} onClick={ ()=>updateOrderB() } >  <i className='iconfont icon-fanhui1'></i>返回上一级 </Button>
                                    </div>
                                    <div>
                                      <div style={{  paddingTop:'33px',width:'100%' }} >
                                          <h1 style={ { fontWeight:'bold',fontFamily:'MicrosoftYaHei-Bold', textAlign:'center', marginBottom:'30px',height:'27px',fontSize:'26px',lineHeight:'26px',color:'#323333' } } >{ data.storeName }(结算单)</h1>
                                          <p style={{ overflow:'hidden', marginBottom:'20px'} } >
                                            <span style={ { float:'left',fontSize:'20px',height:'21px',lineHeight:'21px', fontFamily:'MicrosoftYaHei', fontWeight: '400',color:'#323333' } } >单号：{ data.orderId }</span>
                                            <span style={ { float:'right',fontSize:'20px',height:'21px',lineHeight:'21px', fontFamily:'MicrosoftYaHei', fontWeight: '400',color:'#323333' } } >日期：{ data.created===0?  '':moment(data.created * 1000).format("YYYY-MM-DD") }</span>
                                          </p>
                                          <table style={{ borderCollapse:'collapse',width:'100%' }} >
                                            <tbody>
                                                <tr style={ T } >
                                                    <td style={ D1 } >姓名：</td>
                                                    <td style={ S1 } >{ data.clientName } </td>
                                                    <td style={ D1 } >电话：</td>
                                                    <td style={ S1 } >{ data.phone }</td>
                                                    <td style={ D1 } >备注：</td>
                                                    <td style={ S1 } >{ data.remark }</td>
                                                </tr>
                                                <tr style={ T } >
                                                    <td style={ D1 } >车牌：</td>
                                                    <td style={ S1 } >{ data.carNum }</td>
                                                    <td style={ D1 } >车型：</td>
                                                    <td style={ S1 } >{ data.carType }</td>
                                                    <td style={ D1 } >服务顾问：</td>
                                                    <td style={ S1 } >{ data.serviceAdvisor }</td>
                                                </tr>
                                                <tr style={ T } >
                                                    <td style={ D1 } >进店里程：</td>
                                                    <td style={ S1 } >{ data.storeMileage }KM</td>
                                                    <td style={ D1 } >进厂时间：</td>
                                                    <td style={ S1 } >{data.inFactoryTime===0?  '': moment(data.inFactoryTime * 1000).format("YYYY-MM-DD HH:mm  ") }</td>
                                                    <td style={ D1 } >结算时间：</td>
                                                    <td style={ S1 } >{ data.payTime===0?  '': moment(data.payTime * 1000).format("YYYY-MM-DD HH:mm  ") }</td>
                                                </tr>
                                            </tbody>
                                          </table>
                                          <div style={ { ...B  } } >
                                              <p style={ { ...D2 }  } >描述：{ data.describe  }</p>
                                          </div>
                                          <ul  style={ { marginBottom:0,paddingBottom:(1*scale)+'px' ,paddingTop:(1*scale)+'px',...O,paddingLeft:'5px' } } >
                                            <li style={ { flex:1 ,...L , paddingLeft:'32px' } } >序号</li>
                                            <li style={ { flex:1 ,...L} } >项目</li>
                                            <li style={ { flex:2 ,...L} } >销售人员</li>
                                            <li style={ { flex:2 ,...L} } >施工人员</li>
                                            <li style={ { flex:2 ,...L} } >单价</li>
                                            <li style={ { flex:2 ,...L} } >数量</li>
                                            <li style={ { flex:1,...L} } >原价折扣</li>
                                            <li style={ { flex:1,...L} } >卡抵扣</li>
                                            <li style={ { flex:1,...L} } >实收</li>
                                            <li style={ { flex:1,...L} } >卡剩余</li>
                                          </ul>
                                          <div style={{borderLeft:'1px solid #000',padding:'20px 0 ',borderRight:'1px solid #000',borderBottom:'1px solid #000' }} >
                                            {
                                              projectInfo.map((item,i)=>
                                              <ul key={i} style={{ display:'flex' , marginLeft:'0' , paddingLeft:'0'  }}  >
                                                <li style={ { flex:1 ,...L, paddingLeft:'32px'} } >{i+1}</li>
                                                <li style={ { flex:1 ,...L} } ><Tooltip title={item.projectName} ><span>{item.projectName.slice(0,4)}</span></Tooltip></li>
                                                <li style={ { flex:2 ,...L} } >{ item.new ?
                                                <Select  style={{ width: 120 }} placeholder={ staffList.length!==0 ? staffList[0].staffName  : '销售人员' } onChange={ this.handleSaleChange.bind(this,i,'project') }>
                                                    {
                                                      staffList.map((item,i)=><Option    key={i} value={item.staffId}   >{ item.staffName }</Option>)
                                                    }
                                                </Select>
                                                  :
                                                <span> { item.salesman.map((item,i)=><span  key={i}   >{item.name || item.staff_name}  </span>) } </span>
                                                }</li>
                                                <li style={ { flex:2 ,...L} } >{
                                                    item.new ?
                                                <Select  style={{ width: 120 }} placeholder={staffList.length!==0 ? staffList[0].staffName  : '施工人员'  } onChange={ this.handleConstructChange.bind(this,i,'project') }>
                                                    {
                                                      staffList.map((item,i)=><Option    key={i} value={item.staffId}   >{ item.staffName }</Option>)
                                                    }
                                                </Select>
                                                    :
                                                    <span> { item.constructors.map((item,i)=><span  key={i}   >{item.name || item.staff_name} </span>) } </span>
                                                    }
                                                    </li>
                                                <li style={ { flex:2 ,...L} } >
                                                  {
                                                    item.clientCardType*1 === 0 || item.new  ? <InputNumber min={0} value={item.priceTem*1} onChange={ this.handerPrice.bind(this,i,'project') }  />
                                                    : <span>{item.priceTem*1}</span>
                                                  }
                                                </li>
                                                <li style={ { flex:2 ,...L} } >
                                                <span type="minus-square" onClick={this.computerMin.bind(this,i,'project')}  className={style.zl_iconadd} style={{display: item.clientCardType*1 === 0 || item.new ? '' : 'none'}} >-</span>
                                                    {item.num}
                                                <span type="plus-square" onClick={this.computerAdd.bind(this,i,'project')} style={{ marginLeft:'20px', display: item.clientCardType*1 === 0 || item.new ? '' : 'none' }}   className={style.zl_iconadd} >+</span>
                                                </li>
                                                <li style={ { flex:1,...L} } >{item.discount}</li>
                                                {/* <li style={ { flex:1 ,...L} } >{d.packageBalance}</li> */}
                                                <li style={ { flex:1,...L} } >{item.cardDeduction}</li>
                                                <li style={ { flex:1,...L} } >{item.actuallyPaid} </li>
                                                <li style={ { flex:1,...L} } >{item.cardRemain} { item.new && <i  onClick={this.delList.bind(this,i,'project')}  style={{ float:'right' , color:'#4AACF7' }}  className='iconfont icon-shanchu' ></i>   }</li>
                                              </ul>)
                                            }
                                            <Button onClick={ this.showMast.bind(this,'project') }  type='primary'  size='large' style={{ width:'116px' , marginLeft:'30px' }}  >添加项目</Button>
                                          </div>
                                          <ul  style={ { marginBottom:0,paddingBottom:(1*scale)+'px' ,paddingTop:(1*scale)+'px',...O,paddingLeft:'5px' } } >
                                            <li style={ { flex:1 ,...L , paddingLeft:'32px'  } } >序号</li>
                                            <li style={ { flex:1 ,...L} } >产品</li>
                                            <li style={ { flex:2 ,...L} } >销售人员</li>
                                            <li style={ { flex:2 ,...L} } >施工人员</li>
                                            <li style={ { flex:2 ,...L} } >单价</li>
                                            <li style={ { flex:2 ,...L} } >数量</li>
                                            <li style={ { flex:1,...L} } >原价折扣</li>
                                            <li style={ { flex:1,...L} } >卡抵扣</li>
                                            <li style={ { flex:1,...L} } >实收</li>
                                            <li style={ { flex:1,...L} } >卡剩余</li>
                                          </ul>
                                          <div style={{borderLeft:'1px solid #000',padding:'20px 0px ',borderRight:'1px solid #000',borderBottom:'1px solid #000' }} >
                                            {
                                                  productInfo.map((item,i)=>
                                                <ul key={i} style={{ display:'flex' , marginLeft:'0' , paddingLeft:'0'  }}  >
                                                  <li style={ { flex:1 ,...L , paddingLeft:'32px'} } >{i+1}</li>
                                                  <li style={ { flex:1 ,...L} } ><Tooltip title={item.productName} ><span>{item.productName.slice(0,4)}</span></Tooltip></li>
                                                  <li style={ { flex:2 ,...L} } >{ item.new ?
                                                    <Select  style={{ width: 120 }} placeholder={ staffList.length!==0 ? staffList[0].staffName  : '销售人员' } onChange={ this.handleSaleChange.bind(this,i,'product') }>
                                                      {
                                                          staffList.map((item,i)=><Option    key={i} value={item.staffId}   >{ item.staffName }</Option>)
                                                      }
                                                    </Select>
                                                    :
                                                    <span> { item.salesman.map((item,i)=><span  key={i}   >{item.name || item.staff_name}  </span>) } </span>
                                                    }</li>
                                                  <li style={ { flex:2 ,...L} } >{
                                                      item.new ?
                                                    <Select  style={{ width: 120 }}  placeholder={staffList.length!==0 ? staffList[0].staffName  : '施工人员'  } onChange={ this.handleConstructChange.bind(this,i,'product') }>
                                                      {
                                                          staffList.map((item,i)=><Option    key={i} value={item.staffId}   >{ item.staffName }</Option>)
                                                      }
                                                    </Select>
                                                      :
                                                      <span> { item.constructors.map((item,i)=><span  key={i}   >{item.name || item.staff_name}  </span>) } </span>
                                                      }</li>
                                                  <li style={ { flex:2 ,...L} } >
                                                      {
                                                        item.clientCardType*1 === 0 || item.new ? <InputNumber min={0} value={item.priceTem*1} onChange={ this.handerPrice.bind(this,i,'product') }  />
                                                        : <span>{item.priceTem*1}</span>
                                                      }

                                                  </li>
                                                  <li style={ { flex:2 ,...L} } >
                                                  <span type="minus-square" onClick={this.computerMin.bind(this,i,'product')}  className={style.zl_iconadd} style={{display: item.clientCardType*1 === 0 || item.new ? '' : 'none'}} >-</span>
                                                        {item.num}
                                                  <span type="plus-square" onClick={this.computerAdd.bind(this,i,'product')}  style={{ marginLeft:'20px', display: item.clientCardType*1 === 0 || item.new ? '' : 'none' }}  className={style.zl_iconadd} >+</span>
                                                  </li>
                                                  <li style={ { flex:1,...L} } >{item.discount}</li>
                                                  {/* <li style={ { flex:1 ,...L} } >{item.packageBalance}</li> */}
                                                  <li style={ { flex:1,...L} } >{item.cardDeduction}</li>
                                                  <li style={ { flex:1,...L} } >{item.actuallyPaid} </li>
                                                  <li style={ { flex:1,...L} } >{item.cardRemain} { item.new && <i  onClick={this.delList.bind(this,i,'product')}  style={{ float:'right' , color:'#4AACF7' }}  className='iconfont icon-shanchu' ></i>   } </li>
                                                </ul>)
                                            }
                                            <Button  onClick={ this.showMast.bind(this,'product') }  type='primary'  size='large' style={{ width:'116px' ,marginLeft:'30px'  }}  >添加产品</Button>
                                          </div>
                                          { getTableComputerPrice(2,scale,data.computerPrice || data.setComputerPrice ,B,D2,obj) }
                                          <div style={{ ...B }} >
                                              <p style={ { ...D2 }  } > 单据备注： { data.billingRemark  }</p>
                                          </div>
                                          { getTableProSetting( 2,scale,data.storeSetting,B,D2 ) }
                                          { getTableFooter(scale) }
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className={style.zl_foot} >
                                  {/* <Button type='primary'  size='large'  onClick={this.submit}  style={{ width:'132px' , float:'right' }}  >保存B单</Button>
                                  <Button type='default'  size='large' onClick={ ()=>updateOrderB() }  style={{ width:'132px' , marginRight:'20px' , float:'right' }}  >放弃修改</Button> */}
                                  <Button type='primary'  size='large' onClick={this.submit.bind(this,true)}   style={{ width:'132px' , float:'right' }}  >保存并打印</Button>
                                  <Button type='default'  size='large' onClick={this.submit}  style={{ width:'132px' , marginRight:'20px' , float:'right' }}  >保存</Button>
                                </div>
                                { mastShow && <Mast  handBack={ this.handBack }   type={showType} closeMast={this.closeMast}   />  }
                            </div>
                            { !printShow ||  <div className={  style.zl_MastL  }>
                                  <PrintStatement scale={0.5} type={printType}  data={ printData }  />
                              </div>
                            }
                  </div>
    }

}
function mapStateToProps(state) {
    const {  siderFold } = state.app
    return {  siderFold  }
}
export default connect(mapStateToProps)(updateBlist)
