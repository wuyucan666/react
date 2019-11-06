import React, { Component } from 'react';
import { Popover } from 'antd';
import router from 'umi/router';
const styles = require('./Header.less');

const guides = [
  {
    title: '业务报表',
    pages: [
      {
        label: '业绩明细',
        path: '/boss-store/performance-report'
      },
      {
        label: '财务报表',
        path: '/boss-store/financial-statements'
      },
      {
        label: '办卡列表',
        path: '/boss-store/member-card'
      },
      {
        label: '卡消耗列表',
        path: '/boss-store/client-card-consumption-list'
      },
      {
        label: '还款列表',
        path: '/boss-store/payment-reimbursement'
      },
      {
        label: '赠送列表',
        path: '/boss-store/give-list'
      }
    ]
  },
  {
    title: '员工提成',
    pages: [
      {
        label: '提成汇总',
        path: '/boss-store/performance-summary'
      },
      {
        label: '提成明细',
        path: '/boss-store/commission-detail'
      },
      {
        label: '销售提成',
        path: '/boss-store/commission-set/sellList'
      },
      {
        label: '施工提成',
        path: '/boss-store/commission-set/constructList'
      },
      {
        label: '充值卡提成',
        path: '/boss-store/commission-set/memberList'
      },
      {
        label: '计次卡提成',
        path: '/boss-store/commission-set/countList'
      }
    ]
  },
  {
    title: '营业分析',
    pages: [
      {
        label: '业务类型分析',
        path: '/boss-store/repair-type'
      },
      {
        label: '项目/产品分析',
        path: '/boss-store/project-product-analysis'
      },
      {
        label: '会员卡分析',
        path: '/boss-store/card-statistics'
      },
      {
        label: '员工分析',
        path: '/boss-store/employee-output'
      },
      {
        label: '客户分析',
        path: '/boss-store/client-analysis'
      }
    ]
  }
];

/**数据页面引导 */
export default class DataPageGuide extends Component {
  /**跳转到对应的页面 */
  toPage = (path: string) => router.push(path);

  render() {
    /**获取页面对应的引导按钮 */
    const getPages = pages =>
      pages.map(_ => (
        <div className="label" key={_.label} onClick={() => this.toPage(_.path)}>
          {_.label}
        </div>
      ));

    /**引导列表 */
    const guide = guides.map(_ => (
      <div className="guide" key={_.title}>
        <div className="title">{_.title}</div>
        <div className="flex">{getPages(_.pages)}</div>
      </div>
    ));

    /**弹层内容 */
    const popoverContent = <div className={styles.popoverContent}>{guide}</div>;
    const loginType = localStorage.getItem('loginType');
    return (
      <Popover content={popoverContent} placement="bottomLeft" arrowPointAtCenter>
        {loginType === '3' && (
          <div className={styles.button}>
            <i className="iconfont icon-shuju3"></i>
          </div>
        )}
      </Popover>
    );
  }
}
