import React,{Component} from 'react'
import PropTypes from "prop-types"
import { Drawer, Tabs, Spin, Input, Button, Icon, Modal } from 'antd'
import { connect } from "dva"
import { __PRODUCT_TYPE__ } from "utils/globalConfig"

import services from "services"

import CardList from './cardList'
import List from './list'
import ProjectTk from './projectTk'
import ProductTk from './productTk'
import QuickIn from './quickIn'
import collectData from 'utils/collectData'
import styles from './style.less'

const { TabPane } = Tabs
class MyDrawer extends Component {

  constructor(props) {
    super(props)
    this.state = {
      list: [], //全部
      cardList: [], //卡内
      loading: true, //加载状态
      searchStr: '',
      selected: props.selected, //已选
      visible: props.visible,
      activeKey: '1',
      hasPrjPermission: JSON.parse(window.localStorage.getItem("permissionRole")).findIndex(v => v === 51) !== -1,
      hasPrdPermission: JSON.parse(window.localStorage.getItem("permissionRole")).findIndex(v => v === 53) !== -1,
      isJudge: false,
      showNew: false, //显示新增弹窗
      text: this.props.type === 1 ? '项目' : '产品',
      listApi:  props.type === __PRODUCT_TYPE__ ? 'maintain/product/list' : 'maintain/project/list',
      cardApi: props.type === __PRODUCT_TYPE__ ? 'store/clientcard/product/list' : 'store/clientcard/project/list',
      showQuickIn: false,  //是否快捷入库
      successId: 0,
      quickVisible: false, //快捷入库
      curProduct: {}, //当前快捷入库产品
      totalPage: 0, //总页数
      curPage: 1, //当前页数
    }
  }

  async componentWillMount() {
    const { onRef } = this.props
    if (onRef) {
      onRef(this)
    }
    await this.getCard()
    await this.getAll()
    // 添加急件更新库存数量
    const { list, cardList } = this.state
    if(cardList.length === 0) {
      this.setState({loading: true}, () => {
        this.setState({activeKey: '2'}, () => {
          this.setState({loading: false})
        })
      })
    }
    let selected = this.props.selected
    list.forEach(_ => {
      let idx = selected.findIndex(v => v.soleId === _.soleId)
      if(idx !== -1) {
        selected[idx] = {...selected[idx], stock: _.stock}
      }
    })
    cardList.forEach(_ => {
      let idx = selected.findIndex(v => v.soleId === _.soleId)
      if(idx !== -1) {
        selected[idx] = {...selected[idx], stock: _.stock}
      }
    })
    this.props.onOk(selected)
  }

  /**
   * 卡内数据
   */
  async getCard() {
    const { maintainBilling, speedyBilling, zeroDisable } = this.props
    let clientId = zeroDisable ? speedyBilling.orderInfo.clientId : maintainBilling.orderInfo.clientId
    let clientCarId = zeroDisable ? speedyBilling.orderInfo.carId : maintainBilling.orderInfo.carId
    this.setState({loading: true})
    const { code, list } = await services.LIST({
      keys: {name: this.state.cardApi},
      data: {q: {where: {clientId, clientCarId}}},
    })
    if(code === '0') {
      this.setState({
        loading: false,
        cardList: list.map(v => {
          v.list = v.list.map(_ => ({..._, soleId: _.detailId, cardName: v.cardName, cardId: v.cardId})).filter(j => j.number !== 0) //增加soleId 唯一标识
          return v
        }),
      })
    }else {
      this.setState({loading: true})
    }
  }

  /**
   * 全部数据
   */
  async getAll(limit) {
    this.setState({loading: true})
    const { code, list, totalPage } = await services.LIST({
      keys: {name: this.state.listApi},
      data: {q: { limit: limit || 50 ,where: {"name[~]|commodityCode[~]": this.state.searchStr}}},
    })
    if(code === '0') {
      this.setState({
        loading: false,
        list: list.map(v => ({...v, soleId: v.id})), //增加soleId 唯一标识
        totalPage: totalPage,
      })
    }else {
      this.setState({loading: true})
    }
  }

