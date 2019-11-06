import moment from "moment"

export default {
  hasCheck: false,
  id: "key",
  moreBtn: [
    {
      name: "打印",
      icon: "icon-dayin",
      type: 214,
    },
  ],
  headers: [
    {
      name: "服务顾问",
      prop: "counselorName",
      width: '150px',
      fixed: 'left',
    },
    {
      name: "单号",
      prop: "orderRecordNo",
      width: '190px',
      fixed: 'left',
    },
    {
      name: "车牌/车型/联系方式",
      prop: "licenseNo",
      width: '190px',
      fixed: 'left',
    },
    //-----------------goodsDetail:[]
    {
      name: "商品名称",
      prop: "title",
      width: '220px',
      className: 'table-padding0',
      render: e=>{
        let goodsDetail= e.goodsDetail || []
          return (
            goodsDetail.map((v,idx)=>{
              return (
                <div key={idx}
                  style={{margin:0,whiteSpace:'nowrap'}}
                  className={goodsDetail.length > 1 ? 'ainier-table-item' :'jishu-table-item '}
                >
                  {v.title}
                </div>
              )
            })
          )
      },
    },
    {
      name: "规格",
      prop: "specification",
      width: '140px',
      className: 'table-padding0',
      render: e=>{
        let goodsDetail = e.goodsDetail || []
        return (
          goodsDetail.map((v,idx)=>{
            return (
              <div key={idx}
                  style={{margin:0,whiteSpace:'nowrap'}}
                  className={goodsDetail.length > 1 ? 'ainier-table-item' :'jishu-table-item '}
                >
                  {v.specification}
              </div>
            )
          })
        )
      },
    },
    {
      name: "所属分类",
      prop: "categoryName",
      width: '150px',
      className: 'table-padding0',
      render: e=>{
        let goodsDetail = e.goodsDetail || []
        return (
          goodsDetail.map((v,idx)=>{
            return (
              <div key={idx}
                  style={{margin:0,whiteSpace:'nowrap'}}
                  className={goodsDetail.length > 1 ? 'ainier-table-item' :'jishu-table-item '}
                >
                  {v.categoryName}
              </div>
            )
          })
        )
      },
    },
    {
      name: "数量",
      prop: "number",
      width: '140px',
      className: 'table-padding0',
      render: e=>{
        let goodsDetail = e.goodsDetail || []
        return (
          goodsDetail.map((v,idx)=>{
            return (
              <div key={idx}
                  style={{margin:0,whiteSpace:'nowrap'}}
                  className={goodsDetail.length > 1 ? 'ainier-table-item' :'jishu-table-item '}
                >
                  {v.number}
              </div>
            )
          })
        )
      },
    },
    {
      name: "金额",
      prop: "totalPrice",
      width: '140px',
      className: 'table-padding0',
      render: e=>{
        let goodsDetail = e.goodsDetail || []
        return (
          goodsDetail.map((v,idx)=>{
            return (
              <div key={idx}
                  style={{margin:0,whiteSpace:'nowrap'}}
                  className={goodsDetail.length > 1 ? 'ainier-table-item' :'jishu-table-item '}
                >
                  {v.totalPrice}
              </div>
            )
          })
        )
      },
    },
    {
      name: "毛利",
      prop: "profit1",
      width: '140px',
      className: 'table-padding0',
      render: e=>{
        let goodsDetail = e.goodsDetail || []
        return (
          goodsDetail.map((v,idx)=>{
            return (
              <div key={idx}
                  style={{margin:0,whiteSpace:'nowrap'}}
                  className={goodsDetail.length > 1 ? 'ainier-table-item' :'jishu-table-item '}
                >
                  {v.profit}
              </div>
            )
          })
        )
      },
    },
    {
      name: "销售人员",
      prop: "sellStaff",
      width: '190px',
      className: 'table-padding0',
      render: e=>{
        let goodsDetail = e.goodsDetail || []
        return (
          goodsDetail.map((v,idx)=>{
            return (
              <div key={idx}
                  style={{margin:0,whiteSpace:'nowrap'}}
                  className={goodsDetail.length > 1 ? 'ainier-table-item' :'jishu-table-item '}
                >
                  {v.sellStaff}
              </div>
            )
          })
        )
      },
    },
    {
      name: "施工人员",
      prop: "constructStaff",
      width: '190px',
      className: 'table-padding0',
      render: e=>{
        let goodsDetail = e.goodsDetail || []
        return (
          goodsDetail.map((v,idx)=>{
            return (
              <div key={idx}
                  style={{margin:0,whiteSpace:'nowrap'}}
                  className={goodsDetail.length > 1 ? 'ainier-table-item' :'jishu-table-item '}
                >
                  {v.constructStaff}
              </div>
            )
          })
        )
      },
    },
    {
      name: "计次卡扣",
      prop: "recordCardConsume",
      width: '150px',
      className: 'table-padding0',
      render: e=>{
        let goodsDetail = e.goodsDetail || []
        return (
          goodsDetail.map((v,idx)=>{
            return (
              <div key={idx}
                  style={{margin:0,whiteSpace:'nowrap'}}
                  className={goodsDetail.length > 1 ? 'ainier-table-item' :'jishu-table-item '}
                >
                  {v.recordCardConsume}
              </div>
            )
          })
        )
      },
    },
    {
      name: "计次卡卡号",
      prop: "recordCardNo",
      width: '190px',
      className: 'table-padding0',
      render: e=>{
        let goodsDetail = e.goodsDetail || []
        return (
          goodsDetail.map((v,idx)=>{
            return (
              <div key={idx}
                  style={{margin:0,whiteSpace:'nowrap'}}
                  className={goodsDetail.length > 1 ? 'ainier-table-item' :'jishu-table-item '}
                >
                  {v.recordCardNo}
              </div>
            )
          })
        )
      },
    },
    //----------------------goodsDetail:[]
    {
      name: "实收",
      prop: "receipts",
      width: '140px',
    },
    {
      name: "成本",
      prop: "cost",
      width: '140px',

    },
    {
      name: "毛利",
      prop: "profit",
      width: '140px',
    },
    {
      name: "充值卡扣",
      prop: "speciesCardConsume",
      width: '150px',
    },
    {
      name: "充值卡卡号",
      prop: "speciesCardNo",
      width: '190px',
    },
    //-----------支付方式 payment:[{id:'',name:'',money:''}]

    //---------------支付方式-----------------------------
    {
      name: "优惠金额",
      prop: "discount",
      width: '150px',
    },
    {
      name: "本次里程",
      prop: "mileage",
      width: '150px',
    },
    {
      name: "结算时间",
      prop: "completed",
      width: '190px',
      render: c => {
        return moment(c.completed * 1000).format("YYYY-MM-DD HH:mm:ss")
      },
    },
    {
      name: "创建时间",
      prop: "created",
      width: '190px',
      render: c => {
        return moment(c.created * 1000).format("YYYY-MM-DD HH:mm:ss")
      },
    },
    {
      name: "业务来源",
      prop: "origin",
      width: '150px',
      render: c => {
        return (
          c.origin==='1' ? 'PC端' : '小程序'
        )
      },
    },
    {
      name: "结算人",
      prop: "settlement",
      width: '140px',
    },
    {
      name: "备注",
      prop: "remark",
      width: '190px',
    },
  ],
  isScroll: true,
  hasTotal: true,
  screen: {
    col: 5,
    rules: [
      {
        type: 'text',
        prop: 'title,clientName,orderRecordNo,speciesCardNo,licenseNo',
        placeholder: '商品名称/客户名称/单号/卡号/车牌号',
      },
      {
        type: 'list',
        label: '支付方式',
        placeholder: '全部',
        prop: 'paymentType',
        list: [],
      },
      {
        type: 'list',
        label: '维修类型',
        placeholder: '全部',
        prop: 'maintainTypeId',
        list: [],
      },
      {
        type:'date<>',
        prop: 'completed',
      },
    ],
  },
}
