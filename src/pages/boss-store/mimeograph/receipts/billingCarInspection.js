import React from 'react'
import moment from "moment"
// import cheyou from "../images/cheyou.png"
// import chezuo from "../images/chezuo.png"
// import chetou from "../images/chetou.png"
// import chewei from "../images/chewei.png"
// import cheding from "../images/cheding.png"
//结算单打印 billingPay组件
//通过配置缩放比控制打印结算单大小
//scale 缩放比 默认为1
//type 结算单类型 0 结算单-维修开单 1结算单-快捷开单 2 B单打印-维修开单 3 B单打印-快捷开单

//创建基础信息
const getBasis=(type, scale, data)=>{
    let style = {display: 'flex', padding:(30*scale)+'px', paddingTop:(40*scale)+'px', paddingBottom: (40*scale)+'px', border: '1px solid #000'}
    let styles = {marginTop: (30*scale)+'px'}
    return (
        <div style={style}>
            <div style={{flex:1}}>
                <div>车牌号码：{data.licensePlate}</div>
                <div style={styles}>车系车型：{data.vehicleType}</div>
                <div style={styles}>行驶里程：{data.mileage}</div>
                <div style={styles}>车主姓名：{data.clientName}</div>
                <div style={styles}>联系电话：{data.clientPhone}</div>
            </div>
            <div style={{flex:1}}>
                <div>服务顾问：{data.counselorName}</div>
                <div style={styles}>进店时间：{data.createdAt ? moment().format('YYYY-MM-DD') : ''}</div>
                <div style={styles}>订单编号：{data.orderNo}</div>
                <div style={styles}>是否会员：{data.isMember===0?'否':'是'}</div>
                <div style={styles}>车辆类型：{data.carType === 1 ? '个人' : '单位'}</div>
            </div>
        </div>
    )
}

