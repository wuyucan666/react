import React,{ Component } from "react"
import style from '../style.less'
import guide_01 from './images/guide_01.png'
import guide_02  from './images/guide_02.png'
import guide_03  from './images/guide_03.png'
import guide_04  from './images/guide_04.png'
import guide_05  from './images/guide_05.png'
import guide_06  from './images/guide_06.png'

class index extends Component{
    constructor(prop){
      super(prop)
      this.state={

      }
    }
    render(){
        return  <div style={{height:'549px'}}>
                    <div style={{overflowX:'hidden',overflowY:'auto',height:'439px'}}>
                      <div className={style.progressDiv}>
                          <h3><em className={style.em}>1</em>每月排班前,点击<span style={{color:'#4AACF7'}}>【本月应休管理】</span>设置好每个员工的本月应休<span style={{color:'#4AACF7'}}>天数</span></h3>
                          <img src={guide_01} style={{margin:'5px 0 13px 0'}}/>
                      </div>
                      <div className={style.progressDiv}>
                          <h3><em className={style.em}>2</em>选择员工需要的<span style={{color:'#4AACF7'}}>排版日期</span>,点击后<span style={{ color:'#4AACF7' }}  >选择班次</span>。</h3>
                          <img src={guide_02} style={{margin:'5px 0 13px 0'}}/>
                      </div>
                      <div className={style.progressDiv}>
                          <h3><em className={style.em}>3</em>排班确认无误后点击<span style={{color:'#4AACF7'}}>【保存排班】</span>。<span style={{ color:'#4AACF7' }}  >注：保存后，已排的班次不可进行修改</span>。</h3>
                          <img src={guide_03} style={{margin:'5px 0 13px 0'}}/>
                      </div>
                      <div className={style.progressDiv}>
                          <h3><em className={style.em}>4</em>排班保存后可以对员工实际的<span style={{color:'#4AACF7'}}>出勤情况进行记录</span>。</h3>
                          <img src={guide_04} style={{margin:'5px 0 13px 0'}}/>
                      </div>
                      <div className={style.progressDiv}>
                          <h3><em className={style.em}>5</em>工作日可以调整为，<span style={{color:'#4AACF7'}}>“有薪假”、“无薪假”、“缺勤”、“换班”</span></h3>
                          <img src={guide_05} style={{margin:'5px 0 13px 0'}}/>
                      </div>
                      <div className={style.no_progressDiv}>
                          <h3><em className={style.em}>6</em>休息日可以进行<span style={{color:'#4AACF7'}}>“调休”</span>或者标记为<span style={{ color:'#4AACF7' }}  >“未休”</span>。</h3>
                          <img src={guide_06} style={{margin:'5px 0 13px 0'}}/>
                      </div>
                    </div>
                </div>
    }
}
export default index
