import React,{ Component } from 'react' 
import style from '../style.less'
import Absence_icon from './images/Absence_icon.png'
import Unpaid_icon from './images/Unpaid_icon.png'
import Vacation_icon from './images/Vacation_icon.png'
import Shift_icon from './images/Shift_icon.png'
import Norest_icon from './images/Norest_icon.png'
import { Button , message , DatePicker  } from 'antd'
import moment from 'moment'


const classesTwo=[
    {
      name:'调休',
      img: Shift_icon ,
      index:4,
    },
    {
      name:'未休',
      img:Norest_icon ,
      index:5,
    },
]
const classes=[ 
    {
      name:'缺勤',
      img:Absence_icon ,
      index:0,
    },
    {
      name:'无薪假',
      img:Unpaid_icon ,
      index:1,
    },
    {
      name:'有薪假',
      img:Vacation_icon ,
      index:2,
    },
    {
      name:'换班',
      img:Shift_icon ,
      index:3,
    },
 ]

export default class workAdj extends Component{
    constructor(prop){
       super(prop)
       this.state={
          index:-1,
          value:{},
          arrangeClassShow:false,
          arrangeRestShow:false,
          date:null,
          changeIndex:0,//安排班次
       }
    }
    handerSelect=(i)=>{
        const { classList , maintainMessage } = this.props
        const { staff } = maintainMessage
        const newClassList=[ ...classList ] 
        .filter(item=>item.name!=='休息' && item.id!==staff.shiftId )
        if(i<=2){
           this.setState({
            value:{
                name:classes[i].name,
                index:classes[i].index,
            },
            index:i,
            arrangeClassShow:false,
           }) 
        }
        else{
            if(newClassList.length===0)return
            this.setState({
              index:i,
              arrangeClassShow:true,
              value:{
                name:newClassList[0].name,
                id:newClassList[0].id,
                index:-1,
              },
            })
        }
    }
   
