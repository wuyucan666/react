/**
 * 李冯
 */
import { Component } from "react"
import PropTypes from "prop-types"
import { connect } from "dva"
import { Modal, message, Spin, Input, Icon, Button } from "antd"
import services from "services"
import Category from "./category"
import List from "./list"
import { arrayToTreeData } from "utils"
import style from "./style.less"
import { __PRODUCT_TYPE__ } from "utils/globalConfig"

/**
 * 选择项目
 * 门店使用
 * 调用的所有接口为门店角色下的接口
 */

class SelectProject extends Component {
  constructor(props) {
    super(props)
    // fix: 赠送卡办理页面的默认选择列表没有过滤
    const selected = props.selected.filter((_) => _.type === props.type)

    this.state = {
      category: [], // 分类列表
      list: [], // 项目列表
      cardList: [], //卡内列表
      giveList: [], //赠送列表
      selected: selected, // 选择的列表
      loading: true, // 加载状态
      visible: false, // 显示状态
      apiType: props.type === __PRODUCT_TYPE__ ? "product" : "project",
      listType: props.type === __PRODUCT_TYPE__ ? "maintain/product" : "maintain/project",
      idType: props.type === __PRODUCT_TYPE__ ? "productId" : "projectId",
      nameType: props.type === __PRODUCT_TYPE__ ? "productName" : "projectName",
      categoryId: null, // 分类ID
      searchStr: null,
      searchCloseShow: false,
      cardSearchStr: null, //卡内搜索字段
      cardSearchClose: false,
      page: 0,
      total: 1,
      isBottom:false,
    }
  }

  /**
   * props更新时判断是否请求数据
   */
  static getDerivedStateFromProps(props, pervState) {
    if (props.selected.length > 0) {
      const selected = [...props.selected.filter((_) => _.type === props.type)]
      const index = selected.findIndex((_) => _._delete)
      if (index > -1 && selected.length) {
        selected.splice(index, 1)
        props.onOk(selected)
        return {
          selected,
          visible: props.visible,
        }
      } else if (pervState.selected.length === 0) {
        return { selected: [...props.selected.filter((_) => _.type === props.type)], visible: props.visible }
      }
    }
    return {
      visible: props.visible,
    }
  }

  resetSelected = (selected) => {
    this.setState({ selected: selected || [] })
  }

  componentDidMount() {
    const { onRef } = this.props
    if (onRef) {
      onRef(this)
    }
    this.setState({
      list:[],
    })
  }

  componentDidUpdate() {
    setTimeout(() => {
      if (this.state.visible && !this.state.category.length) {
        this.getData()
      }
    }, 200)
  }


  /**
   * 初始化数据
   * @return {[type]} [description]
   */
  async getData() {
    // console.log('getdata')
    const { code, list } = await services.list({
      keys: { name: "store/" + this.state.apiType + "category" },
    })
    if (code === "0") {
      if (list.length) {
        let category = arrayToTreeData(list, "pId", "categoryId").children
        category.unshift({
          categoryId: -1,
          categoryName: "全部",
          categorySort: 1,
        })
        this.setState({
          category: category,
          categoryId: category[0].categoryId,
          list:[],
        },()=>{
          this.getProjectList()
        })
      } else {
        message.error("没有数据，请先创建")
        this.props.onCancel()
      }
    } else {
      this.props.onCancel()
    }
  }

  /**
   * 获取项目列表
   * @param  {[type]} categoryId [description]
   * @return {[type]}            [description]
   */
  async getProjectList() {
    await this.setState({
      page:this.state.page+1,
    })
    const where = {
      categoryId:
        this.state.categoryId && this.state.categoryId > -1
          ? this.state.categoryId
          : undefined,
      [`${this.state.nameType}[~]|commodityCode[~]`]: this.state.searchStr,
      statusTem: 1,
    }
    const { listType } = this.state
    const res = await services.list({
      keys: { name: listType },
      data: { q: { page: this.state.page, limit: "50", where } },
    })
    if (this.state.apiType === "product") {
      // store/order/product/list
      if (res.code === "0") {
        let list = res.list.map(v => { //兼容之前的写法
          return {
            ...v, 
            productId: v.id,
            productName: v.name,
            sellingPriceTem: v.price,
          }
        })
        if(this.state.page===1){
          this.setState({
            list: list,
            loading: false,
            total:res.totalPage,
          })
        }else{
          this.setState({
            list: [...this.state.list, ...list],
            loading: false,
            total:res.totalPage,
          })
        }
      } else {
        this.setState({ loading: false })
      }
    } else {
      if (res.code === "0") {
        let list = res.list.map(v => {
          return {
            ...v, 
            projectId: v.id,
            projectName: v.name,
            priceTem: v.price,
          }
        })
        if(this.state.page===1){
          this.setState({
            list: list,
            loading: false,
            total:res.totalPage,
          })
        }else{
          this.setState({
            list: [...this.state.list, ...list],
            loading: false,
            total:res.totalPage,
          })
        }
        
      } else {
        this.setState({ loading: false })
      }
    }
    this.setState({ isBottom:false })
  }

