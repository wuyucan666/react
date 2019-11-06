import { Component } from 'react'
import styles from './styles.less'
import { Modal, Input } from 'antd'

export default class productNumMoney extends Component {
	state = { visible: false }
	handleOk = (e) => {
	    console.log(e)
	    this.setState({
	      visible: false,
	    })
	}

	handleCancel = (e) => {
	    console.log(e)
	    this.setState({
	      visible: false,
	    })
	}
  	render () {
  		
	    return (
	      	<div>
	      		<Modal
		        title="商品寄存"
		        width='900px'
		        visible={this.state.visible}
		        okText="确认寄存"
		        onOk={this.handleOk}
		        onCancel={this.handleCancel}
		        >
			        <div className={styles.tableDiv}>
			          	<div>
			          		<div>产品</div>
			          		<div>订单数量</div>
			          		<div>寄存数量</div>
			          	</div>
			          	<div>
			          		<div>大梁修复/更换（单条） </div>
			          		<div>123</div>
			          		<div><Input placeholder="库存"/></div>
			          	</div>
			          	<div>
			          		<div>大梁修复/更换（单条） </div>
			          		<div>123</div>
			          		<div><Input placeholder="库存"/></div>
			          	</div>
			          	<div>
			          		<div>大梁修复/更换（单条） </div>
			          		<div>123</div>
			          		<div><Input placeholder="库存"/></div>
			          	</div>
			        </div>
		        </Modal>
	      	</div>
	    )
  	}
}