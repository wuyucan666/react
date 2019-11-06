import { Component } from "react"
import { connect } from "dva"
import {
  Table,
  Button,
  Select,
  Icon,
  Input,
  Cascader,
  message,
  InputNumber,
} from "antd"
import styles from "./styles.less"
import Tabbar from "../../../components/Tabbar"
import services from "../../../services"
const Option = Select.Option
class stockTakingAdd extends Component {
  state = {
    visible: false,
    type: "",
    data: [],
    totalSize: 0,
    page: 1,
    totalPage: 1,
    columns: [
      {
        title: "序号",
        dataIndex: "key",
        width: 80,
        align: "center",
      },
      {
        title: "商品名称",
        dataIndex: "name",
        width: "14%",
        align: "center",
      },
      {
        title: "规格",
        dataIndex: "spec",
        width: "9%",
        align: "center",
      },
      {
        title: "编码",
        dataIndex: "code",
        width: "9%",
        align: "center",
      },
      {
        title: "商品分类",
        dataIndex: "categoryName",
        width: "9%",
        align: "center",
      },
      {
        title: "仓库",
        dataIndex: "warehouseName",
        width: "14%",
        align: "center",
      },
      {
        title: "库存",
        dataIndex: "number",
        width: "9%",
        align: "center",
      },
      {
        title: "盘点数量",
        key: "inventoryNum",
        width: "9%",
        align: "center",
        render: (text, record) => (
          <InputNumber
            className="member_card_from"
            formatter={value => `${value}`.replace(/[^\d]+/g, "")}
            defaultValue={text.inventoryNum}
            onChange={this.onChangeValue.bind(this, record.key)}
          />
        ),
      },
      {
        title: "盘盈盘亏",
        key: "changeNum",
        width: "9%",
        align: "center",
        render: text => {
          if (parseFloat(text.changeNum) < 0) {
            return <span style={{ color: "#FF6F28" }}>{text.changeNum}</span>
          } else if (parseFloat(text.changeNum) > 0) {
            return <span style={{ color: "#41B035" }}>+{text.changeNum}</span>
          } else {
            return <span>{text.changeNum}</span>
          }
        },
      },
      {
        title: "备注",
        key: "remarks",
        align: "center",
        render: (text, record) => (
          <Input
            defaultValue={text.remarks}
            onChange={this.onChangeRemark.bind(this, record.key)}
          />
        ),
      },
    ],
    checked: true,
    inventoryN: 0,
    categoryId: "",
    warehouseId: "",
    loading: false,
  }
  // 返回
  returnBtn() {
    this.props.returnBtn()
  }
  // 备注
  onChangeRemark = (index, e) => {
    let arr = this.state.data
    arr[index - 1].remarks = e.target.value
    this.setState({
      data: arr,
    })
  }
  // 盘点数量
  onChangeValue = (index, e) => {
    let arr = this.state.data
    arr[index - 1].inventoryNum = parseInt(e)
    arr[index - 1].changeNum = e ? parseInt(e) - parseInt(arr[index - 1].number) : ""
    if(e === 0 || (e && e*1 === 0)) {
      arr[index - 1].changeNum = 0 - parseInt(arr[index - 1].number)
    }
    this.setState({
      data: arr.map(_ => ({..._})),
    })
    this.toCalculate()
  }
  // 计算盘点的条数
  toCalculate() {
    let l = this.state.data.filter(_ => _.inventoryNum || _.inventoryNum === 0)
    this.setState({
      inventoryN: l.length,
    })
  }
  // 请求商品列表
  componentDidMount() {
    const { type, editItem } = this.props
    if (type === "edit") {
      services
        .DETAIL({
          keys: { name: "store/stocktakingInfo", id: editItem.stocktakingId },
        })
        .then(res => {
          let data = res.list.map((v, index) => ({
            ...v,
            key: index + 1,
            number: v.goodsNum,
            changeNum: parseInt(v.inventoryNum, 10) - parseInt(v.goodsNum, 10),
          }))
          this.setState({
            data: data,
          })
          this.toCalculate()
        })
      return false
    }
    this.getData(1)
    document
      .querySelector(".ant-table-body")
      .addEventListener("scroll", this.scrollFn)
  }
  /**
   * 获取数据
   */
  getData = q => {
    let qu = {
      page: q,
      limit: 20000,
      where: {
        warehouseId: this.state.warehouseId
          ? this.state.warehouseId
          : undefined,
        "warehouseId[!]": this.state.warehouseId ? undefined : 0,
        categoryId: this.state.categoryId ? this.state.categoryId : undefined,
      },
    }
    services.getTypeGoods({ data: { q: qu } }).then(res => {
      let d = res.list.filter(v => v.warehouseId)
      let data = d.map((v, index) => ({ ...v, key: index + 1 }))
      let stataAll = []
      if (this.state.page === 1) {
        this.setState({
          data: data,
          totalSize: res.totalSize,
          totalPage: res.totalPage,
        })
      } else {
        stataAll = [...this.state.data]
        let l = this.state.data.length
        data.forEach((v, index) => {
          stataAll.push({ ...v, key: l + index + 1 })
        })
        this.setState({
          data: stataAll,
          totalSize: res.totalSize,
        })
      }
    })
  }
  /**
   * 滚动加载
   */
  scrollFn = e => {
    let l = document.querySelector(".ant-table-tbody").offsetHeight - 540
    if (
      e.srcElement.scrollTop === l &&
      this.state.page < this.state.totalPage
    ) {
      let page = this.state.page + 1
      this.setState({
        page: page,
      })
      this.getData(page)
    }
  }
  // 筛选分类
  onChangeCategory = e => {
    this.setState({
      categoryId: e[e.length - 1],
    })
  }
  // 筛选仓库
  onChangeWarehouse = e => {
    this.setState({
      warehouseId: e,
    })
  }
  // 查询
  theQuery = () => {
    this.setState({
      page: 1,
    })
    this.getData(1)
  }
  // 刷新
  reloadBtn = () => {
    this.setState({
      page: 1,
    })
    this.getData(1)
  }
  // 提交
  stockPrimary() {
    if(this.state.loading) {
      return false
    }
    let data = []
    this.setState({loading: true})
    const { type } = this.props
    this.state.data.forEach(_ => {
      if (_.inventoryNum || _.inventoryNum===0) {
        data.push({
          productId: _.productId,
          inventoryNum: _.inventoryNum,
          num: _.changeNum > 0 ? _.changeNum : 0,
          changeNum: _.changeNum < 0 ? _.changeNum - _.changeNum * 2 : 0,
          remarks: _.remarks ? _.remarks : 0,
          stocktakingInfoId: _.stocktakingInfoId,
          warehouseId: _.warehouseId ? _.warehouseId : 0,
        })
      }
    })
    if (data.length === 0) {
      return message.error("请输入正确的盘点数!")
    }
    if (type === "edit") {
      services
        .stocktakingInsert({
          keys: { name: "store/stocktakingInfo/updates" },
          data: { product: data },
        })
        .then(res => {
          this.setState({loading: false}, ()=> {
            if (res.code === "0") {
              this.returnBtn(true)
            } else {
              message.error("修改失效!")
            }
          })
        })
    } else {
      services
        .stocktakingInsert({
          keys: { name: "store/stocktaking" },
          data: { product: data },
        })
        .then(res => {
          this.setState({loading: false}, ()=> {
            if (res.code === "0") {
              this.returnBtn(true)
            } else {
              message.error("添加失效!")
            }
          })
        })
    }
  }
  // <div className={styles.checked}>
  //           <Checkbox checked={this.state.checked}><span style={{color: '#333'}}>仅显示“已盘点商品”</span></Checkbox>
  //         </div>
  render() {
    const { warehouseList, category, type } = this.props
    return (
      <div className={styles.stockBg}>
        <div className={styles.stockTop}>
          <div className={styles.left} onClick={this.returnBtn.bind(this)}>
            <Button size="large">
              <Icon type="left" style={{ color: "#CCCCCC" }} />
              返回列表
            </Button>
          </div>
          {type === "edit" ? (
            ""
          ) : (
              <div className={styles.category}>
                <Cascader
                  onChange={this.onChangeCategory}
                  size="large"
                  style={{ width: 200 }}
                  placeholder="默认"
                  options={category}
                  expandTrigger="hover"
                />
              </div>
            )}
          {type === "edit" ? (
            ""
          ) : (
              <div className={styles.warehouse}>
                <Select
                  style={{ width: 200 }}
                  size="large"
                  placeholder="仓库"
                  onChange={this.onChangeWarehouse}
                  allowClear={true}
                >
                  {warehouseList.map(v => {
                    return (
                      <Option key={v} value={v.warehouseId}>
                        {v.warehouseName}
                      </Option>
                    )
                  })}
                </Select>
              </div>
            )}
          {type === "edit" ? (
            ""
          ) : (
              <div className={styles.select}>
                <Button
                  size="large"
                  type="primary"
                  onClick={this.theQuery.bind(this)}
                >
                  查询
              </Button>
              </div>
            )}
          {/* {type === "edit" ? (
            ""
          ) : (
              <div className={styles.reload} onClick={this.reloadBtn}>
                <i className="iconfont icon-shuaxin" />
              </div>
            )} */}
        </div>
        <Table
          columns={this.state.columns}
          dataSource={this.state.data}
          pagination={false}
          scroll={{ y: 540 }}
        />
        <Tabbar>
          <div className={styles.stockFoot}>
            <div className={styles.stockTi}>
              已盘点{this.state.inventoryN} / 总数{this.state.totalSize}
            </div>
            <div className={styles.stockNote}>
              注：请勿在盘点完成前进行出入库操作。
            </div>
            <div
              className={styles.stockPrimary}
              onClick={this.stockPrimary.bind(this)}
            >
              <Button type="primary">提交</Button>
            </div>
          </div>
        </Tabbar>
      </div>
    )
  }
}

export default connect(({ table }) => ({ table }))(stockTakingAdd)
