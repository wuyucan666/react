import React, { Component } from "react"
import {
  Spin,
  Table,
  InputNumber,
  Button,
  Select,
  Modal,
  DatePicker,
  message,
} from "antd"
import SelectProject from "components/SelectProject"
import { connect } from "dva"
import services from "services"
import moment from "moment"
import styles from "./index.less"
import { __PRODUCT_TYPE__, __PROJECT_TYPE__ } from "utils/globalConfig"
import SettingProductPrice from "components/setPrice/product"
import SettingProjectPrice from "components/setPrice/project"

class NumberCardDetail extends Component {
  constructor(props) {
    super(props)
    this.selectProjectComponent = React.createRef()
    this.selectProductComponent = React.createRef()
    const hasDetail = Object.keys(props.selectedCard).length > 0
    this.state = {
      detail: hasDetail ? { ...props.selectedCard } : { recordsInfo: [] },
      loading: !hasDetail,
      selectedProject: [], // 当前选择的项目
      selectedProduct: [], // 当前选择的产品
      checkType: 1, // 当前选择的是项目还是产品
      showSelectProduct: false, // 显示选择产品
      showSelectProject: false, // 显示选择项目
      units: [
        { value: 1, name: "年" },
        { value: 2, name: "月" },
        { value: 3, name: "日" },
      ],
      edit: false, // 是否是修改状态
      // 批量设置有效期的表单
      allEditForm: {
        deadlineUnit: 1, // 单位
        deadlineStatus: 1, // 是否永久
        deadlineNum: 0, // 值
      },
      editProductShow: false,
      editProjectShow: false,
      curItem: {},
      canSet: JSON.parse(window.localStorage.getItem("permissionRole")).findIndex(v => v === 51) !== -1,
      setPriceSucress: true,
    }
    if (!hasDetail) {
      this.getDetail(props.id)
    } else {
      // this.setRecordsInfo(props.selectedCard.recordsInfo)
      setTimeout(() => this.setDefaultSelected(props.selectedCard), 1000)
    }
  }
  /**
   * 获取充值卡的详情
   * @param {String|Number} id 选择的充值卡的详情
   */
  getDetail(id) {
    services
      .detail({
        keys: { name: "store/records" },
        data: { recordsId: id },
      })
      .then(res => {
        let detail = res.list

        /** 获取单位 */
        const getUnit = unitStatus =>
          unitStatus === 1 ? "year" : unitStatus === 2 ? "month" : "day"

        // 处理recordsInfo
        detail.recordsInfo = res.list.recordsInfo.map(_ => {
          return {
            ...this.getRecordsInfoItem(_),
            deadlineStatus: detail.neverValid ? 0 : 1, // 是否选了时间
            deadlineTime: moment().add(
              detail.deadlineNum,
              getUnit(detail.deadlineUnit)
            ),
          }
        })
        this.setState({
          loading: false,
          detail: { ...res.list, oldAmount: res.list.amount },
        })
        detail = this.setRecordsInfo([...res.list.recordsInfo, {}], true)

        setTimeout(() => this.setDefaultSelected(detail), 1000)

        // 把卡的详情存到redux
        this.props.dispatch({
          type: "applyCard/setCardDetail",
          payload: detail,
        })
      })
  }
  /**
   * 格式化表格内的每一条数据
   * @param {Object} _ 原始数据
   */
  getRecordsInfoItem(_) {
    return {
      ..._,
      pId: _.projectId || _.productId || _.goodId,
      key: _.projectId || _.productId || _.goodId,
      pName: _.productName || _.projectName || _.goodName,
      typeTem: _.type,
      discount: 10,
      unitPrice: parseFloat(_.goodPrice) || parseFloat(_.price) || 0,
      numTem: _.goodNum === -1 ? 1 : _.goodNum || 1,
      isInfiniteNum: _.goodNum === -1 ? 1 : 0, // 是否无限数量
      balidityPeriod: parseFloat(_.goodAmount) || parseFloat(_.price) || 0,
      deadlineStatus: 1, // 是否有效期
      deadlineUnit: 3,
      deadlineNum: 0,
    }
  }
  /**
   * 过滤掉存在的项
   * 将新增的项添加到列表s
   * @param {Array} selected 选择的列表
   * @param {Number} type 过滤类型 1 产品 2 项目
   */
  filter(selected, type) {
    // 旧的基础上去掉总计
    let newList = [
      ...this.state.detail.recordsInfo.slice(
        0,
        this.state.detail.recordsInfo.length - 1
      ),
    ]
    /**
     * 找出已删除项并删除
     */
    const findDelItem = list => {
      // const index = list.findIndex(_ => !selected.find(n => n.pId === _.pId && _.type === type))
      // list.splice(index, 1)
      list.forEach((_, index) => {
        const hasItem = selected.find(
          n => n.pId === _.pId && _.typeTem === type
        )
        if (!hasItem && type === _.typeTem) {
          newList.splice(index, 1)
          return findDelItem(newList)
        }
      })
    }
    findDelItem(newList)
    /**
     * 添加新增项
     */
    selected.forEach(item => {
      // 找出已经存在的项
      const existenceItem = this.state.detail.recordsInfo.find(
        _ => _.pId === item.pId && _.typeTem === type
      )
      if (!existenceItem) {
        newList.push(item)
      }
    })
    return newList
    // return this.detail.recordsInfo.filter(_ => selected.find(n => n.pId === _.pId))
  }
  /**
   * 写入表格数据
   * 每次写入数据，重新计算detail下面的 RecordsInfo 列表
   */
  setRecordsInfo(list, skip) {
    let reList = []
    if (skip) {
      reList = [...list.slice(0, list.length - 1)]
    } else {
      list.forEach(item => {
        const hasOld = this.state.detail.recordsInfo.find(
          _ => _.pId === item.productId || _.Pid === item.projectId
        )
        if (hasOld) {
          reList.push(hasOld)
        } else {
          reList.push(this.getRecordsInfoItem(item))
        }
      })
    }

    let total = {
      key: -1,
      pName: "总计",
      discount: "",
      unitPrice: "",
      numTem: 0,
      balidityPeriod: 0,
    }
    reList.forEach(item => {
      if (item.key > 0) {
        total.numTem =
          total.numTem + Number(item.isInfiniteNum > 0 ? 0 : item.numTem)
        total.balidityPeriod =
          total.balidityPeriod + Number(item.balidityPeriod)
      }
    })
    total.balidityPeriod = total.balidityPeriod.toFixed(2)
    this.setState({
      detail: {
        ...this.state.detail,
        recordsInfo: [...reList, total],
        totalBalidityPeriod: total.balidityPeriod,
      },
    })
    return {
      ...this.state.detail,
      recordsInfo: [...reList, total],
      totalBalidityPeriod: total.balidityPeriod,
    }
  }

