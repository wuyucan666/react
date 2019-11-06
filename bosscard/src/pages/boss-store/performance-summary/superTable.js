import React,{ Component } from 'react'
import style from './style.less'
import { Icon ,message } from 'antd'
import { titleTable } from './data.js'
import services from 'services'
import router from 'umi/router'

let warning=false

class superTable extends Component{
    constructor(){
        super()
        this.state={
            activeData:[5,0],//创建正确索引数组
            upDown:'down',
            x:0,
            total:[],
            data:[
            ],
        }
        this.tableBox=null
        this.timeSearch=null
    }
    handerIndex=(length,idx)=>{
       if(idx<3) return '#4aacf7'
       if(length>=6&&idx>=length-idx)return '#e6e6e6'
       else return '#fff'
    }
    UNSAFE_componentWillReceiveProps(nextProps){
      const { timeSearch } = nextProps
      if(timeSearch===this.timeSearch||Object.keys(timeSearch).length===0)return
      this.timeSearch=timeSearch
      services.list({ 
        keys : { name : 'wide-performance/performance/deduct/staff' } ,
        data:{ q: { where :{ ...timeSearch   } } },
       })
       .then(res=>{
          if(res.code==='0'){
            const data=res.list.sort((a,b)=>{return Number(b.totalDeduct)-Number(a.totalDeduct)})//按照总提成大到小排序
            if(res.list.length===0)return
            this.setState({
              data:data,
              total:[
                // this.computerTotal(res.list.map(i=>i.summary)),
                this.computerTotal(res.list.map(i=>[i.serverSummary[1],i.serverSummary[2]])),
                this.computerTotal(res.list.map(i=>[i.productSummary[1],i.productSummary[2]])),
                // this.computerTotal(res.list.map(i=>i.addtionalSummary)),
                this.computerTotal(res.list.map(i=>[i.computerCard[1]])),
                this.computerTotal(res.list.map(i=>[i.payCard[1],i.payCard[3]])),
                this.computerTotal(res.list.map(i=>i.other)),
                this.computerTotal(res.list.map(i=>[i.totalDeduct])),
              ],
            },()=>{
            
            })
          }
       })
    }
    computerTotal=(list)=>{
      var totalList=[]
      var num=list[0].length
      for(let i=0 ; i<num ; i++ ){
        var total=0
        list
        .forEach(item=>{
            total+=item[i]*1
        })
        totalList.push(total.toFixed(2))
      }
      return totalList
    }
    //排序事件
    sortUp=(id,idx)=>{
      const { data } = this.state
       var dataList=[...data].sort((a,b)=>{
           switch(id){
            // case 0:
            // return a.summary[idx]*1-b.summary[idx]*1
            case 0:
            return a.serverSummary[idx+1]*1-b.serverSummary[idx+1]*1
            case 1:
            return a.productSummary[idx+1]*1-b.productSummary[idx+1]*1
            // case 2:
            // return a.addtionalSummary[idx]*1-b.addtionalSummary[idx]*1
            case 2:
            return a.computerCard[idx+1]*1-b.computerCard[idx+1]*1
            case 3:
              if(idx===0){
                return a.payCard[1]*1-b.payCard[1]*1
              }else{
                return a.payCard[3]*1-b.payCard[3]*1
              }
            case 4:
                  return a.other[idx]*1-b.other[idx]*1
            case 5 :
                return Number(a.totalDeduct)-Number(b.totalDeduct)
            default:
            return a-b
           }
       })
       this.setState({
           activeData:[id,idx],
           data:dataList,
           upDown:'up',
       })
    }
    sortDowm=(id,idx)=>{
        var { data }=this.state
        var dataList=[...data].sort((b,a)=>{
            switch(id){
                // case 0:
                // return a.summary[idx]*1-b.summary[idx]*1
                case 0:
                return a.serverSummary[idx+1]*1-b.serverSummary[idx+1]*1
                case 1:
                return a.productSummary[idx+1]*1-b.productSummary[idx+1]*1
                // case 3:
                // return a.addtionalSummary[idx]*1-b.addtionalSummary[idx]*1
                case 2:
                return a.computerCard[idx+1]*1-b.computerCard[idx+1]*1
                case 3:
                  if(idx===0){
                    return a.payCard[1]*1-b.payCard[1]*1
                  }else{
                    return a.payCard[3]*1-b.payCard[3]*1
                  }
                case 4:
                    return a.other[idx]*1-b.other[idx]*1
                case 5:
                    return Number(a.totalDeduct)-Number(b.totalDeduct)
                default:
                return a-b
            }
        })
        this.setState({
            activeData:[id,idx],
            upDown:'down',
            data:dataList,
        })
    }
    //表格拖拽事件
    handerMoveTable=(e)=>{
      e.preventDefault()
      const { tableBox   }=this
      if(!warning){
        message.info('左右拖拽查看表格更多内容')
        warning=true
      }
      let  V = e.clientX   
    tableBox.onmousemove=(event)=>{
          let v=event.clientX
          const { x } = this.state
          var left =x+(v-V)*0.3
         if(left>=0)return
         if(left<=-(1740-tableBox.offsetWidth))return
          this.setState({
            x:left,
          })
      } 
    }
    handerStopTable=()=>{
      const { tableBox } =this
      tableBox.onmousemove=null
    }
    /**
     * 
     * @param {跳转提成明细} v 
     */
    goDetail(v){
     router.push({pathname:'/boss-store/commission-detail',query:{staffId:v.id,date:this.props.timeSearch}})
    }
    render(){
        const { activeData ,data ,upDown ,x ,total }=this.state
        return <div className={ style.zl_superTable } style={{ height:((data.length+3)*58)+'px' }} onMouseUp={this.handerStopTable}  ref={(tableBox)=>this.tableBox=tableBox  }  >
                  <div  className={style.zl_TableContent}    onMouseDown={ this.handerMoveTable }   style={ { left:x+'px',top:0} }   >
                    <div className={ style.zl_tableHead } >
                       <div   className={style.zl_tableItem}  style={ { width:'90px',paddingLeft:'10px'} } >序号</div>
                       <div   className={style.zl_tableItem}  style={ { width:'150px',paddingLeft:'10px'}} >姓名</div>
                       {titleTable.map((item,id)=>{
                          return <div  key={id}  className={style.zl_tableItem}  style={{ width: (item.children.length*1)*150 +'px' }} >
                                     <div style={{ height:'56px',lineHeight:'56px',textAlign:'center',borderBottom:'1px solid #E1E1E6'  }} >{ item.title }</div>
                                     <ul >
                                    { item.children.map((item,idx)=><li key={idx}  className={style.zl_tableTitelItem}  >{item}  <span className={ style.zl_paixu } >
                                      <Icon type="caret-up" onClick={this.sortUp.bind(this,id,idx)}  style={{ position:'absolute',left:'7px',top:'5px',fontSize:'12px',color:activeData[0]===id && activeData[1]===idx && upDown==='up' ? '#4aacf7' : '#999'    }}  /> 
                                      <Icon type="caret-down"  style={{ position:'absolute',left:'7px',top:'12px',fontSize:'12px', color:activeData[0]===id && activeData[1]===idx && upDown==='down' ? '#4aacf7' : '#999'    }} onClick={this.sortDowm.bind(this,id,idx)} />  </span>
                                    </li>) }
                                     </ul>
                                 </div>
                       })}
                    </div> 
                    <div className={style.zl_tableBody} >
                        { data.map((item,i)=>{
                    return <div key={i}  className={style.zl_TableBodyItem} >
                             <div className={style.zlcol}  style={{ width:'240px',borderBottom:'1px solid #f2f2f2' }} > <div  style={{ width:'90px' , borderRight:'1px solid #E1E1E6' }} ><span className={style.zl_circle} style={{ backgroundColor: this.handerIndex(data.length,i) ,color: i<3 ? '#fff' :'#666'  }}  >{i+1}</span></div> <div style={{ width:'150px',color:'#4AACF7',cursor:"pointer" }} onClick={this.goDetail.bind(this,item)}>{item.staff_name}</div> </div>
                             {/* <div  className={style.zlcol}   >
                               { item.summary.map((item,idx)=><div style={{ color:activeData[0]===0 && activeData[1]===idx ? '#4aacf7' :'#666'   } }  key={idx}>{item}</div>) }
                             </div> */}
                             <div  className={style.zlcol}   >
                               { item.serverSummary.map((item,idx)=>idx>0&&<div style={{ color:activeData[0]===0 && activeData[1]===idx-1 ? '#4aacf7' :'#666'   } }   key={idx}>{item}</div>) }
                             </div>
                             <div  className={style.zlcol}   >
                               { item.productSummary.map((item,idx)=>idx>0&&<div style={{ color:activeData[0]===1 && activeData[1]===idx-1 ? '#4aacf7' :'#666'   } }   key={idx}>{item}</div>) }
                             </div>
                             {/* <div  className={style.zlcol}   >
                               { item.addtionalSummary.map((item,idx)=><div style={{ color:activeData[0]===3 && activeData[1]===idx ? '#4aacf7' :'#666'   } }    key={idx}>{item}</div>) }
                             </div> */}
                             <div  className={style.zlcol}   >
                               { item.computerCard.map((item,idx)=>idx>0&&<div style={{ color:activeData[0]===2 && activeData[1]===idx-1 ? '#4aacf7' :'#666'   } }   key={idx}>{item}</div>) }
                             </div>
                             <div  className={style.zlcol}   >
                               { item.payCard.map((item,idx)=>(idx===1||idx===3)&&<div style={{ color:activeData[0]===3 && activeData[1]===idx-1? '#4aacf7' :activeData[1]===idx-2?'#4aacf7':'#666'   } }   key={idx}>{item}</div>) }
                             </div>
                             <div  className={style.zlcol}  >
                               { item.other.map((item,idx)=><div style={{ color:activeData[0]===4 && activeData[1]===idx ? '#4aacf7' :'#666'  } }   key={idx}>{item}</div>) }
                             </div>
                             <div className={style.zlcol}>
                                {<div style={{color:activeData[0]===5&&activeData[1]===0?'#4aacf7':'#666'}}>{item.totalDeduct}</div>}
                             </div>
                          </div>
                        }) }
                        <div className={style.zl_TableBodyItem} >
                             <div className={style.zlcol}  ><div style={{ textAlign:'center',width:'240px',fontWeight:'bold' }}  >合计</div></div>
                          {
                             total.map((i,index)=> 
                             <div key={index} className={style.zlcol}   >
                               { i.map((item,idx)=><div key={idx}>{item}</div>) }
                             </div>) 
                          }
                        </div>
                    </div>
                  </div>
              </div>
    }
}
export default superTable