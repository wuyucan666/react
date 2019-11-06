import React, { Component } from 'react'
import CustomCardTable from './custom-card-table'
import { Button, Alert, message } from 'antd';
import SelectProject from 'components/SelectProject'
import { __PROJECT_TYPE__, __PRODUCT_TYPE__ } from 'utils/globalConfig';
import moment = require('moment');
import { connect } from 'dva';
const styles = require('./custom-card.less')



export default connect(({ applyCard }) => applyCard)(class CustomCard extends Component<any> {
  state = {
    data: [],
    showSelectProjcet: 0
  }

  componentDidMount() {
    this.setState({
      data: this.props.selectedCard.recordsInfo || []
    })
  }

  handleTableChange = (data: any[], newTotal) => {
    if (newTotal) {
      data.pop()
      const total = this.getTotal(data)
      data.push(total)
    }
    this.setState({ data })
  }

  closeSelectProject = () => this.setState({ showSelectProjcet: 0 })

  /**将选择的item修改为可用的通用item */
  changeItem = (item) => ({
    ...item,
    key: item.projectId || item.productId,
    typeTem: item.type,
    pId: item.projectId || item.productId,
    pName: item.projectName || item.productName,
    code: item.commodityCode,
    unitPrice: item.price,
    numTem: 1,
    isInfiniteNum: 0, // 是否无限数量
    discount: 10,
    balidityPeriod: item.price,
    deadlineTime: moment().add(1, 'year'),
    deadline: 0,
  })

  /**获取合计数据 */
  getTotal = (data: any[]) => {
    let balidityPeriod = 0, numTem = 0
    data.forEach(_ => {
      balidityPeriod = (balidityPeriod * 100 + _.balidityPeriod * 100) / 100
      numTem += parseInt(_.numTem)
    })
    return {
      key: -1,
      balidityPeriod,
      numTem,
    }
  }

  concatData = (data, type) => {
    const oldData = [...this.state.data]
    const _data = [...data]
    let newData = []
    oldData.forEach(_ => {
      if (_.key > 0) {
        const hasItemIndex = _data.findIndex(item => (item.pId === _.pId && item.type === type))
        if (hasItemIndex >= 0) {
          _data.splice(hasItemIndex, 1)
          newData.push(_)
        } else if (_.type !== type) {
          newData.push(_)
        }
      }
    })
    return [..._data, ...newData]
  }

  handleSelectProject = (type) => (selected: any[]) => {
    const data = this.concatData(selected.map(_ => this.changeItem(_)), type)
    const total = this.getTotal(data)
    this.setState({ data: [...data, total], showSelectProjcet: 0 })
  }

  handleSaveNext = () => {
    if (this.state.data.length) {
      this.props.dispatch({
        type: 'applyCard/setCardDetail',
        payload: {
          cardName: moment().format('自定义卡MMDD'),
          recordsInfo: this.state.data,
          amount: this.state.data[this.state.data.length - 1].balidityPeriod
        }
      })
      this.props.onNext()
    } else {
      message.error('没有选择项目产品')
    }
  }

  render() {
    return (
      <div>
        {/* 提示 */}
        <div className={styles.tip}>自定义卡，可以用于单独销售常规卡套餐之外的服务。办卡后，顾客的账户会生成一张系统生成的自定义卡。</div>

        {/* 自定义卡 */}
        <CustomCardTable data={this.state.data} onChange={this.handleTableChange} />

        {/* 添加项目产品按钮 */}
        <div className="add-btn-group flex center" style={{ marginTop: 20 }}>
          <div className="item" style={{ marginRight: 16 }}>
            <Button
              size="large"
              type="dashed"
              block
              onClick={() => this.setState({ showSelectProjcet: __PROJECT_TYPE__ })}
            >
              添加项目
            </Button>
          </div>
          <div className="item">
            <Button
              size="large"
              type="dashed"
              block
              onClick={() => this.setState({ showSelectProjcet: __PRODUCT_TYPE__ })}
            >
              添加产品
            </Button>
          </div>
        </div>
        <Button type="primary" size="large" onClick={this.handleSaveNext} style={{ marginTop: 25 }}>确定并下一步</Button>

        {/* 添加项目产品的模态窗口 */}
        <SelectProject type={__PROJECT_TYPE__} visible={this.state.showSelectProjcet === __PROJECT_TYPE__} selected={this.state.data} onCancel={this.closeSelectProject} onOk={this.handleSelectProject(__PROJECT_TYPE__)}></SelectProject>
        <SelectProject type={__PRODUCT_TYPE__} visible={this.state.showSelectProjcet === __PRODUCT_TYPE__} selected={this.state.data} onCancel={this.closeSelectProject} onOk={this.handleSelectProject(__PRODUCT_TYPE__)}></SelectProject>
      </div>
    )
  }
}
)
