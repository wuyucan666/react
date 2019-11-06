import { Component } from "react"
import CommonTable from "../../../components/CommonTable/index"
import { connect } from "dva"
import { message } from 'antd'
import Add from "./add"
import tableConfig from "./tableConfig"
import services from "../../../services"
import Tkbox from './Tkbox.js'

let init = true

class storeproduct extends Component {
  state = {
    showAdd: false,
    type: "",
    arr: [],
    category: "",
    statusTem: "",
    visibleTkbox: false,
    productId: [],
  }
  hideModal() {
    this.setState({
      showAdd: false,
    })
  }
  // 操作
  onTableChange(e, v, ids) {
    const { dispatch } = this.props
    if (e === 217) {
      dispatch({ type: "storeproduct/edit", payload: {} })
      this.setState({
        showAdd: true,
        type: "add",
      })
    }
    if (e === 11) {
      dispatch({ type: "storeproduct/edit", payload: {...v, salesType: v.salesType*1, roadWorkType: v.roadWorkType *1} })
      this.setState({
        showAdd: true,
        type: "edit",
      })
    }
    if (e === 218) {
      // 批量
      if (ids.productId.length > 0) {
        this.setState({ productId: ids.productId })
        this.setState({ visibleTkbox: true })
      } else {
        message.warning('请选择！')
      }
    }
  }
  componentDidMount() {
    this.props.dispatch({ type: "storeproduct/getRole", payload: {} })
    this.setNotPrice()
    // 添加急件
    const { isAdding, lastActive } = this.props
    if (isAdding && lastActive === 3) {
      this.setState({
        showAdd: true,
        type: "add",
      })
    }
  }
  componentWillUnmount(){
    this.onReset()
    init = true
  }
  /**
   * 品牌商产品未设置价格的数量
   */
  setNotPrice = () => {
    services.LIST({
      keys: { name: 'store/product/list' },
      data: { q: { "page": -1, "limit": -1, "where": { "formTem": 1, 'sellingPriceTem': '' } } },
    }).then((res) => {
      window.localStorage.brandProductNotPrice = res.list?res.list.length:0
    })
  }
  /**批量 */
  hideModalTkbox = (edit) => {
    const { dispatch } = this.props
    if (edit) {
      // 刷新数据
      dispatch({
        type: 'table/getData',
        payload: "store/product",
      })
    }
    this.setState({ visibleTkbox: false })
  }
  onReset = () => {
    if(!init){
      tableConfig.screen.rules[2].value = undefined
      delete tableConfig.screen.query.categoryId
    }
  }
  render() {
    const {
      dispatch,
      editItem,
      category,
      productUnit,
      maintaintype,
      miningData,
    } = this.props
    tableConfig.screen.rules[2].list = [...category]
    const {query} = this.props.history.location
    if(init && query && query.categoryId){
      init = false
      const categoryId = []
      const list = tableConfig.screen.rules[2].list
      for(let i = 0; i < list.length; i++){
        if(list[i].categoryId === Number(query.categoryId)){
          categoryId.push(Number(query.categoryId))
          break
        }else {
          const children = list[i].children || []
          for(let j = 0; j < children.length; j++){
            if(children[j].categoryId === Number(query.categoryId)){
              categoryId.push(list[i].categoryId, children[j].categoryId)
            }
          }
        }
      }
      tableConfig.screen.rules[2].value = categoryId
      tableConfig.screen.query = {...tableConfig.screen.query, categoryId:Number(query.categoryId)}
    }
    return (
      <div>
        {this.state.showAdd&&(
          <Add
            hideModal={this.hideModal.bind(this)}
            setNotPrice={this.setNotPrice}
            dispatch={dispatch}
            type={this.state.type}
            editItem={editItem}
            category={category}
            productUnit={productUnit}
            isAdding={this.props.isAdding}
            maintaintype={maintaintype}
            changevisible={this.changevisible}
            miningData={miningData}
          />
        )}
        <div style={{display:this.state.showAdd?'none':''}}>
          <CommonTable
            scroll={true}
            name="store/product"
            onTableChange={this.onTableChange.bind(this)}
            tableConfig={tableConfig}
            onReSet={this.onReset}
          />
          </div>
        {this.state.visibleTkbox && <Tkbox
          visible={this.state.visibleTkbox}
          hideModal={this.hideModalTkbox}
          productId={this.state.productId}
        />}
        
      </div>
    )
  }
}
function mapStateToProps(state) {
  const {
    editItem,
    category,
    productUnit,
    maintaintype,
  } = state.storeproduct
  const { isAdding, lastActive } = state.app
  const {miningData} = state.miningOutside
  return {
    editItem,
    category,
    productUnit,
    isAdding,
    lastActive,
    maintaintype,
    miningData,
  }
}
export default connect(mapStateToProps)(storeproduct)
