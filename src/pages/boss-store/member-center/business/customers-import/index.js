import React, { Component } from "react"
import moment from "moment"
import { connect } from "dva"
import { Button, message } from "antd"
import router from "umi/router"
import PageLayout from "components/PageLayout/index"
import SelectCard from "../../components/customer-recharge/index"
import CustomerInformation from "../../components/customer-information/index"
import CustomerCar from "../../components/customer-car/index"
import CustomerCard from "../../components/customer-card/index"
import services from "../../../../../services"
import Introduce from 'components/IntroduceModal'
import styles from "./index.less"

class Index extends Component {
  constructor(props) {
    super(props)
    this.layout = React.createRef()
  }
  state = {
    active: 0,
    loading: false,
    onRefCurrent: 0,
    current: 0,
  }
  handleOk = () => {
    router.push("/boss-store/product")
  }
  handleCancel = () => {
    router.push("/boss-store/project-store")
  }
  componentDidMount() {
    this.props.dispatch({ type: "customersImport/getChannelList" })
    this.props.dispatch({ type: "customersImport/goEmpty" })
    // 暂存信息返回
    const { customersImportAll, dispatch } = this.props
    dispatch({
      type: "customersImport/goCustomerCar",
      payload: customersImportAll.customerCar || [],
    })
    dispatch({
      type: "customersImport/goRechargeCard",
      payload: customersImportAll.rechargeCard || [],
    })
    dispatch({
      type: "customersImport/goSelectCardCard",
      payload: customersImportAll.selectCard || [],
    })
    dispatch({
      type: "customersImport/goCustomerInformation",
      payload: customersImportAll.editItem || {},
    })
  }
  getPro = () => {
    services
      .LIST({ keys: { name: "store/IndividualImport/create" } })
      .then((res) => {
        if (res.code === "0" && (res.data.product || res.data.project)) {
          this.setState({ proData: res.data })
        } else {
          this.setState({ proData: {} })
        }
      })
  }
  menuClick = (current) => {
    const { customerCar, editItem } = this.props
    if (current >= 1 && (!editItem.clientName || !editItem.phoneTem)) {
      return message.warning("请选填写顾客信息信息！")
    }
    if (current >= 2 && customerCar.length === 0) {
      return message.warning("请选填写车辆信息！")
    }
    this.layout.current.setCurrent(current)
    this.setState({ current })
  }
  /**
   * 暂存信息
   */
  handleSave = () => {
    const {
      dispatch,
      selectCard,
      customerCar,
      editItem,
      rechargeCard,
    } = this.props
    if (!editItem.clientName) {
      return message.warning("没有数据要暂存，请先填写！")
    }
    dispatch({
      type: "customersImportAll/getCustomersImportAll",
      payload: { selectCard, customerCar, editItem, rechargeCard },
    })
  }
  /**
   * 清空暂存
   */
  handleEy = () => {
    const { dispatch } = this.props
    dispatch({
      type: "customersImportAll/getCustomersImportAll",
      payload: {},
    })
    this.props.dispatch({ type: "customersImport/goEmpty" })
    this.layout.current.setCurrent(0)
    this.setState({ current: 0 })
  }
  /**
   * 发布
   */
  handleSubmit = () => {
    this.setState({ loading: false })
    const { selectCard, customerCar, editItem, rechargeCard } = this.props
    console.log('00000000000000', selectCard)
    if (!editItem || !editItem.clientName || !editItem.phoneTem) {
      return message.warning("请选填写顾客信息！")
    }
    if (
      !customerCar ||
      customerCar.length === 0 ||
      !customerCar[0].plateNumber
    ) {
      return message.warning("请选填写车辆信息！")
    }
    for(let i in rechargeCard) {
      if(!rechargeCard[i].giveMoney) {
        return message.warning("请给已选的充值卡设置价格！")
      }
      if(rechargeCard[i].car && rechargeCard[i].car.length === 0) {
        return message.warning("请给已选的充值卡绑定车辆！")
      }
    }
    for(let i in selectCard){
      if(selectCard[i].cardType === 4 && !selectCard[i].packageCount) {
        return message.warning("请给已选的随意添加总次数！")
      }
    }
    let data = {}
    // 顾客信息
    data.client = {
      clientName: editItem.clientName, //"名称",
      phone: editItem.phoneTem,
      clientSource: editItem.clientSource, //"来源",
      clientSex: editItem.clientSex, //"性别",
      clientType: editItem.clientType, //"类型",
      clientBirthday: editItem.clientBirthday
        ? moment(editItem.clientBirthday).unix()
        : 0, //"生日",
      idCard: editItem.identityCard, // 身份证
      address: editItem.address, //"住址",
      currentUnit: editItem.currentUnit, //"所在单位",
      unitAddress: editItem.unitAddress, //"单位地址",
      arrears: editItem.arrears, //"欠款金额",
      driverLicenseImage: editItem.driverLicenseImage
        ? editItem.driverLicenseImage.map((item) => item.imgId)
        : [],
      otherImage: editItem.otherImage
        ? editItem.otherImage.map((item) => item.imgId)
        : [],
      remark: editItem.remark, //"备注",
    }
    // 车辆信息
    data.car = customerCar.map((_) => ({
      ..._,
      carBrandName: _.carBrandName + _.seriesName,
      carIcon: _.iconImg.id || _.iconImg || 0,
      carIconUrl: _.iconImg.requestAddress, //
      nextMaintainTime: _.nextMaintainTime
        ? moment(_.nextMaintainTime).unix()
        : 0,
      carSafeStopTime: _.carSafeStopTime ? moment(_.carSafeStopTime).unix() : 0,
      bizSafeStopTime: _.bizSafeStopTime ? moment(_.bizSafeStopTime).unix() : 0,
      trafficSafeStopTime: _.trafficSafeStopTime
        ? moment(_.trafficSafeStopTime).unix()
        : 0,
      firstShop: moment(_.firshShop).unix(),
      shopCarTime: _.shopCarTime ? moment(_.shopCarTime).unix() : "",
      cateId: _.seriesId,
      cateName: _.seriesName,
      carColor: _.carColour,
    }))
    // 计次卡（含赠送卡）
    data.countingCard = []
    for (let i in selectCard) {
      let _ = selectCard[i]
      _.good = _.recordsInfo.concat(_.giveItems)
      let good = []
      for (let j in _.good) {
        let v = _.good[j]
        if(v.info*1 === 2) {
          return message.warning("请给【计次卡（含赠送卡）】中商品设置价格！")
        }
        good.push({
          goodId: v.goodId, //"商品id",
          goodType: v.type, //"类型",
          expireDate: moment(v.deadlineTime).unix(), //"到期时间",
          amount: v.goodNum, //"数量",
        })
      }
      data.countingCard.push({
        packageCount: _.cardType ===4 ? _.packageCount : undefined,
        countingCardType: _.cardType ? _.cardType : _.salesType, //"计次卡类型 2: 计次卡, 3: 赠送卡",
        countingCardId: _.recordsId, //"计次卡id",
        countingCardName: _.cardName, //"计次卡名称",
        countingTime: moment(_.created).unix(), //"办卡时间",
        expireDate: _.deadlineTimes ? moment(_.deadlineTimes).unix() : -1, //"到期时间",
        good,
        car: _.car.map(
          (v) => v.plateProvince + v.plateLetter + "·" + v.plateNumber
        ), //"车牌号"
      })
    }
    // 充值卡
    data.recharegeCard = rechargeCard.map((_) => ({
      rechargeCardId: _.speciesId,
      rechargeCardName: _.cardName,
      money: _.giveMoney,
      expireDate: _.deadlineTime ? moment(_.deadlineTime).unix() : -1,
      car: _.car.map(
        (v) => v.plateProvince + v.plateLetter + "·" + v.plateNumber
      ), //"车牌号"
    }))
    this.setState({ loading: true })
    services
      .INSERT({ keys: { name: "store/IndividualImport" }, data })
      .then((res) => {
        this.setState({ loading: false })
        if (res.code === "0") {
          this.handleEy() // 清除
          message.success("导入成功！")
        } else {
          message.error("导入失败！")
        }
      })
  }
  render() {
    const {
      dispatch,
      selectCard,
      customerCar,
      channelList,
      editItem,
      rechargeCard,
    } = this.props
    const { Item } = PageLayout
    const content = [
      {
        title: "客户信息",
        value: editItem.clientName || "",
        main: (
          <Item title="客户信息">
            <CustomerInformation
              channelList={channelList}
              menuClick={this.menuClick}
              dispatch={dispatch}
              editItem={editItem}
            />
          </Item>
        ),
      },
      {
        title: "绑定车辆",
        value: customerCar.length || "",
        main: (
          <Item title="绑定车辆">
            <CustomerCar
              editItem={customerCar}
              menuClick={this.menuClick}
              selectCard={selectCard}
              rechargeCard={rechargeCard}
              dispatch={dispatch}
            />
          </Item>
        ),
      },
      {
        title: "充值卡",
        value: rechargeCard.length || "",
        main: (
          <Item title="选择充值卡">
            <SelectCard
              selectCard={selectCard}
              customerCar={customerCar}
              rechargeCard={rechargeCard}
              dispatch={dispatch}
            />
          </Item>
        ),
      },
      {
        title: "计次卡（含赠送卡）",
        value: selectCard.length || "",
        main: (
          <Item title="计次卡（含赠送卡）">
            <div>
              <CustomerCard
                dispatch={dispatch}
                selectCard={selectCard}
                customerCar={customerCar}
              />
            </div>
          </Item>
        ),
      },
    ]

    const bottom = (
      <div className={styles.bottom}>
        <Button
          type="primary"
          block
          size="large"
          onClick={this.handleSubmit}
          loading={this.state.loading}
        >
          发布
        </Button>
        <Button
          style={{ marginTop: "20px" }}
          type="primary"
          block
          size="large"
          onClick={this.handleSave}
          loading={this.state.loading}
        >
          暂存
        </Button>
        <Button
          style={{ marginTop: "20px" }}
          block
          size="large"
          onClick={this.handleEy}
          loading={this.state.loading}
        >
          清空
        </Button>
      </div>
    )

    return (
      <div style={{ position: "relative" }}>
        <PageLayout
          extra={72}
          ref={this.layout}
          content={content}
          bottom={bottom}
          active={this.state.active}
          menuClick={this.menuClick}
        />
        <Introduce
          title='关于客户导入'
          content={
            [
              {
                special: true,
                title: <div style={{color: '#333', fontWeight: 'bold'}}>什么是客户导入？</div>,
                content: <div  style={{color: '#666'}}>针对未录入系统老客户资料进行录入，完善客户并数据</div>,
              },
              {
                special: true,
                title: <div style={{color: '#333',fontWeight: 'bold'}}>怎么使用客户导入？</div>,
              },
              {
                title:  <div style={{color: '#333',fontWeight: 'bold'}}>第一步，选择 <span style={{color: '#4AACF7'}}>【客户信息】</span>，输入客户信息资料，保存提交即可到下一步</div>,
              },
              {
                title: <div style={{color: '#333',fontWeight: 'bold'}}>第二步，选择 <span style={{color: '#4AACF7'}}>【绑定车辆】</span>， 新建填写要绑定车辆的信息，完成即可</div>,
              },
            ]
          }
        />
        {/* {(proData && (proData.project || proData.product)) ? (
          <div className={styles.CustomerModalw}>
            <div className={styles.CustomerModal}>
              <div className={styles.t}><i className="iconfont icon-tishi"></i><span>请先设置服务/产品价格，再进行会员导入</span></div>
              <div className={styles.cont}>您有<span>{proData.project}</span>项目，<span>{proData.product}</span>个产品没有设置价格，请前往项目列表及产品列表设置。</div>
              <div className={styles.btnw}>
                <Button size="large" className={styles.btns} onClick={this.handleCancel}>项目列表</Button>
                <Button size="large" className={styles.btn} onClick={this.handleOk}>产品列表</Button>
              </div>
            </div>
          </div>
        ) : ''} */}
      </div>
    )
  }
}
function mapStateToProps(state) {
  const { customersImportAll } = state.customersImportAll
  const {
    selectCard,
    customerCar,
    editItem,
    rechargeCard,
    channelList,
    childState,
  } = state.customersImport
  return {
    selectCard,
    customerCar,
    channelList,
    editItem,
    rechargeCard,
    childState,
    customersImportAll,
  }
}
export default connect(mapStateToProps)(Index)
