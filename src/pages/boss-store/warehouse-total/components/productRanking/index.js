import { Component } from 'react'
import styles from './styles.less'
import { Link } from 'react-router-dom'
export default class productRanking extends Component {
  	render () {
  		const { data, types } = this.props
	    return (
	    	<div>
		    	<p className={styles.espP}><span> {types === '1' ? '畅销品排行' : (types === '2'? '滞销品': '库存预警商品')}</span><Link to={types !== '3'?'/boss-store/stock-inquiry':'/boss-store/stock-early-warning'}>查看详情</Link></p>
		      	<div className={styles.allData}>
		      		<div>
				      	<span>{types === '3'? '序号': '排名'}</span>
				      	<span>商品</span>
				      	<span>{types === '3'? '库存数量': '型号'}</span>
				      	<span>{types === '3'? '预警数量': '编码'}</span>
				     </div>
				    <div>				    	
					    {types !== '3' &&
					     	data.map((v, index) => {
					     		return <div key={index}>
							      	<span><span className={ index < 3 ? styles.espSpan : ''}>{index+1}</span></span>
							      	<span>{v.productName}</span>
							      	<span>{v.specification}</span>
							      	<span>{v.commodityCode}</span>
							    </div>
					     	})
						}
						{types === '3' &&
							data.map((v, index) => {
								return <div key={index}>
									<span><span>{index+1}</span></span>
									<span>{v.productName}</span>
									<span style={{color: '#666'}}>{v.goodsNum}</span>
									<span>{v.lowestNum}</span>
								</div>
							})
							}
				    </div>
		      	</div>
		    </div>
	    )
  	}
}