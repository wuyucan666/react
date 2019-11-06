import { Component } from 'react'
import CommonTable from '../../../components/CommonTable/index'
import { Select, Form, Button, DatePicker } from 'antd'
import styles from './styles.less'
import {connect}   from 'dva'
import services from 'services'
import moment from 'moment'
import tableConfig from './tableConfig'
const Option = Select.Option
class receivecom extends Component {
  	state = {
  		created: moment().format('YYYY-MM-DD'),
    	status: 0,
  	}
 	componentDidMount () { 	
    	this.props.dispatch({type:'receivedetail/getstockList',payload: {}})
  	}
	onTableChange = (e, v) => {
	    if(e === 16){
	      	services.UPDATE({keys: {name: 'erp/statistics/inventory', id: v.id}})
	    }
	}
  	render () {
  		tableConfig.screen.rules[1].list =this.props.stockTypesList.map(item => ({name:item.type,value:item.id}))
      	return (
	        <div>
	          	<CommonTable name="erp/statistics/receive/detail" refresh New onTableChange={this.onTableChange} tableConfig={tableConfig}>		           	
		           	
	          	</CommonTable>
	        </div>
      	)
    }
}

function mapStateToProps(state) {
    const {  stockTypesList } = state.receivedetail
    return { stockTypesList }
}
export default connect(mapStateToProps)(Form.create()(receivecom))
