import PageLayout from 'components/PageLayout/index'
import SearchMember from '../../components/search-member/index'
import SelectGiveItems from '../../components/select-give-items/index'
import SelectStaff from '../../components/select-staff/give'
import SelectCar from '../../components/select-car/index'
import ServiceLimitationLayer from 'components/ServiceLimitationLayer'
import { Button, message } from 'antd'
import services from 'services'
import { connect } from 'dva'
import styles from './index.less'
import React, { Component } from 'react'
import moment from 'moment'
import Print from '../../components/print'
let searchMemberComponent

class Index extends Component {
  constructor(props) {
    super(props)
    this.selectCard = React.createRef()
  }
  getRef(e) {
    searchMemberComponent = e
  }
  state = {
    actualMoney: 0, // 实际金额
    active: 0, // 当前选择的模块
    giveLength: 0, // 赠送数量
    loading: false,
    orderId: 0,
  };

  reset() {
    this.props.dispatch({
      type: 'numbercard/reset',
    })
    this.setState({
      actualMoney: 0, // 实际金额
      active: 0, // 当前选择的模块
      giveLength: 0,
    })
    this.refs.PageLayout.setCurrent(-1)
  }

  render() {
    const {
      dispatch,
      memberId,
      selectStaff,
      remark,
      selectCar,
      selectGiveItems,
      showAllValidit,
      member,
    } = this.props

    const { Item } = PageLayout

    const _selectStaff = selectStaff.find(_ => _.checked) || {}

    const head = (
      <div>
        <SearchMember
          getRef={e => (searchMemberComponent = e)}
          onReset={this.reset.bind(this)}
          onChange={(value, member) =>
            dispatch({ type: 'numbercard/setMemberId', payload: { value, member } })
          }
        />
      </div>
    )

    const content = [
      {
        title: '选择赠送商品',
        value: this.state.giveLength || '',
        main: (
          <Item
            title="选择赠送商品"
            rightTip={
              <Button
                size="large"
                type="primary"
                style={{ marginLeft: 2, marginTop: -21 }}
                onClick={() => {
                  dispatch({
                    type: 'numbercard/setCardAllValidity',
                    payload: true,
                  })
                }}
              >
                <i style={{ fontSize: 14, marginRight: 8 }} className="iconfont icon-piliang" />
                批量设置有效期
              </Button>
            }
          >
            <SelectGiveItems
              onChange={selected => {
                if (selected.length) {
                  const total = selected[selected.length - 1]
                  this.setState({
                    actualMoney: total.balidityPeriod, // 实际金额
                    giveLength: total.numTem, // 赠送数量
                  })
                } else {
                  this.setState({
                    actualMoney: 0, // 实际金额
                    giveLength: 0, // 赠送数量
                  })
                }

                dispatch({
                  type: 'numbercard/setSelectGiveItems',
                  payload: selected,
                })
              }}
              openSetAll={showAllValidit}
              giveItems={selectGiveItems}
              hideSetAllModal={() => {
                dispatch({
                  type: 'numbercard/setCardAllValidity',
                  payload: false,
                })
              }}
            />
          </Item>
        ),
      },
      {
        title: '绑定车辆',
        value: selectCar.map(_ => _.plateProvince + _.plateLetter + '·' + _.plateNumber).join(', '),
        main: (
          <Item title="绑定车辆">
            <SelectCar
              id={memberId}
              member={member}
              onChange={selecteds =>
                dispatch({
                  type: 'numbercard/setSelectCar',
                  payload: selecteds,
                })
              }
              selected={selectCar}
            />
          </Item>
        ),
      },
      {
        title: '赠送人员',
        value: _selectStaff.staffName || '',
        main: (
          <Item title="赠送人员">
            <SelectStaff
              onChange={selected =>
                dispatch({
                  type: 'numbercard/setSelectStaff',
                  payload: selected,
                })
              }
              selected={selectStaff}
            />
          </Item>
        ),
      },
      {
        title: '备注',
        value: remark,
        main: (
          <Item title="备注">
            <textarea
              className={styles.textarea}
              value={remark}
              id=""
              cols="30"
              rows="10"
              onChange={e => {
                dispatch({
                  type: 'numbercard/setRemark',
                  payload: e.target.value,
                })
              }}
            />
          </Item>
        ),
      },
    ]

    const bottom = (
      <div className={styles.bottom}>
        <div className="flex center">
          <div className="item">赠送金额</div>
          <span className={styles.giveMoney}>{this.state.actualMoney}</span>
        </div>
        <div className="flex center">
          <div className="item">赠送数量</div>
          <span className={styles.giveLength}>x{this.state.giveLength}</span>
        </div>
        <Button
          type="primary"
          block
          loading={this.state.loading}
          size="large"
          // 提交数据
          onClick={() => {
            if (!memberId) {
              return message.warn('请先选择客户')
            }
            if (!selectGiveItems.length) {
              return message.warn('请先选择赠送商品')
            }
            if (!_selectStaff.staffId) {
              return message.warn('请先选择赠送人员')
            }
            if (!selectCar.length) {
              return message.warn('请先选择限制车辆')
            }
            this.setState({ loading: true })
            const data = {
              clientId: memberId,
              staffId: _selectStaff.staffId,
              statusTem: 1,
              sellingPrice: this.state.actualMoney,
              totalAmount: 0,
              limit: selectCar.map(_ => _.clientCarId),
              remark,
              cardId: 0,
              cardName: moment().format('YYYY.MM.DD - ') + '赠送卡',
              commodity: selectGiveItems.slice(0, selectGiveItems.length - 1).map(_ => ({
                ..._,
                deadlineTime: _.deadlineStatus ? moment(_.deadlineTime).unix() : -1,
              })),
            }
            const hide = message.loading('办理中...')
            services.createGives({ data }).then(res => {
              this.setState({ loading: false })
              hide()
              if (res.code === '0') {
                searchMemberComponent.reset()
                message.success('办理成功')
                this.setState({ orderId: res.id })
              } else {
                message.error(res.content || '办理失败')
              }
            })
          }}
        >
          发布
        </Button>
      </div>
    )
    return (
      <div>
        <ServiceLimitationLayer>
          <PageLayout
            extra={72}
            ref="PageLayout"
            active={this.state.active}
            head={head}
            content={content}
            bottom={bottom}
          />
          <Print orderId={this.state.orderId} onReset={this.reset.bind(this)} isGive />
        </ServiceLimitationLayer>
      </div>
    )
  }
}

export default connect(
  ({
    numbercard: {
      memberId,
      member,
      selectCard,
      selectPay,
      selectStaff,
      remark,
      selectCar,
      selectCardDetail,
      selectGiveItems,
      showAllValidit,
    },
  }) => ({
    memberId,
    selectCard,
    member,
    selectPay,
    selectStaff,
    remark,
    selectCar,
    selectCardDetail,
    selectGiveItems,
    showAllValidit,
  }),
)(Index)
