import React,{ Component } from 'react'
import  styles  from '../styles.less'
import { connect } from "dva"
import services from "services"
import { Button, message,Modal,Popover } from 'antd'
import moment from "moment"
import CheckCar from '../checkCar/index'
import CustomerInfor from "../customerInfor/index.js"
import  { selectList }  from './data.js'
import PrintStatement from '../../mimeograph/receipts/billingPay'
import PrintRequisition from '../../mimeograph/receipts/billingMateriel'
import PrintReceipt from '../../mimeograph/receipts/billingReceipt'
import PrintConstruction from '../../mimeograph/receipts/billingConstruction'
import PrintCityOrder from '../../mimeograph/receipts/billingCityOrder'
import PrintCarInspection from '../../mimeograph/receipts/billingCarInspection'
import Mast from "../components/popmast.js" // 修改历史组件
import ServiceTable from './table.js'
import { data } from '../../maintain-billing/cacheData'
import router from 'umi/router'
const OliType=['','空','小于1/4','1/4','1/2','3/4','满']
let state
//控制按钮
const showHiddenBtn =(state1,state2)=>{
      state1 === 4 || state2 > 0 ? state=true : false
      return state
}
const filterTime=(data)=>{
    let time
    data === 0 ? time=null : time= moment(data * 1000).format("YYYY-MM-DD HH:mm:ss ")
    return time
}
class Klist extends Component{
    constructor(){
        super()
        this.state={
            max:1,
            selectList,
            isshowcustom:true,
            visible:false,
            CheckCarId:null,
            printShowType:null,
            printShow:false,
            printShow_W:false, //控制维修单是否显示
            data:null,
            mastType: null,
            mastShow: false,
            cancelId: null,
            currentPage: 1,
            formObj: {},
            loading: true,
            routineCheckData:{}, // 常规验车数据
            kindCheckData: {}, // 36项检查数据
            cityOrder: null,// 36打印数据
            showityOrder: false,// 36是否打印
            carInspection: null,// 车检打印数据
            showCarInspection: false,// 车检是否打印
        }
    }
    goback = () => {
        const { goDetail } = this.props
        if(goDetail.orderId){
          router.push(goDetail.path)
        }else{
            this.props.notShow()
        }
    }
    sonClick = (goDetail) => {
        const { path , goClient } = goDetail
        if(goClient){
            router.push(path)
        }else{
          this.setState({ isshowcustom: true  })
        }
    }
    customerInfor = () => {
        this.setState({ isshowcustom:false  })
    }
    componentWillUnmount(){
        const { dispatch } = this.props
        dispatch({
            type:'maintianList/goDetail',
            payload:{},
        })
        document.removeEventListener('keydown',this.eventKeyUp)
    }
    componentDidMount(){
        const { detailList , goDetail } = this.props
        console.log(detailList,goDetail,'--------------------')
        let orderType = detailList.orderType
        if(orderType*1 === 4){
            services.maintainKlistDetail( { keys: {name: 'quick/order/',id:detailList.orderId} } ).then(res=>{
                if(res.success){
                  this.setState({ selectList:res.data  },()=>{
                    if(goDetail.goClient){
                        this.setState({
                            isshowcustom:false,
                        })
                    }
                    res.data.order.isInspection && this.getCheckReport(detailList.orderId)
                  })
                }
                else{
                message.info( '网络出现错误' )
                if(goDetail.goClient){
                    setTimeout(()=>{
                        router.push(goDetail.path)
                    },1000)
                }
                }
            })
        }else if(orderType*1 === 3){
            services.maintainListDetail( { keys: {name: 'maintainList/detail/',id:detailList.orderId} } ).then(res=>{
                  if(res.success){
                      this.setState({
                          selectList:res.data,
                          },()=>{
                              if(goDetail.goClient){
                                  this.setState({
                                      isshowcustom:false,
                                  })
                              }
                              res.data.order.isInspection && this.getCheckReport(detailList.orderId)
                          })
                  }else{
                      message.info( '网络出现错误' )
                      if(goDetail.goClient){
                          setTimeout(()=>{
                              router.push(goDetail.path)
                          },1000)
                      }
                  }
            })
        }
        document.addEventListener('keydown',this.eventKeyUp)
        console.log(this.state.selectList)

    }

