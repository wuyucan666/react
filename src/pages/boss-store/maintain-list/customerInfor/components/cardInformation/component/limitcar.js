import { connect } from "dva"
import { Component } from "react"
import  styles  from './styles.less'
import { Modal, Form, Row, Col } from 'antd'
import services from 'services'
import moment from 'moment'
import checkedImage from "../xuanzhong.png"
class delaybox extends Component {
  	state = {
  		newArray: [],
  	}
  	componentWillReceiveProps (nextsprops){
		const { clientId, sendid, existenceIdAeeay, allcarList} = this.props
  		if(this.props.visible !== nextsprops.visible){
			let newArray = allcarList.map(v => {
				v.hasing = false
				existenceIdAeeay.forEach((data) => {
					if(data.carId === v.clientCarId){
						v.hasing = true
					}
				})
				return v
			})
			this.setState({ newArray})
		}
  	}
	handleOk = () => {
		const { showDiv, clientId, sendid, type, id } = this.props
		const { newArray } = this.state
	    const idArray = []

	    newArray.forEach(item => {
	    	if(item.hasing){
	    		idArray.push(item.clientCarId)
	    	}
	    })
		services.updateCardLimit({ data: {clientId: clientId, clientCardId: sendid, type: type, car:idArray}}).then(res=>{
        this.props.dispatch({type:'maintianList/getcontentsList',payload: {id}})
        this.props.dispatch({ type: 'maintianList/getdataList', payload: { clientId } })
	  		showDiv(false)
      })
	    showDiv(false)
	}
	handleCancel = () => {
	    const { showDiv } = this.props
	    showDiv(false)
	}
	changeCar = (index, boo) => {
		const { newArray } = this.state
		if(boo){
			newArray[index].hasing = false
			this.setState({newArray})
		}else{
			newArray[index].hasing = true
			this.setState({newArray})
		}
	}
  	render() {
  		const { visible } = this.props
  		const { newArray } = this.state
	    return (
	    	<div className={styles.indexsss}>
	      		<Modal
		        title="修改绑定车辆"
		        width='1200px'
		        zIndex={500}
		        visible={visible}
		        onOk={this.handleOk}
		        onCancel={this.handleCancel}
		        >
	                <div className={styles.car_current}>
	                	{
	                		newArray && newArray.map((v, index) => {
	                			return (<div key={index} className={styles.car_box} onClick={() => this.changeCar(index, v.hasing)}>
					                    	<div className={styles.car_box_check}>
						                      	{
						                      		v.hasing && <img src={checkedImage} alt=''/>
						                      	}
						                    </div>
						                    <div className={styles.car_box_cont}>
						                      	<div className={styles.car_box_img}>
						                        	<img src={v.icon.length > 0 && v.icon[0].requestAddress} alt="" />
						                      	</div>
						                      	<div className={styles.car_box_cont_txt}>
						                        	<div>{v.licenseNo}</div>
						                        	<span>{v.autoName}</span>
						                      	</div>
						                    </div>
					                  	</div>)
	                		})
	                	}
	                </div>
		        </Modal>
	      	</div>
	    )
  	}
}
function mapStateToProps() {
  return {}
}
export default connect(mapStateToProps)(Form.create()(delaybox))
