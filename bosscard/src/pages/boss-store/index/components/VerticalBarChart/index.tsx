import React, { PureComponent } from 'react';
import {BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer} from 'recharts';

const styles = require("./style.less")


interface Item {
  /**x轴的值 */
  xName: string,
  /**y轴的值 */
  yValue: number,
}

interface PagePrpps {
  /**传入的数组 */
  data: Data,
  /**颜色值 */
  color: string,
  /**tootTip字段*/
  tootTipText: string,
}

export type Data = Array<Item>


/**
 * 垂直柱状图表
 */

export default class VerticalBarChart extends PureComponent<PagePrpps> {

  render() {
    const {data, color = '#4AACF7', tootTipText } = this.props
    return (
      <ResponsiveContainer width='100%' minHeight={400}>
        <BarChart
          data={data}
          margin={{top: 20}}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E6E6E6" horizontal={false} />
          <XAxis dataKey="xName"/>
          <YAxis />
          <Tooltip
            content={({label, payload}) => {
              return (
                <div className={styles.tooltip}>
                  <div>{label}</div>
                  <div>
                    <span>{tootTipText}</span>
                    <span>
                    {tootTipText === '营业额' && '￥'}
                      {payload[0] && payload[0].value}
                  </span>
                  </div>
                </div>
              )
            }}
          />
          <Bar
            maxBarSize={40}
            fill={color}
            dataKey="yValue"
            label={{position: 'top', fill: '#666666', fontSize: '12px', offset: 3}}
          />
        </BarChart>
      </ResponsiveContainer>
    );
  }
}
