import { connect } from "dva"
import { Component } from "react"
// import CommonTable from "../../../../../../components/CommonTable/index"
import Securitycheck from "../cardInformation/component/securitycheck"
import { Table,Tooltip,message } from 'antd'
import moment from 'moment'
import RepayModal from "../../../components/repayment/index"
import services from 'services'
import styles from './styles.less'
import router from 'umi/router'
class informations extends Component {
  	state = {
    	showcheck: false,
		checkId:0,
		repayModal:false,
		repayOrderId:null,
		dataSource:[],
	 	columns: [{
		  	title: '车牌',
		  	dataIndex: 'licensePlate',
		  	key: 'licensePlate',
		  	width: '14%',
		}, {
		  	title: '下单时间',
		  	dataIndex: 'orderTime',
		  	key: 'orderTime',
		  	width: '14%',
		  	render: (res) => {
		  		return moment(res * 1000).format("YYYY-MM-DD")
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
		  		if(res){
					if( res.length > 10){
						return ( <Tooltip title={res}>{res.slice(0, 9)}...</Tooltip> )
					}else{
						return ( res )
					}
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
		            				res.debtDue === 1 && <i onClick={this.onmoneyshow.bind(this, res.id)} className="iconfont icon-jiesuan" style={{cursor: 'pointer', color: '#999999', marginRight: '5px'}}></i>
		            			}
								</Tooltip>
		                	</div>
		                	<div>
		                		<Tooltip placement="topLeft" title={'36项检查'}>
		            			{
		            				res.checkFont === 1 && <i onClick={this.threeSix.bind(this, res)} className="iconfont icon-xiang" style={{cursor: 'pointer', color: '#999999', marginRight: '5px'}}></i>
		            			}
		            			</Tooltip>
		                	</div>
		                	<div>
		                		<Tooltip placement="topLeft" title={'详情'}>
	            				<i onClick={this.onChangeValue.bind(this, res)} className="iconfont icon-chakanxiangqing" style={{cursor: 'pointer', color: '#999999', marginRight: '5px'}}></i>
	            				</Tooltip>
		                	</div>
	                	</div>
            		)
            },
        }],
  	}
  	componentDidMount(){
  		this.getData()
	  }
	getData(){
		const { clientId  } = this.props
		services.LIST({
			keys: {name: `store/clientOrderRecord/${clientId}`},
			data:{flag:1},
		}).then(res => {
			res.list.map((v, index) => (v.key = index))
			this.setState({
				dataSource: res.list,
			})
		})
	}
  	onmoneyshow =(orderId) => {
	    this.setState({
			repayOrderId:orderId,
			repayModal:true,
		})
  	}
  	onChangeValue =(res) => {
      const {  getsongdata } = this.props
      getsongdata(res.orderNo, res.type)
  	}
  	handleOk = () => {
	    console.log('aaaaaaa')
	}
	handleCancel = () => {
	    console.log('aaaaaaa')
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
		console.log('080808',this.state.dataSource)
		const { repayModal ,repayOrderId } = this.state
		console.log(RepayModal,repayOrderId,this.props.clientId)
	    return (
	    	<div style={{padding: '32px'}}>
	      		<Table dataSource={this.state.dataSource} columns={this.state.columns} />
	      		<Securitycheck visible={this.state.showcheck} showDetail={this.showDetail} checkId={this.state.checkId}/>
				{
				 repayModal && 
				 <RepayModal
				  visible={RepayModal}
				  orderId={repayOrderId}
				  clientId={this.props.clientId}
				  onCancel={() => {
					// const { dispatch } = this.props
					this.setState({repayModal: false,repayOrderId:null})
					this.getData()
					// dispatch({type: 'table/getData', payload: {new: true}})
				  }}
				/>	
				}
	      	</div>
	    )
  	}
}
function mapStateToProps() {
  return {}
}
export default connect(mapStateToProps)(informations)
