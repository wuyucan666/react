import { Component } from "react"
// import router from "umi/router"
import { Button,  Table,Empty } from "antd"
import moment from "moment"
import styles from "./index.less"
import services from "../../../services"

class Detail extends  Component {
    constructor(props) {
      super(props)
      this.state = {
        loading: false,
        details:{},
        detailItem:{},
      }
    }

    componentDidMount(){
      const {  detailItem } = this.props
      console.log('detailItem',this.props)
      if(!(JSON.stringify(detailItem) === "{}")){
        services
          .LIST({
            keys: { name: 'refill/renewal/details/' + detailItem.orderId },
            method:'get',
          })
          .then(res => {
            if (res.code === '0') {
              this.setState({
                details: {
                  ...res.data,
                  orderId: detailItem.orderId,
                  cardId:res.data.id,
                },
              })
            }
          })
      }
    }

    render() {
      const { hideModal, onTableChange } = this.props
      const { details } = this.state
      const giveColumns = [
        {
          title: '序号',
          dataIndex: 'order',
          key: 'order',
          width:'20%',
        },
        {
          title: '类型',
          dataIndex: 'type',
          key: 'type',
          width:'20%',
        },
        {
          title: '服务',
          dataIndex: 'serve',
          key: 'serve',
          width:'40%',
        },
        {
          title: '数量',
          dataIndex: 'num',
          key: 'num',
          width:'20%',
        },
      ]

      const giveData = [ ]
      details && details.give && details.give.forEach((v,idx)=>{
        let obj = {
          key : v.id,
          order : idx+1,
          type : v.type === 1? '项目': '产品',
          serve:v.name,
          num:v.num === -1? '无限': v.num,
        }
        giveData.push(obj)
      })

      return (
        <div className={styles.pigeon}>
          <div className={styles.center_div}>
            <div className={styles.title}>
              <span></span>{details.card && details.card.name}<em>{`（续卡：${details.cardNo}）`}</em>
              <div>
                <Button type='primary' onClick={onTableChange.bind(this,24,details)} size='large'>打印结算单</Button>
                <Button onClick={onTableChange.bind(this,18,details)} size='large'>作废</Button>
                <Button onClick={hideModal.bind(this)} size='large'>返回上一级</Button>
              </div>
            </div>
            <div className={styles.c_top}>
              <ul>
                <li>会员姓名：<span style={{color:'#4AACF7'}}>{details.clientName}</span></li>
                <li>联系电话：<span>{details.phone}</span></li>
                <li>绑定车辆：<span style={{width:'85%',display:'inline-block',verticalAlign:'top'}}>{details.card && details.card.car? details.card.car: '无'}</span></li>
              </ul>
              <ul>
                <li>操作人员：<span>{details.optName}</span></li>
                <li>提成人员：<span>{details.card && details.card.staff}</span></li>
                {/* <li>办卡时间：<span>{moment(details.created * 1000).format('YYYY-MM-DD')}</span></li> */}
                <li>有效期至：<span>{(details.card && details.card.deadlineTime === -1)? '无限期' : moment(details.card && details.card.deadlineTime * 1000).format('YYYY-MM-DD')}</span></li>
              </ul>
              <ul className={styles.ul_Right}>
                <li>续卡前余额：<span>￥{details.card && details.card.before}</span></li>
                <li>续卡金额：<span>￥{details.card && details.card.renewal}</span></li>
                <li>赠送金额：<span>￥{details.card && details.card.give}</span></li>
                <li>续卡后余额：<span>￥{details.card && details.card.balance}</span></li>
              </ul>
            </div>
            <div className={styles.c_top} style={{paddingTop:'24px',border:'none'}}>
              <ul style={{width: '80%'}}>
                <li>结算方式：<span>{details.payment && details.payment.name}</span></li>
                <li style={{display:details.remark?'':'none'}}>备注信息：<span>{details.remark}</span></li>
              </ul>
              <ul className={styles.money}>
                <li>实收金额：<span>￥{details.payment && details.payment.money}</span></li>
              </ul>
            </div>
          </div>
          <div className={styles.center_div}>
            <div className={`${styles.title} ${styles.title1}`}>
              <span></span>赠送信息
            </div>
            <Table
              columns={giveColumns}
              dataSource={giveData?giveData:`${<Empty/>}`}
              pagination={false}
              rowClassName={styles.center_div}
            />
          </div>
        </div>
      )
    }
}

export default Detail
