import { connect } from "dva"
import { Component } from "react"
import CommonTable from "../../../../../../components/CommonTable/index"
import Securitycheck from "../cardInformation/component/securitycheck"
import { Table, Icon, Tooltip } from 'antd'
import services from 'services'
import styles from './styles.less'
import moment from 'moment'
import router from 'umi/router'
class informations extends Component {
  	state = {
    	showcheck: false,
    	checkId:0,
		dataSource:[],
	 	columns: [{
		  	title: '车牌',
		  	dataIndex: 'licensePlate',
		  	key: 'licensePlate',
		  	width: '14%',
		}, {
		  	title: '结算时间',
		  	dataIndex: 'completed',
		  	key: 'completed',
		  	width: '14%',
		  	render: (res) => {
		  		if(res === 0){
		  			return ''
		  		}else{
		  			return moment(res * 1000).format("YYYY-MM-DD")
		  		}
		  	},
		}, {
		  	title: '订单号',
		  	dataIndex: 'orderNo',
		  	key: 'orderNo',
		  	width: '14%',
		},{
		  	title: '项目信息/产品信息',
		  	dataIndex: 'name',
		  	key: 'name',
		  	width: '14%',
		  	render: (res) => {
		  		if(res){
		  			return res.map((v, index) => {
		  				return (
		  					<div key={index}>{v}</div>
		  				)
		  			})
		  		}
		  	},
		}, {
			title: '编码',
			dataIndex: 'commodityCode',
			key: 'commodityCode',
			render: (res) => {
				if(res){
					return res.map((v, index) => {
						return (
							<div key={index}>{v}</div>
						)
					})
				}
			},
			width: '10%',
	  	}, {
		  	title: '公里数',
		  	dataIndex: 'mileage',
		  	key: 'mileage',
		  	width: '14%',
		}, {
		  	title: '备注',
		  	dataIndex: 'remark',
		  	key: 'remark',
		  	width: '14%',
		  	render: (res) => {
		  		if(res && res.length > 10){
		  			return ( <Tooltip title={res}>{res.slice(0, 9)}...</Tooltip> )
		  		}else{
		  			return ( res )
		  		}
		  	},
		},{
            title: '',
            key: 'action',
            width: '14%',
            render: (res) => {
            	return (
	                <div className={styles.fontpic}>
	                	<div>
	                		<Tooltip placement="topLeft" title={'结算'}>
	            			{
	            				res.debtDue === 1 && <i onClick={this.Topay.bind(this, res.id, res.type)} className="iconfont icon-jiesuan" style={{cursor: 'pointer', color: '#999999', marginRight: '5px',}}></i>
	            			}
							</Tooltip>
	                	</div>
	                	<div>
	                		<Tooltip placement="topLeft" title={'36项检查'}>
	            			{
	            				res.checkFont === 1 && <i onClick={this.threeSix.bind(this, res)} className="iconfont icon-xiang" style={{cursor: 'pointer', color: '#999999', marginRight: '5px',}}></i>
	            			}
	            			</Tooltip>
	                	</div>
	                	<div>
	                		<Tooltip placement="topLeft" title={'详情'}>
            				<i onClick={this.onChangeValue.bind(this, res)} className="iconfont icon-chakanxiangqing" style={{cursor: 'pointer', color: '#999999', marginRight: '5px',}}></i>
            				</Tooltip>
	                	</div>
                	</div>
            	)
            },
        }],
  	}
  	componentDidMount(){
  		const { clientId  } = this.props
  		services.LIST({keys: {name: `store/clientOrderRecord/${clientId}`}}).then(res => {
  			res.list.map((v, index) => (v.key = index))
  			this.setState({
  				dataSource: res.list,
  			})
  		})
  	}
  	Topay=(orderId, orderType)=> {
		const { dispatch,clientId } = this.props
		if(orderType === 4) { //快捷
			services.LIST({keys: {name: `quick/order/${orderId}/edit`}}).then(res => {
			if(res.success) {
				const { data } = res
				dispatch({
					type: 'speedyBilling/setAccount',
					payload: {
					clientInfo: data.clientInfo,
				},
			})
			dispatch({
				type: 'speedyBilling/setOrderInfo',
				payload: {orderId,clientId},
			})
			dispatch({
				type: 'speedyBilling/changeStatus',
				payload: {key: 'isPay', value: true},
			})
			dispatch({
				type: 'speedyBilling/changeStatus',
				payload: {key: 'isFromOrder', value: true},
      })
      dispatch({
        type: "speedyBilling/changeStatus",
        payload: { key: "isRepayment", value: true },
      })
			router.push('/boss-store/speedy-billing')

			}else {
				message.error('订单异常!')
			}

		})
		}else {
			services.LIST({keys: {name: `maintain/order/${orderId}/edit`}}).then(res => {
			if(res.success) {
				const {data} = res
				dispatch({
					type: 'maintainBilling/setAccount',
					payload: {
					clientInfo: data.clientInfo,
					},
				})
				dispatch({
					type: 'maintainBilling/setOrderInfo',
					payload: {orderId,clientId},
				})
				dispatch({
					type: 'maintainBilling/changeStatus',
					payload: {key: 'isPay', value: true},
				})
				dispatch({
					type: 'maintainBilling/changeStatus',
					payload: {key: 'isFromOrder', value: true},
        })
        dispatch({
          type: "maintainBilling/changeStatus",
          payload: { key: "isRepayment", value: true },
        })
				router.push('/boss-store/maintain-billing')
			}else {
					message.error('订单异常!')
				}
			})
		}
	}
  	onmoneyshow =(e) => {
  		console.log(e)
  	}
  	onChangeValue =(res) => {
  		const {  getsongdata } = this.props
  		getsongdata(res.orderNo, res.type)
  	}
	showDetail = (e) => {
  		this.setState({
  			showcheck: e,
  		})
  	}
  	threeSix = (res) => {
  		this.setState({
  			showcheck: true,
  			checkId: res.id,
  		})
  	}
  	render() {

	    return (
	    	<div style={{padding: '32px'}}>
	      		<Table dataSource={this.state.dataSource} columns={this.state.columns} />
	      		<Securitycheck visible={this.state.showcheck} showDetail={this.showDetail} checkId={this.state.checkId}/>
	      	</div>
	    )
  	}
}
export default connect()(informations)
