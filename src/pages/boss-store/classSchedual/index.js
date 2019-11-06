import React, { Component } from 'react'
import style from './style.less'
import moment from 'moment'
import F from './components/functionIntroduction'
import H from './components/howToSchedual'
import { DatePicker, Button, Icon, Modal, message, Spin, Tooltip, Tabs  } from 'antd'
import C from './components/classInstruction'
import R from './components/restManagement'
import service from 'services'
import CC from './components/chooseClass' //选择排班
import W from './components/workAdjustment'
import Batch from './components/batchScheduling'//批量排班组件
import How from './components/howToClass'//如何排班组件
import Guice from './components/guicedesciption'//功能介绍组件

const TabPane = Tabs.TabPane
const { MonthPicker } = DatePicker
const Buttons = [
  {
    name: '本月应休管理',
    style: '132px',
  },
  // {
  //   name: '如何排班',
  //   style: '100px',
  // },
  // {
  //   name: '排班说明',
  //   style: '100px',
  // },
  // {
  //   name: '功能介绍',
  //   style: '100px',
  // },
]
const weeks = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']


const batchClass = ['早班', '中班', '晚班', '休息']
const colors = ['#4AACF7', '#13C2C2', '#2FC25B', '#F04864', '#FF6F28', '#8543E0', '#888']
const backgroundColors = [
  'rgba(74,172,247,0.2)',
  'rgba(19,194,194,0.2)',
  'rgba(47,194,91,0.2)',
  'rgba(240,72,100,0.2)',
  'rgba(255,111,40,0.2)',
  'rgba(133,67,224,0.2)',
  'rgba(230,230,230,0.2)',
]

