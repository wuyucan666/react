import { Select, message, Spin, Modal, Input } from "antd"
import { Component } from "react"
import PropTypes from "prop-types"
import services from "services"
import style from "./index.less"
import { withRouter } from "dva/router"
import request from "utils/request"

const Option = Select.Option

class SearchMember extends Component {
  constructor(props) {
    super(props)
    this.state.value = props.memberName
    this.state.memberId = props.memebrId
  }

  state = {
    value: "",
    memberId: 0,
    member: {
      cars: [],
    },
    result: [],
    loading: false,
    page: 1,
    totalPage: 1,
    carTel:null,
    carName:null,
    carBindVisible:false,
    carTelOk:true,
    telTip:'请输入正确的手机号码',
    cardInfo:{},
    carNo:'',
    clientId:null,
  }

  componentDidMount() {
    this.props.getRef(this)
    //若是在新建客户页面跳回，传递参数过来，存在先触发筛选事件然后触发选中事件，绑定客户状态
    let stateObj = this.props.location.state || {}
    // console.log('stateObj',stateObj)
    if (stateObj.phoneTem) {
      this.getResult(stateObj.phoneTem, true, true)
    }
  }

  /**
   * 搜索会员
   */
  async getResult(value, hasResetPage, isSelectFisrt) {
    if (this.state.loading) return '正在请求数据， 不能重复请求'
    if (hasResetPage) {
      await this.setState({ page: 1 })
    } else {
      await this.setState({ page: this.state.page + 1 })
    }
    this.setState({ value, loading: true })
    let where
    if(this.props.match.path === '/boss-store/member-center/business/apply-card'){
      where =  { 'clientName[~]|clientPhone[~]|licenseNo[~]': value  }
    }else if( this.props.match.path === '/boss-store/member-center/business/number-card/give' || '/boss-store/member-center/business/extend-card') {
      where =  { 'clientName[~]|clientPhone[~]|licenseNo[~]': value, 'clientPhone[>]':0}
    }
    services
      .searchMember({
        data: {
          q: {
            page: this.state.page,
            where,
          },
        },
      })
      .then((res) => {
        console.log('result:',res)
        if (res.code === "0") {
          this.setState({ result: hasResetPage ? res.list : [...this.state.result, ...res.list], loading: false, totalPage: res.totalPage }, () => {
            if (isSelectFisrt) {
              this.setMember(res.list[0].carId)
            }
          })
        } else {
          message.error(res.content)
        }
      }).catch(() => this.setState({ loading: false }))
  }

  async setMember(value) {
    let member = this.state.result.find((_) => _.carId === Number(value))
    console.log('membermember',member)
    const res = await request({ url: 'store/client/preview/' + member.clientId })
    if (res.code === '0') {
      if(!member.phone){
        this.showModal()
        console.log('resss',res,member)
        this.setState({ carNo : res.data.cars[0].licenseNo ,carBrandId:member.carBrandId,seriesId:member.seriesId })
      }else{
        this.setState({
          member: res.data,
          memberId: member.clientId,
        })
        this.props.onChange && this.props.onChange(member.clientId, member)
      }
    }
  }

  popupScroll = (e) => {
    e.persist()
    let target = e.target
    if (target.scrollTop + target.offsetHeight === target.scrollHeight) {
      if (this.state.page < this.state.totalPage) {
        this.getResult(this.state.value, false)
      }
    }
  }

  reset() {
    this.setState({
      member: {},
      value: "",
      memberId: undefined,
      loading: false,
    })
    // 重置后通知父级
    this.props.onReset && this.props.onReset()
  }

  showModal() { this.setState({carBindVisible : true}) }
  hideModal() { this.setState({carBindVisible : false}) }

  onChangeCarTel = (e) =>{
    let value = e.target.value
    this.setState({carTel:value})
    if((value.length < 11)  ||  !(/^1[3456789][0-9]{9}$/.test(value)) ){
      this.setState({ carTelOk:false })
    }else{
      this.setState({ carTelOk:true },()=>{
        services.LIST({
          keys:{name: 'store/client/list'},
          data: {q: {page:-1,limit:-1,where:{"phoneTem[~]":value}}},
        }).then(res=>{
          if(res.code === '0' && (res.list.length > 0)){//手机号已存在
            this.setState({carName:res.list[0].clientName,clientId:res.list[0].clientId})
          }else if(res.code === '0' && (res.list.length === 0)){//手机号尚未注册
            this.setState({carName:''})
          }
        })
      })
    }
  }
  onChangeCarName = (e) =>{
    this.setState({carName:e.target.value})
  }

  //绑定后请求
  bindRequest = () =>{
    request({
      url: 'store/client/preview/' + this.state.clientId ,
    }).then(res=>{
      this.setState({
        member: res.data,
        memberId: this.state.clientId,
        carTel:null,
        carName:null,
        clientId:null,
      })
      this.hideModal()
      this.props.onChange && this.props.onChange(this.state.memberId, this.state.member)
    })
  }

