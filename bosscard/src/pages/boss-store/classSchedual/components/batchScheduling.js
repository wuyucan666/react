import React,{ Component } from "react"
import style from '../style.less'
import piliang_1  from './images/piliang_1.png'
import piliang_2  from './images/piliang_2.png'
import piliang_3  from './images/piliang_3.png'

class index extends Component{
    constructor(prop){
      super(prop)
      this.state={

      }
    }
    render(){
        return  <div>
                    <div className={style.progressDiv}>
                        <h3><em className={style.em}>1</em>点击<span style={{color:'#4AACF7'}}>展开</span>【批量排班】,选择一个<span style={{color:'#4AACF7'}}>班次</span></h3>
                        <img src={piliang_1} style={{margin:'5px 0 13px 0'}}/>
                    </div>
                    <div className={style.progressDiv}>
                        <h3><em className={style.em}>2</em><span style={{color:'#4AACF7'}}>在排班表中进行点击，完成该排班的排班;</span></h3>
                        <img src={piliang_2} style={{margin:'5px 0 13px 0'}}/>
                    </div>
                    <div className={style.progressDiv}>
                        <h3><em className={style.em}>3</em><span style={{color:'#4AACF7'}}>选择下一个班次，继续排班...</span></h3>
                        <img src={piliang_1} style={{margin:'5px 0 13px 0'}}/>
                    </div>
                    <div className={style.no_progressDiv}>
                        <h3><em className={style.em}>4</em><span style={{color:'#4AACF7'}}>点击收起【批量操作】，结束批量操作</span></h3>
                        <img src={piliang_3} style={{margin:'5px 0 17px 0'}}/>
                    </div>
                </div>
    }
}
export default index
