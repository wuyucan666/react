import React,{ Component } from 'react'
import CommonTable from 'components/CommonTable/index'
import router from 'umi/router'


class classManagement extends Component{
    constructor(prop){
        super(prop)
        this.state={

        }

    }

    onTableChange=(e,v)=>{
       if(e===11){//修改
           router.push('/boss-brand/addClassGroup?id='+v.id)
       }
       if(e===217){//新增
           router.push('/boss-brand/addClassGroup')
       }
    }
    render(){

        return <div>
          <CommonTable
           name="brand/shift"
           onTableChange={ this.onTableChange  }
           New
           />
        </div>
    }
}
export default classManagement
