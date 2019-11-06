import React,{ Component } from 'react'
import  styles  from '../styles.less'
import {connect}   from 'dva'
import { Button,Table ,message} from 'antd'
import { Blist  } from './data.js'
import P from '../../mimeograph/receipts/billingPay'
import ServiceTable from './table.js'
import moment from "moment"
import services from 'services'
const maintainType=[ '普通维修','保险维修','内部维修','其他维修' ]
const { Column } = Table
const filterTime=(data)=>{
    let time
    data === 0 ? time=null : time= moment(data * 1000).format("YYYY-MM-DD HH:mm:ss ")
    return time
}

class BList extends Component{
    constructor(){
        super()
        this.state={
            max:1,
            selectList:Blist,
            printShow:false,
            type:null,
            data:null,
        }
    }
    notShow=()=>{
        this.props.notShow()
    }
    //获取B单详情
    UNSAFE_componentWillMount(){
        const { orderId  } = this.props
        services.maintainBlistDetail( { keys: {name: 'store/vice/order/',id:orderId} } ).then(res=>{
              this.setState({ selectList:res.data  })
        })

     }
     componentDidMount(){
        document.addEventListener('keydown',(e)=>{
            const { printShow } = this.state
            if(!printShow) return
            e.key === 'Escape' || e.key === 'Enter' ? this.setState({ printShow:false }) : null
        })
     }
    //判断维修类型
    handerMaintainType=(Type)=>{
       return maintainType[Type-1]
    }
    showPrint=(id,type)=>{
        const { printShow } = this.state
        //B单打印 维修开单
       if(type===3){
        services.printingOperationB( { keys:{ name:'printing/operation/order/normal/billing/',id } })
        .then( res=>{
            console.log(res)
            res.code==='0' ? this.setState({
                data:res.list,
                printShow:!printShow,
                type:2,
            }) :message.info('网络出现错误')
        })
       }
       //B单打印 快捷开单
       else if (type===4){
        services.printingOperationQuikeB( { keys:{ name:'printing/operation/order/quick/billing/',id } })
        .then( res=>{
            res.code==='0' ? this.setState({
                data:res.list,
                printShow:!printShow,
                type:3,
            }) :message.info('网络出现错误')
        })
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
    rendertotal(arr){
      let count = 0 // 数量
      let actuallyPaid = 0 // 实收
      arr.forEach(v=>{
        count += v.count*1
        actuallyPaid += v.actuallyPaid*1
      })
      return (
        <div className={styles.wyc_totaldiv}>
          <span style={{width:'6%',padding:'0 8px'}}>总计</span>
          <span style={{width:'19%',padding:'0 8px'}}></span>
          <span style={{width:'18%',padding:'0 8px'}}>{count||0}</span>
          <span style={{width:'10%',padding:'0 8px'}}></span>
          <span style={{width:'10%',padding:'0 8px'}}></span>
          <span style={{width:'10%',padding:'0 0px'}}>{(actuallyPaid||0).toFixed(2)}</span>

        </div>
      )
    }
    render(){
        const { selectList , printShow ,data ,type} = this.state
        console.log(data,type,'print')
        const {   siderFold  } = this.props
        return <div>
            <div className={ styles.zl_detailList }   style={{zIndex:'8', left: siderFold ? '80px' : '200px'  }}   >
                 <div className={ styles.zl_listOne } style={{ height:'60px' }} >
                    <span>订单列表 >    B单详情 </span>
                    {/* <span><i  className="iconfont icon-bangzhu" ></i>帮助中心 </span> */}
                 </div>
                 <div className={ styles.wyc_top } >
                         <div className={styles.wyc_topdiv}>
                           <div className={styles.wyc_title_left}><i  className={ styles.zl_blueD } ></i><span className={styles.wyc_orderid}>{ selectList.order.orderId }</span><span className={styles.wyc_ordertype_b}>B</span></div>
                           <div className={styles.wyc_btn_div}>
                              <Button  className={styles.wyc_detail_btn} type="primary" style={{color:'#fff'}} onClick={ this.showPrint.bind(this,selectList.order.orderId,selectList.type) }> 打印B单 </Button>
                              <Button  className={styles.wyc_detail_btn}  onClick={ () => this.props.notShow(true)  } > 修改B单</Button>
                              <Button  className={styles.wyc_detail_btn} onClick={ this.notShow }>返回上一级</Button>
                           </div>
                         </div>
                         <div className={styles.wyc_namediv}>
                            <div className={styles.wyc_namediv_left}><i className="iconfont icon-submenu16" style={{color:'#4AACF7',marginRight:'10px',verticalAlign:'middle'}}></i><span className={styles.wyc_name}>{ selectList.order.clientName }</span><span className={styles.wyc_name} style={{marginLeft:'10px'}}>{selectList.order.phone }</span></div>
                            <div className={styles.wyc_namediv_left}><i className="iconfont icon-che" style={{color:'#4AACF7',marginRight:'10px',fontSize:'10px'}}></i><span className={styles.wyc_carnum}>{selectList.order.carNum} { selectList.order.carType }</span></div>
                            <div className={styles.wyc_namediv_right}><span className={styles.wyc_name_right}>{selectList.order.payPerson }</span><span className={styles.wyc_time_right}>{ filterTime( selectList.order.paytime ) }</span></div>
                         </div>
                        <div className={styles.wyc_top_bom}>
                            <div className={styles.wyc_firstP}>
                              <div className={styles.wyc_fl}><span className={styles.wyc_fl_name}>服务顾问:</span><span className={styles.wyc_fl_content}>{ selectList.order.service }</span></div>
                              <div className={styles.wyc_fl}><span className={styles.wyc_fl_name}>进店里程:</span><span className={styles.wyc_fl_content}>{ selectList.order.carMlie } km</span></div>
                              {selectList.order.maintainType!==0&&<div className={styles.wyc_fl}><span className={styles.wyc_fl_name}>维修类型:</span><span className={styles.wyc_fl_content}>{ this.handerMaintainType(selectList.order.maintainType ) }</span></div>}
                              {selectList.order.updated!==0&&<div className={styles.wyc_fl}><span className={styles.wyc_fl_name}>进店时间:</span><span className={styles.wyc_fl_content}>{ filterTime( selectList.order.updated )  }</span></div>}
                            </div>
                            {/* <p className={styles.wyc_firstP}><span className={styles.wyc_left_txt}>下单时间:</span><span className={styles.wyc_right_txt}>{ filterTime( selectList.order.created )  }</span></p> */}
                            {selectList.order.sendCar !== 0&&<p className={styles.wyc_firstP}><span className={styles.wyc_left_txt}>预计交车:</span><span className={styles.wyc_right_txt}>{ selectList.order.sendCar === 0 ? null :  moment(selectList.order.sendCar * 1000).format("YYYY-MM-DD  ")   }</span></p>}
                            {selectList.orderDetail.clientSay&&<p className={styles.wyc_firstP}><span className={styles.wyc_left_txt}>车店嘱咐:</span><span className={styles.wyc_right_txt}>{ selectList.orderDetail.clientSay }</span></p>}
                            {/* <p className={styles.wyc_firstP}><span className={styles.wyc_left_txt}>门店备注(门店可见):</span><span className={styles.wyc_right_txt}>{selectList.orderDetail.remark}</span></p> */}
                            {selectList.orderDetail.kindRemin&&<p className={styles.wyc_firstP}><span className={styles.wyc_left_txt}>温馨提示(顾客可见):</span><span className={styles.wyc_right_txt}>{selectList.orderDetail.kindRemin }</span></p>}
                            {selectList.orderDetail.faultDes&&<p className={styles.wyc_firstP}><span className={styles.wyc_left_txt}>故障描述:</span><span className={styles.wyc_right_txt}>{selectList.orderDetail.faultDes }</span></p>}
                            {selectList.orderDetail.mainSug&&<p className={styles.wyc_firstP}><span className={styles.wyc_left_txt}>维修建议:</span><span className={styles.wyc_right_txt}>{selectList.orderDetail.mainSug}</span></p>}
                            {<p className={styles.wyc_firstP}><span className={styles.wyc_left_txt}>质保说明:</span><span className={styles.wyc_right_txt}>{ selectList.orderDetail.instructionDay}天/{selectList.orderDetail.instructionKm}公里</span></p>}
                            {<p className={styles.wyc_firstP}><span className={styles.wyc_left_txt}>终检:</span><span className={styles.wyc_right_txt}>{ selectList.orderDetail.finalInspection===1 ? '是' : '否'   }</span></p>}
                        </div>
                  </div>
                  {/* <ServiceTable  selectList={ selectList }   /> */}
                 <div className={ styles.zl_listFour} >
                         <p> <i  className={ styles.zl_blueD } ></i>服务信息  </p>
                         <Table
                            dataSource={ [...selectList.project,...selectList.product] }
                            pagination={false}
                            rowKey={record => record.id || 1}
                          >
                                <Column
                                    title="类型"
                                    dataIndex="index"
                                    key="index"
                                    align='left'
                                    width='6%'
                                    render={(text,record,index) => record.commodityCode?<span>产品</span>:<span>项目</span>}
                                    />
                                <Column
                                    title="服务"
                                    dataIndex="projectName"
                                    key="projectName"
                                    align='left'
                                    width='14%'
                                    render={(text,record,index) => record.commodityCode?<span>{record.productName}&nbsp;{record.commodityCode}</span>:<span>{record.projectName}</span>}
                                    />
                                <Column
                                    title="数量"
                                    dataIndex="count"
                                    key="count"
                                    align='left'
                                    width='10%'
                                    />
                                <Column
                                    title="单价"
                                    dataIndex="everyPrice"
                                    key="everyPrice"
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
                                    title="实收"
                                    dataIndex="actuallyPaid"
                                    key="actuallyPaid"
                                    align='left'
                                    width='10%'
                                    />
                                  <Column
                                    title="施工人员"
                                    dataIndex="construction"
                                    key="construction"
                                    align='left'
                                    width='10%'
                                    render={ (text,record,index)=>(
                                        <div>
                                          { this.renderPerson([...selectList.project,...selectList.product],'construction',index)  }
                                        </div>
                                    ) }

                                    />
                                  <Column
                                      title="销售人员"
                                      dataIndex="salePerson"
                                      key="salePerson"
                                      align='left'
                                      width='10%'
                                      render={ (text,record,index)=>(
                                          <div>
                                          { this.renderPerson([...selectList.project,...selectList.product],'salePerson',index)  }
                                          </div>
                                      ) }
                                      />
                         </Table>
                         {this.rendertotal([...selectList.project,...selectList.product])}
                         {/* 产品表格 */}
                         {/* <Table
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
                                    render={
                                      (text,record,index) =>
                                      <span>
                                        <span>{record.productName}</span>&nbsp;<span>{record.commodityCode}</span>
                                      </span>
                                    }
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
                         </Table> */}
                         {/* 附加项目表格 */}
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
                    {/* 订单产品出库记录 */}
                    {/* <div className={ styles.zl_listFive } >
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
                    </div> */}

                {/* 结算信息 */}
                <div className={ styles.wyc_listSix } >
                      <p> <i  className={ styles.zl_blueD } ></i>结算信息 </p>
                      <div className={styles.wyc_jiesuan}>
                        <div className={styles.wyc_jiesuan_left}>
                          <div style={{marginBottom:'10px'}}><span className={styles.wyc_song_name}>结算方式 :</span><span className={styles.wyc_song_cont}>{ selectList.orderDetail.payType.length===0   || selectList.orderDetail.payType.map(item=>item+' ,').join('') }</span></div>
                          {selectList.orderDetail.remark&&<div>
                            <span className={styles.wyc_song_name} style={{marginLeft:'30px'}}>备注 :</span><span className={styles.wyc_song_cont}>{selectList.orderDetail.remark}</span>
                          </div>}
                        </div>
                          <div className={styles.wyc_jiesuan_right}><span className={styles.wyc_price_title}>实收总金额</span><span className={styles.wyc_price}><span className={styles.wyc_price_dolo}>￥</span><span className={styles.wyc_price_count}>{selectList.orderDetail.price}</span></span></div>
                      </div>
                </div>
        </div>
        {/* B单打印 */}
        { !printShow ||  <div className={  styles.zl_MastL  } >
                         <P scale={0.5} type={type}  data={ data }  />
                    </div>   }
      </div>
    }
}

export default connect((state)=>{
 const { siderFold  } = state.app
 return {
   siderFold,
 }
})(BList)