    renderContent( h , { node } ){
     let isString = Object.prototype.toString.call(node.label).slice(8,-1)==='String'
      return h('span',{},[
        h('el-tooltip',
        {
          props:{
            content:isString ? node.label : node.label.des ,
            effect:'light',
            popperClass:'POPS',
          },
        },[
          h('span',{}, isString ? node.babel :node.babel.title ),
        ]),
      ])
    }
    changeClassIndex=(item,i)=>{
       this.setState({
           changeIndex:i,
           value:{
             name:item.name,
             index:-1,
             id:item.id,
           },
       })
    }
    //用于休息日得判定
    handerSelectRest=(i)=>{
      const { classList ,maintainMessage } = this.props
      const { staff  } = maintainMessage
      const newClassList=[ ...classList ] 
      .filter(item=>item.name!=='休息' && item.id!==staff.shiftId )
      if(newClassList.length===0){
        message.info('无班次可选')
        return
      }  
       this.setState({
         arrangeRestShow:true,
         index:i,
         date:null,
         value:{
           name:classesTwo[i].name,
           index:classesTwo[i].index,
           class:newClassList[0].name,
           id:newClassList[0].id,
           date:null,
         },
       })
    }
    //休息日窜休调整
    changeRestIndex=(item,i)=>{
      const { value ,date } = this.state
      this.setState({
        changeIndex:i,
        value:{
           ...value,
          class:item.name,
          id:item.id,
          date,
        },
      })
    }
    changeTime=(e)=>{
      if(e){
        const { value } = this.state
        this.setState({
            date:moment(e).format("YYYY-MM-DD"),
            value:{
               ...value,
               date:moment(e).format("YYYY-MM-DD"),
            },
        })
      }
    }
    //限制本月外其他时间
    controlShowTime=(e)=>{
      //获取本月时间
      const {  staffDayList , yearMonth  } = this.props
      let workDayList=[...staffDayList]
      .filter(item=>item.status===0)
      let dateFormatList=[...workDayList]
      .map(item=>{
        let day
        item.day<10 ? day='0'+item.day : day=String(item.day)
        return  yearMonth+'-'+day
      })
      console.log(dateFormatList)
      // let newTime= new Date()
      // moment(newTime).format('YYYY-MM')
      if(dateFormatList.indexOf(moment(e).format('YYYY-MM-DD'))>=0){
        return false
      }
      else return true
    }
    //提交
    handerSubmit=(obj)=>{
      const  { handleBackdata } = this.props
      if(obj.value.name==='调休'){
         obj.value.date===null ? message.info('请选择调休时间') :  handleBackdata({ type:obj.type ,value:obj.value }) 
      }else{
        handleBackdata({ 
          type:obj.type ,
          value:obj.value,
        })
      }
    }
    componentWillMount(){
      let isString = Object.prototype.toString.call({}).slice(8,-1)==='String'
     console.log( isString)
    }
    render(){
        const { 
            index ,
            arrangeClassShow , 
            arrangeRestShow,
            changeIndex ,
            value,
         } = this.state
        const { 
            classList ,
            handleCancel ,
            type,
            maintainMessage,
         } = this.props
        const { staff } = maintainMessage
        let newClassList=[ ...classList ] 
        .filter(item=>item.name!=='休息' && item.id!==staff.shiftId )
        let height = Math.ceil(newClassList.length/3)*100+98
        return <div>
           {
             type===0 ?
             <div className={ style.zl_M_box } >
             { classes.map((item,i)=>
             <div key={i} className={ style.zl_M_boxItem }  
             onClick={ this.handerSelect.bind(this,i) }   
             style={{ border:index===i ? '1px solid #4AACF7' : '1px solid rgba(225, 225, 230, 1) '   }}   >
               <img  src={item.img}  alt=''   />
               <span>{ item.name }</span>
              </div>)
             }
             {
            //用于工作日得调整
             }
             { arrangeClassShow && 
             (<div className={ style.zl_arrange_class }  style={ { height:height+'px'  } }  >
                <span className={ style.zl_M_3 } ></span>
                <span className={ style.zl_M_4 } ></span>
                <p>安排班次</p>
              {
               newClassList.map((item,i)=>
               (<div 
                onClick={ this.changeClassIndex.bind(this,item,i) }  
                className={ i===changeIndex ? style.zl_arrange_SelectBOX :'hh' }  key={i} 
                style={{ marginRight:(i+1)%3===0? 0 : '100px' , marginBottom: '20px'  }} >
                 { item.name }
               </div>)) 
              }
             </div>)
             }
             </div>
             :
             <div className={ style.zl_M_box } >
             { classesTwo.map((item,i)=>
             <div 
             key={i} 
             className={ style.zl_M_boxItem }  
             onClick={ this.handerSelectRest.bind(this,i) }   
             style={{ border:index===i ? '1px solid #4AACF7' : '1px solid rgba(225, 225, 230, 1) '   }}   >
               <img  src={item.img}  alt=''   />
               <span>{ item.name }</span>
              </div>)
             }
             {
            //用于休息日得调整
             }
              { arrangeRestShow && 
             (<div className={ style.zl_arrange_class }  style={ { height: index===0 ? (height+70)+'px'  : height+'px'  } }  >
                <span className={ style.zl_M_3 } ></span>
                <span className={ style.zl_M_4 } ></span>
              { index===0 && <span style={{ marginTop:'24px' }} >
                  更换日期
               <DatePicker  
                format='YYYY-MM-DD'  
                size='large'  
                style={{ width:'350px',marginLeft:'10px' ,height:'40px' }}  
                //限制本月时间
                disabledDate={this.controlShowTime}
                onChange={ this.changeTime }  />  </span> 
              }
                <p>安排班次</p>
              {
               newClassList.map((item,i)=>
               (<div 
               onClick={ this.changeRestIndex.bind(this,item,i) }  
               className={ i===changeIndex ? style.zl_arrange_SelectBOX :'hh' } 
               key={i} style={{ marginRight:(i+1)%3===0? 0 : '100px',marginBottom:'20px'   }} >
                 { item.name }
               </div>)) 
              }
             </div>)
             }
             </div>
           }
           <div style={{ marginBottom:'40px',overflow:'hidden' , paddingBottom:'32px' }} >
                <Button 
                 onClick={ ()=>handleCancel()  } 
                 style={{  float:'right' ,width:'88px',height:'40px' , marginLeft:'24px' } } >
                 取消
                 </Button>
                <Button  
                onClick={()=> value.name  && this.handerSubmit({type ,value }) }  
                type="primary" 
                style={{ float:'right', width:'88px',height:'40px' } } >
                确定
                </Button>
           </div>
        </div>
    }
}