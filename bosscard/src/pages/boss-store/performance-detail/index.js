import React, { Component } from "react"
import { DatePicker, Button, Form ,Tabs  } from "antd"
import Table from './table'
import styles from '../revenue-summary/style.less'
import style from './style.less'
import { tableConfig  } from './tableConfig'
import moment from "moment"
import services from "services"
//时间筛选
const filterTime = a => {
  return moment(`${moment(a).format("YYYY-MM-DD")} 00:00:00`).unix()
}
//获得本月第一天
const getThisMonthFirstDay = () => {
    var date = new Date()
    date.setDate(1)
    return date
  }
  //获得本年第一天
const getThisYearFirstDay = () => {
    var currentDate = new Date()
    var currentYear = currentDate.getFullYear()
    var currentYearFirstDate = new Date(currentYear, 0, 1)
    return currentYearFirstDate
  }
const FormItem = Form.Item
const tabButton = ["今日", "本月", "本年"]
const TabPane = Tabs.TabPane
const { RangePicker } = DatePicker
const tabData=[
    {
       icon:'xiaoshoushuliang',
       color:'#1890FF',
       content:'销售数量',
       value:0,
    },
    {
       icon:'yejiyue',
       color:'#13C2C2',
       content:'业绩金额',
       value:0,
    },
    {
        icon:'chengben',
        color:'#2FC25B',
        content:'成本',
        value:0,
    },
    {
        icon:'maoli',
        color:'#FACC14',
        content:'毛利',
        value:0,
    },
]
class Detail extends Component{
    constructor(props){
        super(props)
        this.state={
            tab:0,
            timeSearch:{},
            tabData,
            noButtonClick:false, //用于控制按钮是否被点击
        }
    }
    tabButton=(tab)=>{
        let start, end
        let day = moment().format('YYYY-MM-DD')
        let days = day + ' 23:59:59'
        switch (tab) {
          case 0:
            start = moment(day).unix()*1000
            end = moment(days).unix()*1000
            break
          case 1:
            start = getThisMonthFirstDay()
            end = new Date()
            break
          case 2:
            start = getThisYearFirstDay()
            end = new Date()
            break
          default:
            return
        }
        this.setState({
          tab,
          timeSearch:{
            'completed[<>]':[Math.ceil(start/1000),Math.ceil(end/1000)],
          },
        },()=>{
            this.getData()
        })
    }
    //获取明细汇总数据
    getData=()=>{
        const { timeSearch } =this.state
        this.setState({
            noButtonClick:true,
        },()=>{
            services.typeCollectAchievement({
                keys: {name: 'wide-business/achievement/collect' },
                data:{ q:{ where:{  ...timeSearch    } } } ,
            }).then(res=>{
                if(res.code==='0'){
                    //数据整合
                    let { data } =res
                    const { tabData }=this.state
                    var newDataList=[...tabData].map((item,i)=>{
                        switch(i){
                            case 0 :
                            return {
                                ...item,
                                value:data.number,
                            }
                            case 1 :
                            return {
                                ...item,
                                value:data.output,
                            }
                            case 2 :
                            return {
                                ...item,
                                value:data.cost,
                            }
                            case 3 :
                            return {
                                ...item,
                                value:data.profit,
                            }
                            default:
                            return item
                        }
                    })
                    this.setState({
                        tabData:newDataList,
                        noButtonClick:false,
                    })
                }
            })
        })

    }
    handleSubmit = (value) => {
        let o = {}
        if(value.length===0){
          o["completed[<>]"] = [null,null]
        }else{
          o["completed[<>]"] = value.map(i => filterTime(i))
        }
        this.setState({
            timeSearch:{ ...o },
            tab:-1,
        },()=>{
            this.getData()
        })
    }
    UNSAFE_componentWillMount(){
        this.tabButton(0)
    }
    reset=()=>{
        this.props.form.resetFields()
        this.tabButton(0)
    }
    render(){
        const { tab ,timeSearch ,tabData,noButtonClick } = this.state
        const { getFieldDecorator } = this.props.form
        return <div className={styles.zl_Revenue_Summary} >
                    <div style={{ height: "40px", display: "flex", marginBottom: "34px" }}>
                            {tabButton.map((item, i) => (
                                <Button
                                key={i}
                                style={{
                                    width: "88px",
                                    height: "40px",
                                    marginRight: "24px",
                                    verticalAlign: "middle",
                                }}
                                onClick={this.tabButton.bind(this, i)}
                                loading={noButtonClick}
                                disabled={noButtonClick}
                                type={tab === i ? "primary" : null}
                                >
                                {item}
                                </Button>
                            ))}
                            <Form onSubmit={this.handleSubmit} layout="inline">
                                <FormItem>
                                {getFieldDecorator("created", {})(
                                    <RangePicker
                                    onChange={ this.handleSubmit  }
                                    size="large"
                                    style={{ width: "542px", height: "60px" }}
                                    />
                                )}
                                </FormItem>
                                {/* <FormItem>
                                <Button
                                    style={{ height: "40px", width: "88px" }}
                                    type="primary"
                                    htmlType="submit"
                                    loading={noButtonClick}
                                    disabled={noButtonClick}
                                >
                                    查询
                                </Button>
                                </FormItem>
                                <FormItem>
                                <Button
                                    style={{ height: "40px", width: "88px" }}
                                    onClick={this.reset}
                                >
                                    重置
                                </Button>
                                </FormItem> */}
                            </Form>
                    </div>
                    <div className={ style.zl_sec2 } >
                         <p> <i  className={ style.zl_blueD } ></i>汇总数据  </p>
                         <section className={styles.zl_Rs_one}>
                            <ul>
                                {tabData.map((item, i) => {
                                return (
                                    <li  key={i}  style={{ height:'147px' }} >
                                    <div style={{ overflow: "hidden" }}>
                                        <i
                                        style={{ float: "left", color: item.color }}
                                        className={`iconfont icon-${item.icon} `}
                                        />
                                        <div className={styles.zl_rs1_box}>
                                        <p style={{ border:'0 none'}} >{item.content}</p>
                                        <p style={{ border:'0 none'}} >{item.value}</p>
                                        </div>
                                    </div>
                                    </li>
                                )
                                })}
                            </ul>
                        </section>
                    </div>
                    <div className={ style.zl_sec2 } >
                         <p> <i  className={ style.zl_blueD } ></i>明细数据  </p>
                         <Tabs defaultActiveKey="0" onChange={this.changTab}>
                        {
                          tableConfig.map((item,idx)=><TabPane tab={item.name}  key={idx}  >
                                <Table
                                tableConfig={item}
                                timeSearch={timeSearch}
                                />
                          </TabPane>)
                        }
                        </Tabs>
                    </div>
              </div>
    }
}
export default Form.create()(Detail)
