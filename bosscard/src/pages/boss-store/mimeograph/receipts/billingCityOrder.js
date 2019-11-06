import React from 'react'
import moment from "moment"
import { data } from '../../maintain-billing/cacheData'
//import { project ,otherProject ,product  ,otherProduct } from '../data'

//结算单打印 billingPay组件
//通过配置缩放比控制打印结算单大小
//scale 缩放比 默认为1
//type 结算单类型 0 结算单-维修开单 1结算单-快捷开单 2 B单打印-维修开单 3 B单打印-快捷开单
//data 数据源
//自定义表单头部

const  getTableTitle=(type,scale,data)=>{
    const titleStyle = {color: '#000', fontSize:(42*scale)+'px', flex: 1, height: (100*scale)+'px', lineHeight: (100*scale)+'px'}
    return (
        <div style={{display: 'flex'}}>
            <div style={titleStyle}>车牌号码：<span>{data.licensePlate}</span></div>
            <div style={{...titleStyle, textAlign: 'center'}}>服务顾问：<span>{data.counselorName}</span></div>
            <div style={{...titleStyle, textAlign: 'right'}}>打印时间：<span>{moment().format('YYYY-MM-DD')}</span></div>
        </div>
    )
}
//自定义结构
const getTableheader=(type,scale,security)=>{
    const styleAll={
        boxSizing:'border-box',
        borderBottom:'1px solid #000',
        borderRight:'1px solid #000',
        padding:(6*scale)+'px',
        paddingLeft:(15*scale)+'px',
        paddingRight:(15*scale)+'px',
        color:'#000',
        display: 'flex',
        alignItems: 'center',
        textAlign: 'center',
        justifyContent: 'center',
    }
    const styleT={fontSize:(32*scale)+'px'  , display: 'flex'}
    const styleR = {...styleAll, width:(125*scale)+'px'}
    const styleS = {...styleAll, width:(680*scale)+'px'}
    const styleRm = {...styleAll, width:(250*scale)+'px'}
    const styleY = {...styleAll, width:(100*scale)+'px'}
    const styleG = {...styleAll, width:(875*scale)+'px'}
    let datas = []
    for(let i in data) {
        let item = security.find(_ => _.index === data[i].index)
        if(item && item.index >= 0) {
            data[i].time = item.time
            data[i].remark = item.remark
            data[i].result = item.result
            data[i].explain = item.explain
        } else {
            data[i].explain = []
        }
        datas.push({...data[i]})
    }
    const table = [
        {
            name: '车内检查',
            data: datas.filter(_ => _.carType === 1 && _.index !== -1),
        },
        {
            name: '车外检查',
            data: datas.filter(_ => _.carType === 2 && _.index !== -2),
        },
        {
            name: '底盘检查',
            data: datas.filter(_ => _.carType === 3 && _.index !== -3),
        },
        {
            name: '轮胎刹车检查',
            data: datas.filter(_ => _.carType === 4 && _.index !== -4),
        },
    ]
    return (
        <div style={{borderTop:'1px solid #000', borderLeft:'1px solid #000'}}>
            <div style={styleT} >
                <div style={styleR} >模块</div>
                <div style={{display: 'flex'}}>
                    <div style={styleY}></div>
                    <div style={styleG}>检测项目</div>
                    <div style={styleR}>检测方法</div>
                    <div style={styleR}>检查结果</div>
                    <div style={styleS}>说明</div>
                    {/* <div style={styleR}>施工时间</div> */}
                    <div style={styleRm}>备注</div>
                </div>
            </div>
            {table.map((v, index) => {
                return (
                    <div style={styleT} key={index}>
                        <div style={styleR} >{v.name}</div>
                        <div>
                            {v.data.map((vs, indexs) => {
                                return (
                                    <div style={{display: 'flex'}} key={indexs}>
                                        <div style={styleY} >{vs.index}</div>
                                        <div style={{...styleG, justifyContent: 'left', textAlign: 'left'}} >{vs.project}</div>
                                        <div style={styleR} >{vs.type}</div>
                                        <div style={styleR} ><span style={{fontSize: (28*scale)+'px'}} className={vs.result === 0 ? '' : vs.result === 1 ? 'iconfont icon-xuanzhong' : 'iconfont icon-quxiao'}></span></div>
                                        <div style={{...styleS, justifyContent: 'left', textAlign: 'left'}} >
                                            {vs.explain && vs.explain.map((items, ind) => <span key={ind}>{ind > 0 ? '/' : ''}{items}</span>)}
                                        </div>
                                        {/* <div style={styleR} >{vs.time}</div> */}
                                        <div style={styleRm} >{vs.remark}</div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

//创建表格底部结构
const getTableFooter=(scale, store)=>{
    return (
        <div>
            <div style={ { fontSize:(42*scale)+'px', display: 'flex', marginTop: (20*scale)+'px'} } >
                <div style={{flex:1, color: '#000'}}>服务热线：<span>{store.hotLine}</span></div>
                <div style={{flex:1, color: '#000'}}>营业时间：<span>{store.businessDays}，{store.startOfDay}~{store.endOfDay}</span></div>
            </div>
            <div style={{ fontSize:(42*scale)+'px', flex:1, color: '#000', marginTop: (20*scale)+'px'}}>门店地址：<span>{store.address}</span></div>
            <div style={{borderBottom: '2px solid #000', marginTop: (15*scale)+'px'}}></div>
        </div>
    )
}
const  P = React.memo( ({ scale , type , data ,reload }) => {
    setTimeout(()=>{
      window.print()
      if(reload){
        window.location.reload()
      }
    },1000)
    return(
    <div  style={{marginLeft:'2%', marginTop: (120*scale)+'px', fontFamily: 'MicrosoftYaHei'}} >
        <div style={{ paddingTop:(1*scale)+'px',width:(2280*scale)+'px' }} >
            <h1 style={{
                fontWeight:'bold',
                textAlign:'center',
                marginBottom:(20*scale)+'px',
                height:(60*scale)+'px',
                fontSize:(58*scale)+'px',
                lineHeight:(58*scale)+'px',
                color:'#000',
            }}>{ data.storeName }(36项车检单)</h1>
            <div style={{borderBottom: '2px solid #000', marginTop: (30*scale)+'px'}}></div>
            {getTableTitle(type,scale,data)}
            <div style={{width:'100%' }} >
            {getTableheader(type,scale,data.security)}
            </div>
            <div style={{fontSize:(42*scale)+'px', height: (100*scale)+'px', lineHeight: (100*scale)+'px', color: '#000'}}>检查方法中：“M”为目测检查，“D”为手动检查，“G”为专业工具检查</div>
            {getTableFooter(scale,data.store)}
        </div>
    </div>)
},(pre,next)=> pre.type === next.type )
export default P
