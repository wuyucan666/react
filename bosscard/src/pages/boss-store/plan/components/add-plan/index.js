import { Component } from "react"
import { Icon, Row, Col, Input, Button, Select, message } from "antd"
import style from './index.less'
import Add from './add.js'
import services from "../../../../../services"
import imgs from '../../img/plan_must.png'

const Option = Select.Option
class AddPlan extends Component {
  state = {
    visible: false, // 老客业绩显示
    show: true, // 门店计划顶部提示
    loading: false,
    staffId: 0, // 要查看的员工id
    arr: [
      { name: '总业绩', value: '', prop: 'output', img: true },
      { name: '总消耗', value: '', prop: 'consume' },
      { name: '到店台次', value: '', prop: 'inshopCar' },
      { name: '会员车辆数', value: '', prop: 'clientVehicles' },
      { name: '散客车辆数', value: '', prop: 'touristVehicles' },
      { name: '充值卡业绩', value: '', prop: 'speciesOutput' },
      { name: '计次卡业绩', value: '', prop: 'recordsOutput' },
      { name: '充值卡数', value: '', prop: 'speciesCount' },
      { name: '计次卡消耗', value: '', prop: 'recordsConsume' },
      { name: '充值卡消耗', value: '', prop: 'speciesConsume' },
      { name: '项目消耗', value: '', prop: 'projectConsume' },
    ],
    ary: [
      { name: '总业绩', value: '', prop: 'output', img: true },
      { name: '总消耗', value: '', prop: 'consume' },
      { name: '车辆数', value: '', prop: 'carCount' },
      { name: '会员车辆数', value: '', prop: 'clientVehicles' },
      { name: '散客车辆数', value: '', prop: 'touristVehicles' },
      { name: '充值卡业绩', value: '', prop: 'speciesOutput' },
      { name: '计次卡业绩', value: '', prop: 'recordsOutput' },
      { name: '计次卡消耗', value: '', prop: 'recordsConsume' },
      { name: '充值卡消耗', value: '', prop: 'speciesConsume' },
      { name: '产品消耗', value: '', prop: 'productConsume' },
      { name: '项目消耗', value: '', prop: 'projectConsume' },
      { name: '单车产值', value: '', prop: 'perCarOutput' },
    ],
  }
  /**
   * 添加老客业绩
   */
  addOldCustomer = () => {
    this.setState({ visible: true })
  }
  gooldClose = () => {
    this.setState({ visible: false })
  }
  setShow = () => {
    this.setState({ show: false })
  }
  /**
   * 填写计划
   */
  onChange = (index, e) => {
    const { current } = this.props
    let str = e.target.value
    let rel = /^[0-9]+\.{0,1}[0-9]{0,2}$/
    if (!rel.test(str) || (str.substr(0, 1) === '0' && str.substr(1, 1) === '0')) {
      str = ''
    }
    let ary = []
    if (current === 0) {
      ary = this.state.arr.map(_ => ({ ..._ }))
    } else {
      ary = this.state.ary.map(_ => ({ ..._ }))
    }
    ary[index].value = str
    this.setState({
      arr: current === 0 ? ary : [],
      ary: current === 1 ? ary : [],
    })
  }
  /**
   * 填写老客业绩
   */
  onChangeMember = (index, e) => {
    let str = e.target.value
    let rel = /^[0-9]+\.{0,1}[0-9]{0,2}$/
    if (!rel.test(str) || (str.substr(0, 1) === '0' && str.substr(1, 1) === '0')) {
      str = ''
    }
    let ary = this.state.member.map(_ => ({ ..._ }))
    ary[index].value = str
    this.setState({
      member: ary,
    })
  }
  /**
   * 选择员工
   */
  onChangeStaff = (e) => {
    this.setState({ staffId: e })
  }
  /**
   * 提交
   */
  subBtn = () => {
    const { current, time, newStaffPlan } = this.props
    let data = {}
    let d = current === 0 ? this.state.arr : this.state.ary
    for (let i in d) {
      if (!d[0].value) { return message.warning("总业绩不能为空!") }
      data[d[i].prop] = d[i].value ? d[i].value : 0
    }
    if (current === 1 && !this.state.staffId) { return message.warning("请选择员工!") }
    if (current === 1) { data.staffId = this.state.staffId }
    data.createMonth = time
    this.setState({ loading: true })
    services.INSERT({ data, keys: { name: current === 0 ? "store/plan" : 'store/staffplan' } }).then(res => {
      this.setState({ loading: false })
      if (res.code === '0') {
        newStaffPlan(this.state.staffId)
        return message.success("添加成功!")
      }
    })
  }
  /**
   * 取消新建
   */
  goClone = () => {
    const { setClone } = this.props
    setClone()
  }
  render() {
    const { current, staffArr } = this.props
    const { show } = this.state
    let arr = current === 0 ? this.state.arr : this.state.ary
    return (
      <div className={style.addplan}>
        {(current === 0 && show) ? <div className={style.prompt}>门店计划目标需要单独设置，并非所有员工计划目标的总和<Icon onClick={this.setShow} className={style.promptIcon} type="close" /></div> : ''}
        <div className={style.from}>
          <Row gutter={70}>
            {
              current === 1 ? <Col span={12}>
                <div className={style.flexw}>
                  <div className={style.name}><img src={imgs} alt="" className={style.imgs} style={{ left: '46px' }}></img>员工</div>
                  <div className={style.input}>
                    <Select style={{ width: '100%' }} onChange={this.onChangeStaff} size="large">
                      {staffArr.map((v) => {
                        return <Option value={v.staffId} key={v.staffId}>{v.staffName}</Option>
                      })}
                    </Select>
                  </div>
                </div>
              </Col> : ''
            }
            {arr.map((v, index) => {
              return (
                <Col span={12} key={index}>
                  <div className={style.flexw}>
                    <div className={style.name}>{v.img ? <img src={imgs} alt="" className={style.imgs}></img> : ''}{v.name}</div>
                    <div className={style.input}><Input size="large" value={v.value} onChange={this.onChange.bind(this, index)} /></div>
                  </div>
                </Col>
              )
            })}
          </Row>
        </div>
        {/* {current ? <div className={style.oldcustomer}>老客户业绩<div onClick={this.addOldCustomer} className={style.oldcustomeradd}><Icon type="plus" /> 添加老客户业绩</div></div> : ''}
        {current ? <div className={style.oldcustomerList}>
          <Row gutter={70}>
            {member.map((v, index) => {
              return (
                <Col span={12} key={index}>
                  <div className={style.flexw}>
                    <div className={style.name}>{v.name}</div>
                    <div className={style.input}><Input size="large" value={v.value} onChange={this.onChangeMember.bind(this, index)} addonAfter="元" /></div>
                    <div className={style.delete}><span className="iconfont icon-shanchu"></span></div>
                  </div>
                </Col>
              )
            })}
          </Row>
        </div> : ''} */}
        <div className={style.btnw}>
          <Button type="primary" size='large' className={style.btn} onClick={this.subBtn} loading={this.state.loading}>保存</Button>
          <Button size='large' className={style.btn} onClick={this.goClone}>取消</Button>
        </div>
        <Add visible={this.state.visible} gooldClose={this.gooldClose}></Add>
      </div>
    )
  }
}

export default AddPlan
