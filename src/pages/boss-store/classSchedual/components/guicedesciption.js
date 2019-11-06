import React,{ Component } from "react"
import style from '../style.less'
import Scheduling_icon from './images/Scheduling_icon.png'
import Scheduling_batch_icon from './images/Scheduling_batch_icon.png'
import Scheduling_convenient_icon from './images/Scheduling_convenient_icon.png'
import Scheduling_Calculation_icon from './images/Scheduling_Calculation_icon.png'

class index extends Component {
    constructor(prop){
        super(prop)
        this.state={
           content:[
               {
                 images:Scheduling_batch_icon,
                 title:'一键批量排班',
                 content:'拥有快捷排班功能，迅速安排员工工作',
               },
               {
                images:Scheduling_convenient_icon,
                title:'便捷考勤记录',
                content:'轻松记录员工实际上班，请假，调休等情况',
              },
              {
                images:Scheduling_Calculation_icon,
                title:'智能计算薪资',
                content:'通过结合员工的薪资方案，以及员工的实际出勤状况，智能化计算员工薪资',
              },
           ],
        }
    }
    render(){
        const { content } = this.state
        return <div>
                  <div style={{overflow:'hidden'}} className={style.zl_mast_sectionone}>
                    <img src={Scheduling_icon} alt=''  style={{float:'left'}}/>
                    <div className={ style.zl_rightBox } >
                      <p>员工排班</p>
                      <p>帮助门店安排员工上班时间，监控员工上班，请假，调休等实际考勤情况，</p>
                      <p>并以此为基础，实现门店智能化员工薪资计算。</p>
                    </div>
                  </div>
                  <div className={style.zl_mast_sectionTwo} >
                  { content.map((item,i)=>(
                    <div key={i}  className={style.zl_boxItem} >
                    <img src={item.images}  alt=""  />
                    <p>{item.title}</p>
                    <p>{item.content}</p>
                    </div>
                  ))  }
                  </div>
              </div>
    }
}
export default index