  /**删除项目产品 */
  handleDeleteItem = index => () => {
    const list = [...this.state.detail.recordsInfo]
    list.splice(index, 1, { ...list[index], _delete: true })
    const detail = this.setRecordsInfo(list, true)
    this.props.dispatch({
      type: "applyCard/setCardDetail",
      payload: { ...detail, amount: detail.totalBalidityPeriod },
    })
  };

  /**
   * 写入属性
   * @param {Object} state 写入的属性
   * @param {Object} ret 行数据
   * @param {Object} index 行索引
   * @param {Boobean} setTotal 是否重新计算总计数据
   */
  setValue(state, ret, index, setTotal) {
    const recordsInfo = [...this.state.detail.recordsInfo]
    recordsInfo.splice(index, 1, {
      ...recordsInfo[index],
      ...state,
    })
    if (setTotal) {
      this.setRecordsInfo(recordsInfo, true)
    } else {
      this.setState({
        detail: {
          ...this.state.detail,
          recordsInfo,
        },
      })
    }
  }

  /**
   * 关闭当前的批量设置模态窗口
   */
  handleModalCancel() {
    this.props.dispatch({
      type: "applyCard/setAllValidity",
      payload: false,
    })
  }

  /**
   * 批量设置有效期
   */
  handleSetAllValidity() {
    this.setState({
      detail: {
        ...this.state.detail,
        recordsInfo: this.state.detail.recordsInfo.map(_ => {
          if (_.key > 0) {
            return {
              ..._,
              ...this.state.allEditForm,
            }
          } else {
            return _
          }
        }),
      },
    })
    this.props.dispatch({
      type: "applyCard/setAllValidity",
      payload: false,
    })
  }

