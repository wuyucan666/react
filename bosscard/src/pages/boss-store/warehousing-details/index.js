import { Component } from 'react'
import CommonTable from '../../../components/CommonTable/index'
import { Form, DatePicker, Button } from 'antd'
import { connect } from "dva"
import services from "../../../services"
import moment from 'moment'
import styles from './styles.less'
import tableConfig from "./tableConfig"
class warehoustt extends Component {
  	state = {
  	}
 	componentDidMount () {

  	}
	onTableChange = (e, v) => {
	    if(e === 16){
	      	services.UPDATE({keys: {name: 'erp/statistics/inventory', id: v.id}}).then(res => {
	      	})
      }
      // console.log(e,v)
      //调转到订单中心里面的详情，需要订单orderId和订单类型orderType
      if(e===22){
        const {dispatch,history,match} = this.props
        dispatch({
          type: "maintianList/goDetail",
          payload: {
            orderId:v.orderId, //orderID
            orderType: v.orderType , //orderType
            path:match.path,
            isHideDetailBtns: false,
          },
        })
        history.push("/boss-store/maintain-list/orderAll")
      }
	}
  	render () {
      	return (
	        <div>
	          	<CommonTable name="erp/statistics/selling/storage" search='productName,specification,commodityCode' refresh New onTableChange={this.onTableChange} tableConfig={tableConfig}></CommonTable>
	        </div>
      	)
    }
}

function mapStateToProps() {
    return {}
}
export default connect(mapStateToProps)(Form.create()(warehoustt))
