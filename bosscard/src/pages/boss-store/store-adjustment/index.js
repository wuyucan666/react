import React,{ Component } from 'react'
import CommonTable from '../../../components/CommonTable/index'
import {connect}   from 'dva'
import {Form,Button} from 'antd'
import styles from './styles.less'
import Detail from './detail.js'
import tableConfig from './tableConfig'
import router from 'umi/router'



class  storeAdjustment extends Component{
     constructor(){
         super()
         this.state={
            type:[],
            dShow:false,
            showId:null,
            typeId:0,
         }
     }
     typeChange=(val)=>{
        this.setState({
            typeId:val,
        })
     }
     onTableChange=(e,item)=>{
       if(e===11){
         console.log('aasas')
          this.setState({
            showId:item.id,
            dShow:true,
          })
       }
     }
     //控制弹窗的显示隐藏
     detailShow=()=>{
         this.setState({
             dShow:false,
         })
     }
     inStore=()=>{
        router.push('store-adjustment/inStore')
     }
     outStore=()=>{
      router.push('store-adjustment/outStore')
     }
     render(){
         return  (<div style={ { position:'relative' } }  >
                       <div className={ styles.zl_button}  style={ {zIndex:1,clear:'both' } } >
                            <Button  onClick={ this.inStore }   style={{ height:'40px' ,marginRight:"32px" }} type="primary"  >入库调整</Button>
                            <Button onClick={ this.outStore }  type="primary" style={{ height:'40px' }}  >出库调整</Button>
                       </div>
                       <CommonTable
                       name="erp/stock/inventory/adjustment"
                       New
                       tableConfig={tableConfig}
                       onTableChange={this.onTableChange}
                       search={'storageNo,staffName'}>
                       </CommonTable>
                       { !this.state.dShow || <Detail  showId={ this.state.showId }  detailShow={ this.detailShow }  />  }

                 </div>)
     }
}
function mapStateToProps(state) {
    const {  productTypeList  ,dataList   } = state.storeAdjustment
    return { productTypeList , dataList }
  }
export default connect(mapStateToProps)(Form.create()(storeAdjustment))
