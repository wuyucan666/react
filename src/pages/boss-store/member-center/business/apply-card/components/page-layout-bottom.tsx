import React, { Component } from 'react';
import { connect } from 'dva';
import { State } from '../model';
import { Button, Modal, InputNumber, message } from 'antd';
const style = require('./page-layout-bottom.less');

export interface Props extends State {
  onSelectPayment: () => any;
  dispatch: (any) => any;
  onSubmit: (any) => any;
  /**提交按钮是否处于加载状态 */
  loading: boolean;
}

export default connect(({ applyCard }) => applyCard)(
  class PageLayoutBottom extends Component<Props> {
    state = { visible: false, price: 0, discount: 10 };

    handleChangePrice() {
      this.props.dispatch({
        type: 'applyCard/setPrice',
        payload: {
          price: this.state.price,
          discount: this.state.discount
        }
      });
      this.handleCancel();
    }

    handleCancel() {
      this.setState({ visible: false });
    }
    handleSettingPrice() {
      if (this.props.selectedCardId) {
        this.setState({
          price: this.props.price,
          discount: this.props.discount,
          visible: true
        });
      } else {
        message.error('请先选择需要办理的卡项');
      }
    }
    /**修改折扣 */
    handleDiscountChange(value) {
      const discount = value || 0;
      const price = (this.props.price * 100 * (discount * 10)) / 10000;
      this.setState({ discount, price });
    }
    /**修改价格 */
    handlePriceChange(value) {
      const price = value || 0;
      const discount = parseFloat((((price * 100) / (this.props.price * 100)) * 10).toFixed(1));
      this.setState({ price, discount: discount > 10 ? 10 : discount });
    }

    render() {
      let buttonDisabled = false;
      if (
        !this.props.memberId ||
        (!this.props.selectedCardId && this.props.selectedCardType !== 3) ||
        !this.props.selectCar.length ||
        !this.props.selectStaff.filter(_ => _.checked).length ||
        !this.props.payments.length
      ) {
        buttonDisabled = true;
      }
      /**自定义卡时， 判断是否选择了项目产品 */
      if (this.props.selectedCardType === 3 && (!this.props.selectedCard.recordsInfo || !this.props.selectedCard.recordsInfo.length)) {
        buttonDisabled = true;
      }
      return (
        <div className={style.wrap}>
          <div className="flex cneter price">
            <span className="item">售价</span>
            <span className="value">￥{this.props.price.toFixed(2)}</span>
            {this.props.selectedCardType === 1 && (
              <i className="iconfont icon-xiugai1" onClick={this.handleSettingPrice.bind(this)} />
            )}
          </div>
          <div className="flex center payment" onClick={this.props.onSelectPayment}>
            <span className="label item">支付方式</span>
            <i className="icon-zuoxiangjiantou iconfont" />
          </div>
          <Button
            disabled={buttonDisabled}
            type="primary"
            size="large"
            block
            style={{ marginTop: 30 }}
            onClick={this.props.onSubmit}
            loading={this.props.loading}
          >
            发布
					</Button>
          <Modal
            title="设置优惠"
            visible={this.state.visible}
            onOk={this.handleChangePrice.bind(this)}
            onCancel={this.handleCancel.bind(this)}
            width={570}
          >
            <div className={style.modalContent}>
              <div className="original-price">原价：{this.props.price.toFixed(2)}元</div>
              <div className="flex center left set-price">
                <div>折扣：</div>
                <InputNumber
                  value={this.state.discount}
                  size="large"
                  precision={1}
                  min={0}
                  max={10}
                  onChange={this.handleDiscountChange.bind(this)}
                />
                <div>折，即价格</div>
                <InputNumber
                  value={this.state.price}
                  size="large"
                  precision={2}
                  min={0}
                  onChange={this.handlePriceChange.bind(this)}
                />
                <div>元。</div>
              </div>
            </div>
          </Modal>
        </div>
      );
    }
  }
);
