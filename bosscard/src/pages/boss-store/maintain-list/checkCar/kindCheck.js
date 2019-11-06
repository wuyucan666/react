import  React , { Component } from "react"
import  styles  from '../customerInfor/components/cardInformation/component/styles.less'
import style from '../styles.less'
import { data } from '../../maintain-billing/cacheData'
import bgs from '../images/36jiancha.png'
import services from "services"
import { message } from 'antd'
import { reportData36 }  from '../detail/data'
const carType = [ '车内' , '车外' , '底盘' , '轮胎/刹车' ]
const color=[ 'rgba(36,192,47,1)','rgba(74,172,247,1)','rgba(170,51,251,1)' ]
class CheckKind  extends Component{
    constructor(){
        super()
        this.state={
            data:reportData36,
        }
    }
    componentDidMount(){
        const { orderId } = this.props
        services.checkCarReport({ keys: {name: 'maintain/report/',id:orderId },data:{ report:'synthesis'  } }).then(res=>{
           if(res.code==='0'){
               this.setState({ data:res.data.security },()=>{
                 console.log(this.state.data)
               })
           }else{
               message.info('网络异常')
           }
        })
    }
    handerColor =(o,type)=> {
        console.log(type)
        let a
        type=== 'M' ? a=color[0] :null
        type=== 'D' ? a=color[1] :null
        type=== 'G' ? a=color[2] :null
        return a
     }
    renderTable=(content)=>{
        let index=[] , idx=0
        content
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
        content
        .forEach(i=>{
            index.indexOf(i.carType) >= 0 ? null : index.push(i.carType)
        })
        //渲染表格结构
        return (<div style={{ width:'1136px' } } >
                  { index.map((item,i)=>{
             return  <div key={ i }  className={ style.zl_damage_list   }   >
                          <p className={ style.zl_srollDiv_p } > { carType[ item - 1 ]  } </p>
                          {  content.filter(o=>o.carType === item ).map((v,i)=>{
                              return (<div key={i}  className={styles.content} style={ { borderTop:'0 none',borderBottom:'1px solid #f2f2f2'   } } >
                                         <span>{ idx++ }</span>
                                         <span  style={ { overflow:'hidden',whiteSpace:'nowrap',textShadow:'ellipsis' } }  ><strong className={ style.zl_damage_symbol } style={ { backgroundColor:this.handerColor(this,v.type) } } >{v.type}</strong>{ v.project  }</span>
                                         <span><i style={ { backgroundColor:v.result===1 ? 'rgba(60,221,64,1)' : 'rgba(235,88,87,1)'  } } ></i>{ v.result === 1 ? '正常' : '异常'  }</span>
                                         <div title={v.explain.map((item,i)=>(i+1)+item+'  '  )}  style={{width:'212px',whiteSpace:'nowrap',textOverflow:'ellipsis',overflow:'hidden'}}>{ v.explain.map((item,i)=><span>{(i+1)+item+'  '}</span>  ) }</div>
                                         <div title={ v.scheme.map((item,i)=>(i+1)+item+'  ') }  style={{width:'212px', whiteSpace:'nowrap',textOverflow:'ellipsis',overflow:'hidden'}}>{ v.scheme.map((item,i)=><span>{(i+1)+item+'  '}</span>) }</div>
                                         <span>{ v.time  }</span>
                                         <span title={ v.remark }>{ v.remark }</span>
                                     </div>)
                          }) }
                      </div>
                  }) }
               </div>)
    }
    render(){
     const { data } = this.state
     return  <div className={styles.checkdiv}>
                <div className={styles.topT}>
                    <img src={bgs} alt=''  />
                    <div>
                        <p>36项安全检查</p>
                        <div>门店36项通常在实际的运用过程中，往往不知道怎样跟客户进行沟通和销售，所以此例将针对于36项该如何运用进行一个说明，主要分为体验式、销售式、提醒式三个环节。</div>
                    </div>
                </div>
                <div className={styles.tisDiv}>
                    <div>
                        检查方法:目测检查<span>M</span> 手动检查 <span>D</span> 专用工具检查 <span>G</span>
                    </div>
                    <div>
                        已检查 <span>{ data.length }</span> 项， <span>{ data.filter(i=>i.result === 2  ).length  }</span> 项异常
                    </div>
                </div>
                <div className={styles.tablecontent}>
                    <div className={styles.tableTop}>
                    <span>序号</span>
                    <span>检查项目</span>
                    <span>检查结果</span>
                    <span>结果说明</span>
                    <span>解决方案</span>
                    <span>工时</span>
                    <span>备注</span>

                     </div>
                    <div className={styles.srollDiv}>
                    { this.renderTable( data ) }
                    </div>
                </div>
         </div>
    }
}
export default CheckKind
