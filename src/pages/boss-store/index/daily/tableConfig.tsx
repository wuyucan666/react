import { useEffect } from 'react'
import services from 'services'
import router from 'umi/router'
const style = require('./index.less')

var hasPermission: boolean = false

var congigDate :any

const pickRouter = (id: any, type: any) => {
    let query = {
        id,
        type,
        completed: congigDate,
        propertyName: '',
    }
    if(type === 1) {
        query.propertyName = 'maintainTypeId'
    } else if(type === 2) {
        query.propertyName = 'projectId'
    } else {
        query.propertyName = 'productId'
    }
    router.push({ pathname: "/boss-store/maintain-list/orderAll", query})
}

const columns1 = [
    {
      title: '业务类型',
      prop: 'maintainTypeName',
      key: 'maintainTypeName',
      width:'11%',
      render: (e:any) => 
      <span 
      style={{color: '#000'}} 
      className={e.isTotal ? '' : style.link}
      onClick={() => pickRouter(e.maintainTypeId, 1)}
      >{e.maintainTypeName}</span>,
    },
    {
      title: '工单数',
      prop: 'orderCount',
      key: 'orderCount',
      width:'11%',
      render: (e:any) => <span style={{ color:e.isTotal ? '#000' : '#666' }} >{e.orderCount}</span>,
    },
    {
      title: '业绩',
      key: 'receipts',
      prop: 'receipts',
      width:'11%',
      render: (e:any) => <span style={{ color:e.isTotal ? '#000' : '#666' }} >{e.receipts}</span>,
    },
    {
        title: '业绩占比',
        prop: 'receiptsRatio',
        key: 'receiptsRatio',
        width:'11%',
        render: (e:any) => <span style={{ color:e.isTotal ? '#000' : '#666' }} >{e.receiptsRatio}%</span>,
    },
    {
        title: '成本',
        prop: 'cost',
        key: 'cost',
        width:'11%',
        render: (e:any) => <span style={{ color:e.isTotal ? '#000' : '#666' }} >{hasPermission ? e.cost : '*******'}</span>,
    },
    {
        title: '毛利',
        prop: 'profit',
        width:'11%',
        key: 'profit',
        render: (e:any) => <span style={{ color:e.isTotal ? '#000' : '#666' }} >{hasPermission ?  e.profit : '*******'}</span>,
    },
    {
        title: '总车辆',
        prop: 'carCount',
        width:'11%',
        key: 'carCount',
        render: (e:any) => <span style={{ color:e.isTotal ? '#000' : '#666' }} >{e.carCount}</span>,
    },
    {
        title: '会员车辆',
        prop: 'clientCarCount',
        width:'11%',
        key: 'clientCarCount',
        render: (e:any) => <span style={{ color:e.isTotal ? '#000' : '#666' }} >{e.clientCarCount}</span>,
    },
    {
        title: '散客车辆',
        prop: 'touristCarCount',
        width:'11%',
        key: 'touristCarCount',
        render: (e:any) => <span style={{ color:e.isTotal ? '#000' : '#666' }} >{e.touristCarCount}</span>,
    },
  ]
  const columns2=[
    {
        title: '项目',
        prop: 'name',
        key: 'name',
        width:'18%',
        render: (e:any) => <span 
        style={{color: '#000'}} 
        className={e.isTotal ? '' : style.link} 
        onClick={() => pickRouter(e.id, 2)}
        >{e.name}</span>,
    },
    {
        title: '项目分类',
        prop: 'categoryName',
        key: 'categoryName',
        width:'14%',
        render: (e:any) => <span style={{ color:e.isTotal ? '#000' : '#666' }} >{e.categoryName}</span>,
    },
    {
        title: '工单数',
        prop: 'orderCount',
        key: 'orderCount',
        width:'14%',
        render: (e:any) => <span style={{ color:e.isTotal ? '#000' : '#666' }} >{e.orderCount}</span>,
    },
    {
        title: '业绩',
        prop: 'receipts',
        key: 'receipts',
        width:'14%',
        render: (e:any) => <span style={{ color:e.isTotal ? '#000' : '#666' }} >{e.receipts}</span>,
    },
    {
        title: '业绩占比',
        prop: 'receiptsPercent',
        key: 'receiptsPercent',
        width:'14%',
        render: (e:any) => <span style={{ color:e.isTotal ? '#000' : '#666' }} >{e.receiptsPercent}%</span>,
    },
    {
        title: '成本',
        prop: 'cost',
        key: 'cost',
        width:'14%',
        render: (e:any) => <span style={{ color:e.isTotal ? '#000' : '#666' }} >{hasPermission ? e.cost : '*******'}</span>,
    },
    {
        title: '毛利',
        prop: 'profit',
        width:'10%',
        key: 'profit',
        render: (e:any) => <span style={{ color:e.isTotal ? '#000' : '#666' }} >{hasPermission ? e.profit : '*******'}</span>,
    },
  ]