  onSearch() {
    this.setState({ list:[],page:0},()=>{ this.getProjectList() })
  }

  refresh = () => {
    this.setState({ searchCloseShow: false,cardSearchClose: false })
    this.setState({ searchStr: null ,list:[],page:0,isBottom:false }, () => {
      this.getProjectList()
    })
  }

  /**
   * 删除选择项
   */
  delSelectItem = (item) => {
    const index = this.state.selected.findIndex(
      (_) => _[this.state.idType] === item[this.state.idType]
    )
    if (index >= 0) {
      this.setState(({ selected }) => {
        let newSelected = [...selected]
        newSelected.splice(index, 1)
        return {
          selected: newSelected,
        }
      })
    }
  }

  /**
   * 是否到达底部
   */
  isToBottom(){
     if(this.state.page < this.state.total){
      this.setState({
        isBottom :true,
      },()=>{
        this.getProjectList()
      })
    }
  }

  render() {
    const { type } = this.props
    const All = (
      <div>
        <div className={style["select-project-form"] + " flex"}>
          <div className="item">
            <Input
              size="large"
              placeholder="名称/编码"
              style={{ width: 260, marginBottom: 24 }}
              value={this.state.searchStr}
              prefix={
                <i
                  style={{ color: "#ccc", fontSize: "14px" }}
                  className="iconfont icon-chazhao"
                />
              }
              onChange={(e) => this.setState({ searchStr: e.target.value })}
            />
            <Button
              type="primary"
              size="large"
              style={{ width: "88px", marginLeft: "24px" }}
              onClick={this.onSearch.bind(this)}
            >
              查询
            </Button>
            <Button
              size="large"
              style={{ width: "88px", marginLeft: "24px" }}
              onClick={() => this.refresh()}
            >
              重置
            </Button>
          </div>
        </div>
        <Spin spinning={this.state.loading}>
          <div className={style.content}>
            <div className="item">
              <Category
                list={this.state.category}
                type={this.props.type}
                onSelect={async (selected) => {
                  if (selected.length === 0) {
                    return false
                  }
                  await this.setState({
                    loading: true,
                    categoryId: selected[0],
                    list:[],
                    page:0,
                  },()=>{
                    this.getProjectList()
                  })
                }}
              />
            </div>
            <div className="select-project-table">
              <List
                type={this.props.type}
                onChange={(selected) => this.setState({ selected })}
                selected={this.state.selected}
                list={this.state.list}
                apiType={this.state.apiType}
                nameType={this.state.nameType}
                idType={this.state.idType}
                onIsToBottom={this.isToBottom.bind(this)}
              />
            </div>
          </div>
        </Spin>
      </div>
    )

    return (
      <Modal
        width={900}
        visible={this.state.visible}
        title={type === __PRODUCT_TYPE__ ? "选择产品" : "选择项目"}
        onCancel={() => {
          this.props.onCancel()
          this.refresh()
          this.setState({ list:[] })
        }}
        onOk={() => {
          this.props.onCancel()
          this.props.onOk(this.state.selected.map(v => ({ ...v, type: type })))
          this.refresh()
        }}
      >
        <div>{All}</div>
        {/*选择的列表*/}
        <div className={style.select + " flex"}>
          <div className="title">已选择</div>
          <div className="item">
            {this.state.selected.map((_) => (
              <div className="select-item" key={_[this.state.idType] || _.pId}>
                {_.pName || _[this.state.nameType]}
                <Icon
                  type="close"
                  theme="outlined"
                  onClick={() => this.delSelectItem(_)}
                />
              </div>
            ))}
          </div>
        </div>
      </Modal>
    )
  }
}

SelectProject.propTypes = {
  visible: PropTypes.bool, // 是否显示modal
  onCancel: PropTypes.func, // 取消事件
  onOk: PropTypes.func, // 确定事件
  selected: PropTypes.arrayOf(PropTypes.object), // 选择的值
  type: PropTypes.number, // 产品还是项目
  onRef: PropTypes.func, // 获取当前组件ref
}

function mapStateToProps(state) {
  return {
    maintainAccount: state.maintainBilling ? state.maintainBilling.account : [],
    speedyAccount: state.speedyBilling ? state.speedyBilling.account : [],
  }
}

export default connect(
  mapStateToProps,
  null,
  null,
  { withRef: true }
)(SelectProject)