//创建功能确认
const getTooIs=(scale, data)=>{
    let style = {flex:1, textAlign: 'center', height: (150*scale)+'px', lineHeight: (150*scale)+'px', color: '#000'}
    let styles = {display: 'inline-block', width: (56*scale)+'px', height: (56*scale)+'px', border: '1px solid #000', background: '#000'}
    let center = {display: 'flex', alignItems: 'center', justifyContent: 'center', height: (56*scale)+'px'}
    let arr = [
        {icon: "iconfont icon-fadongjiguzhang", state: false},
        {icon: "iconfont icon-jiyouyali", state: false},
        {icon: "iconfont icon-dianchiguzhang", state: false},
        {icon: "iconfont icon-zhidongxitong", state: false},
        {icon: "iconfont icon-ABSxitong", state: false},
        {icon: "iconfont icon-wudeng", state: false},
        {icon: "iconfont icon-ranyou", state: false},
        {icon: "iconfont icon-zhuanxiangdeng", state: false},
        {icon: "iconfont icon-yuanguangdeng", state: false},
        {icon: "iconfont icon-qingxiye", state: false},
    ]
    let ary = []
    let d = data.filter(_ => _.index <= 10)
    let ds = data.filter(_ => _.index > 10)
    for(let i in arr){
        let index = d.findIndex(_ => _.index === (parseInt(i)+1))
        if(index >= 0) {
            arr[i].state = true
        }
        ary.push(arr[i])
    }
    return (
        <div style={{paddingTop:(20*scale)+'px', border: '1px solid #000'}}>
            <div style={{display: 'flex', marginBottom: (20*scale)+'px'}}>
                {ary.map((v, index) => <div key={index} style={style}><span style={{fontSize: (100*scale)+'px'}} className={v.icon}></span></div>)}
            </div>
            <div style={{display: 'flex', marginBottom: (60*scale)+'px'}}>
                {ary.map((v, index) => {
                    return (
                        <div key={index} style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                            <div style={{...styles, background: v.state ? '#000' : '#fff'}}>
                                <div style={center}>
                                    <span style={{fontSize: (24*scale)+'px'}} className={v.state ? 'iconfont icon-quxiao' : 'iconfont icon-xuanzhong'}></span>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
            {ds.length > 0 && <div style={{ height: (150*scale)+'px', lineHeight: (150*scale)+'px', borderTop: '1px solid #000', paddingLeft: (30*scale)+'px'}}>其他问题：{ds.map((v, index) => <span key={index}>{index*1 > 0 ? '/' : ''}{v.text}</span>)}</div>}
        </div>
    )
}

//创建物品确认
const getMaterials=(scale, data)=>{
    let style = {width: '50%', height: (56*scale)+'px', lineHeight: (56*scale)+'px', marginBottom: (50*scale)+'px', paddingLeft:(30*scale)+'px'}
    let styles = {display: 'inline-block', width: (56*scale)+'px', height: (56*scale)+'px', border: '1px solid #000', marginRight:(20*scale)+'px'}
    let center = {display: 'flex', alignItems: 'center', justifyContent: 'center', height: (56*scale)+'px'}
    let stylef = {display: 'flex', flexDirection:'row', justifyContent:'0', alignItems:'flex-start', flexWrap:'wrap'}
    let arr = [
        {index: 1, text: '贵重物品已提醒用户带离车辆', state: false},
        {index: 2, text: '随车工具', state: false},
        {index: 3, text: '千斤顶', state: false},
        {index: 4, text: '备胎', state: false},
        {index: 5, text: '灭火器', state: false},
    ]
    let ary = []
    let d = data.filter(_ => _.index <= 5)
    let ds = data.filter(_ => _.index > 5)
    for(let i in arr){
        let index = d.findIndex(_ => _.index === arr[i].index)
        if(index >= 0) {
            arr[i].state = true
        }
        ary.push(arr[i])
    }
    return (
        <div style={{paddingTop:(50*scale)+'px', border: '1px solid #000'}}>
            <div style={stylef}>
                {ary.map((v, index) => {
                    return (
                        <div style={style} key={index}><div style={{...styles, background: v.state ? '#000' : '#fff'}}>
                            <div style={center}>
                                <span style={{fontSize: (24*scale)+'px'}} className={v.state ? 'iconfont icon-xuanzhong' : 'iconfont icon-quxiao'}></span>
                            </div>
                        </div>{v.text}</div>
                    )
                })}
            </div>
            {ds.length > 0 && <div style={{ height: (150*scale)+'px', lineHeight: (150*scale)+'px', borderTop: '1px solid #000', paddingLeft: (30*scale)+'px'}}>其他备注：{ds.map((v, index) => <span key={index}>{index*1 > 0 ? '/' : ''}{v.text}</span>)}</div>}
        </div>
    )
}

//创建外观确认
const getAppearance=(scale, data)=>{
    let color = {color: '#000'}
    let you = {boxSizing:'border-box', width: (530*scale)+'px', textAlign: 'center', position: 'relative'}
    let ding = {boxSizing:'border-box', width: (480*scale)+'px', textAlign: 'center', position: 'relative'}
    let tou = {boxSizing:'border-box', width: (292*scale)+'px', textAlign: 'center', position: 'relative'}
    let iconS = {fontSize: (500*scale)+'px', color: '#000', height: (250*scale)+'px', lineHeight: (250*scale)+'px'}
    let flaw = {
        background: '#fff',
        position: 'absolute',
        border: '1px solid #000',
        color: '#000',
        fontSize: (25*scale)+'px',
        borderRadius: (20*scale)+'px',
        display: 'inline-block',
    }
    let arr = [
        {width: 530, arr: [], style: you, car: 'iconfont icon-youce', text: '右侧', position: 1},
        {width: 469, arr: [], style: ding, car: 'iconfont icon-cheding', text: '车顶', position: 3},
        {width: 530, arr: [], style: you, car: 'iconfont icon-zuoce', text: '左侧', position: 2},
        {width: 292, arr: [], style: tou, car: 'iconfont icon-chetou', text: '车头', position: 4, size: 200},
        {width: 292, arr: [], style: tou, car: 'iconfont icon-chewei', text: '车尾', position: 5, size: 200},
    ]
    let ary = []
    for(let i in arr){
        for(let j in data) {
            if(data[j].position === arr[i].position) {
                let w = arr[i].width-30
                let x = parseInt(data[j].x/data[j].width*w)
                let y = parseInt(data[j].y/data[j].width*w)
                if(arr[i].position === 3) {
                    x = arr[i].width - parseInt(data[j].y) -60
                    y = parseInt(data[j].x)
                }
                let text = ''
                for(let k in data[j].value){
                    if(text === '') {
                        text += data[j].value[k]
                    } else {
                        text += '/' + data[j].value[k]
                    }
                }
                arr[i].arr.push({x, y, text})
            }
        }
        ary.push(arr[i])
    }
    return (
        <div style={{display: 'flex', paddingTop:(50*scale)+'px', border: '1px solid #000', marginBottom: (30*scale)+'px'}}>
            {ary.map((v, index) => {
                return (
                    <div style={v.style} key={index}>
                        <div style={color}>{v.text}</div>
                        <div style={{...v.style}}>
                            <span style={{...iconS, fontSize: v.size ? (v.size*scale)+'px' : (500*scale)+'px'}} className={v.car}></span>
                            {v.arr.map((vs, indexs) => {
                                return (
                                    <span key={indexs} style={{
                                        ...flaw,
                                        minWidth: (100*scale)+'px',
                                        left: (vs.x*scale)+'px',
                                        top: (vs.y*scale)+'px',
                                    }}>{vs.text}</span>
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
    let style = { fontSize:(42*scale)+'px', display: 'flex', marginTop: (20*scale)+'px'}
    let styles = {flex:1, color: '#000'}
    return (
        <div>
            <div style={style} >
                <div style={styles}>服务门店：<span>{store.name}</span></div>
                <div style={styles}>服务热线：<span>{store.hotLine}</span></div>
            </div>
            <div style={style} >
                <div style={styles}>救援电话：<span>{store.sos_hot_line}</span></div>
                <div style={styles}>营业时间：<span>{store.businessDays}，{store.startOfDay}~{store.endOfDay}</span></div>
            </div>
            <div style={{ fontSize:(42*scale)+'px', flex:1, color: '#000', marginTop: (20*scale)+'px'}}>门店地址：<span>{store.address}</span></div>
            <div style={{borderBottom: '2px solid #000', marginTop: (40*scale)+'px'}}></div>
        </div>
    )
}
const  P = React.memo( ({ scale , type , data ,reload }) => {
    setTimeout(()=>{
      window.print()
      console.log('0000000000000000000000000000000000000000000000000000000000', scale , type , data ,reload)
      if(reload){
        window.location.reload()
      }
    },1000)
    let style = {
        fontWeight:'bold',
        textAlign:'center',
        marginBottom:(20*scale)+'px',
        height:(60*scale)+'px',
        fontSize:(58*scale)+'px',
        lineHeight:(58*scale)+'px',
        color:'#000',
    }
    let styleTile = {color: '#000',marginTop: (20*scale)+'px', flex: 1, height: (100*scale)+'px', lineHeight: (100*scale)+'px', textAlign: 'center'}
    let styleAll = {marginLeft:'5%', marginTop: (120*scale)+'px', fontFamily: 'MicrosoftYaHei', fontSize:(42*scale)+'px', color: '#000'}
    let styleXt = {borderLeft: '5px solid #000', paddingLeft: (20*scale)+'px', marginTop:(60*scale)+'px', marginBottom:(40*scale)+'px', height: (45*scale)+'px', lineHeight: (45*scale)+'px'}
    return(
    <div style={styleAll} >
        <div style={{ paddingTop:(1*scale)+'px',width:(2150*scale)+'px' }} >
            <h1 style={style}>{ data.storeName }(常规车检单)</h1>
            <div style={styleTile}>打印时间：{moment().format('YYYY-MM-DD')}</div>
            <div style={{borderBottom: '2px solid #000', marginBottom: (10*scale)+'px'}}></div>
            <div style={styleXt}>基础信息：</div>
            <div style={{width:'100%' }} >
                {getBasis(type,scale,data)}
            </div>
            <div style={styleXt}>功能确认：正常“√”故障“×”</div>
            <div style={{width:'100%' }} >
                {getTooIs(scale,data.function)}
            </div>
            <div style={styleXt}>物品确认：有“√”无“×”</div>
            <div style={{width:'100%' }} >
                {getMaterials(scale,data.items)}
            </div>
            <div style={styleXt}>外观确认：划痕/破裂/掉漆/凹陷/裂纹/其他</div>
            <div style={{width:'100%' }} >
                {getAppearance(scale,data.appearance)}
            </div>
            {getTableFooter(scale,data.store)}
        </div>
    </div>)
},(pre,next)=> pre.type === next.type )
export default P
