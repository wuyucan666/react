import React , { useState ,memo } from 'react'
import { Tabs } from 'antd'

const style = require('./index.less')
import Table from './table'
import  { typeArr }   from './tableConfig'

const { TabPane } = Tabs
export default  memo(({ date, loading }:any)=>{
    const [ activeKey , setActiveKey ] = useState('0')
    return <div className={style.zl_box} >
       <div>
       <Tabs  onChange={ (i)=>{setActiveKey(i)}} activeKey={(activeKey)} defaultActiveKey={'0'}  >
        { typeArr.map((item:string,i:number)=><TabPane tab={item} key={i.toString()}  ><Table type={i} date={date} loading={loading} /></TabPane>) }
       </Tabs>
       </div>
    </div>
},(pre,next)=>pre.date[0] === next.date[0] && pre.date[1] === next.date[1] )