const columns3 =[
    {
        title: '产品',
        prop: 'name',
        key: 'name',
        width:'18%',
        render: (e:any) => <span 
        style={{color: '#000'}} 
        className={e.isTotal ? '' : style.link} 
        onClick={() => pickRouter(e.id, 3)}
        >
            {e.name}
            {
                !e.isTotal && <span>（{e.commodityCode}）</span>
            }
        </span>,
    },
    {
        title: '产品分类',
        prop: 'categoryName',
        key: 'categoryName',
        width:'14%',
        render: (e:any) => <span style={{ color:e.isTotal ? '#000' : '#666' }} >{e.categoryName}</span>,
    },
    ...columns2.slice(2)
]
const columns4 = [
    {
        title: '员工',
        prop: 'name',
        key: 'name',
        width:'18%',
        render: (e:any) => <span style={{ color:e.isTotal ? '#000' : '#666' }} >{e.name}</span>,
    },
    {
        title: '工单数',
        prop: 'orderCount',
        key: 'orderCount',
        width:'14%',
        render: (e:any) => <span style={{ color:e.isTotal ? '#000' : '#666' }} >{e.orderCount}</span>,
    },
    {
        title: '业绩',
        prop: 'total',
        key: 'total',
        width:'14%',
        render: (e:any) => e.isTotal? <span style={{ color:'#000' }} >{e.total}</span> :<span onClick={ ()=>{ router.push({ pathname: "/boss-store/performance-report", query :{ staffId:e.id ,date:congigDate } })  } } className={style.zl_tableSpan}  style={{ color: '#4AACF7' }} >{e.total}</span> ,
    },
    {
        title: '业绩占比',
        prop: 'proportion',
        key: 'proportion',
        width:'14%',
        render: (e:any) => <span style={{ color:e.isTotal ? '#000' : '#666' }} >{e.proportion}%</span>,
    },
    {
        title: '销售业绩',
        prop: 'sales',
        key: 'sales',
        width:'14%',
        render: (e:any) => <span style={{ color:e.isTotal ? '#000' : '#666' }} >{e.sales}</span>,
    },
    {
        title: '施工业绩',
        prop: 'builder',
        key: 'builder',
        width:'14%',
        render: (e:any) => <span style={{ color:e.isTotal ? '#000' : '#666' }} >{e.builder}</span>,
    },
    {
        title: '今日提成',
        prop: 'deduct',
        key: 'deduct',
        width:'14%',
        render: (e:any) => e.isTotal? <span style={{ color:'#000' }} >{e.deduct}</span> :<span   onClick={ ()=>{ router.push({ pathname: "/boss-store/commission-detail", query :{ staffId:e.id ,date:congigDate } })  } }  className={style.zl_tableSpan}  style={{ color: '#4AACF7' }} >{e.deduct}</span> ,
    },
]
const apiList = [ 'wideReportMaintian' , 'wideReportProject', 'wideReportProduct' , 'wideReportStaff' ]
const handerData = (list:any,nameList:any)=>{
    console.log('------------', list, nameList)
    list.forEach((item:any)=>{
        for( let name in nameList ){
            if(name!=='maintainTypeName'&& name!=='isTotal' && name!=='name' && name!=='categoryName'  ){
                nameList[name] += item[name] * 1
            }
        }
    })
    for(let name in nameList ){
       if(name!=='maintainTypeName'&& name!=='isTotal'  && name!=='name' && name!=='categoryName' ){

           if(name === 'orderCount' || name === 'carCount' || name === 'clientCarCount' || name === 'touristCarCount'){
              nameList[name] = parseInt(nameList[name])
           }else{
              nameList[name] = nameList[name].toFixed(1) || '*******'
           }

       }
     }

     return [ ...list ,nameList ]
}
export const typeArr = [ '业务类型' ,'项目', '产品',  '员工'  ]
export const  handerType = (type:number)=>{
   switch(type){
       case 0 :
        return columns1
       case 1 :
        return columns2
       case 2 :
        return columns3
       case 3 :
        return columns4
       default:
        return []
   }
}
export const asyncEffect = (cb:Function,dep:any) => {
      useEffect(()=>{
        cb()
      },dep)
}
export const  api = async (type:number,date:any,arr= []) =>{
    congigDate = date
    hasPermission = localStorage.getItem('permissionRole').indexOf('d079520e') > -1
    await services[apiList[type]]({  data: { q: { where: { 'completed[<>]':date  } } } }).then((res:any)=>{
             if(res.code==='0'){
                 let nameList :any
                 switch(type){
                     case 0:
                     nameList = { maintainTypeName:'合计',isTotal:true }
                     columns1.slice(1).forEach((item)=>{ nameList[item.key] = 0 })
                     break
                     case 1:
                     nameList = { name:'合计', categoryName:'' ,isTotal:true }
                     columns2.slice(2).forEach((item)=>{ nameList[item.key] = 0 })
                     break
                     case 2:
                     nameList = { name:'合计', categoryName:'' ,isTotal:true }
                     columns3.slice(2).forEach((item)=>{ nameList[item.key] = 0 })
                     break
                     case 3:
                     nameList = { name:'合计' ,isTotal:true }
                     columns4.slice(1).forEach((item)=>{ nameList[item.key] = 0 })
                 }
                 arr = handerData(res.list,nameList )
             }
     })
    return arr
}
