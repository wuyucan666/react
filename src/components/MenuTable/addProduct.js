import React, { Component } from "react"
import { connect } from "dva"
import "./styles.less"
import styles from "./styles.less"
import { Select, Input, Icon, TreeSelect, Button, Spin } from "antd"
import Table from "./table.js"
import services from "services"
import Add from "../Drawer/productTk"
// const InputGroup = Input.Group
const Option = Select.Option
const TreeNode = TreeSelect.TreeNode

class addProduct extends Component {
  constructor(props) {
    super(props)
    this.state = {
      addProduct: false,
      searchShow: false,
      warehouseList: [],
      warehouseId: null,
      cid: null,
      isShow: false,
      page: 1,
      rotate: false,
      currentPage: 1,
      value: null,
      loading: false,
      selectTree: null,
      warehouseName: null,
      noButtonClick: false, //用于控制按钮是否被点击
    }
    this.typeName = [] // 用于记录分类查询名称和ID
  }
  //递归形成树状菜单
  getMenu = (dataList) => {
    if (dataList.children) {
      return dataList.children.map((item) => {
        return (
          <TreeNode value={String(item.id)} title={item.name} key={item.id}>
            {" "}
            {this.getMenu(item)}{" "}
          </TreeNode>
        )
      })
    } else {
      return
    }
  }
  //获得初始化数据
  UNSAFE_componentWillMount() {
    const { api } = this.props
    this.serverApi(api.getMenu)
    this.serverApi(api.getData, { q: { limit: 10 } })
    services
      .warehouseList({ keys: { name: "store/warehouse/list" } })
      .then((res) => {
        this.setState({
          warehouseList: res.list,
        })
      })
  }
  UNSAFE_componentWillReceiveProps(nextprops){
     if(nextprops.isOpen){
       this.setState({
         addProduct:true,
       },()=>{
         this.props.controlIsOpen()
       })
     }
  }
  //控制增加商品模块显示隐藏
  handerAddShow = () => {
    this.setState({
      addProduct: !this.state.addProduct,
    })
  }
  //仓库
  changeW = (val) => {
    let warehouseName
    const { warehouseList } = this.state
    warehouseList.forEach((item) => {
      if (item.warehouseId * 1 === val * 1) {
        warehouseName = item.warehouseName
      }
    })
    this.setState({
      warehouseId: val,
      warehouseName,
    })
  }
  goAddProduct = () => {
    this.setState({
      isShow: true,
    })
  }
  onClose=(isSuccess, id, isNext)=> {
    if(isNext){
      this.setState({
        isShow: true,
      })
      return
    }
    this.setState({
      isShow: false,
    })
  }
  //发起请求
  serverApi = (api, t) => {
    const { dispatch } = this.props
    this.setState(
      {
        loading: true,
        noButtonClick: true,
      },
      () => {
        dispatch({
          type: api,
          payload: { ...t },
        }).then(() => {
          this.setState({
            loading: false,
            noButtonClick: false,
          })
        })
      }
    )
  }
  searchShow = () => {
    this.setState({
      searchShow: !this.state.searchShow,
    })
  }
  onChange = (val) => {
    console.log(val)
    this.setState({
      cid: val,
      selectTree: this.findkindName(val),
    })
  }
  //用于查找分类名称
  findkindName = (val) => {
    let value
    this.typeName = []
    const { productTypeList } = this.props
    this.handerCheckName(productTypeList)
    for (let i = 0; i < this.typeName.length; i++) {
      if (this.typeName[i].id * 1 === val * 1) {
        value = this.typeName[i].name
        break
      }
    }
    return value
  }
  handerCheckName = (list) => {
    list.forEach((item) => {
      if (item.children) {
        this.handerCheckName(item.children)
      }
      this.typeName.push({
        id: item.id,
        name: item.name,
      })
    })
  }
  random = () => {
    const { api } = this.props
    this.setState(
      {
        currentPage: 1,
        value: null,
        selectTree: null,
        warehouseId: null,
        warehouseName: null,
        cid: null,
      },
      () => {
        this.serverApi(api.getData, { q: { limit: 10 } })
      }
    )
  }
  onSelect = (keys, page, boolean) => {
    const { warehouseId, cid } = this.state
    !boolean ? this.setState({ currentPage: 1 }) : null
    var o = {}
    keys === "" || keys === null ? null : (o["code[~]|spec[~]|name[~]"] = keys)
    warehouseId ? (o.warehouseId = warehouseId) : null
    cid ? (o.categoryId = cid) : null
    this.searchSelect({ q: { where: { ...o }, limit: 10, page } })
  }
  //进行分类筛选
  searchSelect = (t) => {
    const { api } = this.props
    this.serverApi(api.getData, t)
  }
  //改变页数
  changePage = (val) => {
    const { value } = this.state
    this.setState(
      {
        currentPage: val,
      },
      () => {
        this.onSelect(value, val, true)
      }
    )
  }
  changeInputValue = (e) => {
    this.setState({
      value: e.target.value,
    })
  }

  handerSubmit = () => {
    const { value, page } = this.state
    this.onSelect(value, page)
  }

