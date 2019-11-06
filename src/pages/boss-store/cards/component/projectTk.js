import { Component } from "react"
import { Modal, InputNumber, message, Select } from "antd"
import { __PROJECT_TYPE__ } from "utils/globalConfig"
import services from "services"

import style from "./style.less"

const Option = Select.Option

class projectTk extends Component {
  constructor(props) {
    super(props)

    this.state = {
      visible: props.visible, // 显示状态
      list: [], //项目 产品列表
      checkList: [], //已选列表
      apiType:
        props.type === __PROJECT_TYPE__
          ? "store/project"
          : "store/order/product",
      nameType: props.type === __PROJECT_TYPE__ ? "projectName" : "productName",
      idType: props.type === __PROJECT_TYPE__ ? "projectId" : "productId",
      page: 1,
      total: 1,
      isBottom: false,
      nowTop: 0,
      isSearch: false,
      value: '',
    }
  }

  getData (val = "",scrollTop=0){
    const { apiType, nameType } = this.state
    if (!this.state.isSearch) {
      services
        .list({
          data: { q: { page: this.state.page, limit: "50" } },
          keys: { name: apiType },
        })
        .then(res => {
          const { list } = res
          // console.log("我是不搜索res!", res)
          this.setState({
            list: [...this.state.list,...list.filter(v => v.isSystem * 1 !== 1)],
            checkList: this.props.defaultItem,
            total: res.totalPage,
          })
        })
    } else {
      var where =
        nameType === "projectName"
          ? { "projectName[~]": val }
          : { "commodityCode[~]|productName[~]": val }
      services
        .list({
          data: { q: { page: this.state.page, limit: "50", where } },
          keys: { name: apiType },
        })
        .then(res => {
          const { list } = res
          // console.log("我是搜索res!", res)
          this.setState({
            list: [...this.state.list,...list.filter(v => v.isSystem * 1 !== 1)],
            checkList: this.props.defaultItem,
            total: res.totalPage,
            nowTop: scrollTop,
          })
        })
    }
  }

  componentDidMount() {
    this.getData()
  }

  inputChage = (e, item) => {
    if (e > 10 && item.discountType * 1 === 1) {
      message.error("设置折扣不可大于10!")
    }
    const { checkList, idType } = this.state
    let idx = checkList.findIndex(v => v[idType] === item[idType])
    checkList[idx].discount = e
    this.setState({
      checkList,
    })
  }

  delItem = item => {
    let { checkList, idType } = this.state
    let idx = checkList.findIndex(v => v[idType] === item[idType])
    checkList.splice(idx, 1)
    this.props.deleteHandle(item, this.props.propty)
    this.setState({
      checkList,
    })
  }

  handleOk = () => {
    const { checkList } = this.state
    const { hideModal, onOk } = this.props
    let canSumit = true
    checkList.forEach(v => {
      if (!v.discount) {
        canSumit = false
      }
    })
    if (!canSumit) {
      message.error("请设置折扣/会员价!")
      return false
    }
    onOk(checkList)
    hideModal()
  }

  handleChange = e => {
    e = e.split('&')[0]
    let { list, nameType, idType, checkList } = this.state
    let item = list.find(v => v[nameType] === e)
    let idx = checkList.findIndex(v => v[idType] === item[idType])
    if (idx === -1) {
      checkList.push({ ...item, discount: "", discountType: 1 })
    } else {
      message.error(
        `所选${this.props.type === __PROJECT_TYPE__ ? "项目" : "产品"}已存在`
      )
    }
    this.setState({
      checkList,
    })
  }

  handleSelect = (e, item) => {
    // console.log("handleselect")
    let { checkList, idType } = this.state
    checkList.map(v => {
      if (v[idType] === item[idType]) {
        v.discountType = e
      }
      return v
    })
    this.setState({
      checkList,
    })
  }

  popupScroll = (e) => {
    e.persist()
    let target = e.target
    if (target.scrollTop + target.offsetHeight === target.scrollHeight) {
      const {page, total, value} = this.state
      if(page < total){
        this.setState({
          page: page + 1,
        },()=>{
          this.getData(value)
        })
      }
    }
  }

  handleSearch(val) {
    this.setState({page: 1, list: [], isSearch:true},()=>{
      this.getData(val)
    })
  }


  render() {
    const { list, nameType, checkList, idType, value } = this.state
    return (
      <div>
        <Modal
          width={900}
          visible={this.state.visible}
          title={this.props.type === __PROJECT_TYPE__ ? "选择项目" : "选择产品"}
          onCancel={() => {
            this.props.hideModal()
          }}
          onOk={this.handleOk}
        >
          <div className={style["project-content"]}>
            <div className={style.serach}>
              <Select
                size="large"
                showSearch
                showArrow={true}
                onChange={this.handleChange}
                defaultActiveFirstOption={false}
                filterOption={false}
                style={{ width: 400 }}
                value={value || undefined}
                onSearch={this.handleSearch.bind(this)}
                onFocus={()=>{this.setState({list:[],page:1},()=>{this.getData()})}}
                placeholder={
                  this.props.type === __PROJECT_TYPE__ ? "选择项目" : "选择产品"
                }
                getPopupContainer={trigger => trigger.parentNode}
                onPopupScroll={this.popupScroll}
              >
                {list.map((_, index) => (
                  <Option key={_[nameType] + '&' + index} self={_[idType]}>
                    {_[nameType]}
                  </Option>
                ))}
              </Select>
            </div>
            <div className={style.table}>
              <div className={style.tit}>
                <span>{this.props.type === __PROJECT_TYPE__ ? "已选项目" : "已选产品"}</span>
                <span>原价</span>
                <span>折扣/会员价</span>
              </div>
              <div className={style.list}>
                {checkList.length > 0 ? (
                  checkList.map((v, i) => {
                    return (
                      <div key={i}>
                        <span>{v[nameType]}</span>
                        <span>￥{v.price}</span>
                        <span>
                          <Select
                            value={String(v.discountType)}
                            style={{ width: 80, marginRight: 4 }}
                            onChange={e => this.handleSelect(e, v)}
                          >
                            <Option key={"1"}>折扣</Option>
                            <Option key={"2"}>会员价</Option>
                          </Select>
                          <InputNumber
                            min={0}
                            max={v.discountType * 1 === 1 ? 10 : 999999}
                            size="small"
                            style={{ width: 60 }}
                            onChange={e => this.inputChage(e, v)}
                            value={v.discount}
                          />
                          {
                            v.discountType*1 === 1 ? '折' : '元'
                          }
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
        </Modal>
      </div>
    )
  }
}

export default projectTk
