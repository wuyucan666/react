import { Component } from "react"
import PropTypes from "prop-types"
import { connect } from "dva"
import { message } from 'antd'
import CommonTable from "../../../components/CommonTable/index"
import Add from "./add"
import tableConfig from "./tableConfig"
import services from "../../../services"
import Tkbox from './Tkbox.js'

let init = true

class projectStore extends Component {
  state = {
    visible: false,
    type: "",
    count: 0,
    category: "",
    statusTem: "",
    visibleTkbox: false,
    projectId: [],
  }
  componentDidMount() {
    this.props.dispatch({ type: "projectStore/getType" })
    this.props.dispatch({ type: "projectStore/getMaintain" })
    this.props.dispatch({ type: "projectStore/getUnitList" })
    this.setNotPrice()
    // 添加急件
    const { isAdding, lastActive } = this.props
    if (isAdding && lastActive === 2) {
      this.setState({
        visible: true,
        type: "add",
      })
    }
  }
  componentWillUnmount(){
    this.onReset()
    init = true
  }
  /**
   * 品牌商项目未设置价格的数量
   */
  setNotPrice = () => {
    services.LIST({
      keys: { name: 'store/project/list' },
      data: { q: { "page": -1, "limit": -1, "where": { "formTem": 1, 'priceTem': '' } } },
    }).then((res) => {
      window.localStorage.brandProjectNotPrice = res.list.length
    })
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
  onTableChange = (e, v, ids) => {
    const { dispatch } = this.props
    if (e === 217) {
      dispatch({ type: "projectStore/edit", payload: {} })
      this.showModal()
      this.setState({
        type: "add",
      })
    }
    if (e === 11) {
      dispatch({ type: "projectStore/edit", payload: {...v, salesType: v.salesType*1, roadWorkType: v.roadWorkType *1} })
      this.showModal()
      this.setState({
        type: "edit",
      })
    }
    if (e === 218) {
      // 批量
      if (ids.projectId.length > 0) {
        this.setState({ projectId: ids.projectId })
        this.setState({ visibleTkbox: true })
      } else {
        message.warning('请选择！')
      }
    }
  }
  /**批量 */
  hideModalTkbox = (edit) => {
    const { dispatch } = this.props
    if (edit) {
      // 刷新数据
      dispatch({
        type: 'table/getData',
        payload: "store/project",
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
      projectList,
      category,
      maintaintype,
    } = this.props
    tableConfig.screen.rules[2].list = [...projectList]
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
          <div style={{ display: this.state.visible ? 'none' : '' }}>
            {!!tableConfig.screen.rules[2].list.length && <CommonTable
              name="store/project"
              tableConfig={tableConfig}
              refresh
              onTableChange={this.onTableChange}
              onReSet={this.onReset}
            />}
            {this.state.visibleTkbox && <Tkbox
              visible={this.state.visibleTkbox}
              hideModal={this.hideModalTkbox}
              projectId={this.state.projectId}
            />}
          </div>
          <div style={{ display: this.state.visible ? '' : 'none' }}>
            <Add
              visible={this.state.visible}
              setNotPrice={this.setNotPrice}
              hideModal={this.hideModal.bind(this)}
              showModal={this.showModal}
              dispatch={dispatch}
              editItem={editItem}
              projectList={projectList}
              type={this.state.type}
              isAdding={this.props.isAdding}
              backRoute={this.props.backRoute}
              category={category}
              maintaintype={maintaintype}
            />
          </div>
        </div>
      )
  }
}

projectStore.propTypes = {
  dispatch: PropTypes.func,
}

function mapStateToProps(state) {
  const {
    editItem,
    projectList,
    category,
    maintaintype,
  } = state.projectStore
  const { isAdding, lastActive, backRoute } = state.app
  return {
    editItem,
    projectList,
    isAdding,
    lastActive,
    backRoute,
    category,
    maintaintype,
  }
}

export default connect(mapStateToProps)(projectStore)