  handleOk=()=>{
    if(!this.state.carTel){
      message.warning('手机号不能为空！')
    }else if(!this.state.carTelOk){
      message.warning('手机号填写有误！')
    }else if(this.state.carTelOk && this.state.carTel){
      services.INSERT({
        keys: { name: 'store/client/car/bind' },
        data: {
          plate:this.state.carNo,
          phone:this.state.carTel,
          name: this.state.carName,
          carBrandId:this.state.carBrandId,
          seriesId:this.state.seriesId,
        },
      }).then(res=>{
        if(res.code === '0'){
          message.success('车辆绑定成功！')
          if(!this.state.clientId){
            services.LIST({
              keys:{name: 'store/clientcar/list'},
              data: {q: {page:-1,limit:-1,where:{"licenseNo[~]|clientName[~]|phoneTem[~]":this.state.carTel}}},
            }).then(res=>{
              this.setState({clientId:res.list[0].clientId},()=>{
                this.bindRequest()
              })
            })
          }else {
            this.bindRequest()
          }
        }
      })
    }
  }

  render() {
    return (
      <div className={style.searchMember}>
        <div className="flex center" style={{ marginBottom: 32 }}>
          <h3 className="item">客户搜索</h3>
          {this.state.memberId && (
            <div
              className="pointer animated fadeInRight faster"
              onClick={this.reset.bind(this)}
            >
              <i className="iconfont icon-fanhui" />
              修改
            </div>
          )}
        </div>

        {this.state.memberId && (
          <div className={style.card}>
            <div className="main flex top">
              <div className="item user-info">
                <div className="name">{this.state.member.clientName}</div>
                <div className="phone">{this.state.member.phone}</div>
              </div>
            </div>
            <div className="more-info flex center">
              <div className="name item">
                {this.state.member.cars.slice(0, 2).map((_) => (
                  <span key={_.clientCarId}>{_.licenseNo} </span>
                ))}
                {this.state.member.cars.length > 2 && "..."}
              </div>
              <div className="price">¥{this.state.member.balance}</div>
            </div>
          </div>
        )}

        {!this.state.memberId && (
          <div className="search flex" ref={(ref =>{this.searchM = ref})}>
            <Select
              size="large"
              className="item"
              showSearch
              loading={this.state.loading}
              placeholder="手机号/车牌号/姓名"
              defaultActiveFirstOption={false}
              showArrow={false}
              filterOption={false}
              value={this.state.value}
              notFoundContent={this.state.loading ? <Spin size='small' /> : null}
              onSearch={(value) => this.getResult(value, true)}
              onChange={this.setMember.bind(this)}
              onPopupScroll={this.popupScroll}
            >
              {this.state.result.map((_) => {
                if (_.phone) {
                  return (
                    <Option key={_.carId} value={_.carId}><a >{_.plate}</a> － {_.name} － {_.phone}</Option>
                  )
                } else {
                  return (
                    <Option key={_.carId} value={_.carId}><a >{_.plate}</a> －  散客</Option>
                  )
                }
              })}
            </Select>
            <div
              className={style.yc_addclient}
              onClick={() =>
                this.props.history.push({
                  pathname: '/boss-store/client-manage',
                  state: {
                    showAdd: true,
                    currentpath: this.props.location.pathname,
                    wyc_showAdd: true, // 本人唯一标识字段，你们干不掉我的，哈哈哈哈  你是真的牛逼
                  },
                })
              }
            >
              <span>新建会员</span>
            </div>
          </div>
        )}
        <Modal
          title='绑定车主'
          okText='绑定'
          cancelText='取消'
          centered={true}
          maskClosable={false}
          visible={this.state.carBindVisible}
          closable={true}
          onOk={this.handleOk}
          onCancel={this.hideModal.bind(this)}
          className='az_car'
        >
          <label className={style.label_div}>
            <i>*</i>车主手机：
            <Input
              style={{width:'80%'}}
              placeholder='请输入手机号'
              value={this.state.carTel}
              onChange={ this.onChangeCarTel.bind(this) }
              maxLength={11}
              size='large'
              required
            /><br />
            <span className={style.telTip} style={{display: this.state.carTelOk? 'none': ''}}>{this.state.telTip}</span>
          </label>
          <label className={style.label_div}>
            <i>&nbsp;</i>车主姓名：
            <Input
              style={{width:'80%'}}
              placeholder='请输入姓名'
              value={this.state.carName}
              size='large'
              onChange={ this.onChangeCarName.bind(this) }
            />
          </label>
        </Modal>
      </div>
    )
  }
}

SearchMember.propTypes = {
  onChange: PropTypes.func,
}

export default withRouter(SearchMember)