  loadMore = () => {
    console.log('加载更多')
    const { curPage, totalPage, list } = this.state
    if(curPage < totalPage) {
      this.setState({loading: true})
      services.LIST({
        keys: {name: this.state.listApi},
        data: {q: { limit: 50, page: curPage*1 + 1, where: {"name[~]|commodityCode[~]": this.state.searchStr}}},
      }).then(res => {
        let newList = list.concat(res.list.map(v => ({...v, soleId: v.id})))
        if(res.code) {
          this.setState({
            loading: false,
            list: newList,
            curPage: curPage*1+ 1,
          })
        }
      })
    }
  }

  resetSelected = (selected) => {
    this.setState({ selected: selected || [] })
  }

  callback = (e) => {
    this.setState({activeKey: e})
    if(e === '2' && this.state.list.length === 0) {
      this.setState({loading: true})
      this.getAll()
    }
  }

  onClose = () => {
    this.setState({
      visible: false,
    })
  }

  newly = (type) => {
    if ((window.location.pathname === '/boss-store/speedy-billing') || ( window.location.pathname === '/boss-store/maintain-billing')) {
      collectData('order')
    }
    console.log(444, type)
    this.setState({showNew: true})
  }

  async closeTk(isSuccess, id, isNext) {
    if(isNext) {
      this.setState({showNew: true, successId: id})
    }else {
      this.setState({showNew: false, successId: id})
    }
    if(isSuccess) {
      await this.getAll(9999)
      if(this.props.type === __PRODUCT_TYPE__ && !isNext) { //产品新增成功显示快捷入库
        // this.setState({showQuickIn: true})
      }
      const { onOk } = this.props
      const result = this.state.list.filter(v => v.id === id)
      onOk([...result, ...this.state.selected])
      this.setState({selected: [...result, ...this.state.selected]})
    }
  }

  showDrawer = () => {
    this.setState({
      visible: !this.state.visible,
    })
  }

  search = (e) => {
    this.setState({ searchStr: e.target.value, curPage: 1 }, ()=> {
      this.getAll()
    })
  }

  setCurProduct = (id) => {
    const item = this.state.list.filter(v => v.id === id)[0]
    console.log('setCurProduct----', id, item)
    this.setState({curProduct: item, quickVisible: true, showQuickIn: false})
  }

  quickClose = () => {
    this.setState({quickVisible: false})
  }

  quickSuccess = (item) => {
    this.quickClose()
    let { list, selected } = this.state
    const { onOk } = this.props
    list = list.map(v => {
      if(v.soleId === item.soleId) {
        v = item
      }
      return v
    })
    selected = selected.map(v => {
      if(v.soleId === item.soleId) {
        v = {
          ...v,
          stock: item.stock,
        }
      }
      return v
    })
    this.setState({
      list: list,
      selected: selected,
    })
    onOk(selected)
  }

  onBlur = () => {
    if ((window.location.pathname === '/boss-store/speedy-billing') || ( window.location.pathname === '/boss-store/maintain-billing')) {
      collectData('order')
    }
  }

