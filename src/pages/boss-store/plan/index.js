import React, { Component } from 'react'
import { connect } from "dva"
import { Row, Col, Button } from "antd"
import services from "../../../services"
import moment from 'moment'
import PageLayout from "components/PageLayout/index"
import Search from './components/search-plan'
import StaffPlan from './components/staff-plan'
// import StorePlanBox from './components/store-plan'
import AddPlan from './components/add-plan'
import LookPlan from './components/look-plan'
import style from './style.less'
import empty from './img/no_data.jpg'

const { Item } = PageLayout

var current = 0
class Plan extends Component {
  constructor(props) {
    super(props)
    this.layout = React.createRef()
  }
  state = {
    look: false, // true查看   false 添加计划
    lookOrAdd: true,
    noActual: [],
    showStore: true,
    currentStaffState: -1, // 查看员工计划高亮
    time: moment().format('YYYYMM'),
    edit: false,
    currentStaff: 0, // 查看员工的我员工计划id
  }
  componentDidMount() {
    this.getData()
    this.getStafffPlan()
  }
  /**
   * 获取员工计划数据
   */
  getStafffPlan = (time) => {
    const { dispatch } = this.props
    dispatch({
      type: "storeStaffPlan/getStoreStaffplan",
      payload: time || this.state.time,
    })
  }
  /**
   * 获取门店计划数据
   */
  getData = (time) => {
    const { dispatch } = this.props
    dispatch({
      type: "storeStaffPlan/getStorePlan",
      payload: time || this.state.time,
    })
  }
  /**
   * 改变时间
   */
  gettime = (ti) => {
    let t = ti.substring(0, 4) + ti.substring(5, 7)
    current = 0
    this.setState({ look: false })
    this.layout.current.setCurrent(0)
    this.setState({ time: t, currentStaffState: -1 })
    this.getData(t)
    this.getStafffPlan(t)
  }
  /**
   * 锁定提交/编辑提交
   */
  golockClose = (edit) => {
    const { planId, storePlan, planIdStaff, staffPlanData } = this.props
    let obj = { status: 1 }
    this.setState({ edit: false })
    if (edit) {
      obj = {}
      if (current === 0) {
        for (let i in storePlan) {
          obj[storePlan[i].prop] = storePlan[i].plandata
        }
      } else {
        for (let i in staffPlanData) {
          obj[staffPlanData[i].prop] = staffPlanData[i].plandata
        }
      }
    }
    obj.createMonth = this.state.time
    services.UPDATE({
      keys: { name: current === 0 ? "store/plan" : 'store/staffplan', id: current === 0 ? planId : planIdStaff },
      data: obj,
    }).then(() => {
      if (current === 0) {
        this.getData()
      } else {
        this.getStafffPlan()
        this.getStaffPlan({ id: this.currentStaff, time: this.state.time })
      }
    })
  }
  /**
   * 添加计划成功之后请求返回了的计划数据
   */
  newStaffPlan = (id) => {
    if (current === 0) {
      this.getData()
    } else {
      const { dispatch } = this.props
      dispatch({
        type: "storeStaffPlan/getStoreStaffplan",
        payload: this.state.time,
      }).then(() => {
        const { staffPlan } = this.props
        let item = staffPlan.find(v => v.staffId === id)// 新添加的员工计划
        let index = staffPlan.findIndex(v => v.staffId === id)
        this.lookStaff(item.staffId, index)// 通过员工计划id获取该会员计划详情
      })
    }
  }
  /**
   * 切换门店/员工
   */
  menuClick = (cur) => {
    if (current === cur) {
      return false
    }
    current = cur
    if (cur === 0) { this.setState({ showStore: true }) }
    this.setState({ look: false, currentStaffState: -1, edit: false })
    this.layout.current.setCurrent(cur)
  }
  /**
   * 点击新建按钮
   */
  againAdd = (num) => {
    current = num
    this.setState({ look: false, currentStaffState: -1, showStore: true, edit: false })
  }
  /**
   * 点击查看员工计划
   */
  lookStaff = (num, index) => {
    current = 1
    this.currentStaff = num
    this.layout.current.setCurrent(1)
    this.setState({ look: true, currentStaffState: index, edit: false })
    this.getStaffPlan({ id: num, time: this.state.time })
  }
  /**
   * 通过员工计划id获取该会员计划详情
   */
  getStaffPlan = (num) => {
    const { dispatch } = this.props
    dispatch({
      type: "storeStaffPlan/setStaffPlan",
      payload: num,
    })
  }
  /**
   * 删除计划
   */
  deleteClick = () => {
    const { planId, planIdStaff, dispatch } = this.props
    services.DELETE({
      keys: { name: current === 0 ? "store/plan" : 'store/staffplan', id: current === 0 ? planId : planIdStaff },
    }).then(() => {
      if (current === 0) {
        dispatch({
          type: "storeStaffPlan/getStorePlan",
          payload: this.state.time,
        })
      } else {
        this.setState({ look: false, currentStaffState: -1 })
        dispatch({
          type: "storeStaffPlan/getStoreStaffplan",
          payload: this.state.time,
        })
      }
    })
  }
  /**
   * 显示添加门店计划
   */
  showModal = () => {
    this.setState({ showStore: false })
  }
  /**
   * 取消新建
   */
  setClone = () => {
    this.setState({ showStore: true })
  }
  setEditState = (edit) => {
    this.setState({ edit })
  }
  render() {
    const { look, time, currentStaffState, showStore, edit } = this.state
    const { dispatch, staffArr, storePlan, status, staffPlan, staffPlanData, currentStaff, statusStaff } = this.props

    const content = [
      {
        custom: (<div onClick={this.menuClick.bind(this, 0)} style={{ flex: 1 }}>
          <div className={style.menu} onClick={this.againAdd.bind(this, 0)}>
            <div className={current === 0 ? `${style.title} ${style.active}` : style.title}>门店计划</div>
            {(storePlan.length === 0) ? <div className={style.action}><i className='iconfont icon-tianjia' />&nbsp;新建门店计划</div> : ''}
            {(storePlan[0]) ? <div className={style.action}>&nbsp;查看门店计划</div> : ''}
          </div>
          {
            storePlan[0] ?
              (<div className={style.storePlanWrap}>
                {/* <StorePlanBox noActual={noActual}></StorePlanBox>
                <div className={style.storePlanTxt}>总业绩</div> */}
                <Row className={style.number}>
                  <Col span={12}>
                    <div className={style.dataTxt}>
                      <span className={style.point}></span>
                      <span>已完成</span>
                      <span className={style.proportion}>{storePlan[0] ? storePlan[0].progress : 0}%</span>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div className={style.dataTxt} style={{ textAlign: 'right' }}>
                      <span className={style.points}></span>
                      <span>未完成</span>
                      <span className={style.proportion}>{storePlan[0] ? storePlan[0].ontPlan : 0}%</span>
                    </div>
                  </Col>
                </Row>
              </div>) : ''
          }
        </div>),
        main: (
          <Item title={storePlan.length === 0 ? "新建门店计划" : "门店计划"}>
            {
              storePlan.length > 0 ?
                <LookPlan golockClose={this.golockClose} setEditState={this.setEditState} edit={edit} dispatch={dispatch} status={status} current={current} storePlan={storePlan} deleteClick={this.deleteClick}></LookPlan>
                : showStore ?
                  (
                    <div className="ainier_empty animated bounceIn" style={{ textAlign: 'center' }}>
                      <img src={empty} alt="" />
                      <p style={{ fontSize: '14px', color: '#333' }}>您暂未添加门店计划</p>
                      <Button type='primary' size="large" onClick={this.showModal}>添加门店计划</Button>
                    </div>
                  ) : <AddPlan newStaffPlan={this.newStaffPlan} current={current} time={time} staffArr={staffArr} setClone={this.setClone}></AddPlan>
            }
          </Item>
        ),
        marginBottom: '20px',
      },
      {
        custom: (<div onClick={this.menuClick.bind(this, 1)}>
          <div className={style.menu} onClick={this.againAdd.bind(this, 1)}>
            <div className={current === 1 ? `${style.title} ${style.active}` : style.title}>员工计划</div>
            <div className={style.action}><i className='iconfont icon-tianjia' />&nbsp;新建员工计划</div>
          </div>
          {staffPlan[0] ? <StaffPlan lookStaff={this.lookStaff} staffPlan={staffPlan} currentStaffState={currentStaffState}></StaffPlan> : ''}
        </div>),
        main: (
          <Item title={!look ? "新建员工计划" : currentStaff + '计划'}>
            {look ?
              <LookPlan golockClose={this.golockClose} setEditState={this.setEditState} current={current} edit={edit} storePlan={staffPlanData} dispatch={dispatch} status={statusStaff} deleteClick={this.deleteClick}></LookPlan>
              : (showStore && staffPlan.length === 0) ?
                (
                  <div className="ainier_empty animated bounceIn" style={{ textAlign: 'center' }}>
                    <img src={empty} alt="" />
                    <p style={{ fontSize: '14px', color: '#333' }}>您暂未添加员工计划</p>
                    <Button type='primary' size="large" onClick={this.showModal}>添加员工计划</Button>
                  </div>
                ) : <AddPlan newStaffPlan={this.newStaffPlan} current={current} staffArr={staffArr} time={time} setClone={this.setClone}></AddPlan>
            }
          </Item>
        ),
      },
    ]
    return (
      <PageLayout
        ref={this.layout}
        extra={72}
        active={0}
        head={<Search gettime={this.gettime} />}
        content={content}
      />
    )
  }
}
function mapStateToProps(state) {
  const { staffArr, storePlan, planId, status, staffPlan, staffPlanData, currentStaff, statusStaff, planIdStaff, noActual } = state.storeStaffPlan
  return { staffArr, storePlan, planId, status, staffPlan, staffPlanData, currentStaff, statusStaff, planIdStaff, noActual }
}
export default connect(mapStateToProps)(Plan)
