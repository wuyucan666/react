import { Component } from "react"
import PropTypes from "prop-types"
import { connect } from "dva"
import CommonTable from "../../../components/CommonTable/index"
import Add from "./add"
import tableConfig from "./tableConfig"

class projectAdditional extends Component {
  state = {
    visible: false,
    type: "",
    count: 0,
    category: "",
    statusTem: "",
  }
  componentDidMount() {
    this.props.dispatch({ type: "projectAdditional/getType" })
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
      this.showModal()
      this.setState({
        type: "add",
      })
    }
    if (e === 11) {
      dispatch({ type: "projectAdditional/edit", payload: v })
      this.showModal()
      this.setState({
        type: "edit",
      })
    }
  }

  render() {
    const { dispatch, editItem, maintaintype } = this.props
    tableConfig.screen.rules[2].list = maintaintype.length > 0 ? maintaintype : []
    return (
      <div>
       <div style={{display:this.state.visible?'none':''}}>
       <CommonTable
          name="store/project/addition"
          New
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

projectAdditional.propTypes = {
  dispatch: PropTypes.func,
}

function mapStateToProps(state) {
  const { editItem, maintaintype } = state.projectAdditional
  return {
    editItem,
    maintaintype,
  }
}

export default connect(mapStateToProps)(projectAdditional)
