import { Component } from 'react'
import styles from './styles.less'
import services from 'services'
import {connect}   from 'dva'
import { Modal, Input, Form, Button } from 'antd'
class productNumMoney extends Component {
	state = {
		datas:'',
	}
	handleOk = (e) => {
		const { data, dispatch } = this.props
		
		if(this.state.datas === ''){
			services.UPDATE({keys: {name: 'erp/statistics/inventory/warning', id: data.inventoryId}, data:{ lowestNum: data.lowestNum }}).then(() => {
		      		dispatch({
				      	type: 'table/getData',
				      	payload: {new: 'erp/statistics/inventory/warning'},
				    })
				    this.setState({
			          	datas: '',
			        })
		    })
		}else{
			services.UPDATE({keys: {name: 'erp/statistics/inventory/warning', id: data.inventoryId}, data:{ lowestNum: this.state.datas }}).then(() => {
		      		dispatch({
				      	type: 'table/getData',
				      	payload: {new: 'erp/statistics/inventory/warning'},
				    })
				    this.setState({
			          	datas: '',
			        })
		    })
		}
		this.props.returnBtn()
	    console.log(e, services)
	}

	handleCancel = () => {
		this.props.returnBtn()
	    this.setState({
          	datas: '',
        })
	}
	onChange = (e) => {
		this.setState({
          	datas: e.target.value,
        })
	}
  	render () {
  		const { visible, data } = this.props
	    return (
	      	<div>
	      		<Modal
		        title="库存预警值"
		        width='570px'
		        visible={visible}
		        footer={[
		            <Button key="submit" type="primary" onClick={this.handleOk}>
		              确定
		            </Button>,
		        ]}
		        okText="保存"
		        onOk={this.handleOk}
		        onCancel={this.handleCancel}
		        >
		          	<div className={styles.contentDiv}>
		          		<div><span>商品：</span>{data.productName}</div>
		          		<div><span>规格：</span>{data.specification}</div>
		          		<div><span>编码：</span>{data.commodityCode}</div>
		          	</div>
		          	<div className={styles.line}></div>
		          	<div className={styles.Num}>
		          		<span>最低库存</span>
		          		<div>
	          			{visible && <Input placeholder="库存" onChange={this.onChange.bind(this)} defaultValue={data.lowestNum} size="large"/>}
		          		</div>
		          	</div>
		        </Modal>
	      	</div>
	    )
  	}
}
function mapStateToProps() {
    return {}
}
export default connect(mapStateToProps)(Form.create()(productNumMoney))