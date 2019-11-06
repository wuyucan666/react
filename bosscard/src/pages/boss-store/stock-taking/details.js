import { Component } from "react"
import { connect } from "dva"
import { Table, Button, Select, Icon, Cascader, message } from "antd"
import styles from "./styles.less"
import Tabbar from "../../../components/Tabbar"
import services from "../../../services"
import hasPermission from '../../../utils/hasPermission'

const Option = Select.Option
class stockTakingAdd extends Component {
  state = {
    visible: false,
    type: "",
    data: [],
    alldata: [],
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
        dataIndex: "inventoryNum",
        width: "9%",
        align: "center",
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
        dataIndex: "remarks",
        align: "center",
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
  // 计算盘点的条数
  toCalculate() {
    let l = this.state.data.filter(_ => _.inventoryNum)
    this.setState({
      inventoryN: l.length,
    })
  }
  // 请求商品列表
  componentDidMount() {
    this.getData()
  }
  getData = () => {
    const { editItem } = this.props
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
          alldata: data,
        })
        this.toCalculate()
      })
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
    let d = []
    if (this.state.warehouseId && !this.state.categoryId) {
      d = this.state.alldata.filter(
        _ => _.warehouseId === this.state.warehouseId
      )
    }
    if (this.state.categoryId && !this.state.warehouseId) {
      d = this.state.alldata.filter(_ => _.categoryId === this.state.categoryId)
    }
    if (this.state.categoryId && this.state.warehouseId) {
      this.state.alldata.forEach(_ => {
        if (
          _.categoryId === this.state.categoryId &&
          _.warehouseId === this.state.warehouseId
        ) {
          d.push({ ..._ })
        }
      })
    }
    this.setState({
      data: d,
    })
  }
  // 刷新
  reloadBtn = () => {
    this.getData()
  }
  // 提交
  stockPrimary(num) {
    if(this.state.loading) {
      return false
    }
    const { editItem } = this.props
    this.setState({loading: true})
    services
      .stocktakingPut({
        keys: { name: "store/stocktaking", id: editItem.stocktakingId },
        data: { type: num },
      })
      .then(res => {
        this.setState({loading: false}, ()=>{
          if (res.code === "0") {
            this.props.returnBtn(true)
          } else {
            message.error("提交失效!")
          }
        })
      })
  }
  // <div className={styles.checked}>
  //           <Checkbox checked={this.state.checked}><span style={{color: '#333'}}>仅显示“已盘点商品”</span></Checkbox>
  //         </div>
  render() {
    const { warehouseList, category, status } = this.props
    return (
      <div className={styles.stockBg}>
        <div className={styles.stockTop}>
          <div className={styles.left} onClick={this.returnBtn.bind(this)}>
            <Button size="large">
              <Icon type="left" style={{ color: "#CCCCCC" }} />
              返回列表
            </Button>
          </div>
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
          <div className={styles.select}>
            <Button
              size="large"
              type="primary"
              onClick={this.theQuery.bind(this)}
            >
              查询
            </Button>
          </div>
          <div className={styles.reload} onClick={this.reloadBtn}>
            <i className="iconfont icon-shuaxin" />
          </div>
        </div>
        <Table
          columns={this.state.columns}
          dataSource={this.state.data}
          scroll={{ y: 540 }}
        />
        {
          hasPermission(87) && (
            <Tabbar>
              <div className={styles.stockFoot}>
                <div />
                <div
                  className={styles.stockPrimary}
                  onClick={this.stockPrimary.bind(this, 2)}
                >
                  <Button disabled={status === 0 ? false : true}>不通过</Button>
                </div>
                <div
                  className={styles.stockPrimary}
                  onClick={this.stockPrimary.bind(this, 1)}
                >
                  <Button type="primary" disabled={status === 1 ? true : false}>审核通过</Button>
                </div>
              </div>
            </Tabbar>
          )
        }
      </div>
    )
  }
}

export default connect(({ table }) => ({ table }))(stockTakingAdd)
