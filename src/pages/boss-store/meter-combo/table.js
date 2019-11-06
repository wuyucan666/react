import { Component } from "react"
import { Button, Table, Select, InputNumber, message, Popover } from "antd"

import SelectProject from "components/SelectProject"
import ProjectTk from 'components/setPrice/project'
import ProductTk from 'components/setPrice/product'
import { __PROJECT_TYPE__, __PRODUCT_TYPE__ } from "utils/globalConfig"

import styles from "./style.less"
import "animate.css"

const Option = Select.Option

const DeleteBtn = ({ deleteItem, item }) => {
  return (
    <div
      className="rowbtns"
      style={{ position: "absolute", right: "20px", top: "0px", float: "left", cursor: 'pointer' }}
      onClick={() => deleteItem(item)}
    >
      <div
        className="animated zoomIn faster"
        style={{ margin: "-2px 0", borderRadius: "50%" }}
      >
        <i className="iconfont icon-shanchu" />
      </div>
    </div>
  )
}

const SelectNum = ({ num, changeNum, item, maxNum }) => {
  return num === 0 ? (
    <Select
      style={{ width: 70 }}
      defaultValue={0}
      onChange={(value) => changeNum(value, item, 'select')}
    >
      <Option value={1}>有限</Option>
      <Option value={0}>无限</Option>
    </Select>
  ) : (
    <div>
      <Select
        style={{ width: 70 }}
        defaultValue={1}
        onChange={(value) => changeNum(value, item, 'select')}
      >
        <Option value={1}>有限</Option>
        <Option value={0}>无限</Option>
      </Select>
      <InputNumber
        placeholder="请输入"
        onChange={(value) => changeNum(value, item, 'number')}
        precision={0}
        value={num}
        min={maxNum*1 === 1 ? 0 : 1}
        max={maxNum}
        style={{ width: 70, borderLeft: 0 }}
      />
    </div>
  )
}