  /**
   * 设置默认选择的产品和项目
   * @param {Object} detail 卡的详情
   */
  setDefaultSelected(detail) {
    // 筛选出对应的产品和项目
    const selectedProject = detail.recordsInfo
      .filter(_ => _.typeTem === __PROJECT_TYPE__)
      .map(_ => ({
        ..._,
        projectId: _.pId,
        projectName: _.pName,
      }))
    const selectedProduct = detail.recordsInfo
      .filter(_ => _.typeTem === __PRODUCT_TYPE__)
      .map(_ => ({
        ..._,
        productId: _.pId,
        productName: _.pName,
      }))

    this.setState({
      selectedProject,
      selectedProduct,
    })

    // // 设置默认选中的项目和产品
    // if (
    //   this.selectProductComponent.current &&
    //   this.selectProductComponent.current.wrappedInstance &&
    //   this.selectProjectComponent.current &&
    //   this.selectProjectComponent.current.wrappedInstance
    // ) {
    //   this.selectProductComponent.current.wrappedInstance.resetSelected(
    //     selectedProduct
    //   )
    //   this.selectProjectComponent.current.wrappedInstance.resetSelected(
    //     selectedProject
    //   )
    // } else {
    //   setTimeout(() => this.setDefaultSelected(detail), 1000)
    // }
  }
  reset() {
    this.props.dispatch({
      type: "applyCard/setCardDetail",
      payload: {},
    })
    this.props.dispatch({
      type: "applyCard/setCardId",
      payload: 0,
    })
  }

  handleShowSettingPrice = (item) => this.setState({ [item.type === __PRODUCT_TYPE__ ? 'editProductShow' : 'editProjectShow']: true, curItem: item })

  handleHideModal = (type, item) => {
    if (type) {
      const index = this.state.detail.recordsInfo.findIndex(_ => item.pId === _.pId && item.typeTem === _.typeTem)
      this.setValue({
        unitPrice: item.price, balidityPeriod: (
          (parseFloat(item.price) *
            100 *
            (item.discount * 10) *
            Number(item.numTem)) /
          10000
        ).toFixed(2),
      }, {}, index, true)
      this.setState({ setPriceSucress: false }, () => this.setState({ setPriceSucress: true }))
    }
    this.setState({ editProductShow: false, editProjectShow: false })
  }

  packageCountChange = (val) => {
    const { detail } = this.state
    let canSet = true
    detail.recordsInfo.filter(_ => _.key !== -1).forEach(item => {
      if(item.numTem >= val && !item.isInfiniteNum) {
        canSet = false
      }
    })
    if(!canSet) {
      message.warn('单个服务最多次数需小于卡总次数')
    }else {
      this.setState({detail: {...detail, packageCount: val}})
    }
  }