    getCheckReport(id){
      // 请求车检报告数据
      services.checkCarReport({ keys: {name: 'maintain/report/',id:id },data:{ report:'convention'  } }).then(res=>{
          res.success ? this.setState({
            routineCheckData:res.data ,
          }) : message.info('网络出现错误')
      })
      // 请求36项检查数据
      services.checkCarReport({ keys: {name: 'maintain/report/',id:id },data:{ report:'synthesis'  } }).then(res=>{
          if(res.code==='0'){
              this.setState({ kindCheckData:res.data })
          }else{
              message.info('网络异常')
          }
      })
    }
    eventKeyUp=(e)=>{
        const { printShow } = this.state
        if(!printShow) return
        e.key === 'Escape' || e.key === 'Enter' ? this.setState({ printShow:false }) : null
    }
    changeMast=(visible,CheckCarId)=>{
        this.setState({
             visible,
             CheckCarId,
        })
    }
       //判断油表类型
    handerOilType=(Type)=>{
        return OliType[Type]
    }
    //快捷单打印事件 1：打印结算单 2：打印小票
    showPrint_K=(printShowType,id)=>{
        const { printShow  } = this.state
        if(printShowType===1){
          services.printingOperationQuick({ keys:{ name:'printing/operation/order/quick/',id } })
          .then(res=>{
              res.success ? this.setState({
                      data:res.list,
                      printShowType,
                      printShow:!printShow,
                  }) :message.info('网络出现错误')
          })
        }else if (printShowType===2){
          services.printingMaintainReceipt( { keys:{ name:'printing/operation/card/',id } })
              .then( res=>{
                  res.success ? this.setState({
                      data:res.data,
                      printShowType,
                      printShow:!printShow,
                  }) :message.info('网络出现错误')
              })
        } else if(printShowType===6) {
          // 36
          services.DETAIL({ keys:{ name:'printing/operation/security-check', id } }).then(res=>{
            if(res.success) {
              this.setState({
                cityOrder:res.data,
                showityOrder: true,
              })
            } else {
              message.info('网络出现错误')
            }
          })
        } else if(printShowType===7) {
          // 打印常规车检单
          services.DETAIL({ keys:{ name:'printing/operation/routine-inspection', id } }).then(res=>{
            if(res.success) {
              this.setState({
                carInspection:res.data,
                showCarInspection: true,
              })
            } else {
              message.info('网络出现错误')
            }
          })
        }
    }
    //维修单打印事件
    showPrint_W = (printShowType,orderId) => {
      //异步获取打印数据
      let getdata=new Promise((resolve)=>{
          resolve( this.getPrintData(printShowType,orderId)  )
      })
      getdata.then(data=>{
          if(data===null) {
              message.info('网络出现错误')
              return
          }
          console.log(printShowType,data,'维修单详情里面的打印数据')
          this.toPrinting( printShowType ,data )
      })
    }
    // 去打印
    toPrinting=(printShowType,data)=>{
      const { printShow_W } = this.state
      this.setState({
          printShowType,
          printShow_W:!printShow_W,
          data,
      })
    }
    //获取打印数据
    async getPrintData(Type,id){
      let data
      try{
            switch( Type ){
              case 1:
                  await services.printingOperationMaintain({ keys:{ name:'printing/operation/order/statements/',id } })
                  .then(res=>{
                      res.success ?  data=res.list : message.info( '网络出现错误' )
                  })
              break
              case 2:
                  await services.printingMaintainReceipt( { keys:{ name:'printing/operation/billing/',id } })
                  .then( res=>{
                      res.success ?  data=res.data : message.info( '网络出现错误' )
                  })
              break
              case 3:
                  await services.printingOperationMaterialPick( { keys:{ name:'printing/operation/material/pick/',id } })
                  .then( res=>{
                      res.success ?  data=res.list : message.info( '网络出现错误' )
                  })
              break
              case 4:
                  await services.printingOperationMaterialReturn( { keys:{ name:'printing/operation/material/return/',id } })
                  .then( res=>{
                      res.success ?  data=res.list : message.info( '网络出现错误' )
                  })
              break
              case 5:
                  await services.printingConstruct( { keys:{ name:'printing/operation/construction/',id } })
                  .then( res=>{
                      res.success ?  data=res.list : message.info( '网络出现错误' )
                  })
              break
              default:
              break
            }
          }
      catch{
            data=null
          }
          console.log(data,'alll')
          return data
    }
    //显示不同分类的打印单
    showTypeData=(printShowType,data)=>{
        switch( printShowType ){
            case 1 : // 结算单
            return <PrintStatement scale={0.5} type={0} data={data}  />
            case 2 : // 小票
            return <PrintReceipt scale={0.25} type={1} data={data} print={true}  />
            case 3 : // 领料单
            return <PrintRequisition scale={0.5} type={0} data={data } />
            case 4 : // 退料单
            return <PrintRequisition scale={0.5} type={1} data={data } />
            case 5 : // 施工单
            return <PrintConstruction scale={0.5} data={data} />
            default:
            return
        }
    }
    //修改历史按钮事件以及作废
    mastShow = (mastType, cancelId) => {
      //mastType:1 作废  2：修改历史
      this.setState({
        mastType,
        cancelId,
        mastShow: !this.state.mastShow,
      })
    }
    // 关闭修改历史弹窗事件
    notShow = () => {
      this.setState({
        mastShow: false,
      })
    }
    // 更新列表数据
    getData = (boolean) => {
      let o = {}
      const { dispatch } = this.props
      const { formObj } = this.state
      boolean ? null : (o = formObj)
      this.setState(
        {
          currentPage: 1,
          formObj: o,
          loading: false,
        },
        () => {
          this.setState({
            loading: true,
          })
          //返回列表页
          this.props.notShow('loading')
          dispatch({
            type: "maintianList/getData",
            payload: {q: {page:1,limit:10,where:{'state|deleted': [4,1]},order:{},curSize:10}},
          })
          // // 已挂账
          // dispatch({
          //   type: "maintianList/getData",
          //   payload: { q: { where: { "arrears[!]": 0 } } },
          // })
          // // 已完成
          // dispatch({
          //   type: "maintianList/getData",
          //   payload: { q: { where: { state: 4, arrears: 0 } } },
          // })
          // // 已作废
          // dispatch({
          //   type: "maintianList/getData",
          //   payload: { q: { where: { deleted: 0 } } },
          // })
        }
      )
    }
    // 渲染常规车检内容
    renderRoutineCheckData(data){
      let functions = data.functions || []
      let appearance = data.appearance || []
      let funArr = functions.map(item=>{
        return item.text
      })
      let AppArr = appearance.map(item=>{
        var value=item.value
          .map((item,idx)=>{
             return idx === 0 ? item : '/'+item
          }).join('')
          if(item.position*1===1){
            return '车身右侧-' + value
          }else if(item.position*1===2){
            return '车身左侧-' + value
          }else if(item.position*1===3){
            return '车顶-' + value
          }else if(item.position*1===4){
            return  '车头-' + value
          }else if(item.position*1===5){
            return  '车尾-' + value
          }
      })
      return [...funArr,...AppArr].map(v=>{
        return v + '; '
      })
    }
    // 渲染36项检查内容
    renderKindCheckData(content){
      let cont = content.security || []
      let index=[]
      cont
      .forEach((item)=>{
         data
          .forEach(i=>{
              if(item.index === i.index){
                  item['carType'] = i.carType
                  item['type'] = i.type
                  item['project'] = i.project
              }
          })
      })
      cont
      .forEach(i=>{
          index.indexOf(i.carType) >= 0 ? null : index.push(i.carType)
      })

      return (<span>
                { index.map((item,i)=>{
                  return  <span key={ i } >
                                {  cont.filter(o=>o.carType === item&&o.result!==1 ).map((v,i)=><span key={i}>{ v.project  } - { v.result === 1 ? '正常' : '异常'  };&nbsp;</span>) }
                            </span>
                        })
                }
             </span>)
    }
    // 反结事件
    antiknot(orderId){
      let title = '该订单将被撤销，并新建一个新订单，是否确定反结?'
      let _this = this
      Modal.confirm({
        title: title,
        content: '',
        okText: '确认',
        cancelText: '取消',
        icon: (
          <p className="iconfont icon-tishi" style={{ color: '#FF303D',fontSize: '48px', margin: '0', textAlign: 'center'}} ></p>
        ),
        centered: true,
        maskClosable: true,
        maskStyle: {
          background: 'rgba(0,0,0,0.65)',
        },
        className: 'madalDiv',
        onOk() {
          _this.repeatCreate(orderId)
        },
      })
    }
    // 发结
    repeatCreate =(orderId) => {
      // console.log('orderId',orderId)
      services.repeatCreate( { keys: {name: 'maintain/repeatCreate/', order_id: orderId} } ).then(res=>{
        if(res.success){
          router.push({
            pathname: "/boss-store/pending-order",
            query: {
              orderId: res.data.id || orderId,
              orderType: res.data.type || this.props.detailList.orderType ,
            },
          })
        }
      })
    }
    // 结算方式渲染
    renderPayRecord=(paymentRecord,repaymentRecord)=>{
      let countCardArray = [] // 计次卡数组
      let otherArray = [] //充值卡和其他普通支付方式数组
      Array.isArray(paymentRecord)&&paymentRecord.forEach(item=>{
        if(item.type*1===2){
          countCardArray.push(item)
        }else{
          otherArray.push(item)
        }
      })
      // console.log(countCardArray,otherArray,'023490')
      return (
        <span>
            <span>
              {
                countCardArray&&countCardArray.map(item=>{ // 计次卡
                  return item.paymentName
                }).join(' , ')
              }
              {
                otherArray.length > 1 ? ( countCardArray.length > 0 ? '/混合支付: ' : '混合支付: ' )  : (countCardArray.length!==0&&otherArray.length===1?' , ':'')
              }
              {
                otherArray&&otherArray.map(item=>{
                  if(item.type*1===3){//充值卡
                    return item.paymentName+ '(使用￥' + item.paymentMoney + ',剩余￥' + item.balance + ')'
                  }else{ // 普通支付
                    return item.paymentName+ '(￥' + item.paymentMoney + ')'
                  }
                }).join(' ; ')
              }
            </span>
            <div style={{marginLeft:'74px'}}>
                {repaymentRecord&&<div style={{color:'#FF8756'}}>已还款</div>}
                {repaymentRecord&&<span>还款方式: </span>}
                {
                  repaymentRecord&&repaymentRecord.map(item=>{
                    if(item.type*1===3){//充值卡
                      return item.paymentName+ '(使用￥' + item.paymentMoney + ',剩余￥' + item.balance + ')'
                    }else if(item.type*1===2){ // 计次卡
                      return item.paymentName
                    }else{ // 普通支付
                      return item.paymentName+ '(￥' + item.paymentMoney + ')'
                    }
                  }).join(' ; ')
                }
            </div>
        </span>
      )
    }

