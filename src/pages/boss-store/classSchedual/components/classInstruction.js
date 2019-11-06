import React,{ Component } from 'react' 
import style from '../style.less'
import { Table , message } from 'antd'
import service from 'services'

// let dataList=[
//     {
//       class:'早班',
//       time:'19:00-23:00',
//       lengthTime:'4时30分钟',  
//       attendanceNumber:'1',
//       salaryPlanNumber:'1',
//     },
// ]


export default class c extends Component{
    constructor(prop){
      super(prop)
       this.state={
          dataList:[],
       }
    }
    UNSAFE_componentWillMount(){
        //请求数据
        service.storeShiftList({ keys: {name: 'brand/shift/item'} ,data:{ type: 0  } }).then(res=>{
            if(res.code==='0'){
                this.setState({
                    dataList:res.list,
                })
            }else{
               message.info('网络出现错误')
            }
        })
    }
    render(){
        const { dataList } = this.props 
        const columns=[
            {
                title: '班次',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: '时间',
                dataIndex: 'time',
                key: 'time',
            }, 
            {
                title: '时长',
                dataIndex: 'lengthTime',
                key: 'lengthTime',
            },
            {
                title: '出勤天数',
                dataIndex: 'attendanceNumber',
                key: 'attendanceNumber',
            }, 
            {
                title: '计薪天数',
                dataIndex: 'salaryPlanNumber',
                key: 'salaryPlanNumber',
            },
        ]
        return <div className={ style.zl_c_content  } >
          <Table columns={columns} dataSource={dataList} pagination={false}  />
        </div>
    }
}