  render() {

    const { Option } = Select
    const columns = [
      {
        title: "名称",
        dataIndex: "pName",
        key: 0,
      },
      {
        title: "编码",
        dataIndex: "commodityCode",
        key: 1,
      },
      {
        title: "单价",
        dataIndex: "unitPrice",
        key: 2,
        render: (value, ret) => (this.state.edit && ret.key > 0) ? value ? parseFloat(value).toFixed(2) : <Button type="primary" onClick={() => this.handleShowSettingPrice(ret)} disabled={!this.state.canSet}>设置价格</Button> : value ? parseFloat(value).toFixed(2) : '',
      },
      {
        title: "数量",
        dataIndex: "numTem",
        key: 3,
        render: (value, ret, index) =>
          this.state.edit && ret.key > 0 ? (
            <div className="flex">
              <Select

                defaultValue={ret.isInfiniteNum}
                onChange={value => {
                  const { packageCount, cardType } = this.state.detail
                  if(cardType === 4 && ret.numTem >= packageCount) {
                    ret.numTem = packageCount - 1
                  }
                  this.setValue(
                    {
                      isInfiniteNum: value,
                      balidityPeriod: ret.unitPrice,
                      numTem: ret.numTem,
                    },

                    ret,
                    index,
                    true
                  )
                }}
              >
                <Option value={1}>无限</Option>
                <Option value={0}>有限</Option>
              </Select>
              {!ret.isInfiniteNum && ret.key > 0 && (
                <InputNumber

                  min={1}
                  value={value}
                  onChange={value => {
                    const { packageCount, cardType } = this.state.detail
                    if(cardType === 4 && value >= packageCount) {
                      message.warn('单个服务最多次数需小于卡总次数')
                      return 
                    }
                    const num = value || 1
                    this.setValue(
                      {
                        numTem: num,
                        balidityPeriod:
                          (Number(ret.unitPrice) *
                            (Number(ret.discount) * 10) *
                            num) /
                          100,
                      },
                      ret,
                      index,
                      true
                    )
                  }}
                />
              )}
            </div>
          ) : ret.isInfiniteNum ? (
            "无限"
          ) : (
                value
              ),
      },
      {
        title: "折扣",
        dataIndex: "discount",
        key: 4,
        render: (value, ret, index) =>
          this.state.edit && ret.key > 0 ? (
            <InputNumber

              disabled={ret.unitPrice === 0 || !!ret.isInfiniteNum}
              value={value}
              min={0}
              max={10}
              precision={1}
              onChange={value => {
                const discount = value ? value : 0
                this.setValue(
                  {
                    discount,
                    balidityPeriod: (
                      (parseFloat(ret.unitPrice) *
                        100 *
                        (discount * 10) *
                        Number(ret.numTem)) /
                      10000
                    ).toFixed(2),
                  },
                  ret,
                  index,
                  true
                )
              }}
            />
          ) : (
              value
            ),
      },
      {
        title: "金额",
        dataIndex: "balidityPeriod",
        key: 5,
        render: (value, ret, index) =>
          this.state.edit && ret.key > 0 ? (
            <InputNumber

              disabled={!!ret.isInfiniteNum}
              value={value}
              min={0}
              precision={2}
              onChange={value => {
                const balidityPeriod = value ? value : 0
                this.setValue(
                  {
                    balidityPeriod,
                    discount:
                      ((balidityPeriod * 100) /
                        (parseFloat(ret.unitPrice) * 100 * Number(ret.numTem)) * 10).toFixed(1),
                  },
                  ret,
                  index,
                  true
                )
              }}
            />
          ) : (
              value
            ),
      },
      {
        title: "有效期",
        dataIndex: "deadlineTime",
        key: 6,
        render: (value, ret, index) =>
          this.state.edit && ret.key > 0 ? (
            <div className="date-select flex">
              <Select

                defaultValue={ret.deadlineStatus}
                onChange={value =>
                  this.setValue({ deadlineStatus: value }, ret, index, false)
                }
              >
                <Option key={1} value={1}>
                  有限期
                </Option>
                <Option key={0} value={0}>
                  无限期
                </Option>
              </Select>
              <DatePicker

                style={{ width: 150 }}
                disabled={!ret.deadlineStatus}
                value={value}
                onChange={value =>
                  this.setValue({ deadlineTime: value }, ret, index, false)
                }
              />
            </div>
          ) : ret.key < 0 ? (
            ""
          ) : ret.deadlineStatus === 0 ? (
            "永久"
          ) : (
                  moment(value).format("YYYY-MM-DD")
                ),
      },
      {
        title: "操作",
        dataIndex: "操作",
        render: (value, ret, index) =>
          ret.pId && (
            <i
              style={{ cursor: "pointer" }}
              className="iconfont icon-shanchu"
              onClick={this.handleDeleteItem(index)}
            />
          ),
      },
    ]
    return (
      <Spin wrapperClassName={styles.detail} spinning={this.state.loading}>
        <div className="head flex center">
          <h3 className="item">选择计次卡</h3>
          <span onClick={this.reset.bind(this)}>
            <i className="iconfont icon-fanhui" />
            重新选择
          </span>
        </div>
        {
          this.state.detail.cardType === 4 &&
          (this.state.edit 
          ?
          <div className={styles.package}>
            <span>卡总次数 </span>
            <div>
              <InputNumber 
              min={1} 
              size='large' 
              style={{width: 120}} 
              value={this.state.detail.packageCount}
              onChange={this.packageCountChange}
              ></InputNumber>
              <span>次</span>
            </div>
          </div>
          :
          <div style={{marginBottom: 30}}>卡总次数: {this.state.detail.packageCount*1}次</div>)
        }
        {!this.state.loading && (
          <div>
            <Table
              columns={columns}
              pagination={{ hideOnSinglePage: true, defaultPageSize: 50 }}
              dataSource={this.state.detail.recordsInfo}
            />
            {this.state.edit && (
              <div className="add-btn-group flex center">
                <div className="item">
                  <Button
                    size="large"
                    type="dashed"
                    block
                    onClick={() => this.setState({ showSelectProject: true })}
                  >
                    添加项目
                  </Button>
                </div>
                <div className="item">
                  <Button
                    size="large"
                    type="dashed"
                    block
                    onClick={() => this.setState({ showSelectProduct: true })}
                  >
                    添加产品
                  </Button>
                </div>
              </div>
            )}
            <div className="btn-group">
              {!this.state.edit && (
                <Button
                  size="large"
                  type="primary"
                  onClick={() => this.setState({ edit: true })}
                >
                  编辑
                </Button>
              )}
              {this.state.edit && (
                <div>
                  <Button
                    size="large"
                    type="primary"
                    onClick={() => {
                      this.setState({ edit: false })
                      const total = this.state.detail.recordsInfo.find(_ => _.key === -1) || {}
                      this.props.dispatch({
                        type: "applyCard/setCardDetail",
                        payload: {
                          ...this.state.detail,
                          amount: total.balidityPeriod || 0,
                        },
                      })
                    }}
                  >
                    完成
                  </Button>
                  <Button
                    size="large"
                    onClick={() => {
                      this.setState({
                        edit: false,
                        detail: { ...this.props.selectedCard },
                        canSetDate: this.props.selectedCard.deadlineStatus,
                      })
                    }}
                  >
                    取消
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
        {/* 选择产品 */}
        {this.state.setPriceSucress && <SelectProject
          selected={this.state.detail.recordsInfo}
          visible={this.state.showSelectProduct}
          onOk={selected => {
            const selectedProduct = selected.map(_ =>
              this.getRecordsInfoItem({ ..._, type: __PRODUCT_TYPE__ })
            )
            const recordsInfo = this.filter(selectedProduct, __PRODUCT_TYPE__)
            this.setState({
              selectedProduct,
              detail: {
                ...this.state.detail,
                recordsInfo: [
                  ...recordsInfo,
                  {
                    key: -1,
                    pName: "总计",
                    discount: "",
                    unitPrice: "",
                    numTem: recordsInfo.reduce(
                      (total, _) =>
                        (_.isInfiniteNum > 0 ? 0 : _.numTem) + total,
                      0
                    ),
                    balidityPeriod: recordsInfo
                      .reduce((total, _) => Number(_.balidityPeriod) + total, 0)
                      .toFixed(2),
                  },
                ],
              },
            })
          }}
          onCancel={() => this.setState({ showSelectProduct: false })}
          type={__PRODUCT_TYPE__}
        />}
        {/* 选择项目 */}
        {this.state.setPriceSucress && <SelectProject
          selected={this.state.detail.recordsInfo}
          visible={this.state.showSelectProject}
          onOk={selected => {
            const selectProject = selected.map(_ =>
              this.getRecordsInfoItem({ ..._, type: __PROJECT_TYPE__ })
            )
            const recordsInfo = this.filter(selectProject, __PROJECT_TYPE__)
            this.setState({
              selectProject,
              detail: {
                ...this.state.detail,
                recordsInfo: [
                  ...recordsInfo,
                  {
                    key: -1,
                    pName: "总计",
                    discount: "",
                    unitPrice: "",
                    numTem: recordsInfo.reduce(
                      (total, _) =>
                        (_.isInfiniteNum > 0 ? 0 : _.numTem) + total,
                      0
                    ),
                    balidityPeriod: recordsInfo
                      .reduce((total, _) => Number(_.balidityPeriod) + total, 0)
                      .toFixed(2),
                  },
                ],
              },
            })
          }}
          onCancel={() => this.setState({ showSelectProject: false })}
          type={__PROJECT_TYPE__}
        />}
        {/*
        ***
        ***
        ***
        ***
         批量设置
        ***
        */}
        <Modal
          title="批量设置"
          visible={this.props.showAllValidit}
          okButtonProps={{ size: "large" }}
          cancelButtonProps={{ size: "large" }}
          onCancel={this.handleModalCancel.bind(this)}
          onOk={this.handleSetAllValidity.bind(this)}
          width={570}
        >
          <div className={styles.modalContent}>
            <Select
              defaultValue={this.state.allEditForm.deadlineStatus}
              onChange={value =>
                this.setState({
                  allEditForm: {
                    ...this.state.allEditForm,
                    deadlineStatus: value,
                  },
                })
              }

            >
              <Option key={0} value={0}>
                有限期
              </Option>
              <Option key={1} value={1}>
                无限期
              </Option>
            </Select>
            <InputNumber
              style={{ width: 152 }}
              disabled={this.state.allEditForm.deadlineStatus === 1}

              type="text"
              max={this.state.allEditForm.deadlineUnit === 1 ? 20 : undefined}
              min={1}
              value={this.state.allEditForm.deadlineNum}
              onChange={num => {
                this.setState({
                  allEditForm: {
                    ...this.state.allEditForm,
                    deadlineNum: num,
                  },
                })
              }}
            />
            <Select
              defaultValue={this.state.allEditForm.deadlineUnit}
              disabled={this.state.allEditForm.deadlineStatus === 1}
              onChange={value =>
                this.setState({
                  allEditForm: {
                    ...this.state.allEditForm,
                    deadlineUnit: value,
                  },
                })
              }

            >
              {this.state.units.map((_, index) => (
                <Option key={index} value={_.value}>
                  {_.name}
                </Option>
              ))}
            </Select>
          </div>
        </Modal>
        <SettingProductPrice curItem={this.state.curItem} onClose={this.handleHideModal} visible={this.state.editProductShow}></SettingProductPrice>
        <SettingProjectPrice curItem={this.state.curItem} onClose={this.handleHideModal} visible={this.state.editProjectShow}></SettingProjectPrice>
      </Spin>
    )
  }
}

export default connect(({ applyCard: { selectedCard, showAllValidit } }) => ({
  selectedCard: selectedCard,
  showAllValidit: showAllValidit,
}))(NumberCardDetail)
