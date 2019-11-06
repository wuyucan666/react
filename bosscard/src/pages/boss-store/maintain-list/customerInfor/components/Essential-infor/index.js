import { connect } from "dva"
import { Component } from "react"
import  styles  from './styles.less'
// import tip from "../images/tip.png"
import man from "./man.jpg"
import woman from "./woman.jpg"
import { Button, Spin } from "antd"
import BigPic from "./openpic.js"
import services from 'services'
import moment from 'moment'
import EditClient from '../EditClient'
import router from 'umi/router'



class Essential extends Component {
  state = {
    loading: false,
    Alldata:{},
    picIndex:0,
    showbox: false,
    changePic: [],
    clientTag:[],
    showEdit: false,
  }
  componentDidMount(){
    this.getData()
  }
  getData = () => {
    this.setState({loading: true})
    const { clientId  } = this.props
    services.essyinformation({ data: {clientId: clientId} }).then(res=>{
      this.setState({loading: false})
      if(res.success){
        this.setState({
          Alldata: {...res.list[0]},
          clientTag :res.list[0].label,
        },()=>{
          console.log(this.state.Alldata)
        })
      }
    }).catch(() => {
      this.setState({loading: false})
    })
  }
  showBigPic = (e) => {
    this.setState({
      picIndex: e,
      showbox: true,
      changePic: this.state.Alldata.licensePic,
    })
  }
  showBigPicother = (e) => {
    this.setState({
      picIndex: e,
      showbox: true,
      changePic: this.state.Alldata.otherPic,
    })
  }
  onBoxshow = () => {
    this.setState({
      showbox: false,
    })
  }
  editData = () => {
    this.setState({
      showEdit: true,
    })
  }
  onCancel = () => {
    this.setState({
      showEdit: false,
    })
  }
  onOk = () => {
    this.setState({
      showEdit: false,
    },() => {
      this.getData()
    })
  }
  giveStates=(stage)=>{
    console.log(stage,'0000')
    switch(stage*1){
      case 1:
      return '吸客'
      case 2:
      return '养客'
      case 3:
      return '黏客'
      case 4:
      return '升客'
      case 0:
      return '暂无数据'
      default:
      return
    }
  }
  goReturn(id){
    router.push(`/boss-store/return-visit/visit-already?clientId=${id}`)
  }
  render() {
    const {showEdit, loading} = this.state
    const {clientId , isRequsetList } = this.props
    // console.log(isRequsetList,'绝壁')
    return (
      <Spin spinning={loading}>
        <div className={styles.detailsdiv}>
          {
            showEdit ? (
              <EditClient
                clientId={clientId}
                onOk={this.onOk}
                onCancel={this.onCancel}
                isRequsetList={isRequsetList?true:false}
              />
            ):(
              <div>
                <div className={styles.contenttop}>
                  <div className={styles.yc_tip}>
                    <img src={this.state.Alldata.sex === 1 ? man : woman} alt=''  style={{width:'46px',height:'46px',float:'left',borderRadius:'50%'}}/>
                    <div className={styles.nameDiv}>
                      <span>{this.state.Alldata.pName}</span>
                      <span>{this.state.Alldata.clientType === 1 ? '个人' : '单位'}</span>
                    </div>
                    <div className={styles.teldiv}>
                      <span className='iconfont icon-shouji' style={{ color:'#4AACF7' }} ></span>
                      <span>{this.state.Alldata.tel}</span>
                    </div>
                    <div className={styles.sexdiv}>
                      <span className='iconfont icon-xingbie' style={{ color:'#4AACF7' }} ></span>
                      <span>{this.state.Alldata.sex === 1 ? '男' : '女'}</span>
                    </div>
                    <div className={styles.seediv}>
                      <span className='iconfont icon-jifen' style={{ color:'#4AACF7' }}  ></span>
                      <span>{this.state.Alldata.integral}</span>
                    </div>
                    <div className={styles.seediv} onClick={this.goReturn.bind(this,clientId)}>
                      <span className={styles.return_records}>回访记录</span>
                    </div>
                    <div className={styles.biaoqianDiv} >
                      {
                        this.state.clientTag.map(i=><span  key={ i } >{i.name}</span>)
                      }
                    </div>
                  </div>
                  { this.state.Alldata.stage !== 0 ?
                    <div className={styles.yc_cont}>
                      <span className='iconfont icon-huiyuanjieti'  style={{float:'left',fontSize:'40px',height:'50px',color:'#EBF5FF',marginLeft:'4px'}}/>
                      <div className={styles.yc_client}>
                        <span className={styles.yc_clienttype}>{  this.giveStates(this.state.Alldata.stage) } { this.state.Alldata.mark === 1 ? <span>·待升卡</span> : null }</span>
                        <p className={styles.yc_mubiao}>
                          <span><span className={styles.yc_mubiaoleft}>目标：</span><span className={styles.yc_mubiaoright}>培养顾客认同（服务好，效果好）;</span></span>
                          <span style={{marginLeft:'10px'}}><span className={styles.yc_mubiaoleft}>指南：</span><span className={styles.yc_mubiaoright}>对顾客进行持续追踪，预约顾客下次到店，防止顾客流失，设置8个左右认同点，让顾客多方面不断认可;</span></span>
                          <span style={{marginLeft:'10px'}}><span className={styles.yc_mubiaoleft}>关键指标：</span><span className={styles.yc_mubiaoright}>服务满意度，顾客回头率，到店频次。</span></span>
                        </p>
                      </div>
                    </div>
                    : null
                  }
                </div>
                {/* --------content----------- */}
                <div className={styles.cpContent}>

                  <div className={styles.left}>
                    <div>
                      <p>累计消费金额:<span>￥{this.state.Alldata.cumulativeMoney}</span></p>
                      <p>单次消费金额￥{this.state.Alldata.singleConsumption}，挂账:<span style={{marginLeft:'10px'}}>￥{this.state.Alldata.buyingOn}</span></p>
                    </div>
                    <div>
                      <p>客户来源:<span>{this.state.Alldata.customerSource}</span></p>
                      <p>客户状态:<span>{this.state.Alldata.customerStatus === 1 ? '开启' : '关闭'}</span></p>
                      <p>客户生日:<span>{this.state.Alldata.customerBir === 0 ? '' : moment(this.state.Alldata.customerBir*1000).format("YYYY-MM-DD")}</span></p>
                    </div>
                    <div>
                      <p>驾驶证照:</p>
                      {this.state.Alldata.licensePic ?
                        <div>
                          {
                            this.state.Alldata.licensePic.map((v,index) => {
                              return <div key={index}><span><i onClick={this.showBigPic.bind(this, index)} className="iconfont icon-chakan1" /></span><img alt=''  src={v.requestAddress}/></div>
                            })
                          }
                        </div>
                        : ''
                      }
                    </div>
                  </div>

                  <div className={styles.center}>
                    <div>
                      <p>累计进店次数:<span>{this.state.Alldata.enteringShopsNum}</span></p>
                      <p>最近一次<span>{this.state.Alldata.lastTime ? moment(this.state.Alldata.lastTime * 1000).format('YYYY-MM-DD') : ''}</span>，距今天<span>{this.state.Alldata.distanceDay}</span>天</p>
                    </div>
                    <div>                   
                      <p>身份证号:<span>{this.state.Alldata.idCard}</span></p>
                        <p>客户住址:<span title={this.state.Alldata.customerAddress}>{this.state.Alldata.customerAddress}</span></p>
                        <p>备&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;注:<span>{this.state.Alldata.remark}</span></p>
                    </div>
                    <div>
                      <p>其他图片:</p>
                      {this.state.Alldata.otherPic ?
                        <div>
                          {
                            this.state.Alldata.otherPic.map((v,index) => {
                              return <div key={index}><span><i onClick={this.showBigPicother.bind(this, index)} className="iconfont icon-chakan1" /></span><img alt=''  src={v.requestAddress}/></div>
                            })
                          }
                        </div>
                        : ''
                      }
                    </div>
                  </div>

                  <div className={styles.right}>
                    <div>
                      <p>账户余额:<span>￥{this.state.Alldata.accountBalance}</span></p>
                      <p>计次卡:<span>{Number(this.state.Alldata.projectCard)}</span></p>
                      {/* <p>优惠券:<span>{this.state.Alldata.Coupon}</span></p> */}
                    </div>
                    <div>
                      <p>所在单位:<span>{this.state.Alldata.belongsUnit}</span></p>
                      <p>单位地址:<span title={this.state.Alldata.untiAddress}>{this.state.Alldata.untiAddress}</span></p>                   
                    </div>
                  </div>
                </div>
                {this.state.showbox && <BigPic onBox={this.onBoxshow} indexs={this.state.picIndex} list={this.state.changePic}/>}

                <div className={styles.btns}>
                  <Button size='large' style={{width: 88}} onClick={this.editData} type="primary">编辑</Button>
                </div>
              </div>
            )
          }
        </div>
      </Spin>
    )
  }
}
function mapStateToProps() {
  return {}
}
export default connect(mapStateToProps)(Essential)