    produceBlist = (orderId,orderType,type) => {
      console.log(this.props.produceBlist)

      if(this.props.produceBlist){
        this.props.produceBlist(orderId,orderType,type)
      }else{
        // 其他页面跳到详情页面然后点击生成b单，此时订单状态未知，默认与已挂账状态一致
        services
        .produceBlist({ keys: { name: "store/vice/order" }, data: { orderId } })
        .then((res) => {
          if(res.success){
            this.getData()
            message.success("成功生成B单")
          }
        })
      }
    }

    render(){
        const { selectList, visible , CheckCarId ,printShowType ,data,printShow,printShow_W,mastType,cancelId, mastShow, routineCheckData, kindCheckData, showityOrder, cityOrder, showCarInspection, carInspection } = this.state
        const { detailList ,isCancel ,goDetail , siderFold } = this.props
        console.log(selectList,this)
        return <div>
            {
                this.state.isshowcustom ?
                <div>
                <div className={ styles.zl_detailList }  style={{zIndex:'8', left: siderFold ? '80px' : '200px'  }}  >
                    <div className={ styles.zl_listOne } style={{ height:'60px' }} >
                        <span>订单列表 > 订单详情 </span>
                        {/* <span><i  className="iconfont icon-bangzhu" ></i>帮助中心 </span> */}
                    </div>
                    <div className={ styles.wyc_top } >
                         <div className={styles.wyc_topdiv}>
                           <div className={styles.wyc_title_left}><i  className={ styles.zl_blueD } ></i><span className={styles.wyc_orderid}>{ selectList.order.orderId }</span><span className={detailList.orderType*1===4?styles.wyc_ordertype_k:styles.wyc_ordertype_w}>{detailList.orderType*1===4?'快捷':'维修'}</span></div>
                           <div className={styles.wyc_btn_div}>
                              {/*已作废的订单不显示 作废按钮 和 生成B单按钮 以及 打印按钮*/}
                              {(detailList.type !==3 && selectList.order.deleted !==1) &&<Button  className={styles.wyc_detail_btn} type="primary" style={{color:'#fff'}} onClick={ detailList.orderType*1===4 ? this.showPrint_K.bind(this,1,selectList.order.orderId) : this.showPrint_W.bind(this,1,selectList.order.orderId) } >打印结算单</Button>}
                              {(detailList.type !==3 && !goDetail.isHideDetailBtns&&selectList.order.deleted !==1 )&&<Button  className={styles.wyc_detail_btn} onClick={this.produceBlist.bind(this,selectList.order.orderId,detailList.orderType,detailList.type)} >生成B单</Button>}
                              {(detailList.type !==3 && selectList.order.deleted !==1) &&  <Popover content={'对订单作废后重开，反结后按今日订单计算'}><Button  className={styles.wyc_detail_btn} onClick={ this.antiknot.bind(this,selectList.order.orderId) } > 反结<i className='iconfont icon-wenhao' style={{marginLeft:'5px'}}/></Button></Popover>}
                              {(detailList.type !==3 && !goDetail.isHideDetailBtns&&selectList.order.deleted !==1 ) && <Button  className={styles.wyc_detail_btn} onClick={ this.mastShow.bind(this, 1, selectList.order.orderId) } >作废</Button>}
                              {(detailList.type !==3 && selectList.order.deleted !==1 )&&<Button  className={styles.wyc_DyButton} >
                                  其他单据
                                  {
                                    detailList.orderType*1===4 ?
                                    <ul className={ styles.wyc_zl_Ty_k } >
                                      <li onClick={  this.showPrint_K.bind(this,2,selectList.order.orderId)  } > <span >打印小票</span> </li>
                                      <li onClick={  this.showPrint_K.bind(this,6,selectList.order.orderId)  } > <span >36项车检单</span> </li>
                                      <li onClick={  this.showPrint_K.bind(this,7,selectList.order.orderId)  } > <span >常规车检单</span> </li>
                                    </ul>
                                    :
                                    <ul className={ styles.wyc_zl_Ty_w } >
                                      <li  onClick={ this.showPrint_W.bind(this,2,selectList.order.orderId) } > <span>打印小票</span> </li>
                                      <li  onClick={ this.showPrint_W.bind(this,3,selectList.order.orderId) }  > <span>打印领料单</span> </li>
                                      <li  onClick={ this.showPrint_W.bind(this,4,selectList.order.orderId) } > <span>打印退料单</span> </li>
                                      <li  onClick={ this.showPrint_W.bind(this,5,selectList.order.orderId) } > <span>打印施工单</span> </li>
                                      <li onClick={  this.showPrint_K.bind(this,6,selectList.order.orderId)  } > <span >36项车检单</span> </li>
                                      <li onClick={  this.showPrint_K.bind(this,7,selectList.order.orderId)  } > <span >常规车检单</span> </li>
                                    </ul>
                                  }
                              </Button>}

                              {/* {  showHiddenBtn(selectList.order.state,selectList.order.deleted) ||
                                 <Button
                                    className={styles.wyc_detail_btn}
                                    onClick={()=>this.props.updateOrder(detailList.orderId, detailList.orderType)}
                                  >
                                    修改订单
                                  </Button>
                              } */}
                              <Button  className={styles.wyc_detail_btn} onClick={ this.goback } >返回上一级</Button>
                           </div>
                         </div>
                         <div className={styles.wyc_namediv}>
                            <div className={styles.wyc_namediv_left}><i className="iconfont icon-submenu16" style={{color:'#4AACF7',marginRight:'10px',verticalAlign:'middle'}}></i><span className={styles.wyc_name}>{ selectList.order.clientName }</span><span className={styles.wyc_iphone} onClick={ this.customerInfor }>{selectList.order.phone ? selectList.order.phone : '散客' }</span></div>
                            <div className={styles.wyc_namediv_left}><i className="iconfont icon-che" style={{color:'#4AACF7',marginRight:'10px',fontSize:'10px'}}></i><span className={styles.wyc_carnum}>{selectList.order.carNum} { selectList.order.carType }</span></div>
                            <div className={styles.wyc_namediv_right}><span className={styles.wyc_name_right}>{selectList.order.payPerson }</span><span className={styles.wyc_time_right}>{ filterTime( selectList.order.paytime ) }</span></div>
                         </div>
                        <div className={styles.wyc_top_bom}>
                            <div className={styles.wyc_firstP}>
                              <div className={styles.wyc_fl}><span className={styles.wyc_fl_name}>服务顾问:</span><span className={styles.wyc_fl_content}>{ selectList.order.service }</span></div>
                              {(selectList.order.carMlie!==0)&&<div className={styles.wyc_fl}><span className={styles.wyc_fl_name}>进店里程:</span><span className={styles.wyc_fl_content}>{ selectList.order.carMlie } km</span></div>}
                              {(selectList.orderDetail.oilMeter!==0)&&<div className={styles.wyc_fl}><span className={styles.wyc_fl_name}>进店油表:</span><span className={styles.wyc_fl_content}>{  this.handerOilType(selectList.orderDetail.oilMeter) }</span></div>}
                              {(selectList.order.updated&&selectList.order.updated!==0)&&<div className={styles.wyc_fl}><span className={styles.wyc_fl_name}>进店时间:</span><span className={styles.wyc_fl_content}>{ moment(filterTime( selectList.order.updated )).format('YYYY-MM-DD')  }</span></div>}
                              <div className={styles.wyc_fr}><span style={{color:'#4AACF7',cursor:'pointer'}} onClick={this.mastShow.bind(this, 2, selectList.order.orderId)}>订单修改历史</span></div>
                            </div>
                            {selectList.orderDetail.clientSay&&<p className={styles.wyc_firstP}><span className={styles.wyc_left_txt}>车店嘱咐:</span><span className={styles.wyc_right_txt}>{ selectList.orderDetail.clientSay }</span></p>}
                            {/* <p className={styles.wyc_firstP}><span className={styles.wyc_left_txt}>门店备注(门店可见):</span><span className={styles.wyc_right_txt}>{selectList.orderDetail.remark}</span></p> */}
                            {selectList.orderDetail.kindRemin&&<p className={styles.wyc_firstP}><span className={styles.wyc_left_txt}>温馨提示(顾客可见):</span><span className={styles.wyc_right_txt}>{selectList.orderDetail.kindRemin }</span></p>}
                            {selectList.orderDetail.faultDes&&<p className={styles.wyc_firstP}><span className={styles.wyc_left_txt}>故障描述:</span><span className={styles.wyc_right_txt}>{selectList.orderDetail.faultDes }</span></p>}
                            {selectList.orderDetail.mainSug&&<p className={styles.wyc_firstP}><span className={styles.wyc_left_txt}>维修建议:</span><span className={styles.wyc_right_txt}>{selectList.orderDetail.mainSug}</span></p>}
                            {<p className={styles.wyc_firstP}><span className={styles.wyc_left_txt}>质保说明:</span><span className={styles.wyc_right_txt}>{ selectList.orderDetail.instructionDay}天/{selectList.orderDetail.instructionKm}公里</span></p>}
                            {<p className={styles.wyc_firstP}><span className={styles.wyc_left_txt}>终检:</span><span className={styles.wyc_right_txt}>{ selectList.orderDetail.finalInspection===1 ? '是' : '否'   }</span></p>}
                            {isCancel  ||  (selectList.order.isInspection === true && <p className={styles.wyc_firstP}><span className={styles.wyc_left_txt}>常规车检:</span><span className={styles.wyc_right_txtcolor}>{this.renderRoutineCheckData(routineCheckData)}</span></p>) }
                            {isCancel  ||  (selectList.order.isInspection === true && <p className={styles.wyc_firstP} style={{paddingRight:'144px'}}><span className={styles.wyc_left_txt}>36项检查:</span><span className={styles.wyc_right_txtcolor}>{this.renderKindCheckData(kindCheckData)}</span></p>) }
                            {isCancel  ||  (selectList.order.isInspection === true &&
                              <div className={styles.wyc_carcheckresult}>
                                <Button
                                  onClick={ this.changeMast.bind(this,true,selectList.order.orderId) }
                                  disabled={ selectList.order.hasCarReport === 0 ? true : false   }
                                  type="primary" className={styles.wyc_detail_btn}
                                >车检报告</Button>
                              </div>)
                            }
                        </div>
                    </div>
                    <ServiceTable  selectList={ selectList }   />
                    {selectList.giveLoodsLogs&&selectList.giveLoodsLogs.length!==0&&
                      <div className={ styles.zl_listSix } >
                          <p> <i  className={ styles.zl_blueD } ></i>赠送信息 </p>
                            {
                              selectList.giveLoodsLogs.map(item=>{
                                return (
                                  <div>
                                    <div style={{marginBottom:'10px'}}><span className={styles.wyc_song_name}>{item.type===1?'项目:':'产品:'}</span><span className={styles.wyc_song_cont}>{item.name} x {item.num}</span></div>
                                  </div>
                                )
                              })
                            }
                      </div>
                    }
                    <div className={ styles.wyc_listSix } >
                         <p> <i  className={ styles.zl_blueD } ></i>结算信息 </p>
                         <div className={styles.wyc_jiesuan}>
                            <div className={styles.wyc_jiesuan_left}>
                              <div style={{marginBottom:'10px'}}><span className={styles.wyc_song_name}>结算方式 :</span><span className={styles.wyc_song_cont}>{  this.renderPayRecord(selectList.paymentRecord||[],selectList.repaymentRecord)  }</span></div>
                              {selectList.orderDetail.remark&&<div>
                                <span className={styles.wyc_song_name} style={{marginLeft:'30px'}}>备注 :</span><span className={styles.wyc_song_cont}>{selectList.orderDetail.remark}</span>
                              </div>}
                            </div>
                             <div className={styles.wyc_jiesuan_right}><span className={styles.wyc_price_title}>实收总金额</span><span className={styles.wyc_price}><span className={styles.wyc_price_dolo}>￥</span><span className={styles.wyc_price_count}>{selectList.order.price}</span></span></div>
                         </div>
                    </div>
                    {!mastShow || (
                      <Mast
                        // reasonState={true}
                        mastType={mastType}
                        cancelId={cancelId}
                        notShow={this.notShow}
                        getData={this.getData}
                      />
                    )}
                    <CheckCar
                     visible={ visible  }
                     changeMast= { this.changeMast }
                     orderId = { CheckCarId }
                      />
                </div>
                    {//快捷单
                      !printShow ||
                      <div className={  styles.zl_MastL  } >
                        { printShowType === 1 ? <PrintStatement scale={0.5} type={1}  data={ data }  /> :null }
                        { printShowType === 2 ? <PrintReceipt scale={ 0.25 } type={ 1 } data={ data }  print={true}  /> :null  }
                      </div>
                    }
                    {//维修单
                      !printShow_W ||
                      <div className={  styles.zl_MastL  } >
                        { this.showTypeData( printShowType , data ) }
                      </div>
                    }
                </div>
                :
                <CustomerInfor
                  clientId={selectList.order.clientId}
                  updateOrder={this.props.updateOrder}
                  goBack={this.sonClick}
                  goClient={{ goClient:goDetail.goClient , path:goDetail.path }}
                />
            }
            {//打印36
              showityOrder &&
              <div className={styles.zl_MastL}>
                <PrintCityOrder scale={0.5} type={1} reload={true} data={cityOrder}/>
              </div>
            }
            {//打印车检
              showCarInspection &&
              <div className={styles.zl_MastL}>
                <PrintCarInspection scale={0.5} type={1} reload={true} data={carInspection}/>
              </div>
            }
        </div>
    }
}
function mapStateToProps(state) {
    const {   goDetail  } = state.maintianList
    const {  siderFold } = state.app
    return {  goDetail ,siderFold  }
}
export default connect(mapStateToProps)(Klist)
