import { Component } from 'react'
import styles from './styles.less'
import { Icon } from 'antd'
import router from 'umi/router'
export default class productNumMoney extends Component {	
	routerTo(v) {
		router.push({
		  	pathname: '/boss-store/send-receive-details',
		  	query: {
		    	id: v.id,
		  	},
		})
	}
  	render () {
	  	const { data, types } = this.props 	
	  	if(data && data.list && data.list.length > 0){
		    return (
		      	<div className={styles.moneyNum}>
		      		<div>
			      		<div>
			      			<p>{types === '1' ? '入库金额（元）' : '出库金额（元）'}</p>
			      			<span>{data.totalPrice}</span>
			      		</div>
			      		<div>
			      			<p>{types === '1' ? '入库数量' : '出库数量'}</p>
			      			<span>{data.totalNum}</span>
			      		</div>
			      	</div>
			      	<div>
			      		<div>
			      			<span><p>{types === '1' ? '入库项目' : '出库项目'}</p></span>
			      			<span>数量</span>
			      			<span>金额</span>
			      		</div>
			      		<div>			      		
				      		{
				      			data.list.map((v, index) => {
				      				return <div key={index} onClick={this.routerTo.bind(this, v)}>
						      			<span>{v.typeName}</span>
						      			<span>{v.num}</span>
						      			<span>{v.price}<Icon type="right" /></span>
						      		</div>
				      			})
				      		}
			      		</div>
			      	</div>
		      	</div>
		    )
	  	}else{
	  		return false
	  	}
  	}
}
