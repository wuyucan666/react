import React, { Component } from 'react';
import PageLayout from 'components/PageLayout';
import SelectCard from './components/select-card';
import SearchMember from '../../components/search-member';
import PageLayoutBottom from './components/page-layout-bottom';
import Recently from './components/recently';
import { connect } from 'dva';
import { State } from './model';
import CarStaff from './components/car-staff';
import SelectPay from '../../components/select-pay';
import services from 'services';
import { message, Button } from 'antd';
import SelectGiveItems from '../../components/select-give-items';
import moment = require('moment');
import Print from '../../components/print';
import Introduce from 'components/IntroduceModal';
import ServiceLimitationLayer from 'components/ServiceLimitationLayer';

const { Item } = PageLayout;

const style = require('./index.less');

interface Props extends State {
  dispatch: any;
  /**是否拥有结账权限 */
  hasAccountPermission: boolean;
}

export default connect(({ applyCard, app }) => ({ ...applyCard, ...app }))(
  class ApplyCard extends Component<Props> {
    searchMember = undefined;
    pagelayout = undefined;
    state = {
      remark: '',
      loading: false,
      showPayment: false,
      orderId: 0,
    };
    onSubmit() {
      const { hasAccountPermission } = this.props;
      if (!hasAccountPermission) {
        message.error('您没有结账权限，请联系管理人员设置权限!');
        return;
      }
      /**员工分成总和不等于100时，不允许提交 */
      const scale = this.props.selectStaff.reduce(
        (total, item) => (total * 10 + (parseFloat(item.scale) || 0) * 10) / 10,
        0,
      );
      if (scale !== 100) {
        return message.warning('员工分成的总和不等于100！');
      }
      /**开始提交数据 */
      this.setState({ loading: true });
      if (this.props.selectedCardType === 1 || this.props.selectedCardType === 3) {
        this.createNumberCard();
      } else if (this.props.selectedCardType === 2) {
        this.createUpCard();
      }
    }
    /**办理计次卡 和 自定义卡 */
    createNumberCard() {
      if (
        this.props.selectedCardType !== 3 &&
        this.props.selectedCard.recordsInfo.find(_ => _.unitPrice * 1 === 0 && _.key > 0)
      ) {
        this.setState({ loading: false });
        return message.warn('存在未设置价格的产品/项目');
      }
      const data = {
        clientId: this.props.memberId,
        statusTem: 1,
        staff: this.props.selectStaff
          .filter(_ => _.checked)
          .map(_ => ({
            staffId: _.staffId,
            percentage: _.scale,
          })),
        sellingPrice: this.props.price,
        totalAmount: this.props.selectedCard.amount,
        limit: this.props.selectCar.map(_ => _.clientCarId),
        remark: this.state.remark,
        payment: this.props.payments.map(_ => ({
          paymentId: _.paymentId,
          /**如果当前支付方式下有paymentMoney则是混合支付 没有则是单个支付方式 */
          paymentMoney: _.paymentMoney || this.props.price,
        })),
        cardId: this.props.selectedCardId,
        cardType: this.props.selectedCardType === 3 ? 5 : this.props.selectedCard.cardType,
        cardName: this.props.selectedCard.cardName,
        commodity: this.props.selectedCard.recordsInfo
          .slice(0, this.props.selectedCard.recordsInfo.length - 1)
          .map(_ => ({
            ..._,
            numTem: _.isInfiniteNum === 1 ? -1 : _.numTem,
            deadlineTime: _.deadlineStatus || _.deadline === 0 ? moment(_.deadlineTime).unix() : -1,
          })),
        stage: this.props.selectedCard.stage,
        give: this.props.gives
          .filter(_ => _.pId)
          .map(_ => ({
            pId: _.pId,
            pName: _.pName,
            typeTem: _.typeTem,
            numTem: _.numTem,
            balidityPeriod: _.balidityPeriod,
            deadlineTime: _.deadlineStatus ? moment(_.deadlineTime).unix() : -1,
            unitPrice: _.unitPrice,
          })),
        cardNum: this.props.selectedCard.packageCount * 1,
      };
      this.handleServiceChange(services.createNumberCard({ data }));
    }
    /**办理充值卡 */
    createUpCard() {
      const data = {
        clientId: this.props.memberId,
        statusTem: 1,
        staff: this.props.selectStaff
          .filter(_ => _.checked)
          .map(_ => ({
            staffId: _.staffId,
            percentage: _.scale,
          })),
        sellingPrice: this.props.price,
        rechargeMoney: this.props.price,
        totalAmount: this.props.selectedCard.rechargeMoney,
        giveMoney: this.props.selectedCard.giveMoney,
        limit: this.props.selectCar.map(_ => _.clientCarId),
        remark: this.state.remark,
        payment: this.props.payments.map(_ => ({
          paymentId: _.paymentId,
          /**如果当前支付方式下有paymentMoney则是混合支付 没有则是单个支付方式 */
          paymentMoney: _.paymentMoney || this.props.price,
        })),
        deadlineTime: this.props.selectedCard.deadlineStatus
          ? moment(this.props.selectedCard.deadlineTime).unix()
          : -1,
        cardId: this.props.selectedCardId,
        cardName: this.props.selectedCard.cardName,
        stage: this.props.selectedCard.stage,
        give: this.props.gives
          .filter(_ => _.pId)
          .map(_ => ({
            pId: _.pId,
            pName: _.pName,
            typeTem: _.typeTem,
            numTem: _.numTem,
            balidityPeriod: _.balidityPeriod,
            deadlineTime: _.deadlineStatus ? moment(_.deadlineTime).unix() : -1,
            unitPrice: _.unitPrice,
          })),
      };
      this.handleServiceChange(services.recharge({ data }));
    }
    /**服务promise结束时 */
    handleServiceChange(service: Promise<any>) {
      service
        .then(res => {
          this.setState({ loading: false, showPayment: false, orderId: res.id, remark: '' });
          this.pagelayout.setCurrent(-1);
          this.searchMember.reset();
        })
        .catch(() => this.setState({ loading: false }));
    }

    handleChangeMemebr(value, member) {
      this.props.dispatch({
        type: 'applyCard/setMemberId',
        payload: { value, member },
      });
      this.pagelayout.setCurrent(0)
    }

    handleChangePayments(list) {
      this.props.dispatch({
        type: 'applyCard/setPayments',
        payload: list,
      });
    }

    hanldeCustomNext = () => {
      this.pagelayout.setCurrent(1);
    };

    reset = () => this.props.dispatch({ type: 'applyCard/reset' });

    render() {
      const content = [
        {
          title: '选择卡',
          value: this.props.selectedCard.cardName || '',
          main: <SelectCard onNext={this.hanldeCustomNext} />,
        },
        {
          title: '车辆 / 分成',
          value: '',
          main: <CarStaff />,
        },
        {
          title: '赠送',
          value: !!this.props.gives.length ? this.props.gives.length - 1 : '',
          main: (
            <Item
              title="选择赠送商品"
              rightTip={
                <Button
                  size="large"
                  type="primary"
                  style={{ marginLeft: 25 }}
                  onClick={() => {
                    this.props.dispatch({
                      type: 'applyCard/setAllValidity',
                      payload: true,
                    });
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
                    const total = selected[selected.length - 1];
                    this.setState({
                      actualMoney: total.balidityPeriod, // 实际金额
                      giveLength: total.numTem, // 赠送数量
                    });
                  } else {
                    this.setState({
                      actualMoney: 0, // 实际金额
                      giveLength: 0, // 赠送数量
                    });
                  }

                  this.props.dispatch({
                    type: 'applyCard/setGives',
                    payload: selected,
                  });
                }}
                openSetAll={this.props.showAllValidit}
                giveItems={this.props.gives}
                hideSetAllModal={() => {
                  this.props.dispatch({
                    type: 'applyCard/setAllValidity',
                    payload: false,
                  });
                }}
              />
            </Item>
          ),
        },
        {
          title: '备注',
          value: this.state.remark,
          main: (
            <Item title="备注">
              <textarea
                className={style.textarea}
                value={this.state.remark}
                cols={30}
                rows={10}
                onChange={e => {
                  this.setState({ remark: e.target.value });
                }}
              />
            </Item>
          ),
        },
      ];
      const pageLayoutBottomProps = {
        loading: this.state.loading,
        onSelectPayment: () => {
          this.setState({ showPayment: true }, () => this.pagelayout.setCurrent(-1));
        },
        onSubmit: this.onSubmit.bind(this),
      };
      return (
        <div>
          <ServiceLimitationLayer>
            <PageLayout
              ref={_ => (this.pagelayout = _)}
              extra={72}
              content={content}
              active={-1}
              head={
                <SearchMember
                  getRef={ref => (this.searchMember = ref)}
                  onChange={this.handleChangeMemebr.bind(this)}
                  onReset={() => {
                    this.props.dispatch({ type: 'applyCard/reset' })
                    this.pagelayout.setCurrent(-1)
                  }}
                />
              }
              bottom={<PageLayoutBottom {...pageLayoutBottomProps} />}
              customContent={
                this.state.showPayment ? (
                  <SelectPay
                    totalMoney={this.props.price}
                    selected={this.props.payments}
                    onChange={this.handleChangePayments.bind(this)}
                  />
                ) : (
                  <Recently />
                )
              }
            />
            <Print
              orderId={this.state.orderId}
              type={this.props.selectedCardType}
              onReset={this.reset}
            />
            <Introduce
              title="如何办卡"
              content={[
                {
                  title: (
                    <div>
                      输入 <span style={{ color: '#4AACF7' }}>【客户信息-手机号/车牌号/姓名】</span>
                      ，确定登记办卡客户信息，首次开单客户通过{' '}
                      <span style={{ color: '#4AACF7' }}>【新建会员】</span>录入后再次输入即可
                    </div>
                  ),
                  content: <img src={require('../../img/tip1.png')} alt="" />,
                },
                {
                  title: (
                    <div>
                      选择办卡类目，点击<span style={{ color: '#4AACF7' }}>【选择卡】</span>
                      选择办卡类型，选中后编辑卡项内容，确定即可到下一步
                    </div>
                  ),
                  content: (
                    <div>
                      <div style={{ marginBottom: 8 }}>
                        <img src={require('../../img/tip2.png')} alt="" />
                      </div>
                      <div>
                        <img src={require('../../img/tip3.png')} alt="" />
                      </div>
                    </div>
                  ),
                },
                {
                  title: (
                    <div>
                      点击 <span style={{ color: '#4AACF7' }}>【车辆/分成】 </span>{' '}
                      选择客户绑定车辆（可新建客户绑定车辆），选择提成人员后即可到下一步操作{' '}
                      <span style={{ color: '#FF6F28' }}>注：一张卡可同时绑定多个客户车辆信息</span>
                    </div>
                  ),
                },
                {
                  title: (
                    <div>
                      可使用 <span style={{ color: '#4AACF7' }}>【赠送】 </span>{' '}
                      功能，添加相应项目或产品，并设定有效使用时间进行对客户本单赠送服务{' '}
                    </div>
                  ),
                },
                {
                  title: (
                    <div>
                      可使用 <span style={{ color: '#4AACF7' }}>【备注】 </span>{' '}
                      功能，记录本次订单具体相关情况
                    </div>
                  ),
                },
                {
                  title: (
                    <div>
                      选择 <span style={{ color: '#4AACF7' }}>【付款方式】 </span>{' '}
                      功能，选择付款方式后即可完成本次操作
                    </div>
                  ),
                },
              ]}
            />
          </ServiceLimitationLayer>
        </div>
      );
    }
  },
);