const TableList = class extends Component {
  state = {
    showProject: false,
    showProduct: false,
    projectItem: [],
    productItem: [],
    recordsInfo: [],
    type: 0,
    goodNum: 0,
    goodAmount: 0,
    deleteArr: [],
    curItem: {},
    hasProject: JSON.parse(window.localStorage.getItem("permissionRole")).findIndex(v => v === 51) !== -1,
    hasProduct: JSON.parse(window.localStorage.getItem("permissionRole")).findIndex(v => v === 53) !== -1,
  }

  onOk(e) {
    const { isRandom } = this.props
    if (this.state.type === 1) {
      this.setState(
        {
          projectItem: e.map((v) => {
            let temp = this.state.projectItem.filter(
              (_) => _.projectId === v.projectId
            )
            if (temp.length > 0) {
              v = temp[0]
            } else {
              v = {
                ...v,
                goodId: v.projectId,
                goodName: v.projectName,
                type: 1,
                goodNum: isRandom ? 0 : 1, //随选卡默认无限
                goodPrice: v.priceTem,
                goodAmount: isRandom ? 0 : v.priceTem,
                infoId: 0,
              }
            }
            return v
          }),
        },
        () => {
          this.setState(
            {
              recordsInfo: this.state.projectItem.concat(
                this.state.productItem
              ),
            },
            () => {
              const { getRecordsInfo } = this.props
              getRecordsInfo(this.state.recordsInfo)
              this.coutAll()
            }
          )
        }
      )
    } else {
      this.setState(
        {
          productItem: e.map((v) => {
            let temp = this.state.productItem.filter(
              (_) => _.productId === v.productId
            )
            if (temp.length > 0) {
              v = temp[0]
            } else {
              v = {
                ...v,
                goodId: v.productId,
                goodName: v.productName,
                type: 2,
                goodNum: isRandom ? 0 : 1, //随选卡默认无限
                goodPrice: v.sellingPriceTem,
                goodAmount: isRandom ? 0 : v.sellingPriceTem,
                infoId: 0,
              }
            }
            return v
          }),
        },
        () => {
          this.setState(
            {
              recordsInfo: this.state.projectItem.concat(
                this.state.productItem
              ),
            },
            () => {
              const { getRecordsInfo } = this.props
              getRecordsInfo(this.state.recordsInfo)
              this.coutAll()
            }
          )
        }
      )
    }
  }

  Show(e) {
    if (e === 1) {
      this.setState({
        showProject: true,
        type: 1,
      })
    } else {
      this.setState({
        showProduct: true,
        type: 2,
      })
    }
  }

  hideModal() {
    this.setState({
      showProduct: false,
      showProject: false,
    })
  }

  coutAll = () => {
    let goodAmount = 0
    let goodNum = 0
    this.state.recordsInfo.forEach((e) => {
      goodAmount += e.goodAmount * 1
      goodNum += e.goodNum * 1
    })
    this.setState({
      goodAmount: goodAmount.toFixed(2),
      goodNum,
    })
  }

  onProjectRef = (ref) => {
    this.projectRef = ref
  }

  onProductRef = (ref) => {
    this.productRef = ref
  }

  changeNum = (value, item, type) => {
    const { isRandom, maxNum } = this.props
    if(type === 'number' && isRandom) { //随选卡 总次数大于单个服务最多次数
      if(!maxNum) {
        message.warn('请先输入总次数')
        return false
      }
      if(value >= maxNum) {
        message.warn('服务最多次数需小于卡总次数')
        value = maxNum - 1
      }
    } 
    if(type === 'number' && (!value)) {
      value = 1
    }
    this.setState(
      {
        recordsInfo: this.state.recordsInfo.map((v) => {
          if (v.goodId === item.goodId && v.type === item.type) {
            v.goodNum = value
            v.goodAmount = (value * v.goodPrice).toFixed(0)
          }
          return v
        }),
      },
      () => {
        const { getRecordsInfo } = this.props
        getRecordsInfo(this.state.recordsInfo)
        this.coutAll()
      }
    )
  }

  deleteItem(item) {
    const isEdit = this.props.type
    const { productItem, projectItem } = this.state
    if (isEdit === "edit") {
      let temp = this.state.deleteArr
      temp.push(item.infoId)
      this.setState({
        deleteArr: temp,
      })
    }

    this.setState(
      {
        recordsInfo: this.state.recordsInfo.filter(
          (v) => v.goodId !== item.goodId
        ),
      },
      () => {
        const { getRecordsInfo, getDeleArr } = this.props
        getRecordsInfo(this.state.recordsInfo)
        getDeleArr(this.state.deleteArr)
        this.coutAll()
      }
    )

    if (item.type === 1) {
      item.projectId = item.goodId
      console.log("---------------------project", item)
      this.projectRef.delSelectItem(item)
      this.setState({projectItem: projectItem.filter(v => v.projectId !== item.goodId)})
    } else {
      console.log("---------------------product", item)
      item.productId = item.goodId
      this.productRef.delSelectItem(item)
      this.setState({productItem: productItem.filter(v => v.productId !== item.goodId)})
    }
  }

  footer = () => {
    return (
      <div style={{ display: "flex", fontSize: "14px", fontWeight: "bold" }}>
        <span style={{ flex: 7.4 }}>合计</span>
        <span style={{ flex: 4 }}>{this.state.goodNum}</span>
        <span style={{ flex: 1.4 }}>{this.state.goodAmount}</span>
      </div>
    )
  }

  setPrice = (item) => {
    this.setState({showNew: true, curItem: {...item, name: item.goodName, id: item.goodId}})
  }

  closeTk = (isSuccess, item) => {
    this.setState({showNew: false})
    const { isRandom } = this.props
    if(isSuccess) {
      this.setState(
        {
          recordsInfo: this.state.recordsInfo.map((v) => {
            if (v.goodId === item.goodId) {
              v = {
                ...v,
                info: item.info,
                goodPrice: item.price,
                goodNum: isRandom ? 0 : 1,
                goodAmount: isRandom ? 0 : (item.price).toFixed(0),
              }
            }
            return v
          }),
        },
        () => {
          const { getRecordsInfo } = this.props
          getRecordsInfo(this.state.recordsInfo)
          this.coutAll()
        }
      )

      if (item.type === 1) {
        let projectItem = this.state.projectItem.map(v => {
          if(v.goodId === item.goodId) {
            v = {
              ...v,
              info: item.info,
              goodPrice: item.price,
              goodNum: isRandom ? 0 : 1,
              goodAmount: isRandom ? 0 : (item.price).toFixed(0),
            }
          }
          return v
        })
        this.setState({projectItem })
      } else {
        let productItem = this.state.productItem.map(v => {
          if(v.goodId === item.goodId) {
            v = {
              ...v,
              info: item.info,
              goodPrice: item.price,
              goodNum: isRandom ? 0 : 1,
              goodAmount: isRandom ? 0 : (item.price).toFixed(0),
            }
          }
          return v
        })
        this.setState({productItem })
      }
    }
  }

  componentWillMount() {
    const { editItem, type } = this.props
    let goodAmount = 0
    let goodNum = 0
    if (type === "edit") {
      editItem.recordsInfo.forEach((v) => {
        goodAmount += v.goodAmount * 1
        goodNum += v.goodNum * 1
      })
      this.setState({
        recordsInfo: editItem.recordsInfo,
      })
      this.setState(
        {
          projectItem: editItem.recordsInfo
            .filter((e) => e.type === 1)
            .map((v) => {
              v.projectId = v.goodId
              v.projectName = v.goodName
              return v
            }),
          productItem: editItem.recordsInfo
            .filter((e) => e.type === 2)
            .map((v) => {
              v.productId = v.goodId
              v.productName = v.goodName
              return v
            }),
        })
    }
    this.setState({
      goodAmount: goodAmount,
      goodNum: goodNum,
    })
  }

  render() {
    let projectProps = {
      type: __PROJECT_TYPE__,
      visible: this.state.showProject,
      selected: this.state.projectItem,
      onCancel: this.hideModal.bind(this),
      onOk: this.onOk.bind(this),
      onRef: this.onProjectRef,
    }

    let productProps = {
      type: __PRODUCT_TYPE__,
      visible: this.state.showProduct,
      selected: this.state.productItem,
      onCancel: this.hideModal.bind(this),
      onOk: this.onOk.bind(this),
      onRef: this.onProductRef,
    }
    const { isRandom, maxNum } = this.props
    const columns = [
      {
        title: "名称",
        dataIndex: "goodName",
        width: "24%",
        key: 'goodName',
        align: "left",
      },
      {
        title: "编码",
        dataIndex: "commodityCode",
        width: "14%",
        key: 'commodityCode',
        align: "left",
        render(text, item) {
          return (
            <div>
              {
                item.type === 1 ? '--' : text
              }
            </div>
          )
        },
      },
      {
        title: "类型",
        dataIndex: "type",
        width: "18%",
        key: 'type',
        render: (text, item) => {
          if (item.type === 3) {
            return ""
          } else {
            return <span>{text === 1 ? "项目" : "产品"}</span>
          }
        },
      },
      {
        title: isRandom ? '最多次数' : "数量",
        dataIndex: "goodNum",
        width: "18%",
        key: 'goodNum',
        align: "left",
        render: (text, item) => {
          if(item.info*1 === 2) {
            return <span>--</span>
          }
          if (item.type === 3) {
            return <span>{text}</span>
          } else {
            return (
              <div>
                <SelectNum
                  num={text}
                  changeNum={this.changeNum}
                  maxNum={isRandom ? maxNum : 9999999}
                  item={item}
                />
              </div>
            )
          }
        },
      },
      {
        title: "单价",
        dataIndex: "goodPrice",
        key: 'goodPrice',
        width: "14%",
        align: "left",
        render: (text, item) => {
          return (
            <div>
              {
                item.info*1 === 2 ?
                <div>
                  <span style={{color: '#FF6F28', marginRight: 6}}>未设置</span>
                  <Button size='large' type="primary" 
                  onClick={() => this.setPrice(item)} 
                  disabled={item.type * 1 === 1 ? !this.state.hasProject : !this.state.hasProduct}>设置价格</Button>
                </div>
                :
                <span>{text}</span>
              }
            </div>
          )
        },
      },
      {
        title: "总价",
        dataIndex: "goodAmount",
        width: "18%",
        align: "left",
        key: 'goodAmount',
        render: (text, item) => {
          return (
            <div style={{ position: "relative" }}>
              <span>{text}</span>
              {item.type !== 3 && (
                <DeleteBtn
                  deleteItem={this.deleteItem.bind(this)}
                  item={item}
                />
              )}
            </div>
          )
        },
      },
    ]

    return (
      <div style={{position: 'relative'}}>
        <SelectProject ref="selectProject" {...projectProps} />
        <SelectProject ref="selectProduct" {...productProps} />
        {
          this.state.curItem && this.state.curItem.type*1 === 1 ? 
          <ProjectTk
          curItem={this.state.curItem}
          visible={this.state.showNew}
          onClose={this.closeTk.bind(this)}
          ></ProjectTk>
          :
          <ProductTk
          curItem={this.state.curItem}
          visible={this.state.showNew}
          onClose={this.closeTk.bind(this)}
          ></ProductTk>
        }
        <Table
          columns={columns}
          pagination={{ hideOnSinglePage: true }}
          dataSource={this.state.recordsInfo}
          footer={this.footer}
        />
        {
          isRandom &&
          <Popover 
            placement="top" 
            content={'限制单个服务可以使用的最多次数，服务最多次数需小于总次数。'}>
            <i className= {styles.question + ' iconfont icon-wenhao1' }></i>
          </Popover>
        }
        <div className={styles.oprate}>
          <Button onClick={this.Show.bind(this, 1)} size="large" style={{marginRight: '24px'}}>
            添加项目
          </Button>
          <Button onClick={this.Show.bind(this, 2)} size="large">
            添加产品
          </Button>
        </div>
      </div>
    )
  }
}

export default TableList