  render() {
    const {
      warehouseList,
      value,
      loading,
      selectTree,
      warehouseName,
      noButtonClick,
    } = this.state
    const { productTypeList } = this.props
    return (
      <div>
        <Add
          visible={this.state.isShow}
          onClose={this.onClose}
          controlRequired={this.props.controlRequired}
        />
        <div
          className={
            !this.state.addProduct
              ? styles.zl_addLine
              : styles.zl_addAnimate + "  " + styles.zl_addLine
          }
        />
        <div
          className={
            !this.state.addProduct
              ? styles.zl_addProduct
              : styles.zl_addProduct + "  " + styles.zl_addAnimate
          }
          onClick={this.handerAddShow}
        >
          {!this.state.addProduct ? (
            <Icon type="double-left" />
          ) : (
            <Icon type="double-right" />
          )}
          <p style={{cursor: 'pointer'}}>{!this.state.addProduct ? "添加产品" : "收起选择"}</p>
        </div>

        <div
          className={
            !this.state.addProduct
              ? styles.zl_addPage
              : styles.zl_addPage + "  " + styles.zl_addAnimate
          }
        >
          <p>
            {" "}
            添加产品 <span onClick={this.handerAddShow}>&times;</span>{" "}
          </p>

          <div className={styles.tableSearch}>
            <Input
              placeholder="名称/规格/编码"
              size="large"
              value={value}
              style={{ width: "240px", float: "left", marginRight: "24px" }}
              onChange={(e) => this.changeInputValue(e)}
              prefix={
                <Icon
                  className={styles.zl_FDJ}
                  type="search"
                  style={{
                    color: "rgba(0,0,0,.25)",
                    marginRight: "5px",
                    fontSize: "16px",
                    height: "16px",
                    width: "16px",
                  }}
                />
              }
            />
            {this.state.searchShow ? null : (
              <div className={styles.zl_searchButton} style={{ margin: 0 }}>
                <Button
                  disabled={noButtonClick}
                  loading={noButtonClick}
                  type="primary"
                  style={{ marginRight: "24px", height: "40px", width: "88px" }}
                  onClick={this.handerSubmit}
                >
                  查询
                </Button>
                <Button
                  disabled={noButtonClick}
                  loading={noButtonClick}
                  style={{ height: "40px", width: "88px" }}
                  onClick={this.random}
                >
                  重置
                </Button>
              </div>
            )}
            {this.state.searchShow ? (
              <div onClick={this.searchShow}>
                精简筛选条件{" "}
                <Icon
                  type="double-right"
                  style={{ transform: "rotateZ(-90deg)" }}
                />
              </div>
            ) : (
              <div onClick={this.searchShow}>
                更多筛选条件{" "}
                <Icon
                  type="double-left"
                  style={{ transform: "rotateZ(-90deg)" }}
                />
              </div>
            )}

            <p style={{cursor: 'pointer'}} onClick={this.goAddProduct } ><strong>+</strong> 新建商品</p>
            {/* <div  style={{ float:'right' ,marginRight:'26px'  }} >
                            <Icon  onClick={ this.random }  spin={ this.state.rotate }  type="sync" style={ { fontSize:'20px' } }   />
                        </div> */}
          </div>
          {!this.state.searchShow || (
            <div className={styles.zl_otherSearch}>
              {this.props.api.getData === "storeAdjustment/getProductData" || (
                <div className={styles.zl_o}>
                  <span style={{ marginLeft: "4px", marginRight: "5px" }}>
                    仓库
                  </span>
                  <Select
                    value={warehouseName}
                    onChange={this.changeW}
                    placeholder="默认"
                    style={{ width: "200px", zIndex: 10000 }}
                    size="large"
                  >
                    <Option key="quanbu" value={null}>
                      全部
                    </Option>
                    {warehouseList.map((item) => (
                      <Option
                        style={{ zIndex: 10000 }}
                        key={item.warehouseId}
                        value={item.warehouseId}
                      >
                        {item.warehouseName}
                      </Option>
                    ))}
                  </Select>
                </div>
              )}
              <span style={{ marginLeft: "4px", marginRight: "5px" }}>
                分类
              </span>
              <TreeSelect
                showSearch
                size="large"
                style={{ height: 40, width: "200px" }}
                dropdownStyle={{ maxHeight: 200, overflow: "auto" }}
                placeholder="默认"
                allowClear
                value={selectTree}
                treeDefaultExpandAll
                onChange={this.onChange}
              >
                {productTypeList.map((item) => {
                  return (
                    <TreeNode
                      value={String(item.id)}
                      selectable={item.children ? false : true}
                      title={item.name}
                      key={item.id}
                    >
                      {" "}
                      {this.getMenu(item)}{" "}
                    </TreeNode>
                  )
                })}
              </TreeSelect>
              <Button
                type="primary"
                style={{ marginRight: "24px", height: "40px", width: "88px" }}
                onClick={this.handerSubmit}
              >
                查询
              </Button>
              <Button
                style={{ height: "40px", width: "88px" }}
                onClick={this.random}
              >
                重置
              </Button>
            </div>
          )}
          <Spin spinning={loading}>
            <Table
              changePage={this.changePage}
              maxNumL={this.props.maxNumL}
              productTypeList={this.props.productTypeList}
              api={this.props.api}
              dataList={this.props.dataList}
              currentPage={this.state.currentPage}
              addproduct={this.props.addproduct}
              selectList={this.props.selectList}
            />
          </Spin>
        </div>
      </div>
    )
  }
}
function mapStateToProps(state) {
  const { productTypeList, dataList, maxNumL } = state.storeAdjustment
  return { productTypeList, dataList, maxNumL }
}
export default connect(mapStateToProps)(addProduct)
