/**
 * Created by zhengkika on 2018/11/24
 */
import React,{Component} from 'react'
import CommonTable from 'components/CommonTable/index'
import services from 'services'
import { Button,Modal,Table,message} from 'antd'
import { connect } from "dva"
import tableConfig from './tableConfig'

const { Column } = Table

class Refund extends Component{
  state = {
    money:0,
    id:'',
    visible:false,
    detail:[],
  }
  componentDidMount(){
    services.LIST({keys:{name:'erp/supplier/selector'}}).then(res => {
      tableConfig.screen.rules[1].list = res.list.map(item => ({name:item.name,value:item.id}))
    })
  }
  onTableChange = (e,item) => {
    switch (e) {
      case 14:
        services.LIST({keys:{name:`erp/reject/${item.id}`}}).then(res => {
          this.setState({
            detail:res.list,
            visible:true,
            money:item.recievedMoney,
            id:item.id,
          })
        })
        break
      default:
        console.log(e)
    }
  }
  remark = () => {
    const {id} = this.state
    services.UPDATE({keys:{name:`erp/reject`,id}}).then(res => {
      if(res.success){
        const {dispatch} = this.props
        message.success('标记成功')
        this.setState({visible:false})
        dispatch({
          type: 'table/getData',
          payload:{new:true},
        })
      }
    })
  }
  render(){
    const {visible,detail,money} = this.state
    const detailFooter = (
      <div>
        {
          Number(money) > 0 ?
            <div>
              <span style={{color:'#FF6F28'}}>应收金额：￥{money}</span>
              <Button type='primary' size='large' onClick={this.remark}>标记为已收</Button>
            </div>:
            null
        }
      </div>
    )
    return ( 
      <div>
        <div><CommonTable name='erp/reject' search='no,staffName' tableConfig={tableConfig} onTableChange={this.onTableChange} New/></div>
        <Modal
          title="退货单明细"
          width={900}
          visible={visible}
          footer={detailFooter}
          onCancel={()=>this.setState({visible:false})}
        >
          <Table dataSource={detail} pagination={false} rowKey={record => record.productId}>
            <Column
              title="序号"
              dataIndex="index"
              key="index"
              render={(text,record,index) => index+1}
            />
            <Column
              title="商品"
              dataIndex="product"
              key="product"
            />
            <Column
              title="编码"
              dataIndex="commodityCode"
              key="commodityCode"
            />
            <Column
              title="单价"
              dataIndex="price"
              key="price"
            />
            <Column
              title="数量"
              dataIndex="num"
              key="num"
            />
            <Column
              title="合计"
              dataIndex="totalPrice"
              key="totalPrice"
            />
          </Table>
        </Modal>
      </div>
    )
  }
}

export default connect()(Refund)
