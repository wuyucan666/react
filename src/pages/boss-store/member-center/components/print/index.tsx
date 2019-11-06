import React, { Component } from 'react';
import { Modal, Button } from 'antd';
import services from 'services';
import './index.less';
import PrintContent from './print';
const styles = require('./index.less');

interface Props {
  orderId: number | string;
  /**1 计次卡 2 充值卡 7续卡*/
  type?: number;
  onReset?: () => any;
  /**是否是列表页面入口 */
  isListPage?: boolean;
  /**是否是赠送页面 */
  isGive?: boolean;
}

interface State { }

export default class Print extends Component<Props, State> {
  state = {
    show: false,
    showContent: false,
    detail: null
  };
  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    if (nextProps.orderId !== this.props.orderId) {
      if (!this.props.isListPage) {
        this.setState({ show: true });
      }
    }
    if (this.props.isListPage && nextProps.orderId) {
      this.getOrderInfo(nextProps.orderId);
    }
  }
  componentDidMount () {
    window.addEventListener('beforeprint', () => {
      console.log('正在打印...');
    });
    window.addEventListener('afterprint', () => {
      console.log('打印完成...');
      this.setState({ showContent: false });
      this.props.onReset && this.props.onReset();
    });
  }
  handleOk() {
    this.setState({ show: false });
    this.props.onReset && this.props.onReset();
  }
  print() {
    this.getOrderInfo(this.props.orderId);
  }
  getOrderInfo(id: any) {
    services
      .LIST({
        keys: {
          name:
            /*赠送打印和其他的业务打印接口不一样 */
            this.props.isGive
              ? 'wide-transaction/persent/print'
              : 'printing/operation/order/general-statement/' + id
        },
        data: {
          orderId: this.props.isGive ? id : undefined
        }
      })
      .then(res => {
        if (res) {
          this.setState(
            {
              showContent: true,
              show: false,
              detail: this.props.isGive ? res.list : res.data
            },
            () => window.print()
          );
        }
      });
  }
  render() {
    return (
      <div className={styles.wrap}>
        <Modal
          title=" "
          width={570}
          visible={this.state.show}
          maskClosable={false}
          footer={null}
          onCancel={this.handleOk.bind(this)}
        >
          <div>
            <div className={styles.icon + ' flex center'}>
              <i className="iconfont icon-xuanzhong" />
            </div>
            <div className={styles.content}>订单结算完成！</div>
            <div className={styles.btns + ' flex center'}>
              <Button size="large" onClick={this.handleOk.bind(this)}>
                好的
							</Button>
              <Button href={undefined} size="large" type="primary" onClick={this.print.bind(this)}>
                打印订单
							</Button>
            </div>
          </div>
        </Modal>
        <PrintContent isGive={this.props.isGive} show={this.state.showContent} type={this.props.type} detail={this.state.detail}/>
      </div>
    );
  }
}
