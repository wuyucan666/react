import moment from "moment"
import { data } from '../maintain-billing/cacheData'

const renderCarProblem = (row) => {
  // 常规车检
  let functions = row.function || []
  let appearance = row.appearance || []
  let funArr = functions.map(item=>{
    return item.text
  })
  let AppArr = appearance.map(item=>{
    var value=item.value
      .map((item,idx)=>{
         return idx === 0 ? item : '/'+item
      }).join('')
      if(item.position*1===1){
        return '车身右侧-' + value
      }else if(item.position*1===2){
        return '车身左侧-' + value
      }else if(item.position*1===3){
        return '车顶-' + value
      }else if(item.position*1===4){
        return  '车头-' + value
      }else if(item.position*1===5){
        return  '车尾-' + value
      }
  })

  // 36项检查
  let cont = row.security || []
  let index=[]
  cont
  .forEach((item)=>{
     data
      .forEach(i=>{
          if(item.index === i.index){
              item['carType'] = i.carType
              item['type'] = i.type
              item['project'] = i.project
          }
      })
  })
  cont
  .forEach(i=>{
      index.indexOf(i.carType) >= 0 ? null : index.push(i.carType)
  })

  let checkOne = [...funArr,...AppArr]

  let checkTwo = index
  // console.log(checkOne,checkTwo)
  return (
    <div>
      {
        checkOne.map((v,i)=>{
          return <div key={i}>{v}</div>
        })
      }
      {
        checkTwo.map((item,i)=>{
          return  <span key={ i } >
                {  cont.filter(o=>o.carType === item&&o.result!==1 ).map((v,i)=><div key={i}>{ v.project }</div>) }
            </span>
        })
      }
    </div>
  )
}


const tableConfig = {
  hasCheck: false,
  id: "key",
  moreBtn: [],
  screen: {
    col: 3,
    query: {},
    rules: [
      {
        type: "text",
        placeholder: "会员名称/联系电话/车牌号",
        prop: "clientName,clientPhone,licenseNo",
      },
      {
        type: "date<>",
        prop: "created",
        label: "开单时间",
      },
    ],
  },
  headers: [
    {
      name: "开单时间",
      prop: "createdAt",
      width: "12%",
      render: (record) => (
        <div>
          {
            record.createdAt === 0
            ? ""
            : <span>{moment(record.createdAt * 1000).format("YYYY-MM-DD HH:mm")}</span>
          }
        </div>
      ),
    },
    {
      name: "车辆",
      prop: "licensePlate",
      width: "8%",
      render: (record) => (
        <div>{record.licensePlate}</div>
      ),
    },
    {
      name: "车型",
      prop: "vehicleType",
      width: "8%",
      render: (record) => (
        <div>{record.vehicleType}</div>
      ),
    },
    {
      name: "车主",
      prop: "clientName",
      width: "7%",
      render: (record) => (
        <div>{(record.isIndividual*1===0&&record.clientName==='')?'-':record.clientName}</div>
      ),
    },
    {
      name: "车检类型",
      prop: "type",
      width: "14%",
      render: (record) => (
        <div>
          {
            (record.function.length>0 || record.appearance.length>0 || record.items.length>0) && <span>常规车检</span>
          }
          {
            (record.function.length>0 || record.appearance.length>0 || record.items.length>0)&&(record.security.length>0)&&('、')
          }
          {
            record.security.length>0 && <span>36项检查</span>
          }
        </div>
      ),
    },
    {
      name: "车检问题",
      prop: "carproblem",
      width: "24%",
      render: (record) => (
        <div>
          {
            renderCarProblem(record)
          }
        </div>
      ),
    },
    {
      name: "订单号",
      prop: "orderNo",
      width: "14%",
      render: (record) => (
        <div>{record.orderNo}</div>
      ),
    },
    {
      name: "操作",
      prop: "edit",
      width: "7%",
    },
  ],
}

export default tableConfig
