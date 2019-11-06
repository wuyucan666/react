import React, { Component } from 'react'
import { Button , message } from 'antd'
import style from './style.less'
import chong from './img/chong.png'
import ci from './img/ci.png'
import Drop from './components/drapComp'
import Mast from './components/mast'
import service from 'services'
const button = [  '全部卡种' , '只看充值卡' , '只看计次卡'   ]
const  modelArr =  [  // 渲染数据
  {
    title:'阶段一 · 吸客',
    des:'便宜、经典、有差异化、满足刚性需求', 
    arr:null,    
  },
  {
    title:'阶段二 · 养客',
    des:'满足大众化需求、优惠、多种项目', 
    arr:null,    
  },
  {
    title:'阶段三 · 黏客',
    des:'有功效、能产生依耐性的明星产品', 
    arr:null,    
  },
  {
    title:'阶段四 · 升客',
    des:'高品质、高价位、高优惠', 
    arr:null,    
  },
]

class index extends Component{
    constructor(props){
        super(props)
        this.state={
           buttonIndex:0,
           moveRange:[0,0],
           mastShow:false,
           loading:false,
           stage:-1,
           disable:false,
           dataList:[],  // 原数据源
           stageArray:[  // 渲染数据源
            {
              title:'阶段一 · 吸客',
              des:'便宜、经典、有差异化、满足刚性需求', 
              arr:[],    
            },
            {
              title:'阶段二 · 养客',
              des:'满足大众化需求、优惠、多种项目', 
              arr:[],    
            },
            {
              title:'阶段三 · 黏客',
              des:'有功效、能产生依耐性的明星产品', 
              arr:[],    
            },
            {
              title:'阶段四 · 升客',
              des:'高品质、高价位、高优惠', 
              arr:[],    
            },
        ],
        }
        this.box=null
    }
    move=(i)=>{
       this.setState({
           moveIndex:i,
       })
    }
    changeStatus=(i)=>{ //从数据源中 ，取出正确得数据 ， 赋值给渲染数据源
      const { buttonIndex  } = this.state
      if(buttonIndex === i) return
      this.setState({
        disable:true,
        loading:true,
      },()=>{
        this.getData(()=>{
          const { dataList } = this.state
          let newRenderList 
          if(i===0){
            newRenderList = [...dataList]
          }
          else if(i===1){
            newRenderList = [...dataList]
            .map(i=>{
               return {
                 ...i,
                 arr:i.arr
                 .filter(v=>v.type===1),
               }
            })
          }
          else if(i===2){
            newRenderList = [...dataList]
            .map(i=>{
              return{
                ...i,
                arr:i.arr
                .filter(v=>v.type===2),
              }
            })
          }
          this.setState({
              buttonIndex:i,
              stageArray:newRenderList,
              loading:false,
              disable:false,
          })
        })
      })
    
    }
    UNSAFE_componentWillMount(){
       this.getData()
    }
    getData=(callback)=>{
      service.cardStage().then(res=>{
        if(res.code === '0' ){
            const { list } = res // 保存数据源
            let dataArr = []
            for(let i=1; i<=4; i++){
               dataArr.push(list.filter(item=>item.type === i ))
            }
            let dataList = [ ...modelArr ]
            .map((item,i)=>{
                return {
                  ...item,
                  arr:dataArr[i].length === 0 ? [] :dataArr[i][0].items  , 
                }
            })
            this.setState({
              dataList,
              stageArray:dataList,
            },()=>{
               if(callback)callback()
            })
        }
     })
    }
    componentDidMount(){
        const { box } = this
        this.setState({
           parent:box,
        })
    }
    handCallBack=(item,index,lastIndex,i)=>{
       let { stageArray } = this.state
       const newStageArray = [ ...stageArray ]
       const backUpArray = [ ...stageArray ]
       newStageArray[lastIndex].arr.unshift(...newStageArray[index].arr.splice(i,1)) 
       this.setState({
           stageArray:newStageArray,
       },()=>{
         let o = {
           type:item.type,
           stage:lastIndex+1,
         }
        service
        .reviseCardState({ keys: { name: 'card/stage', id:item.id }, data: { ...o } })
        .then( res => {
          if (res.code === '0') { 
            message.success('保存成功') // 改变数据源
            const newDataList =[ ...stageArray ]
            .map((i,idx)=>{
                if(idx===index){
                   return{
                     ...i,
                     arr:i.arr.filter(v=>v.id!==item.id),
                   }
                }
                else if(idx===lastIndex){
                  let newArr = [...i.arr]
                  newArr.unshift({
                    ...item,
                    stage:lastIndex+1,
                 })
                  return {
                    ...i,
                    arr:newArr,
                  }
                }
                else return i
            }) 
            console.log(newDataList)
          } else {
            message.info('保存失败')
            this.setState({
              stageArray:backUpArray, // 备份启用
            })
          }
        })
       })
    }
    showMast=()=>{
      const { mastShow } = this.state
      this.setState({
        mastShow:!mastShow,
      })
    }
    everyStage=(val)=>{
      const { stage } = this.state
       if(val===stage) return
    }
    render(){
        const { stageArray , buttonIndex ,parent , mastShow ,disable ,loading  ,stage  } = this.state
        return <div style={{ backgroundColor:'#F2F6FA',marginBottom:'-47px',marginTop:'-10px',marginRight:'-10px' }} >
            {
              button.map((item,i)=><Button disabled={disable}  loading={loading}  key={i} size='large' onClick={this.changeStatus.bind(this,i)}   style={{ width:'120px' , marginRight:'20px' }}  type={ i===buttonIndex ? 'primary' :'default'  }  >{item}</Button>)  
            }
            <span  onClick={this.showMast}  className={style.zl_what} > <i  style={{ marginLeft:'3px' , fontWeight:'normal' }}  className='iconfont  icon-wenhao' ></i> 什么是会员培养阶梯</span>
            <div className={style.zl_content} ref={(box)=>this.box=box}  >
             {
               stageArray.map((item,index)=>
               <div key={index} className={style.zl_item}  style={{ background:index===stage ? '#FAFAFA': null }}  >
                 <div className={style.zl_itemHead} >
                   <p className={style.zl_title} >{item.title}</p>
                   <p className={style.zl_des} >{ item.des}</p>
                 </div>
                 <div className={style.zl_card_content} >
                  {
                    item.arr.map((v,i)=>
                    <Drop key={i}  item = { v } index = {index}   i={i}  everyStage={this.everyStage}   handCallBack={ this.handCallBack }   parent={parent}  >
                        <div key={i} className={style.zl_card_item}  >
                            <img src={v.type=== 1 ? chong :ci } alt=''  />
                            <span  >{ v.name }</span>
                            <i className='iconfont  icon-gengduo' ></i>
                        </div> 
                    </Drop>)
                    
                  }
                 </div>
               </div>)  
             }
            </div>
            {  mastShow && <Mast  handerMastHidden={this.showMast}  />  }
        </div>
    }
}
console.log(index.chidren)
export default  index