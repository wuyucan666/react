import React, { PureComponent } from 'react';
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer} from 'recharts';

const style = require('./style.less')


interface listItem {
  name: string,
  value: number,
}

interface defaultProps {
  data: Array<listItem>
}

class Index extends PureComponent<defaultProps> {
  render() {
    const { data } = this.props
    return (
      <ResponsiveContainer width='100%' >
        <BarChart
          layout="vertical"
          data={data}
          margin={{ right: 45 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E6E6E6" horizontal={false} />
          <XAxis type="number" />
          <YAxis dataKey="name" type="category" width={120} />
          <Tooltip
            content={({ label, payload }) => {
              if(payload){
                return (
                  <div className={style.tooltip}>
                    <div>{label}</div>
                    <div>
                      <span>业绩</span>
                      <span>￥{payload[0] && payload[0].value}</span>
                    </div>
                  </div>
                )
              }
            }}
          />
          <Bar
            maxBarSize={40}
            fill='#4AACF7'
            dataKey="value"
            label={{ position: 'right', fill: '#666666', fontSize: '12px', offset: 3 }}
          />
        </BarChart>
      </ResponsiveContainer>
    );
  }
}

export default Index
