import React, { Component } from 'react';
import CommonTable from 'components/CommonTable';
import getTableConfig from './categoryTableConfig/tableConfig';

interface Props {
  type: number;
}
/**项目产品分类分析 */
export default class CategoryAnalysis extends Component<Props> {
  handleDataChangeBefore = (data: any[], total) => {
    return data.length
      ? [...data.map((_: any, index: number) => ({
        key: _.name + index,
        name: _.name,
        ..._.total,
        children: _.data.length
          ? _.data.map((child: any, childIndex: number) => ({
            ...child,
            key: child.name + childIndex + new Date().getTime()
          }))
          : undefined
      })), {
        ...total,
        name: '合计',
        key: '-1'
      }]
      : data;
  };
  render() {
    return (
      <div>
        <CommonTable
          name="wide-business/category/collect"
          New
          onDataChangeBefore={this.handleDataChangeBefore}
          tableConfig={getTableConfig(this.props.type)}
        />
      </div>
    );
  }
}
