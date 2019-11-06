import { Component } from 'react'
import config from './config'
import CommonTable from '../../../components/CommonTable'






export default class superMissonNote extends Component{
    constructor(prop){
        super(prop)
        this.state={
           loading:true,
        }
    }
    render(){
        const { loading } = this.state
      
        return <div>       
              {
                 loading &&
                 <CommonTable
                 New
                 name="store/superPrivilege/list"
                 tableConfig={config}
                /> 
              }
               
             </div>
    }
}