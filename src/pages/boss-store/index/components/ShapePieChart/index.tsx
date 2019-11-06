import React, { PureComponent } from 'react';
import {PieChart, Pie, Sector, Cell, Tooltip, Legend, ResponsiveContainer} from 'recharts';

const style = require('./style.less')

interface Item {
  /**显示的name */
  name: String,
  /**显示的值 */
  value: number,
}

interface PageProps {
  /**传入的数组 */
  data: Array<Item> ,
  /**颜色值 支持多种颜色 */
  colors: Array<string>,
  /**内圆半径 */
  innerRadius?: number,
  /**外圆半径 */
  outerRadius?: number,
  /**画布宽度 */
  canvasWidth?: number,
}


class ShapePieChart extends PureComponent<PageProps> {
  render() {
    const { data, colors , innerRadius = 76, outerRadius = 100, canvasWidth = 400 } = this.props
    const initColor = [...colors,'#66B5FF', '#41D9C7', '#2FC25B', '#6EDB8F', '#9AE65C', '#FACC14', '#E6965C', '#57AD71', '#223273', '#738AE6', '#7564CC', '#8543E0', '#A877ED', '#5C8EE6', '#13C2C2', '#70E0E0', '#5CA3E6', '#3436C7', '#8082FF', '#DD81E6', '#F04864', '#FA7D92', '#D598D9']
    return (
      <ResponsiveContainer width={canvasWidth} minHeight={344} >
        <PieChart>
          <Pie
            data={data.length ? data : [{name: '暂无数据', value: 100}]}
            cx={canvasWidth/2}
            cy={145}
            outerRadius={outerRadius}
            innerRadius={innerRadius}
            fill="#ccc"
            dataKey="value"
            blendStroke={true}
            startAngle={90}
            endAngle={-270}
          >
            {
              data.map((entry, index) => <Cell key={`cell-${index}`} fill={initColor[index]} />)
            }
          </Pie>
          {
            !!data.length && (
              <Tooltip
                content={({payload}) => {
                  const tipData = payload[0] ? payload[0]: {}
                  return (
                    <div className={style.tooltip}>
                      <span><i style={{background: tipData.payload && tipData.payload.fill}} />{tipData.name}</span>
                      <span>￥{tipData.value}</span>
                    </div>
                  )
                }}
              />
            )
          }
          {
            !!data.length && (
              <Legend verticalAlign="bottom" iconType='circle' iconSize={8} wrapperStyle={{top: 145+outerRadius+20}}/>
            )
          }
        </PieChart>
      </ResponsiveContainer>
    );
  }
}

export default ShapePieChart
