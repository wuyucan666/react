import React, { Component } from "react"
import style from "./style.less"
import { DatePicker, Button, Select, TreeSelect, message } from "antd"
import { connect } from "dva"
import G2 from "@antv/g2"
import SuperTable from "./superTable"
import moment from "moment"
import services from "services"

const { MonthPicker } = DatePicker

const Option = Select.Option
const TreeNode = TreeSelect.TreeNode
const tabButton = ["本月", "本年", "历史"]
const color = ["rgb(24, 144, 255)", "rgb(47, 194, 91)", "rgb(250, 204, 20)"]
const dateButton = ["按日", "按周", "按月", "按年"]
const grounpBy = ["day", "week", "month", "year"]
const { RangePicker } = DatePicker
const printContent = (data, container) => {
  var chart = new G2.Chart({
    container,
    forceFit: true,
    height: 270,
    padding: [10, 50, 30, 50], // 上右下左
  })
  chart.source(data)
  chart.tooltip({
    crosshairs: {
      type: "line",
    },
  })
  chart.axis("date", {
    label: {
      textStyle: {
        fill: "#aaaaaa",
        textAlign: "center", // 文本对齐方式
        fontSize: 12, // 文本大小
      },
    },
  })
  chart.axis("value", {
    label: {
      textStyle: {
        fill: "#aaaaaa",
      },
      formatter: function formatter(text) {
        return text.replace(/(\d)(?=(?:\d{3})+$)/g, "$1,")
      },
    },
  })
  chart.legend(false)
  chart
    .line()
    .position("date*value")
    .color("type")
  chart
    .point()
    .position("date*value")
    .color("type")
    .size(4)
    .shape("circle")
    .style({
      stroke: "#fff",
      lineWidth: 1,
    })
  chart.render()
  chart.showTooltip({
    x: 200,
    y: 100,
  })
}
//时间筛选
const filterTime = a => {
  return moment(`${moment(a).format("YYYY-MM-DD")} 00:00:00`).unix()
}
//获得本月第一天
const getThisMonthFirstDay = () => {
  return moment().startOf('month').unix()
}
//获得本年第一天
const getThisYearFirstDay = () => {
  var currentDate = new Date()
  var currentYear = currentDate.getFullYear()
  var currentYearFirstDate = new Date(currentYear, 0, 1)
  return currentYearFirstDate
}
class performance extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tab: 0,
      data: [],
      value: [],
      staffId: [],
      staffName: [],
      monthValue: [],
      timeSearch: {},
      name: ["总计"],
      mode: ["month", "month"],
      noButtonClick: false, //用于控制按钮是否被点击
    }
    this.dataType = {}
    this.index = {}
    this.data = []
    this.printContent = null
  }
  tabChange = tab => {
    let start, end
    this.dataType = {
      groupBy: "day",
    }
    switch (tab) {
      case 2:
        this.setState(
          {
            tab,
            timeSearch: {},
          },
          () => {
            this.getData()
          }
        )
        break
      case 0:
        start = getThisMonthFirstDay()
        end = new Date()
        this.setState(
          {
            tab,
            timeSearch: {
              "completed[<>]": [start, Math.ceil(end / 1000)],
            },
          },
          () => {
            this.getData()
          }
        )
        break
      case 1:
        start = getThisYearFirstDay()
        end = new Date()
        this.setState(
          {
            tab,
            timeSearch: {
              "completed[<>]": [Math.ceil(start / 1000), Math.ceil(end / 1000)],
            },
          },
          () => {
            this.getData()
          }
        )
        break
      default:
        return
    }
  };

  dateChange = val => {
    let grounpByIdx = grounpBy[val]
    this.dataType = {
      groupBy: grounpByIdx,
    }
    this.getData()
  };
  //获取员工列表
  UNSAFE_componentWillMount() {
    services.list({ keys: { name: "store/staff" } }).then(res => {
      if (res.code === "0") {
        const { list } = res
        let staffId = [...list].map(item => item.staffId)
        let staffName = [...list].map(item => item.staffName)
        let valueArr
        if (list.length >= 3) {
          valueArr = ["0", "1", "2"]
        } else {
          valueArr = list.map((item, i) => String(i))
        }
        this.setState(
          {
            staffId,
            staffName,
            value: valueArr,
          },
          () => {
            this.tabChange(0)
          }
        )
      }
    })
    // this.getData()
  }
  getData = () => {
    const { timeSearch, value, staffId, staffName } = this.state
    const { dataType, index } = this
    this.setState({
      noButtonClick: true,
    })
    if (value.length === 0) {
      services
        .performanceDeductTrend({
          keys: { name: "wide-performance/performance/deduct/trend" },
          data: { q: { where: { ...timeSearch }, ...dataType, ...index } },
        })
        .then(res => {
          let list = [...res.data].map(item => {
            if (dataType.groupBy === "week") {
              return {
                type: "总计",
                value: item.num * 1,
                date: "第" + item.date + "周",
              }
            } else {
              return {
                type: "总计",
                value: item.num * 1,
                date: item.date,
              }
            }
          })
          this.data = list
          if (this.printContent) {
            this.printContent.innerHTML = ""
          }
          this.setState({
            name: ["总计"],
            noButtonClick: false,
          })
          list.length === 0
            ? (this.data = [{ type: "暂无数据", value: 0, date: "0" }])
            : false

          // printContent(this.data,'printContent')
        })
    } else {
      this.data = []
      let PromiseArr = []
      value.forEach(item => {
        let promise = new Promise(resolve => {
          services
            .performanceDeductTrend({
              keys: { name: "wide-performance/performance/deduct/trend" },
              data: {
                q: {
                  where: { ...timeSearch, staffId: staffId[item * 1] },
                  ...dataType,
                  ...index,
                },
              },
            })
            .then(res => {
              let list = [...res.data].map(i => {
                if (dataType.groupBy === "week") {
                  return {
                    type: staffName[item * 1],
                    value: i.num * 1,
                    date: "第" + i.date + "周",
                  }
                } else {
                  return {
                    type: staffName[item * 1],
                    value: i.num * 1,
                    date: i.date,
                  }
                }
              })
              resolve(list)
            })
        })
        PromiseArr.push(promise)
      })
      Promise.all(PromiseArr).then(res => {
        this.data = []
        let arr = []
        res.forEach(item => {
          if (item.length !== 0) {
            arr.push(...item)
          }
        })
        //获取当前年份
        if (!dataType.groupBy || dataType.groupBy === "day") {
          // let year = moment(new Date()).format('YYYY')
          this.data = arr.sort((a, b) => {
            return Date.parse(new Date(a.date)) - Date.parse(new Date(b.date))
          })
        } else if (dataType.groupBy === "week") {
          this.data = arr.sort((a, b) => {
            return a.date * 1 - b.date * 1
          })
        } else {
          this.data = arr
        }
        if (this.printContent) {
          this.printContent.innerHTML = ""
        }
        this.data.length === 0
          ? (this.data = [{ type: "暂无数据", value: 0, date: "0" }])
          : false
        //搜索遍历
        let name = []

        this.data.forEach(item => {
          if (name.indexOf(item.type) < 0) {
            name.push(item.type)
          }
        })
        this.setState({
          name,
          noButtonClick: false,
        })
        // printContent(this.data,'printContent')
      })
    }
  };
  componentDidMount() {
    // printContent(mockData,'printContent')
  }
  handleChange = value => {
    if (value.length > 3) {
      this.setState({ value: value.slice(1, 4) }, () => {
        this.getData()
      })
    } else {
      this.setState({ value: value }, () => {
        this.getData()
      })
    }
  };
  handleSubmit = () => {
    const { monthValue } = this.state
    let o = {}
    if (monthValue.length === 0) {
      message.info("请选择时间段")
    } else {
      o["completed[<>]"] = monthValue.map(i => filterTime(i))
      this.setState(
        {
          timeSearch: { ...o },
          tab: -1,
        },
        () => {
          this.getData()
        }
      )
    }
  };
  onChangeType = val => {
    this.index = {
      index: val * 1,
    }
    this.getData()
  };
  reset = () => {
    this.setState({
      monthValue: [],
    })
    this.tabChange(0)
  };
  handlePanelChange = (value, mode) => {
    this.setState(
      {
        monthValue: value,
        mode: [
          mode[0] === "date" ? "month" : mode[0],
          mode[1] === "date" ? "month" : mode[1],
        ],
      },
      () => {
        this.handleSubmit()
      }
    )
  };
  //改版明细，月份切换
  monthOnchange(d, v) {
    this.setState({
      timeSearch: {
        "completed[<>]": [
          moment(v)
            .startOf("month")
            .unix(),
          moment(v)
            .endOf("month")
            .unix(),
        ],
      },
    })
  }
  render() {
    const {
      // tab,
      // staffName,
      // name,
      // value,
      timeSearch,
      // mode,
      // monthValue,
      // noButtonClick,
    } = this.state
    return (
      <div className={style.zl_contentBox}>
        {/* <div style={ { height:'40px',display:'flex',marginBottom:'50px' } }  >
                    { tabButton.map((item,i)=><Button
                                               disabled={noButtonClick }
                                               loading={noButtonClick}
                                               key={ i }
                                               style={{ width:'80px',height:'40px',marginRight:'24px',verticalAlign:'middle' }}
                                               onClick={this.tabChange.bind(this,i)}   type={ tab===i ? 'primary' : null  }>
                                               {item}
                                               </Button>) }
                                <RangePicker
                                  placeholder={['开始月份', '结束月份']}
                                  mode={mode}
                                  value={monthValue}
                                  size="large"
                                  format="YYYY-MM"
                                  style={ {width:'542px', height:'60px'  }     }
                                  onPanelChange={this.handlePanelChange}
                                   />

                             <Button  disabled={noButtonClick } loading={noButtonClick}  style={ { height:'40px',width:"88px",marginLeft:'24px' } }  type="primary"  onClick={this.handleSubmit}   >
                                           查询
                            </Button>
                            {/*<Button
                               style={{ height: "40px", width: "88px",marginLeft:'24px' }}
                               disabled={noButtonClick }
                               loading={noButtonClick}
                               onClick={this.reset}
                            >
                                    重置
                            </Button> 
                </div> */}
        {/* <div className={ style.zl_sec2 } >
                   <p> <i  className={ style.zl_blueD } ></i>业绩数据  </p>
                   <div className={style.zl_printing}  >
                      <TreeSelect
                        style={ {width:'220px',height:'40px',paddingRight:'24px' } }
                        placeholder="汇总业绩"
                        allowClear
                        size="large"
                        onChange={this.onChangeType}
                      >
                       <TreeNode title='汇总业绩' value='0-1'  selectable={false}  >
                         <TreeNode title='业绩' value='1'   />
                         <TreeNode title='卡消耗' value='2'   />
                         <TreeNode title='毛利' value='3'   />
                         <TreeNode title='提成' value='4'   />
                       </TreeNode>
                       <TreeNode title='服务项目业绩'  value="0-2"  selectable={false}  >
                         <TreeNode title='业绩' value='5'   />
                         <TreeNode title='卡消耗' value='6'   />
                         <TreeNode title='毛利' value='7'   />
                         <TreeNode title='提成' value='8'   />
                         <TreeNode title='销售提成' value='9'   />
                         <TreeNode title='施工提成' value='10'   />
                       </TreeNode>
                       <TreeNode title='产品销售业绩' value='0-3'  selectable={false}  >
                         <TreeNode title='业绩' value='11'   />
                         <TreeNode title='卡消耗' value='12'   />
                         <TreeNode title='毛利' value='13'   />
                         <TreeNode title='提成' value='14'   />
                         <TreeNode title='销售提成' value='15'   />
                         <TreeNode title='施工提成' value='16'   />
                       </TreeNode>
                       {/* <TreeNode title='附加项目业绩' value='0-4'  selectable={false}  >
                         <TreeNode title='业绩' value='17'   />
                         <TreeNode title='提成' value='18'   />
                         <TreeNode title='销售提成' value='19'   />
                         <TreeNode title='施工提成' value='20'   />
                       </TreeNode>
                       <TreeNode title='充值卡业绩' value='0-5'  selectable={false}  >
                         <TreeNode title='业绩' value='21'   />
                         <TreeNode title='提成' value='22'   />
                       </TreeNode>
                       <TreeNode title='计次卡业绩' value='0-6'   selectable={false}  >
                         <TreeNode title='业绩' value='23'   />
                         <TreeNode title='毛利' value='24'   />
                         <TreeNode title='提成' value='25'   />
                       </TreeNode>
                      </TreeSelect>
                      选择员工
                      <Select
                        style={ {width:'320px',height:'40px',paddingLeft:'10px'  } }
                        mode="multiple"
                        placeholder="请选择员工"
                        size="large"
                        onChange={this.handleChange}
                        value={value}

                      >
                        {
                          staffName.map((item,idx)=>{
                            return <Option key={idx}  > { item } </Option>
                          })
                        }
                      </Select>
                      <span className={style.zl_Info} >  <i  className="iconfont icon-zhuyi" ></i>支持多人对比，最多3人</span>
                      <div className={style.zl_btnBox} >
                         { dateButton.map((item,i)=><Button style={{ height:'40px',width:'80px' }} disabled={(i===3&&this.state.tab===0)} key={i} onClick={this.dateChange.bind(this,i)}>{item}</Button>) }
                      </div>
                      <div className={style.zl_Printing_Content} id="printContent"  ref={ (printContent)=> this.printContent=printContent  }   ></div>
                      <ul className={style.zl_colorBoll} >
                         {
                           name.map((item,idx)=>{
                             return <li key={idx} >
                                      <span style={{ backgroundColor:color[idx] }} ></span>
                                      { item }
                                   </li>
                           })
                         }
                      </ul>
                   </div>
                </div> */}
        <MonthPicker
          defaultValue={moment()}
          size="large"
          style={{ marginBottom: "20px" }}
          onChange={this.monthOnchange.bind(this)}
        />
        <div className={style.zl_sec2}>
          <p>
            {" "}
            <i className={style.zl_blueD} />明细数据{" "}
          </p>
          <SuperTable timeSearch={timeSearch} />
        </div>
      </div>
    )
  }
}
export default connect()(performance)
