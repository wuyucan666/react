import { Component } from "react"
import PropTypes from "prop-types"
import { connect } from "dva"
import CommonTable from "../../../components/CommonTable/index"
import Add from "./add"
import tableConfig from "./tableConfig"

class projectAdditionalBrand extends Component {
  state = {
    visible: false,
    type: "",
    count: 0,
    category: "",
    statusTem: "",
  }
  componentDidMount() {
    this.props.dispatch({ type: "projectAdditionalBrand/getType" })
  }
  showModal = () => {
    this.setState({
      visible: true,
    })
  }

  hideModal = () => {
    this.setState({
      visible: false,
    })
  }
  // 操作
  onTableChange = (e, v) => {
    const { dispatch } = this.props
    if (e === 217) {
      dispatch({ type: "projectAdditionalBrand/edit", payload: {} })
      this.showModal()
      this.setState({
        type: "add",
      })
    }
    if (e === 11) {
      dispatch({ type: "projectAdditionalBrand/edit", payload: v })
      this.showModal()
      this.setState({
        type: "edit",
      })
    }
  }

  render() {
    const { dispatch, editItem, maintaintype } = this.props
    tableConfig.screen.rules[2].list = maintaintype
    return (
      <div>
        <div style={{display:this.state.visible?'none':''}}>
        <CommonTable
          New
          name="brand/project/addition"
          tableConfig={tableConfig}
          refresh
          onTableChange={this.onTableChange}
        />
        </div>
        <Add
          visible={this.state.visible}
          hideModal={this.hideModal.bind(this)}
          showModal={this.showModal}
          dispatch={dispatch}
          editItem={editItem}
          type={this.state.type}
          maintaintype={maintaintype}
        />
      </div>
    )
  }
}

projectAdditionalBrand.propTypes = {
  dispatch: PropTypes.func,
}

function mapStateToProps(state) {
  const { editItem, maintaintype } = state.projectAdditionalBrand
  return {
    editItem,
    maintaintype,
  }
}

export default connect(mapStateToProps)(projectAdditionalBrand)
