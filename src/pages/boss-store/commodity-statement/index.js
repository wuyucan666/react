import React,{Component} from 'react'
import { connect } from 'dva'
import styles from './index.less'
import CommonTable from 'components/CommonTable/index'
import tableConfig from './tableConfig'
import service from 'services'



class commodity extends Component{
    constructor(){
      super()
      this.state = {
         tableConfig:tableConfig,
         isShow:false,
      }
      this.renderTable=this.renderTable.bind(this)
      this.length=0
    }


    componentDidMount () {
      this.renderTable()
    }
    //打印
    onTableChange = (e) => {
      console.log(e)
    }
    async renderTable(){
       await  service.LIST({keys: {name: 'store/clientcard/paytype'},data: {q: {where: {type:'1'}}}}).then(res => {
        if(res.success) {
          res.data || []
          tableConfig.screen.rules[1].list = res.data.map(v => {
            return {
              name: v.name,
              value: v.value,
            }
          })
          tableConfig.screen.rules[1].list.push({name: '全部', value: -1})
          let o = res.data.map((v)=> {
            return {
              name: v.name,
              prop: v.prop,
              width: '140px',
              className: 'table-padding0',
              render: e=>{
                let payment = e.payment || []
                  return (
                    payment.map((item,idx)=>{
                      return (
                        item.id===v.value ?
                          (<div key={idx}
                              style={{margin:0,whiteSpace:'nowrap'}}

                            >
                              {item.money}
                          </div>) : null
                      )
                    })
                  )
              },
            }
          })
          this.length=o.length
          o.forEach(item=>{
            tableConfig.headers.splice(18,0,item)
          })

        }
      })
       //维修类型
      await service.LIST({keys: {name: 'brand/maintaintype'}}).then(res => {
        if(res.success) {
          res.list || []
          tableConfig.screen.rules[2].list = res.list.map(v => {
            return {
              name: v.name,
              value: v.maintainTypeId,
            }
          })
          tableConfig.screen.rules[2].list.push({name: '全部', value: -1})
        }
      })
      //单号
      tableConfig.headers[1].render = (e) => {
          return (
          <a
            style={{fontFamily:'MicrosoftYaHei',color:'#4AACF7'}}
            onClick={()=>{
              const {dispatch,history,match} = this.props
              dispatch({
                type: "maintianList/goDetail",
                payload: { orderId: e.orderRecordNo, orderType: e.orderType , path:match.path, isHideDetailBtns: true, },
              })

              history.push("/boss-store/maintain-list/orderAll")

            }}
          >{e.orderRecordNo}</a>
          )
      }
      //车牌/车型/联系方式
      tableConfig.headers[2].render = (e) => {
          return (<div>
            <p style={{margin:0}}>{e.licenseNo} &nbsp;&nbsp;{e.cateName}</p>
            <a
              style={{fontFamily:'MicrosoftYaHei',color:'#4AACF7',margin:0,whiteSpace:'nowrap'}}
              onClick={() => {
                const {dispatch,history ,match} = this.props
                dispatch({
                  type: "maintianList/goDetail",
                  payload: { orderId: e.orderRecordNo, orderType: e.orderType ,goClient:true , path:match.path,isHideDetailBtns: true, },
                })
                history.push({
                  pathname:"/boss-store/maintain-list/orderAll",
                  state: { clientId
                    : e.clientId },
                })

              }}
            >{e.clientName} ({e.phone})</a>
          </div>)
      }


      this.setState({ tableConfig ,isShow:true })


    }

    componentWillUnmount(){
      const { length } = this
      tableConfig.headers.splice(18,length)
    }

    //进入表格数据,加个唯一标识key
    changeDate = (e) => {
      e || []
      return e.map((v,idx) => ({...v, key:idx}))
    }

    render(){
       const { tableConfig ,isShow } =this.state
        console.log(tableConfig,'1111111111111111111111111111')
      return  (<div className="wyc_box">
               { isShow ?
                ( <CommonTable
                  name='wide-detail/order/wide/list'
                  onTableChange={this.onTableChange}
                  onDataChangeBefore={this.changeDate}
                  tableConfig={tableConfig}
                  className={styles.wyc_box}
                  scroll={{ x: 4939 }}
                  New
                >
                </CommonTable>)
                :
                 null
                }
              </div>
              )
    }

}

export default connect()(commodity)
