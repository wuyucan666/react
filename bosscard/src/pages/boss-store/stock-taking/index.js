import { Component } from "react"
import CommonTable from "../../../components/CommonTable/index"
import { connect } from "dva"
import Add from "./add"
import Details from "./details"
import tableConfig from "./tableConfig"
import { Divider } from "antd"
class stockTaking extends Component {
  state = {
    show: 1,
    visible: false,
    type: "add",
    checked: true,
    dateFormat: "YYYY-MM-DD",
    created: "",
    status: "",
  }
  showModal = () => {
    this.setState({
      visible: true,
    })
  }
  // 返回
  returnBtn = (e) => {
    this.setState({
      show: 1,
    })
    if(e){
      const { dispatch } = this.props
      dispatch({
        type: 'table/getData',
        payload: {new: "store/stocktaking"},
      })
    }
  }
  returnBtnSt = () => {
    this.setState({
      show: 1,
    })
    const { dispatch } = this.props
    dispatch({
      type: 'table/getData',
      payload: {new: "store/stocktaking"},
    })
  }
  // 添加/编辑
  onTableChange = (e, v) => {
    const { dispatch } = this.props
    if (e === 217) {
      this.showModal()
      this.setState({
        show: 2,
        type: "add",
      })
    }
    if (e === 11) {
      dispatch({ type: "stockTaking/edit", payload: v })
      this.setState({
        show: 2,
        type: "edit",
      })
      this.showModal()
    }
    if (e === 14) {
      dispatch({ type: "stockTaking/edit", payload: v })
      this.setState({
        show: 3,
        type: "details",
        status: v.status,
      })
      this.showModal()
    }
  }
  componentDidMount() {
    this.props.dispatch({ type: "stockTaking/getRole", payload: {} })
  }
  render() {
    const { warehouseList, category, erpList, editItem } = this.props
    return  (
      <div>
        <div style={{display:this.state.show === 1 ?'':'none'}}><CommonTable
      New
      name="store/stocktaking"
      tableConfig={tableConfig}
      onTableChange={this.onTableChange}
    /></div>
     {this.state.show === 2&&(
      <Add
        type={this.state.type}
        editItem={editItem}
        warehouseList={warehouseList}
        erpList={erpList}
        category={category}
        returnBtn={this.returnBtnSt.bind(this)}
      />
    ) }
    {this.state.show===3&&(<Details
            type={this.state.type}
            editItem={editItem}
            warehouseList={warehouseList}
            erpList={erpList}
            category={category}
            status={this.state.status}
            returnBtn={this.returnBtn.bind(this)}
          />
        )}
      </div>
    )
  }
}

function mapStateToProps(state) {
  const {
    editItem,
    warehouseList,
    productList,
    category,
    erpList,
    staffList,
  } = state.stockTaking
  return { editItem, warehouseList, productList, category, erpList, staffList }
}

export default connect(mapStateToProps)(stockTaking)
