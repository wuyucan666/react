import { connect } from "dva"
import { Component } from "react"
import styles from './styles.less'
import none from '../../../../member-center/img/no_card.jpg'
import { Modal } from 'antd'
import services from 'services'
import ConsumptionData from './component/consumptionData.js'
import Delaydiv from './component/delaydiv.js'
import Givedata from './component/givedata.js'
import Limitcar from './component/limitcar.js'
import ServeCard from './component/serveCard.tsx'
import SC from './component/superCar.js'
import SP from './component/superPay.js'
import moment from 'moment'
class cardInformation extends Component {
	state = {
		contentArray: [],
		nums: 0,
		activeIndex: 0,
		showtpye: 1,
		showDiv: false,
		getId: -1,
		dataTipList: {},
		clientCardId: 0,
		showdelay: false,
		showlimitcar: false,
		showgivediv: false,
		validityArray: [],
		GivedataArray: [],
		mastShow: -1,
		allcarList: [],
		carid: '',
    rechargeName: '',
    showserveCard:false,
    currentServe:[],
	superList:{},
	serviceItem: {},
	}
	// componentWillReceiveProps(nextProps) {
	// 	if (nextProps.mealArray.length !== this.props.mealArray.length) {
	// 		const mealArray = nextProps.mealArray
	// 		if (mealArray[0]) {
	// 			if (mealArray[0].type === 1) {
	// 				this.setState({
	// 					showtpye: 1,
	// 					rechargeName: mealArray[0].name,
	// 				})
	// 			} else {
	// 				this.setState({
	// 					showtpye: 2,
	// 				})
	// 			}
	// 			this.setState({
	// 				getId: mealArray[0].id,
	// 			})
  //       this.fengzhuang(mealArray[0].id)
	// 		}
	// 	}
	// }
	UNSAFE_componentWillMount() {
    this.getData()
	}
	getData=(boolern)=> {
		this.props.dispatch({
			type: "maintianList/mealData",
			payload: { mealArray: [] },
		})
		const { clientId } = this.props
		this.props.dispatch({ type: 'maintianList/getmealList', payload: { clientId } }).then(()=>{
      // console.log('kkkkkkkkkkkkkkk',this.props.mealArray)
			if(boolern){
				 this.setState({
					 activeIndex:0,
				 })
			}
    })
		this.clickcarlist()
    this.getDataList(clientId)
    // console.log('cardlist',this.props.cardList)
  }

    async fengzhuang (id) {
		this.setState({
			carid: id,
		})
		await this.props.dispatch({ type: 'maintianList/getcontentsList', payload: { id } })
	}

  //获取卡项信息列表 /client/card/{clientId}
  getDataList(clientId) {
		this.props.dispatch({ type: 'maintianList/getdataList', payload: { clientId } })
  }

	// clickOneContent = (e, type, id) => {
	// 	const { mealArray } = this.props
	// 	this.setState({
	// 		activeIndex: e,
	// 		showtpye: type,
	// 		getId: id,
	// 		rechargeName: mealArray[e].name,
	// 	}, () => {
	// 		this.fengzhuang(this.state.getId)
	// 	})
  // }


	clickcarlist = () => {
		const { clientId } = this.props
		services.list({
			keys: { name: "store/clientcar" },
			data: { q: { where: { clientId: clientId } } },
		}).then((res) => {
			this.setState({ allcarList: res.list })
		})
  }

	// clickRightPx = () => {
	// 	const { mealArray } = this.props
	// 	if (this.state.nums < (mealArray.length - 5)) {
	// 		let newNum = this.state.nums + 1
	// 		this.setState({
	// 			nums: newNum,
	// 		})
	// 	}
  // }

	// clickLeftPx = () => {
	// 	if (this.state.nums > 0) {
	// 		let newNum = this.state.nums - 1
	// 		this.setState({
	// 			nums: newNum,
	// 		})
	// 	}
  // }

