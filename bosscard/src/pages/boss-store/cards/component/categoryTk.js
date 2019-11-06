import { Component } from "react"
import { Modal, Tree, InputNumber, message, Spin } from "antd"
import { __PROJECT_TYPE__ } from "utils/globalConfig"
import { arrayToTreeData } from "utils"
import services from "services"

import style from "./style.less"

const { TreeNode } = Tree

class cagegoryTk extends Component {
  constructor(props) {
    super(props)

    this.state = {
      visible: props.visible, // 显示状态
      loading: true,
      autoExpandParent: true,
      list: [], //分类列表 未整合
      category: [], //分类列表
      checkList: [], //已选列表
      apiType:
        props.type === __PROJECT_TYPE__
          ? "store/projectcategory"
          : "store/productcategory",
    }
  }

  componentDidMount() {
    const { apiType } = this.state
    services.list({ data: {}, keys: { name: apiType } }).then((res) => {
      if (res.code === "0") {
        const { list } = res
        this.setState({
          list,
          loading: false,
          category: arrayToTreeData(list, "pId", "categoryId").children,
          checkList: this.props.defaultItem,
        })
      }
    })
  }

  onCheck = (e) => {
    const { list, checkList } = this.state
    let chooseList = e.map((v) => {
      let idx = list.findIndex((_) => Number(_.categoryId) === Number(v))
      v = list[idx]
      return v
    })
    chooseList = chooseList.map((v) => {
      let idx = checkList.findIndex(
        (_) => Number(_.categoryId) === Number(v.categoryId)
      )
      if (idx !== -1) {
        v = { ...v, discount: checkList[idx].discount }
      } else {
        v = { ...v, discount: "" }
      }
      return v
    })
    this.setState({
      checkList: chooseList,
    })
  }

  inputChage = (e, item) => {
    if (e > 10) {
      message.error("设置折扣不可大于10!")
    }
    const { checkList } = this.state
    let idx = checkList.findIndex((v) => v.categoryId === item.categoryId)
    checkList[idx].discount = e
    this.setState({
      checkList,
    })
  }

  delItem = (item) => {
    let { checkList } = this.state
    let idx = checkList.findIndex(v => v.categoryId === item.categoryId)
    checkList.splice(idx,1)
    this.props.deleteHandle(item)
    this.setState({
      checkList,
    })
  }

  handleOk = () => {
    const { checkList } = this.state
    const { hideModal, onOk } = this.props
    let canSumit = true
    checkList.forEach((v) => {
      if (!v.discount) {
        canSumit = false
      }
    })
    if (!canSumit) {
      message.error("请设置折扣!")
      return false
    }
    onOk(checkList)
    hideModal()
  }

  render() {
    const loop = (data) =>
      data.map((item) => {
        if (item.children && item.children.length) {
          return (
            <TreeNode
              key={item.categoryId}
              disableCheckbox
              title={item.categoryName}
            >
              {loop(item.children)}
            </TreeNode>
          )
        }
        return <TreeNode key={item.categoryId} title={item.categoryName} />
      })

    const checkedKeys = this.state.checkList.map((v) => {
      return v.categoryId
    })

    return (
      <div>
        <Modal
          width={900}
          visible={this.state.visible}
          title={
            this.props.type === __PROJECT_TYPE__
              ? "选择项目分类"
              : "选择产品分类"
          }
          onCancel={() => {
            this.props.hideModal()
          }}
          onOk={this.handleOk}
        >
          <Spin spinning={this.state.loading}>
            <div className={style.content}>
              <div className={style.left}>
                <div>
                  {this.props.type === __PROJECT_TYPE__
                    ? "项目分类"
                    : "产品分类"}
                </div>
                <div>
                  {this.state.category.length > 0 && (
                    <Tree
                      showLine
                      checkable
                      autoExpandParent
                      checkedKeys={checkedKeys}
                      onCheck={this.onCheck}
                    >
                      {loop(this.state.category)}
                    </Tree>
                  )}
                </div>
              </div>
              <div className={style.right}>
                <div className={style.tit}>
                  <span>已选分类</span>
                  <span>折扣</span>
                </div>
                <div className={style.list}>
                  {this.state.checkList.length > 0 ? (
                    this.state.checkList.map((v, i) => {
                      return (
                        <div key={i}>
                          <span>{v.categoryName}</span>
                          <span>
                            <InputNumber
                              min={0}
                              max={10}
                              size="small"
                              style={{ width: 60 }}
                              onChange={(e) => this.inputChage(e, v)}
                              value={v.discount}
                            />
                            折
                          </span>
                          <span onClick={() => this.delItem(v)}>
                            <i className="iconfont icon-shanchu" />
                          </span>
                        </div>
                      )
                    })
                  ) : (
                    <p
                      className="flex center animated fadeIn"
                      style={{ flexDirection: "column" }}
                    >
                      <img
                        style={{ marginTop: 120, width: 62, marginBottom: 12 }}
                        src="
                      data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhla
                      WdodD0iNDEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zy
                      I+CiAgPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAxKSIgZmlsbD0ibm9uZS
                      IgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgIDxlbGxpcHNlIGZpbGw9IiNGNUY1RjUiIGN
                      4PSIzMiIgY3k9IjMzIiByeD0iMzIiIHJ5PSI3Ii8+CiAgICA8ZyBmaWxsLXJ1bGU9Im5vbnplc
                      m8iIHN0cm9rZT0iI0Q5RDlEOSI+CiAgICAgIDxwYXRoIGQ9Ik01NSAxMi43Nkw0NC44NTQgMS4yNThDNDQuMzY3Lj
                      Q3NCA0My42NTYgMCA0Mi45MDcgMEgyMS4wOTNjLS43NDkgMC0xLjQ2LjQ3NC0xLjk0NyAxLjI1N0w5IDEyLjc2MVYyMmg0NnY
                      tOS4yNHoiLz4KICAgICAgPHBhdGggZD0iTTQxLjYxMyAxNS45MzFjMC0xLjYwNS45OTQtMi45MyAyLjIyNy0yLjkzMUg1NXYxOC4xMzdDNT
                      UgMzMuMjYgNTMuNjggMzUgNTIuMDUgMzVoLTQwLjFDMTAuMzIgMzUgOSAzMy4yNTkgOSAzMS4xMzdWMTNoMTEuMTZjMS4yMzMgMCAyLjIyNyAxLj
                      MyMyAyLjIyNyAyLjkyOHYuMDIyYzAgMS42MDUgMS4wMDUgMi45MDEgMi4yMzcgMi45MDFoMTQuNzUyYzEuMjMyIDAgMi4yMzctMS4zMDggMi4yMzctMi45MTN2LS4w
                      MDd6IiBmaWxsPSIjRkFGQUZBIi8+CiAgICA8L2c+CiAgPC9nPgo8L3N2Zz4K"
                        alt=""
                      />
                      <span style={{ fontSize: 12, color: "#999" }}>
                        暂无数据
                      </span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </Spin>
        </Modal>
      </div>
    )
  }
}

export default cagegoryTk
