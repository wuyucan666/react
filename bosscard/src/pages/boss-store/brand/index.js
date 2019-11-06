import { Component } from "react"
import CommonTable from "../../../components/CommonTable/index"
import { connect } from "dva"
import Add from "./add"
import tableConfig from "./tableConfig"
class brand extends Component {
  state = {
    showAdd: false,
    type: "",
    arr: [],
    category: "",
    statusTem: "",
  }
  hideModal() {
    const { dispatch } = this.props
    dispatch({
      type: "brand/emptyBank",
    })
    this.setState({
      showAdd: false,
    })
  }
  // 操作
  onTableChange(e, v) {
    const { dispatch } = this.props
    if (e === 217) {
      dispatch({
        type: "brand/edit",
        payload: { editItem: {}, type: "add" },
      })
      this.setState({
        showAdd: true,
        type: "add",
      })
    }
    if (e === 11) {
      dispatch({
        type: "brand/edit",
        payload: { editItem: v, type: "edit" },
      })
      this.setState({
        showAdd: true,
        type: "edit",
      })
    }
  }
  componentDidMount() {
    // this.props.dispatch({ type: "brand/getRole", payload: {} })
  }
  render() {
    const { dispatch, editItem, bank } = this.props
    return  (
      <div>
        <div style={{ display: this.state.showAdd ? '' : 'none' }}>
          <Add
            hideModal={this.hideModal.bind(this)}
            dispatch={dispatch}
            type={this.state.type}
            editItem={editItem}
            bank={bank}
            showAdd={this.state.showAdd}
          />
        </div>
        <div style={{ display: this.state.showAdd ? 'none' : '' }}>
          <CommonTable
            name="store/supplier"
            tableConfig={tableConfig}
            onTableChange={this.onTableChange.bind(this)}
            search="supplierName"
          />
        </div>
      </div>
      )
  }
}
function mapStateToProps(state) {
  const { editItem, type, bank } = state.brand
  return { editItem, type, bank }
}
export default connect(mapStateToProps)(brand)