  render() {
    const { onOk, type } = this.props

    const props = {
      visible: this.state.quickVisible,
      product: this.state.curProduct,
      onClose: this.quickClose,
      quickSuccess: this.quickSuccess.bind(this),
    }

    return (
      <div>
        <div className={styles.line + (this.state.visible ? ` ${styles.animatedIn}` : ` ${styles.animatedOut}`)}>
          <div className={styles.vertical + (this.state.visible ? ` ${styles.animatedBox}` : ` ${styles.animatedBoxOut}`)} onClick={this.showDrawer}>
            {
              this.state.visible ?
              <Icon  type="double-right"  />
              :
              <Icon  type="double-left"  />
            }
            {this.state.visible ? '收起' : '添加'}
            {this.state.text}
          </div>
        </div>
        <div style={{height: '100%', position: 'relative'}}>
          <Drawer
          // mask={false}
          className="MyDrawer"
          placement="right"
          width={400}
          onClose={this.onClose}
          closable={false}
          visible={this.state.visible}
        >
          <Spin spinning={this.state.loading} style={{minHeight: 600}}>
            <Tabs
            activeKey={this.state.activeKey}
            onChange={this.callback}
            tabBarStyle={{width: "100%"}}
            >
              <TabPane tab={"卡内" + this.state.text} key="1">
                {/* 表头 */}
                {
                  type === __PRODUCT_TYPE__ &&
                  <div className={styles.tit2}>
                    <span>产品</span>
                    <span>产品编码</span>
                    <span>卡内剩余</span>
                    <span>库存</span>
                  </div>
                }
                <CardList
                list={this.state.cardList}
                type={this.props.type}
                selected={this.state.selected}
                zeroDisable={this.props.zeroDisable}
                  onChange={(selected) => {
                  if ((window.location.pathname === '/boss-store/speedy-billing') || ( window.location.pathname === '/boss-store/maintain-billing')) {
                    collectData('order')
                  }
                  this.setState({ selected })
                  onOk(selected)
                }}
                />
              </TabPane>
              <TabPane tab={"全部" + this.state.text} key="2">
                {/* 搜索框 */}
                <div className={styles.search}>
                  <Input
                    size="large"
                    placeholder={"搜索" + this.state.text + (this.state.text === '产品' ? '/编码' : '')}
                    style={{ width: '100%', flex: 1}}
                    value={this.state.searchStr}
                    prefix={
                      <i
                        style={{ color: "#ccc", fontSize: "14px" }}
                        className="iconfont icon-chazhao"
                      />
                    }
                      onChange={(e) => this.search(e)}
                      onBlur={this.onBlur}
                  />
                  {
                    (this.state.hasPrjPermission || (this.props.type === 1 && this.state.hasPrjPermission) )
                    && <Button size="large" style={{ marginLeft: 10 }} type="primary" onClick={this.newly.bind(this,this.props.type)}><i className="iconfont icon-tianjia"></i></Button>
                  }
                </div>
                {/* 表头 */}
                {
                  type === __PRODUCT_TYPE__ &&
                  <div className={styles.tit2}>
                    <span>产品</span>
                    <span>编码</span>
                    <span>库存</span>
                  </div>
                }
                {/* 新增弹窗 */}
                {
                  this.props.type === __PRODUCT_TYPE__
                  ?
                  <div>
                    {this.state.showNew && <ProductTk
                    visible={this.state.showNew}
                    onClose={this.closeTk.bind(this)}
                    outsideType={this.props.outsideType}
                    ></ProductTk>}
                  </div>
                  :
                  <div>
                    <ProjectTk
                    visible={this.state.showNew}
                    onClose={this.closeTk.bind(this)}
                    ></ProjectTk>
                  </div>
                }
                {/* 是否需要快捷入库 */}
                <Modal
                  title=" "
                  width={570}
                  visible={this.state.showQuickIn}
                  maskClosable={false}
                  footer={null}
                  onCancel={() => this.setState({showQuickIn: false})}
                >
                  <div className={styles.quickModal}>
                    <div>
                      <i className="iconfont icon-xuanzhong" />
                    </div>
                    <div>
                      新建产品成功,是否进行快捷入库?
                    </div>
                    <div>
                      <Button size="large" onClick={() => this.setState({showQuickIn: false})}>
                        暂不入库
                      </Button>
                      <Button size="large" type="primary" onClick={this.setCurProduct.bind(this, this.state.successId)}>
                        快捷入库
                      </Button>
                    </div>
                  </div>
                </Modal>
                <List
                list={this.state.list}
                type={this.props.type}
                setCurProduct={this.setCurProduct}
                selected={this.state.selected}
                zeroDisable={this.props.zeroDisable}
                loadMore={this.loadMore}
                onChange={(selected) => {
                  if ((window.location.pathname === '/boss-store/speedy-billing') || ( window.location.pathname === '/boss-store/maintain-billing')) {
                    collectData('order')
                  }
                  this.setState({ selected })
                  onOk(selected)
                }}
                />
              </TabPane>
            </Tabs>
            {/* 快捷 */}
            <QuickIn {...props}></QuickIn>
          </Spin>
        </Drawer>
        </div>
      </div>
    )
  }
}

MyDrawer.propTypes = {
  type: PropTypes.number, //类型 项目或者产品
  visible: PropTypes.bool, //是否展开抽屉
  selected: PropTypes.arrayOf(PropTypes.object), //选中的值
  onOk: PropTypes.func, //点击事件
  onRef: PropTypes.func, // 获取当前组件ref
  zeroDisable: PropTypes.bool, //库存为零是否能点击
}

function mapStateToProps(state) {
  return {
    maintainBilling: state.maintainBilling,
    speedyBilling: state.speedyBilling,
  }
}

export default connect(
  mapStateToProps,
  null,
  null,
  { withRef: true }
)(MyDrawer)