	showDetail = (e) => {
		this.setState({
			showDiv: e,
		})
	}
	showdelaybox = (e) => {
		this.setState({
			showdelay: e,
		})
	}
	showgivebox = (e) => {
		this.setState({
			showgivediv: e,
		})
	}
	showlimitcarbox = (e) => {
		this.setState({
			showlimitcar: e,
		})
	}
	showSuper = (value,item) => {
		this.setState({
      mastShow: value,
      superList:item,
		})
  }
  //超级权限显示
	controlModelShow = () => {
    const { mastShow , superList } = this.state
    const { clientId } = this.props
    let name = superList? superList.cardName: ''
		switch (mastShow) {
			case 1:
				return <Modal
					title={<span><span className={styles.zl_superText_1}  >超级权限/</span><span className={styles.zl_superText_2}  >{name}</span></span>}
					visible={true}
					width='891px'
					footer={null}
					onCancel={this.showSuper.bind(this, -1)}
				>
					<SC  clientId={clientId}  cardId={ superList.cardId } showSuper={this.showSuper} getData={this.getData} cardType={superList.cardType} remainNum={superList.remainNum} dataList={superList.serviceList} />
				</Modal>
			case 2:
				let money = superList? superList.remainMoney: ''
				return <Modal
					title={<span><span className={styles.zl_superText_1}  >超级权限/</span><span className={styles.zl_superText_2}  >{name}</span></span>}
					visible={true}
					width='891px'
					footer={null}
					onCancel={this.showSuper.bind(this, -1)}
				>
					<SP   clientId={clientId}   cardId={ superList.cardId }   money={money} showSuper={this.showSuper} getData={this.getData} />
				</Modal>
			default:
				break
    }
  }

