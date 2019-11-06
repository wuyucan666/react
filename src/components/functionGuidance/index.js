import React,{ Component } from 'react'
import router from 'umi/router'
import {Modal ,Button } from 'antd'
import styles from './style.less'
import guide_ai from './images/guide_ai.png'
import { connect } from 'dva'


class index extends Component{
    constructor(){
        super()
        this.state={
          current: 0,

        }

    }

    componentDidMount(){
      const {current} = this.props.guidance.guidance
      this.setState({
        current,
      })
    }

    handleCancel=()=>{
      this.props.changeModal()
    }

    prev=()=>{
      const current = this.state.current - 1
      this.setState({ current })
      const {dispatch} = this.props
      dispatch({
        type:'guidance/save',
        payload: current,
      })
    }

    next=()=>{
      const {dispatch} = this.props
      const current = this.state.current + 1
      this.setState({ current })
      dispatch({
        type:'guidance/save',
        payload: current,
      })
      if(current===5){
        this.handleCancel()
        dispatch({
          type:'guidance/save',
          payload: 0,
        })
      }
    }

    gotoSet=()=>{
      router.push('/boss-brand/index')
      this.props.changeModal()
    }

    render(){
        const {isModal} = this.props
        const { current } = this.state
        console.log('current',current,isModal)
        return (
          <div>
            <Modal
              title="流程设置"
              width='900px'
              visible={isModal}
              onCancel={this.handleCancel}
              footer={null}
              style={{position:'relative'}}
              >
                  <div className={styles.wyc_div}>
                      <ul className={styles.wyc_ul}>
                          <li>
                              <span className={current===0?styles.wyc_defalut:styles.wyc_active} >
                                  {current===0?<i className="iconfont icon-jichushezhi" />:<i className="iconfont icon-qiyong" />}
                              </span>
                              <span className={current===0?styles.wyc_defalut:styles.wyc_active} style={{marginLeft:'5px'}}>基础设置</span>
                              <span style={{float:"right"}}> <i className="iconfont icon-zuoxiangjiantou" style={{color:'#ccc'}}/> </span>
                          </li>
                          <li>
                              <span className={current===1?styles.wyc_defalut:(current>1?styles.wyc_active:null)}>
                                  {current===1?<i className="iconfont icon-shangpin"></i>:<i className="iconfont icon-shangpin" />}
                              </span>
                              <span className={current===1?styles.wyc_defalut:(current>1?styles.wyc_active:null)} style={{marginLeft:'5px'}}>商品设置</span>
                              <span style={{float:"right"}}> <i className="iconfont icon-zuoxiangjiantou" style={{color:'#ccc'}}/> </span>
                          </li>
                          <li>
                              <span className={current===2?styles.wyc_defalut:(current>2?styles.wyc_active:null)}>
                                  {current===2?<i className="iconfont icon-chuangjianhuiyuanqia"></i>:<i className="iconfont icon-chuangjianhuiyuanqia" />}</span>
                              <span className={current===2?styles.wyc_defalut:(current>2?styles.wyc_active:null)} style={{marginLeft:'5px'}}>创建会员卡</span>
                              <span style={{float:"right"}}> <i className="iconfont icon-zuoxiangjiantou" style={{color:'#ccc'}}/> </span>
                          </li>
                          <li>
                              <span className={current===3?styles.wyc_defalut:(current>3?styles.wyc_active:null)}>
                                  {current===3?<i className="iconfont icon-kucun"></i>:(current>3?<i className="iconfont icon-qiyong" />:<i className="iconfont icon-kucun"/>)}
                              </span>
                              <span className={current===3?styles.wyc_defalut:(current>3?styles.wyc_active:null)} style={{marginLeft:'5px'}}>库存设置</span>
                          </li>
                      </ul>
                  </div>
                  {current===0 &&
                    <div className={styles.wyc_content}>
                      <div className={styles.wyc_left}>
                          <div className={styles.progressDiv}>
                              <h3><em className={styles.em}>1</em>设置角色</h3>
                              {/* <p>1.新增角色: 总部、门店</p>
                              <p>2.分配权限</p> */}
                              <Button  type='primary' style={{marginBottom:'30px'}} disabled={true} onClick={()=>{router.push('/boss-brand/role-list');this.props.changeModal()}}>{'已设置'}</Button>
                          </div>
                          <div className={styles.progressDiv}>
                              <h3><em className={styles.em}>2</em>设置工种</h3>
                              {/* <p>1.新增角色: 总部、门店</p> */}
                              <Button type='primary' style={{marginBottom:'30px'}} disabled={true} onClick={()=>{router.push('/boss-brand/work-type');this.props.changeModal()}}>{'去设置'}</Button>
                          </div>
                          <div className={styles.progressDiv}>
                              <h3><em className={styles.em}>3</em>设置班组</h3>
                              {/* <p>1.新增角色: 总部、门店</p> */}
                              <Button type='primary' style={{marginBottom:'30px'}} onClick={()=>{router.push('/boss-brand/addClassGroup');this.props.changeModal()}}>{'去设置'}</Button>
                          </div>
                          <div className={styles.no_progressDiv}>
                              <h3><em className={styles.em}>4</em>设置员工</h3>
                              {/* <p>1.新增角色: 总部、门店</p> */}
                              <Button type='primary'style={{marginBottom:'30px'}} disabled={true} onClick={()=>{router.push('/boss-brand/addClassGroup');this.props.changeModal()}}>{'去设置'}</Button>
                          </div>
                      </div>
                      <div className={styles.wyc_right}>
                          <div className={styles.progressDiv}>
                              <h3><em className={styles.em}>5</em>设置支付方式</h3>
                              {/* <p>1.新增角色: 总部、门店</p> */}
                              <Button type='primary'style={{marginBottom:'30px'}} onClick={()=>{router.push('/boss-brand/pay');this.props.changeModal()}}>{'去设置'}</Button>
                          </div>
                          <div className={styles.progressDiv}>
                              <h3><em className={styles.em}>6</em>仓库设置</h3>
                              {/* <p>1.新增角色: 总部、门店</p> */}
                              <Button type='primary'style={{marginBottom:'30px'}} disabled={true} onClick={()=>{router.push('/boss-brand/pay');this.props.changeModal()}}>{'去设置'}</Button>
                          </div>
                          <div className={styles.progressDiv}>
                              <h3><em className={styles.em}>7</em>供应商批量导入</h3>
                              {/* <p>1.新增角色: 总部、门店</p> */}
                              <Button type='primary'style={{marginBottom:'30px'}} disabled={true} onClick={()=>{router.push('/boss-brand/pay');this.props.changeModal()}}>{'去设置'}</Button>
                          </div>
                          <div className={styles.no_progressDiv}>
                              <h3><em className={styles.em}>8</em>维修类型</h3>
                              {/* <p>1.新增角色: 总部、门店</p> */}
                              <Button type='primary'style={{marginBottom:'30px'}} disabled={true} onClick={()=>{router.push('/boss-brand/pay');this.props.changeModal()}}>{'去设置'}</Button>
                          </div>
                      </div>

                    </div>
                  }
                  {current===1 &&
                    <div className={styles.wyc_content}>
                      <div className={styles.wyc_left}>
                          <div className={styles.progressDiv}>
                              <h3><em className={styles.em}>1</em>维修类型</h3>
                              <p>1.新增角色: 总部、门店</p>
                              <Button  type='primary' style={{marginBottom:'30px'}} disabled={true} onClick={()=>{router.push('/boss-brand/maintenance-category');this.props.changeModal()}}>{'已设置'}</Button>
                          </div>
                          <div className={styles.progressDiv}>
                              <h3><em className={styles.em}>2</em>产品类型</h3>
                              <p>可在品牌商维护基础上结合门店业务补充产品分类</p>
                              <Button type='primary' style={{marginBottom:'30px'}} onClick={()=>{router.push('/boss-brand/product-category');this.props.changeModal()}}>{'去设置'}</Button>
                          </div>
                          <div className={styles.progressDiv}>
                              <h3><em className={styles.em}>3</em>产品</h3>
                              <p>A来源品牌商:完善【销售价格、消耗完善、默认仓库、最低库存、最高库存】</p>
                              <p>B来源门店:可在品牌商维护基础上结合门店业务补充</p>
                              <Button type='primary' style={{marginBottom:'30px'}} onClick={()=>{router.push('/boss-brand/product');this.props.changeModal()}}>{'去设置'}</Button>
                          </div>
                          <div className={styles.no_progressDiv}>
                              <h3><em className={styles.em}>4</em>设置工时</h3>
                              <p>1.新增角色: 总部、门店</p>
                              <Button type='primary'style={{marginBottom:'30px'}} disabled={true} onClick={()=>{router.push('/boss-brand/product');this.props.changeModal()}}>{'去设置'}</Button>
                          </div>
                      </div>
                      <div className={styles.wyc_right}>
                          <div className={styles.progressDiv}>
                              <h3><em className={styles.em}>5</em>项目分类</h3>
                              <p>A来源品牌商: 完善【工时】</p>
                              <p>B来源门店:可在品牌商维护基础上结合门店业务补充</p>
                              <Button type='primary'style={{marginBottom:'30px'}} onClick={()=>{router.push('/boss-brand/project-category');this.props.changeModal()}}>{'去设置'}</Button>
                          </div>
                          <div className={styles.progressDiv}>
                              <h3><em className={styles.em}>6</em>项目</h3>
                              <p>A来源品牌商: 完善【售价、成本、销售】</p>
                              <p>B来源门店:可在品牌商维护基础上结合门店业务补充</p>
                              <Button type='primary'style={{marginBottom:'30px'}} onClick={()=>{router.push('/boss-brand/project');this.props.changeModal()}}>{'去设置'}</Button>
                          </div>
                          <div className={styles.no_progressDiv}>
                              <h3><em className={styles.em}>7</em>附加项目</h3>
                              <p>A来源品牌商: 完善【成本、售价】</p>
                              <p>B来源门店:可在品牌商维护基础上结合门店业务补充</p>
                              <Button type='primary'style={{marginBottom:'30px'}} disabled={true} onClick={()=>{router.push('/boss-brand/additional-project');this.props.changeModal()}}>{'去设置'}</Button>
                          </div>
                      </div>

                    </div>
                  }
                  {current===2 &&
                    <div className={styles.wyc_content}>
                      <div className={styles.wyc_left}>
                          <div className={styles.progressDiv}>
                            <h3><em className={styles.em}>1</em>充值卡种设置</h3>
                            <p>1.新增角色: 总部、门店</p>
                            <Button  type='primary' style={{marginBottom:'30px'}} disabled={true} onClick={this.gotoSet}>{'已设置'}</Button>
                          </div>
                          <div className={styles.no_progressDiv}>
                              <h3><em className={styles.em}>2</em>计次卡套餐设置</h3>
                              <p>可在品牌商维护基础上结合门店业务补充</p>
                              <Button type='primary'style={{marginBottom:'30px'}}  disabled={true} onClick={this.gotoSet}>{'去设置'}</Button>
                          </div>
                      </div>
                    </div>
                  }
                  {current===3 &&
                    <div className={styles.wyc_content}>
                      <div className={styles.wyc_left}>
                          <div className={styles.no_progressDiv}>
                            <h3><em className={styles.em}>1</em>库存盘点</h3>
                            <p>1.新增角色: 总部、门店</p>
                            <Button  type='primary' style={{marginBottom:'30px'}} disabled={true} onClick={this.gotoSet}>{'已设置'}</Button>
                          </div>
                      </div>
                    </div>
                  }
                  {current===4 &&
                    <div className={styles.wyc_content}>
                      <div className={styles.centerImg}>
                        <img src={guide_ai}/>
                      </div>
                      <div className={styles.otherSet}>
                        <h3 style={{color:'#333',fontWeight:'bold',padding:'17px 0'}}>其他配置</h3>
                        <div className={styles.otherDiv}>
                          <div className={styles.divItem}>
                            <h4 style={{fontWeight:'bold',color:'#303133',textAlign:'center',marginTop:'10px'}}>数据批量导入</h4>
                            <p>针对已开店的门店一次性导入海量数据</p>
                            <p><span>客户资料导入</span><span style={{float:'right'}} >已导入</span><span style={{float:'right',color:'#4AACF7',cursor:'pointer'}} className={styles.isShow} onClick={this.gotoSet}>去导入</span></p>
                            <p><span>已办充值卡导入</span><span style={{float:'right'}} className={styles.isShow}>已导入</span><span style={{float:'right',color:'#4AACF7',cursor:'pointer'}} onClick={this.gotoSet}>去导入</span></p>
                            <p><span>已办计次卡导入</span><span style={{float:'right'}} className={styles.isShow}>已导入</span><span style={{float:'right',color:'#4AACF7',cursor:'pointer'}} onClick={this.gotoSet}>去导入</span></p>
                            <p><span>客户资料导入</span><span style={{float:'right'}} className={styles.isShow}>已导入</span><span style={{float:'right',color:'#4AACF7',cursor:'pointer'}} onClick={this.gotoSet}>去导入</span></p>
                          </div>
                          <div className={styles.divItem}>
                            <h4 style={{fontWeight:'bold',color:'#303133',textAlign:'center',marginTop:'10px'}}>配置绩效</h4>
                            <p>针对已开店的门店一次性导入海量数据</p>
                            <p><span>销售提成设置</span><span style={{float:'right'}} className={styles.isShow}>已导入</span><span style={{float:'right',color:'#4AACF7',cursor:'pointer'}} onClick={this.gotoSet}>去导入</span></p>
                            <p><span>销售特殊提成设置</span><span style={{float:'right'}} className={styles.isShow}>已导入</span><span style={{float:'right',color:'#4AACF7',cursor:'pointer'}} onClick={this.gotoSet}>去导入</span></p>
                            <p><span>施工提成设置</span><span style={{float:'right'}} className={styles.isShow}>已导入</span><span style={{float:'right',color:'#4AACF7',cursor:'pointer'}} onClick={this.gotoSet}>去导入</span></p>
                            <p><span>施工特殊提成设置</span><span style={{float:'right'}} className={styles.isShow}>已导入</span><span style={{float:'right',color:'#4AACF7',cursor:'pointer'}} onClick={this.gotoSet}>去导入</span></p>
                            <p><span>会员卡提成设置</span><span style={{float:'right'}} className={styles.isShow}>已导入</span><span style={{float:'right',color:'#4AACF7',cursor:'pointer'}} onClick={this.gotoSet}>去导入</span></p>
                            <p><span>奖励提成设置</span><span style={{float:'right'}} className={styles.isShow}>已导入</span><span style={{float:'right',color:'#4AACF7',cursor:'pointer'}} onClick={this.gotoSet}>去导入</span></p>
                          </div>
                          <div className={styles.divItem}>
                            <h4 style={{fontWeight:'bold',color:'#303133',textAlign:'center',marginTop:'10px'}}>配置回访</h4>
                            <p>针对已开店的门店一次性导入海量数据</p>
                            <p><span>回访提醒设置</span><span style={{float:'right'}} className={styles.isShow}>已导入</span><span style={{float:'right',color:'#4AACF7',cursor:'pointer'}} onClick={this.gotoSet}>去导入</span></p>
                            <p><span>施工项目提醒设置</span><span style={{float:'right'}} className={styles.isShow}>已导入</span><span style={{float:'right',color:'#4AACF7',cursor:'pointer'}} onClick={this.gotoSet}>去导入</span></p>
                            <p><span>回访设置</span><span style={{float:'right'}} className={styles.isShow}>已导入</span><span style={{float:'right',color:'#4AACF7',cursor:'pointer'}} onClick={this.gotoSet}>去导入</span></p>
                            <p><span>自定义提醒设置</span><span style={{float:'right'}} className={styles.isShow}>已导入</span><span style={{float:'right',color:'#4AACF7',cursor:'pointer'}} onClick={this.gotoSet}>去导入</span></p>
                          </div>
                        </div>
                      </div>
                    </div>
                  }
                    {(current > 0&&current < 5 )&&<Button type='defalut' style={{position:'absolute',right:'120px',bottom:'30px'}} onClick={this.prev}>上一步</Button>}

                    {current < 5&&<Button type='primary' style={{position:'absolute',right:'30px',bottom:'30px'}} onClick={this.next}>{current===4?'完成':'下一步'}</Button>}


            </Modal>
          </div>
        )
    }
}
export default connect(( guidance ) => ({ guidance }))(index)
