import React, { Component } from 'react';
const nzhcn = require('nzh/cn');
const styles = require('./index.less');
import * as moment from 'moment';
import { __PRODUCT_TYPE__, __PROJECT_TYPE__ } from 'utils/globalConfig';

interface Props {
  /**是否显示打印 */
  show: boolean;
  /**当前订单详情 */
  detail?: Detail;
  /**订单类型 */
  type: number;
  isGive?: boolean;
}

export interface Detail {
  order: Order;
  client: Client;
  payments: PaymentsItem[];
  store: Store;
  card: Card;
  amountReceived?: number;
  project?: any[];
  product?: any[];
  storeName?: string;
  orderId?: string;
  created?: number;
  clientName?: string;
  phone?: number;
  orderRemark?: string;
  give:any[]
}
interface Order {
  orderNo: number;
  storeTelephone: string;
  date: number;
}
interface Client {
  clientName: string;
  clientPhone: number;
}
interface PaymentsItem {
  paymentName: string;
  acceptedType: number;
  money: string;
}
interface Store {
  bank: string;
  serviceHotline: string;
  remark: string;
  bankCardNumber: string;
  sosHotLine: string;
  taxId: string;
  address: string;
  name: string;
}
interface Card {
  cardType: number;
  cardName: string;
  remark: string;
  totalAmount: string;
  gift: string;
  sales: string;
  services?: Array<any>;
  discount: string;
  sellingPrice:string;
  balance: string;
  before: string;
}

