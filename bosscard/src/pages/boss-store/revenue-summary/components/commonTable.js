import React,{ Component } from 'react'
import styles from '../style.less'
import { Tooltip , Icon } from 'antd'
import { tableHeaderOne  } from '../mockData'
import router from 'umi/router'
let tableHeader=[]
tableHeader.push(tableHeaderOne)
const routergo=()=>{
    router.push('/boss-store/performance-report')
}
const handerProduceTable=(data,boolean,i)=>{
   return (<ul  key={i} style={ { color:!boolean||'rgba(51,51,51,1)' } } className={ boolean ? styles.zl_tableTotalPrice :null  } >
             <li><span>{data.categoryName}</span></li>
             <li><span>{data.orderNumber}</span></li>
             <li><span>{data.output}</span></li>
             <li><span>{data.cost}</span></li>
             <li><span>{data.profit}</span></li>
             <li><span>{data.clientCar}</span></li>
             <li><span>{data.car}</span></li>
             <li><span>{data.carAll}</span></li>
             <li><span>{data.avgOutput}</span></li>
             <li><span className={styles.zl_icon}   >{data.beOutput} <Tooltip title='业绩报表'  ><Icon  type='login'  onClick={()=>{ routergo() }  }   style={{ float:'right',color:'#999',fontSize:'20px',marginRight:'32px',marginTop:'18px'  }}   /></Tooltip> </span></li>
          </ul>)
}
const handerComputerPrice=(data)=>{
   let o={
         categoryName:'合计',
         orderNumber:0,
         output:0,
         cost:0,
         profit:0,
         clientCar:0,
         car:0,
         carAll:0,
         avgOutput:0,
         beOutput:'100%',
       }
       data.forEach(i=>{
              o.orderNumber+=i.orderNumber*1
              o.output+=(i.output*1)
              o.cost+=(i.cost*1)
              o.profit+=(i.profit*1)
              o.clientCar+=i.clientCar*1
              o.car+=i.car*1
              o.carAll+=i.carAll*1       
       })
       let a
       (o.orderNumber*1)===0 ? a=1 : a=(o.orderNumber*1)
       o.avgOutput=((o.output*1)/a).toFixed(2)
       return handerProduceTable(o,true)
}
class Table extends Component{
   constructor(props){
       super(props)
       this.state={
           tableHeader,
       }
   }
   UNSAFE_componentWillMount(){
   }
   render(){
       const { dataList } =this.props  
       const { tableHeader } = this.state
       return ( <div>
          <div className={ styles.zl_tableHeader } >
             <ul>
                 {
                    tableHeader[0].map((item,idx)=> <li key={idx} ><span> { item } </span> </li>  )
                 }
             </ul>
          </div>
          <div className={ styles.zl_tableBody } >
              <div>一级分类</div>
              {
                dataList.categoryOne.map((item,i)=> { return handerProduceTable(item,false,i) })
              }
              { handerComputerPrice(dataList.categoryOne) }
              <div>二级分类</div>
              {
                dataList.categoryTwo.map((item,i)=> { return handerProduceTable(item,false,i) })
              }
              { handerComputerPrice(dataList.categoryTwo) }
          </div>
               </div> )     
   }
}
export default Table
