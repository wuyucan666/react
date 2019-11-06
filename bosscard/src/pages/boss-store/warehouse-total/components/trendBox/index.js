import { Component } from 'react'
import styles from './styles.less'
import { Modal, DatePicker } from 'antd'
import services from 'services'
import moment from 'moment'
import G2 from '@antv/g2'
const { RangePicker } = DatePicker
var chart = null
export default class productNumMoney extends Component {
  state = {
    startValue: null,
  }

  handleOk = () => {
    this.setState({
      startValue: null,
    })
    this.props.returnBtn()
  }
  textclick(data) {
    const newData = data.map(_ => ({ created: _.created, '价格': _.price }))
    chart = new G2.Chart({
      container: 'mountNodeLine',
      forceFit: true,
      height: 400,
      padding: [10, 60, 100, 40],
    })
    chart.source(newData)
    chart.scale('价格', {
      min: 0,
    })
    chart.scale('created', {
      range: [0, 1],
    })
    chart.tooltip({
      crosshairs: {
        type: 'line',
      },
    })
    chart.line().position('created*价格')
    chart.point().position('created*价格').size(4).shape('circle').style({
      stroke: '#fff',
      lineWidth: 1,
    })
    chart.render()
  }

  handleCancel = () => {
    this.setState({
      startValue: null,
    })
    this.props.returnBtn()
  }

  publicPic = (data) => {
    const newData = data.map(_ => ({ created: _.created, '价格': _.price }))
    chart.source(newData)
    chart.scale('价格', {
      min: 0,
    })
    chart.scale('created', {
      range: [0, 1],
    })
    chart.tooltip({
      crosshairs: {
        type: 'line',
      },
    })
    chart.line().position('created*价格')
    chart.point().position('created*价格').size(4).shape('circle').style({
      stroke: '#fff',
      lineWidth: 1,
    })
    chart.render()
  }

  render() {
    const { visible, name } = this.props
    return (
      <div>
        <Modal
          title="采购价格趋势"
          width='900px'
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={null}
        >
          <div className={styles.functiondiv}>
            <p>商品：{name}</p>
            <div>
              时段 <RangePicker
                allowClear={false}
                format="YYYY-MM-DD"
                value={this.state.startValue}
                onChange={this.handleChange}
              />
            </div>
          </div>
          <div className={styles.picdiv}>
            <div id="mountNodeLine"></div>
          </div>
        </Modal>
      </div>
    )
  }
}
