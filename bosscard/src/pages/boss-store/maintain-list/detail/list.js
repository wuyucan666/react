import React,{ Component } from 'react'
import  styles  from '../styles.less'
import {connect}   from 'dva'
import services from "services"
import {Steps, Popover , Button,Table, message } from 'antd'
import moment from "moment"
import CustomerInfor from "../customerInfor/index.js"
import  { selectList }  from './data.js'
import CheckCar from '../checkCar/index'
import PrintStatement from '../../mimeograph/receipts/billingPay'
import PrintRequisition from '../../mimeograph/receipts/billingMateriel'
import PrintReceipt from '../../mimeograph/receipts/billingReceipt'
import PrintConstruction from '../../mimeograph/receipts/billingConstruction'
import router from 'umi/router'
const { Column } = Table
const Step = Steps.Step
const statusArr=[ '接车','验车','报价','派工','结账','提车' ]
const maintainType=[ '普通维修','保险维修','内部维修','其他维修' ]
const OliType=['','空','小于1/4','1/4','1/2','3/4','满']
let state
const customDot = (dot, { status, index }) => (
    <Popover content={<span>step {index} status: {status}</span>}>
      {dot}
    </Popover>
  )
//进度展示
const controlStatus = ((item,dot,status)=>{
        if(status>dot) return
        return (
                <div style={ { marginLeft:"50px"} } >
                     {/* <p style={ {  textAlign: 'left',fontWeight:'normal',fontSize:'14px',border:'0 none',margin:0,color:'rgba(153,153,153,1)!important' } }  >{ item.name} { dot>status ? <i  className="iconfont icon-xuanzhong" ></i> :null || dot===status ? <i  className="iconfont icon-gongshishezhi" ></i> :null  } </p> */}
                     <p style={ {textAlign: 'left', fontWeight:'normal',fontSize:'14px',margin:0,border:'0 none',color:'rgba(153,153,153,1)!important' } }  > {  !item.time || item.time===0 ? '': moment(item.time * 1000).format("YYYY-MM-DD HH:mm:ss ") } </p>
                </div>
                )
})
//控制按钮
const showHiddenBtn =(state1,state2)=>{
      state1 === 4 || state2 > 0 ? state=true : false
      return state
}
//时间筛选
const filterTime=(data)=>{
    let time
    data === 0 ? time=null : time= moment(data * 1000).format("YYYY-MM-DD HH:mm:ss ")
    return time
}
class List extends Component{
    constructor(){
        super()
        this.state={
            max:1,
            selectList,
            isshowcustom:true,
            visible:false,
            CheckCarId:null,
            printShow: false,
            printShowType:null,
            data:null,
            progress:[],
        }
        this.showPrint=this.showPrint.bind(this)
    }
    notShow = () => {
        const { goDetail } = this.props
        if(goDetail.orderId){
          router.push(goDetail.path)
        }else{
            this.props.notShow()
        }
    }
    customerInfor = () => {
      this.setState({ isshowcustom:false  })
    }
    sonClick = (goDetail) => {
    const { path , goClient } = goDetail
      if(goClient){
          router.push(path)
      }else{
        this.setState({ isshowcustom: true  })
      }
    }
    changeMast=(visible,CheckCarId)=>{
        this.setState({
             visible,
             CheckCarId,
        })
    }
    getgrandSon = (e) => {
      services.maintainListDetail( { keys: {name: 'maintainList/detail/',id:e} } ).then(res=>{
             this.setState({ selectList:res.data  })
      })
    }
    //事件监听键盘事件
    componentDidMount(){
        const { goDetail , detailList } = this.props
        services.maintainListDetail( { keys: {name: 'maintainList/detail/',id:detailList.orderId} } ).then(res=>{
            if(res.success){
                this.setState({
                    selectList:res.data,
                    progress:this.controlCurrent(res.data.progress),
                     },()=>{
                        if(goDetail.goClient){
                            this.setState({
                                isshowcustom:false,
                            })
                        }
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
        document.addEventListener('keydown',this.eventKeyUp)
    }
    eventKeyUp=(e)=>{
        const { printShow } = this.state
        if(!printShow) return
        e.key === 'Escape' || e.key === 'Enter' ? this.setState({ printShow:false }) : null
    }
    componentWillUnmount(){
        const { dispatch } = this.props
        dispatch({
            type:'maintianList/goDetail',
            payload:{},
        })
        document.removeEventListener('keydown',this.eventKeyUp)
    }

    controlCurrent=(progress)=>{
        if( Object.prototype.toString.call(progress)
        .slice(8,-1) === 'Array' ){
            let status ,value
            progress
            .forEach((item)=>{
                item.node === 'complete' ? status=4 :null
                value=item.time
            })
            progress
            .forEach((item)=>{
                item.node === 'driving' ? status=5 :null
                value=item.time
            })
            if(status===4){
                return [...progress,...this.handerCover(5-progress.length,value)]
            }else if(status===5){
                return [...progress,...this.handerCover(6-progress.length,value)]
            }else{
                return progress
            }
        }else{
            return []
        }
    }
    //补位操作
    handerCover=(val,time)=>{
        var arr=[]
        for(var i=0;i<val;i++){
           i === val-1 ? arr.push({ time  }) : arr.push({  })
        }
        return arr
    }
    //判断维修类型
    handerMaintainType=(Type)=>{
       return maintainType[Type-1]
    }
    //判断油表类型
    handerOilType=(Type)=>{
       return OliType[Type]
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
    toPrinting=(printShowType,data)=>{
        const { printShow } = this.state
       this.setState({
           printShowType,
           printShow:!printShow,
           data,
       })
    }
    //判断显示类型
    showPrint(printShowType,orderId){
        //异步获取打印数据
        let getdata=new Promise((resolve)=>{
            resolve( this.getPrintData(printShowType,orderId)  )
        })
        getdata.then(data=>{
            if(data===null) {
                message.info('网络出现错误')
                return
            }

            this.toPrinting( printShowType ,data )
        })
    }
    //显示分类数据
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
    renderPerson(list,type,i){

        if(list.length===0)return
        if(!list)return
        if(type==='construction'){
            return <div>
                    { list[i].construction.map(((item,idx)=>{
                        return <p style={ {  fontWeight:'normal', fontSize:'12px',border:'0 none' ,marginBottom:'0'  } }  key={idx} >{item.name}{`(${ item.scale }%)`}</p>
                    }))  }
                 </div>
        }else if( type==='salePerson' ){
            return <div>
                    { list[i].salePerson.map(((item,idx)=>{
                        return <p style={ {  fontWeight:'normal', fontSize:'12px',border:'0 none' ,marginBottom:'0'  } }  key={idx} >{item.name}{`(${ item.scale }%)`}</p>
                    }))  }
                 </div>
        }

    }
    render(){
        const { selectList , visible , CheckCarId , printShow ,printShowType ,data, progress} = this.state
        const { detailList, isCancel , goDetail ,siderFold } = this.props
        console.log(progress,'2222222222')
        return <div>
            {
                this.state.isshowcustom ?
                <div className={ styles.zl_detailList }  style={{ left: siderFold ? '80px' : '200px'  }}  >

                    <div className={ styles.zl_listOne } style={{ height:'60px' }} >
                        <span>订单列表 > 订单详情 </span>
                        {/* <span><i  className="iconfont icon-bangzhu" ></i>帮助中心 </span> */}
                    </div>
                    <div className={styles.yc_backdiv}><div className={styles.yc_back}><Button  className={styles.yc_backbtn} onClick={ this.notShow } >  <i className='iconfont icon-fanhui1'></i>返回上一级 </Button></div></div>
                   {/* main */}
                   <div style={{padding:'0 32px'}}>
                      <div className={ styles.zl_listTwo } >
                          <p>
                              <span style={{ fontWeight:'bold' }} > <i  className="iconfont icon-hunhezhifu" ></i>单号 ：{ selectList.order.orderId } </span>
                              <span>
                                  { selectList.order.isReport ===  0 || isCancel|| selectList.order.isInspection === false  ||<Button   onClick={ this.changeMast.bind(this,true,selectList.order.orderId) }   disabled={ selectList.order.hasCarReport === 0 ? true : false   }  style={{ width:'120px',height:'36px' ,marginLeft:'24px',textAlign:'center',paddingLeft:'28px',fontSize:'14px',fontFamily:'MicrosoftYaHei',fontWeight:'400'}}   > 车检报告 </Button>  }
                                  { isCancel ||
                                    <Button  className={ styles.zl_DyButton }   type="primary"   style={{ width:'120px',height:'36px' ,marginLeft:'24px',textAlign:'center',paddingLeft:'20px',fontSize:'14px',fontFamily:'MicrosoftYaHei',fontWeight:'400'}}  >
                                    打印结算单
                                    <ul className={ styles.zl_Dy } >
                                      <li  onClick={ this.showPrint.bind(this,1,selectList.order.orderId) } > <span>打印结算单</span> </li>
                                      <li  onClick={ this.showPrint.bind(this,2,selectList.order.orderId) } > <span>打印小票</span> </li>
                                      <li  onClick={ this.showPrint.bind(this,3,selectList.order.orderId) }  > <span>打印领料单</span> </li>
                                      <li  onClick={ this.showPrint.bind(this,4,selectList.order.orderId) } > <span>打印退料单</span> </li>
                                      <li  onClick={ this.showPrint.bind(this,5,selectList.order.orderId) } > <span>打印施工单</span> </li>
                                      {/* <li> <span>打印派工单</span> </li> */}
                                  </ul>
                                    </Button>  }
                                  <Button onClick={ this.customerInfor } className={styles.yc_DyNomalBtn} > 客户资料 </Button>
                                  {   showHiddenBtn(selectList.order.state,selectList.order.deleted) ||
                                    <Button
                                    type="primary"
                                    className={styles.yc_DyGreenBtn}
                                    onClick={()=>this.props.updateOrder(detailList.orderId, detailList.orderType)}
                                  >
                                    修改订单
                                  </Button> }


                              </span>
                          </p>
                          <div className={ styles.zl_person } >
                                <ul>
                                    <li>车牌号：<span>{   selectList.order.carNum }</span></li>
                                    <li>客户名称：<span>{ selectList.order.clientName }</span></li>
                                    <li>进店里程：<span>{ selectList.order.carMlie }</span></li>
                                    <li>结算时间：<span>{ filterTime( selectList.order.paytime ) }</span></li>
                                </ul>
                                <ul>
                                    <li>车型：<span>{ selectList.order.carType }</span></li>
                                    <li>手机号：<span>{selectList.order.phone }</span></li>
                                    <li>服务顾问：<span>{ selectList.order.service }</span></li>
                                    <li>结算人：<span>{selectList.order.payPerson }</span></li>
                                </ul>
                                <ul>
                                    <li>维修类型：<span>{ this.handerMaintainType(selectList.order.maintainType ) }</span></li>
                                    <li>下单时间：<span>{ filterTime( selectList.order.created )  }</span></li>
                                    <li>接车时间：<span>{ filterTime( selectList.order.updated )  }</span></li>
                                    <li>预计交车：<span>{   selectList.order.sendCar === 0 ? null :  moment(selectList.order.sendCar * 1000).format("YYYY-MM-DD  ")  }</span></li>
                                </ul>
                                <div>
                                    <span>订单金额</span>
                                    <span>￥{selectList.order.price}</span>
                                </div>
                          </div>
                      </div>
                   </div>
                   {/*-----  进度流程----*/}
                   <div className={ styles.zl_listThree } >
                       <p> <i  className={ styles.zl_blueD } ></i>进度流程  </p>
                       <div className={ styles.zl_step } >
                         <Steps current={ progress.length -1 } progressDot={customDot}>
                            { statusArr.map((item,i)=><Step  key={ i }  title={item} description={controlStatus(progress[i]|| progress[progress.length-1]||'',progress.length-1,i) } />) }
                        </Steps>
                       </div>
                   </div>
                    <div className={ styles.zl_listFour} >
                         <p> <i  className={ styles.zl_blueD } ></i>商品信息  </p>
                         <Table
                            dataSource={ selectList.project }
                            pagination={false}
                            rowKey={record => record.id || 1}
                            style={{ paddingLeft:'20px',paddingRight:'20px' }}
                          >
                                <Column
                                    title="序号"
                                    dataIndex="index"
                                    key="index"
                                    align='left'
                                    width='6%'
                                    render={(text,record,index) => index + 1}
                                    />
                                <Column
                                    title="项目名称"
                                    dataIndex="projectName"
                                    key="projectName"
                                    align='left'
                                    width='14%'
                                    />
                                <Column
                                    title="编号"
                                    dataIndex="orderId"
                                    key="orderId"
                                    align='left'
                                    width='10%'
                                    />
                                 <Column
                                    title="施工"
                                    dataIndex="construction"
                                    key="construction"
                                    align='left'
                                    width='10%'
                                    render={ (text,record,index)=>(
                                        <div>
                                          { this.renderPerson(selectList.project,'construction',index)  }
                                        </div>
                                    ) }

                                    />
                                 <Column
                                    title="销售"
                                    dataIndex="salePerson"
                                    key="salePerson"
                                    align='left'
                                    width='10%'
                                    render={ (text,record,index)=>(
                                        <div>
                                         { this.renderPerson(selectList.project,'salePerson',index)  }
                                        </div>
                                    ) }
                                    />
                                <Column
                                    title="单价"
                                    dataIndex="everyPrice"
                                    key="everyPrice"
                                    align='left'
                                    width='10%'
                                    />
                                <Column
                                    title="数量"
                                    dataIndex="count"
                                    key="count"
                                    align='left'
                                    width='10%'
                                    />
                                 <Column
                                    title="单位"
                                    dataIndex="unit"
                                    key="unit"
                                    align='left'
                                    width='10%'
                                    />
                                 <Column
                                    title="折扣"
                                    dataIndex="discount"
                                    key="discount"
                                    align='left'
                                    width='10%'
                                    render={ (text,record)=>(
                                        <div>
                                           { record.discount*1===10.00 ? 10 : record.discount }
                                        </div>
                                    ) }
                                    />
                                 <Column
                                    title="金额"
                                    dataIndex="price"
                                    key="price"
                                    align='left'
                                    width='10%'
                                    />
                         </Table>
                         <Table
                            dataSource={ selectList.product }
                            pagination={false}
                            rowKey={record => record.id || 2 }
                            style={{ paddingLeft:'20px',paddingRight:'20px' }}
                          >
                                <Column
                                    title="序号"
                                    dataIndex="index"
                                    key="index"
                                    align='left'
                                    width='6%'
                                    render={(text,record,index) => index + 1}
                                    />
                                <Column
                                    title="产品名称"
                                    dataIndex="productName"
                                    key="productName"
                                    align='left'
                                    width='14%'
                                    />
                                <Column
                                    title="编号"
                                    dataIndex="orderId"
                                    key="orderId"
                                    align='left'
                                    width='10%'
                                    />
                                <Column
                                    title="编码"
                                    dataIndex="commodityCode"
                                    key="commodityCode"
                                    align='left'
                                    width='10%'
                                    />
                                 <Column
                                    title="施工"
                                    dataIndex="construction"
                                    key="construction"
                                    align='left'
                                    width='10%'
                                    render={ (text,record,index)=>(
                                        <div>
                                        { this.renderPerson(selectList.product,'construction',index) }
                                        </div>
                                    ) }
                                    />
                                 <Column
                                    title="销售"
                                    dataIndex="salePerson"
                                    key="salePerson"
                                    align='left'
                                    width='10%'
                                    render={ (text,record,index)=>(
                                        <div>
                                        { this.renderPerson(selectList.product,'salePerson',index) }
                                        </div>
                                    ) }
                                    />
                                <Column
                                    title="单价"
                                    dataIndex="everyPrice"
                                    key="everyPrice"
                                    align='left'
                                    width='10%'
                                    />
                                <Column
                                    title="数量"
                                    dataIndex="count"
                                    key="count"
                                    align='left'
                                    width='10%'
                                    />
                                 <Column
                                    title="单位"
                                    dataIndex="unit"
                                    key="unit"
                                    align='left'
                                    width='10%'
                                    />
                                 <Column
                                    title="折扣"
                                    dataIndex="discount"
                                    key="discount"
                                    align='left'
                                    width='10%'
                                    render={ (text,record)=>(
                                        <div>
                                           { record.discount*1===10.00 ? 10 : record.discount }
                                        </div>
                                    ) }
                                    />
                                 <Column
                                    title="金额"
                                    dataIndex="price"
                                    key="price"
                                    align='left'
                                    width='10%'
                                    />
                         </Table>
                         {/* <Table
                            dataSource={ selectList.attachProject }
                            pagination={false}
                            rowKey={record => record.id ||3 }
                            style={{ paddingLeft:'20px',paddingRight:'20px' }}
                          >
                                <Column
                                    title="序号"
                                    dataIndex="index"
                                    key="index"
                                    align='left'
                                    width='6%'
                                    render={(text,record,index) => index + 1}
                                    />
                                <Column
                                    title="项目名称（附加）"
                                    dataIndex="projectName"
                                    key="projectName"
                                    align='left'
                                    width='24%'
                                    />

                                 <Column
                                    title="施工"
                                    dataIndex="construction"
                                    key="construction"
                                    align='left'
                                    width='10%'
                                    render={ (text,record,index)=>(
                                        <div>
                                        { this.renderPerson(selectList.attachProject,'construction',index) }
                                        </div>
                                    ) }
                                    />
                                 <Column
                                    title="销售"
                                    dataIndex="salePerson"
                                    key="salePerson"
                                    align='left'
                                    width='10%'
                                    render={ (text,record,index)=>(
                                        <div>
                                            { this.renderPerson(selectList.attachProject,'salePerson',index) }
                                        </div>
                                    ) }
                                    />
                                <Column
                                    title="单价"
                                    dataIndex="everyPrice"
                                    key="everyprice"
                                    align='left'
                                    width='10%'
                                    />
                                <Column
                                    title="数量"
                                    dataIndex="count"
                                    key="count"
                                    align='left'
                                    width='20%'
                                    />

                                 <Column
                                    title="折扣"
                                    dataIndex="discount"
                                    key="discount"
                                    align='left'
                                    width='10%'
                                    render={ (text,record)=>(
                                        <div>
                                           { record.discount*1===10.00 ? 10 : record.discount }
                                        </div>
                                    ) }
                                    />
                                 <Column
                                    title="金额"
                                    dataIndex="price"
                                    key="price"
                                    align='left'
                                    width='10%'
                                    />
                         </Table> */}
                    </div>
                    <div className={ styles.zl_listFive } >
                         <p> <i  className={ styles.zl_blueD } ></i>订单产品出库记录  </p>
                         <Table
                            dataSource={ selectList.storeRecord }
                            pagination={false}
                            rowKey={record => record.id || 4 }
                            style={{ paddingLeft:'20px',paddingRight:'20px' }}
                          >
                                <Column
                                    title="序号"
                                    dataIndex="index"
                                    key="index"
                                    align='left'
                                    width='6%'
                                    render={(text,record,index) => index + 1}
                                    />
                                <Column
                                    title="产品名称"
                                    dataIndex="productName"
                                    key="productName"
                                    align='left'
                                    width='14%'
                                    />
                                <Column
                                    title="编码"
                                    dataIndex="commodityCode"
                                    key="commodityCode"
                                    align='left'
                                    width='10%'
                                    />
                                 <Column
                                    title="数量"
                                    dataIndex="count"
                                    key="count"
                                    align='left'
                                    width='10%'
                                    />
                                 <Column
                                    title="出入库"
                                    dataIndex="store"
                                    key="store"
                                    align='left'
                                    width='10%'
                                    render={ (text,record)=>(
                                        <span> { record.store === 2 ? '领料' : '退料' } </span>
                                    ) }
                                    />
                                <Column
                                    title="领料/退料日期"
                                    dataIndex="created"
                                    key="created"
                                    align='left'
                                    width='20%'
                                    render={ (text,record)=>(
                                        <span> { moment(record.created * 1000).format("YYYY-MM-DD ") } </span>
                                    ) }
                                    />
                                <Column
                                    title="领料/退料人"
                                    dataIndex="stuffPerson"
                                    key="stuffPerson"
                                    align='left'
                                    width='20%'
                                    />
                                <Column
                                    title="操作人"
                                    dataIndex="workPerson"
                                    key="workPerson"
                                    align='left'
                                    width='20%'
                                    />
                         </Table>
                    </div>
                    <div className={ styles.zl_listSix } >
                         <p> <i  className={ styles.zl_blueD } ></i>订单详情 </p>
                         <ul>
                             <li>支付方式：<span>{ selectList.orderDetail.payType.length===0   || selectList.orderDetail.payType.map(item=>item+' ').join('') }</span></li>
                             <li>订单金额：<span  style={ { color:'#FF6F28',fontWeight:'bold' } }  >￥{selectList.orderDetail.price }</span></li>
                             <li>车主嘱咐：<span>{ selectList.orderDetail.clientSay }</span></li>
                             <li>作废原因：<span>{ selectList.orderDetail.cancelReason }</span></li>
                             <li>温馨提示：<span>{selectList.orderDetail.kindRemin }</span></li>
                             <li>备注：<span>{selectList.orderDetail.remark}</span></li>
                         </ul>
                         <ul>
                             <li>油表：<span>{ this.handerOilType(selectList.orderDetail.oilMeter) }</span></li>
                             <li>故障描述：<span>{selectList.orderDetail.faultDes }</span></li>
                             <li>维修建议：<span>{selectList.orderDetail.mainSug}</span></li>
                             <li>质保说明：<span>{ selectList.orderDetail.instructionDay}天/{selectList.orderDetail.instructionKm}公里</span></li>
                             <li>终检：<span>{ selectList.orderDetail.finalInspection===1 ? '是' : '否'   }</span></li>
                         </ul>
                    </div>
                    <CheckCar
                     visible={ visible  }
                     changeMast= { this.changeMast }
                     orderId = { CheckCarId }
                      />
                    { !printShow ||  <div className={  styles.zl_MastL  } >
                       { this.showTypeData( printShowType , data ) }
                    </div>   }
                </div>
                :
                <CustomerInfor
                  clientId={selectList.order.clientId}
                  updateOrder={this.props.updateOrder}
                  goBack={this.sonClick}
                  goClient={{ goClient:goDetail.goClient , path:goDetail.path }}
                />
            }
        </div>
    }
}
function mapStateToProps(state) {
    const { selectList , goDetail  } = state.maintianList
    const {  siderFold } = state.app
    return { selectList , goDetail  ,siderFold  }
}
export default connect(mapStateToProps)(List)
