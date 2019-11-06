import React,{ Component } from 'react'
// import CommonTable from '../../../components/CommonTable/index'
import styles from './styles.less'
import services from 'services'
import { Table }  from 'antd'

const { Column } = Table

class Detail extends Component{
 constructor(){
     super()
     this.state={
         selectList:[],
     }
 }
 dShow=()=>{
    const { detailShow } =this.props
    detailShow() 
 }
 UNSAFE_componentWillMount (){
    services.storeAdjustmentDetail( { keys: {name: 'erp/stock/inventory/adjustment/',id:this.props.showId*1}  } ).then(res=>{
      this.setState({
          selectList:res.list,
      })
    })
 }
 render(){
    
     return(   
               <div className={ styles.zl_mast }  >
                    <div className={ styles.zl_mast_content } >
                      <p>库存调整明细 <span onClick={ this.dShow  } >&times;</span> </p>
                      <div className={ styles.zl_tableBox }   >
                      <Table
                                dataSource={ this.state.selectList }
                                pagination={false}
                                rowKey={record => record.id}
                            >
                                <Column
                                title="序号"
                                dataIndex="index"
                                key="index"
                                align='left'
                                width='12.5%'
                                render={(text,record,index) => index + 1}
                                />
                                <Column
                                title="商品"
                                dataIndex="productName"
                                key="productName"
                                width='17.5%'
                                align='left'
                                />
                                <Column
                                title="编码"
                                dataIndex="commodityCode"
                                key="commodityCode"
                                width='10%'
                                align='left'
                                />
                                <Column
                                title="单价"
                                dataIndex="goodsPrice"
                                key="goodsPrice"
                                align='left'
                                width='10%'
                                />
                                <Column
                                title="数量"
                                dataIndex="goodsNum"
                                key="goodsNum"
                                align='left'
                                width='10%'
                                />
                                 <Column
                                title="合计"
                                dataIndex="totalPrice"
                                key="totalPrice"
                                align='left'
                                width='12.5%'
                                />
                                <Column
                                title="仓库"
                                dataIndex="warehouseName"
                                key="warehouseName"
                                align='left'
                                width='15%'
                                />
                                 <Column
                                title="备注"
                                dataIndex="remark"
                                key="remark"
                                align='left'
                                width='15%'
                                />
                        </Table>
                      </div>
                    </div>
               </div> 
            )
 }
}
export default Detail