import React,{ Component } from 'react'
import services from "services"
import styles from '../styles.less'
import router from 'umi/router'
const menuData=[
               {
                 name:'未回访',
                 route:'/boss-store/return-visit',
               },
               {
                 name:'逾期未回访',
                 route:'/boss-store/return-visit/visit-overdue',
                },
                {
                  name:'回访中',
                  route:'/boss-store/return-visit/visit-active',
                },
                {
                  name:'已回访',
                  route:'/boss-store/return-visit/visit-already',
                 },
                 {
                   name:'回访汇总',
                   route:'/boss-store/review-summary',
                 },
               ]
class CommonMenu extends Component{
    constructor(){
        super()
        this.state={
            lengthArr:null,
        }
    }
    handerRouter=(path)=>{
        router.push(path)
    }
    UNSAFE_componentWillMount(){
       services.getReturnTatal({ keys: {name: 'returnVisit/count' }  }).then(res=>{
          if(res.success){
              const { list } =res
              var item=list[3]
              list.splice(3)
              list.splice(1,0,item)
              this.setState({
                lengthArr:list.map((item)=>item.count),
              })
          }
       })
    }
    render(){
        const { index } = this.props
        const { lengthArr } =this.state
        return  <div   className={ styles.zl_commonMenu  }  >
                    <ul >
                       {
                         menuData.map((item,i)=><li   style={ { backgroundColor:index===i ? '#4aacf7':'' ,color:index===i ? '#fff': ''   } }   onClick={ this.handerRouter.bind(this,item.route) }  key={ i } >{ item.name }{ lengthArr ? (lengthArr[i]===undefined?'':'('+ lengthArr[i]+')') : ''   }  </li>)
                       }
                    </ul>
                 </div>
    }

}
export default CommonMenu