export default class PrintContent extends Component<Props> {
  render() {
    if (!this.props.detail) return ''
    const { isGive } = this.props
    /** 实收金额 */
    const officialReceipts = this.props.detail.payments
      ? (
        this.props.detail.payments
          .filter(_ => _.acceptedType)
          .reduce((total, _) => total + parseFloat(_.money) * 100, 0) / 100
      ).toFixed(2)
      : this.props.detail.amountReceived;
    /**产品列表 */
    const products =
      isGive ? this.props.detail.product || [] :
        this.props.detail.card.services
          ? this.props.detail.card.services.filter(_ => _.type === __PRODUCT_TYPE__)
          : null;
    let { card } = this.props.detail
    /**项目列表 */
    const projects =
      isGive ? this.props.detail.project || [] :
        this.props.detail.card.services
          ? this.props.detail.card.services.filter(_ => _.type === __PROJECT_TYPE__)
          : null;
    return this.props.show ? (
      <div className={styles.printContent}>
        <div className="title">{this.props.detail.storeName || this.props.detail.store.name}（结算单）</div>
        <div className="flex center">
          <div className="item">
            单号：<span>{this.props.detail.orderId || this.props.detail.order.orderNo}</span>
          </div>
          <div>
            日期：
						<span>
              {this.props.detail.created
                ? moment.unix(this.props.detail.created).format('YYYY.MM.DD')
                : moment.unix(this.props.detail.order.date).format('YYYY.MM.DD')}
            </span>
          </div>
        </div>
        <div className="table-header flex">
          <div className="item flex center left">
            <div className="label">姓名：</div>
            {this.props.detail.clientName === undefined ? this.props.detail.client.clientName : this.props.detail.clientName}
          </div>
          <div className="item flex center left">
            <div className="label">电话：</div>
            {this.props.detail.phone === undefined ? this.props.detail.client.clientPhone : this.props.detail.phone}
          </div>
          <div className="item flex center left">
            <div className="label">服务顾问：</div>/
					</div>
        </div>
        {this.props.detail.card && (
          <table className="table">
            <thead>
              <tr>
                <td>卡类型</td>
                <td>卡名称</td>
                <td>销售人员</td>
                <td>{card.before? '续卡前金额': card.cardType === 2? '金额': '充值金额'}</td>
                {(card.balance || card.cardType !== 2) && <td>{card.balance? '续卡金额': '赠送金额'}</td>}
                {card.balance && <td>赠送金额</td>}
                {card.balance && <td>续卡后金额</td>}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  {card.cardType === 2 && '计次卡'}
                  {card.cardType === 1 && '充值卡'}
                  {card.cardType === 3 && '赠送卡'}
                  {/* {this.props.type === 8 && '赠送卡'} */}
                </td>
                <td>{card.cardName}</td>
                <td>{card.sales.split(',').join('、')}</td>
                <td>{card.before? card.before: card.totalAmount}</td>
                {(card.before || card.cardType !== 2) && <td>{card.before? card.totalAmount: card.gift}</td>}
                {card.before && <td>{card.gift}</td>}
                {card.before && <td>{card.balance}</td>}
              </tr>
            </tbody>
          </table>
        )}
        {/* 产品项目 */}
        {(projects || products) && (
          <div className="service flex">
            <div className="item">
              <div className="flex title">
                <div className="item">项目</div>
                <div className="item">数量</div>
                <div className="item">有效期</div>
              </div>
              {projects.map(_ => (
                <div className="flex title">
                  <div className="item">{_.name}</div>
                  <div className="item">{_.number === -1 ? '无限' : _.number}</div>
                  <div className="item">{_.validityPeriod === -1 ? '永久' : moment.unix(_.validityPeriod).format('YYYY-MM-DD')}</div>
                </div>
              ))}
            </div>
            <div className="item">
              <div className="flex title">
                <div className="item">产品</div>
                <div className="item">数量</div>
                <div className="item">有效期</div>
              </div>
              {products.map(_ => (
                <div className="flex title">
                  <div className="item">{_.name}</div>
                  <div className="item">{_.number === -1 ? '无限' : _.number}</div>
                  <div className="item">{_.validityPeriod === -1 ? '永久' : moment.unix(_.validityPeriod).format('YYYY-MM-DD')}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="money-info flex center">
          <div>
            {/* 赠送 */}
            {this.props.detail.give && this.props.detail.give.length > 0 && <div className="give_flex">
              <p>赠送</p>
              {
                this.props.detail.give.map(_ =>{
                  return <p>【{_.type === 1? '项目': '产品'}】 {_.name}</p>
                })
              }
            </div>}
            <div className="flex center">
              {this.props.detail.payments ? (
                [
                  <div className="label">支付方式：</div>,
                  <div className="payments item">
                    {this.props.detail.payments.length > 1 &&
                      `混合支付（${this.props.detail.payments.reduce(
                        (total, _) => (total ? total + ';' : total) + _.paymentName + _.money,
                        ''
                      )}）`}
                    {this.props.detail.payments.length === 1 &&
                      `${this.props.detail.payments[0].paymentName}${
                      this.props.detail.payments[0].money
                      }`}
                  </div>
                ]
              ) : (
                  <div className="item">&nbsp;</div>
                )}
              <div className="label">实收金额：</div>
              <div className="money">{officialReceipts}</div>
            </div>
            <div className="flex center">
              <div className="item">&nbsp;</div>
              <div className="label">大写：</div>
              <div className="money max">{nzhcn.encodeB(officialReceipts)}元</div>
            </div>
          </div>
        </div>
        <div className="remark flex center">
          <div className="label">单据备注：</div>
          <div className="item">
            {isGive
              ? this.props.detail.orderRemark
              : this.props.detail.card.remark}
          </div>
        </div>
        <div className="remark flex center">
          <div className="label">门店备注：</div>
          <div className="item">
            {this.props.detail.store.remark}
          </div>
        </div>
        <div className="service-info">
          <div className="flex center">
            <div className="item flex">
              <div className="label">开户行:</div>
              {this.props.detail.store.bank}
            </div>
            <div className="item flex">
              <div className="label">服务热线：</div>
              {this.props.detail.store.serviceHotline}
            </div>
          </div>
          <div className="flex center">
            <div className="item flex">
              <div className="label">银行卡号：</div>
              {this.props.detail.store.bankCardNumber}
            </div>
            <div className="item flex">
              <div className="label">道路援救：</div>
              {this.props.detail.store.sosHotLine}
            </div>
          </div>
          <div className="flex center">
            <div className="item flex">
              <div className="label">税号：</div>
              {this.props.detail.store.taxId}
            </div>
            <div className="item flex">
              <div className="label">地址:</div>
              {this.props.detail.store.address}
            </div>
          </div>
        </div>
        <div className="signature flex">
          <div className="item flex">
            <div className="label">服务顾问</div>
            <div className="row item" />
          </div>
          <div className="item flex">
            <div className="label">收银员</div>
            <div className="row item" />
          </div>
          <div className="item flex">
            <div className="label">客户签字</div>
            <div className="row item" />
          </div>
        </div>
      </div>
    ) : null;
  }
}
