// const Mock = require('mockjs')

const detailList=[
    {
     id:1,
     name:'早班',
     startTime:'09:00',
     endTime:'15:00',
     time:'6小时0分',
     workDays:'1',
     moneyDays:'1',
     remark:'',
    },
    {
    id:2,
    name:'休息',
    startTime:'09:00',
    endTime:'15:00',
    time:'0小时0分',
    workDays:'1',
    moneyDays:'1',
    remark:'',
    },
    {
    id:2,
    name:'缺勤',
    startTime:'09:00',
    endTime:'15:00',
    time:'0小时0分',
    workDays:'1',
    moneyDays:'1',
    remark:'系统默认',
    },
    {
    id:3,
    name:'无薪假',
    startTime:'09:00',
    endTime:'15:00',
    time:'0小时0分',
    workDays:'1',
    moneyDays:'1',
    remark:'系统默认',
    },
    {
    id:2,
    name:'有薪假',
    startTime:'09:00',
    endTime:'15:00',
    time:'0小时0分',
    workDays:'1',
    moneyDays:'1',
    remark:'系统默认',
    },
]
module.exports = {
    [`GET /store/classManagement`](req, res) {
      res.status(200).json({
        code: 0,
        list: detailList,
      })
    },
}    