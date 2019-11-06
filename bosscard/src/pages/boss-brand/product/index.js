import { Component } from "react"
import CommonTable from "../../../components/CommonTable"
import { connect } from "dva"
import Add from "./add"
import tableConfig from "./tableConfig"

let init = true 

class product extends Component {
  state = {
    showAdd: false,
    type: "",
    category: "",
    statusTem: "",
  }

  hideModal() {
    this.setState({
      showAdd: false,
    })
  }
  // 操作
  onTableChange(e, v) {
    const { dispatch } = this.props
    if (e === 217) {
      dispatch({ type: "product/edit", payload: {} })
      this.setState({
        showAdd: true,
        type: "add",
      })
    }
    if (e === 11) {
      dispatch({ type: "product/edit", payload: v })
      this.setState({
        showAdd: true,
        type: "edit",
      })
    }
  }
  componentDidMount() {
    this.props.dispatch({ type: "product/getRole", payload: {} })
    this.props.dispatch({ type: "product/getMaintain", payload: {} })
  }
  componentWillUnmount(){
    this.onReset()
    init = true
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
          { this.state.showAdd&&<Add
            hideModal={this.hideModal.bind(this)}
            dispatch={dispatch}
            type={this.state.type}
            editItem={editItem}
            category={category}
            productUnit={productUnit}
            maintaintype={maintaintype}
          />}
        <div style={{ display: this.state.showAdd ? 'none' : '' }}>
          <CommonTable
            name="brand/product"
            search="productName"
            tableConfig={tableConfig}
            onTableChange={this.onTableChange.bind(this)}
            onReSet={this.onReset}
          />
        </div>
      </div>
    )
  }
}
function mapStateToProps(state) {
  const { editItem, category, productUnit, maintaintype } = state.product
  return { editItem, category, productUnit, maintaintype }
}
export default connect(mapStateToProps)(product)