  //查看详情
	openbox = (v) => {
    this.fengzhuang(v.cardId)
    this.setState({ showDiv: true})
  }
  //点击延期
	delaytime = (v,type) => {
    this.fengzhuang(v.cardId)
    const { contentsArray } = this.props
		const giveData = [{
			projectName: v.cardName,
			Recharge: contentsArray.Recharge,
			gives: contentsArray.gives,
			validityList: contentsArray.validityList,
			number: contentsArray.endvalidity === -1 ? -1 : moment(contentsArray.endvalidity).unix(),
			id: contentsArray.id,
		}]
		if (type === 2) {
			this.setState({ showgivediv: true, GivedataArray: giveData, getId:v.cardId })
		} else {
			this.setState({ showdelay: true, validityArray: v.serviceList, getId:v.cardId })
		}
  }
  //修改车辆
  async	changecar (v) {
	await this.fengzhuang(v.cardId)
    this.setState({ showlimitcar: true , getId:v.cardId})
  }
  //卡内服务
  serveCard = (list, serviceItem) => {
    let d = list.map(_ => ({
      ..._,
      deadlineTime: _.deadlineTime === -1 ? '无限' : moment(_.deadlineTime *1000).format('YYYY-MM-DD'),
      totalNum: _.totalNum === -1 ? '无限' : _.totalNum,
      remainNum: _.remainNum === -1 ? '无限' : _.remainNum,
      useNum: _.useNum === -1 ? '无限' : _.useNum,
    }))
		this.setState({ showserveCard: true ,currentServe:d, serviceItem})
  }
  hideModal = () =>{
		this.setState({ showserveCard: false })
  }
	render() {
    const { contentsArray, clientId, cardList } = this.props
		const hasPermission = JSON.parse(localStorage.getItem('permissionRole')).indexOf(27) > -1
		return (
      <div className={styles.card_info_con}>
        { cardList.length ?(<ul>
          {
            cardList && cardList.map(v => {
              let days = parseInt((v.deadlineTime*1000 - new Date().getTime()) / (1000 * 60 * 60 * 24))
              let times
              let cars = ''
              let superNum = v.cardType === 1? 2: 1
              if ((v.deadlineTime !== 1) && (days >= 0)){
                times = moment(v.startTime *1000).format('YYYY-MM-DD') + ' 至 '+ (moment(v.deadlineTime *1000).format('YYYY-MM-DD') + ' (还有'+days+'天到期)')
              }else if (v.deadlineTime === -1){
                times = '无限期'
              }else if ((v.deadlineTime !== 1) && (days < 0)) {
                times = '已过期'
              }
              cars += v.restrictedCar.map(i =>{
                return i.licenseNo
              }).join('/')
              return (
                <li>
                  <div className={(v.isOverdue || v.isUseUp)? styles.card: ''}>
                    <span>{v.cardName}</span>
                    <span></span>
                    <span>{v.cardNum}</span>
                    <i>{v.cardType === 1? '充': ((v.cardType === 2 || v.cardType === 4 || v.cardType === 5)? '次': '赠')}</i>
                  </div>
                  <div className={(v.isOverdue || v.isUseUp)? styles.border_two: styles.border_one}>
                    <div>
                      <ul>
                        <li> { '有效期：' + times} </li>
                        <li className={styles.cars}>绑定车辆：<span>{v.restrictedCar.length? cars :'无'}</span></li>
                      </ul>
                      <ul>
                        <li style={{display:v.cardType === 1 ?'':'none'}}>总金额：<span style={{color:(v.isOverdue || v.isUseUp)?'#333333':'#4AACF7',fontWeight:500}}>￥{v.remainMoney}</span></li>
                        <li>备注：{v.remark}</li>
                      </ul>
                      <ul style={{display:(v.isOverdue || v.isUseUp)?'':'none'}}>
                        <li>{v.isUseUp ?'已用完':(v.isOverdue?'已过期':'')}</li>
                      </ul>
                    </div>
                    <div className={styles.card_money}>
                      <span onClick={this.openbox.bind(this,v)}>查看消费数据</span>
                      <span onClick={this.serveCard.bind(this,v.serviceList, v)} style={{display:v.cardType === 1 ?'none':''}}>查看卡内服务</span>
                      <span onClick={this.delaytime.bind(this,v,superNum)} style={{display:v.isUseUp?'none':''}}>修改有效期</span>
                      <span onClick={this.changecar.bind(this,v)} style={{display:v.isUseUp?'none':''}}>修改绑定车辆</span>
                      <span
                        style={{color:'#FF6F28',display:(v.isOverdue || v.isUseUp)? 'none': (hasPermission? '': 'none')}}
                        onClick={this.showSuper.bind(this,superNum,v)}
                      >
                        超级权限
                      </span>
                    </div>
                  </div>
                </li>)
            })
          }
        </ul>):<div className={styles.none}><img src={none} alt=''/><br />暂无相关卡项</div>}
        <ConsumptionData
          contentArray={this.props.cardList}
          clientCardId={this.props.contentsArray.id}
          visible={this.state.showDiv}
          showDiv={this.showDetail}
        />
        <Delaydiv
          visible={this.state.showdelay}
          showDiv={this.showdelaybox}
          newArray={this.state.validityArray}
          type={this.state.showtpye}
          sendid={this.state.getId}
          id={this.state.carid}
          clientId={clientId}
        />
        <Givedata
          visible={this.state.showgivediv}
          showDiv={this.showgivebox}
          newArray={this.state.GivedataArray}
          type={this.state.showtpye}
          sendid={this.state.getId}
          id={this.state.carid}
          clientId={clientId}
        />
        <Limitcar
          visible={this.state.showlimitcar}
          showDiv={this.showlimitcarbox}
          clientId={clientId}
          type={this.state.showtpye}
          sendid={this.state.getId}
          allcarList={this.state.allcarList}
          id={this.state.carid}
          existenceIdAeeay={
            contentsArray.restrictedCar ? contentsArray.restrictedCar : []
          }
        />
        <ServeCard
          visible={this.state.showserveCard}
          hideModal={this.hideModal}
		  currentServe={this.state.currentServe}
		  serviceItem={this.state.serviceItem}
        />
        {this.controlModelShow()}
      </div>
		)
	}
}
function mapStateToProps(state) {
	const { mealArray, contentsArray,cardList } = state.maintianList
	return { mealArray, contentsArray,cardList }
}
export default connect(mapStateToProps)(cardInformation)
