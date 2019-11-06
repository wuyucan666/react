import { Table } from 'antd'
import { useState } from 'react'

import { handerType ,asyncEffect ,api } from './tableConfig'

interface TheTableProps{
   type:number,
   date:any,
   loading:boolean
}
export default  function TheTable ({ type , date, loading }:TheTableProps){
    const [ dataList , getDataList ] = useState([])
    asyncEffect(async()=>{
       getDataList( await api(type,date) )
    },[type,date])
     return <div  >
        <Table columns={ handerType(type) } pagination={false}  dataSource={dataList} loading={loading} />
     </div>
}
