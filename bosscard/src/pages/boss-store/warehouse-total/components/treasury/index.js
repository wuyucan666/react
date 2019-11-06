import { Component } from 'react'
import styles from './styles.less'
import {connect}   from 'dva'
import services from 'services'
import { Modal, Form, message, InputNumber } from 'antd'
class treasurys extends Component {
	state = {
		datas:0,
	}
	handleOk = () => {
		const {datas} = this.state
		if(datas === 0 || datas === ''){
			return message.error('出库数量不能为空或者0')
		}else if(datas < 0){
			return message.error('出库数量不能为负数')
		}
		const { contents } = this.props
		services.UPDATE({keys: {name: 'erp/inventoryLocker', id: contents.inventoryLockerId}, data:{ productId: contents.productId, lockerNum: this.state.datas }}).then((res) => {
			if (res.code === "0") {
			    this.setState({
		          	datas: 0,
		        })
		        message.success('出库成功')
		        this.props.returnBtn()
	        }
	      		
	    })
	}

	handleCancel = (e) => {
		this.props.returnBtn()
		this.setState({
          	datas: 0,
        })   
	}
	onChange = (e) => {
		console.log('eeeeeeee', e)
		this.setState({
          	datas: e,
        })
	}
  	render () {
  		const { visible, contents } = this.props
	    return (
	      	<div>
	      		<Modal
		        title="寄存出库"
		        width='570px'
		        visible={visible}
		        okText="确认出库"
		        onOk={this.handleOk}
		        onCancel={this.handleCancel}
		        >
			        <div className={styles.tableDiv}>
			          	<div>
			          		<div>产品</div>
			          		<div>寄存数量</div>
			          		<div>出库数量</div>
			          	</div>
			          	<div>
			          		<div>{contents.productName}</div>
			          		<div>{contents.lockerNum}</div>
			          		<div>
			          			{visible && <InputNumber placeholder="库存" onChange={this.onChange.bind(this)} defaultValue={this.state.datas} size="large"/>}
			          		</div>
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
export default connect(mapStateToProps)(Form.create()(treasurys))