import { Component } from 'react'
import config from './config/projectConfig'
import CommonTable from '../../../components/CommonTable'
import { DatePicker , Select  } from 'antd' 
import service from 'services'
import moment from 'moment'
const { MonthPicker } = DatePicker
const Option = Select.Option

var lastMonth = moment().subtract(0, 'months')

export default class projectControl extends Component{
    constructor(prop){
        super(prop)
        this.state={
           array:[],
           name:null,
           value:null,
           time:lastMonth,
        }
    }
    componentDidMount(){
        this.setState({
            loading:false,
        },()=>{
            service
        .LIST({
          keys: { name: "common/store/list" },
          data: {
            q: { page: 1, limit: -1, where: {} },
          },
        })
        .then(res => {
          let array=[]
          res.list.forEach(e=>{
              array.push({value: e.id, name: e.storeName})

          })
          this.setState({
            array,
            name:array[0] ? array[0].name : null ,
            value:array[0] ? array[0].value : '无门店可选',
            isShow:true,
            loading:true,
          })
        })
        })
    }
    select=(value)=>{
        console.log(value)
      this.setState({
          value,
      })
    }
    changeMonth=(time)=>{
      this.setState({
        loading:false,
        time,
      },()=>{
        this.setState({
          loading:true,
        })
      })
    }
    changeStore=(val)=>{
      const { array } = this.state
       let current = array.filter(i=>i.value===val)
       this.setState({
         value:val,
         name:current[0].name,
         loading:false,
       },()=>{
         this.setState({
           loading:true,
         })
       })
    }
    render(){
        const {   array  ,loading  , time  , value   } = this.state
        config.screen.rules[0].component = (
        <div style={{ width:'220px' , position:'relative' }} >
           <Select  size='large' onChange={this.changeStore}  value={value}   placeholder='无门店可选'  style={{ width:'220px'  }}  >
             {
               array.map((item,i)=><Option key={i}  value={item.value}  >{ item.name  }</Option>)
             }
           </Select>
        </div>)
        config.screen.rules[2].component = (
          <div>
              <MonthPicker
                allowClear={false}
                size='large'
                placeholder='选择月份'
                onChange={this.changeMonth}
                value={time}
              >
              </MonthPicker>
          </div>
        )
        let date = moment(time).format('YYYY-MM')
        config.screen.query={
          date,
          storeId:value,
        }
        return <div>

              {
                 loading &&
                 <CommonTable
                 New
                 name="brand/wide/inventory/receive/collect"
                 tableConfig={config}
                />
              }

             </div>
    }
}
