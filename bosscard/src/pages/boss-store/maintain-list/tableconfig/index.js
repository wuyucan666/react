import moment from "moment"
import { styles } from '../styles.less'
const tableConfig= {
  hasCheck: false,
  id: "key",
  moreBtn: [],
  headers: [
    {
      name: "订单号",
      prop: "orderId",
      width: "7%",
      render:(record)=>(
            <div>
                <p> {record.orderId}</p>
                { record.orderType===3 ?<p> <span className={ styles.zl_wxList } >维修</span> { record.isB===1 ? <span className={ styles.zl_Blist } >B</span>:null } </p> :null }
                { record.orderType===4 ?<p> <span className={ styles.zl_KjList } >快捷</span> { record.isB===1 ? <span className={ styles.zl_Blist } >B</span>:null } </p> :null }
            </div>
      ),
    },
    {
      name:'下单日期',
      prop:'created',
      width:'7%',
      render:(record)=>(
        <span> {  record.created===0 ?'' : moment(record.created * 1000).format("YYYY-MM-DD HH:mm:ss") } </span>
      ),
    },
    {
      name: "车牌/车型/联系方式",
      prop: "carNum",
      width: "11%",
      render:(record)=>(
        <div>
            <p>{ record.carNum }&nbsp;&nbsp;{ record.carType }</p>
            <p> { record.clientName } ({record.phone })  </p>
        </div>
      ),
    },
    {
      name: "项目信息/产品信息",
      prop: "project",
      width: "13%",
      render:(record)=>(
        <div   className={ styles.zl_projectProduct }    style={{ overflow:'hidden' }} >
        { record.project && record.project.map((item,i)=>{
              return  <p  style={{ marginBottom:0 }}  key={i} > 项目 ：<Tooltip title={ item.name } >  { item.name.slice(0,3) } </Tooltip> &times;{ item.number }    {!item.payment||'('+item.payment+')' }</p>
         }) }
         {
           record.product && record.product.map((item,i)=>{
               return <p style={ {marginBottom:0 } } key={i} > 产品 ：<Tooltip title={ item.name } > { item.name.slice(0,3) }</Tooltip> &times;{ item.number } { item.status===1 ?  <span className={ styles.zl_circle } ></span> :  <span className={ styles.zl_circle } style={{ backgroundColor:'rgba(255,89,106,1 )' }} ></span> } </p>
           })
         }

        </div>
      ),
    },
    {
      name: "出库状态",
      prop: "state",
      width: "7%",
      render:(record)=>(
        <p>
            { record.state===3 ? <span >已出库</span> : null  }
            { record.state===2 ? <span style={{ color:'#ff596a' } } >部分出库</span> : null }
            { record.state===1 ? <span style={{ color:'#ff596a' } } >未出库</span> : null }
            { record.state===0 ? <span  >--</span> : null }
        </p>
      ),
    },
    {
			name: '编码',
      prop: 'commodityCode',
      render:(record)=>(
        <div>
          {record.product && record.product.map((v, index) => <div key={index}>{v.commodityCode}</div>)}
        </div>
      ),
			width: '10%',
	  },
    {
      name: "金额",
      prop: "price",
      width: "9%",
      render:(record)=>(
        <div>
            <p>{ record.price * 1 === 0 ? '--' : record.price   }</p>
            <p> { record.productPrice*1===0 ? '' :   `（产品金额：${ record.productPrice }）  `  } </p>
        </div>
      ),
    },
    {
      name:'完成时间',
      prop:'paytime',
      width:'7%',
      render:(record)=>(
        <span> { record.paytime*1===0 ? '' :  moment(record.paytime * 1000).format("YYYY-MM-DD HH:mm:ss") } </span>
      ),
    },
    {
      name:'结算/销账时间',
      prop:'completed',
      width:'7%',
      render:(record)=>(
        <span> { record.completed*1===0?'' :  moment(record.completed * 1000).format("YYYY-MM-DD HH:mm:ss") } </span>
      ),
    },
    {
      name: "操作人",
      prop: "person",
      width: "7%",
      render:(record)=>(
        <div>
            <p> 接车 ：{  record.carPerson }</p>
            <p> 结算 ： { record.payPerson  } </p>
        </div>
      ),
    },
    {
      name:'支付方式',
      prop:'payType',
      width:'6%',
    },
    {
      name: "备注",
      prop: "remark",
      render: (record)=>(
        <div>
        <Tooltip title={ record.remark }>
          <span className={ styles.zl_tableRemark } >{ record.remark.slice(0,10) }</span>
        </Tooltip>
      <div className={ styles.zl_iconBox } style={ { float:'right' } } >
      <Tooltip title='详情'>
          <i onClick={ this.detailShow.bind(this,record.orderId) } style={ { marginLeft:"12px"} } className="iconfont icon-xiangqing" ></i>
      </Tooltip>
      <Tooltip title='编辑'>
          <i   style={ { marginLeft:"12px"} } className="iconfont icon-bianji" onClick={() => this.updateOrder(record.id, record.type)} > </i>
      </Tooltip>
      </div>
   </div>
      ),
    },
  ],
  screen: {
    query: {  state :[1,3]  },
    rules: [
      {
        type: "text",
        prop: "licenseNo,clientName,goodsName",
        placeholder: "车牌/客户姓名/商品",
      },
      {
        type: "date<>",
        prop: "completed",
      },
    ],
  },
}
