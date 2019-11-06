import { connect } from "dva"
import { Component } from "react"
import  styles  from './styles.less'
import { Icon } from "antd"
class bigPic extends Component {
  	state = {
    	nums: 0,
    	array:[],
  	}
  	componentDidMount(){
      const {list, indexs} = this.props
  		this.setState({
  			nums: indexs,
  			array: list,
  		})
  	}
  	clickRightPx = () => {
  		if(this.state.nums < this.state.array.length - 1){
  			let newNum = this.state.nums + 1
  			this.setState({
	  			nums: newNum,
	  		})
  		}
  	}
  	clickLeftPx = () => {
  		if(this.state.nums > 0){
  			let newNum = this.state.nums - 1
  			this.setState({
	  			nums: newNum,
	  		})
  		}
  		
  	}
  	cloneBox = () => {
  		const {onBox} = this.props
  		onBox()
  	}
  	render() {
      const {list, indexs} = this.props
		  console.log('listlistlist', list)
	    return (
	      	<div className={styles.muiBackdrop}>
	      		<Icon onClick={this.cloneBox} type="close" />
                {
                    this.state.nums !== 0 && (<div className={styles.selLeft} onClick={this.clickLeftPx}>
                        <Icon type="left" />
                    </div>)
                }	      		
      			<div className={styles.selCenter}>
      				<div>
      					{
      						this.state.array.map((v, index) => {    						
      							return <img  alt=''  key={index} className={this.state.nums === index ? styles.seeimg : ''} src={v.requestAddress} />
      						})
      					}
      				</div>
      			</div>
            {
                this.state.array.length - 1 !== this.state.nums && (<div className={styles.selRight} onClick={this.clickRightPx}>
                    <Icon type="right" />                    
                </div>)
            }
	      	</div>
	    )
  	}
}
function mapStateToProps() {
  return {}
}
export default connect(mapStateToProps)(bigPic)