class classSchedual extends Component {
  constructor(prop) {
    super(prop)
    this.state = {
      batchClassShow: false,//控制批量管理的显示与隐藏
      selectButtonShow: -1,//用于控制排班批量管理
      isBatchManagement: false, //用于触发批量管理
      batchManagement: {},//批量管理
      visible: false,
      mastShow: false, // 控制自定义Modal的显示隐藏
      staffClassList: [],
      loading: false,
      dataList: [],
      showModel: -1, //控制显示的antd弹窗类型
      mastType: -1, //控制显示自定义弹窗类型
      timeObj: {}, //控制时间调整对象
      classList: [],// 用于存放班次列表
      noButtonClick: false, //用于控制按钮是否被点击
    }
    this.timePicker = []    //用于储存时间Picker
    this.maintainMessage = {} //用于储存修改信息
    this.getData = this.getData.bind(this)
  }
  //控制按钮点击类型 根据不同类型进行不同操作
  buttonClick = (e) => {
    console.log(e)
    switch (e) {
      //本月应休按钮管理
      case 0:
        this.setState({
          showModel: 1,
          visible: true,
        })
        break
      //如何排班
      // case 1:
      // this.setState({
      //   mastShow: true,
      //   mastType: 1,
      // })
      // break
      //排班说明
      case 1:
        this.setState({
          showModel: 0,
          visible: true,
        })
        break
      //功能介绍
      // case 3:
      //   this.setState({
      //     mastType: 0,
      //     mastShow: true,
      //   })
      //   break
      case 4:
        this.setState({
          showModel: 2,
          visible: true,
        })
        break
      case 5:
        this.setState({
          showModel: 3,
          visible: true,
        })
        break
      case 6:
        this.setState({
          showModel: 4,
          visible: true,
        })
        break
      default:
        break
    }
  }
  //控制批量排班的显示
  showBatchButton = () => {
    const { isBatchManagement, batchClassShow } = this.state
    if (isBatchManagement) {
      this.setState({
        isBatchManagement: false,
        batchClassShow: !batchClassShow,
        selectButtonShow: -1,
        batchManagement: {},
      })
    }
    else {
      this.setState({
        batchClassShow: !batchClassShow,
      })
    }
    // this.buttonClick(5)
  }
  changeActiceButton = (e, i) => {
    this.setState({
      batchManagement: {
        shiftName: e.name,
        shiftId: e.id,

      },
      selectButtonShow: i,
      isBatchManagement: true,
    })
  }
  handleCancel = () => {
    this.setState({
      showModel: -1,
      visible: false,
    })
  }
  handerMastShow = () => {
    const { mastType } = this.state
    if (mastType === 0) {
      return <F handerMastHidden={this.handerMastHidden} />
    }
    else if (mastType === 1) {
      return <H handerMastHidden={this.handerMastHidden} />
    }
  }
  handerMastHidden = () => {
    this.setState({
      mastType: -1,
      mastShow: false,
    })
  }
  // 此函数用来判断所有类型model
  controlModelShow = () => {
    const { visible, showModel, dataList, classList } = this.state
    const { maintainMessage } = this
    const { timeObj } = this.state
    const { year, MM } = timeObj

    if (showModel === -1) return
    switch (showModel) {
      case 0:
        return (<Modal
          title="关于排班"
          width='900px'
          className={style.zl_divstyle}
          visible={visible}
          onCancel={this.handleCancel}
          footer={null}
        >
          <Tabs defaultActiveKey="1" >
            <TabPane tab="功能介绍" key="1">
              {/* <div style={{fontSize:'8px',fontFamily:'MicrosoftYaHei-Bold',fontWeight:'bold',color:'#333333',marginBottom:'20px'}}>功能介绍</div> */}
              <Guice />
            </TabPane>
            <TabPane tab="如何排班" key="2">
              {/* <div style={{fontSize:'8px',fontFamily:'MicrosoftYaHei-Bold',fontWeight:'bold',color:'#333333',marginBottom:'20px',paddingLeft:'16px'}}>排班使用指引</div> */}
              <How />
            </TabPane>
            <TabPane tab="批量排班" key="3">
              <Batch/>
            </TabPane>
            <TabPane tab="排班说明" key="4">
              {/* <div style={{fontSize:'8px',fontFamily:'MicrosoftYaHei-Bold',fontWeight:'bold',color:'#333333',marginBottom:'20px'}}>排班说明</div> */}
              <C
                dataList={dataList}
              />
            </TabPane>
          </Tabs>
        </Modal>)
      case 1:
        return (<Modal
          title="本月应休管理"
          width='1200px'
          visible={visible}
          onCancel={this.handleCancel}
          footer={null}
        >
          <R
            yearMonth={year + MM}
            handleCancel={this.handleCancel}
          />
        </Modal>)
      case 2:
        return (<Modal
          title="选择排班"
          width='570px'
          visible={visible}
          onCancel={this.handleCancel}
          footer={null}
        >
          <CC
            list={classList}
            classList={batchClass}
            handleBackdata={this.handleBackdata}
          />
        </Modal>)
      case 3:
        return (<Modal
          title="出勤调整"
          width='780px'
          visible={visible}
          onCancel={this.handleCancel}
          footer={null}
        >
          <W
            classList={classList}
            handleBackdata={this.handleBackdata}
            handleCancel={this.handleCancel}
            maintainMessage={maintainMessage}
            type={0}  // type 0 工作日调整 2 为休息日调整
          />
        </Modal>)
      case 4:
        const { staff } = maintainMessage
        const { staffClassList } = this.state
        const { id } = staff
        //遍历找到符合时间的数据
        let newList = [...staffClassList]
          .filter(item => {
            let status = false
            item.shiftList
              .forEach(i => {
                if (i.id === id) {
                  status = true
                }
              })
            return status
          })
        console.log(newList[0].shiftList)
        return (<Modal
          title="出勤调整"
          width='780px'
          visible={visible}
          onCancel={this.handleCancel}
          footer={null}
        >
          <W
            classList={classList}
            yearMonth={year + '-' + MM}
            staffDayList={newList[0].shiftList}
            maintainMessage={maintainMessage}
            handleBackdata={this.handleBackdata}
            handleCancel={this.handleCancel}
            type={2}  // type 0 工作日调整 2 为休息日调整
          />
        </Modal>)
      default:
        break
    }
  }
  //用于对回调函数参数进行处理
   /**
   * 选择支付方式
   * @param {Object} back 回调参数
   */
  handleBackdata = (back) => {
    // 处理数据------------------
    //type类型为1------------------------
    const { maintainMessage } = this
    const { day, staff } = maintainMessage
    if (back.type === 0 || back.type === 2) {
      const { timeObj } = this.state
      let o = {}
      const { id } = staff
      o.day = staff.day
      o.yearMonth = timeObj.year + timeObj.MM
      switch (back.value.index) {
        case 0:
          o.status = 3
          break
        case 1:
          o.status = 2
          break
        case 2:
          o.status = 1
          break
        case -1:
          o.status = 0
          o.shiftId = back.value.id
          break
        case 4:
          o.status = 4
          o.shiftId = back.value.id
          let newDate = new Date(back.value.date)
          let year = newDate.getFullYear()
          let month = newDate.getMonth() + 1
          let day = newDate.getDate()
          o.day = day
          month < 10 ? month = '0' + month : month = String(month)
          day < 10 ? day = '0' + day : day = String(day)
          o.yearMonth = year + month
          break
        case 5:
          o.status = 5
          o.shiftId = back.value.id
          break
        default:
          break
      }
      service.schedulingAdjustment({ keys: { name: 'store/scheduling', id }, data: { ...o } }).then(async res => {
        if (res.code === '0') {
          message.success('调整成功')
          let staffClassList = await this.getData()
          this.setState({
            staffClassList,
            loading: false,
          })
        } else {
          // message.info('网络出现错误')
          return false
        }
      })
    }
    else if (back.type === 1) {
      const { staffClassList } = this.state
      let newStaffList = [...staffClassList]
        .map(item => {
          if (item.staffId === staff.staffId) {
            let newClassList = [...item.shiftList]
            let newDayIndex = item.shiftList
              .map(item => item.day)
            if (newDayIndex.indexOf(day.days) >= 0) {
              if (back.value === '清除') {
                newClassList
                  .splice((newDayIndex.indexOf(day.days)), 1)
              }
              else {
                newClassList
                  .splice((newDayIndex.indexOf(day.days)), 1)
                newClassList
                  .push({
                    shiftName: back.value,
                    day: day.days,
                    shiftId: back.id,
                  })
              }
            } else {
              if (back.value !== '清除') {
                newClassList
                  .push({
                    shiftName: back.value,
                    day: day.days,
                    shiftId: back.id,
                  })
              }
            }
            return {
              ...item,
              shiftList: newClassList,
            }
          }
          else {
            return item
          }
        })
      this.setState({
        staffClassList: newStaffList,
      })
    }
    this.handleCancel()
  }
  //用于对已经排班的状态进行修改
  changeClassStatus = (day, staff) => {
    this.maintainMessage = {
      day, staff,
    }
    if (staff.status !== 6) {
      this.buttonClick(5)
    }
    else if (staff.status === 6) {
      this.buttonClick(6)
    }
  }
  //修改月份
  changeMonth = (e) => {
    //更据传入 moment格式 来过去初始化 时间表结构
    //e monthPicker 回调参数
    if (e) {
      let day = moment(e).daysInMonth() // 获取当月有多少天
      let month = moment(e).format('M') // 获取当前月份
      let year = moment(e).format('Y')
      let MM = month * 1 < 10 ? '0' + month : month
      let fristDay = new Date(`${year}-${MM}-01`).getDay() // 获取月初星期
      this.productDateList({
        day,
        month,
        fristDay,
      })
      this.setState({
        timeObj: {
          day,
          month,
          fristDay,
          year,
          MM,
        },
      }, async () => {
        let staffClassList = await this.getData()
        this.setState({
          staffClassList,
          loading: false,
        })
      })
    }
  }
  async  UNSAFE_componentWillMount() {

    //监听滚动条滚动事件
    //获取初始化时间Object
    this.changeMonth(this.getDefaultTime())
    // this.productDateList({
    //   fristDay:5,
    //   day:28,
    //   month:2,
    // }
    let classList, dataList

    await service.storeShiftList({ keys: { name: 'store/shift' }, data: { type: 1 } })
      .then(res => {
        if (res.code === '0') {
          classList = res.list
        } else {
          message.info('网络出现错误')
          classList = []
        }
      })
    await service.storeShiftList({ keys: { name: 'store/shift' }, data: { type: 0 } })
      .then(res => {
        if (res.code === '0') {
          dataList = res.list
        } else {
          message.info('网络出现错误')
          dataList = []
        }
      })
    this.setState({
      classList,
      dataList,
    })
  }
  //获取排班列表
  async getData() {
    const { timeObj } = this.state
    const { year, MM } = timeObj
    let staffClassList
    this.setState({
      loading: true,
    })
    await service.schedulingList({ keys: { name: 'store/shift' }, data: { yearMonth: year + MM } })
      .then(res => {
        if (res.code === '0') {
          staffClassList = res.list
        }
        else {
          message.info('网络出现错误')
          staffClassList = []
        }
      })
    return staffClassList
  }
  //生成表格结构
  productDateList = (timeObj) => {
    this.timePicker = []
    const { day, month, fristDay } = timeObj
    let timePicker = [], index = fristDay
    for (let i = 0; i < day; i++) {
      if (index === 7) index = 0
      timePicker.push({
        weeks: weeks[index],
        days: (i + 1),
        month,
      })
      index++
    }
    this.timePicker = timePicker
  }
  selectClass = (day, staff) => {
    const { isBatchManagement, batchManagement } = this.state
    this.maintainMessage = {
      day, staff,
    }
    if (isBatchManagement) {
      this.handleBackdata({
        type: 1,
        value: batchManagement.shiftName,
        id: batchManagement.shiftId,
      })
    } else {
      this.buttonClick(4)
    }
  }
  //获取antd-Design时间搜索框初始化时间
  getDefaultTime = () => {
    let newTime = new Date()
    return moment(`${newTime.getFullYear()}-${(newTime.getMonth() + 1)}`)
  }
  //控制月份选择器应该选择的时间  提前2个月
  controlShowTime = (e) => {
    //获取时间格式
    let seclectTimeCount = Date.parse(moment(e).format('YYYY-MM'))
    let nowTimeCount = Date.parse(new Date())
    let twoMonthTime = 3 * 31 * 24 * 3600 * 1000
    if (seclectTimeCount - nowTimeCount >= -twoMonthTime) {
      return false
    }
    else {
      return true
    }
  }
  //保存操作
  submitTime = () => {
    const { staffClassList, timeObj } = this.state
    const { isBatchManagement, batchClassShow } = this.state
    //获取提交数组
    let submitList = [...staffClassList]
      .map(item => {
        let newShiftList = item.shiftList
          .filter(i => !i.id)
        return {
          ...item,
          shiftList: newShiftList,
        }
      })
    let newSubmitList = submitList
      .filter(i => i.shiftList.length !== 0)
    //保存排班
    if (newSubmitList.length === 0) return
    let o
    isBatchManagement ? o = {
      isBatchManagement: false,
      batchClassShow: !batchClassShow,
      selectButtonShow: -1,
      batchManagement: {},
    } : o ={}
    const { year, MM } = timeObj
    this.setState({
      noButtonClick: true,
      ...o,
    }, () => {
      service.saveScheduling({ keys: { name: 'brand/shift' }, data: { data: newSubmitList, yearMonth: year + MM } })
        .then(async res => {
          if (res.code === '0') {
            message.success('保存成功')
            let staffClassList = await this.getData()
            this.setState({
              staffClassList,
              loading: false,
              noButtonClick: false,
            })
          } else {
            // message.info('保存失败')
            this.setState({
              noButtonClick: false,
            })
          }
        })
    })
  }
  //处理颜色和背景颜色
  handerColor = (name, status) => {
    // console.log(111111111111,status)
    //控制颜色
    if (!status || status === 0 || status === 6) {
      const { dataList } = this.state
      let nameList = [...dataList]
        .map(item => item.name)
      if (name === '休息') {
        return {
          color: colors[6],
          backgroundColor: backgroundColors[6],
        }
      } else {
        let index = nameList.indexOf(name) % 5
        return {
          color: colors[index],
          backgroundColor: backgroundColors[index],
        }
      }
    } else if (status === 1 || status === 2) {
      return {
        color: colors[6],
        backgroundColor: backgroundColors[6],
      }
    } else if (status === 3) {
      return {
        color: colors[3],
        backgroundColor: backgroundColors[3],
      }
    } else if (status === 4) {
      return {
        color: colors[4],
        backgroundColor: backgroundColors[4],
      }
    } else if (status === 5) {
      return {
        color: colors[5],
        backgroundColor: backgroundColors[5],
      }
    }
  }
  getShiftName = (name) => {
    if (name.length > 5) return <Tooltip title={name} ><span>{name.slice(0, 5)}</span></Tooltip>
    else return <span>{name}</span>
    // switch (status) {
    //   case 1:
    //     return '有薪假'
    //   case 2:
    //     return '无薪假'
    //   default:
    //     if (name.length > 5) return <Tooltip title={name} ><span>{name.slice(0, 5)}</span></Tooltip>
    //     else return <span>{name}</span>
    // }
  }
  getAddtionName = (status) => {
    switch (status) {
      case 1:
        return '(有薪假)'
      case 2:
        return '(无薪假)'
      case 3:
        return '(缺勤)'
      case 4:
        return '(调休)'
      case 5:
        return '(未休)'
      default:
        return
    }
  }
  //修改本月应休管理
  render() {
    const {
      batchClassShow,
      selectButtonShow,
      mastShow,
      staffClassList,
      isBatchManagement,
      classList,
      loading,
      noButtonClick,
    } = this.state

    const {
      timePicker,
    } = this
    let width = timePicker.length * 89
    return <div className={style.zl_boxContent} >
      <div className={style.help} onClick={() => this.buttonClick(1)}><i className='iconfont icon-wenhao1'/>如何排班</div>
      <div className={style.zl_addClassHeader} >
        日期
           <MonthPicker
          size='large'
          style={{ width: "220px", marginLeft: '9px' }}
          onChange={this.changeMonth}
          placeholder='选择时间'
          //获取初始化时间
          defaultValue={this.getDefaultTime()}
          //控制月份选择器选择的时间
          disabledDate={this.controlShowTime}
        />
        {
          Buttons
            .map((item, i) =>
              <Button style={{ height: '40px', width: item.style, marginLeft: '24px' }}
                key={i}
                onClick={this.buttonClick.bind(this, i)}   >
                {item.name}
              </Button>)
        }
        <div style={{ float: 'right', marginRight: '32px', marginLeft: '24px' }}>
        <Button
          onClick={this.submitTime}
          style={{ width: '100px', height: '40px' }}
          type="primary"
          disabled={noButtonClick}
          loading={noButtonClick}
        >保存排班</Button></div>
        <div className={style.zl_ButtonLeft} >
          <div
            className={batchClassShow ? style.zl_showClassButton : style.zl_hiddenClassButton} >
            <span
              className={isBatchManagement ? style.activeBg : style.zl_showClass}
              onClick={this.showBatchButton} >
              {
                batchClassShow ?
                  <Icon
                    style={{ color: '#ccc', marginTop: '12px', marginLeft: '5px' }}
                    type="right" />
                  :
                  <Icon
                    style={{ color: '#ccc', marginTop: '12px', marginLeft: '5px' }}
                    type="left" />
              }
            </span>
            {
              classList
                .map((item, i) =>
                  <Button
                    onClick={this.changeActiceButton.bind(this, item, i)}
                    key={i}
                    style={{ minWidth: '60px', height: '40px', visibility: batchClassShow ? '	visible' : 'hidden', verticalAlign: 'middle' }}
                    type={i === selectButtonShow ? 'primary' : 'default'}
                  >
                    {item.name}
                  </Button>)
            }
          </div>

          <Button
            onClick={this.showBatchButton}
            type={isBatchManagement ? 'primary' : 'default'}
            style={{ width: '120px', height: '40px' }}
          >{batchClassShow?'关闭批量排班':'开启批量排班'}</Button>
        </div>
      </div>
      <Spin spinning={loading} >
        <div className={style.zl_tableContent} >
          <div className={style.zl_tableContent_l} >
            <div className={style.zl__tableHeader} >日期<br />员工</div>
            {
              staffClassList
                .map((item, i) =>
                  <div
                    className={style.zl_tableNoneC}
                    key={i} >
                    {item.staffName.length < 6 ? item.staffName : <Tooltip title={item.staffName} ><span>{item.staffName.slice(0, 5)}</span></Tooltip>   }
                  </div>)
            }
          </div>
          <div className={style.zl_tableContent_R} >
            <div style={{ height: '56px', width: width + 'px' }}   >
              {
                timePicker
                  .map((item, i) =>
                    <div key={i} className={style.zl__tableHeader} style={{ float: 'left' }} >
                      {item.weeks} <br />
                      <span style={{ color: 'rgba(153,153,153,1)' }} >({item.month + '.' + item.days})</span>
                    </div>)
              }
            </div>
            {
              staffClassList
                .map((item, i) => <div style={{ height: '56px', width: width + 'px' }} key={i} >
                  {timePicker.map((v, o) => {
                    let daysArray = item.shiftList
                      .map(item => item.day)
                    if (daysArray.indexOf(v.days) >= 0) {
                      let dayObject = item.shiftList[daysArray
                        .indexOf(v.days)]
                      // , color=colors[batchClass
                      //   .indexOf(dayObject.shiftName)]
                      // , backgroundColor=backgroundColors[batchClass
                      //   .indexOf(dayObject.shiftName)]
                      //   this.handerColor(dayObject.shiftName)
                      const {
                        color,
                        backgroundColor,
                      } = this.handerColor(dayObject.shiftName, dayObject.status)
                      return <div
                        key={o}
                        onClick={
                          dayObject.id ?
                            this.changeClassStatus.bind(this, v, dayObject)
                            :
                            this.selectClass.bind(this, v, item)
                        }
                        className={dayObject.status === 1 || dayObject.status === 2 || dayObject.status === 3 || dayObject.status === 4 || dayObject.status === 5 ? style.zl_tableNoneC2 : style.zl_tableNoneC}
                        style={{ float: 'left', color, backgroundColor }} >
                        <span
                         className={style.zl_class_line}
                         style={{ backgroundColor: color }} >
                        </span>
                        {this.getShiftName(dayObject.shiftName, dayObject.status)}
                        <br />
                        {this.getAddtionName(dayObject.status)}
                      </div>
                    }
                    else {
                      return <div
                        onClick={this.selectClass.bind(this, v, item)}
                        key={o}
                        className={style.zl_tableNoneC}
                        style={{ float: 'left' }}  >
                      </div>
                    }
                  })}
                </div>)
            }
          </div>
        </div>
      </Spin>
      {
        this.controlModelShow()
      }
      {
        mastShow && this.handerMastShow()
      }
    </div>
  }
}
export default classSchedual
