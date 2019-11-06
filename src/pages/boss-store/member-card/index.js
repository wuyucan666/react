import { Component } from 'react'
import router from 'umi/router'
import CommonTable from '../../../components/CommonTable/index'
import { connect } from 'dva'
import { Modal, Select } from 'antd'
import moment from 'moment'
import tableConfig from './tableConfig'
// import Edit from './edit'
import Detail from './detail'
import services from '../../../services'
import Print from '../member-center/components/print'
const Option = Select.Option
class memberCards extends Component {
  // constructor(props) {
  //   super(props)
  // }
  state = {
    visible: false,
    createdState: 1,
    start: 0,
    end: 0,
    timeValue: [],
    orderId: 0,
    deadlineTimeS: '',
    detailItem: {},
  };
  onTableChange(e, v) {
    if (e === 14) {
      this.showModal(v)
    }
    if (e === 18) {
      let that = this
      Modal.confirm({
        title: '您确定要撤单吗?',
        content: '',
        okText: '确认',
        cancelText: '取消',
        icon: (
          <div
            style={{
              width: '37px',
              height: '37px',
              background: '#FF303D',
              borderRadius: '50%',
              textAlign: 'center',
              lineHeight: '37px',
              marginLeft: '177px',
              marginBottom: '10px',
            }}
          >
            <i className="iconfont icon-shanchu" style={{ color: '#fff' }} />
          </div>
        ),
        closable: true,
        centered: true,
        maskClosable: true,
        maskStyle: {
          background: 'rgba(0,0,0,0.65)',
        },
        className: 'madalDiv',
        onOk() {
          // console.log('cardId',v,v.cardId)
          that.cancellations(v.cardId, v.clientName)
        },
      })
    }
    if (e === 24) {
      this.setState({ orderId: v.orderId })
    }
  }
	/**
	 * 撤单
	 */
  cancellations = (id, clientName) => {
    services
      .DELETE({
        keys: { name: 'store/clientcard/cancel', id },
        data: { clientName },
      })
      .then(res => {
        if (res.code === '0') {
          this.props.dispatch({ type: 'table/getData', payload: 'orderCard' })
          this.hideModal()
          if (!(JSON.stringify(this.props.location.query) === "{}")) {
            router.push(this.props.location.query.redirect)
          }
        }
      })
  }
  componentWillMount() {
    // console.log('props',this.props)
    if (!(JSON.stringify(this.props.location.query) === "{}")) {
      const { cardId, orderId, redirect, fromIndex, created, cardType } = this.props.location.query
      if(fromIndex) {
        tableConfig.screen.query = {
          'created[<>]': created,
          cardType: cardType,
        }
      } else {
        let obj = {
          cardId,
          orderId,
          redirect,
        }
        this.showModal(obj)
      }
    } else {
      this.props.dispatch({ type: 'memberCards/getList', payload: {} })
      let day = moment().format('YYYY-MM-DD')
      let days = day + ' 23:59:59'
      this.setState({
        start: moment(day).unix(),
        end: moment(days).unix(),
      })
    }
  }

  componentWillUnmount () {
    tableConfig.screen.rules[0].defaultValue = []
    tableConfig.screen.rules[1].defaultValue = ''
  }

  hideModal() {
    this.setState({
      visible: false,
    })
    if (!(JSON.stringify(this.props.location.query) === "{}")) {
      this.props.history.goBack()
    }
  }
  showModal(item) {
    this.setState({
      visible: true,
      detailItem: item,
    })
  }

	/**
	 * 办充值卡
	 */
  // goTopUp = () => {
  //   router.push({ pathname: '/boss-store/member-center/business/up-card' })
  // };
  // /**
  //  * 办计次卡
  //  */
  // goHandleCard = () => {
  //   router.push({ pathname: '/boss-store/member-center/business/number-card' })
  // };

	/**
	 * 今日/本月/本年
	 */
  goCreatedState = tab => {
    let day = moment().format('YYYY-MM-DD')
    let m = moment().format('YYYY-MM')
    let y = moment().format('YYYY')
    let days = day + ' 23:59:59'
    let start, end
    this.setState({ timeArr: [] })
    switch (tab) {
      case 1:
        start = moment(day).unix()
        end = moment(days).unix()
        break
      case 2:
        start = moment(m).unix()
        end = moment().month(moment().month()).endOf('month').unix()
        break
      case 3:
        start = moment(y).unix()
        end = moment().year(moment().year()).endOf('year').unix()
        break
      default:
        return
    }
    this.setState({
      timeValue: null,
      start,
      end,
    })
    this.setState({
      createdState: tab,
    })
  };
	/**
	 * 时间范围
	 */
  onChange = (e, time) => {
    let days = time[1] + ' 23:59:59'
    this.setState({
      timeValue: e,
      createdState: 0,
      start: moment(time[0]).unix(),
      end: moment(days).unix(),
    })
  };
  // 选有效卡
  changeDeadlineTime = (e) => {
    let date = moment().unix()
    tableConfig.screen.query = {
      'deadlineTime[>]': e === 1 ? date : undefined,
      'deadlineTime[<]': e === 2 ? date : undefined,
    }
  }
  handlePrintReset = () => {
    this.setState({orderId: undefined})
  }
  render() {
    const { dispatch, staffList, payList, details } = this.props
    tableConfig.screen.rules[2].list = [...staffList]
    tableConfig.screen.rules[4].list = [...payList]
    tableConfig.screen.rules[3].component = (
      <div style={{ display: 'flex' }}>
        <div style={{ flex: '72px 0 0', color: '#333', marginRight: '12px', textAlign: 'right' }}>有效状态</div>
        <div style={{ flex: '1' }}>
          <Select size="large" onChange={this.changeDeadlineTime} placeholder="有效状态">
            <Option value={1}>有效卡</Option>
            <Option value={2}>过期卡</Option>
          </Select>
        </div>
      </div>
    )

    return (
      <div>
        <div style={{ display: this.state.visible ? 'none' : '' }}>
          <CommonTable
            scroll={true}
            name="orderCard"
            tableConfig={tableConfig}
            onTableChange={this.onTableChange.bind(this)}
          />
        </div>
        {this.state.visible && <Detail
          hideModal={this.hideModal.bind(this)}
          dispatch={dispatch}
          type={this.state.type}
          details={details}
          detailItem={this.state.detailItem}
          onTableChange={this.onTableChange.bind(this)}
        />}
        <Print type={7} orderId={this.state.orderId} isListPage onReset={this.handlePrintReset} />
      </div>
    )
  }
}
function mapStateToProps(state) {
  const { editItem, staffList, payList, details } = state.memberCards
  return { editItem, staffList, payList, details }
}
export default connect(mapStateToProps)(memberCards)
