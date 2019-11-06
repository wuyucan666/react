import { Component } from 'react'
import style from './style.less'
import { Icon , Button } from 'antd'
import img1 from '../img/chahua_01.jpg'
import img2 from '../img/chahua_02.jpg'
import img3 from '../img/chahua_03.png'
import xi from '../img/xi.png'
import yang from '../img/yang.png'
import nian from '../img/nian.png'
import sheng from '../img/sheng.png'
const arr = [{
               icon:img1,
               title:'融入行业大咖经验专业阶梯划分',
               des:'我们通过汇集行业内最大咖的会员管理导师的丰富经验，提供专业化的会员阶段划分！',
             },
             {
               icon:img2,
               title:'开启即用精细化会员分类及管理',
               des:'一键开启功能，系统自动对您的会员进行专业维度的深度分析，并划分好每个会员的成长阶段',
             },
             {
               icon:img3,
               title:'对会员了如指掌个性化服务，提升成交',
               des:'PC端、移动端，查询会员即可看到会员的“全方位信息”，大幅提升顾客体验及推荐成交率！',  
             }]
const arr2 = [
               {
                 icon:xi,
                 title:'吸客',
                 p1:'培养顾客认同（服务好、效果好）',
                 p2:'对顾客进行持续跟踪，预约顾客下次到店，防止顾客流失。设置8个左右认同点，让顾客多方面不断产生认可。',
                 p3:'服务满意度、顾客回头率、到店频次',
               },
               {
                 icon:yang,
                 title:'养客',
                 p1:'跟顾客成为朋友，提升顾客喜爱度',
                 p2:'用长期卡锁住顾客，成为顾客的朋友，关心顾客的家长里短，培养顾客时不时地到店里坐坐。',
                 p3:'到店频次、逗留时长、消费频次',
               },
               {
                 icon:nian,
                 title:'黏客',
                 p1:'让顾客爱上品牌，成为品牌的粉丝',
                 p2:'用心服务，不要让顾客有失望的可能。提高顾客消费客单价，开始铺垫顾客身边潜在顾客。',
                 p3:'品牌认可度、消费频次、客单价',
               },
               {
                 icon:sheng,
                 title:'升客',
                 p1:'对品牌产生好感，对服务感到满意',
                 p2:'通过高性价比的拓客服务，让顾客了解品牌，并体验到具有特色的项目，给予超出顾客预期的服务，培养顾客信任。',
                 p3:'服务满意度',

               },
             ]

class Mast extends Component{
   constructor(props){
      super(props)
      this.state={
        nextStep:true,
      }
   }
   handerMastHidden=()=>{
       const { handerMastHidden } = this.props
       handerMastHidden()
   }
   changeStatus=()=>{
       const { nextStep } = this.state
       this.setState({
           nextStep:!nextStep,
       })
   }
   render(){
       const { nextStep } = this.state
       return <div className={ style.zl_mast } >
          <div className={ style.zl_mast_content } >
            <div style={{ height:'70px',lineHeight:'70px',paddingRight:'32px',paddingTop:'10px' }} >
               <Icon onClick={ this.handerMastHidden }  type="close" style={{ float:'right' ,color:'#999' ,marginTop:'19px'  }}  />
            </div>
           {
             nextStep ?
             <div>
             <p className={style.zl_title} >会员培养阶段</p>
             <p className={style.zl_des} >
               深度融合行业运营经验，将顾客划分吸、养、黏、升多个不同的培养阶段；为顾客提供个性化的服务，精准命中顾客需求，科学、可持续地培养和挖掘顾客。
             </p>
             <div className={style.zl_content} >
               {
                arr.map((item,i)=>
                <div key={i} className={style.zl_item} >
                  <img src={item.icon}  alt=''   />
                  <p>{ item.title }</p>
                  <p>{ item.des }</p>
                </div>)   
               }
             </div>
           </div>
           :
           <div>
             <p className={style.zl_title} >会员发展阶段</p> 
             <div className={style.zl_content}  style={{ marginLeft:'38px' }} >
              {
                arr2.map((item,i)=>
                <div key={i} className={style.zl_itemTwo} >
                  <img src={item.icon} alt=''  />
                  <p>{ item.title }</p>
                  <p><span>目标：</span>{item.p1}</p>
                  <p><span>指南：</span>{item.p2}</p>
                  <p><span>关键指标：</span>{item.p3}</p>
                </div>)  
              }
             </div>
           </div> 
           }
            <Button  onClick={this.handerMastHidden }  type='default' style={{ width:'120px' , position:'absolute', right:'172px',bottom:'32px' }} >
               我知道了
            </Button>
            <Button  onClick={this.changeStatus}  type='primary' style={{ width:'120px' , position:'absolute', right:'32px',bottom:'32px' }} >
             {  nextStep ? '下一页' : '上一页'  }
            </Button>
          </div>
       </div>
   }

}

export default Mast