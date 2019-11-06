import { Component } from "react"
import PropTypes from "prop-types"
import { connect } from "dva"
import CommonTable from "../../../components/CommonTable/index"
import tableConfig from "./tableConfig"
import Tkbox from "./tkbox"
import services from "services"
import { arrayToTreeData } from "utils/index"
import Passw from './passw.js'

class shop extends Component {
  state = {
    visible: false,
    type: "",
    tableConfig: {},
    passwvisible: false,
    item: {},
  }

  componentDidMount() {
    this.props.dispatch({ type: "shop/getShopType" })
    this.props.dispatch({ type: "shop/getAreaList" })
    this.props.dispatch({ type: "shop/getRoleList" })
    this.setTableConfig()
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

  onTableChange = (e, v) => {
    const { dispatch } = this.props
    if (e === 217) {
      dispatch({
        type: "shop/edit",
        payload: {},
      })
      this.showModal()
      this.setState({
        type: "add",
      })
    }
    if (e === 11) {
      dispatch({
        type: "shop/edit",
        payload: {
          ...v,
          storeTel: v.storeTel === "0" ? undefined : v.storeTel,
        },
      })
      this.showModal()
      this.setState({
        type: "edit",
      })
    }
    if (e === 132) {
      // 重置密码
      this.setState({
        item: v,
      }, () => {
        this.setState({
          passwvisible: true,
        })
      })
    }
  }

  /** 获取品牌商区域列表 */
  getAreaList() {
    return services.list({ keys: { name: "brand/area" } }).then((res) => {
      if (res.code === "0") {
        return arrayToTreeData(
          res.list.map((_) => ({
            label: _.blockName,
            value: _.areaId,
            pId: _.pId,
          })),
          "pId",
          "value",
          0
        )
      } else {
        return []
      }
    })
  }

  /**
   * 获取门店分类
   */
  getStoreCatogry() {
    return services.list({ keys: { name: "brand/storetype" } }).then((res) => {
      if (res.code === "0") {
        return res.list.map((_) => ({
          name: _.storeTitle,
          value: _.storeTypeId,
        }))
      } else {
        return []
      }
    })
  }

  /**设置tableconfig */
  async setTableConfig() {
    const { children } = await this.getAreaList()
    const types = await this.getStoreCatogry()

    tableConfig.screen.rules[1].list = children
    tableConfig.screen.rules[2].list = types
    this.setState({
      tableConfig,
    })
  }
  // 重置密码
  passwhideModal=(e)=> {
    const {dispatch} = this.props
    this.setState({
      passwvisible: false,
    })
    if(e) {
      // 刷新
      dispatch({
        type: "table/getData",
        payload: "brand/store",
      })
    }
  }

  render() {
    const { dispatch, editItem, areaList, roleList } = this.props
      return (
        <div>
          <div style={{ display: this.state.visible ? 'none' : '' }}>
            <CommonTable
              name="brand/store"
              refresh
              tableConfig={this.state.tableConfig}
              onTableChange={this.onTableChange}
            />
          </div>
            {this.state.visible&&<Tkbox
              visible={this.state.visible}
              hideModal={this.hideModal.bind(this)}
              showModal={this.showModal}
              dispatch={dispatch}
              editItem={editItem}
              areaList={areaList}
              roleList={roleList}
              type={this.state.type}
            />}
          <Passw
          visible={this.state.passwvisible}
          hideModal={this.passwhideModal.bind(this)}
          dispatch={dispatch}
          name={this.state.item && this.state.item.storeName}
          id={this.state.item && this.state.item.storeId}
          ></Passw>
        </div>
      )
  }
}

shop.propTypes = {
  dispatch: PropTypes.func,
}

function mapStateToProps(state) {
  const { editItem, areaList, roleList } = state.shop
  return { editItem, areaList, roleList }
}

export default connect(mapStateToProps)(shop)
