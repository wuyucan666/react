import React,{ Component } from "react"
import style from '../style.less'
import { Icon , Button } from 'antd'
import xuxian from './images/xuxian.png'
import guide_01 from './images/guide_01.png'
import xuxian2  from './images/xuxian.png'
import guide_02  from './images/guide_02.png'
import guide_03  from './images/guide_03.png'
import guide_04  from './images/guide_04.png'
import guide_05  from './images/guide_05.png'
import guide_06  from './images/guide_06.png'
 
class classMast extends Component{
    constructor(prop){
      super(prop)
      this.state={
         showFirstStep:true,
      }
    }
    handerMastHidden=()=>{
        this.props.handerMastHidden()
    }
    changeStatus=()=>{
      const { showFirstStep } = this.state
      this.setState({
        showFirstStep: !showFirstStep ,
      })
    }
    render(){
      const { showFirstStep } = this.state
        return <div  className={ style.zl_mast }  >
         <div className={ style.zl_mast_contentTwo } >
          <p className={ style.zl_headerP } >排班使用指引 <Icon onClick={ this.handerMastHidden }  type="close" style={{ float:'right' ,color:'#999' ,marginTop:'19px'  }}  /></p>
          {
            showFirstStep ?
          (<div className={ style.zl_imageStep } >
            <p> <span className={  style.zl_SymbolCirle  } >1</span> 每月排班前点击<span style={{ color:'#4AACF7' }} >【本月应休管理】</span>设置好每个员工的本月应休<span style={{ color:'#4AACF7' }}  >天数</span>。</p> 
             <img src={xuxian}  alt='' style={{ marginLeft:'14px' }}  />
             <img src={guide_01} alt=''   />
            <p> <span className={  style.zl_SymbolCirle  } >2</span>选择员工需要的<span style={{ color:'#4AACF7' }} >排版日期</span>点击后<span style={{ color:'#4AACF7' }}  >选择班次</span>。</p> 
             <img src={xuxian2}  alt='' style={{ marginLeft:'14px' }}  />
             <img src={guide_02} alt=''   />
            <p> <span className={  style.zl_SymbolCirle  } >3</span>排班确认无误后点击<span style={{ color:'#4AACF7' }} >【保存排班】</span>。<span style={{ color:'#4AACF7' }}  >注：保存后，已排的班次不可进行修改</span>。</p> 
             <img  src={guide_03} alt='' style={{  marginTop:'20px', marginLeft:'44px' }}   />
            <Button onClick={ this.changeStatus } type='primary' style={{ width:'88px' , height:'40px' , float:'right' , marginRight:'40px', marginTop:'187px' }}  >下一步</Button>
          </div>
          )
          :
          (
          <div className={ style.zl_imageStep } >
            <p> <span className={  style.zl_SymbolCirle  } >1</span> 排班保存后可以对员工实际的<span style={{ color:'#4AACF7' }}  >出勤情况进行记录</span>。</p> 
             <img src={xuxian}  alt='' style={{ marginLeft:'14px' }}  />
             <img src={guide_04} alt=''   />
            <p> <span className={  style.zl_SymbolCirle  } >2</span>工作日可以调整为，<span style={{ color:'#4AACF7' }}  >“有薪假”、“无薪假”、“缺勤”、“换班”。</span>。</p> 
             <img src={xuxian2}  alt='' style={{ marginLeft:'14px' }}  />
             <img src={guide_05} alt=''   />
            <p> <span className={  style.zl_SymbolCirle  } >3</span>休息日可以进行<span style={{ color:'#4AACF7' }} >“调休”</span>或者标记为<span style={{ color:'#4AACF7' }}  >“未休”</span>。</p> 
             <img  src={guide_06} alt='' style={{  marginTop:'20px', marginLeft:'44px' }}   />
            <Button  onClick={ this.handerMastHidden }  type='primary' style={{ width:'88px' , height:'40px' , float:'right' , marginRight:'40px', marginTop:'187px' }}  >我学会了</Button>
            <Button  onClick={ this.changeStatus }  style={{ width:'88px', height:'40px' , float:'right' ,marginTop:'187px' ,marginRight:"40px"  }}  >上一步</Button>
          </div>
          )
          }
         </div>
        </div>
    }
}
export default classMast